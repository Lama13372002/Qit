// Скрипт для динамической загрузки ссылок социальных сетей
class SocialLinksLoader {
    constructor() {
        this.init();
    }

    async init() {
        try {
            // Небольшая задержка для обеспечения полной загрузки DOM
            await new Promise(resolve => setTimeout(resolve, 100));
            await this.loadSocialLinks();
        } catch (error) {
            console.error('Ошибка загрузки социальных ссылок:', error);
        }
    }

    async loadSocialLinks() {
        try {
            // Загружаем данные с кэш-busting параметром
            const timestamp = Date.now();
            const response = await fetch(`data/working-hours.json?v=${timestamp}`, {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                },
                cache: 'no-cache'
            });

            if (!response.ok) {
                throw new Error(`Ошибка загрузки данных: ${response.status}`);
            }

            const data = await response.json();

            if (data.social_links) {
                this.updateSocialLinks(data.social_links);
                console.log('✅ Социальные ссылки обновлены:', data.social_links);
            }
        } catch (error) {
            console.error('Ошибка при загрузке социальных ссылок:', error);
        }
    }

    updateSocialLinks(socialLinks) {
        // Ищем ссылки по атрибуту data-social (новый способ)
        const instagramLinks = document.querySelectorAll('a[data-social="instagram"]');
        instagramLinks.forEach(link => {
            if (socialLinks.instagram) {
                link.href = socialLinks.instagram;
                console.log('Instagram ссылка обновлена:', socialLinks.instagram);
            }
        });

        const facebookLinks = document.querySelectorAll('a[data-social="facebook"]');
        facebookLinks.forEach(link => {
            if (socialLinks.facebook) {
                link.href = socialLinks.facebook;
                console.log('Facebook ссылка обновлена:', socialLinks.facebook);
            }
        });

        const twitterLinks = document.querySelectorAll('a[data-social="twitter"]');
        twitterLinks.forEach(link => {
            if (socialLinks.twitter) {
                link.href = socialLinks.twitter;
                console.log('Twitter ссылка обновлена:', socialLinks.twitter);
            }
        });

        // Также ищем ссылки по href содержимому (для старых версий)
        const instagramHrefLinks = document.querySelectorAll('a[href*="instagram"]');
        instagramHrefLinks.forEach(link => {
            if (socialLinks.instagram) {
                link.href = socialLinks.instagram;
            }
        });

        const facebookHrefLinks = document.querySelectorAll('a[href*="facebook"]');
        facebookHrefLinks.forEach(link => {
            if (socialLinks.facebook) {
                link.href = socialLinks.facebook;
            }
        });

        const twitterHrefLinks = document.querySelectorAll('a[href*="twitter"]');
        twitterHrefLinks.forEach(link => {
            if (socialLinks.twitter) {
                link.href = socialLinks.twitter;
            }
        });
    }
}

// Инициализируем загрузчик при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    new SocialLinksLoader();
});

// Также инициализируем, если DOM уже загружен
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new SocialLinksLoader();
    });
} else {
    new SocialLinksLoader();
}
