// Mapa da seção Localização: o Google Maps é pesado, então só carrega quando a pessoa pede ("Ver mapa aqui").
// Enquanto isso, mostra o endereço e o botão "Como chegar" (abre o Google Maps no aparelho).
(function () {
  var boxes = document.querySelectorAll('.map-frame');
  if (!boxes.length) return;

  var css = document.createElement('style');
  css.textContent =
    '.map-frame{position:relative; background:#e8ebe9;}' +
    '.map-fachada{position:absolute; inset:0; z-index:2; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; padding:24px; text-align:center; ' +
    'font-family:Inter,sans-serif; color:#243B4A; background:' +
    'repeating-linear-gradient(0deg,rgba(91,113,128,.07) 0 1px,transparent 1px 38px),' +
    'repeating-linear-gradient(90deg,rgba(91,113,128,.07) 0 1px,transparent 1px 38px),#e8ebe9;}' +
    '.map-fachada svg{width:34px; height:34px; color:#A66D45; margin-bottom:4px;}' +
    '.map-fachada strong{font-family:Sora,sans-serif; font-size:1.05rem; font-weight:600;}' +
    '.map-fachada span{font-size:.92rem; color:#5B7180;}' +
    '.map-acoes{display:flex; flex-wrap:wrap; gap:10px; justify-content:center; margin-top:14px;}' +
    '.map-acoes button,.map-acoes a{font-family:Sora,sans-serif; font-weight:600; font-size:.88rem; padding:11px 20px; min-height:44px; border-radius:2px; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center;}' +
    '.map-acoes button{background:#94603A; color:#fff; border:1px solid #94603A;}' +
    '.map-acoes a{background:transparent; color:#243B4A; border:1px solid #243B4A;}' +
    '.map-frame iframe{position:relative; z-index:1;}';
  document.head.appendChild(css);

  var destino = 'Rua+Jaceguai%2C+208%2C+Prado%2C+Belo+Horizonte%2FMG%2C+30411-073';
  var pin = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.6"/></svg>';

  boxes.forEach(function (box) {
    var f = box.querySelector('iframe[data-src]');
    if (!f) return;
    var fachada = document.createElement('div');
    fachada.className = 'map-fachada';
    fachada.innerHTML = pin +
      '<strong>Rua Jaceguai, 208, Sala 708</strong>' +
      '<span>Edifício Cayler · Prado, Belo Horizonte/MG</span>' +
      '<div class="map-acoes"><button type="button" class="map-ver">Ver mapa aqui</button>' +
      '<a href="https://www.google.com/maps/dir/?api=1&destination=' + destino + '" target="_blank" rel="noopener">Como chegar</a></div>';
    box.appendChild(fachada);
    fachada.querySelector('.map-ver').addEventListener('click', function () {
      fachada.innerHTML = '<span>Carregando mapa…</span>';
      f.addEventListener('load', function () { fachada.remove(); });
      f.src = f.getAttribute('data-src');
    });
  });
})();
