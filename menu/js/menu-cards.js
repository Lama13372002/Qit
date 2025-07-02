/**
 * Независимый скрипт для карточек меню
 * Полностью заменяет старую систему загрузки меню
 */
class MenuCards {
    constructor() {
        this.menuData = null;
        this.initialized = false;
        console.log('🍽️ MenuCards: Инициализация...');

        // Сохраняем экземпляр для доступа из карусели
        window.menuCardsInstance = this;

        this.init();
    }

    async init() {
        try {
            console.log('📋 MenuCards: Начинаем инициализацию');

            // Загружаем данные
            await this.loadMenuData();

            // Рендерим меню
            this.renderMenu();

            // Настраиваем обновления
            this.setupUpdateListeners();

            this.initialized = true;
            console.log('✅ MenuCards: Инициализация завершена успешно');

        } catch (error) {
            console.error('❌ MenuCards: Ошибка инициализации:', error);
            this.renderErrorMessage();
        }
    }

    async loadMenuData() {
        try {
            // Пытаемся загрузить с сервера
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

                // Сохраняем в localStorage как бэкап
                localStorage.setItem('menuData', JSON.stringify(data));
                return;
            }
        } catch (error) {
            console.log('⚠️ MenuCards: Ошибка загрузки с сервера:', error);
        }

        // Fallback к localStorage
        try {
            const localData = localStorage.getItem('menuData');
            if (localData) {
                this.menuData = JSON.parse(localData);
                console.log('💾 MenuCards: Данные загружены из localStorage');
                return;
            }
        } catch (error) {
            console.log('⚠️ MenuCards: Ошибка загрузки из localStorage:', error);
        }

