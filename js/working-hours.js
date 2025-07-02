class WorkingHoursDisplay {
    constructor() {
        this.workingHours = null;
        this.init();
        this.setupAutoUpdate();
    }

    async init() {
        await this.loadData();
        this.updateDisplay();
    }

    async loadData() {
        try {
            // ВСЕГДА загружаем с сервера для получения актуальных данных
            // Добавляем параметры для лучшей совместимости с разными протоколами
            const timestamp = Date.now();
            const response = await fetch(`data/working-hours.json?v=${timestamp}&_cache=no`, {
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
                throw new Error(`Ошибка загрузки данных рабочих часов: ${response.status}`);
            }
            this.workingHours = await response.json();
            console.log('📡 Загружены данные с сервера');

            // Сохраняем в localStorage как кэш для быстрого доступа
            localStorage.setItem('workingHoursData', JSON.stringify(this.workingHours));
        } catch (error) {
            console.error('Ошибка загрузки данных рабочих часов:', error);

            // Если сервер недоступен, пытаемся загрузить из localStorage как fallback
            const localData = localStorage.getItem('workingHoursData');
            if (localData) {
                this.workingHours = JSON.parse(localData);
                console.log('⚠️ Загружены данные из localStorage (сервер недоступен)');
                return;
            }

            // Если ничего нет, используем дефолтные данные
            this.workingHours = this.getDefaultData();
            console.log('🔧 Используются дефолтные данные');
        }
    }

    setupAutoUpdate() {
        // Слушаем изменения localStorage (для обновлений из админки)
        window.addEventListener('storage', (e) => {
            if (e.key === 'workingHoursData' && e.newValue) {
                console.log('🔄 Получено обновление из админ панели');
                this.workingHours = JSON.parse(e.newValue);
                this.updateDisplay();
                this.showUpdateNotification();
            }
        });

        // Слушаем сообщения от админ панели (если она в новом окне)
        window.addEventListener('message', (e) => {
            if (e.data.type === 'workingHoursUpdate') {
                console.log('🔄 Получено обновление от админ панели');
                this.workingHours = e.data.data;
                this.updateDisplay();
                this.showUpdateNotification();
            }
        });
    }

    showUpdateNotification() {
        // Показываем небольшое уведомление об обновлении
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, rgb(34, 197, 94) 0%, rgb(22, 163, 74) 100%);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
            z-index: 10000;
            transform: translateX(400px);
            transition: all 0.3s ease;
        `;
        notification.textContent = '✅ Рабочие часы обновлены!';

        document.body.appendChild(notification);

        // Показываем
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Убираем через 3 секунды
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
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
            ]
        };
    }

    getStatusColor(status) {
        const colors = {
            'green': 'rgb(34, 197, 94)',
            'yellow': 'rgb(234, 179, 8)',
            'red': 'rgb(239, 68, 68)'
        };
        return colors[status] || colors['green'];
    }

    getStatusOpacity(status) {
        const opacities = {
            'green': '1',
            'yellow': '0.8',
            'red': '0.6'
        };
        return opacities[status] || opacities['green'];
    }

    updateDisplay() {
        // Находим контейнер с рабочими часами
        const workingHoursContainer = document.querySelector('.restaurant-info-card');
        if (!workingHoursContainer) {
            console.error('Контейнер рабочих часов не найден');
            return;
        }

        // Находим элементы для обновления
        const titleElement = workingHoursContainer.querySelector('h3');
        const daysContainer = workingHoursContainer.querySelector('div[style*="display: flex; flex-direction: column; gap: 8px;"]');

        if (!titleElement || !daysContainer) {
            console.error('Элементы рабочих часов не найдены');
            return;
        }

        // Обновляем заголовок
        titleElement.textContent = this.workingHours.title;

        // Очищаем контейнер дней
        daysContainer.innerHTML = '';

        // Создаем новые элементы для каждого дня
        this.workingHours.days.forEach(day => {
            const dayElement = this.createDayElement(day);
            daysContainer.appendChild(dayElement);
        });
    }

    createDayElement(day) {
        const dayDiv = document.createElement('div');

        // Определяем стили в зависимости от статуса
        let backgroundOpacity, borderOpacity;
        switch(day.status) {
            case 'green':
                backgroundOpacity = '0.05';
                borderOpacity = '0.1';
                break;
            case 'yellow':
                backgroundOpacity = '0.08';
                borderOpacity = '0.15';
                break;
            case 'red':
                backgroundOpacity = '0.03';
                borderOpacity = '0.08';
                break;
            default:
                backgroundOpacity = '0.05';
                borderOpacity = '0.1';
        }

        dayDiv.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 12px;
            border-radius: 8px;
            background: rgba(255, 255, 255, ${backgroundOpacity});
            border: 1px solid rgba(239, 231, 210, ${borderOpacity});
            margin-bottom: 8px;
        `;

        dayDiv.innerHTML = `
            <span style="font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; color: rgba(255, 255, 255, 0.95);">${day.name}</span>
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: rgb(239, 231, 210); font-weight: 600;">${day.time}</span>
                <span style="width: 6px; height: 6px; background-color: ${this.getStatusColor(day.status)}; border-radius: 50%; opacity: ${this.getStatusOpacity(day.status)};"></span>
            </div>
        `;

        return dayDiv;
    }

    // Метод для обновления данных (может быть вызван из админ панели)
    async refresh() {
        await this.loadData();
        this.updateDisplay();
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем только если мы на главной странице
    if (document.querySelector('.restaurant-info-card')) {
        window.workingHoursDisplay = new WorkingHoursDisplay();
    }
});

// Слушаем события обновления данных
window.addEventListener('workingHoursUpdated', (event) => {
    if (window.workingHoursDisplay) {
        window.workingHoursDisplay.refresh();
    }
});
