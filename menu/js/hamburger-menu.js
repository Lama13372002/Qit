// Hamburger Menu JavaScript

function openMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileMenuOverlay');
  const hamburger = document.querySelector('.hamburger-menu-btn');

  if (menu) menu.classList.add('active');
  if (overlay) overlay.classList.add('active');
  document.body.classList.add('menu-open');

  if (hamburger) {
    hamburger.classList.add('active');
  }
}

function closeMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileMenuOverlay');
  const hamburger = document.querySelector('.hamburger-menu-btn');

  if (menu) menu.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
  document.body.classList.remove('menu-open');

  if (hamburger) {
    hamburger.classList.remove('active');
  }
}

// Функция для перехода на главную страницу
function goToHomePage() {
  // Определяем текущую страницу и соответственно формируем путь
  const currentPath = window.location.pathname;
  if (currentPath.includes('/menu/')) {
    window.location.href = '../index.html';
  } else {
    window.location.href = './index.html';
  }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
  // Добавляем обработчик клика на гамбургер-меню
  const hamburgerBtn = document.querySelector('.hamburger-menu-btn');
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      openMobileMenu();
    });
  }

  // Закрытие по ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });

  // Закрытие по клику на фон
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileMenuOverlay');

  if (menu) {
    menu.addEventListener('click', function(e) {
      if (e.target === menu) {
        closeMobileMenu();
      }
    });
  }

  if (overlay) {
    overlay.addEventListener('click', function(e) {
      e.preventDefault();
      closeMobileMenu();
    });
  }

  // Закрытие при клике на элементы меню
  const menuItems = document.querySelectorAll('.mobile-menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', function() {
      closeMobileMenu();
    });
  });

  // Обработчик клика на логотип в мобильном меню
  const mobileMenuLogo = document.querySelector('.mobile-menu-logo');
  if (mobileMenuLogo) {
    mobileMenuLogo.addEventListener('click', function(e) {
      e.preventDefault();
      goToHomePage();
    });
  }

  // Обработчик клика на кнопку закрытия
  const closeButton = document.querySelector('.mobile-menu-close');
  if (closeButton) {
    closeButton.addEventListener('click', function(e) {
      e.preventDefault();
      closeMobileMenu();
    });
  }
});
