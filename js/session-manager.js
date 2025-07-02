// Универсальный менеджер сессий для всех страниц
class SessionManager {
    constructor() {
        this.SESSION_KEY = 'restaurant_session';
        this.TABLE_KEY = 'restaurant_table';
        this.EXPIRY_KEY = 'restaurant_session_expiry';
        this.SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 часа в миллисекундах
    }

    // Сохранить сессию в localStorage
    saveSession(sessionId, tableNumber) {
        if (!sessionId || !tableNumber) return false;

        const expiryTime = Date.now() + this.SESSION_DURATION;

        localStorage.setItem(this.SESSION_KEY, sessionId);
        localStorage.setItem(this.TABLE_KEY, tableNumber);
        localStorage.setItem(this.EXPIRY_KEY, expiryTime.toString());

        console.log('Session saved:', { sessionId, tableNumber, expiryTime: new Date(expiryTime) });
        return true;
    }

    // Получить сохраненную сессию
    getSession() {
        const sessionId = localStorage.getItem(this.SESSION_KEY);
        const tableNumber = localStorage.getItem(this.TABLE_KEY);
        const expiryTime = localStorage.getItem(this.EXPIRY_KEY);

        if (!sessionId || !tableNumber || !expiryTime) {
            return null;
        }

        // Проверить, не истекла ли сессия
        if (Date.now() > parseInt(expiryTime)) {
            this.clearSession();
            return null;
        }

        return {
            sessionId,
            tableNumber,
            expiryTime: parseInt(expiryTime)
        };
    }

    // Очистить сессию
    clearSession() {
        localStorage.removeItem(this.SESSION_KEY);
        localStorage.removeItem(this.TABLE_KEY);
        localStorage.removeItem(this.EXPIRY_KEY);
        console.log('Session cleared');
    }

    // Инициализация сессии из URL параметров или localStorage
    initializeSession() {
        // Сначала проверяем URL параметры
        const urlParams = new URLSearchParams(window.location.search);
        const urlSessionId = urlParams.get('session');
        const urlTableNumber = urlParams.get('table');

        if (urlSessionId && urlTableNumber) {
            // Если есть параметры в URL, сохраняем их и используем
            this.saveSession(urlSessionId, urlTableNumber);
            return { sessionId: urlSessionId, tableNumber: urlTableNumber };
        }

        // Если нет параметров в URL, пытаемся получить из localStorage
        const savedSession = this.getSession();
        if (savedSession) {
            return {
                sessionId: savedSession.sessionId,
                tableNumber: savedSession.tableNumber
            };
        }

        return null;
    }

    // Создать URL с параметрами сессии
    createSessionUrl(basePath) {
        const session = this.getSession();
        if (!session) return basePath;

        const url = new URL(basePath, window.location.origin);
        url.searchParams.set('session', session.sessionId);
        url.searchParams.set('table', session.tableNumber);

        return url.pathname + url.search;
    }

