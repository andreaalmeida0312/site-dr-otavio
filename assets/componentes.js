/* Componentes compartilhados: guia ilustrado, lightbox e carrossel de avaliações */
(function () {
  function ev(nome, dados) { try { if (typeof gtag === 'function') gtag('event', nome, dados || {}); } catch (e) {} }

  /* ---------- Lightbox ---------- */
  var lb, lbImg, lbScroll, lbCap, lbZoomBtn, lastFocus;
  function montarLightbox() {
    if (lb) return;
    lb = document.createElement('div');
    lb.className = 'guia-lb';
    lb.hidden = true;
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Imagem ampliada');
    lb.innerHTML = '<div class="guia-lb-bar"><span>Toque na imagem para ampliar ou reduzir</span><div class="guia-lb-btns"><button type="button" data-lb-zoom>Ampliar</button><button type="button" data-lb-close>Fechar</button></div></div>' +
      '<div class="guia-lb-scroll"><img alt=""></div><p class="guia-lb-cap"></p>';
    document.body.appendChild(lb);
    lbScroll = lb.querySelector('.guia-lb-scroll');
    lbImg = lb.querySelector('img');
    lbCap = lb.querySelector('.guia-lb-cap');
    lbZoomBtn = lb.querySelector('[data-lb-zoom]');
    lb.querySelector('[data-lb-close]').addEventListener('click', fecharLb);
    lbZoomBtn.addEventListener('click', alternarZoom);
    lbImg.addEventListener('click', alternarZoom);
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target === lbScroll) fecharLb(); });
    document.addEventListener('keydown', function (e) { if (!lb.hidden && e.key === 'Escape') fecharLb(); });
  }
  function alternarZoom() {
    var z = lbScroll.classList.toggle('zoom');
    lbZoomBtn.textContent = z ? 'Ajustar à tela' : 'Ampliar';
    if (z) { lbScroll.scrollLeft = (lbScroll.scrollWidth - lbScroll.clientWidth) / 2; lbScroll.scrollTop = 0; }
  }
  function abrirLb(btn) {
    montarLightbox();
    lastFocus = btn;
    var img = btn.querySelector('img');
    lbImg.src = btn.getAttribute('data-full') || (img && (img.currentSrc || img.src)) || '';
    lbImg.alt = (img && img.alt) || btn.getAttribute('data-alt') || '';
    var cap = (btn.closest('figure') || btn.parentNode).querySelector('figcaption');
    lbCap.textContent = cap ? cap.textContent : '';
    lbScroll.classList.remove('zoom');
    lbZoomBtn.textContent = 'Ampliar';
    lb.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    if (window.innerWidth < 700) alternarZoom();
    lb.querySelector('[data-lb-close]').focus();
    ev('guia_imagem_ampliada', { pagina: location.pathname, imagem: (lbImg.getAttribute('src') || '').split('/').pop() });
  }
  function fecharLb() {
    lb.hidden = true;
    document.documentElement.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.guia-zoom, .guia-ampliar');
    if (b) { e.preventDefault(); abrirLb(b); }
    var mb = e.target.closest && e.target.closest('.guia-mapa-box');
    if (!b && mb && !e.target.closest('.mapa-pin')) { e.preventDefault(); abrirLb(mb); }
  });

  /* ---------- Seções (acordeão) ---------- */
  function abrirPorHash() {
    if (!location.hash) return;
    var el;
    try { el = document.querySelector(location.hash); } catch (e) { return; }
    if (el && el.tagName === 'DETAILS') { el.open = true; el.scrollIntoView({ block: 'start' }); }
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('.guia-chips a');
    if (a) {
      var d = document.querySelector(a.getAttribute('href'));
      if (d && d.tagName === 'DETAILS') { e.preventDefault(); d.open = true; d.scrollIntoView({ behavior: 'smooth', block: 'start' }); history.replaceState(null, '', a.getAttribute('href')); }
    }
    var t = e.target.closest && e.target.closest('[data-guia-toggle]');
    if (t) {
      var ds = document.querySelectorAll('.guia-acc details');
      var abrir = t.getAttribute('data-aberto') !== '1';
      ds.forEach(function (x) { x.open = abrir; });
      t.setAttribute('data-aberto', abrir ? '1' : '0');
      t.textContent = abrir ? 'Recolher todas' : 'Abrir todas';
    }
    var s = e.target.closest && e.target.closest('[data-guia-share]');
    if (s) ev('guia_compartilhar', { pagina: location.pathname });
  });
  document.addEventListener('toggle', function (e) {
    var d = e.target;
    if (d && d.tagName === 'DETAILS' && d.open && d.closest('.guia-acc')) {
      var s = d.querySelector('summary');
      ev('guia_secao_aberta', { pagina: location.pathname, secao: s ? s.textContent.trim().slice(0, 60) : '' });
    }
  }, true);
  window.addEventListener('hashchange', abrirPorHash);
  document.addEventListener('DOMContentLoaded', function () { setTimeout(abrirPorHash, 60); });

  /* ---------- Carrossel de avaliações ---------- */
  function iniciarCarrosseis() {
    document.querySelectorAll('.depo-car').forEach(function (car) {
      if (car.getAttribute('data-ok')) return;
      car.setAttribute('data-ok', '1');
      var track = car.querySelector('.depo-track');
      var prev = car.querySelector('.prev');
      var next = car.querySelector('.next');
      function passo() { var c = track.querySelector('.depo-c'); return c ? c.getBoundingClientRect().width + 18 : 320; }
      function estado() {
        if (!prev || !next) return;
        prev.disabled = track.scrollLeft < 4;
        next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      }
      if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -passo(), behavior: 'smooth' }); });
      if (next) next.addEventListener('click', function () { track.scrollBy({ left: passo(), behavior: 'smooth' }); });
      track.addEventListener('scroll', estado, { passive: true });
      track.querySelectorAll('.depo-c').forEach(function (c) {
        var q = c.querySelector('.depo-quote');
        var b = c.querySelector('.depo-lm');
        if (!q || !b) return;
        function medir() { b.hidden = c.classList.contains('is-open') ? false : !(q.scrollHeight > q.clientHeight + 2); }
        b.addEventListener('click', function () {
          var aberto = c.classList.toggle('is-open');
          b.textContent = aberto ? 'Mostrar menos' : 'Leia mais';
          b.hidden = false;
        });
        medir();
        window.addEventListener('resize', medir);
      });
      estado();
    });
  }
  document.addEventListener('DOMContentLoaded', iniciarCarrosseis);
  window.addEventListener('load', function () { iniciarCarrosseis(); window.dispatchEvent(new Event('resize')); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { window.dispatchEvent(new Event('resize')); });
})();
