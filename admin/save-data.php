<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Обработка preflight запросов
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Путь к файлу данных
$dataFile = '../data/working-hours.json';

if ($_SERVER['REQUEST_METHOD'] === 'PUT' || $_SERVER['REQUEST_METHOD'] === 'POST') {
    // Получаем данные из тела запроса
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if ($data === null) {
        http_response_code(400);
        echo json_encode(['error' => 'Неверный JSON']);
        exit();
    }

    // Проверяем структуру данных
    if (!isset($data['title']) || !isset($data['days']) || !is_array($data['days'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Неверная структура данных']);
        exit();
    }

    // Создаем директорию если не существует
    $dataDir = dirname($dataFile);
    if (!is_dir($dataDir)) {
        mkdir($dataDir, 0755, true);
    }

    // Сохраняем данные в файл
    $result = file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    if ($result === false) {
        http_response_code(500);
        echo json_encode(['error' => 'Ошибка сохранения файла']);
        exit();
    }

    // Возвращаем успешный ответ
    echo json_encode([
        'success' => true,
        'message' => 'Данные успешно сохранены',
        'timestamp' => date('Y-m-d H:i:s')
    ]);

} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Возвращаем текущие данные
    if (file_exists($dataFile)) {
        $data = file_get_contents($dataFile);
        echo $data;
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Файл данных не найден']);
    }

} else {
    http_response_code(405);
    echo json_encode(['error' => 'Метод не поддерживается']);
}
?>
