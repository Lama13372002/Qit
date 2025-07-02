<?php
// Конфигурация базы данных
class Database {
    private $host = 'localhost';
    private $db_name = 's133926_qr';
    private $username = 's133926_sky';
    private $password = 'Ybpfvb1337@';
    private $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4",
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
        } catch(PDOException $exception) {
            error_log("Connection error: " . $exception->getMessage());
            throw new Exception("Database connection failed");
        }

        return $this->conn;
    }

    // Создание таблиц при первом запуске
    public function createTables() {
        try {
            $sql = "
            CREATE TABLE IF NOT EXISTS `tables` (
                `id` int(11) NOT NULL AUTO_INCREMENT,
                `table_number` int(11) NOT NULL UNIQUE,
                `qr_link` varchar(255) NOT NULL,
                `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                `is_active` tinyint(1) NOT NULL DEFAULT 1,
                PRIMARY KEY (`id`),
                INDEX `idx_table_number` (`table_number`),
                INDEX `idx_is_active` (`is_active`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

            CREATE TABLE IF NOT EXISTS `sessions` (
                `id` int(11) NOT NULL AUTO_INCREMENT,
                `session_id` varchar(64) NOT NULL UNIQUE,
                `table_id` int(11) NOT NULL,
                `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                `expires_at` timestamp NOT NULL,
                `is_active` tinyint(1) NOT NULL DEFAULT 1,
                PRIMARY KEY (`id`),
                FOREIGN KEY (`table_id`) REFERENCES `tables`(`id`) ON DELETE CASCADE,
                INDEX `idx_session_id` (`session_id`),
                INDEX `idx_expires_at` (`expires_at`),
                INDEX `idx_is_active` (`is_active`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

            CREATE TABLE IF NOT EXISTS `notifications` (
                `id` int(11) NOT NULL AUTO_INCREMENT,
                `table_id` int(11) NOT NULL,
                `session_id` varchar(64) NOT NULL,
                `type` enum('call_waiter','make_order','request_bill_card','request_bill_cash','call_shisha','change_coal') NOT NULL,
                `message` text,
                `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                `is_read` tinyint(1) NOT NULL DEFAULT 0,
                PRIMARY KEY (`id`),
                FOREIGN KEY (`table_id`) REFERENCES `tables`(`id`) ON DELETE CASCADE,
                INDEX `idx_table_id` (`table_id`),
                INDEX `idx_type` (`type`),
                INDEX `idx_created_at` (`created_at`),
                INDEX `idx_is_read` (`is_read`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

            CREATE TABLE IF NOT EXISTS `settings` (
                `id` int(11) NOT NULL AUTO_INCREMENT,
                `setting_key` varchar(100) NOT NULL UNIQUE,
                `setting_value` text,
                `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (`id`),
                INDEX `idx_setting_key` (`setting_key`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            ";

            $this->conn->exec($sql);

            // Вставляем настройки по умолчанию
            $this->insertDefaultSettings();

            return true;
        } catch(PDOException $e) {
            error_log("Error creating tables: " . $e->getMessage());
            return false;
        }
    }

    private function insertDefaultSettings() {
        $defaultSettings = [
            ['wifi_password', 'CalliaNo2024!'],
            ['restaurant_name', 'Calliano Lounge'],
            ['session_duration_hours', '2']
        ];

        $stmt = $this->conn->prepare("INSERT IGNORE INTO settings (setting_key, setting_value) VALUES (?, ?)");

        foreach ($defaultSettings as $setting) {
            $stmt->execute($setting);
        }
    }
}

// Функция для получения соединения с БД
function getDBConnection() {
    $database = new Database();
    return $database->getConnection();
}

// Функция для инициализации БД
function initializeDatabase() {
    $database = new Database();
    $database->getConnection();
    return $database->createTables();
}
?>
