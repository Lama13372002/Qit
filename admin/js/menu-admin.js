class MenuAdminPanel {
    constructor() {
        this.menuData = null;
        this.currentEditingItem = null;
        this.currentEditingCategory = null;
        this.init();
    }

    async init() {
        await this.loadData();
        this.renderMenuForm();
        this.renderPreview();
        this.bindEvents();
    }

    async loadData() {
        try {
            const timestamp = Date.now();
            const response = await fetch(`../data/menu-data.json?v=${timestamp}&_cache=no`, {
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
            this.menuData = await response.json();
            console.log('📡 Данные меню загружены с сервера');
        } catch (error) {
            console.error('Ошибка загрузки данных меню:', error);

            // Fallback к localStorage
            const localData = localStorage.getItem('menuData');
            if (localData) {
                this.menuData = JSON.parse(localData);
                console.log('⚠️ Данные меню загружены из localStorage');
                this.showMessage('Данные загружены из кэша (сервер недоступен)', 'warning');
                return;
            }

            // Дефолтные данные
            this.showMessage('Ошибка загрузки данных меню', 'error');
            this.menuData = this.getDefaultData();
        }
    }

    getDefaultData() {
        return {
            pageTitle: "Menu",
            hero: {
                backgroundImage: "",
                title: "Menu"
            },
            categories: [
                {
                    id: "maki",
                    name: "Maki",
                    items: []
                }
            ]
        };
    }

    renderMenuForm() {
        const container = document.getElementById('menuFormContainer');
        container.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h2>Настройка меню</h2>
                    <p>Управление категориями и блюдами ресторана</p>
                    <div class="card-actions">
                        <button type="button" class="btn btn-warning" id="forceUpdateMenuBtn">Принудительно обновить страницу меню</button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="form-group">
                        <label for="menuPageTitle">Заголовок страницы:</label>
                        <input type="text" id="menuPageTitle" value="${this.menuData.pageTitle}" class="form-control">
                    </div>

                    <div class="form-group">
                        <label for="menuHeroTitle">Заголовок героя:</label>
                        <input type="text" id="menuHeroTitle" value="${this.menuData.hero.title}" class="form-control">
                    </div>

                    <div class="form-group">
                        <label for="menuHeroImage">Фоновое изображение героя (URL):</label>
                        <input type="url" id="menuHeroImage" value="${this.menuData.hero.backgroundImage}" class="form-control" placeholder="https://example.com/image.jpg">
                    </div>

                    <div class="categories-section">
                        <div class="section-header">
                            <h3>Категории меню</h3>
                            <button type="button" class="btn btn-success" id="addCategoryBtn">+ Добавить категорию</button>
                        </div>
                        <div id="categoriesContainer">
                            <!-- Категории будут добавлены динамически -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- Модальное окно для редактирования блюда -->
            <div id="itemModal" class="modal" style="display: none;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="modalTitle">Добавить блюдо</h3>
                        <span class="modal-close">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="itemName">Название блюда:</label>
                            <input type="text" id="itemName" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="itemPrice">Цена:</label>
                            <input type="text" id="itemPrice" class="form-control" placeholder="$12">
                        </div>
                        <div class="form-group">
                            <label for="itemDescription">Описание:</label>
                            <textarea id="itemDescription" class="form-control" rows="3"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="itemImage">Изображение (URL):</label>
                            <input type="url" id="itemImage" class="form-control" placeholder="https://example.com/image.jpg">
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="itemSpicy"> Острое блюдо
                            </label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="cancelItemBtn">Отмена</button>
                        <button type="button" class="btn btn-primary" id="saveItemBtn">Сохранить</button>
                    </div>
                </div>
            </div>
        `;

        this.renderCategories();

        // Добавляем обработчик для кнопки принудительного обновления
        document.getElementById('forceUpdateMenuBtn').addEventListener('click', () => {
            this.forceUpdateMenuPage();
        });
    }

    renderCategories() {
        const container = document.getElementById('categoriesContainer');
        container.innerHTML = '';

        this.menuData.categories.forEach((category, categoryIndex) => {
            const categoryElement = this.createCategoryElement(category, categoryIndex);
            container.appendChild(categoryElement);
        });
    }

    createCategoryElement(category, categoryIndex) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category-item';
        categoryDiv.innerHTML = `
            <div class="category-header">
                <div class="category-title">
                    <input type="text" value="${category.name}" class="category-name-input" data-category-index="${categoryIndex}">
                    <label>
                        <input type="checkbox" class="category-spicy-input" data-category-index="${categoryIndex}" ${category.spicy ? 'checked' : ''}>
                        Острая категория
                    </label>
                </div>
                <div class="category-actions">
                    <button type="button" class="btn btn-sm btn-success add-item-btn" data-category-index="${categoryIndex}">+ Добавить блюдо</button>
                    <button type="button" class="btn btn-sm btn-danger delete-category-btn" data-category-index="${categoryIndex}">Удалить категорию</button>
                </div>
            </div>
            <div class="items-container" data-category-index="${categoryIndex}">
                ${this.renderItems(category.items, categoryIndex)}
            </div>
        `;

        return categoryDiv;
    }

    renderItems(items, categoryIndex) {
        return items.map((item, itemIndex) => `
            <div class="item-card" data-category-index="${categoryIndex}" data-item-index="${itemIndex}">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\"><rect width=\"100\" height=\"100\" fill=\"%23ddd\"/><text x=\"50\" y=\"55\" text-anchor=\"middle\" fill=\"%23999\">No Image</text></svg>'">
                </div>
                <div class="item-content">
                    <div class="item-header">
                        <h4>${item.name} ${item.spicy ? '🌶️' : ''}</h4>
                        <span class="item-price">${item.price}</span>
                    </div>
                    <p class="item-description">${item.description}</p>
                    <div class="item-actions">
                        <button type="button" class="btn btn-sm btn-primary edit-item-btn" data-category-index="${categoryIndex}" data-item-index="${itemIndex}">Редактировать</button>
                        <button type="button" class="btn btn-sm btn-danger delete-item-btn" data-category-index="${categoryIndex}" data-item-index="${itemIndex}">Удалить</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    bindEvents() {
        // Основные поля формы
        document.getElementById('menuPageTitle').addEventListener('input', () => this.updateData());
        document.getElementById('menuHeroTitle').addEventListener('input', () => this.updateData());
        document.getElementById('menuHeroImage').addEventListener('input', () => this.updateData());

        // Добавление категории
        document.getElementById('addCategoryBtn').addEventListener('click', () => this.addCategory());

        // Делегирование событий для динамических элементов
        document.getElementById('categoriesContainer').addEventListener('click', (e) => {
            const categoryIndex = e.target.dataset.categoryIndex;
            const itemIndex = e.target.dataset.itemIndex;

            if (e.target.classList.contains('add-item-btn')) {
                this.openItemModal(parseInt(categoryIndex));
            } else if (e.target.classList.contains('edit-item-btn')) {
                this.openItemModal(parseInt(categoryIndex), parseInt(itemIndex));
            } else if (e.target.classList.contains('delete-item-btn')) {
                this.deleteItem(parseInt(categoryIndex), parseInt(itemIndex));
            } else if (e.target.classList.contains('delete-category-btn')) {
                this.deleteCategory(parseInt(categoryIndex));
            }
        });

        // События для изменения названий категорий
        document.getElementById('categoriesContainer').addEventListener('input', (e) => {
            if (e.target.classList.contains('category-name-input')) {
                const categoryIndex = parseInt(e.target.dataset.categoryIndex);
                this.menuData.categories[categoryIndex].name = e.target.value;
                this.renderPreview();
            } else if (e.target.classList.contains('category-spicy-input')) {
                const categoryIndex = parseInt(e.target.dataset.categoryIndex);
                this.menuData.categories[categoryIndex].spicy = e.target.checked;
                this.renderPreview();
            }
        });

        // Модальное окно
        document.getElementById('cancelItemBtn').addEventListener('click', () => this.closeItemModal());
        document.getElementById('saveItemBtn').addEventListener('click', () => this.saveItem());
        document.querySelector('.modal-close').addEventListener('click', () => this.closeItemModal());

        // Закрытие модального окна по клику вне его
        document.getElementById('itemModal').addEventListener('click', (e) => {
            if (e.target.id === 'itemModal') {
                this.closeItemModal();
            }
        });
    }

    updateData() {
        this.menuData.pageTitle = document.getElementById('menuPageTitle').value;
        this.menuData.hero.title = document.getElementById('menuHeroTitle').value;
        this.menuData.hero.backgroundImage = document.getElementById('menuHeroImage').value;
        this.renderPreview();
    }

    addCategory() {
        // Генерируем уникальный ID, основанный на текущем времени и случайности
        const timestamp = Date.now();
        const randomPart = Math.floor(Math.random() * 10000);
        const uniqueId = `category-${timestamp}-${randomPart}`;

        // Создаем базовое название категории на основе количества существующих категорий
        let categoryNumber = this.menuData.categories.length + 1;
        let categoryName = `Новая категория ${categoryNumber}`;

        // Проверяем, не существует ли уже категория с таким названием
        while (this.menuData.categories.some(cat => cat.name === categoryName)) {
            categoryNumber++;
            categoryName = `Новая категория ${categoryNumber}`;
        }

        const newCategory = {
            id: uniqueId,
            name: categoryName,
            items: []
        };

        this.menuData.categories.push(newCategory);
        this.renderCategories();
        this.renderPreview();

        // Показываем уведомление об успешном добавлении категории
        this.showMessage(`Категория "${categoryName}" успешно добавлена`, 'success');

        // Автоматически раскрываем новую категорию для редактирования
        setTimeout(() => {
            const newCategoryElement = document.querySelector(`.category-item[data-category-index="${this.menuData.categories.length - 1}"]`);
            if (newCategoryElement) {
                newCategoryElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const categoryNameInput = newCategoryElement.querySelector('.category-name-input');
                if (categoryNameInput) {
                    categoryNameInput.focus();
                    categoryNameInput.select();
                }
            }
        }, 100);
    }

    deleteCategory(categoryIndex) {
        // Получаем название категории для подтверждения
        const categoryName = this.menuData.categories[categoryIndex]?.name || `Категория ${categoryIndex + 1}`;

        if (confirm(`Вы уверены, что хотите удалить категорию "${categoryName}" и все блюда в ней?`)) {
            // Удаляем категорию из массива
            this.menuData.categories.splice(categoryIndex, 1);

            // Обновляем интерфейс
            this.renderCategories();
            this.renderPreview();

            // Если все категории удалены, показываем сообщение
            if (this.menuData.categories.length === 0) {
                this.showMessage('Все категории удалены. Для добавления новой категории нажмите "Добавить категорию"', 'info');

                // Обновляем превью с пустым содержимым
                const previewContent = document.getElementById('previewContent');
                if (previewContent) {
                    previewContent.innerHTML = `
                        <div class="preview-empty">
                            <p>В меню нет категорий. Добавьте новую категорию.</p>
                        </div>
                    `;
                }
            } else {
                // Показываем сообщение об успешном удалении
                this.showMessage(`Категория "${categoryName}" успешно удалена`, 'success');
            }

            // Автоматически сохраняем данные после удаления категории
            this.saveData();
        }
    }

    openItemModal(categoryIndex, itemIndex = null) {
        this.currentEditingCategory = categoryIndex;
        this.currentEditingItem = itemIndex;

        const modal = document.getElementById('itemModal');
        const title = document.getElementById('modalTitle');

        if (itemIndex !== null) {
            // Редактирование существующего блюда
            const item = this.menuData.categories[categoryIndex].items[itemIndex];
            title.textContent = 'Редактировать блюдо';
            document.getElementById('itemName').value = item.name;
            document.getElementById('itemPrice').value = item.price;
            document.getElementById('itemDescription').value = item.description;
            document.getElementById('itemImage').value = item.image;
            document.getElementById('itemSpicy').checked = item.spicy || false;
        } else {
            // Добавление нового блюда
            title.textContent = 'Добавить блюдо';
            document.getElementById('itemName').value = '';
            document.getElementById('itemPrice').value = '';
            document.getElementById('itemDescription').value = '';
            document.getElementById('itemImage').value = '';
            document.getElementById('itemSpicy').checked = false;
        }

        modal.style.display = 'block';
    }

    closeItemModal() {
        document.getElementById('itemModal').style.display = 'none';
        this.currentEditingCategory = null;
        this.currentEditingItem = null;
    }

    saveItem() {
        const name = document.getElementById('itemName').value.trim();
        const price = document.getElementById('itemPrice').value.trim();
        const description = document.getElementById('itemDescription').value.trim();
        const image = document.getElementById('itemImage').value.trim();
        const spicy = document.getElementById('itemSpicy').checked;

        if (!name || !price || !description) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }

        const itemData = {
            id: this.currentEditingItem !== null ?
                this.menuData.categories[this.currentEditingCategory].items[this.currentEditingItem].id :
                `item-${Date.now()}`,
            name,
            price,
            description,
            image: image || 'https://via.placeholder.com/150x150?text=No+Image',
            spicy
        };

        if (this.currentEditingItem !== null) {
            // Обновление существующего блюда
            this.menuData.categories[this.currentEditingCategory].items[this.currentEditingItem] = itemData;
        } else {
            // Добавление нового блюда
            this.menuData.categories[this.currentEditingCategory].items.push(itemData);
        }

        this.closeItemModal();
        this.renderCategories();
        this.renderPreview();
    }

    deleteItem(categoryIndex, itemIndex) {
        if (confirm('Вы уверены, что хотите удалить это блюдо?')) {
            this.menuData.categories[categoryIndex].items.splice(itemIndex, 1);
            this.renderCategories();
            this.renderPreview();
        }
    }

    renderPreview() {
        const previewContent = document.getElementById('previewContent');
        let previewHTML = `
            <div class="menu-preview">
                <div class="preview-hero">
                    <h2>${this.menuData.hero.title}</h2>
                    ${this.menuData.hero.backgroundImage ? `<img src="${this.menuData.hero.backgroundImage}" alt="Hero" style="max-width: 200px;">` : ''}
                </div>
        `;

        this.menuData.categories.forEach(category => {
            previewHTML += `
                <div class="preview-category">
                    <h3>${category.name} ${category.spicy ? '🌶️' : ''}</h3>
                    <div class="preview-items">
            `;

            category.items.forEach(item => {
                previewHTML += `
                    <div class="preview-item">
                        <div class="preview-item-image">
                            <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
                        </div>
                        <div class="preview-item-content">
                            <div class="preview-item-header">
                                <span class="preview-item-name">${item.name} ${item.spicy ? '🌶️' : ''}</span>
                                <span class="preview-item-price">${item.price}</span>
                            </div>
                            <p class="preview-item-description">${item.description}</p>
                        </div>
                    </div>
                `;
            });

            previewHTML += `
                    </div>
                </div>
            `;
        });

        previewHTML += '</div>';
        previewContent.innerHTML = previewHTML;
    }

    async saveData() {
        try {
            let serverSaved = false;
            let errorMessage = '';

            // ПРИОРИТЕТ: пытаемся сохранить на сервере с улучшенными настройками
            try {
                const response = await fetch('save-menu-data.php', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache',
                        'Connection': 'close'  // Принуждает HTTP/1.1
                    },
                    body: JSON.stringify(this.menuData, null, 2),
                    // Добавляем настройки для совместимости
                    cache: 'no-cache',
                    mode: 'cors',
                    credentials: 'same-origin'
                });

                if (response.ok) {
                    const result = await response.json();
                    serverSaved = true;
                    console.log('✅ Данные меню сохранены на сервере:', result);
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
                    const retryResponse = await fetch('save-menu-data.php', {
                        method: 'POST', // Пробуем POST вместо PUT
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(this.menuData, null, 2)
                    });

                    if (retryResponse.ok) {
                        const result = await retryResponse.json();
                        serverSaved = true;
                        console.log('✅ Данные меню сохранены на сервере (повторная попытка):', result);
                    }
                } catch (retryError) {
                    console.log('❌ Повторная попытка не удалась:', retryError);
                }
            }

            if (serverSaved) {
                // Если успешно сохранили на сервере, также сохраняем в localStorage как кэш
                localStorage.setItem('menuData', JSON.stringify(this.menuData));
                this.notifyAllChannels();
                this.showMessage('✅ Данные меню успешно сохранены на сервере!', 'success');
                console.log('🔄 Данные меню отправлены на страницу (все методы)');
            } else {
                // Если сервер недоступен, сохраняем локально как резерв
                localStorage.setItem('menuData', JSON.stringify(this.menuData));
                this.notifyAllChannels();
                this.showMessage(`⚠️ ${errorMessage}. Данные сохранены локально.`, 'warning');
                console.log('📁 Файл menu-data.json скачан');
            }

            // Обновляем предпросмотр
            this.renderPreview();
            return serverSaved;

        } catch (error) {
            console.error('Ошибка сохранения:', error);

            // В крайнем случае сохраняем хотя бы локально
            localStorage.setItem('menuData', JSON.stringify(this.menuData));
            this.notifyAllChannels();
            this.showMessage('❌ Ошибка сохранения. Данные сохранены локально.', 'error');
            this.renderPreview();
            return false;
        }
    }

    notifyAllChannels() {
        try {
            // 1. Используем localStorage для передачи данных между вкладками
            const timestamp = Date.now();
            localStorage.setItem('menuDataTimestamp', timestamp.toString());

            // 2. Используем postMessage для всех открытых фреймов с меню
            this.notifyViaPostMessage();

            // 3. Используем BroadcastChannel API если доступен
            this.notifyViaBroadcastChannel();

            // 4. Вызываем специальное событие для страниц в том же окне
            this.notifyViaCustomEvent();

            console.log('🔄 Отправлены уведомления об изменениях по всем каналам');
        } catch (error) {
            console.error('Ошибка при отправке уведомлений:', error);
        }
    }

    notifyViaPostMessage() {
        try {
            // Находим все фреймы на странице
            const iframes = document.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                try {
                    iframe.contentWindow.postMessage({
                        type: 'menuDataUpdate',
                        data: this.menuData,
                        source: 'admin-panel',
                        timestamp: Date.now()
                    }, '*');
                } catch (frameError) {
                    console.log('Не удалось отправить сообщение фрейму:', frameError);
                }
            });

            // Также отправляем сообщение родительскому окну, если мы во фрейме
            if (window.parent !== window) {
                window.parent.postMessage({
                    type: 'menuDataUpdate',
                    data: this.menuData,
                    source: 'admin-panel',
                    timestamp: Date.now()
                }, '*');
            }

            // И всем открытым окнам меню
            if (window.opener) {
                window.opener.postMessage({
                    type: 'menuDataUpdate',
                    data: this.menuData,
                    source: 'admin-panel',
                    timestamp: Date.now()
                }, '*');
            }
        } catch (error) {
            console.error('Ошибка при отправке postMessage:', error);
        }
    }

    notifyViaBroadcastChannel() {
        try {
            if (typeof BroadcastChannel !== 'undefined') {
                const channel = new BroadcastChannel('menuUpdates');
                channel.postMessage({
                    type: 'menuDataUpdate',
                    data: this.menuData,
                    source: 'admin-panel',
                    timestamp: Date.now()
                });

                // Закрываем канал после отправки сообщения
                setTimeout(() => {
                    channel.close();
                }, 1000);
            }
        } catch (error) {
            console.log('BroadcastChannel не поддерживается в этом браузере:', error);
        }
    }

    notifyViaCustomEvent() {
        try {
            // Создаем и диспатчим кастомное событие
            const event = new CustomEvent('menuDataForceUpdate', {
                detail: {
                    data: this.menuData,
                    source: 'admin-panel',
                    timestamp: Date.now()
                }
            });
            window.dispatchEvent(event);

            // Если есть доступная страница меню в этом же документе
            document.querySelectorAll('[data-menu-container]').forEach(container => {
                container.dispatchEvent(event);
            });
        } catch (error) {
            console.error('Ошибка при отправке CustomEvent:', error);
        }
    }

    showMessage(text, type) {
        const messageEl = document.getElementById('statusMessage');
        messageEl.textContent = text;
        messageEl.className = `status-message ${type}`;
        messageEl.style.display = 'block';

        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 3000);
    }

    // Метод для принудительного обновления страницы меню
    forceUpdateMenuPage() {
        try {
            // Создаем событие для всех открытых окон/вкладок
            const timestamp = Date.now();

            // 1. Обновляем метку времени в localStorage для триггера событий storage
            localStorage.removeItem('menuData');
            localStorage.setItem('menuData', JSON.stringify(this.menuData));
            localStorage.setItem('menuDataTimestamp', timestamp.toString());

            // 2. Добавляем special флаг для принудительного обновления
            localStorage.setItem('menuForceReload', 'true');

            // 3. Используем BroadcastChannel если доступен
            this.notifyViaBroadcastChannel();

            // 4. Используем postMessage для всех открытых фреймов
            this.notifyViaPostMessage();

            // 5. Используем кастомные события
            this.notifyViaCustomEvent();

            // Показываем сообщение
            this.showMessage('Отправлен сигнал принудительного обновления страницы меню', 'success');

            console.log('🔄 Отправлен сигнал принудительного обновления');

            // Через 2 секунды удаляем флаг
            setTimeout(() => {
                localStorage.removeItem('menuForceReload');
            }, 2000);

            return true;
        } catch (error) {
            console.error('Ошибка при принудительном обновлении:', error);
            this.showMessage('Ошибка при отправке сигнала обновления: ' + error.message, 'error');
            return false;
        }
    }
}
