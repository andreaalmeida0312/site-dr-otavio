// Cabeçalho das páginas internas: menu do celular e lista de especialidades
(function () {
  var toggle = document.getElementById('menuToggle');
  var menu = document.getElementById('mobileMenu');
  if (toggle && menu) {
    var close = function () {
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
      document.body.classList.remove('menu-open');
    };
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
      document.body.classList.toggle('menu-open', open);
    });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
    var x = document.getElementById('mobileMenuClose');
    if (x) x.addEventListener('click', close);
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  document.querySelectorAll('.site-header .nav-dropdown').forEach(function (dd) {
    var trigger = dd.querySelector('.nav-dropdown-trigger');
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = dd.classList.toggle('open');
      trigger.setAttribute('aria-expanded', open);
    });
  });
  document.addEventListener('click', function (e) {
    document.querySelectorAll('.site-header .nav-dropdown.open').forEach(function (dd) {
      if (!dd.contains(e.target)) {
        dd.classList.remove('open');
        dd.querySelector('.nav-dropdown-trigger').setAttribute('aria-expanded', 'false');
      }
    });
  });
  window.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.site-header .nav-dropdown.open').forEach(function (dd) {
      dd.classList.remove('open');
      dd.querySelector('.nav-dropdown-trigger').setAttribute('aria-expanded', 'false');
    });
  });

  document.querySelectorAll('.mobile-dropdown').forEach(function (dd) {
    var trigger = dd.querySelector('.mobile-dropdown-trigger');
    trigger.addEventListener('click', function () {
      var open = dd.classList.toggle('open');
      trigger.setAttribute('aria-expanded', open);
    });
  });
})();
