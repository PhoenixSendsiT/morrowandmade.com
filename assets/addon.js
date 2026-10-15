/* Optional add-on: ticking the box sends the buy button to the Payhip bundle and shows the bundle price. */
(function () {
  var boxes = document.querySelectorAll('[data-addon]');
  for (var i = 0; i < boxes.length; i++) wire(boxes[i]);
  function wire(box) {
    var scope = box.closest('.buy, .get-panel');
    if (!scope) return;
    var checkout = scope.querySelector('[data-checkout]');
    var prices = scope.querySelectorAll('[data-price-value]');
    if (!checkout) return;
    var base = checkout.getAttribute('href'), basePrice = prices.length ? prices[0].textContent : '';
    function update() {
      checkout.setAttribute('href', box.checked ? box.getAttribute('data-href') : base);
      for (var j = 0; j < prices.length; j++) prices[j].textContent = box.checked ? box.getAttribute('data-price') : basePrice;
    }
    box.addEventListener('change', update);
    window.addEventListener('pageshow', update); // the browser can restore a ticked box after Back, with no change event
    update();
    var label = box.closest('.get-addon'); if (label) label.hidden = false; // shown only once the script can switch the link and price
  }
})();
