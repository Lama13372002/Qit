const googleTranslateConfig = {
    lang: "en", // Базовый язык - английский
};

let translateInitialized = false;

// Функция обработки клика по кнопке языка
function handleLanguageClick(e) {
    e.preventDefault();
    e.stopPropagation();

    const targetLang = this.getAttribute('data-google-lang');
    const currentLang = TranslateGetCode();

    console.log('Language click:', targetLang, 'current:', currentLang);

    // Устанавливаем cookie
    if (targetLang === googleTranslateConfig.lang) {
        // Если базовый язык, очищаем cookies
        TranslateClearCookie();
    } else {
        // Устанавливаем cookie для перевода
        TranslateSetCookie(targetLang);
    }

    // Добавляем визуальную обратную связь
    this.style.opacity = '0.5';
    document.body.style.cursor = 'wait';

    // Принудительная перезагрузка страницы
    console.log('Reloading page...');
    setTimeout(() => {
        window.location.reload(true);
    }, 50);
}

function TranslateInit() {
    if (translateInitialized) return;
    translateInitialized = true;

    console.log('Initializing Google Translate...');

    // Инициализируем виджет Google Translate (скрытый)
    new google.translate.TranslateElement({
        pageLanguage: googleTranslateConfig.lang,
        includedLanguages: 'en,lv,ru',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');

    // Обновляем активную кнопку при загрузке
    setTimeout(() => {
        const currentLang = TranslateGetCode();
        updateActiveButton(currentLang);
        hideGoogleTranslateElements();
    }, 500);

    // Добавляем обработчики кликов на кнопки языков с задержкой
    setTimeout(() => {
        const buttons = document.querySelectorAll('[data-google-lang]');
        console.log('Found language buttons:', buttons.length);

        buttons.forEach((button, index) => {
            console.log('Adding click handler to button', index, button.textContent);
            // Удаляем существующие обработчики
            button.removeEventListener('click', handleLanguageClick);
            // Добавляем новый обработчик
            button.addEventListener('click', handleLanguageClick, true);
        });
    }, 100);

    hideGoogleTranslateElements();
}

function updateActiveButton(activeCode) {
    document.querySelectorAll('[data-google-lang]').forEach(btn => {
        btn.classList.remove('language__img_active');
        if (btn.getAttribute('data-google-lang') === activeCode) {
            btn.classList.add('language__img_active');
        }
    });
}

function TranslateGetCode() {
    let cookie = getCookie('googtrans');
    if (cookie && cookie !== "null" && cookie.includes('/')) {
        return cookie.substr(-2);
    }
    return googleTranslateConfig.lang;
}

function TranslateClearCookie() {
    setCookie('googtrans', '', -1);
    setCookie('googtrans', '', -1, "." + document.domain);
    // Также очищаем вариации cookie
    setCookie('googtrans', 'null', -1);
    setCookie('googtrans', 'null', -1, "." + document.domain);
}

function TranslateSetCookie(code) {
    const cookieValue = "/auto/" + code;
    setCookie('googtrans', cookieValue, 365);
    setCookie('googtrans', cookieValue, 365, "." + document.domain);
}

function setCookie(name, value, days, domain) {
    let expires = "";
    if (days && days > 0) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    } else if (days < 0) {
        expires = "; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    }
    let domainStr = domain ? "; domain=" + domain : "";
    document.cookie = name + "=" + (value || "") + expires + "; path=/" + domainStr;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function hideGoogleTranslateElements() {
    const selectors = [
        '.skiptranslate',
        '.goog-te-banner-frame',
        '.goog-te-balloon-frame',
        '[id^="goog-"]:not(#google_translate_element)',
        '.goog-tooltip',
        '.goog-te-spinner-pos',
        '.goog-te-balloon',
        '.goog-te-ftab',
        '.goog-te-menu-frame',
        '.goog-te-menu',
        '.goog-te-gadget',
        'iframe[src*="translate.google"]',
        'iframe[src*="googleapis.com"]'
    ];

    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (el && el.style) {
                el.style.display = 'none !important';
                el.style.visibility = 'hidden !important';
                el.style.opacity = '0';
                el.style.height = '0px';
                el.style.width = '0px';
                el.style.position = 'absolute';
                el.style.left = '-9999px';
                el.style.top = '-9999px';
            }
        });
    });

    // Убираем отступ сверху от Google Translate
    if (document.body) {
        document.body.style.top = '0 !important';
        document.body.style.position = 'static !important';
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const currentLang = TranslateGetCode();
    updateActiveButton(currentLang);

    // Скрываем элементы Google Translate периодически
    hideGoogleTranslateElements();

    let attempts = 0;
    const maxAttempts = 20;
    const hideInterval = setInterval(() => {
        hideGoogleTranslateElements();
        attempts++;
        if (attempts >= maxAttempts) {
            clearInterval(hideInterval);
        }
    }, 200);

    // Если есть сохраненный язык (не базовый), показываем индикатор загрузки
    if (currentLang !== googleTranslateConfig.lang) {
        if (document.body) {
            document.body.style.opacity = '0.9';
            document.body.style.transition = 'opacity 0.5s ease';

            // Убираем индикатор после загрузки Google Translate
            setTimeout(() => {
                if (document.body) {
                    document.body.style.opacity = '1';
                }
            }, 2000);
        }
    }

    // Дополнительная инициализация обработчиков после полной загрузки страницы
    setTimeout(() => {
        const buttons = document.querySelectorAll('[data-google-lang]');
        console.log('DOM loaded, found buttons:', buttons.length);

        buttons.forEach((button, index) => {
            console.log('Setting up button', index, button.textContent);
            button.removeEventListener('click', handleLanguageClick);
            button.addEventListener('click', handleLanguageClick, true);
        });
    }, 1000);
});
