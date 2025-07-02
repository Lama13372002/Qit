/**
 * Независимый скрипт для карточек меню
 * Полностью заменяет старую систему загрузки меню
 */
class MenuCards {
    constructor() {
        this.menuData = null;
        this.initialized = false;
        this.currentLang = document.documentElement.lang || 'en'; // Определяем язык страницы
        console.log(`🍽️ MenuCards: Инициализация... Язык страницы: ${this.currentLang}`);

        // Сохраняем экземпляр для доступа из карусели
        window.menuCardsInstance = this;

        this.init();
    }

    async init() {
        try {
            console.log('📋 MenuCards: Начинаем инициализацию');
            await this.loadMenuData();
            this.renderMenu();
            this.setupUpdateListeners();
            this.initialized = true;
            console.log('✅ MenuCards: Инициализация завершена успешно');
        } catch (error) {
            console.error('❌ MenuCards: Ошибка инициализации:', error);
            this.renderErrorMessage();
        }
    }

    // Вспомогательная функция для получения локализованного значения
    getLocalizedValue(field, defaultKey = 'en') {
        if (typeof field === 'object' && field !== null) {
            return field[this.currentLang] || field[defaultKey] || '';
        }
        // Если field - это строка (старый формат или нет локализации), просто возвращаем ее
        return (typeof field === 'string') ? field : '';
    }

    async loadMenuData() {
        try {
            const timestamp = Date.now();
            const response = await fetch(`../data/menu-data.json?t=${timestamp}&r=${Math.random()}`, {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                },
                cache: 'no-cache'
            });

            if (response.ok) {
                const data = await response.json();
                this.menuData = data;
                console.log('📡 MenuCards: Данные загружены с сервера', data);
                localStorage.setItem('menuData', JSON.stringify(data));
                return;
            }
             throw new Error(`Server responded with status: ${response.status}`);
        } catch (error) {
            console.warn('⚠️ MenuCards: Ошибка загрузки с сервера:', error.message);
        }

        try {
            const localData = localStorage.getItem('menuData');
            if (localData) {
                this.menuData = JSON.parse(localData);
                console.log('💾 MenuCards: Данные загружены из localStorage');
                return;
            }
        } catch (error) {
            console.warn('⚠️ MenuCards: Ошибка загрузки из localStorage:', error.message);
        }