        // Последний fallback - дефолтные данные с примерами
        this.menuData = this.getDefaultMenuData();
        console.log('🔄 MenuCards: Используем дефолтные данные');
    }

    getDefaultMenuData() {
        return {
            pageTitle: "Меню",
            hero: {
                title: "Меню",
                backgroundImage: ""
            },
            categories: [
                {
                    id: "maki",
                    name: "Maki",
                    items: [
                        {
                            id: "spicy-tuna-maki",
                            name: "Spicy Tuna Maki",
                            price: "$5",
                            description: "A tantalizing blend of spicy tuna, cucumber, and avocado, harmoniously rolled in nori and seasoned rice.",
                            image: "https://via.placeholder.com/300x200?text=Spicy+Tuna+Maki",
                            spicy: true
                        },
                        {
                            id: "salmon-maki",
                            name: "Salmon Maki",
                            price: "$5",
                            description: "Fresh salmon wrapped in perfectly seasoned rice and nori seaweed.",
                            image: "https://via.placeholder.com/300x200?text=Salmon+Maki",
                            spicy: false
                        }
                    ]
                },
                {
                    id: "urmaki",
                    name: "Uramaki",
                    items: [
                        {
                            id: "volcano-delight",
                            name: "Volcano Delight",
                            price: "$12",
                            description: "Creamy crab salad, avocado, and cucumber rolled inside, topped with spicy tuna and drizzled with fiery sriracha sauce.",
                            image: "https://via.placeholder.com/300x200?text=Volcano+Delight",
                            spicy: true
                        }
                    ]
                },
                {
                    id: "special",
                    name: "Special Rolls",
                    items: [
                        {
                            id: "sunrise-bliss",
                            name: "Sunrise Bliss",
                            price: "$16",
                            description: "A delicate combination of fresh salmon, cream cheese, and asparagus, rolled in orange-hued tobiko for a burst of sunrise-inspired flavors.",
                            image: "https://via.placeholder.com/300x200?text=Sunrise+Bliss",
                            spicy: false
                        }
                    ]
                }
            ]
        };
    }

    renderMenu() {
        // Находим контейнер для меню
        const container = this.findMenuContainer();
        if (!container) {
            console.error('❌ MenuCards: Не найден контейнер для меню');
            return;
        }

        // Очищаем контейнер
        container.innerHTML = '';

        // Проверяем есть ли категории
        if (!this.menuData.categories || this.menuData.categories.length === 0) {
            this.renderEmptyState(container);
            return;
        }

        console.log(`🔄 MenuCards: Рендерим ${this.menuData.categories.length} категорий`);

        // Рендерим каждую категорию
        this.menuData.categories.forEach((category, index) => {
            const categoryElement = this.createCategoryElement(category, index);
            container.appendChild(categoryElement);
        });

        console.log('✅ MenuCards: Меню отрендерено успешно');

        // Уведомляем карусель об обновлении данных
        this.notifyCarousel();

        // Применяем дополнительные исправления стилей
        this.applyStyleFixes(container);
    }

    findMenuContainer() {
        // Пробуем найти контейнер по разным селекторам
        const selectors = [
            '#dynamic-menu-container',
            '.dynamic-menu-content',
            '.framer-i421fq',
            '.menu-content',
            'main .framer-i421fq'
        ];

        for (const selector of selectors) {
            const container = document.querySelector(selector);
            if (container) {
                console.log(`📍 MenuCards: Найден контейнер: ${selector}`);
                // Применяем стили к найденному контейнеру
                container.style.width = '100%';
                container.style.maxWidth = '1200px';
                container.style.margin = '0 auto';
                container.style.padding = '0 1rem';
                return container;
            }
        }

        console.log('📍 MenuCards: Создаем новый контейнер');
        // Если не найден, создаем новый
        const newContainer = document.createElement('div');
        newContainer.id = 'menu-cards-container';
        newContainer.className = 'menu-cards-container';

        // Применяем стили для правильного центрирования
        newContainer.style.cssText = `
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
        `;

        // Находим место для вставки (после фильтров)
        const filterSection = document.querySelector('.framer-h9nfgq, .framer-1qbhwgn');
        if (filterSection && filterSection.parentNode) {
            filterSection.parentNode.insertBefore(newContainer, filterSection.nextSibling);
        } else {
            // Если не найдено место, добавляем в main
            const main = document.querySelector('main, .framer-sajps8');
            if (main) {
                main.appendChild(newContainer);
            } else {
                document.body.appendChild(newContainer);
            }
        }

        return newContainer;
    }

    createCategoryElement(category, categoryIndex) {
        console.log(`🏷️ MenuCards: Создаем категорию "${category.name}"`);

        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'framer-cr81gk menu-category';
        categoryDiv.id = category.id || `category-${categoryIndex}`;

        // Заголовок категории с оригинальным дизайном
        const headerHTML = `
            <div class="framer-ctytay">
                <div class="framer-14yj1y1">
                    <div class="framer-ip9mw5" data-border="true" data-framer-name="Icon" style="transform:rotate(-45deg); background-color: var(--token-68c05b50-ca7b-4173-82aa-ed42aea1a9b4, rgb(232, 232, 232)); width: 8px; height: 8px; border: 1px solid var(--token-68c05b50-ca7b-4173-82aa-ed42aea1a9b4, rgb(232, 232, 232));"></div>
                    <div class="framer-bnmzg6" data-framer-name="Line" style="background-color: var(--token-68c05b50-ca7b-4173-82aa-ed42aea1a9b4, rgb(232, 232, 232)); height: 1px; flex: 1;"></div>
                </div>
                <div class="framer-om33u4" data-framer-component-type="RichTextContainer" style="outline:none;display:flex;flex-direction:column;justify-content:flex-start;flex-shrink:0;transform:none; margin: 0 1rem;">
                    <h2 class="framer-text framer-styles-preset-12lj5ox" data-styles-preset="YckFIlg3V" style="color: var(--token-b0d5b115-8d5e-4849-a7e4-d3bb5b253c70, rgb(239, 230, 210)); font-size: 2rem; font-weight: 600; margin: 0;">${category.name}${category.spicy ? ' 🌶️' : ''}</h2>
                </div>
                <div class="framer-1h4if96">
                    <div class="framer-194wd46" data-framer-name="Line" style="background-color: var(--token-68c05b50-ca7b-4173-82aa-ed42aea1a9b4, rgb(232, 232, 232)); height: 1px; flex: 1;"></div>
                    <div class="framer-pxgvsy" data-border="true" data-framer-name="Icon" style="transform:rotate(-45deg); background-color: var(--token-68c05b50-ca7b-4173-82aa-ed42aea1a9b4, rgb(232, 232, 232)); width: 8px; height: 8px; border: 1px solid var(--token-68c05b50-ca7b-4173-82aa-ed42aea1a9b4, rgb(232, 232, 232));"></div>
                </div>
            </div>
        `;

        categoryDiv.innerHTML = headerHTML;

        // Контейнер для блюд
        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'framer-18w9xn4 menu-items-container';
        itemsContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-top: 2rem;
        `;

        // Добавляем блюда
        if (category.items && category.items.length > 0) {
            category.items.forEach((item, itemIndex) => {
                const itemElement = this.createItemElement(item, itemIndex);
                itemsContainer.appendChild(itemElement);
            });
        } else {
            // Показываем сообщение если нет блюд
            const emptyMessage = document.createElement('div');
            emptyMessage.style.cssText = `
                padding: 2rem;
                text-align: center;
                color: var(--token-797a2fb4-2d14-46eb-9fb6-f38c1a9a545e, rgb(245, 242, 234));
                opacity: 0.7;
            `;
            emptyMessage.textContent = 'В этой категории пока нет блюд';
            itemsContainer.appendChild(emptyMessage);
        }

        categoryDiv.appendChild(itemsContainer);

        // Добавляем отступ между категориями
        categoryDiv.style.marginBottom = '3rem';

        console.log(`✅ MenuCards: Категория "${category.name}" создана с ${category.items?.length || 0} блюдами`);

        return categoryDiv;
    }

    createItemElement(item, itemIndex) {
        console.log(`🍱 MenuCards: Создаем блюдо "${item.name}"`);

        const itemDiv = document.createElement('div');
        itemDiv.className = 'ssr-variant hidden-1td9vov hidden-okrmbe menu-item-card';

        const itemContainer = document.createElement('div');
        itemContainer.className = 'framer-rto2k8-container modern-card-container';

        // Создаем HTML с новым современным дизайном
        itemContainer.innerHTML = `
            <div class="modern-menu-card" data-framer-name="Desktop" style="width: 100%; opacity: 1;">
                <div class="card-image-container">
                    <div class="card-image-wrapper">
                        <img alt="${item.name}"
                             decoding="async"
                             src="${item.image || 'https://via.placeholder.com/300x200?text=No+Image'}"
                             class="card-image"
                             onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'"/>
                        ${item.spicy ? '<div class="spicy-badge">🌶️</div>' : ''}
                    </div>
                </div>
                <div class="card-content">
                    <div class="card-header">
                        <h3 class="item-name">${item.name}</h3>
                        <div class="price-tag">${item.price}</div>
                    </div>
                    <p class="item-description">${item.description}</p>
                    <div class="card-footer">
                        <div class="card-divider"></div>
                    </div>
                </div>
            </div>
        `;

        itemDiv.appendChild(itemContainer);

        // Добавляем анимацию загрузки
        itemDiv.classList.add('loading');
        setTimeout(() => {
            itemDiv.classList.remove('loading');
            itemDiv.classList.add('loaded');
        }, 100 + itemIndex * 50);

        // Добавляем улучшенные hover эффекты
        itemDiv.addEventListener('mouseenter', () => {
            const card = itemContainer.querySelector('.modern-menu-card');
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 15px 35px rgba(0,0,0,0.3)';
        });

        itemDiv.addEventListener('mouseleave', () => {
            const card = itemContainer.querySelector('.modern-menu-card');
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        });

        console.log(`✅ MenuCards: Блюдо "${item.name}" создано`);

        return itemDiv;
    }

    renderEmptyState(container) {
        console.log('📝 MenuCards: Рендерим пустое состояние');

        container.innerHTML = `
            <div class="menu-empty-state" style="
                padding: 3rem 2rem;
                text-align: center;
                background: var(--token-cd2934a7-4e35-4347-a32c-9650fca4db23, rgba(24, 24, 24, 0.7));
                border-radius: 12px;
                border: 1px solid var(--token-68c05b50-ca7b-4173-82aa-ed42aea1a9b4, rgb(51, 51, 48));
                margin: 2rem 0;
            ">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🍽️</div>
                <h3 style="color: var(--token-b0d5b115-8d5e-4849-a7e4-d3bb5b253c70, rgb(239, 230, 210)); margin-bottom: 1rem;">Меню временно недоступно</h3>
                <p style="color: var(--token-797a2fb4-2d14-46eb-9fb6-f38c1a9a545e, rgb(245, 242, 234)); opacity: 0.8; line-height: 1.6;">
                    Наше меню обновляется. Пожалуйста, зайдите позже или обратитесь к нашему персоналу.
                </p>
            </div>
        `;
    }

    renderErrorMessage() {
        const container = this.findMenuContainer();
        if (!container) return;

        container.innerHTML = `
            <div class="menu-error-state" style="
                padding: 3rem 2rem;
                text-align: center;
                background: var(--token-cd2934a7-4e35-4347-a32c-9650fca4db23, rgba(24, 24, 24, 0.7));
                border-radius: 12px;
                border: 2px solid #ff6b6b;
                margin: 2rem 0;
            ">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                <h3 style="color: #ff6b6b; margin-bottom: 1rem;">Ошибка загрузки меню</h3>
                <p style="color: var(--token-797a2fb4-2d14-46eb-9fb6-f38c1a9a545e, rgb(245, 242, 234)); opacity: 0.8; line-height: 1.6; margin-bottom: 1.5rem;">
                    Произошла ошибка при загрузке меню. Попробуйте обновить страницу.
                </p>
                <button onclick="window.location.reload()" style="
                    background: #ff6b6b;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 1rem;
                ">Обновить страницу</button>
            </div>
        `;
    }

    setupUpdateListeners() {
        console.log('📡 MenuCards: Настраиваем слушатели обновлений');

        // Слушаем сообщения от админ панели
        window.addEventListener('message', (event) => {
            if (event.data.type === 'menuDataUpdate') {
                console.log('🔄 MenuCards: Получено обновление через postMessage');
                this.handleDataUpdate(event.data.data);
            }
        });

        // Слушаем изменения в localStorage
        window.addEventListener('storage', (event) => {
            if (event.key === 'menuData' && event.newValue) {
                console.log('🔄 MenuCards: Получено обновление через storage');
                this.handleDataUpdate(JSON.parse(event.newValue));
            }

            if (event.key === 'menuForceReload' && event.newValue === 'true') {
                console.log('🔄 MenuCards: Принудительная перезагрузка');
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            }
        });

        // Слушаем кастомные события
        window.addEventListener('menuDataForceUpdate', (event) => {
            if (event.detail && event.detail.data) {
                console.log('🔄 MenuCards: Получено обновление через CustomEvent');
                this.handleDataUpdate(event.detail.data);
            }
        });

        // BroadcastChannel если поддерживается
        try {
            if (typeof BroadcastChannel !== 'undefined') {
                this.broadcastChannel = new BroadcastChannel('menuUpdates');
                this.broadcastChannel.addEventListener('message', (event) => {
                    if (event.data.type === 'menuDataUpdate') {
                        console.log('🔄 MenuCards: Получено обновление через BroadcastChannel');
                        this.handleDataUpdate(event.data.data);
                    }
                });
            }
        } catch (error) {
            console.log('BroadcastChannel не поддерживается');
        }

        // Периодическая проверка обновлений каждые 30 секунд
        setInterval(() => {
            this.checkForUpdates();
        }, 30000);

        // Проверка при фокусе на странице
        window.addEventListener('focus', () => {
            this.checkForUpdates();
        });
    }

    handleDataUpdate(newData) {
        if (!newData) return;

        console.log('🔄 MenuCards: Обрабатываем обновление данных');

        // Сравниваем с текущими данными
        const currentDataStr = JSON.stringify(this.menuData);
        const newDataStr = JSON.stringify(newData);

        if (currentDataStr !== newDataStr) {
            this.menuData = newData;

            // Сохраняем в localStorage
            localStorage.setItem('menuData', newDataStr);

            // Перерендериваем меню
            this.renderMenu();

            // Показываем уведомление
            this.showUpdateNotification();

            console.log('✅ MenuCards: Данные обновлены и меню перерендерено');
        }
    }

    async checkForUpdates() {
        try {
            // Проверяем флаг принудительного обновления
            if (localStorage.getItem('menuForceReload') === 'true') {
                console.log('🔄 MenuCards: Принудительная перезагрузка');
                localStorage.removeItem('menuForceReload');
                window.location.reload();
                return;
            }

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
                const newData = await response.json();
                this.handleDataUpdate(newData);
            }
        } catch (error) {
            // Тихо игнорируем ошибки периодической проверки
            console.log('Периодическая проверка не удалась:', error);
        }
    }

    showUpdateNotification() {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
            z-index: 10000;
            transform: translateX(400px);
            transition: all 0.3s ease;
        `;
        notification.textContent = '🍽️ Меню обновлено!';

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

    // Метод для принудительного обновления (может быть вызван извне)
    async forceReload() {
        console.log('🔄 MenuCards: Принудительное обновление');
        await this.loadMenuData();
        this.renderMenu();
    }

    // Применяем дополнительные исправления стилей
    applyStyleFixes(container) {
        console.log('🎨 MenuCards: Применяем исправления стилей');

        // Исправляем контейнер
        if (container) {
            container.style.width = '100%';
            container.style.maxWidth = '1200px';
            container.style.margin = '0 auto';
            container.style.padding = '0 1rem';
        }

        // Исправляем все карточки
        const cards = container.querySelectorAll('.menu-item-card .framer-xpL7g');
        cards.forEach(card => {
            card.style.width = '100%';
            card.style.maxWidth = 'none';
            card.style.overflow = 'visible';
            card.style.display = 'flex';
            card.style.flexDirection = 'row';
            card.style.alignItems = 'stretch';
        });

        // Исправляем контент карточек
        const contents = container.querySelectorAll('.menu-item-card .framer-1qb1vz3');
        contents.forEach(content => {
            content.style.minWidth = '0';
            content.style.overflow = 'visible';
            content.style.flex = '1';
        });

        // Исправляем заголовки и описания
        const textElements = container.querySelectorAll('.menu-item-card .framer-text');
        textElements.forEach(text => {
            text.style.wordWrap = 'break-word';
            text.style.overflowWrap = 'break-word';
            text.style.whiteSpace = 'normal';
            text.style.overflow = 'visible';
        });

        console.log('✅ MenuCards: Исправления стилей применены');
    }

    // Очистка при выгрузке страницы
    cleanup() {
        if (this.broadcastChannel) {
            this.broadcastChannel.close();
        }
    }

    // Уведомляем карусель об обновлении данных меню
    notifyCarousel() {
        if (this.menuData && this.menuData.categories) {
            // Отправляем событие для карусели
            const event = new CustomEvent('menuDataUpdated', {
                detail: {
                    categories: this.menuData.categories
                }
            });
            document.dispatchEvent(event);
            console.log('🔄 MenuCards: Отправлено уведомление карусели');
        }
    }
}

// Инициализируем при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 MenuCards: DOM загружен, инициализируем...');
    window.menuCards = new MenuCards();
});

// Очистка при выгрузке
window.addEventListener('beforeunload', () => {
    if (window.menuCards) {
        window.menuCards.cleanup();
    }
});
