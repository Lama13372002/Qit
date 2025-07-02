/**
 * Плавающая карусель категорий
 * Появляется при скролле, синхронизируется с меню
 */
class CategoryCarousel {
    constructor() {
        this.carousel = null;
        this.carouselItems = null;
        this.prevBtn = null;
        this.nextBtn = null;
        this.currentIndex = 0;
        this.itemWidth = 0;
        this.maxIndex = 0;
        this.categories = [];
        this.isVisible = false;
        this.scrollThreshold = 200; // Пиксели от верха для появления

        // Touch события
        this.touchStartX = 0;
        this.touchCurrentX = 0;
        this.isDragging = false;

        console.log('🎠 CategoryCarousel: Инициализация...');
        this.init();
    }

    init() {
        this.findElements();
        this.setupScrollListener();
        this.setupNavigation();
        this.setupTouchEvents();
        this.waitForMenuData();
    }

    findElements() {
        this.carousel = document.getElementById('category-carousel');
        this.carouselItems = document.getElementById('carousel-items');
        this.prevBtn = document.getElementById('carousel-prev');
        this.nextBtn = document.getElementById('carousel-next');

        if (!this.carousel || !this.carouselItems || !this.prevBtn || !this.nextBtn) {
            console.error('❌ CategoryCarousel: Не найдены необходимые элементы');
            return false;
        }
        return true;
    }

    setupScrollListener() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    handleScroll() {
        const scrollY = window.scrollY;
        const shouldShow = scrollY > this.scrollThreshold;

        if (shouldShow && !this.isVisible) {
            this.showCarousel();
        } else if (!shouldShow && this.isVisible) {
            this.hideCarousel();
        }

        // Подсветка активной категории при скролле
        if (this.isVisible) {
            this.updateActiveCategory();
        }
    }

    showCarousel() {
        if (!this.carousel || this.categories.length === 0) return;

        this.isVisible = true;
        this.carousel.style.display = 'block';

        // Небольшая задержка для плавной анимации
        setTimeout(() => {
            this.carousel.classList.add('visible', 'animate-in');
        }, 10);

        console.log('🎠 CategoryCarousel: Карусель показана');
    }

    hideCarousel() {
        if (!this.carousel) return;

        this.isVisible = false;
        this.carousel.classList.remove('visible', 'animate-in');

        // Скрываем после завершения анимации
        setTimeout(() => {
            if (!this.isVisible) {
                this.carousel.style.display = 'none';
            }
        }, 400);

        console.log('🎠 CategoryCarousel: Карусель скрыта');
    }

    waitForMenuData() {
        // Ждем загрузки данных меню
        const checkMenuData = () => {
            if (window.menuCardsInstance && window.menuCardsInstance.menuData) {
                this.loadCategories(window.menuCardsInstance.menuData.categories);
            } else {
                setTimeout(checkMenuData, 100);
            }
        };
        checkMenuData();

        // Слушаем обновления меню
        document.addEventListener('menuDataUpdated', (event) => {
            if (event.detail && event.detail.categories) {
                this.loadCategories(event.detail.categories);
            }
        });
    }

    loadCategories(categories) {
        if (!categories || categories.length === 0) {
            console.log('🎠 CategoryCarousel: Нет категорий для отображения');
            return;
        }

        this.categories = categories;
        this.renderCategories();
        this.updateNavigation();

        console.log(`🎠 CategoryCarousel: Загружено ${categories.length} категорий`);
    }

