// Mapa da seção Localização: começa a carregar logo depois que a página abre (em vez de só ao chegar perto)
// e mostra um fundo de "Carregando mapa" enquanto o Google Maps chega.
(function () {
  var frames = document.querySelectorAll('.map-frame');
  if (!frames.length) return;

  var css = document.createElement('style');
  css.textContent =
    '.map-frame{position:relative; background:#e8ebe9;}' +
    '.map-frame::before{content:"Carregando mapa…"; position:absolute; inset:0; display:flex; align-items:center; justify-content:center; ' +
    'font:500 .9rem Inter,sans-serif; color:#5B7180; background:' +
    'repeating-linear-gradient(0deg,rgba(91,113,128,.06) 0 1px,transparent 1px 38px),' +
    'repeating-linear-gradient(90deg,rgba(91,113,128,.06) 0 1px,transparent 1px 38px),#e8ebe9;}' +
    '.map-frame iframe{position:relative; z-index:1; background:transparent;}';
  document.head.appendChild(css);

  function carregar() {
    document.querySelectorAll('.map-frame iframe[loading="lazy"]').forEach(function (f) {
      f.loading = 'eager';
    });
  }

  var iniciar = function () {
    if ('requestIdleCallback' in window) requestIdleCallback(carregar, { timeout: 2500 });
    else setTimeout(carregar, 1200);
  };
  if (document.readyState === 'complete') iniciar();
  else window.addEventListener('load', iniciar);
})();
