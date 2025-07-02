<?php
// Отключаем вывод ошибок в браузер (записываем в лог)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Убеждаемся что нет вывода перед заголовками
ob_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

// Обработка preflight запросов
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $conn = getDBConnection();
    $method = $_SERVER['REQUEST_METHOD'];
    $raw_input = file_get_contents('php://input');
    $input = json_decode($raw_input, true);

    // Логируем только для DELETE операций
    if ($method === 'DELETE') {
        error_log("DELETE request - Raw input: $raw_input, Decoded: " . json_encode($input));
    }

    switch ($method) {
        case 'GET':
            handleGet($conn);
            break;
        case 'POST':
            handlePost($conn, $input);
            break;
        case 'PUT':
            handlePut($conn, $input);
            break;
        case 'DELETE':
            handleDelete($conn, $input);
            break;
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'file' => basename(__FILE__),
        'line' => $e->getLine()
    ]);
}

function handleGet($conn) {
    $action = $_GET['action'] ?? 'list';

    switch ($action) {
        case 'list':
            // Получить все столики
            $stmt = $conn->prepare("
                SELECT t.*,
                       COUNT(s.id) as active_sessions
                FROM tables t
                LEFT JOIN sessions s ON t.id = s.table_id
                    AND s.is_active = 1
                    AND s.expires_at > NOW()
                GROUP BY t.id
                ORDER BY t.table_number ASC
            ");
            $stmt->execute();
            $tables = $stmt->fetchAll();

            echo json_encode([
                'success' => true,
                'data' => $tables
            ]);
            break;

        case 'generate_links':
            // Генерация ссылок для указанного количества столиков
            $count = (int)($_GET['count'] ?? 0);
            if ($count <= 0 || $count > 100) {
                throw new Exception('Invalid table count. Must be between 1 and 100.');
            }

            $base_url = $_GET['base_url'] ?? 'https://callianolounge.eu';
            $links = [];

            for ($i = 1; $i <= $count; $i++) {
                $qr_link = $base_url . '/scan-qr.php?table=' . $i;

                // Проверяем, существует ли уже столик
                $check_stmt = $conn->prepare("SELECT id FROM tables WHERE table_number = ?");
                $check_stmt->execute([$i]);
                $existing = $check_stmt->fetch();

                if (!$existing) {
                    // Создаем новый столик
                    $insert_stmt = $conn->prepare("INSERT INTO tables (table_number, qr_link) VALUES (?, ?)");
                    $insert_stmt->execute([$i, $qr_link]);
                }

                $links[] = [
                    'table_number' => $i,
                    'qr_link' => $qr_link
                ];
            }

            echo json_encode([
                'success' => true,
                'data' => $links,
                'message' => "Generated links for $count tables"
            ]);
            break;

        default:
            throw new Exception('Unknown action');
    }
}

function handlePost($conn, $input) {
    $action = $input['action'] ?? '';

    switch ($action) {
        case 'create':
            // Создать новый столик
            $table_number = (int)($input['table_number'] ?? 0);
            $base_url = $input['base_url'] ?? 'https://callianolounge.eu';

            if ($table_number <= 0) {
                throw new Exception('Invalid table number');
            }

            $qr_link = $base_url . '/scan-qr.php?table=' . $table_number;

            $stmt = $conn->prepare("INSERT INTO tables (table_number, qr_link) VALUES (?, ?)");
            $stmt->execute([$table_number, $qr_link]);

            echo json_encode([
                'success' => true,
                'data' => [
                    'id' => $conn->lastInsertId(),
                    'table_number' => $table_number,
                    'qr_link' => $qr_link
                ],
                'message' => 'Table created successfully'
            ]);
            break;

        case 'bulk_create':
            // Массовое создание столиков
            $start = (int)($input['start'] ?? 1);
            $end = (int)($input['end'] ?? 1);
            $base_url = $input['base_url'] ?? 'https://callianolounge.eu';

            if ($start > $end || $end - $start > 100) {
                throw new Exception('Invalid range or too many tables');
            }

            $created = [];
            $conn->beginTransaction();

            try {
                for ($i = $start; $i <= $end; $i++) {
                    $qr_link = $base_url . '/scan-qr.php?table=' . $i;

                    // Проверяем, не существует ли уже
                    $stmt = $conn->prepare("SELECT id FROM tables WHERE table_number = ?");
                    $stmt->execute([$i]);

                    if (!$stmt->fetch()) {
                        $stmt = $conn->prepare("INSERT INTO tables (table_number, qr_link) VALUES (?, ?)");
                        $stmt->execute([$i, $qr_link]);

                        $created[] = [
                            'table_number' => $i,
                            'qr_link' => $qr_link
                        ];
                    }
                }

                $conn->commit();

                echo json_encode([
                    'success' => true,
                    'data' => $created,
                    'message' => 'Created ' . count($created) . ' tables'
                ]);
            } catch (Exception $e) {
                $conn->rollback();
                throw $e;
            }
            break;

        case 'delete_single':
            // Удалить один столик (через POST)
            $table_id = (int)($input['table_id'] ?? 0);

            if ($table_id <= 0) {
                throw new Exception('Invalid table ID: ' . $table_id);
            }

            // Проверяем, существует ли столик перед удалением
            $check_stmt = $conn->prepare("SELECT id FROM tables WHERE id = ?");
            $check_stmt->execute([$table_id]);
            if (!$check_stmt->fetch()) {
                throw new Exception('Table not found with ID: ' . $table_id);
            }

            $stmt = $conn->prepare("DELETE FROM tables WHERE id = ?");
            $result = $stmt->execute([$table_id]);

            if (!$result) {
                throw new Exception('Failed to delete table');
            }

            echo json_encode([
                'success' => true,
                'message' => 'Table deleted successfully',
                'deleted_id' => $table_id
            ]);
            break;

        case 'delete_all':
            // Удалить все столики (через POST)
            $stmt = $conn->prepare("DELETE FROM tables");
            $result = $stmt->execute();

            if (!$result) {
                throw new Exception('Failed to delete all tables');
            }

            $deleted_count = $stmt->rowCount();

            echo json_encode([
                'success' => true,
                'message' => "All tables deleted ($deleted_count tables)"
            ]);
            break;

        default:
            throw new Exception('Unknown action');
    }
}

function handlePut($conn, $input) {
    $action = $input['action'] ?? '';

    switch ($action) {
        case 'toggle_status':
            // Переключить статус столика
            $table_id = (int)($input['table_id'] ?? 0);

            if ($table_id <= 0) {
                throw new Exception('Invalid table ID');
            }

            $stmt = $conn->prepare("UPDATE tables SET is_active = NOT is_active WHERE id = ?");
            $stmt->execute([$table_id]);

            // Получаем обновленную информацию
            $stmt = $conn->prepare("SELECT * FROM tables WHERE id = ?");
            $stmt->execute([$table_id]);
            $table = $stmt->fetch();

            echo json_encode([
                'success' => true,
                'data' => $table,
                'message' => 'Table status updated'
            ]);
            break;

        case 'update_link':
            // Обновить ссылку столика
            $table_id = (int)($input['table_id'] ?? 0);
            $base_url = $input['base_url'] ?? 'https://callianolounge.eu';

            if ($table_id <= 0) {
                throw new Exception('Invalid table ID');
            }

            // Получаем номер столика
            $stmt = $conn->prepare("SELECT table_number FROM tables WHERE id = ?");
            $stmt->execute([$table_id]);
            $table = $stmt->fetch();

            if (!$table) {
                throw new Exception('Table not found');
            }

            $new_link = $base_url . '/scan-qr.php?table=' . $table['table_number'];

            $stmt = $conn->prepare("UPDATE tables SET qr_link = ? WHERE id = ?");
            $stmt->execute([$new_link, $table_id]);

            echo json_encode([
                'success' => true,
                'data' => ['qr_link' => $new_link],
                'message' => 'Table link updated'
            ]);
            break;

        default:
            throw new Exception('Unknown action');
    }
}

function handleDelete($conn, $input) {
    // Логируем полученные данные для отладки
    error_log("DELETE request input: " . json_encode($input));

    if ($input === null) {
        throw new Exception('No input data received');
    }

    $action = $input['action'] ?? '';

    switch ($action) {
        case 'single':
            // Удалить один столик
            $table_id = (int)($input['table_id'] ?? 0);

            if ($table_id <= 0) {
                throw new Exception('Invalid table ID: ' . $table_id);
            }

            // Проверяем, существует ли столик перед удалением
            $check_stmt = $conn->prepare("SELECT id FROM tables WHERE id = ?");
            $check_stmt->execute([$table_id]);
            if (!$check_stmt->fetch()) {
                throw new Exception('Table not found with ID: ' . $table_id);
            }

            $stmt = $conn->prepare("DELETE FROM tables WHERE id = ?");
            $result = $stmt->execute([$table_id]);

            if (!$result) {
                throw new Exception('Failed to delete table');
            }

            echo json_encode([
                'success' => true,
                'message' => 'Table deleted successfully',
                'deleted_id' => $table_id
            ]);
            break;

        case 'bulk':
            // Массовое удаление
            $table_ids = $input['table_ids'] ?? [];

            if (empty($table_ids) || !is_array($table_ids)) {
                throw new Exception('No tables selected for deletion');
            }

            $placeholders = str_repeat('?,', count($table_ids) - 1) . '?';
            $stmt = $conn->prepare("DELETE FROM tables WHERE id IN ($placeholders)");
            $stmt->execute($table_ids);

            echo json_encode([
                'success' => true,
                'message' => 'Deleted ' . $stmt->rowCount() . ' tables'
            ]);
            break;

        case 'all':
            // Удалить все столики
            $stmt = $conn->prepare("DELETE FROM tables");
            $result = $stmt->execute();

            if (!$result) {
                throw new Exception('Failed to delete all tables');
            }

            $deleted_count = $stmt->rowCount();

            echo json_encode([
                'success' => true,
                'message' => "All tables deleted ($deleted_count tables)"
            ]);
            break;

        default:
            throw new Exception('Unknown action');
    }
}
?>
