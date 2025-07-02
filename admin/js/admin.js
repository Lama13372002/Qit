class AdminPanel {
    constructor() {
        this.workingHours = null;
        this.init();
    }

    async init() {
        await this.loadData();
        this.renderDays();
        this.renderPreview();
        this.bindEvents();
        this.bindSocialLinksEvents();
    }

    async loadData() {
        try {
            // ВСЕГДА загружаем с сервера для получения актуальных данных
            // Добавляем параметры для избежания кэширования и улучшения совместимости
            const timestamp = Date.now();
            const response = await fetch(`../data/working-hours.json?v=${timestamp}&_cache=no`, {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                },
                cache: 'no-cache',
                mode: 'cors',
                credentials: 'same-origin'
            });

            if (!response.ok) {
                throw new Error(`Ошибка загрузки данных: ${response.status}`);
            }
            this.workingHours = await response.json();

            // Заполняем заголовок
            document.getElementById('title').value = this.workingHours.title;

            // Заполняем поля социальных ссылок
            this.loadSocialLinks();

            console.log('📡 Данные загружены с сервера в админ-панель');
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);

            // Если сервер недоступен, пытаемся загрузить из localStorage как fallback
            const localData = localStorage.getItem('workingHoursData');
            if (localData) {
                this.workingHours = JSON.parse(localData);
                document.getElementById('title').value = this.workingHours.title;
                this.loadSocialLinks(); // Добавляем загрузку социальных ссылок
                console.log('⚠️ Данные загружены из localStorage (сервер недоступен)');
                this.showMessage('Данные загружены из кэша (сервер недоступен)', 'warning');
                return;
            }

            // Если ничего нет, используем дефолтные данные
            this.workingHours = this.getDefaultData();
            document.getElementById('title').value = this.workingHours.title;
            this.loadSocialLinks(); // Добавляем загрузку социальных ссылок
        }
    }

    getDefaultData() {
        return {
            title: "Working Hours",
            days: [
                { name: "Monday", nameRu: "Понедельник", time: "11:00 — 22:00", status: "green" },
                { name: "Tuesday", nameRu: "Вторник", time: "11:00 — 22:00", status: "green" },
                { name: "Wednesday", nameRu: "Среда", time: "11:00 — 22:00", status: "green" },
                { name: "Thursday", nameRu: "Четверг", time: "11:00 — 22:00", status: "green" },
                { name: "Friday", nameRu: "Пятница", time: "11:00 — 23:00", status: "green" },
                { name: "Saturday", nameRu: "Суббота", time: "11:00 — 23:00", status: "green" },
                { name: "Sunday", nameRu: "Воскресенье", time: "12:00 — 21:00", status: "yellow" }
            ],
            social_links: {
                instagram: "",
                facebook: "",
                twitter: ""
            }
        };
    }

    renderDays() {
        const container = document.getElementById('daysContainer');
        container.innerHTML = '';

        this.workingHours.days.forEach((day, index) => {
            const dayElement = this.createDayElement(day, index);
            container.appendChild(dayElement);
        });
    }

    createDayElement(day, index) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day-item';
        dayDiv.innerHTML = `
            <div class="day-header">
                <span class="day-name">${day.nameRu} (${day.name})</span>
                <div class="status-indicator status-${day.status}"></div>
            </div>
            <div class="day-controls">
                <div class="form-group">
                    <label>Время работы:</label>
                    <input type="text"
                           class="form-control time-input"
                           value="${day.time}"
                           data-day-index="${index}"
                           placeholder="11:00 — 22:00">
                </div>
                <div class="form-group">
                    <label>Статус:</label>
                    <div class="status-buttons">
                        <button class="status-btn green ${day.status === 'green' ? 'active' : ''}"
                                data-day-index="${index}"
                                data-status="green">Открыто</button>
                        <button class="status-btn yellow ${day.status === 'yellow' ? 'active' : ''}"
                                data-day-index="${index}"
                                data-status="yellow">Ограничено</button>
                        <button class="status-btn red ${day.status === 'red' ? 'active' : ''}"
                                data-day-index="${index}"
                                data-status="red">Закрыто</button>
                    </div>
                </div>
            </div>
        `;

        return dayDiv;
    }

    renderPreview() {
        const container = document.getElementById('previewContent');
        const title = document.getElementById('title').value;

        let previewHTML = `<div class="preview-title">${title}</div>`;

        this.workingHours.days.forEach(day => {
            previewHTML += `
                <div class="preview-day">
                    <span class="preview-day-name">${day.name}</span>
                    <div class="preview-time-status">
                        <span class="preview-time">${day.time}</span>
                        <span class="preview-status status-${day.status}"></span>
                    </div>
                </div>
            `;
        });

        container.innerHTML = previewHTML;
    }

    bindEvents() {
        // Обработчик для изменения заголовка
        document.getElementById('title').addEventListener('input', (e) => {
            this.workingHours.title = e.target.value;
            this.renderPreview();
        });

        // Обработчики для времени работы
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('time-input')) {
                const dayIndex = parseInt(e.target.dataset.dayIndex);
                this.workingHours.days[dayIndex].time = e.target.value;
                this.renderPreview();
            }
        });

        // Обработчики для кнопок статуса
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('status-btn')) {
                const dayIndex = parseInt(e.target.dataset.dayIndex);
                const status = e.target.dataset.status;

                this.updateDayStatus(dayIndex, status);
                this.renderPreview();
            }
        });
    }

    updateDayStatus(dayIndex, status) {
        // Обновляем данные
        this.workingHours.days[dayIndex].status = status;

        // Обновляем активные кнопки
        const dayItem = document.querySelectorAll('.day-item')[dayIndex];
        const statusButtons = dayItem.querySelectorAll('.status-btn');
        const statusIndicator = dayItem.querySelector('.status-indicator');

        statusButtons.forEach(btn => btn.classList.remove('active'));
        statusButtons.forEach(btn => {
            if (btn.dataset.status === status) {
                btn.classList.add('active');
            }
        });

        // Обновляем индикатор статуса
        statusIndicator.className = `status-indicator status-${status}`;
    }

    async saveData() {
        try {
            // Показываем состояние загрузки
            const saveBtn = document.getElementById('saveBtn');
            saveBtn.textContent = 'Сохранение...';
            saveBtn.disabled = true;

            let serverSaved = false;
            let errorMessage = '';

            // ПРИОРИТЕТ: пытаемся сохранить на сервере с улучшенными настройками
            try {
                const response = await fetch('save-data.php', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache',
                        'Connection': 'close'  // Принуждает HTTP/1.1
                    },
                    body: JSON.stringify(this.workingHours, null, 2),
                    // Добавляем настройки для совместимости
                    cache: 'no-cache',
                    mode: 'cors',
                    credentials: 'same-origin'
                });

                if (response.ok) {
                    const result = await response.json();
                    serverSaved = true;
                    console.log('✅ Данные сохранены на сервере:', result);
                } else {
                    const errorData = await response.text();
                    errorMessage = `Ошибка сервера: ${response.status}`;
                    console.log('❌ Ошибка сохранения на сервере:', errorData);
                }
            } catch (error) {
                errorMessage = 'Сервер недоступен или проблемы с подключением';
                console.log('⚠️ Ошибка подключения:', error);

                // Дополнительная попытка с другими настройками
                try {
                    console.log('🔄 Пытаемся повторить запрос...');
                    const retryResponse = await fetch('save-data.php', {
                        method: 'POST', // Пробуем POST вместо PUT
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(this.workingHours, null, 2)
                    });

                    if (retryResponse.ok) {
                        const result = await retryResponse.json();
                        serverSaved = true;
                        console.log('✅ Данные сохранены на сервере (повторная попытка):', result);
                    }
                } catch (retryError) {
                    console.log('❌ Повторная попытка не удалась:', retryError);
                }
            }

            if (serverSaved) {
                // Если успешно сохранили на сервере, также сохраняем в localStorage как кэш
                localStorage.setItem('workingHoursData', JSON.stringify(this.workingHours));
                this.updateMainPageData();
                this.showMessage('✅ Данные успешно сохранены на сервере!', 'success');
            } else {
                // Если сервер недоступен, сохраняем локально как резерв
                localStorage.setItem('workingHoursData', JSON.stringify(this.workingHours));
                this.updateMainPageData();
                this.downloadJSON(); // Предлагаем скачать файл для ручной установки
                this.showMessage(`⚠️ ${errorMessage}. Данные сохранены локально и файл скачан для ручной установки.`, 'warning');
            }

        } catch (error) {
            console.error('Ошибка сохранения:', error);

            // В крайнем случае сохраняем хотя бы локально
            localStorage.setItem('workingHoursData', JSON.stringify(this.workingHours));
            this.updateMainPageData();
            this.downloadJSON();
            this.showMessage('❌ Ошибка сохранения. Данные сохранены локально.', 'error');
        } finally {
            // Восстанавливаем кнопку
            const saveBtn = document.getElementById('saveBtn');
            saveBtn.textContent = 'Сохранить изменения';
            saveBtn.disabled = false;
        }
    }

    updateMainPageData() {
        // Отправляем событие для обновления основной страницы
        if (window.opener && !window.opener.closed) {
            // Если админ панель открыта в новом окне
            window.opener.postMessage({
                type: 'workingHoursUpdate',
                data: this.workingHours
            }, '*');
        }

        // Также сохраняем в localStorage для других вкладок
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'workingHoursData',
            newValue: JSON.stringify(this.workingHours)
        }));

        console.log('🔄 Данные отправлены на основную страницу');
    }

    downloadJSON() {
        // Создаем файл для скачивания
        const dataStr = JSON.stringify(this.workingHours, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

        const exportFileDefaultName = 'working-hours.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        console.log('📁 Файл working-hours.json скачан');
    }

    showMessage(text, type) {
        const messageElement = document.getElementById('statusMessage');
        messageElement.textContent = text;
        messageElement.className = `status-message ${type}`;

        // Показываем сообщение
        setTimeout(() => {
            messageElement.classList.add('show');
        }, 100);

        // Скрываем через 5 секунд
        setTimeout(() => {
            messageElement.classList.remove('show');
        }, 5000);
    }

    loadSocialLinks() {
        // Инициализируем объект social_links если его нет
        if (!this.workingHours.social_links) {
            this.workingHours.social_links = {
                instagram: "",
                facebook: "",
                twitter: ""
            };
        }

        // Заполняем поля формы
        const instagramField = document.getElementById('instagramLink');
        const facebookField = document.getElementById('facebookLink');
        const twitterField = document.getElementById('twitterLink');

        if (instagramField) {
            instagramField.value = this.workingHours.social_links.instagram || '';
        }
        if (facebookField) {
            facebookField.value = this.workingHours.social_links.facebook || '';
        }
        if (twitterField) {
            twitterField.value = this.workingHours.social_links.twitter || '';
        }

        console.log('📱 Социальные ссылки загружены в форму');
    }

    bindSocialLinksEvents() {
        // Обработчики для полей социальных ссылок
        const instagramField = document.getElementById('instagramLink');
        const facebookField = document.getElementById('facebookLink');
        const twitterField = document.getElementById('twitterLink');

        if (instagramField) {
            instagramField.addEventListener('input', (e) => {
                if (!this.workingHours.social_links) {
                    this.workingHours.social_links = {};
                }
                this.workingHours.social_links.instagram = e.target.value;
                console.log('Instagram ссылка обновлена:', e.target.value);
            });
        }

        if (facebookField) {
            facebookField.addEventListener('input', (e) => {
                if (!this.workingHours.social_links) {
                    this.workingHours.social_links = {};
                }
                this.workingHours.social_links.facebook = e.target.value;
                console.log('Facebook ссылка обновлена:', e.target.value);
            });
        }

        if (twitterField) {
            twitterField.addEventListener('input', (e) => {
                if (!this.workingHours.social_links) {
                    this.workingHours.social_links = {};
                }
                this.workingHours.social_links.twitter = e.target.value;
                console.log('Twitter ссылка обновлена:', e.target.value);
            });
        }
    }
}

// Инициализация админ панели при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});

// Функции для валидации и форматирования
function validateTime(timeString) {
    const timeRegex = /^\d{1,2}:\d{2}\s*—\s*\d{1,2}:\d{2}$/;
    return timeRegex.test(timeString);
}

function formatTime(timeString) {
    return timeString.replace(/\s+/g, ' ').replace(/\s*—\s*/, ' — ');
}
