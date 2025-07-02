class MenuAdminPanel {
    constructor() {
        this.menuData = null;
        this.currentEditingItem = null;
        this.currentEditingCategory = null;
        this.currentEditLang = 'en'; // Язык редактирования по умолчанию
        this.init();
    }

    async init() {
        await this.loadData();
        this.renderMenuForm(); // Сначала рендерим форму
        this.loadLocalizedContent(); // Затем загружаем локализованный контент в созданную форму
        this.renderPreview();
        this.bindEvents(); // Навешиваем события после того, как все элементы формы созданы
    }

    async loadData() {
        try {
            const timestamp = Date.now();
            const response = await fetch(`../data/menu-data.json?v=${timestamp}&_cache=no`, {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache', 'Expires': '0'
                },
                cache: 'no-cache', mode: 'cors', credentials: 'same-origin'
            });

            if (!response.ok) {
                throw new Error(`Ошибка загрузки данных: ${response.status}`);
            }
            this.menuData = await response.json();
            // Убедимся, что все локализуемые поля являются объектами
            this.ensureLocalizationObjects(this.menuData);
            console.log('📡 Данные меню (базовые) загружены с сервера');
        } catch (error) {
            console.error('Ошибка загрузки данных меню:', error);
            const localData = localStorage.getItem('menuData');
            if (localData) {
                this.menuData = JSON.parse(localData);
                this.ensureLocalizationObjects(this.menuData);
                console.log('⚠️ Данные меню загружены из localStorage');
                this.showMessage('Данные загружены из кэша (сервер недоступен)', 'warning');
                return;
            }
            this.showMessage('Ошибка загрузки данных меню', 'error');
            this.menuData = this.getDefaultData();
            this.ensureLocalizationObjects(this.menuData);
        }
    }

    ensureLocalizationObjects(data) {
        if (data) {
            if (typeof data.pageTitle !== 'object') data.pageTitle = { en: data.pageTitle || '', ru: data.pageTitle || '' };
            if (data.hero && typeof data.hero.title !== 'object') data.hero.title = { en: data.hero.title || '', ru: data.hero.title || '' };
            if (data.categories && Array.isArray(data.categories)) {
                data.categories.forEach(cat => {
                    if (typeof cat.name !== 'object') cat.name = { en: cat.name || '', ru: cat.name || '' };
                    if (cat.items && Array.isArray(cat.items)) {
                        cat.items.forEach(item => {
                            if (typeof item.name !== 'object') item.name = { en: item.name || '', ru: item.name || '' };
                            if (typeof item.description !== 'object') item.description = { en: item.description || '', ru: item.description || '' };
                        });
                    }
                });
            }
        }
    }


    getDefaultData() {
        return {
            pageTitle: { en: "Menu", ru: "Меню" },
            hero: {
                backgroundImage: "",
                title: { en: "Menu", ru: "Меню" }
            },
            categories: []
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
                    <div class="form-group language-selector-admin" style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Язык редактирования контента:</label>
                        <div class="btn-group">
                            <button type="button" class="btn btn-outline-primary admin-lang-btn ${this.currentEditLang === 'en' ? 'active' : ''}" data-lang="en">EN</button>
                            <button type="button" class="btn btn-outline-primary admin-lang-btn ${this.currentEditLang === 'ru' ? 'active' : ''}" data-lang="ru">RU</button>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="menuPageTitle">Заголовок страницы (для ${this.currentEditLang.toUpperCase()}):</label>
                        <input type="text" id="menuPageTitle" value="" class="form-control">
                    </div>

                    <div class="form-group">
                        <label for="menuHeroTitle">Заголовок блока приветствия (для ${this.currentEditLang.toUpperCase()}):</label>
                        <input type="text" id="menuHeroTitle" value="" class="form-control">
                    </div>

                    <div class="form-group">
                        <label for="menuHeroImage">Фоновое изображение блока приветствия (глобальное):</label>
                        <input type="url" id="menuHeroImage" value="${this.menuData.hero.backgroundImage || ''}" class="form-control" placeholder="https://example.com/image.jpg">
                    </div>

                    <div class="categories-section">
                        <div class="section-header">
                            <h3>Категории меню (для ${this.currentEditLang.toUpperCase()})</h3>
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
                            <label for="itemName">Название блюда (для ${this.currentEditLang.toUpperCase()}):</label>
                            <input type="text" id="itemName" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="itemPrice">Цена (глобальная):</label>
                            <input type="text" id="itemPrice" class="form-control" placeholder="$12">
                        </div>
                        <div class="form-group">
                            <label for="itemDescription">Описание (для ${this.currentEditLang.toUpperCase()}):</label>
                            <textarea id="itemDescription" class="form-control" rows="3"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="itemImage">Изображение (URL, глобальное):</label>
                            <input type="url" id="itemImage" class="form-control" placeholder="https://example.com/image.jpg">
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="itemSpicy"> Острое блюдо (глобально)
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
        // Важно: bindEvents должен вызываться ПОСЛЕ того, как HTML полностью добавлен в DOM
        // this.loadLocalizedContent(); // Вызывается в init после renderMenuForm
        // this.bindEvents(); // Вызывается в init после renderMenuForm и loadLocalizedContent
    }

    getLocalizedValue(obj, key, lang = this.currentEditLang) {
        if (obj && typeof obj[key] === 'object' && obj[key] !== null) {
            return obj[key][lang] || obj[key]['en'] || '';
        }
        return (obj && typeof obj[key] === 'string' && (key === 'name' || key === 'title' || key === 'description' || key === 'pageTitle')) ? '' : (obj ? obj[key] : '');
    }

    setLocalizedValue(obj, key, value, lang = this.currentEditLang) {
        if (!obj) obj = {}; // Если объект не существует (например, this.menuData.pageTitle для нового JSON)
        if (key === 'pageTitle' && typeof obj[key] !== 'object'){ // Специально для pageTitle, если он был строкой
             const oldVal = obj[key];
             obj[key] = {en: oldVal, ru: oldVal}; // Преобразуем в объект
        }

        if (typeof obj[key] !== 'object' || obj[key] === null) {
            obj[key] = { en: '', ru: ''}; // Инициализируем для всех языков
        }
        obj[key][lang] = value;
    }

    loadLocalizedContent() {
        const menuPageTitleInput = document.getElementById('menuPageTitle');
        if (menuPageTitleInput) {
            menuPageTitleInput.value = this.getLocalizedValue(this.menuData, 'pageTitle');
            const menuPageTitleLabel = document.querySelector('label[for="menuPageTitle"]');
            if(menuPageTitleLabel) menuPageTitleLabel.textContent = `Заголовок страницы (для ${this.currentEditLang.toUpperCase()}):`;
        }

        const menuHeroTitleInput = document.getElementById('menuHeroTitle');
        if (menuHeroTitleInput && this.menuData.hero) {
             menuHeroTitleInput.value = this.getLocalizedValue(this.menuData.hero, 'title');
             const menuHeroTitleLabel = document.querySelector('label[for="menuHeroTitle"]');
             if(menuHeroTitleLabel) menuHeroTitleLabel.textContent = `Заголовок блока приветствия (для ${this.currentEditLang.toUpperCase()}):`;
        }

        // Обновляем глобальное поле, если оно есть
        const menuHeroImageInput = document.getElementById('menuHeroImage');
        if (menuHeroImageInput && this.menuData.hero) {
            menuHeroImageInput.value = this.menuData.hero.backgroundImage || '';
        }


        const categoriesSectionHeader = document.querySelector('.categories-section .section-header h3');
        if (categoriesSectionHeader) {
            categoriesSectionHeader.textContent = `Категории меню (для ${this.currentEditLang.toUpperCase()})`;
        }
        this.renderCategories();
        console.log(`Содержимое админ-панели обновлено для языка: ${this.currentEditLang}`);
    }

    renderCategories() {
        const container = document.getElementById('categoriesContainer');
        if (!container || !this.menuData || !this.menuData.categories) return;
        container.innerHTML = '';

        this.menuData.categories.forEach((category, categoryIndex) => {
            const categoryElement = this.createCategoryElement(category, categoryIndex);
            container.appendChild(categoryElement);
        });
    }

    createCategoryElement(category, categoryIndex) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category-item';
        const categoryNameLocalized = this.getLocalizedValue(category, 'name');

        categoryDiv.innerHTML = `
            <div class="category-header">
                <div class="category-title">
                    <input type="text" value="${categoryNameLocalized}" class="category-name-input" data-category-index="${categoryIndex}" placeholder="Название категории (${this.currentEditLang})">
                    <label>
                        <input type="checkbox" class="category-spicy-input" data-category-index="${categoryIndex}" ${category.spicy ? 'checked' : ''}>
                        Острая категория (глобально)
                    </label>
                </div>
                <div class="category-actions">
                    <button type="button" class="btn btn-sm btn-success add-item-btn" data-category-index="${categoryIndex}">+ Добавить блюдо</button>
                    <button type="button" class="btn btn-sm btn-danger delete-category-btn" data-category-index="${categoryIndex}">Удалить категорию</button>
                </div>
            </div>
            <div class="items-container" data-category-index="${categoryIndex}">
                ${this.renderItems(category.items || [], categoryIndex)}
            </div>
        `;
        return categoryDiv;
    }

    renderItems(items, categoryIndex) {
        return items.map((item, itemIndex) => {
            const itemNameLocalized = this.getLocalizedValue(item, 'name');
            const itemDescriptionLocalized = this.getLocalizedValue(item, 'description');
            return `
            <div class="item-card" data-category-index="${categoryIndex}" data-item-index="${itemIndex}">
                <div class="item-image">
                    <img src="${item.image || 'https://via.placeholder.com/150x150?text=No+Image'}" alt="${itemNameLocalized}" onerror="this.onerror=null; this.src='https://via.placeholder.com/150x150?text=Image+Error';">
                </div>
                <div class="item-content">
                    <div class="item-header">
                        <h4>${itemNameLocalized} ${item.spicy ? '🌶️' : ''}</h4>
                        <span class="item-price">${item.price || ''}</span>
                    </div>
                    <p class="item-description">${itemDescriptionLocalized}</p>
                    <div class="item-actions">
                        <button type="button" class="btn btn-sm btn-primary edit-item-btn" data-category-index="${categoryIndex}" data-item-index="${itemIndex}">Редактировать</button>
                        <button type="button" class="btn btn-sm btn-danger delete-item-btn" data-category-index="${categoryIndex}" data-item-index="${itemIndex}">Удалить</button>
                    </div>
                </div>
            </div>
        `}).join('');
    }

    bindEvents() {
        const menuPageTitleInput = document.getElementById('menuPageTitle');
        if (menuPageTitleInput) {
            menuPageTitleInput.addEventListener('input', (e) => {
                this.setLocalizedValue(this.menuData, 'pageTitle', e.target.value);
                this.renderPreview();
            });
        }

        const menuHeroTitleInput = document.getElementById('menuHeroTitle');
        if (menuHeroTitleInput) {
            menuHeroTitleInput.addEventListener('input', (e) => {
                 if(this.menuData.hero) this.setLocalizedValue(this.menuData.hero, 'title', e.target.value);
                 this.renderPreview();
            });
        }

        const menuHeroImageInput = document.getElementById('menuHeroImage');
        if (menuHeroImageInput) {
            menuHeroImageInput.addEventListener('input', (e) => {
                if(this.menuData.hero) this.menuData.hero.backgroundImage = e.target.value;
                this.renderPreview();
            });
        }


        document.querySelectorAll('.admin-lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.admin-lang-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentEditLang = e.target.dataset.lang;
                this.loadLocalizedContent(); // Перезагружаем локализованный контент для формы
            });
        });

        const addCategoryBtn = document.getElementById('addCategoryBtn');
        if (addCategoryBtn) {
            addCategoryBtn.addEventListener('click', () => this.addCategory());
        }

        const categoriesContainer = document.getElementById('categoriesContainer');
        if (categoriesContainer) {
            categoriesContainer.addEventListener('click', (e) => {
                const target = e.target.closest('button') || e.target; // для клика по иконке внутри кнопки
                const categoryIndex = target.dataset.categoryIndex ? parseInt(target.dataset.categoryIndex) : null;
                const itemIndex = target.dataset.itemIndex ? parseInt(target.dataset.itemIndex) : null;

                if (target.classList.contains('add-item-btn') && categoryIndex !== null) {
                    this.openItemModal(categoryIndex);
                } else if (target.classList.contains('edit-item-btn') && categoryIndex !== null && itemIndex !== null) {
                    this.openItemModal(categoryIndex, itemIndex);
                } else if (target.classList.contains('delete-item-btn') && categoryIndex !== null && itemIndex !== null) {
                    this.deleteItem(categoryIndex, itemIndex);
                } else if (target.classList.contains('delete-category-btn') && categoryIndex !== null) {
                    this.deleteCategory(categoryIndex);
                }
            });

            categoriesContainer.addEventListener('input', (e) => {
                const target = e.target;
                const categoryIndex = target.dataset.categoryIndex ? parseInt(target.dataset.categoryIndex) : null;

                if (target.classList.contains('category-name-input') && categoryIndex !== null) {
                    this.setLocalizedValue(this.menuData.categories[categoryIndex], 'name', target.value);
                    this.renderPreview();
                } else if (target.classList.contains('category-spicy-input') && categoryIndex !== null) {
                    this.menuData.categories[categoryIndex].spicy = target.checked; // spicy - глобальный флаг
                    this.renderPreview();
                }
            });
        }

        const itemModal = document.getElementById('itemModal');
        if (itemModal) {
            document.getElementById('cancelItemBtn').addEventListener('click', () => this.closeItemModal());
            document.getElementById('saveItemBtn').addEventListener('click', () => this.saveItem());
            const closeButton = itemModal.querySelector('.modal-close');
            if(closeButton) closeButton.addEventListener('click', () => this.closeItemModal());
            itemModal.addEventListener('click', (e) => {
                if (e.target.id === 'itemModal') this.closeItemModal();
            });
        }
        const forceUpdateBtn = document.getElementById('forceUpdateMenuBtn');
        if (forceUpdateBtn) {
             forceUpdateBtn.addEventListener('click', () => this.forceUpdateMenuPage());
        }
    }

    addCategory() {
        const timestamp = Date.now();
        const randomPart = Math.floor(Math.random() * 10000);
        const uniqueId = `category-${timestamp}-${randomPart}`;

        let categoryNumber = (this.menuData.categories?.length || 0) + 1;
        let newCategoryNameEn = `New Category ${categoryNumber}`;
        let newCategoryNameRu = `Новая категория ${categoryNumber}`;

        while (this.menuData.categories.some(cat => this.getLocalizedValue(cat, 'name', 'en') === newCategoryNameEn)) {
            categoryNumber++;
            newCategoryNameEn = `New Category ${categoryNumber}`;
            newCategoryNameRu = `Новая категория ${categoryNumber}`;
        }

        const newCategory = {
            id: uniqueId,
            name: { en: newCategoryNameEn, ru: newCategoryNameRu },
            items: [],
            spicy: false
        };

        if (!this.menuData.categories) this.menuData.categories = [];
        this.menuData.categories.push(newCategory);
        this.renderCategories();
        this.renderPreview();
        this.showMessage(`Категория "${this.getLocalizedValue(newCategory, 'name')}" успешно добавлена`, 'success');

        setTimeout(() => {
            const newCategoryElement = document.querySelector(`.category-item[data-category-index="${this.menuData.categories.length - 1}"] .category-name-input`);
            if (newCategoryElement) {
                newCategoryElement.focus();
                newCategoryElement.select();
            }
        }, 100);
    }

    deleteCategory(categoryIndex) {
        const categoryName = this.getLocalizedValue(this.menuData.categories[categoryIndex], 'name');
        if (confirm(`Вы уверены, что хотите удалить категорию "${categoryName}" и все блюда в ней? Это действие необратимо.`)) {
            this.menuData.categories.splice(categoryIndex, 1);
            this.renderCategories();
            this.renderPreview();
            this.showMessage(`Категория "${categoryName}" успешно удалена`, 'success');
            this.saveData();
        }
    }

    openItemModal(categoryIndex, itemIndex = null) {
        this.currentEditingCategory = categoryIndex;
        this.currentEditingItem = itemIndex;

        const modal = document.getElementById('itemModal');
        const title = document.getElementById('modalTitle');
        const itemNameLabel = modal.querySelector('label[for="itemName"]');
        const itemDescriptionLabel = modal.querySelector('label[for="itemDescription"]');

        itemNameLabel.textContent = `Название блюда (для ${this.currentEditLang.toUpperCase()}):`;
        itemDescriptionLabel.textContent = `Описание (для ${this.currentEditLang.toUpperCase()}):`;

        const category = this.menuData.categories[categoryIndex];
        if (!category || !category.items) category.items = []; // Убедимся что items существует

        if (itemIndex !== null && category.items[itemIndex]) {
            const item = category.items[itemIndex];
            title.textContent = 'Редактировать блюдо';
            document.getElementById('itemName').value = this.getLocalizedValue(item, 'name');
            document.getElementById('itemPrice').value = item.price || '';
            document.getElementById('itemDescription').value = this.getLocalizedValue(item, 'description');
            document.getElementById('itemImage').value = item.image || '';
            document.getElementById('itemSpicy').checked = item.spicy || false;
        } else {
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
    }

    saveItem() {
        const name = document.getElementById('itemName').value.trim();
        const price = document.getElementById('itemPrice').value.trim();
        const description = document.getElementById('itemDescription').value.trim();
        const image = document.getElementById('itemImage').value.trim();
        const spicy = document.getElementById('itemSpicy').checked;

        if (!name || !price) {
            alert('Пожалуйста, заполните название и цену блюда.');
            return;
        }

        let itemData;
        const category = this.menuData.categories[this.currentEditingCategory];
        if (!category.items) category.items = [];


        if (this.currentEditingItem !== null && category.items[this.currentEditingItem]) {
            itemData = category.items[this.currentEditingItem];
        } else {
            itemData = { id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`, name: {}, description: {} };
            category.items.push(itemData);
            this.currentEditingItem = category.items.length - 1;
        }

        this.setLocalizedValue(itemData, 'name', name);
        this.setLocalizedValue(itemData, 'description', description);
        itemData.price = price;
        itemData.image = image || 'https://via.placeholder.com/150x150?text=No+Image';
        itemData.spicy = spicy;

        this.closeItemModal();
        this.renderCategories();
        this.renderPreview();
        this.showMessage('Блюдо успешно сохранено!', 'success');
    }

    deleteItem(categoryIndex, itemIndex) {
        const item = this.menuData.categories[categoryIndex]?.items?.[itemIndex];
        if (!item) return;
        const itemName = this.getLocalizedValue(item, 'name');
        if (confirm(`Вы уверены, что хотите удалить блюдо "${itemName}"?`)) {
            this.menuData.categories[categoryIndex].items.splice(itemIndex, 1);
            this.renderCategories();
            this.renderPreview();
            this.showMessage(`Блюдо "${itemName}" удалено.`, 'success');
        }
    }

    renderPreview() {
        const previewContent = document.getElementById('previewContent');
        if (!previewContent || !this.menuData) return;
        const langForPreview = this.currentEditLang;

        let previewHTML = `
            <div class="menu-preview">
                <div class="preview-hero" style="text-align:center; margin-bottom: 20px;">
                    <h2>${this.getLocalizedValue(this.menuData, 'pageTitle', langForPreview)}</h2>
                    <h3>${this.getLocalizedValue(this.menuData.hero, 'title', langForPreview)}</h3>
                    ${this.menuData.hero.backgroundImage ? `<img src="${this.menuData.hero.backgroundImage}" alt="Hero" style="max-width: 200px; display: block; margin: 10px auto;">` : ''}
                </div>`;

        (this.menuData.categories || []).forEach(category => {
            previewHTML += `
                <div class="preview-category" style="margin-bottom:15px; padding-bottom:10px; border-bottom: 1px solid #eee;">
                    <h4>${this.getLocalizedValue(category, 'name', langForPreview)} ${category.spicy ? '🌶️' : ''}</h4>
                    <div class="preview-items" style="display:flex; flex-direction:column; gap:10px;">`;
            (category.items || []).forEach(item => {
                previewHTML += `
                    <div class="preview-item" style="display:flex; gap:10px; border:1px solid #f0f0f0; padding:8px; border-radius:4px;">
                        <div class="preview-item-image">
                            <img src="${item.image || 'https://via.placeholder.com/60'}" alt="${this.getLocalizedValue(item, 'name', langForPreview)}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
                        </div>
                        <div class="preview-item-content" style="flex:1;">
                            <div class="preview-item-header" style="display:flex; justify-content:space-between; font-weight:bold;">
                                <span class="preview-item-name">${this.getLocalizedValue(item, 'name', langForPreview)} ${item.spicy ? '🌶️' : ''}</span>
                                <span class="preview-item-price">${item.price}</span>
                            </div>
                            <p class="preview-item-description" style="font-size:0.9em; color:#555;">${this.getLocalizedValue(item, 'description', langForPreview)}</p>
                        </div>
                    </div>`;
            });
            previewHTML += `</div></div>`;
        });
        previewHTML += '</div>';
        previewContent.innerHTML = previewHTML;
    }

    async saveData() {
        this.ensureLocalizationObjects(this.menuData); // Убедимся что все локализуемые поля - объекты
        try {
            const response = await fetch('save-menu-data.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
                body: JSON.stringify(this.menuData, null, 2)
            });
            if (response.ok) {
                const result = await response.json();
                this.showMessage('✅ Данные меню успешно сохранены!', 'success');
                console.log('Данные меню сохранены на сервере:', result);
                localStorage.setItem('menuData', JSON.stringify(this.menuData));
                this.notifyAllChannels();
            } else {
                const errorText = await response.text();
                this.showMessage(`❌ Ошибка сохранения на сервере: ${response.status}. ${errorText}`, 'error');
                localStorage.setItem('menuData', JSON.stringify(this.menuData));
                this.notifyAllChannels();
            }
        } catch (error) {
            this.showMessage(`❌ Ошибка сети при сохранении: ${error.message}. Данные сохранены локально.`, 'error');
            localStorage.setItem('menuData', JSON.stringify(this.menuData));
            this.notifyAllChannels();
        }
        this.renderPreview();
    }

    notifyAllChannels() {
        try {
            const timestamp = Date.now();
            localStorage.setItem('menuDataTimestamp', timestamp.toString());
            this.notifyViaPostMessage();
            this.notifyViaBroadcastChannel();
            this.notifyViaCustomEvent();
        } catch (error) { console.error('Ошибка при отправке уведомлений:', error); }
    }

    notifyViaPostMessage() {
        try {
            const messagePayload = { type: 'menuDataUpdate', data: this.menuData, source: 'admin-panel', timestamp: Date.now() };
            document.querySelectorAll('iframe').forEach(iframe => {
                try { iframe.contentWindow.postMessage(messagePayload, '*'); } catch (e) { /*ignore*/ }
            });
            if (window.parent !== window) window.parent.postMessage(messagePayload, '*');
            if (window.opener) window.opener.postMessage(messagePayload, '*');
        } catch (error) { /*ignore*/ }
    }

    notifyViaBroadcastChannel() {
        try {
            if (typeof BroadcastChannel !== 'undefined') {
                const channel = new BroadcastChannel('menuUpdates');
                channel.postMessage({ type: 'menuDataUpdate', data: this.menuData, source: 'admin-panel', timestamp: Date.now() });
                setTimeout(() => channel.close(), 500);
            }
        } catch (error) { /*ignore*/ }
    }

    notifyViaCustomEvent() {
        try {
            const event = new CustomEvent('menuDataForceUpdate', { detail: { data: this.menuData, source: 'admin-panel', timestamp: Date.now() } });
            window.dispatchEvent(event);
        } catch (error) { /*ignore*/ }
    }

    showMessage(text, type) {
        const messageEl = document.getElementById('statusMessage');
        if (!messageEl) return;
        messageEl.textContent = text;
        messageEl.className = `status-message ${type}`;
        messageEl.style.display = 'block';
        setTimeout(() => { messageEl.style.display = 'none'; }, 3000);
    }

    forceUpdateMenuPage() {
        try {
            localStorage.setItem('menuData', JSON.stringify(this.menuData)); // Обновить данные перед сигналом
            localStorage.setItem('menuDataTimestamp', Date.now().toString());
            localStorage.setItem('menuForceReload', 'true');
            this.notifyAllChannels(); // Уведомить другие вкладки
            this.showMessage('Отправлен сигнал принудительного обновления страницы меню', 'success');
            setTimeout(() => localStorage.removeItem('menuForceReload'), 2000);
        } catch (error) {
            this.showMessage('Ошибка при отправке сигнала обновления: ' + error.message, 'error');
        }
    }
}
