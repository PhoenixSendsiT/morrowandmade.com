/* Buy flow: email first, then the price and the checkout button.
   Every [data-get] link opens the dialog on the home page; without JS it goes to get.html. */
(function () {
  // Only a yes/no flag is kept in the browser, never the email address itself.
  // shownHere covers browsers where storage is blocked.
  var KEY = 'mm_price_shown', shownHere = false;
  function remembered() { if (shownHere) return true; try { return localStorage.getItem(KEY) === '1' } catch (e) { return false } }
  function remember() { shownHere = true; try { localStorage.setItem(KEY, '1') } catch (e) {} }

  function showStep(panel, step, moveFocus) {
    var steps = panel.querySelectorAll('.get-step');
    for (var i = 0; i < steps.length; i++) steps[i].hidden = steps[i].getAttribute('data-step') !== String(step);
    if (moveFocus) {
      var target = step === 1 ? panel.querySelector('.get-input') : panel.querySelector('#get-title-2');
      if (target) target.focus();
    }
  }

  function wire(panel) {
    var form = panel.querySelector('.get-form');
    if (!form) return;
    var btn = form.querySelector('button[type=submit]');
    var input = form.querySelector('.get-input');
    var label = btn.textContent;
    // Until the email list is connected nothing is sent, so don't mark the visitor as asked.
    var action = form.getAttribute('action');
    var live = action && action.charAt(0) !== '#';
    var skipBtn = form.querySelector('.get-skip');
    if (skipBtn) skipBtn.addEventListener('click', function () {
      if (live) remember();
      showStep(panel, 2, true);
    });
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var hp = form.querySelector('.hp input');
      var skip = hp && hp.value;
      if (!skip && !form.checkValidity()) { form.reportValidity(); return }
      var finished = false;
      function done() {
        if (finished) return;
        finished = true;
        if (live) remember();
        btn.disabled = false; btn.textContent = label;
        showStep(panel, 2, true);
      }
      // A bot, or no list connected yet: show the price without sending the email anywhere.
      if (skip || !live || !window.fetch) { done(); return }
      btn.disabled = true; btn.textContent = 'One moment…';
      var body = new FormData();
      body.append(input.name, input.value.trim());
      // A slow or failed sign-up never blocks checkout.
      setTimeout(done, 5000);
      fetch(action, { method: 'POST', body: body, mode: form.getAttribute('data-mode') || 'no-cors' }).then(done, done);
    });
  }

  var dialog = document.getElementById('get');
  var pagePanel = document.querySelector('.get-page .get-panel');

  if (pagePanel) {
    wire(pagePanel);
    if (remembered()) showStep(pagePanel, 2, false);
    return;
  }
  if (!dialog || typeof dialog.showModal !== 'function') return;
  var panel = dialog.querySelector('.get-panel');
  wire(panel);

  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('[data-get]');
    if (!a) return;
    ev.preventDefault();
    var step = remembered() ? 2 : 1;
    showStep(panel, step, false);
    dialog.showModal();
    showStep(panel, step, true);
  });
  // Close on a backdrop click, but not when a text selection that started inside ends outside.
  var downOnBackdrop = false;
  dialog.addEventListener('pointerdown', function (ev) { downOnBackdrop = ev.target === dialog });
  dialog.addEventListener('click', function (ev) {
    if ((ev.target === dialog && downOnBackdrop) || (ev.target.closest && ev.target.closest('.get-close'))) dialog.close();
  });
})();
