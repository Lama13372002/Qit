// Функции для управления мобильным меню
function openMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileMenuOverlay');
  const hamburger = document.querySelector('.hamburger-menu-btn');

  menu.classList.add('active');
  overlay.classList.add('active');
  document.body.classList.add('menu-open');

  if (hamburger) {
    hamburger.classList.add('active');
  }
}

function closeMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileMenuOverlay');
  const hamburger = document.querySelector('.hamburger-menu-btn');

  menu.classList.remove('active');
  overlay.classList.remove('active');
  document.body.classList.remove('menu-open');

  if (hamburger) {
    hamburger.classList.remove('active');
  }
}

// Инициализация после загрузки DOM
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

  // Закрытие при клике на overlay
  const overlay = document.getElementById('mobileMenuOverlay');
  if (overlay) {
    overlay.addEventListener('click', closeMobileMenu);
  }

  // Закрытие при клике на кнопку закрытия
  const closeBtn = document.querySelector('.mobile-menu-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeMobileMenu);
  }
});
