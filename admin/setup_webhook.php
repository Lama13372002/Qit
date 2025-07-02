<?php
require_once '../config/database.php';

// Получаем настройки Telegram
try {
    $conn = getDBConnection();
    $stmt = $conn->prepare("SELECT setting_key, setting_value FROM settings WHERE setting_key IN ('telegram_bot_token', 'telegram_enabled')");
    $stmt->execute();
    $settings = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

    $bot_token = $settings['telegram_bot_token'] ?? '';
    $telegram_enabled = ($settings['telegram_enabled'] ?? 'false') === 'true';

} catch (Exception $e) {
    die("Ошибка получения настроек: " . $e->getMessage());
}

if (!$telegram_enabled || !$bot_token) {
    die("Telegram не настроен. Сначала настройте в telegram_settings.php");
}

// URL для webhook (замените на ваш домен)
$webhook_url = "https://yourdomain.com/api/telegram_webhook.php";

// Если передан параметр для автоматической настройки
if (isset($_GET['auto_setup']) && isset($_GET['domain'])) {
    $domain = $_GET['domain'];
    $webhook_url = "https://$domain/api/telegram_webhook.php";

    $result = setWebhook($bot_token, $webhook_url);

    header('Content-Type: application/json');
    echo json_encode($result);
    exit;
}

function setWebhook($bot_token, $webhook_url) {
    $url = "https://api.telegram.org/bot$bot_token/setWebhook";

    $data = [
        'url' => $webhook_url,
        'allowed_updates' => json_encode(['callback_query'])
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

    $result = json_decode($response, true);

    return [
        'success' => $http_code === 200 && $result['ok'] === true,
        'response' => $result,
        'webhook_url' => $webhook_url
    ];
}

function getWebhookInfo($bot_token) {
    $url = "https://api.telegram.org/bot$bot_token/getWebhookInfo";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);

    $response = curl_exec($ch);
    curl_close($ch);

    return json_decode($response, true);
}

$webhook_info = getWebhookInfo($bot_token);
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Настройка Webhook - Админ панель</title>
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
        }

        .status {
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-weight: bold;
        }

        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .info { background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            color: #34495e;
        }

        input[type="text"] {
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 16px;
        }

        .btn {
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            margin-right: 10px;
            margin-bottom: 10px;
        }

        .btn:hover {
            transform: translateY(-2px);
        }

        .back-link {
            display: inline-block;
            margin-bottom: 20px;
            color: #3498db;
            text-decoration: none;
            font-weight: bold;
        }

        .webhook-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }

        .webhook-info h3 {
            margin-bottom: 15px;
            color: #2c3e50;
        }

        .webhook-info p {
            margin-bottom: 8px;
        }

        .code {
            background: #e9ecef;
            padding: 8px 12px;
            border-radius: 4px;
            font-family: monospace;
            word-break: break-all;
        }
    </style>
</head>
<body>
    <div class="container">
        <a href="telegram_settings.php" class="back-link">← Назад к настройкам Telegram</a>

        <h1>🔗 Настройка Webhook</h1>

        <div class="webhook-info">
            <h3>📊 Текущий статус webhook:</h3>
            <?php if ($webhook_info && $webhook_info['ok']): ?>
                <?php $info = $webhook_info['result']; ?>
                <?php if (!empty($info['url'])): ?>
                    <div class="status success">✅ Webhook активен</div>
                    <p><strong>URL:</strong> <span class="code"><?= htmlspecialchars($info['url']) ?></span></p>
                    <p><strong>Последняя ошибка:</strong> <?= $info['last_error_message'] ?? 'Нет ошибок' ?></p>
                    <p><strong>Ожидающих обновлений:</strong> <?= $info['pending_update_count'] ?? 0 ?></p>
                <?php else: ?>
                    <div class="status error">❌ Webhook не настроен</div>
                <?php endif; ?>
            <?php else: ?>
                <div class="status error">❌ Не удалось получить информацию о webhook</div>
            <?php endif; ?>
        </div>

        <div class="form-group">
            <label for="webhook_url">URL для webhook:</label>
            <input type="text" id="webhook_url" value="<?= htmlspecialchars($webhook_url) ?>" placeholder="https://yourdomain.com/api/telegram_webhook.php">
            <small>Замените yourdomain.com на ваш домен</small>
        </div>

        <button class="btn" onclick="setupWebhook()">🔧 Настроить Webhook</button>
        <button class="btn" onclick="removeWebhook()">🗑️ Удалить Webhook</button>
        <button class="btn" onclick="checkWebhook()">🔍 Проверить Статус</button>

        <div id="result"></div>
    </div>

    <script>
        async function setupWebhook() {
            const webhookUrl = document.getElementById('webhook_url').value;

            if (!webhookUrl) {
                alert('Введите URL для webhook');
                return;
            }

            try {
                const domain = new URL(webhookUrl).hostname;
                const response = await fetch(`?auto_setup=1&domain=${domain}`);
                const result = await response.json();

                showResult(result);
            } catch (error) {
                showResult({success: false, error: error.message});
            }
        }

        async function removeWebhook() {
            try {
                const response = await fetch('https://api.telegram.org/bot<?= $bot_token ?>/setWebhook', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    body: 'url='
                });
                const result = await response.json();

                showResult({
                    success: result.ok,
                    response: result,
                    message: result.ok ? 'Webhook удален' : 'Ошибка удаления webhook'
                });

                setTimeout(() => location.reload(), 1000);
            } catch (error) {
                showResult({success: false, error: error.message});
            }
        }

        function checkWebhook() {
            location.reload();
        }

        function showResult(result) {
            const resultDiv = document.getElementById('result');

            if (result.success) {
                resultDiv.innerHTML = `
                    <div class="status success">
                        ✅ ${result.message || 'Webhook настроен успешно!'}
                        ${result.webhook_url ? '<br>URL: ' + result.webhook_url : ''}
                    </div>
                `;
                setTimeout(() => location.reload(), 2000);
            } else {
                resultDiv.innerHTML = `
                    <div class="status error">
                        ❌ Ошибка: ${result.error || JSON.stringify(result.response)}
                    </div>
                `;
            }
        }
    </script>
</body>
</html>
