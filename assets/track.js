// Analytics for morrowandmade.com: GA4 + Microsoft Clarity, and click events for the funnel.
// Fill the two IDs below; an empty ID turns that tool off.
(function () {
  var GA_ID = 'G-GS3VZC722P';       // GA4 measurement ID, like G-ABC123XYZ
  var CLARITY_ID = 'z2y26cuzy2';  // Clarity project ID, like abcd1234ef

  // EEA, UK and Switzerland: no analytics cookies (consent mode default denied).
  var EEA = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IS','IE','IT','LV','LI','LT','LU','MT','NL','NO','PL','PT','RO','SK','SI','ES','SE','GB','CH'];

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  if (GA_ID) {
    gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', region: EEA });
    gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    gtag('js', new Date());
    gtag('config', GA_ID);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  if (CLARITY_ID) {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY_ID);
  }

  // Where on the page a link sits: header, a section id, or "page".
  function where(a) {
    if (a.closest('header')) return 'header';
    var sec = a.closest('section[id], .g-cta, .related, .g-article');
    if (!sec) return 'page';
    return sec.id || sec.className.split(' ')[0];
  }

  // buy_click: any link to Payhip. guide_click: any link to the free guide page.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    var name = /payhip\.com/.test(href) ? 'buy_click' : /free-guide\.html/.test(href) ? 'guide_click' : null;
    if (!name) return;
    var params = { link_url: a.href, link_text: (a.textContent || '').trim().slice(0, 60), placement: where(a), transport_type: 'beacon' };
    if (GA_ID) gtag('event', name, params);
    if (CLARITY_ID && window.clarity) clarity('event', name);
  });
})();
