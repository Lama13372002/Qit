<?php
require_once '../config/database.php';

// Проверяем авторизацию админа (можно добавить свою логику)
session_start();

$message = '';
$error = '';

// Обработка сохранения настроек
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $conn = getDBConnection();

        $telegram_enabled = isset($_POST['telegram_enabled']) ? 'true' : 'false';
        $bot_token = trim($_POST['bot_token'] ?? '');
        $chat_id = trim($_POST['chat_id'] ?? '');

        // Сохраняем настройки
        $settings = [
            'telegram_enabled' => $telegram_enabled,
            'telegram_bot_token' => $bot_token,
            'telegram_chat_id' => $chat_id
        ];

        foreach ($settings as $key => $value) {
            $stmt = $conn->prepare("INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
            $stmt->execute([$key, $value]);
        }

        $message = 'Настройки Telegram успешно сохранены!';

        // Тестируем отправку сообщения, если все настройки заполнены
        if ($telegram_enabled === 'true' && !empty($bot_token) && !empty($chat_id)) {
            $test_result = testTelegramConnection($bot_token, $chat_id);
            if ($test_result['success']) {
                $message .= ' Тестовое сообщение отправлено успешно!';
            } else {
                $error = 'Настройки сохранены, но ошибка при отправке тестового сообщения: ' . $test_result['error'];
            }
        }

    } catch (Exception $e) {
        $error = 'Ошибка при сохранении настроек: ' . $e->getMessage();
    }
}

// Получаем текущие настройки
try {
    $conn = getDBConnection();
    $stmt = $conn->prepare("SELECT setting_key, setting_value FROM settings WHERE setting_key IN ('telegram_enabled', 'telegram_bot_token', 'telegram_chat_id')");
    $stmt->execute();
    $current_settings = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
} catch (Exception $e) {
    $error = 'Ошибка при загрузке настроек: ' . $e->getMessage();
    $current_settings = [];
}

function testTelegramConnection($bot_token, $chat_id) {
    $message = "🤖 Тестовое сообщение\n\nНастройки Telegram успешно применены!\nБот готов к отправке уведомлений ресторана.";

    $url = "https://api.telegram.org/bot{$bot_token}/sendMessage";
    $data = [
        'chat_id' => $chat_id,
        'text' => $message,
        'parse_mode' => 'HTML'
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($http_code === 200) {
        return ['success' => true];
    } else {
        return ['success' => false, 'error' => "HTTP $http_code: $response"];
    }
}
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Настройки Telegram - Админ панель</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #1e3c72, #2a5298);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        h1 {
            color: #2c3e50;
            margin-bottom: 30px;
            text-align: center;
            font-size: 2em;
        }

        .form-group {
            margin-bottom: 25px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            color: #34495e;
        }

        input[type="text"], textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s;
        }

        input[type="text"]:focus, textarea:focus {
            border-color: #3498db;
            outline: none;
        }

        .checkbox-group {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        input[type="checkbox"] {
            width: 20px;
            height: 20px;
        }

        .btn {
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            transition: transform 0.2s;
            width: 100%;
        }

        .btn:hover {
            transform: translateY(-2px);
        }

        .message {
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-weight: bold;
        }

        .success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        .help-text {
            font-size: 14px;
            color: #666;
            margin-top: 5px;
        }

        .instructions {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 4px solid #3498db;
        }

        .instructions h3 {
            color: #2c3e50;
            margin-bottom: 15px;
        }

        .instructions ol {
            margin-left: 20px;
        }

        .instructions li {
            margin-bottom: 8px;
        }

        .back-link {
            display: inline-block;
            margin-bottom: 20px;
            color: #3498db;
            text-decoration: none;
            font-weight: bold;
        }

        .back-link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <a href="../admin/" class="back-link">← Назад в админ панель</a>

        <h1>🤖 Настройки Telegram</h1>

        <?php if ($message): ?>
            <div class="message success"><?= htmlspecialchars($message) ?></div>
        <?php endif; ?>

        <?php if ($error): ?>
            <div class="message error"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>

        <div class="instructions">
            <h3>📋 Инструкция по настройке:</h3>
            <ol>
                <li>Создайте бота у <strong>@BotFather</strong> в Telegram</li>
                <li>Получите токен бота</li>
                <li>Добавьте бота в группу ресторана</li>
                <li>Дайте боту права администратора</li>
                <li>Отправьте сообщение в группе и получите Chat ID</li>
                <li>Заполните форму ниже</li>
            </ol>
        </div>

        <form method="POST">
            <div class="form-group">
                <div class="checkbox-group">
                    <input type="checkbox" id="telegram_enabled" name="telegram_enabled"
                           <?= ($current_settings['telegram_enabled'] ?? '') === 'true' ? 'checked' : '' ?>>
                    <label for="telegram_enabled">Включить уведомления в Telegram</label>
                </div>
            </div>

            <div class="form-group">
                <label for="bot_token">Токен бота:</label>
                <input type="text" id="bot_token" name="bot_token"
                       value="<?= htmlspecialchars($current_settings['telegram_bot_token'] ?? '') ?>"
                       placeholder="1234567890:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA">
                <div class="help-text">Получите у @BotFather в Telegram</div>
            </div>

            <div class="form-group">
                <label for="chat_id">ID чата/группы:</label>
                <input type="text" id="chat_id" name="chat_id"
                       value="<?= htmlspecialchars($current_settings['telegram_chat_id'] ?? '') ?>"
                       placeholder="-1001234567890">
                <div class="help-text">ID группы, куда будут отправляться уведомления</div>
            </div>

            <button type="submit" class="btn">💾 Сохранить настройки</button>
        </form>
    </div>
</body>
</html>
