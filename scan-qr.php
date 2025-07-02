<?php
require_once 'config/database.php';

// Инициализируем БД если еще не создана
try {
    initializeDatabase();
} catch (Exception $e) {
    error_log("Database initialization error: " . $e->getMessage());
}

// Получаем номер столика из URL параметра
$table_number = (int)($_GET['table'] ?? 0);

if ($table_number <= 0) {
    // Неверный номер столика - перенаправляем на главную
    header('Location: /index.html?error=invalid_table');
    exit;
}

try {
    $conn = getDBConnection();

    // Проверяем, существует ли столик и активен ли он
    $stmt = $conn->prepare("SELECT id, is_active FROM tables WHERE table_number = ?");
    $stmt->execute([$table_number]);
    $table = $stmt->fetch();

    if (!$table) {
        // Столик не найден - перенаправляем с ошибкой
        header('Location: /index.html?error=table_not_found');
        exit;
    }

    if (!$table['is_active']) {
        // Столик неактивен - перенаправляем с ошибкой
        header('Location: /index.html?error=table_inactive');
        exit;
    }

    // Деактивируем все предыдущие сессии для этого столика
    $stmt = $conn->prepare("UPDATE sessions SET is_active = 0 WHERE table_id = ? AND is_active = 1");
    $stmt->execute([$table['id']]);

    // Генерируем уникальную сессию
    $session_id = generateUniqueSessionId($conn);

    // Получаем длительность сессии из настроек
    $stmt = $conn->prepare("SELECT setting_value FROM settings WHERE setting_key = 'session_duration_hours'");
    $stmt->execute();
    $session_duration = (int)($stmt->fetchColumn() ?: 2);

    $expires_at = date('Y-m-d H:i:s', strtotime("+{$session_duration} hours"));

    // Создаем новую сессию
    $stmt = $conn->prepare("
        INSERT INTO sessions (session_id, table_id, expires_at, is_active)
        VALUES (?, ?, ?, 1)
    ");
    $stmt->execute([$session_id, $table['id'], $expires_at]);

    // Успешно - перенаправляем на after-qr страницу с параметрами сессии
    $redirect_url = "/after-qr/after-qr.html?session=" . urlencode($session_id) . "&table=" . $table_number;
    header('Location: ' . $redirect_url);
    exit;

} catch (Exception $e) {
    error_log("QR scan error: " . $e->getMessage());
    header('Location: /index.html?error=system_error');
    exit;
}

function generateUniqueSessionId($conn) {
    $max_attempts = 10;
    $attempt = 0;

    do {
        $session_id = bin2hex(random_bytes(16)) . '_' . time() . '_' . mt_rand(1000, 9999);

        // Проверяем уникальность
        $stmt = $conn->prepare("SELECT id FROM sessions WHERE session_id = ?");
        $stmt->execute([$session_id]);

        if (!$stmt->fetch()) {
            return $session_id;
        }

        $attempt++;
    } while ($attempt < $max_attempts);

    throw new Exception('Unable to generate unique session ID');
}

// Функция для логирования доступа (опционально)
function logQRAccess($table_number, $session_id, $ip_address) {
    $log_entry = date('Y-m-d H:i:s') . " - QR scanned: Table $table_number, Session: $session_id, IP: $ip_address" . PHP_EOL;
    file_put_contents('logs/qr_access.log', $log_entry, FILE_APPEND | LOCK_EX);
}

// Логируем доступ (создаем папку logs если не существует)
if (!is_dir('logs')) {
    mkdir('logs', 0755, true);
}

$ip_address = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
if (isset($session_id)) {
    logQRAccess($table_number, $session_id, $ip_address);
}
?>
