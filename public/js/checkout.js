// Load cart from localStorage
const cart = JSON.parse(localStorage.getItem('cart')) || [];
const checkoutItems = document.getElementById('checkout-items');
const subtotalEl = document.getElementById('checkout-subtotal');
const taxEl = document.getElementById('checkout-tax');
const totalEl = document.getElementById('checkout-total');
const orderForm = document.getElementById('order-form');
const upiSection = document.getElementById('upi-qr');
const codOption = document.getElementById('cod');
const upiOption = document.getElementById('upi');

// Display cart items on checkout page
function displayCheckoutItems() {
    checkoutItems.innerHTML = '';

    if (cart.length === 0) {
        window.location.href = '/';
        return;
    }

    cart.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.classList.add('checkout-item');
        itemEl.innerHTML = `
            <div>${item.quantity} × ${item.name}</div>
            <div>₹${(item.price * item.quantity).toFixed(2)}</div>
        `;
        checkoutItems.appendChild(itemEl);
    });

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + tax;

    subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
    taxEl.textContent = `₹${tax.toFixed(2)}`;
    totalEl.textContent = `₹${total.toFixed(2)}`;
}

// Toggle UPI QR code
function toggleUpiSection() {
    if (upiOption.checked) {
        upiSection.classList.remove('hidden');
    } else {
        upiSection.classList.add('hidden');
    }
}

// Handle payment method change
codOption.addEventListener('change', toggleUpiSection);
upiOption.addEventListener('change', toggleUpiSection);

// Handle form submission
// checkout.js
document.getElementById('orderForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const address = document.getElementById('address').value;
  const payment = document.querySelector('input[name="payment"]:checked')?.value || "Not Selected";
  const items = JSON.parse(localStorage.getItem('cart') || '[]')
    .map(item => `${item.name} x${item.quantity}`)
    .join(', ');

  fetch('/submit-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, address, payment, items })
  })
  .then(() => {
    alert('Order placed successfully!');
    localStorage.removeItem('cart');
    window.location.href = '/views/index.html';
  });
});
    

// Initialize checkout page
displayCheckoutItems();
toggleUpiSection();
