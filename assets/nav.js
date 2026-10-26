// Mobile menu: on narrow screens the header links fold into a "Menu" button.
// Without JavaScript the links show as a scrollable row instead (see site.css).
(function () {
  var header = document.querySelector('header.site');
  var nav = header && header.querySelector('nav.links');
  var btn = header && header.querySelector('.menu-btn');
  if (!nav || !btn) return;
  var label = btn.querySelector('.menu-label');

  function set(open) {
    header.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (label) label.textContent = open ? 'Close' : 'Menu';
  }

  btn.hidden = false;
  header.classList.add('has-menu');
  btn.addEventListener('click', function () { set(!header.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && header.classList.contains('open')) { set(false); btn.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (header.classList.contains('open') && !header.contains(e.target)) set(false);
  });
  window.addEventListener('resize', function () { if (window.innerWidth > 980) set(false); });
})();
