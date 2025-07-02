<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT');
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
        case 'PUT':
            handleUpdate($conn, $input);
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
    $key = $_GET['key'] ?? '';

    if ($key) {
        // Получить конкретную настройку
        $stmt = $conn->prepare("SELECT setting_value FROM settings WHERE setting_key = ?");
        $stmt->execute([$key]);
        $value = $stmt->fetchColumn();

        if ($value !== false) {
            echo json_encode([
                'success' => true,
                'key' => $key,
                'value' => $value
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'error' => 'Setting not found'
            ]);
        }
    } else {
        // Получить все настройки
        $stmt = $conn->prepare("SELECT setting_key, setting_value, updated_at FROM settings ORDER BY setting_key");
        $stmt->execute();
        $settings = $stmt->fetchAll();

        // Преобразуем в удобный формат
        $formatted = [];
        foreach ($settings as $setting) {
            $formatted[$setting['setting_key']] = [
                'value' => $setting['setting_value'],
                'updated_at' => $setting['updated_at']
            ];
        }

        echo json_encode([
            'success' => true,
            'data' => $formatted
        ]);
    }
}

function handleUpdate($conn, $input) {
    $key = $input['key'] ?? '';
    $value = $input['value'] ?? '';

    if (empty($key)) {
        throw new Exception('Setting key is required');
    }

    // Валидация для специфических настроек
    switch ($key) {
        case 'session_duration_hours':
            $value = (int)$value;
            if ($value < 1 || $value > 24) {
                throw new Exception('Session duration must be between 1 and 24 hours');
            }
            break;

        case 'wifi_password':
            if (strlen($value) < 8) {
                throw new Exception('Wi-Fi password must be at least 8 characters long');
            }
            break;
    }

    // Обновляем или создаем настройку
    $stmt = $conn->prepare("
        INSERT INTO settings (setting_key, setting_value)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE
        setting_value = VALUES(setting_value),
        updated_at = CURRENT_TIMESTAMP
    ");
    $stmt->execute([$key, $value]);

    echo json_encode([
        'success' => true,
        'message' => 'Setting updated successfully',
        'key' => $key,
        'value' => $value
    ]);
}

// Функция для получения настройки (для использования в других скриптах)
function getSetting($key, $default = null) {
    try {
        $conn = getDBConnection();
        $stmt = $conn->prepare("SELECT setting_value FROM settings WHERE setting_key = ?");
        $stmt->execute([$key]);
        $value = $stmt->fetchColumn();

        return $value !== false ? $value : $default;
    } catch (Exception $e) {
        return $default;
    }
}

// Функция для установки настройки (для использования в других скриптах)
function setSetting($key, $value) {
    try {
        $conn = getDBConnection();
        $stmt = $conn->prepare("
            INSERT INTO settings (setting_key, setting_value)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE
            setting_value = VALUES(setting_value),
            updated_at = CURRENT_TIMESTAMP
        ");
        $stmt->execute([$key, $value]);

        return true;
    } catch (Exception $e) {
        return false;
    }
}
?>