    // Обновить ссылки на странице для включения параметров сессии
    updateLinksWithSession() {
        const session = this.getSession();
        if (!session) return;

        // Обновляем все ссылки с относительными путями
        const links = document.querySelectorAll('a[href^="../"], a[href^="./"], a[href^="/"]');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.includes('session=')) {
                const url = new URL(href, window.location.origin);
                url.searchParams.set('session', session.sessionId);
                url.searchParams.set('table', session.tableNumber);
                link.setAttribute('href', url.pathname + url.search);
            }
        });

        // Обновляем кнопку Back в menu.html
        const backButton = document.querySelector('.back-button, a[href*="after-qr"]');
        if (backButton) {
            const href = backButton.getAttribute('href');
            if (href && href.includes('after-qr')) {
                const url = new URL(href, window.location.origin);
                url.searchParams.set('session', session.sessionId);
                url.searchParams.set('table', session.tableNumber);
                backButton.setAttribute('href', url.pathname + url.search);
            }
        }
    }

    // Проверить валидность сессии на сервере
    async validateSessionOnServer() {
        const session = this.getSession();
        if (!session) return false;

        try {
            const response = await fetch(`/api/sessions.php?action=validate&session_id=${encodeURIComponent(session.sessionId)}&table=${encodeURIComponent(session.tableNumber)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.warn('Server session validation failed with status:', response.status);
                // При серверных ошибках не очищаем сессию сразу
                return true; // Считаем валидной, если клиентская сессия еще действительна
            }

            const result = await response.json();

            if (!result.success || !result.valid) {
                console.warn('Server session validation failed:', result);
                this.clearSession();
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error validating session:', error);
            // При ошибке сети возвращаем true, если клиентская сессия еще действительна
            return true;
        }
    }

    // Обновить время истечения сессии (продлить сессию)
    refreshSession() {
        const session = this.getSession();
        if (!session) return false;

        const newExpiryTime = Date.now() + this.SESSION_DURATION;
        localStorage.setItem(this.EXPIRY_KEY, newExpiryTime.toString());

        console.log('Session refreshed, new expiry:', new Date(newExpiryTime));
        return true;
    }

    // Автоматическое обновление сессии при активности пользователя
    setupActivityTracking() {
        let lastActivity = Date.now();
        const ACTIVITY_THRESHOLD = 30 * 60 * 1000; // 30 минут

        const updateActivity = () => {
            const now = Date.now();
            if (now - lastActivity > ACTIVITY_THRESHOLD) {
                this.refreshSession();
            }
            lastActivity = now;
        };

        // Отслеживаем активность пользователя
        ['click', 'scroll', 'keypress', 'mousemove'].forEach(event => {
            document.addEventListener(event, updateActivity, { passive: true });
        });
    }

    // Показать модальное окно для сканирования QR
    showScanQRModal() {
        // Создаем модальное окно если его нет
        let modal = document.getElementById('scanQRModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'scanQRModal';
            modal.className = 'modal';
            modal.style.cssText = `
                display: none;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                align-items: center;
                justify-content: center;
            `;

            modal.innerHTML = `
                <div class="modal-content" style="
                    background: linear-gradient(145deg, rgba(24, 24, 24, 0.98), rgba(15, 15, 15, 0.95));
                    border: 2px solid rgba(239, 231, 210, 0.3);
                    border-radius: 20px;
                    padding: 40px;
                    max-width: 500px;
                    width: 90%;
                    text-align: center;
                    position: relative;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.7);
                ">
                    <h2 style="color: rgb(239, 231, 210); font-size: 24px; margin-bottom: 20px; font-weight: 600;">
                        🔒 Доступ ограничен
                    </h2>
                    <p style="color: rgba(239, 231, 210, 0.8); font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
                        Пожалуйста, отсканируйте QR-код на вашем столе, чтобы получить доступ к услугам ресторана.
                    </p>
                    <button onclick="window.location.href='../index.html'" style="
                        padding: 15px 25px;
                        border: none;
                        border-radius: 12px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        background: linear-gradient(145deg, rgb(239, 231, 210), rgb(207, 190, 145));
                        color: rgb(24, 24, 24);
                        transition: all 0.3s ease;
                    ">
                        Вернуться на главную
                    </button>
                </div>
            `;

            document.body.appendChild(modal);
        }

        modal.style.display = 'flex';
    }

    // Показать уведомление
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50px;
            right: 50px;
            background: linear-gradient(145deg, rgba(24, 24, 24, 0.95), rgba(15, 15, 15, 0.9));
            border: 1px solid rgba(239, 231, 210, 0.3);
            border-radius: 16px;
            padding: 20px 30px;
            color: rgb(239, 231, 210);
            backdrop-filter: blur(20px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
            z-index: 1000;
            max-width: 350px;
            font-size: 14px;
            line-height: 1.4;
            animation: slideIn 0.5s ease-out;
        `;

        if (type === 'error') {
            notification.style.borderColor = 'rgba(220, 53, 69, 0.5)';
            notification.style.background = 'linear-gradient(145deg, rgba(40, 20, 20, 0.95), rgba(30, 15, 15, 0.9))';
        }

        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease-in';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }
}

// Создаем глобальный экземпляр менеджера сессий
window.sessionManager = new SessionManager();

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    // Инициализируем сессию
    const session = sessionManager.initializeSession();

    // Настраиваем отслеживание активности пользователя
    sessionManager.setupActivityTracking();

    // Обновляем ссылки с параметрами сессии
    setTimeout(() => {
        sessionManager.updateLinksWithSession();
    }, 100);

    console.log('SessionManager initialized', session);
});
