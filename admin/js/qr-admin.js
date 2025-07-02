class QRAdminPanel {
    constructor() {
        this.tables = [];
        this.notifications = [];
        this.baseUrl = window.location.origin;
        this.init();
    }

    init() {
        this.createQRInterface();
        this.loadTables();
        this.loadNotifications();
        this.startNotificationPolling();
    }

    createQRInterface() {
        const container = document.getElementById('qrFormContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="qr-admin-container">
                <!-- Управление столиками -->
                <div class="card">
                    <div class="card-header">
                        <h2>🎯 Управление QR-кодами столиков</h2>
                        <p>Создавайте, управляйте и отслеживайте QR-коды для столиков ресторана</p>
                    </div>
                    <div class="card-body">
                        <!-- Быстрое создание -->
                        <div class="quick-actions">
                            <div class="form-group">
                                <label for="tableCount">Количество столиков:</label>
                                <div class="input-group">
                                    <input type="number" id="tableCount" min="1" max="100" value="15" class="form-control">
                                    <button onclick="qrAdmin.generateTables()" class="btn btn-primary">
                                        ⚡ Сгенерировать столики
                                    </button>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="baseUrl">Базовый URL:</label>
                                <input type="url" id="baseUrl" value="${this.baseUrl}" class="form-control"
                                       placeholder="https://callianolounge.eu">
                            </div>
                        </div>

                        <!-- Индивидуальное управление -->
                        <div class="individual-controls">
                            <h3>Индивидуальное управление</h3>
                            <div class="form-row">
                                <input type="number" id="singleTableNumber" placeholder="Номер столика"
                                       class="form-control" style="width: 150px;">
                                <button onclick="qrAdmin.createSingleTable()" class="btn btn-secondary">
                                    ➕ Добавить столик
                                </button>
                                <button onclick="qrAdmin.deleteAllTables()" class="btn btn-danger"
                                        style="margin-left: auto;">
                                    🗑️ Удалить все столики
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Список столиков -->
                <div class="card">
                    <div class="card-header">
                        <h3>📋 Активные столики</h3>
                        <div class="table-stats">
                            <span id="tableStats">Загрузка...</span>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="table-controls">
                            <input type="text" id="tableSearch" placeholder="🔍 Поиск по номеру столика..."
                                   class="form-control" onkeyup="qrAdmin.filterTables()">
                            <select id="statusFilter" onchange="qrAdmin.filterTables()" class="form-control">
                                <option value="">Все статусы</option>
                                <option value="active">Только активные</option>
                                <option value="inactive">Только неактивные</option>
                            </select>
                        </div>
                        <div id="tablesContainer" class="tables-grid">
                            <div class="loading">Загрузка столиков...</div>
                        </div>
                    </div>
                </div>

                <!-- Уведомления -->
                <div class="card">
                    <div class="card-header">
                        <h3>🔔 Уведомления от столиков</h3>
                        <div class="notification-controls">
                            <button onclick="qrAdmin.markAllNotificationsRead()" class="btn btn-secondary">
                                ✓ Отметить все как прочитанные
                            </button>
                            <button onclick="qrAdmin.clearOldNotifications()" class="btn btn-outline">
                                🧹 Очистить старые
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div id="notificationsContainer" class="notifications-list">
                            <div class="loading">Загрузка уведомлений...</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.addQRStyles();
    }

    addQRStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .qr-admin-container { gap: 20px; display: flex; flex-direction: column; }
            .quick-actions { display: flex; gap: 20px; margin-bottom: 20px; flex-wrap: wrap; }
            .input-group { display: flex; gap: 10px; align-items: end; }
            .form-row { display: flex; gap: 10px; align-items: center; }

            .tables-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px; }
            .table-card {
                border: 1px solid #ddd; border-radius: 8px; padding: 15px;
                background: #f9f9f9; transition: all 0.3s ease;
            }
            .table-card.active { border-color: #28a745; background: #f8fff9; }
            .table-card.inactive { border-color: #dc3545; background: #fff8f8; opacity: 0.7; }
            .table-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

            .table-header { display: flex; justify-content: between; align-items: center; margin-bottom: 10px; }
            .table-number { font-size: 18px; font-weight: bold; }
            .table-status {
                padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;
                color: white; text-transform: uppercase;
            }
            .table-status.active { background: #28a745; }
            .table-status.inactive { background: #dc3545; }

            .qr-link {
                font-family: monospace; font-size: 12px; color: #666;
                word-break: break-all; margin: 10px 0;
                background: #f5f5f5; padding: 8px; border-radius: 4px;
            }

            .table-actions { display: flex; gap: 8px; margin-top: 10px; }
            .table-actions button { font-size: 12px; padding: 6px 12px; }

            .notification-item {
                border-left: 4px solid #007bff; padding: 12px; margin-bottom: 10px;
                background: #f8f9fa; border-radius: 0 6px 6px 0;
            }
            .notification-item.unread { border-left-color: #dc3545; background: #fff5f5; }
            .notification-header { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .notification-type { font-weight: bold; color: #007bff; }
            .notification-time { font-size: 12px; color: #666; }
            .notification-message { font-size: 14px; }

            .table-controls { display: flex; gap: 15px; margin-bottom: 20px; align-items: center; }
            .table-controls input, .table-controls select { max-width: 200px; }

            .table-stats { font-size: 14px; color: #666; }
            .notification-controls { display: flex; gap: 10px; }

            .loading { text-align: center; padding: 40px; color: #666; }

            @media (max-width: 768px) {
                .tables-grid { grid-template-columns: 1fr; }
                .quick-actions { flex-direction: column; }
                .table-controls { flex-direction: column; align-items: stretch; }
                .table-controls input, .table-controls select { max-width: 100%; }
            }
        `;
        document.head.appendChild(style);
    }

    async generateTables() {
        const count = parseInt(document.getElementById('tableCount').value);
        const baseUrl = document.getElementById('baseUrl').value || this.baseUrl;

        if (!count || count < 1 || count > 100) {
            this.showMessage('Укажите корректное количество столиков (1-100)', 'error');
            return;
        }

        try {
            const response = await fetch('../api/tables.php?action=generate_links&count=' + count + '&base_url=' + encodeURIComponent(baseUrl));
            const result = await response.json();

            if (result.success) {
                this.showMessage(result.message, 'success');
                this.loadTables();
            } else {
                this.showMessage(result.error || 'Ошибка при генерации столиков', 'error');
            }
        } catch (error) {
            this.showMessage('Ошибка сети: ' + error.message, 'error');
        }
    }

    async createSingleTable() {
        const tableNumber = parseInt(document.getElementById('singleTableNumber').value);
        const baseUrl = document.getElementById('baseUrl').value || this.baseUrl;

        if (!tableNumber || tableNumber < 1) {
            this.showMessage('Укажите корректный номер столика', 'error');
            return;
        }

        try {
            const response = await fetch('../api/tables.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'create',
                    table_number: tableNumber,
                    base_url: baseUrl
                })
            });

            const result = await response.json();

            if (result.success) {
                this.showMessage(result.message, 'success');
                document.getElementById('singleTableNumber').value = '';
                this.loadTables();
            } else {
                this.showMessage(result.error || 'Ошибка при создании столика', 'error');
            }
        } catch (error) {
            this.showMessage('Ошибка сети: ' + error.message, 'error');
        }
    }

    async loadTables() {
        try {
            const response = await fetch('../api/tables.php?action=list');
            const result = await response.json();

            if (result.success) {
                this.tables = result.data;
                this.renderTables();
                this.updateTableStats();
            }
        } catch (error) {
            console.error('Error loading tables:', error);
            document.getElementById('tablesContainer').innerHTML =
                '<div class="error">Ошибка загрузки столиков</div>';
        }
    }

    renderTables() {
        const container = document.getElementById('tablesContainer');

        if (this.tables.length === 0) {
            container.innerHTML = '<div class="empty-state">Столики не созданы. Используйте форму выше для создания.</div>';
            return;
        }

        container.innerHTML = this.tables.map(table => `
            <div class="table-card ${table.is_active ? 'active' : 'inactive'}">
                <div class="table-header">
                    <span class="table-number">Столик #${table.table_number}</span>
                    <span class="table-status ${table.is_active ? 'active' : 'inactive'}">
                        ${table.is_active ? 'Активен' : 'Неактивен'}
                    </span>
                </div>

                <div class="qr-link">${table.qr_link}</div>

                <div class="table-info">
                    <small>Создан: ${new Date(table.created_at).toLocaleString('ru')}</small>
                    ${table.active_sessions > 0 ? `<br><small style="color: #28a745;">🟢 Активных сессий: ${table.active_sessions}</small>` : ''}
                </div>

                <div class="table-actions">
                    <button onclick="qrAdmin.copyTableLink('${table.qr_link}')" class="btn btn-outline" title="Копировать ссылку">
                        📋
                    </button>
                    <button onclick="qrAdmin.generateQRCode('${table.qr_link}', ${table.table_number})" class="btn btn-outline" title="QR-код">
                        📱
                    </button>
                    <button onclick="qrAdmin.toggleTableStatus(${table.id})" class="btn btn-secondary" title="Переключить статус">
                        ${table.is_active ? '⏸️' : '▶️'}
                    </button>
                    <button onclick="qrAdmin.deleteTable(${table.id})" class="btn btn-danger" title="Удалить">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateTableStats() {
        const total = this.tables.length;
        const active = this.tables.filter(t => t.is_active).length;
        const withSessions = this.tables.filter(t => t.active_sessions > 0).length;

        document.getElementById('tableStats').textContent =
            `Всего: ${total} | Активных: ${active} | С сессиями: ${withSessions}`;
    }

    filterTables() {
        const searchTerm = document.getElementById('tableSearch').value.toLowerCase();
        const statusFilter = document.getElementById('statusFilter').value;

        let filtered = this.tables;

        if (searchTerm) {
            filtered = filtered.filter(table =>
                table.table_number.toString().includes(searchTerm)
            );
        }

        if (statusFilter) {
            filtered = filtered.filter(table =>
                statusFilter === 'active' ? table.is_active : !table.is_active
            );
        }

        // Временно сохраняем оригинальный массив и заменяем для рендера
        const originalTables = this.tables;
        this.tables = filtered;
        this.renderTables();
        this.tables = originalTables;
    }

    async toggleTableStatus(tableId) {
        try {
            const response = await fetch('../api/tables.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'toggle_status',
                    table_id: tableId
                })
            });

            const result = await response.json();

            if (result.success) {
                this.showMessage(result.message, 'success');
                this.loadTables();
            } else {
                this.showMessage(result.error || 'Ошибка при изменении статуса', 'error');
            }
        } catch (error) {
            this.showMessage('Ошибка сети: ' + error.message, 'error');
        }
    }

    async deleteTable(tableId) {
        if (!confirm('Вы уверены, что хотите удалить этот столик? Это действие нельзя отменить.')) {
            return;
        }

        try {
            console.log('Удаляем столик с ID:', tableId);

            const response = await fetch('../api/tables.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'delete_single',
                    table_id: tableId
                })
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Delete result:', result);

            if (result.success) {
                this.showMessage(result.message, 'success');
                this.loadTables();
            } else {
                this.showMessage(result.error || 'Ошибка при удалении столика', 'error');
            }
        } catch (error) {
            console.error('Delete error:', error);
            this.showMessage('Ошибка сети: ' + error.message, 'error');
        }
    }

    async deleteAllTables() {
        if (!confirm('Вы уверены, что хотите удалить ВСЕ столики? Это действие нельзя отменить!')) {
            return;
        }

        try {
            console.log('Удаляем все столики');

            const response = await fetch('../api/tables.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete_all' })
            });

            console.log('Delete all response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Delete all result:', result);

            if (result.success) {
                this.showMessage(result.message, 'success');
                this.loadTables();
            } else {
                this.showMessage(result.error || 'Ошибка при удалении столиков', 'error');
            }
        } catch (error) {
            console.error('Delete all error:', error);
            this.showMessage('Ошибка сети: ' + error.message, 'error');
        }
    }

    copyTableLink(link) {
        navigator.clipboard.writeText(link).then(() => {
            this.showMessage('Ссылка скопирована в буфер обмена', 'success');
        }).catch(() => {
            // Fallback для старых браузеров
            const textArea = document.createElement('textarea');
            textArea.value = link;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showMessage('Ссылка скопирована', 'success');
        });
    }

    generateQRCode(link, tableNumber) {
        // Открываем окно с QR-кодом (используем внешний сервис)
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}`;
        const newWindow = window.open('', '_blank', 'width=400,height=450');
        newWindow.document.write(`
            <html>
                <head><title>QR-код для столика #${tableNumber}</title></head>
                <body style="text-align: center; padding: 20px; font-family: Arial;">
                    <h2>QR-код для столика #${tableNumber}</h2>
                    <img src="${qrUrl}" alt="QR Code" style="border: 1px solid #ddd;">
                    <p style="font-size: 12px; color: #666; word-break: break-all;">${link}</p>
                    <button onclick="window.print()" style="padding: 10px 20px; margin: 10px;">Печать</button>
                    <button onclick="window.close()" style="padding: 10px 20px; margin: 10px;">Закрыть</button>
                </body>
            </html>
        `);
    }

    async loadNotifications() {
        try {
            const response = await fetch('../api/notifications.php?action=list&limit=20');
            const result = await response.json();

            if (result.success) {
                this.notifications = result.data;
                this.renderNotifications();
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    }

    renderNotifications() {
        const container = document.getElementById('notificationsContainer');

        if (this.notifications.length === 0) {
            container.innerHTML = '<div class="empty-state">Уведомлений пока нет</div>';
            return;
        }

        container.innerHTML = this.notifications.map(notification => `
            <div class="notification-item ${notification.is_read ? '' : 'unread'}">
                <div class="notification-header">
                    <span class="notification-type">
                        ${notification.type_display} - Столик #${notification.table_number}
                    </span>
                    <span class="notification-time">
                        ${new Date(notification.created_at).toLocaleString('ru')}
                    </span>
                </div>
                ${notification.message ? `<div class="notification-message">${notification.message}</div>` : ''}
                ${!notification.is_read ? `
                    <button onclick="qrAdmin.markNotificationRead(${notification.id})"
                            class="btn btn-sm btn-outline" style="margin-top: 8px;">
                        ✓ Отметить как прочитанное
                    </button>
                ` : ''}
            </div>
        `).join('');
    }

    async markNotificationRead(notificationId) {
        try {
            const response = await fetch('../api/notifications.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'mark_read',
                    notification_id: notificationId
                })
            });

            const result = await response.json();

            if (result.success) {
                this.loadNotifications();
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }

    async markAllNotificationsRead() {
        try {
            const response = await fetch('../api/notifications.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'mark_all_read' })
            });

            const result = await response.json();

            if (result.success) {
                this.showMessage(result.message, 'success');
                this.loadNotifications();
            }
        } catch (error) {
            this.showMessage('Ошибка при отметке уведомлений', 'error');
        }
    }

    async clearOldNotifications() {
        if (!confirm('Удалить уведомления старше 7 дней?')) return;

        try {
            const response = await fetch('../api/notifications.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'old',
                    days: 7
                })
            });

            const result = await response.json();

            if (result.success) {
                this.showMessage(result.message, 'success');
                this.loadNotifications();
            }
        } catch (error) {
            this.showMessage('Ошибка при очистке уведомлений', 'error');
        }
    }

    startNotificationPolling() {
        // Обновляем уведомления каждые 30 секунд
        setInterval(() => {
            this.loadNotifications();
        }, 30000);
    }

    showMessage(message, type = 'info') {
        const statusDiv = document.getElementById('statusMessage');
        if (statusDiv) {
            statusDiv.textContent = message;
            statusDiv.className = `status-message ${type}`;
            statusDiv.style.display = 'block';

            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 5000);
        }
    }
}

// Глобальная переменная для доступа из HTML