        this.menuData = this.getDefaultMenuData();
        console.log('🔄 MenuCards: Используем дефолтные данные');
    }

    getDefaultMenuData() {
        // Данные по умолчанию теперь также используют локализованную структуру
        return {
            pageTitle: { en: "Menu", ru: "Меню" },
            hero: {
                title: { en: "Our Exquisite Menu", ru: "Наше Изысканное Меню" },
                backgroundImage: ""
            },
            categories: [
                {
                    id: "maki",
                    name: { en: "Maki Rolls", ru: "Роллы Маки" },
                    spicy: false, // Глобальный флаг для категории
                    items: [
                        {
                            id: "spicy-tuna-maki",
                            name: { en: "Spicy Tuna Maki", ru: "Острые Маки с Тунцом" },
                            price: "$5",
                            description: {
                                en: "A tantalizing blend of spicy tuna, cucumber, and avocado, harmoniously rolled in nori and seasoned rice.",
                                ru: "Соблазнительное сочетание острого тунца, огурца и авокадо, гармонично завернутое в нори и приправленный рис."
                            },
                            image: "https://via.placeholder.com/300x200?text=Spicy+Tuna+Maki",
                            spicy: true // Глобальный флаг для блюда
                        },
                        {
                            id: "salmon-maki",
                            name: { en: "Salmon Maki", ru: "Маки с Лососем" },
                            price: "$5",
                            description: {
                                en: "Fresh salmon wrapped in perfectly seasoned rice and nori seaweed.",
                                ru: "Свежий лосось, завернутый в идеально приправленный рис и водоросли нори."
                            },
                            image: "https://via.placeholder.com/300x200?text=Salmon+Maki",
                            spicy: false
                        }
                    ]
                },
                {
                    id: "uramaki",
                    name: { en: "Uramaki (Inside-Out)", ru: "Урамаки (Наизнанку)"},
                    spicy: true,
                    items: [
                        {
                            id: "volcano-delight",
                            name: { en: "Volcano Delight", ru: "Вулканическое Наслаждение" },
                            price: "$12",
                            description: {
                                en: "Creamy crab salad, avocado, and cucumber rolled inside, topped with spicy tuna and drizzled with fiery sriracha sauce.",
                                ru: "Кремовый крабовый салат, авокадо и огурец внутри, сверху острый тунец и огненный соус шрирача."
                            },
                            image: "https://via.placeholder.com/300x200?text=Volcano+Delight",
                            spicy: true
                        }
                    ]
                }
            ]
        };
    }

    renderMenu() {
        const container = this.findMenuContainer();
        if (!container) {
            console.error('❌ MenuCards: Не найден контейнер для меню');
            return;
        }
        container.innerHTML = '';

        if (!this.menuData || !this.menuData.categories || this.menuData.categories.length === 0) {
            this.renderEmptyState(container);
            return;
        }
        console.log(`🔄 MenuCards: Рендерим ${this.menuData.categories.length} категорий на языке '${this.currentLang}'`);
        this.menuData.categories.forEach((category, index) => {
            const categoryElement = this.createCategoryElement(category, index);
            container.appendChild(categoryElement);
        });
        console.log('✅ MenuCards: Меню отрендерено успешно');
        this.notifyCarousel();
        this.applyStyleFixes(container);
    }

    findMenuContainer() {
        const selectors = ['#dynamic-menu-container', '.dynamic-menu-content', '.framer-i421fq', '.menu-content', 'main .framer-i421fq'];
        for (const selector of selectors) {
            const container = document.querySelector(selector);
            if (container) {
                console.log(`📍 MenuCards: Найден контейнер: ${selector}`);
                container.style.width = '100%';
                container.style.maxWidth = '1200px';
                container.style.margin = '0 auto';
                container.style.padding = '0 1rem';
                return container;
            }
        }
        console.warn('📍 MenuCards: Контейнер для меню не найден, создаем новый.');
        const newContainer = document.createElement('div');
        newContainer.id = 'menu-cards-container-fallback';
        newContainer.className = 'menu-cards-container';
        newContainer.style.cssText = `width: 100%; max-width: 1200px; margin: 20px auto; padding: 0 1rem;`;
        const mainContentArea = document.querySelector('main') || document.body;
        mainContentArea.appendChild(newContainer);
        return newContainer;
    }

    createCategoryElement(category, categoryIndex) {
        const categoryName = this.getLocalizedValue(category.name);
        console.log(`🏷️ MenuCards: Создаем категорию "${categoryName}" (ID: ${category.id})`);

        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'framer-cr81gk menu-category';
        categoryDiv.id = category.id || `category-${categoryIndex}`;

        const headerHTML = `
            <div class="framer-ctytay">
                <div class="framer-14yj1y1">
                    <div class="framer-ip9mw5" data-border="true" data-framer-name="Icon" style="transform:rotate(-45deg); background-color: var(--token-68c05b50-ca7b-4173-82aa-ed42aea1a9b4, rgb(232, 232, 232)); width: 8px; height: 8px; border: 1px solid var(--token-68c05b50-ca7b-4173-82aa-ed42aea1a9b4, rgb(232, 232, 232));"></div>
                    <div class="framer-bnmzg6" data-framer-name="Line" style="background-color: var(--token-68c05b50-ca7b-4173-82aa-ed42aea1a9b4, rgb(232, 232, 232)); height: 1px; flex: 1;"></div>
                </div>
                <div class="framer-om33u4" data-framer-component-type="RichTextContainer" style="outline:none;display:flex;flex-direction:column;justify-content:flex-start;flex-shrink:0;transform:none; margin: 0 1rem;">
                    <h2 class="framer-text framer-styles-preset-12lj5ox" data-styles-preset="YckFIlg3V" style="color: var(--token-b0d5b115-8d5e-4849-a7e4-d3bb5b253c70, rgb(239, 230, 210)); font-size: 2rem; font-weight: 600; margin: 0;">${categoryName}${category.spicy ? ' 🌶️' : ''}</h2>
                </div>
                <div class="framer-1h4if96">
                    <div class="framer-194wd46" data-framer-name="Line" style="background-color: var(--token-68c05b50-ca7b-4173-82aa-ed42aea1a9b4, rgb(232, 232, 232)); height: 1px; flex: 1;"></div>
                    <div class="framer-pxgvsy" data-border="true" data-framer-name="Icon" style="transform:rotate(-45deg); background-color: var(--token-68c05b50-ca7b-4173-82aa-ed42aea1a9b4, rgb(232, 232, 232)); width: 8px; height: 8px; border: 1px solid var(--token-68c05b50-ca7b-4173-82aa-ed42aea1a9b4, rgb(232, 232, 232));"></div>
                </div>
            </div>
        `;
        categoryDiv.innerHTML = headerHTML;

        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'framer-18w9xn4 menu-items-container';
        itemsContainer.style.cssText = `display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem;`;

        if (category.items && category.items.length > 0) {
            category.items.forEach((item, itemIndex) => {
                const itemElement = this.createItemElement(item, itemIndex);
                itemsContainer.appendChild(itemElement);
            });
        } else {
            const emptyMessage = document.createElement('div');
            emptyMessage.style.cssText = `padding: 2rem; text-align: center; color: var(--token-797a2fb4-2d14-46eb-9fb6-f38c1a9a545e, rgb(245, 242, 234)); opacity: 0.7;`;
            emptyMessage.textContent = this.currentLang === 'ru' ? 'В этой категории пока нет блюд' : 'No items in this category yet';
            itemsContainer.appendChild(emptyMessage);
        }
        categoryDiv.appendChild(itemsContainer);
        categoryDiv.style.marginBottom = '3rem';
        return categoryDiv;
    }

    createItemElement(item, itemIndex) {
        const itemName = this.getLocalizedValue(item.name);
        const itemDescription = this.getLocalizedValue(item.description);
        console.log(`🍱 MenuCards: Создаем блюдо "${itemName}"`);

        const itemDiv = document.createElement('div');
        itemDiv.className = 'ssr-variant hidden-1td9vov hidden-okrmbe menu-item-card';

        const itemContainer = document.createElement('div');
        itemContainer.className = 'framer-rto2k8-container modern-card-container';
        itemContainer.innerHTML = `
            <div class="modern-menu-card" data-framer-name="Desktop" style="width: 100%; opacity: 1;">
                <div class="card-image-container">
                    <div class="card-image-wrapper">
                        <img alt="${itemName}"
                             decoding="async"
                             src="${item.image || 'https://via.placeholder.com/300x200?text=No+Image'}"
                             class="card-image"
                             onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200?text=Image+Error';"/>
                        ${item.spicy ? '<div class="spicy-badge">🌶️</div>' : ''}
                    </div>
                </div>
                <div class="card-content">
                    <div class="card-header">
                        <h3 class="item-name">${itemName}</h3>
                        <div class="price-tag">${item.price}</div>
                    </div>
                    <p class="item-description">${itemDescription}</p>
                    <div class="card-footer">
                        <div class="card-divider"></div>
                    </div>
                </div>
            </div>
        `;
        itemDiv.appendChild(itemContainer);

        itemDiv.classList.add('loading');
        setTimeout(() => {
            itemDiv.classList.remove('loading');
            itemDiv.classList.add('loaded');
        }, 100 + itemIndex * 50);

        itemDiv.addEventListener('mouseenter', () => {
            const card = itemContainer.querySelector('.modern-menu-card');
            if (card) {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = '0 15px 35px rgba(0,0,0,0.3)';
            }
        });
        itemDiv.addEventListener('mouseleave', () => {
            const card = itemContainer.querySelector('.modern-menu-card');
            if (card) {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }
        });
        return itemDiv;
    }

    renderEmptyState(container) {
        const emptyMessage = this.currentLang === 'ru' ?
            'Меню временно недоступно. Наши повара уже колдуют над новыми блюдами! Пожалуйста, зайдите позже или обратитесь к персоналу.' :
            'The menu is temporarily unavailable. Our chefs are working on new dishes! Please check back later or ask our staff.';
        const emptyTitle = this.currentLang === 'ru' ? 'Меню скоро появится!' : 'Menu Coming Soon!';
        container.innerHTML = `
            <div class="menu-empty-state" style="padding: 3rem 2rem; text-align: center; background: rgba(24, 24, 24, 0.7); border-radius: 12px; border: 1px solid rgb(51, 51, 48); margin: 2rem 0;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🍽️</div>
                <h3 style="color: rgb(239, 230, 210); margin-bottom: 1rem;">${emptyTitle}</h3>
                <p style="color: rgb(245, 242, 234); opacity: 0.8; line-height: 1.6;">${emptyMessage}</p>
            </div>`;
    }

    renderErrorMessage() {
        const container = this.findMenuContainer();
        if (!container) return;
        const errorTitle = this.currentLang === 'ru' ? 'Ошибка загрузки меню' : 'Error Loading Menu';
        const errorMessageText = this.currentLang === 'ru' ? 'Произошла ошибка при загрузке меню. Попробуйте обновить страницу.' : 'An error occurred while loading the menu. Please try refreshing the page.';
        const refreshButtonText = this.currentLang === 'ru' ? 'Обновить страницу' : 'Refresh Page';
        container.innerHTML = `
            <div class="menu-error-state" style="padding: 3rem 2rem; text-align: center; background: rgba(24, 24, 24, 0.7); border-radius: 12px; border: 2px solid #ff6b6b; margin: 2rem 0;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                <h3 style="color: #ff6b6b; margin-bottom: 1rem;">${errorTitle}</h3>
                <p style="color: rgb(245, 242, 234); opacity: 0.8; line-height: 1.6; margin-bottom: 1.5rem;">${errorMessageText}</p>
                <button onclick="window.location.reload()" style="background: #ff6b6b; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; font-size: 1rem;">${refreshButtonText}</button>
            </div>`;
    }

    setupUpdateListeners() {
        console.log('📡 MenuCards: Настраиваем слушатели обновлений');
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'menuDataUpdate' && event.data.source === 'admin-panel') {
                console.log('🔄 MenuCards: Получено обновление через postMessage от админ-панели');
                this.handleDataUpdate(event.data.data);
            }
        });
        window.addEventListener('storage', (event) => {
            if (event.key === 'menuData' && event.newValue) {
                console.log('🔄 MenuCards: Получено обновление через storage');
                try { this.handleDataUpdate(JSON.parse(event.newValue)); } catch (e) { console.error("Ошибка парсинга данных из storage", e); }
            }
            if (event.key === 'menuForceReload' && event.newValue === 'true') {
                console.log('🔄 MenuCards: Принудительная перезагрузка из-за флага menuForceReload');
                setTimeout(() => window.location.reload(), 500);
            }
        });
        window.addEventListener('menuDataForceUpdate', (event) => {
            if (event.detail && event.detail.data) {
                console.log('🔄 MenuCards: Получено обновление через CustomEvent');
                this.handleDataUpdate(event.detail.data);
            }
        });
        try {
            if (typeof BroadcastChannel !== 'undefined') {
                this.broadcastChannel = new BroadcastChannel('menuUpdates');
                this.broadcastChannel.onmessage = (event) => { // Используем onmessage
                    if (event.data && event.data.type === 'menuDataUpdate') {
                        console.log('🔄 MenuCards: Получено обновление через BroadcastChannel');
                        this.handleDataUpdate(event.data.data);
                    }
                };
            }
        } catch (error) { console.warn('BroadcastChannel не поддерживается или ошибка инициализации:', error); }

        // Убираем setInterval, полагаемся на события и localStorage/BroadcastChannel
        // setInterval(() => this.checkForUpdates(), 30000);
        window.addEventListener('focus', () => this.checkForUpdates(true)); // Проверять при фокусе, но менее агрессивно
    }

    handleDataUpdate(newData) {
        if (!newData) return;
        console.log('🔄 MenuCards: Обрабатываем обновление данных');
        const currentDataStr = JSON.stringify(this.menuData);
        const newDataStr = JSON.stringify(newData);
        if (currentDataStr !== newDataStr) {
            this.menuData = newData;
            localStorage.setItem('menuData', newDataStr); // Обновляем локальный кеш
            this.renderMenu();
            this.showUpdateNotification();
            console.log('✅ MenuCards: Данные обновлены и меню перерендерено');
        } else {
            console.log('ℹ️ MenuCards: Данные не изменились, обновление не требуется.');
        }
    }

    async checkForUpdates(isFocusCheck = false) {
        try {
            if (localStorage.getItem('menuForceReload') === 'true') {
                console.log('🔄 MenuCards: Принудительная перезагрузка через checkForUpdates');
                localStorage.removeItem('menuForceReload');
                window.location.reload();
                return;
            }
            // Если это проверка по фокусу, не будем слишком часто дергать сервер
            if (isFocusCheck && this.lastFocusCheck && (Date.now() - this.lastFocusCheck < 10000)) {
                return;
            }
            this.lastFocusCheck = Date.now();

            const timestamp = Date.now();
            const response = await fetch(`../data/menu-data.json?t=${timestamp}&r=${Math.random()}`, {
                cache: 'no-store' // Гарантируем свежесть данных
            });
            if (response.ok) {
                const newData = await response.json();
                this.handleDataUpdate(newData);
            }
        } catch (error) {
            console.warn('Периодическая/фокусная проверка обновлений не удалась:', error.message);
        }
    }

    showUpdateNotification() {
        const notificationId = 'menu-update-notification';
        if (document.getElementById(notificationId)) return; // Не показывать, если уже есть

        const notification = document.createElement('div');
        notification.id = notificationId;
        notification.style.cssText = `position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: 500; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3); z-index: 10000; transform: translateX(110%); transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);`;
        notification.textContent = this.currentLang === 'ru' ? '🍽️ Меню обновлено!' : '🍽️ Menu updated!';
        document.body.appendChild(notification);
        setTimeout(() => notification.style.transform = 'translateX(0)', 50);
        setTimeout(() => {
            notification.style.transform = 'translateX(110%)';
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    }

    async forceReload() {
        console.log('🔄 MenuCards: Принудительное обновление вызвано');
        await this.loadMenuData();
        this.renderMenu();
    }

    applyStyleFixes(container) {
        // Стили уже применены в findMenuContainer и create...Element, эта функция может быть не нужна
        // или использоваться для более сложных динамических исправлений.
        console.log('🎨 MenuCards: (applyStyleFixes не выполняет активных действий)');
    }

    cleanup() {
        if (this.broadcastChannel) {
            this.broadcastChannel.close();
            console.log('🧹 MenuCards: BroadcastChannel закрыт');
        }
        // Можно добавить удаление других слушателей, если это необходимо
    }

    notifyCarousel() {
        if (this.menuData && this.menuData.categories) {
            const categoriesForCarousel = this.menuData.categories.map(cat => ({
                id: cat.id,
                name: this.getLocalizedValue(cat.name) // Локализуем имя для карусели
            }));
            const event = new CustomEvent('menuDataUpdated', { detail: { categories: categoriesForCarousel } });
            document.dispatchEvent(event);
            console.log('🔄 MenuCards: Отправлено уведомление карусели с локализованными именами');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 MenuCards: DOM загружен, инициализируем...');
    if (!window.menuCardsInstance) { // Предотвращаем повторную инициализацию
      window.menuCardsInstance = new MenuCards();
    } else {
      console.log('ℹ️ MenuCards: Экземпляр уже существует, пропускаем повторную инициализацию.');
    }
});

window.addEventListener('beforeunload', () => {
    if (window.menuCardsInstance) {
        window.menuCardsInstance.cleanup();
    }
});
