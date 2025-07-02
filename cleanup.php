<?php
/**
 * Скрипт автоматической очистки истекших сессий
 * Можно запускать через cron каждую минуту или по запросу
 */

require_once 'config/database.php';

// Проверяем, запущен ли скрипт из командной строки или через веб
$is_cli = php_sapi_name() === 'cli';
$is_cron = isset($_GET['cron']) && $_GET['cron'] === 'true';

if (!$is_cli && !$is_cron) {
    // Если не CLI и не cron запрос, требуем авторизацию
    if (!isset($_GET['auth']) || $_GET['auth'] !== 'cleanup_sessions') {
        http_response_code(403);
        exit('Access denied');
    }
}

try {
    $conn = getDBConnection();

    // Логирование
    $log_file = 'logs/cleanup.log';
    if (!is_dir('logs')) {
        mkdir('logs', 0755, true);
    }

    $start_time = microtime(true);
    $timestamp = date('Y-m-d H:i:s');

    // 1. Деактивируем истекшие сессии
    $stmt = $conn->prepare("
        UPDATE sessions
        SET is_active = 0
        WHERE expires_at <= NOW()
        AND is_active = 1
    ");
    $stmt->execute();
    $expired_sessions = $stmt->rowCount();

    // 2. Удаляем старые неактивные сессии (старше 7 дней)
    $stmt = $conn->prepare("
        DELETE FROM sessions
        WHERE is_active = 0
        AND created_at < DATE_SUB(NOW(), INTERVAL 7 DAY)
    ");
    $stmt->execute();
    $deleted_sessions = $stmt->rowCount();

    // 3. Удаляем старые прочитанные уведомления (старше 3 дней)
    $stmt = $conn->prepare("
        DELETE FROM notifications
        WHERE is_read = 1
        AND created_at < DATE_SUB(NOW(), INTERVAL 3 DAY)
    ");
    $stmt->execute();
    $deleted_notifications = $stmt->rowCount();

    // 4. Получаем статистику активных сессий
    $stmt = $conn->prepare("
        SELECT COUNT(*) as active_sessions,
               COUNT(DISTINCT table_id) as active_tables
        FROM sessions
        WHERE is_active = 1
        AND expires_at > NOW()
    ");
    $stmt->execute();
    $stats = $stmt->fetch();

    $execution_time = round((microtime(true) - $start_time) * 1000, 2);

    $result = [
        'timestamp' => $timestamp,
        'execution_time_ms' => $execution_time,
        'expired_sessions' => $expired_sessions,
        'deleted_old_sessions' => $deleted_sessions,
        'deleted_old_notifications' => $deleted_notifications,
        'current_active_sessions' => $stats['active_sessions'],
        'current_active_tables' => $stats['active_tables']
    ];

    // Логирование результатов
    $log_entry = $timestamp . " - Cleanup: " .
                "Expired: {$expired_sessions}, " .
                "Deleted sessions: {$deleted_sessions}, " .
                "Deleted notifications: {$deleted_notifications}, " .
                "Active: {$stats['active_sessions']}, " .
                "Time: {$execution_time}ms" . PHP_EOL;

    file_put_contents($log_file, $log_entry, FILE_APPEND | LOCK_EX);

    if ($is_cli) {
        echo "Cleanup completed:\n";
        echo "- Expired sessions: {$expired_sessions}\n";
        echo "- Deleted old sessions: {$deleted_sessions}\n";
        echo "- Deleted old notifications: {$deleted_notifications}\n";
        echo "- Active sessions: {$stats['active_sessions']}\n";
        echo "- Execution time: {$execution_time}ms\n";
    } else {
        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'data' => $result
        ]);
    }

} catch (Exception $e) {
    $error_message = "Cleanup error: " . $e->getMessage();

    if (isset($log_file)) {
        file_put_contents($log_file, date('Y-m-d H:i:s') . " - ERROR: " . $error_message . PHP_EOL, FILE_APPEND | LOCK_EX);
    }

    if ($is_cli) {
        echo "Error: " . $error_message . "\n";
        exit(1);
    } else {
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => $error_message
        ]);
    }
}

/**
 * Функция для запуска очистки из других скриптов
 */
function runCleanup() {
    global $conn;

    if (!$conn) {
        $conn = getDBConnection();
    }

    try {
        // Деактивируем истекшие сессии
        $stmt = $conn->prepare("UPDATE sessions SET is_active = 0 WHERE expires_at <= NOW() AND is_active = 1");
        $stmt->execute();

        return $stmt->rowCount();
    } catch (Exception $e) {
        error_log("Cleanup function error: " . $e->getMessage());
        return 0;
    }
}

// Если вызван напрямую для быстрой очистки
if (isset($_GET['quick']) && $_GET['quick'] === 'true') {
    $cleaned = runCleanup();
    header('Content-Type: application/json');
    echo json_encode([
        'success' => true,
        'expired_sessions' => $cleaned,
        'message' => "Quick cleanup completed. Deactivated $cleaned expired sessions."
    ]);
    exit;
}
?>
