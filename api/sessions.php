<?php
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
    $input = json_decode(file_get_contents('php://input'), true);

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
    echo json_encode(['error' => $e->getMessage()]);
}

function handleGet($conn) {
    $action = $_GET['action'] ?? 'validate';

    switch ($action) {
        case 'validate':
            // Проверить валидность сессии
            $session_id = $_GET['session_id'] ?? '';
            $table_number = (int)($_GET['table'] ?? 0);

            if (empty($session_id) || $table_number <= 0) {
                echo json_encode([
                    'success' => false,
                    'valid' => false,
                    'message' => 'Invalid parameters'
                ]);
                return;
            }

            $stmt = $conn->prepare("
                SELECT s.*, t.table_number, t.is_active as table_active
                FROM sessions s
                INNER JOIN tables t ON s.table_id = t.id
                WHERE s.session_id = ?
                AND t.table_number = ?
                AND s.is_active = 1
                AND s.expires_at > NOW()
            ");
            $stmt->execute([$session_id, $table_number]);
            $session = $stmt->fetch();

            if ($session) {
                echo json_encode([
                    'success' => true,
                    'valid' => true,
                    'data' => $session,
                    'message' => 'Session is valid'
                ]);
            } else {
                echo json_encode([
                    'success' => true,
                    'valid' => false,
                    'message' => 'Session expired or invalid'
                ]);
            }
            break;

        case 'active':
            // Получить все активные сессии
            $stmt = $conn->prepare("
                SELECT s.*, t.table_number
                FROM sessions s
                INNER JOIN tables t ON s.table_id = t.id
                WHERE s.is_active = 1
                AND s.expires_at > NOW()
                ORDER BY s.created_at DESC
            ");
            $stmt->execute();
            $sessions = $stmt->fetchAll();

            echo json_encode([
                'success' => true,
                'data' => $sessions
            ]);
            break;

        case 'cleanup':
            // Очистить истекшие сессии
            $stmt = $conn->prepare("
                UPDATE sessions
                SET is_active = 0
                WHERE expires_at <= NOW()
                AND is_active = 1
            ");
            $stmt->execute();
            $cleaned = $stmt->rowCount();

            echo json_encode([
                'success' => true,
                'cleaned_sessions' => $cleaned,
                'message' => "Cleaned $cleaned expired sessions"
            ]);
            break;

        default:
            throw new Exception('Unknown action');
    }
}

function handlePost($conn, $input) {
    $action = $input['action'] ?? 'create';

    switch ($action) {
        case 'create':
            // Создать новую сессию
            $table_number = (int)($input['table_number'] ?? 0);

            if ($table_number <= 0) {
                throw new Exception('Invalid table number');
            }

            // Проверяем, существует ли столик и активен ли он
            $stmt = $conn->prepare("SELECT id, is_active FROM tables WHERE table_number = ?");
            $stmt->execute([$table_number]);
            $table = $stmt->fetch();

            if (!$table) {
                throw new Exception('Table not found');
            }

            if (!$table['is_active']) {
                throw new Exception('Table is not active');
            }

            // Деактивируем предыдущие сессии для этого столика
            $stmt = $conn->prepare("UPDATE sessions SET is_active = 0 WHERE table_id = ? AND is_active = 1");
            $stmt->execute([$table['id']]);

            // Генерируем уникальный ID сессии
            $session_id = generateSessionId();

            // Получаем длительность сессии из настроек (по умолчанию 2 часа)
            $stmt = $conn->prepare("SELECT setting_value FROM settings WHERE setting_key = 'session_duration_hours'");
            $stmt->execute();
            $duration = $stmt->fetchColumn() ?: 2;

            $expires_at = date('Y-m-d H:i:s', strtotime("+{$duration} hours"));

            // Создаем новую сессию
            $stmt = $conn->prepare("
                INSERT INTO sessions (session_id, table_id, expires_at, is_active)
                VALUES (?, ?, ?, 1)
            ");
            $stmt->execute([$session_id, $table['id'], $expires_at]);

            echo json_encode([
                'success' => true,
                'data' => [
                    'session_id' => $session_id,
                    'table_number' => $table_number,
                    'expires_at' => $expires_at
                ],
                'message' => 'Session created successfully'
            ]);
            break;

        default:
            throw new Exception('Unknown action');
    }
}

function handlePut($conn, $input) {
    $action = $input['action'] ?? '';

    switch ($action) {
        case 'extend':
            // Продлить сессию
            $session_id = $input['session_id'] ?? '';
            $hours = (int)($input['hours'] ?? 2);

            if (empty($session_id)) {
                throw new Exception('Session ID is required');
            }

            $new_expires_at = date('Y-m-d H:i:s', strtotime("+{$hours} hours"));

            $stmt = $conn->prepare("
                UPDATE sessions
                SET expires_at = ?
                WHERE session_id = ?
                AND is_active = 1
            ");
            $stmt->execute([$new_expires_at, $session_id]);

            if ($stmt->rowCount() > 0) {
                echo json_encode([
                    'success' => true,
                    'data' => ['expires_at' => $new_expires_at],
                    'message' => 'Session extended successfully'
                ]);
            } else {
                throw new Exception('Session not found or already expired');
            }
            break;

        default:
            throw new Exception('Unknown action');
    }
}

function handleDelete($conn, $input) {
    $action = $input['action'] ?? 'terminate';

    switch ($action) {
        case 'terminate':
            // Завершить сессию
            $session_id = $input['session_id'] ?? '';

            if (empty($session_id)) {
                throw new Exception('Session ID is required');
            }

            $stmt = $conn->prepare("UPDATE sessions SET is_active = 0 WHERE session_id = ?");
            $stmt->execute([$session_id]);

            echo json_encode([
                'success' => true,
                'message' => 'Session terminated successfully'
            ]);
            break;

        case 'cleanup_all':
            // Принудительно очистить все сессии
            $stmt = $conn->prepare("UPDATE sessions SET is_active = 0 WHERE is_active = 1");
            $stmt->execute();
            $terminated = $stmt->rowCount();

            echo json_encode([
                'success' => true,
                'terminated_sessions' => $terminated,
                'message' => "Terminated $terminated sessions"
            ]);
            break;

        default:
            throw new Exception('Unknown action');
    }
}

function generateSessionId() {
    // Генерируем уникальный ID сессии
    return bin2hex(random_bytes(16)) . '_' . time();
}

// Функция для автоматической очистки (можно вызывать через cron)
function autoCleanup() {
    try {
        $conn = getDBConnection();
        $stmt = $conn->prepare("UPDATE sessions SET is_active = 0 WHERE expires_at <= NOW() AND is_active = 1");
        $stmt->execute();
        return $stmt->rowCount();
    } catch (Exception $e) {
        error_log("Auto cleanup error: " . $e->getMessage());
        return 0;
    }
}

// Если вызывается напрямую для очистки
if (isset($_GET['auto_cleanup']) && $_GET['auto_cleanup'] === 'true') {
    $cleaned = autoCleanup();
    echo json_encode([
        'success' => true,
        'cleaned_sessions' => $cleaned,
        'message' => "Auto cleanup completed. Cleaned $cleaned sessions."
    ]);
    exit;
}
?>