    renderCategories() {
        if (!this.carouselItems) return;

        this.carouselItems.innerHTML = '';

        this.categories.forEach((category, index) => {
            const item = document.createElement('a');
            item.className = 'carousel-item';
            item.href = `#${category.id}`;
            item.textContent = category.name;
            item.dataset.categoryId = category.id;
            item.dataset.index = index;

            // Обработчик клика
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToCategory(category.id);
                this.setActiveItem(index);
            });

            this.carouselItems.appendChild(item);
        });

        // Вычисляем максимальный индекс для навигации
        this.calculateMaxIndex();
    }

    calculateMaxIndex() {
        if (!this.carouselItems) return;

        const containerWidth = this.carouselItems.parentElement.clientWidth;
        const totalWidth = this.carouselItems.scrollWidth;

        this.maxIndex = Math.max(0, Math.ceil((totalWidth - containerWidth) / 120)); // 120px примерная ширина элемента
    }

    setupNavigation() {
        if (!this.prevBtn || !this.nextBtn) return;

        this.prevBtn.addEventListener('click', () => {
            this.currentIndex = Math.max(0, this.currentIndex - 1);
            this.updateCarouselPosition();
            this.updateNavigation();
        });

        this.nextBtn.addEventListener('click', () => {
            this.currentIndex = Math.min(this.maxIndex, this.currentIndex + 1);
            this.updateCarouselPosition();
            this.updateNavigation();
        });
    }

    updateCarouselPosition() {
        if (!this.carouselItems) return;

        const translateX = -(this.currentIndex * 120); // 120px за шаг
        this.carouselItems.style.transform = `translateX(${translateX}px)`;
    }

    updateNavigation() {
        if (!this.prevBtn || !this.nextBtn) return;

        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex >= this.maxIndex;
    }

    scrollToCategory(categoryId) {
        const categoryElement = document.getElementById(categoryId);
        if (categoryElement) {
            const offsetTop = categoryElement.offsetTop - 80; // Учитываем высоту карусели

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            console.log(`🎠 CategoryCarousel: Скролл к категории ${categoryId}`);
        }
    }

    updateActiveCategory() {
        if (!this.categories.length) return;

        const scrollY = window.scrollY + 100; // Смещение для лучшего определения
        let activeIndex = 0;

        // Находим активную категорию на основе позиции скролла
        for (let i = 0; i < this.categories.length; i++) {
            const categoryElement = document.getElementById(this.categories[i].id);
            if (categoryElement && categoryElement.offsetTop <= scrollY) {
                activeIndex = i;
            }
        }

        this.setActiveItem(activeIndex);
    }

    setupTouchEvents() {
        // Настраиваем touch-события только после того, как элементы созданы
        document.addEventListener('menuDataUpdated', () => {
            setTimeout(() => {
                this.addTouchListeners();
            }, 100);
        });
    }

    addTouchListeners() {
        if (!this.carouselItems) return;

        // Touch события для свайпа
        this.carouselItems.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.isDragging = true;
        }, { passive: true });

        this.carouselItems.addEventListener('touchmove', (e) => {
            if (!this.isDragging) return;
            this.touchCurrentX = e.touches[0].clientX;
        }, { passive: true });

        this.carouselItems.addEventListener('touchend', (e) => {
            if (!this.isDragging) return;
            this.isDragging = false;

            const touchDiff = this.touchStartX - this.touchCurrentX;
            const threshold = 50; // Минимальное расстояние для свайпа

            if (Math.abs(touchDiff) > threshold) {
                if (touchDiff > 0) {
                    // Свайп влево - следующий
                    this.currentIndex = Math.min(this.maxIndex, this.currentIndex + 1);
                } else {
                    // Свайп вправо - предыдущий
                    this.currentIndex = Math.max(0, this.currentIndex - 1);
                }
                this.updateCarouselPosition();
                this.updateNavigation();
            }
        }, { passive: true });

        // Поддержка колесика мыши
        this.carouselItems.addEventListener('wheel', (e) => {
            e.preventDefault();

            if (e.deltaX > 0 || e.deltaY > 0) {
                // Скролл вправо/вниз
                this.currentIndex = Math.min(this.maxIndex, this.currentIndex + 1);
            } else {
                // Скролл влево/вверх
                this.currentIndex = Math.max(0, this.currentIndex - 1);
            }

            this.updateCarouselPosition();
            this.updateNavigation();
        }, { passive: false });

        console.log('👆 CategoryCarousel: Touch-события настроены');
    }

    setActiveItem(index) {
        if (!this.carouselItems) return;

        // Убираем активный класс у всех элементов
        const items = this.carouselItems.querySelectorAll('.carousel-item');
        items.forEach(item => item.classList.remove('active'));

        // Добавляем активный класс к нужному элементу
        if (items[index]) {
            items[index].classList.add('active');
        }
    }

    // Публичный метод для обновления данных
    updateCategories(categories) {
        this.loadCategories(categories);
    }
}

// Инициализируем карусель после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    window.categoryCarouselInstance = new CategoryCarousel();
});

// Экспортируем для использования в других модулях
window.CategoryCarousel = CategoryCarousel;
