<?php
// Отключаем вывод ошибок в браузер
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

header('Content-Type: application/json');

require_once '../config/database.php';

try {
    // Получаем данные от Telegram
    $input = file_get_contents('php://input');
    $update = json_decode($input, true);

    // Логируем входящие данные для отладки
    error_log("Telegram webhook: " . $input);

    if (!$update) {
        throw new Exception('Invalid JSON from Telegram');
    }

    // Проверяем есть ли callback_query (нажатие на инлайн кнопку)
    if (isset($update['callback_query'])) {
        handleCallbackQuery($update['callback_query']);
    }

    // Возвращаем успешный ответ
    echo json_encode(['ok' => true]);

} catch (Exception $e) {
    error_log("Telegram webhook error: " . $e->getMessage());
    echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
}

function handleCallbackQuery($callback_query) {
    $callback_data = $callback_query['data'];
    $message_id = $callback_query['message']['message_id'];
    $chat_id = $callback_query['message']['chat']['id'];
    $user = $callback_query['from'];
    $user_name = $user['first_name'] . ($user['last_name'] ? ' ' . $user['last_name'] : '');

    // Парсим callback_data (формат: accept_123)
    if (strpos($callback_data, 'accept_') === 0) {
        $notification_id = (int)str_replace('accept_', '', $callback_data);

        if ($notification_id > 0) {
            processAcceptNotification($notification_id, $user_name, $message_id, $chat_id);
        }
    }
}

function processAcceptNotification($notification_id, $user_name, $message_id, $chat_id) {
    try {
        $conn = getDBConnection();

        // Получаем информацию об уведомлении
        $stmt = $conn->prepare("
            SELECT n.*, t.table_number
            FROM notifications n
            INNER JOIN tables t ON n.table_id = t.id
            WHERE n.id = ?
        ");
        $stmt->execute([$notification_id]);
        $notification = $stmt->fetch();

        if (!$notification) {
            throw new Exception('Notification not found');
        }

        // Проверяем, не принято ли уже уведомление
        if ($notification['is_read'] == 1) {
            // Уведомление уже принято, показываем кто принял
            answerCallbackQuery($chat_id, "❌ Уже принято другим сотрудником");
            return;
        }

        // Помечаем уведомление как принятое
        $stmt = $conn->prepare("UPDATE notifications SET is_read = 1, processed_by = ?, processed_at = NOW() WHERE id = ?");
        $stmt->execute([$user_name, $notification_id]);

        // Обновляем сообщение с принятым статусом
        updateAcceptedMessage($notification, $user_name, $message_id, $chat_id);

        // Отвечаем на callback query
        answerCallbackQuery($chat_id, "✅ Принято вами!");

    } catch (Exception $e) {
        error_log("Error processing accept notification: " . $e->getMessage());
        answerCallbackQuery($chat_id, "❌ Ошибка при обработке");
    }
}

function updateAcceptedMessage($notification, $user_name, $message_id, $chat_id) {
    $telegram_config = getTelegramConfig();

    if (!$telegram_config['enabled'] || !$telegram_config['bot_token']) {
        return;
    }

    // Форматируем обновленное сообщение
    $updated_message = formatAcceptedMessage($notification, $user_name);

    $url = "https://api.telegram.org/bot{$telegram_config['bot_token']}/editMessageText";

    $data = [
        'chat_id' => $chat_id,
        'message_id' => $message_id,
        'text' => $updated_message,
        'parse_mode' => 'HTML',
        'reply_markup' => json_encode([
            'inline_keyboard' => [
                [
                    [
                        'text' => '✅ ПРИНЯТО',
                        'callback_data' => 'already_accepted'
                    ]
                ]
            ]
        ])
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);

    curl_exec($ch);
    curl_close($ch);
}

function formatAcceptedMessage($notification, $user_name) {
    $table_number = $notification['table_number'];
    $type = $notification['type'];
    $time = date('H:i:s', strtotime($notification['created_at']));
    $accepted_time = date('H:i:s');

    // Настройки для разных типов уведомлений
    $notification_types = [
        'make_order' => [
            'emoji' => '📝',
            'title' => 'ЗАКАЗ',
            'description' => 'Клиент хочет сделать заказ',
        ],
        'request_bill_card' => [
            'emoji' => '💳',
            'title' => 'СЧЕТ (КАРТА)',
            'description' => 'Клиент просит счет для оплаты картой',
        ],
        'request_bill_cash' => [
            'emoji' => '💵',
            'title' => 'СЧЕТ (НАЛИЧНЫЕ)',
            'description' => 'Клиент просит счет для оплаты наличными',
        ],
        'call_shisha' => [
            'emoji' => '💨',
            'title' => 'КАЛЬЯНЩИК',
            'description' => 'Клиент вызывает кальянщика',
        ],
        'change_coal' => [
            'emoji' => '🔥',
            'title' => 'СМЕНА УГЛЯ',
            'description' => 'Клиент просит поменять уголь',
        ]
    ];

    $type_info = $notification_types[$type] ?? [
        'emoji' => '❓',
        'title' => strtoupper($type),
        'description' => 'Неизвестный тип запроса',
    ];

    $message = "✅ <b>ПРИНЯТО</b> ✅\n\n";
    $message .= $type_info['emoji'] . " <b>ТИП:</b> " . $type_info['title'] . "\n";
    $message .= "🏷️ <b>СТОЛИК:</b> #" . $table_number . "\n";
    $message .= "🕐 <b>ЗАКАЗ:</b> " . $time . "\n";
    $message .= "✅ <b>ПРИНЯТО:</b> " . $accepted_time . "\n";
    $message .= "👤 <b>ПРИНЯЛ:</b> " . $user_name . "\n\n";
    $message .= "📋 <b>ДЕТАЛИ:</b>\n" . $type_info['description'] . "\n\n";
    $message .= "━━━━━━━━━━━━━━━━━━━━━━━";

    return $message;
}

function answerCallbackQuery($chat_id, $text) {
    $telegram_config = getTelegramConfig();

    if (!$telegram_config['enabled'] || !$telegram_config['bot_token']) {
        return;
    }

    $url = "https://api.telegram.org/bot{$telegram_config['bot_token']}/answerCallbackQuery";

    // Получаем callback_query_id из глобального контекста
    global $current_callback_query_id;

    $data = [
        'callback_query_id' => $current_callback_query_id,
        'text' => $text,
        'show_alert' => false
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);

    curl_exec($ch);
    curl_close($ch);
}

function getTelegramConfig() {
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

// Глобальная переменная для callback_query_id
$current_callback_query_id = null;

?>
