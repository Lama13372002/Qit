class AboutAdminPanel {
    constructor() {
        this.aboutData = null;
        this.init();
    }

    async init() {
        await this.loadData();
        this.renderAboutForm();
        this.renderPreview();
        this.bindEvents();
    }

    async loadData() {
        try {
            const timestamp = Date.now();
            const response = await fetch(`../data/about-data.json?v=${timestamp}&_cache=no`, {
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
            this.aboutData = await response.json();
            console.log('📡 Данные About страницы загружены с сервера');
        } catch (error) {
            console.error('Ошибка загрузки данных About:', error);

            // Если сервер недоступен, пытаемся загрузить из localStorage
            const localData = localStorage.getItem('aboutData');
            if (localData) {
                this.aboutData = JSON.parse(localData);
                console.log('⚠️ Данные About загружены из localStorage');
                this.showMessage('Данные загружены из кэша (сервер недоступен)', 'warning');
                return;
            }

            // Если ничего нет, используем дефолтные данные
            this.showMessage('Ошибка загрузки данных About', 'error');
            this.aboutData = this.getDefaultData();
        }
    }

    getDefaultData() {
        return {
            pageTitle: "About",
            hero: {
                backgroundImage: "about/images/image_002.webp",
                title: "About"
            },
            mainSection: {
                title: "Sushi Artistry Redefined",
                description: "Where culinary craftsmanship meets modern elegance. Indulge in the finest sushi, expertly curated to elevate your dining experience."
            },
            slider1: {
                images: [
                    "about/images/image_003.webp",
                    "about/images/image_004.webp",
                    "about/images/image_005.webp"
                ]
            },
            awards: {
                tripAdvisor: {
                    title: "Trip Advisor",
                    subtitle: "Best Sushi"
                },
                michelinGuide: {
                    title: "Michelin Guide",
                    subtitle: "Quality Food"
                },
                starDining: {
                    title: "Start Dining",
                    subtitle: "Cool vibe"
                }
            },
            slider2: {
                images: [
                    "about/images/image_008.webp",
                    "about/images/image_009.webp",
                    "about/images/image_010.webp"
                ]
            },
            ourStory: {
                title: "Our Story",
                description: "Founded with a passion for culinary excellence, Qitchen's journey began in the heart of Prague. Over years, it evolved into a haven for sushi enthusiasts, celebrated for its artful mastery and devotion to redefining gastronomy."
            },
            header: {
                logo: "about/images/image_001.webp"
            },
            backgroundImage: "about/images/image_013.jpg"
        };
    }

    renderAboutForm() {
        const container = document.getElementById('aboutFormContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h2>Редактирование страницы About</h2>
                    <p>Настройте содержимое страницы "О нас"</p>
                </div>

                <div class="card-body">
                    <!-- Герой секция -->
                    <div class="form-section">
                        <h3>Главная секция (Hero)</h3>
                        <div class="form-group">
                            <label for="heroTitle">Заголовок страницы:</label>
                            <input type="text" id="heroTitle" value="${this.aboutData.hero.title}" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="heroBackground">Фоновое изображение:</label>
                            <input type="url" id="heroBackground" value="${this.aboutData.hero.backgroundImage}"
                                   class="form-control" placeholder="Вставьте ссылку на изображение">
                        </div>
                    </div>

                    <!-- Основная секция -->
                    <div class="form-section">
                        <h3>Основная секция</h3>
                        <div class="form-group">
                            <label for="mainTitle">Главный заголовок:</label>
                            <input type="text" id="mainTitle" value="${this.aboutData.mainSection.title}" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="mainDescription">Описание:</label>
                            <textarea id="mainDescription" class="form-control" rows="3">${this.aboutData.mainSection.description}</textarea>
                        </div>
                    </div>

                    <!-- Первый слайдер -->
                    <div class="form-section">
                        <h3>Первый слайдер (3 изображения)</h3>
                        <div class="form-group">
                            <label for="slider1Image1">Изображение 1:</label>
                            <input type="url" id="slider1Image1" value="${this.aboutData.slider1.images[0]}"
                                   class="form-control" placeholder="Вставьте ссылку на изображение">
                        </div>
                        <div class="form-group">
                            <label for="slider1Image2">Изображение 2:</label>
                            <input type="url" id="slider1Image2" value="${this.aboutData.slider1.images[1]}"
                                   class="form-control" placeholder="Вставьте ссылку на изображение">
                        </div>
                        <div class="form-group">
                            <label for="slider1Image3">Изображение 3:</label>
                            <input type="url" id="slider1Image3" value="${this.aboutData.slider1.images[2]}"
                                   class="form-control" placeholder="Вставьте ссылку на изображение">
                        </div>
                    </div>

                    <!-- Награды -->
                    <div class="form-section">
                        <h3>Награды и достижения</h3>
                        <div class="awards-grid">
                            <div class="award-item">
                                <h4>Trip Advisor</h4>
                                <div class="form-group">
                                    <label for="tripAdvisorTitle">Заголовок:</label>
                                    <input type="text" id="tripAdvisorTitle" value="${this.aboutData.awards.tripAdvisor.title}" class="form-control">
                                </div>
                                <div class="form-group">
                                    <label for="tripAdvisorSubtitle">Подзаголовок:</label>
                                    <input type="text" id="tripAdvisorSubtitle" value="${this.aboutData.awards.tripAdvisor.subtitle}" class="form-control">
                                </div>
                            </div>
                            <div class="award-item">
                                <h4>Michelin Guide</h4>
                                <div class="form-group">
                                    <label for="michelinTitle">Заголовок:</label>
                                    <input type="text" id="michelinTitle" value="${this.aboutData.awards.michelinGuide.title}" class="form-control">
                                </div>
                                <div class="form-group">
                                    <label for="michelinSubtitle">Подзаголовок:</label>
                                    <input type="text" id="michelinSubtitle" value="${this.aboutData.awards.michelinGuide.subtitle}" class="form-control">
                                </div>
                            </div>
                            <div class="award-item">
                                <h4>Star Dining</h4>
                                <div class="form-group">
                                    <label for="starDiningTitle">Заголовок:</label>
                                    <input type="text" id="starDiningTitle" value="${this.aboutData.awards.starDining.title}" class="form-control">
                                </div>
                                <div class="form-group">
                                    <label for="starDiningSubtitle">Подзаголовок:</label>
                                    <input type="text" id="starDiningSubtitle" value="${this.aboutData.awards.starDining.subtitle}" class="form-control">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Второй слайдер -->
                    <div class="form-section">
                        <h3>Второй слайдер (3 изображения)</h3>
                        <div class="form-group">
                            <label for="slider2Image1">Изображение 1:</label>
                            <input type="url" id="slider2Image1" value="${this.aboutData.slider2.images[0]}"
                                   class="form-control" placeholder="Вставьте ссылку на изображение">
                        </div>
                        <div class="form-group">
                            <label for="slider2Image2">Изображение 2:</label>
                            <input type="url" id="slider2Image2" value="${this.aboutData.slider2.images[1]}"
                                   class="form-control" placeholder="Вставьте ссылку на изображение">
                        </div>
                        <div class="form-group">
                            <label for="slider2Image3">Изображение 3:</label>
                            <input type="url" id="slider2Image3" value="${this.aboutData.slider2.images[2]}"
                                   class="form-control" placeholder="Вставьте ссылку на изображение">
                        </div>
                    </div>

                    <!-- Наша история -->
                    <div class="form-section">
                        <h3>Наша история</h3>
                        <div class="form-group">
                            <label for="storyTitle">Заголовок секции:</label>
                            <input type="text" id="storyTitle" value="${this.aboutData.ourStory.title}" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="storyDescription">Текст истории:</label>
                            <textarea id="storyDescription" class="form-control" rows="4">${this.aboutData.ourStory.description}</textarea>
                        </div>
                    </div>

                    <!-- Дополнительные элементы -->
                    <div class="form-section">
                        <h3>Дополнительные элементы</h3>
                        <div class="form-group">
                            <label for="headerLogo">Логотип в хедере:</label>
                            <input type="url" id="headerLogo" value="${this.aboutData.header.logo}"
                                   class="form-control" placeholder="Вставьте ссылку на логотип">
                        </div>
                        <div class="form-group">
                            <label for="pageBackground">Фоновое изображение страницы:</label>
                            <input type="url" id="pageBackground" value="${this.aboutData.backgroundImage}"
                                   class="form-control" placeholder="Вставьте ссылку на фоновое изображение">
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderPreview() {
        const container = document.getElementById('previewContent');
        if (!container) return;

        container.innerHTML = `
            <div class="about-preview">
                <h3>Предварительный просмотр страницы About</h3>

                <div class="preview-section">
                    <h4>Герой секция</h4>
                    <div class="preview-hero" style="background-image: url('${this.aboutData.hero.backgroundImage}')">
                        <h1>${this.aboutData.hero.title}</h1>
                    </div>
                </div>

                <div class="preview-section">
                    <h4>Основная секция</h4>
                    <h2>${this.aboutData.mainSection.title}</h2>
                    <p>${this.aboutData.mainSection.description}</p>
                </div>

                <div class="preview-section">
                    <h4>Первый слайдер</h4>
                    <div class="preview-slider">
                        ${this.aboutData.slider1.images.map(img => `<img src="${img}" alt="Slider image" class="preview-img">`).join('')}
                    </div>
                </div>

                <div class="preview-section">
                    <h4>Награды</h4>
                    <div class="preview-awards">
                        <div class="award">${this.aboutData.awards.tripAdvisor.title} - ${this.aboutData.awards.tripAdvisor.subtitle}</div>
                        <div class="award">${this.aboutData.awards.michelinGuide.title} - ${this.aboutData.awards.michelinGuide.subtitle}</div>
                        <div class="award">${this.aboutData.awards.starDining.title} - ${this.aboutData.awards.starDining.subtitle}</div>
                    </div>
                </div>

                <div class="preview-section">
                    <h4>Второй слайдер</h4>
                    <div class="preview-slider">
                        ${this.aboutData.slider2.images.map(img => `<img src="${img}" alt="Slider image" class="preview-img">`).join('')}
                    </div>
                </div>

                <div class="preview-section">
                    <h4>Наша история</h4>
                    <h3>${this.aboutData.ourStory.title}</h3>
                    <p>${this.aboutData.ourStory.description}</p>
                </div>
            </div>
        `;
    }

    bindEvents() {
        // Обработчики для всех инпутов
        const inputs = [
            'heroTitle', 'heroBackground', 'mainTitle', 'mainDescription',
            'slider1Image1', 'slider1Image2', 'slider1Image3',
            'tripAdvisorTitle', 'tripAdvisorSubtitle',
            'michelinTitle', 'michelinSubtitle',
            'starDiningTitle', 'starDiningSubtitle',
            'slider2Image1', 'slider2Image2', 'slider2Image3',
            'storyTitle', 'storyDescription', 'headerLogo', 'pageBackground'
        ];

        inputs.forEach(inputId => {
            const element = document.getElementById(inputId);
            if (element) {
                element.addEventListener('input', () => {
                    this.updateData();
                    this.renderPreview();
                });
            }
        });
    }

    updateData() {
        // Обновляем данные из формы
        this.aboutData.hero.title = document.getElementById('heroTitle')?.value || '';
        this.aboutData.hero.backgroundImage = document.getElementById('heroBackground')?.value || '';
        this.aboutData.mainSection.title = document.getElementById('mainTitle')?.value || '';
        this.aboutData.mainSection.description = document.getElementById('mainDescription')?.value || '';

        this.aboutData.slider1.images[0] = document.getElementById('slider1Image1')?.value || '';
        this.aboutData.slider1.images[1] = document.getElementById('slider1Image2')?.value || '';
        this.aboutData.slider1.images[2] = document.getElementById('slider1Image3')?.value || '';

        this.aboutData.awards.tripAdvisor.title = document.getElementById('tripAdvisorTitle')?.value || '';
        this.aboutData.awards.tripAdvisor.subtitle = document.getElementById('tripAdvisorSubtitle')?.value || '';
        this.aboutData.awards.michelinGuide.title = document.getElementById('michelinTitle')?.value || '';
        this.aboutData.awards.michelinGuide.subtitle = document.getElementById('michelinSubtitle')?.value || '';
        this.aboutData.awards.starDining.title = document.getElementById('starDiningTitle')?.value || '';
        this.aboutData.awards.starDining.subtitle = document.getElementById('starDiningSubtitle')?.value || '';

        this.aboutData.slider2.images[0] = document.getElementById('slider2Image1')?.value || '';
        this.aboutData.slider2.images[1] = document.getElementById('slider2Image2')?.value || '';
        this.aboutData.slider2.images[2] = document.getElementById('slider2Image3')?.value || '';

        this.aboutData.ourStory.title = document.getElementById('storyTitle')?.value || '';
        this.aboutData.ourStory.description = document.getElementById('storyDescription')?.value || '';
        this.aboutData.header.logo = document.getElementById('headerLogo')?.value || '';
        this.aboutData.backgroundImage = document.getElementById('pageBackground')?.value || '';
    }

    async saveData() {
        try {
            // ВАЖНО: Обновляем данные из формы перед сохранением
            this.updateData();

            const saveBtn = document.getElementById('saveBtn');
            saveBtn.textContent = 'Сохранение...';
            saveBtn.disabled = true;

            let serverSaved = false;
            let errorMessage = '';

            // Пытаемся сохранить на сервере
            try {
                const response = await fetch('save-about-data.php', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache',
                        'Connection': 'close'
                    },
                    body: JSON.stringify(this.aboutData, null, 2),
                    cache: 'no-cache',
                    mode: 'cors',
                    credentials: 'same-origin'
                });

                if (response.ok) {
                    const result = await response.json();
                    serverSaved = true;
                    console.log('✅ Данные About сохранены на сервере:', result);
                } else {
                    const errorData = await response.text();
                    errorMessage = `Ошибка сервера: ${response.status}`;
                    console.log('❌ Ошибка сохранения About на сервере:', errorData);
                }
            } catch (error) {
                errorMessage = 'Сервер недоступен или проблемы с подключением';
                console.log('⚠️ Ошибка подключения при сохранении About:', error);

                // Дополнительная попытка с POST методом
                try {
                    console.log('🔄 Пытаемся повторить запрос About с POST...');
                    const retryResponse = await fetch('save-about-data.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(this.aboutData, null, 2)
                    });

                    if (retryResponse.ok) {
                        const result = await retryResponse.json();
                        serverSaved = true;
                        console.log('✅ Данные About сохранены на сервере (повторная попытка):', result);
                    }
                } catch (retryError) {
                    console.log('❌ Повторная попытка About не удалась:', retryError);
                }
            }

            if (serverSaved) {
                localStorage.setItem('aboutData', JSON.stringify(this.aboutData));
                this.updateAboutPage();
                this.showMessage('✅ Данные About успешно сохранены на сервере!', 'success');
            } else {
                localStorage.setItem('aboutData', JSON.stringify(this.aboutData));
                this.updateAboutPage();
                this.downloadJSON();
                this.showMessage(`⚠️ ${errorMessage}. Данные About сохранены локально и файл скачан.`, 'warning');
            }

        } catch (error) {
            console.error('Ошибка сохранения About:', error);
            localStorage.setItem('aboutData', JSON.stringify(this.aboutData));
            this.updateAboutPage();
            this.downloadJSON();
            this.showMessage('❌ Ошибка сохранения. Данные About сохранены локально.', 'error');
        } finally {
            const saveBtn = document.getElementById('saveBtn');
            saveBtn.textContent = 'Сохранить изменения';
            saveBtn.disabled = false;
        }
    }

    updateAboutPage() {
        // Принудительно сохраняем в localStorage с временной меткой
        const dataWithTimestamp = {
            ...this.aboutData,
            _lastUpdate: Date.now()
        };
        localStorage.setItem('aboutData', JSON.stringify(dataWithTimestamp));

        // Отправляем событие для обновления About страницы (для новых окон)
        if (window.opener && !window.opener.closed) {
            window.opener.postMessage({
                type: 'aboutDataUpdate',
                data: this.aboutData,
                timestamp: Date.now()
            }, '*');
        }

        // Пытаемся найти и обновить все открытые вкладки с about страницей
        try {
            // Создаем кастомное событие для принудительного обновления
            const updateEvent = new CustomEvent('aboutDataForceUpdate', {
                detail: { data: this.aboutData, timestamp: Date.now() }
            });
            window.dispatchEvent(updateEvent);
        } catch (error) {
            console.log('Ошибка отправки кастомного события:', error);
        }

        // Также сохраняем в localStorage для других вкладок (принудительно)
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'aboutData',
            newValue: JSON.stringify(this.aboutData),
            oldValue: null
        }));

        // Отправляем широковещательное сообщение через BroadcastChannel (если поддерживается)
        try {
            if (typeof BroadcastChannel !== 'undefined') {
                const channel = new BroadcastChannel('aboutUpdates');
                channel.postMessage({
                    type: 'aboutDataUpdate',
                    data: this.aboutData,
                    timestamp: Date.now()
                });
                channel.close();
            }
        } catch (error) {
            console.log('BroadcastChannel не поддерживается:', error);
        }

        console.log('🔄 Данные About отправлены на страницу (все методы)');
    }

    downloadJSON() {
        const dataStr = JSON.stringify(this.aboutData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = 'about-data.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        console.log('📁 Файл about-data.json скачан');
    }

    showMessage(text, type) {
        const messageElement = document.getElementById('statusMessage');
        if (messageElement) {
            messageElement.textContent = text;
            messageElement.className = `status-message ${type}`;

            setTimeout(() => {
                messageElement.classList.add('show');
            }, 100);

            setTimeout(() => {
                messageElement.classList.remove('show');
            }, 5000);
        }
    }
}

// Экспортируем класс для использования в главной админке
window.AboutAdminPanel = AboutAdminPanel;
