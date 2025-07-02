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
            // Получить все уведомления
            $limit = (int)($_GET['limit'] ?? 50);
            $offset = (int)($_GET['offset'] ?? 0);
            $type_filter = $_GET['type'] ?? '';
            $unread_only = isset($_GET['unread_only']) && $_GET['unread_only'] === 'true';

            $where_conditions = [];
            $params = [];

            if (!empty($type_filter)) {
                $where_conditions[] = "n.type = ?";
                $params[] = $type_filter;
            }

            if ($unread_only) {
                $where_conditions[] = "n.is_read = 0";
            }

            $where_clause = empty($where_conditions) ? '' : 'WHERE ' . implode(' AND ', $where_conditions);

            $stmt = $conn->prepare("
                SELECT n.*, t.table_number,
                       CASE
                           WHEN n.type = 'call_waiter' THEN '🙋‍♂️ Call Waiter'
                           WHEN n.type = 'make_order' THEN '📝 Make Order'
                           WHEN n.type = 'request_bill_card' THEN '💳 Request Bill (Card)'
                           WHEN n.type = 'request_bill_cash' THEN '💵 Request Bill (Cash)'
                           WHEN n.type = 'call_shisha' THEN '💨 Call Shisha Master'
                           WHEN n.type = 'change_coal' THEN '🔥 Change Coal'
                           ELSE n.type
                       END as type_display
                FROM notifications n
                INNER JOIN tables t ON n.table_id = t.id
                $where_clause
                ORDER BY n.created_at DESC
                LIMIT ? OFFSET ?
            ");

            $params[] = $limit;
            $params[] = $offset;
            $stmt->execute($params);
            $notifications = $stmt->fetchAll();

            // Получаем общее количество
            $count_stmt = $conn->prepare("
                SELECT COUNT(*)
                FROM notifications n
                INNER JOIN tables t ON n.table_id = t.id
                $where_clause
            ");
            $count_params = array_slice($params, 0, -2); // Убираем limit и offset
            $count_stmt->execute($count_params);
            $total = $count_stmt->fetchColumn();

            echo json_encode([
                'success' => true,
                'data' => $notifications,
                'pagination' => [
                    'total' => (int)$total,
                    'limit' => $limit,
                    'offset' => $offset,
                    'has_more' => ($offset + $limit) < $total
                ]
            ]);
            break;

        case 'unread_count':
            // Получить количество непрочитанных уведомлений
            $stmt = $conn->prepare("SELECT COUNT(*) FROM notifications WHERE is_read = 0");
            $stmt->execute();
            $count = $stmt->fetchColumn();

            echo json_encode([
                'success' => true,
                'unread_count' => (int)$count
            ]);
            break;

        case 'stats':
            // Статистика уведомлений
            $stmt = $conn->prepare("
                SELECT
                    type,
                    COUNT(*) as count,
                    SUM(CASE WHEN is_read = 0 THEN 1 ELSE 0 END) as unread_count,
                    MAX(created_at) as last_notification
                FROM notifications
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
                GROUP BY type
                ORDER BY count DESC
            ");
            $stmt->execute();
            $stats = $stmt->fetchAll();

            echo json_encode([
                'success' => true,
                'data' => $stats
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
            // Создать новое уведомление
            $session_id = $input['session_id'] ?? '';
            $table_number = (int)($input['table_number'] ?? 0);
            $type = $input['type'] ?? '';
            $message = $input['message'] ?? '';

            if (empty($session_id) || $table_number <= 0 || empty($type)) {
                throw new Exception('Missing required parameters');
            }

            // Проверяем валидность сессии
            $stmt = $conn->prepare("
                SELECT s.id, s.table_id, t.table_number
                FROM sessions s
                INNER JOIN tables t ON s.table_id = t.id
                WHERE s.session_id = ?
                AND t.table_number = ?
                AND s.is_active = 1
                AND s.expires_at > NOW()
            ");
            $stmt->execute([$session_id, $table_number]);
            $session = $stmt->fetch();

            if (!$session) {
                throw new Exception('Invalid or expired session');
            }

            // Проверяем валидность типа уведомления
            $valid_types = [
                'call_waiter', 'make_order', 'request_bill_card',
                'request_bill_cash', 'call_shisha', 'change_coal'
            ];

            if (!in_array($type, $valid_types)) {
                throw new Exception('Invalid notification type');
            }

            // Создаем уведомление
            $stmt = $conn->prepare("INSERT INTO notifications (table_id, session_id, type, message, is_read) VALUES (?, ?, ?, ?, 0)");
            $stmt->execute([$session['table_id'], $session_id, $type, $message]);

            $notification_id = $conn->lastInsertId();

            // Получаем созданное уведомление для ответа
            $stmt = $conn->prepare("
                SELECT n.*, t.table_number
                FROM notifications n
                INNER JOIN tables t ON n.table_id = t.id
                WHERE n.id = ?
            ");
            $stmt->execute([$notification_id]);
            $notification = $stmt->fetch();

            // Отправляем уведомление в Telegram
            if (sendTelegramNotification($notification)) {
                // Помечаем как отправленное в Telegram
                $stmt = $conn->prepare("UPDATE notifications SET telegram_sent = 1 WHERE id = ?");
                $stmt->execute([$notification_id]);
            }

            echo json_encode([
                'success' => true,
                'data' => $notification,
                'message' => 'Notification created successfully'
            ]);
            break;

        default:
            throw new Exception('Unknown action');
    }
}

function handlePut($conn, $input) {
    $action = $input['action'] ?? 'mark_read';

    switch ($action) {
        case 'mark_read':
            // Отметить уведомление как прочитанное
            $notification_id = (int)($input['notification_id'] ?? 0);

            if ($notification_id <= 0) {
                throw new Exception('Invalid notification ID');
            }

            $stmt = $conn->prepare("UPDATE notifications SET is_read = 1 WHERE id = ?");
            $stmt->execute([$notification_id]);

            echo json_encode([
                'success' => true,
                'message' => 'Notification marked as read'
            ]);
            break;

        case 'mark_all_read':
            // Отметить все уведомления как прочитанные
            $table_id = (int)($input['table_id'] ?? 0);

            if ($table_id > 0) {
                // Отметить для конкретного столика
                $stmt = $conn->prepare("UPDATE notifications SET is_read = 1 WHERE table_id = ? AND is_read = 0");
                $stmt->execute([$table_id]);
            } else {
                // Отметить все
                $stmt = $conn->prepare("UPDATE notifications SET is_read = 1 WHERE is_read = 0");
                $stmt->execute();
            }

            $marked = $stmt->rowCount();

            echo json_encode([
                'success' => true,
                'marked_count' => $marked,
                'message' => "Marked $marked notifications as read"
            ]);
            break;

        default:
            throw new Exception('Unknown action');
    }
}

function handleDelete($conn, $input) {
    $action = $input['action'] ?? 'single';

    switch ($action) {
        case 'single':
            // Удалить одно уведомление
            $notification_id = (int)($input['notification_id'] ?? 0);

            if ($notification_id <= 0) {
                throw new Exception('Invalid notification ID');
            }

            $stmt = $conn->prepare("DELETE FROM notifications WHERE id = ?");
            $stmt->execute([$notification_id]);

            echo json_encode([
                'success' => true,
                'message' => 'Notification deleted successfully'
            ]);
            break;

        case 'old':
            // Удалить старые уведомления (старше указанного количества дней)
            $days = (int)($input['days'] ?? 7);

            $stmt = $conn->prepare("DELETE FROM notifications WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)");
            $stmt->execute([$days]);

            $deleted = $stmt->rowCount();

            echo json_encode([
                'success' => true,
                'deleted_count' => $deleted,
                'message' => "Deleted $deleted old notifications"
            ]);
            break;

        case 'read':
            // Удалить все прочитанные уведомления
            $stmt = $conn->prepare("DELETE FROM notifications WHERE is_read = 1");
            $stmt->execute();

            $deleted = $stmt->rowCount();

            echo json_encode([
                'success' => true,
                'deleted_count' => $deleted,
                'message' => "Deleted $deleted read notifications"
            ]);
            break;

        default:
            throw new Exception('Unknown action');
    }
}

// Функция для отправки уведомления (может быть расширена для push-уведомлений)
function sendNotification($type, $table_number, $message = '') {
    // Здесь можно добавить логику для отправки push-уведомлений
    // или интеграцию с системами уведомлений (Telegram, Email и т.д.)

    $notification_text = getNotificationText($type, $table_number, $message);

    // Пример логирования
    error_log("Notification: $notification_text");

    return $notification_text;
}

function sendTelegramNotification($notification) {
    // Читаем настройки Telegram из файла или переменных окружения
    $telegram_config = getTelegramConfig();

    if (!$telegram_config['enabled'] || !$telegram_config['bot_token'] || !$telegram_config['chat_id']) {
        error_log("Telegram не настроен, уведомление не отправлено");
        return false;
    }

    $message = formatTelegramMessage($notification);

    $data = [
        'chat_id' => $telegram_config['chat_id'],
        'text' => $message,
        'parse_mode' => 'HTML'
    ];

    // Добавляем инлайн кнопку если есть ID уведомления
    if ($notification['id']) {
        $keyboard = [
            'inline_keyboard' => [
                [
                    [
                        'text' => '✅ ПРИНЯТЬ',
                        'callback_data' => "accept_{$notification['id']}"
                    ]
                ]
            ]
        ];
        $data['reply_markup'] = json_encode($keyboard);
    }

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://api.telegram.org/bot{$telegram_config['bot_token']}/sendMessage");
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($http_code === 200) {
        error_log("Telegram уведомление отправлено успешно");
        return true;
    } else {
        error_log("Ошибка отправки в Telegram: HTTP $http_code, Response: $response");
        return false;
    }
}

function getTelegramConfig() {
    // Проверяем настройки в базе данных
    try {
        $conn = getDBConnection();
        $stmt = $conn->prepare("SELECT setting_key, setting_value FROM settings WHERE setting_key IN ('telegram_bot_token', 'telegram_chat_id', 'telegram_enabled')");
        $stmt->execute();
        $settings = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

        return [
            'enabled' => ($settings['telegram_enabled'] ?? 'false') === 'true',
            'bot_token' => $settings['telegram_bot_token'] ?? '',
            'chat_id' => $settings['telegram_chat_id'] ?? ''
        ];
    } catch (Exception $e) {
        error_log("Ошибка получения настроек Telegram: " . $e->getMessage());
        return ['enabled' => false, 'bot_token' => '', 'chat_id' => ''];
    }
}

function formatTelegramMessage($notification) {
    $table_number = $notification['table_number'];
    $type = $notification['type'];
    $time = date('H:i:s');

    // Настройки для разных типов уведомлений
    $notification_types = [
        'make_order' => [
            'emoji' => '📝',
            'title' => 'ЗАКАЗ',
            'description' => 'Клиент хочет сделать заказ',
            'priority' => '🔸'
        ],
        'request_bill_card' => [
            'emoji' => '💳',
            'title' => 'СЧЕТ (КАРТА)',
            'description' => 'Клиент просит счет для оплаты картой',
            'priority' => '🔹'
        ],
        'request_bill_cash' => [
            'emoji' => '💵',
            'title' => 'СЧЕТ (НАЛИЧНЫЕ)',
            'description' => 'Клиент просит счет для оплаты наличными',
            'priority' => '🔹'
        ],
        'call_shisha' => [
            'emoji' => '💨',
            'title' => 'КАЛЬЯНЩИК',
            'description' => 'Клиент вызывает кальянщика',
            'priority' => '🔸'
        ],
        'change_coal' => [
            'emoji' => '🔥',
            'title' => 'СМЕНА УГЛЯ',
            'description' => 'Клиент просит поменять уголь',
            'priority' => '🔹'
        ]
    ];

    $type_info = $notification_types[$type] ?? [
        'emoji' => '❓',
        'title' => strtoupper($type),
        'description' => 'Неизвестный тип запроса',
        'priority' => '🔸'
    ];

    $message = $type_info['priority'] . " <b>НОВЫЙ ЗАПРОС</b> " . $type_info['priority'] . "\n\n";
    $message .= $type_info['emoji'] . " <b>ТИП:</b> " . $type_info['title'] . "\n";
    $message .= "🏷️ <b>СТОЛИК:</b> #" . $table_number . "\n";
    $message .= "🕐 <b>ВРЕМЯ:</b> " . $time . "\n\n";
    $message .= "📋 <b>ДЕТАЛИ:</b>\n" . $type_info['description'] . "\n\n";
    $message .= "━━━━━━━━━━━━━━━━━━━━━━━";

    return $message;
}

function getNotificationText($type, $table_number, $message = '') {
    $texts = [
        'call_waiter' => "🙋‍♂️ Table $table_number: Customer is calling for a waiter",
        'make_order' => "📝 Table $table_number: Customer wants to make an order",
        'request_bill_card' => "💳 Table $table_number: Customer requests bill (Card payment)",
        'request_bill_cash' => "💵 Table $table_number: Customer requests bill (Cash payment)",
        'call_shisha' => "💨 Table $table_number: Customer is calling for shisha master",
        'change_coal' => "🔥 Table $table_number: Customer requests coal change"
    ];

    $base_text = $texts[$type] ?? "Table $table_number: $type";

    return $message ? "$base_text - $message" : $base_text;
}
?>
