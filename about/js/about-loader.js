class AboutPageLoader {
    constructor() {
        this.aboutData = null;
        this.isInitialized = false;
        this.init();
    }

    async init() {
        // Скрываем контент до полной загрузки данных
        this.hideContentDuringLoad();

        await this.loadData();
        this.applyDataToPage();
        this.setupEventListeners();

        // Показываем контент после применения данных
        this.showContentAfterLoad();
        this.isInitialized = true;
    }

    hideContentDuringLoad() {
        // Добавляем стиль для скрытия контента во время загрузки
        const style = document.createElement('style');
        style.id = 'about-loader-style';
        style.textContent = `
            .framer-wgljk8, .framer-keww5a, .framer-a8lbq2,
            .framer-ceobpu-container, .framer-roab4s-container,
            .framer-y5apty, .framer-mhqezx, .framer-q365y8,
            .framer-1qos90t, .framer-11fnxlo, .framer-1isk8ah,
            .framer-ggpte5, .framer-1g49ivy {
                opacity: 0 !important;
                transition: opacity 0.3s ease !important;
            }
        `;
        document.head.appendChild(style);
    }

    showContentAfterLoad() {
        // Показываем контент с плавной анимацией
        const style = document.getElementById('about-loader-style');
        if (style) {
            style.textContent = `
                .framer-wgljk8, .framer-keww5a, .framer-a8lbq2,
                .framer-ceobpu-container, .framer-roab4s-container,
                .framer-y5apty, .framer-mhqezx, .framer-q365y8,
                .framer-1qos90t, .framer-11fnxlo, .framer-1isk8ah,
                .framer-ggpte5, .framer-1g49ivy {
                    opacity: 1 !important;
                    transition: opacity 0.3s ease !important;
                }
            `;

            // Удаляем стиль через секунду
            setTimeout(() => {
                if (style.parentNode) {
                    style.parentNode.removeChild(style);
                }
            }, 1000);
        }
    }

    async loadData() {
        try {
            // Пытаемся загрузить с сервера с более агрессивными анти-кэш параметрами
            const timestamp = Date.now();
            const randomParam = Math.random().toString(36).substring(7);
            const response = await fetch(`../data/about-data.json?v=${timestamp}&r=${randomParam}&_=${Date.now()}`, {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                    'If-Modified-Since': 'Thu, 01 Jan 1970 00:00:00 GMT'
                },
                cache: 'no-cache'
            });

            if (response.ok) {
                const newData = await response.json();
                // Проверяем, изменились ли данные
                if (JSON.stringify(this.aboutData) !== JSON.stringify(newData)) {
                    this.aboutData = newData;
                    console.log('📡 Данные About загружены с сервера (обновлены)');
                } else {
                    this.aboutData = newData;
                    console.log('📡 Данные About загружены с сервера');
                }
                return;
            }
        } catch (error) {
            console.log('⚠️ Ошибка загрузки с сервера:', error);
        }

        // Если сервер недоступен, пытаемся загрузить из localStorage
        const localData = localStorage.getItem('aboutData');
        if (localData) {
            this.aboutData = JSON.parse(localData);
            console.log('📱 Данные About загружены из localStorage');
            return;
        }

        console.log('ℹ️ Используются стандартные данные About');
        // Если ничего нет, данные остаются как есть на странице
    }

    applyDataToPage() {
        if (!this.aboutData) return;

        try {
            // Обновляем заголовок страницы
            this.updatePageTitle();

            // Обновляем hero секцию
            this.updateHeroSection();

            // Обновляем основную секцию
            this.updateMainSection();

            // Обновляем слайдеры
            this.updateSliders();

            // Обновляем награды
            this.updateAwards();

            // Обновляем нашу историю
            this.updateOurStory();

            // Обновляем логотип
            this.updateLogo();

            // Обновляем фоновое изображение
            this.updateBackgroundImage();

            console.log('✅ Данные About применены к странице');
        } catch (error) {
            console.error('❌ Ошибка применения данных About:', error);
        }
    }

    updatePageTitle() {
        // Обновляем title документа
        if (this.aboutData.pageTitle) {
            document.title = `${this.aboutData.pageTitle} - Qitchen Restaurant`;
        }

        // Обновляем главный заголовок hero секции
        const heroTitle = document.querySelector('.framer-wgljk8 h1');
        if (heroTitle && this.aboutData.hero?.title) {
            heroTitle.textContent = this.aboutData.hero.title;
        }
    }

    updateHeroSection() {
        // Обновляем фоновое изображение hero секции
        const heroImage = document.querySelector('.framer-1avfphl img');
        if (heroImage && this.aboutData.hero?.backgroundImage) {
            heroImage.src = this.aboutData.hero.backgroundImage;
            heroImage.alt = this.aboutData.hero.title || 'About section background';
        }
    }

    updateMainSection() {
        // Обновляем заголовок "Sushi Artistry Redefined"
        const mainTitle = document.querySelector('.framer-keww5a h2');
        if (mainTitle && this.aboutData.mainSection?.title) {
            mainTitle.innerHTML = this.aboutData.mainSection.title.replace(/\n/g, '<br class="framer-text"/>');
        }

        // Обновляем описание под заголовком
        const mainDescription = document.querySelector('.framer-a8lbq2 p');
        if (mainDescription && this.aboutData.mainSection?.description) {
            mainDescription.textContent = this.aboutData.mainSection.description;
        }
    }

    updateSliders() {
        // Обновляем первый слайдер
        if (this.aboutData.slider1?.images) {
            const slider1Images = document.querySelectorAll('.framer-ceobpu-container img');
            this.aboutData.slider1.images.forEach((imageSrc, index) => {
                if (slider1Images[index] && imageSrc) {
                    slider1Images[index].src = imageSrc;
                    slider1Images[index].alt = `Slider image ${index + 1}`;
                }
            });
        }

        // Обновляем второй слайдер
        if (this.aboutData.slider2?.images) {
            const slider2Images = document.querySelectorAll('.framer-roab4s-container img');
            this.aboutData.slider2.images.forEach((imageSrc, index) => {
                if (slider2Images[index] && imageSrc) {
                    slider2Images[index].src = imageSrc;
                    slider2Images[index].alt = `Slider 2 image ${index + 1}`;
                }
            });
        }
    }

    updateAwards() {
        if (!this.aboutData.awards) return;

        // Trip Advisor
        const tripAdvisorTitle = document.querySelector('.framer-y5apty p');
        const tripAdvisorSubtitle = document.querySelector('.framer-mhqezx p');
        if (tripAdvisorTitle && this.aboutData.awards.tripAdvisor?.title) {
            tripAdvisorTitle.textContent = this.aboutData.awards.tripAdvisor.title;
        }
        if (tripAdvisorSubtitle && this.aboutData.awards.tripAdvisor?.subtitle) {
            tripAdvisorSubtitle.textContent = this.aboutData.awards.tripAdvisor.subtitle;
        }

        // Michelin Guide
        const michelinTitle = document.querySelector('.framer-q365y8 p');
        const michelinSubtitle = document.querySelector('.framer-1qos90t p');
        if (michelinTitle && this.aboutData.awards.michelinGuide?.title) {
            michelinTitle.textContent = this.aboutData.awards.michelinGuide.title;
        }
        if (michelinSubtitle && this.aboutData.awards.michelinGuide?.subtitle) {
            michelinSubtitle.textContent = this.aboutData.awards.michelinGuide.subtitle;
        }

        // Star Dining
        const starDiningTitle = document.querySelector('.framer-11fnxlo p');
        const starDiningSubtitle = document.querySelector('.framer-1isk8ah p');
        if (starDiningTitle && this.aboutData.awards.starDining?.title) {
            starDiningTitle.textContent = this.aboutData.awards.starDining.title;
        }
        if (starDiningSubtitle && this.aboutData.awards.starDining?.subtitle) {
            starDiningSubtitle.textContent = this.aboutData.awards.starDining.subtitle;
        }
    }

    updateOurStory() {
        // Обновляем заголовок "Our Story"
        const storyTitle = document.querySelector('.framer-ggpte5 h4');
        if (storyTitle && this.aboutData.ourStory?.title) {
            storyTitle.textContent = this.aboutData.ourStory.title;
        }

        // Обновляем текст истории
        const storyDescription = document.querySelector('.framer-1g49ivy p');
        if (storyDescription && this.aboutData.ourStory?.description) {
            storyDescription.textContent = this.aboutData.ourStory.description;
        }
    }

    updateLogo() {
        // Обновляем логотип в хедере
        const headerLogo = document.querySelector('.framer-493dzc img');
        if (headerLogo && this.aboutData.header?.logo) {
            headerLogo.src = this.aboutData.header.logo;
            headerLogo.alt = 'Qitchen Restaurant Logo';
        }

        // Обновляем логотип в мобильном меню
        const mobileLogo = document.querySelector('.mobile-menu-logo');
        if (mobileLogo && this.aboutData.header?.logo) {
            mobileLogo.src = this.aboutData.header.logo;
            mobileLogo.alt = 'Qitchen Restaurant Logo';
        }
    }

    updateBackgroundImage() {
        // Обновляем фоновое изображение страницы
        const backgroundImage = document.querySelector('.framer-xyw2qg-container img');
        if (backgroundImage && this.aboutData.backgroundImage) {
            backgroundImage.src = this.aboutData.backgroundImage;
            backgroundImage.alt = 'Page background';
        }
    }

    setupEventListeners() {
        // Слушаем сообщения от админ панели
        window.addEventListener('message', (event) => {
            if (event.data.type === 'aboutDataUpdate') {
                console.log('🔄 Получено обновление от админ панели');
                this.aboutData = event.data.data;
                localStorage.setItem('aboutData', JSON.stringify(this.aboutData)); // Обновляем локальный кэш
                this.applyDataToPage();
                console.log('🔄 Данные About обновлены через postMessage');
            }
        });

        // Слушаем изменения в localStorage
        window.addEventListener('storage', (event) => {
            if (event.key === 'aboutData' && event.newValue) {
                console.log('🔄 Получено обновление через localStorage');
                this.aboutData = JSON.parse(event.newValue);
                this.applyDataToPage();
                console.log('🔄 Данные About обновлены через localStorage');
            }
        });

        // Слушаем кастомные события для принудительного обновления
        window.addEventListener('aboutDataForceUpdate', (event) => {
            if (event.detail && event.detail.data) {
                console.log('🔄 Получено принудительное обновление через кастомное событие');
                this.aboutData = event.detail.data;
                localStorage.setItem('aboutData', JSON.stringify(this.aboutData));
                this.applyDataToPage();

            }
        });

        // Добавляем поддержку BroadcastChannel для обновлений
        try {
            if (typeof BroadcastChannel !== 'undefined') {
                const channel = new BroadcastChannel('aboutUpdates');
                channel.addEventListener('message', (event) => {
                    if (event.data.type === 'aboutDataUpdate') {
                        console.log('🔄 Получено обновление через BroadcastChannel');
                        this.aboutData = event.data.data;
                        localStorage.setItem('aboutData', JSON.stringify(this.aboutData));
                        this.applyDataToPage();

                    }
                });

                // Сохраняем канал для возможности закрытия
                this.broadcastChannel = channel;
            }
        } catch (error) {
            console.log('BroadcastChannel не поддерживается в этом браузере:', error);
        }

        // Добавляем периодическую проверку обновлений (каждые 30 секунд)
        setInterval(async () => {
            await this.checkForUpdates();
        }, 30000);

        // Добавляем обработчик для принудительного обновления при фокусе на странице
        window.addEventListener('focus', async () => {
            console.log('🔍 Страница получила фокус, проверяем обновления');
            await this.checkForUpdates();
        });
    }

    showUpdateNotification() {
        // Показываем уведомление об обновлении данных
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
        notification.textContent = '✅ Страница About обновлена!';

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

    async checkForUpdates() {
        try {
            const timestamp = Date.now();
            const randomParam = Math.random().toString(36).substring(7);
            const response = await fetch(`../data/about-data.json?v=${timestamp}&r=${randomParam}`, {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                },
                cache: 'no-cache'
            });

            if (response.ok) {
                const newData = await response.json();
                // Сравниваем с текущими данными
                if (JSON.stringify(this.aboutData) !== JSON.stringify(newData)) {
                    console.log('🔄 Обнаружены новые данные About');
                    this.aboutData = newData;
                    localStorage.setItem('aboutData', JSON.stringify(this.aboutData));
                    this.applyDataToPage();

                }
            }
        } catch (error) {
            // Тихо игнорируем ошибки периодической проверки
            console.log('Периодическая проверка обновлений не удалась:', error);
        }
    }

    // Метод для принудительного обновления (может быть вызван извне)
    async forceUpdate() {
        console.log('🔄 Принудительное обновление данных About');
        await this.loadData();
        this.applyDataToPage();
    }

    // Метод для корректного закрытия соединений (вызывается при выгрузке страницы)
    cleanup() {
        if (this.broadcastChannel) {
            this.broadcastChannel.close();
            console.log('🔌 BroadcastChannel закрыт');
        }
    }
}

// Инициализируем загрузчик при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    window.aboutPageLoader = new AboutPageLoader();
});

// Закрываем соединения при выгрузке страницы
window.addEventListener('beforeunload', () => {
    if (window.aboutPageLoader) {
        window.aboutPageLoader.cleanup();
    }
});
