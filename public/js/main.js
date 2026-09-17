// public/js/main.js
// Shared helpers used by every page: a small fetch wrapper and the nav bar renderer.

const api = {
  async request(method, url, body) {
    const res = await fetch(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'same-origin',
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Something went wrong.');
    return data;
  },
  get(url) { return this.request('GET', url); },
  post(url, body) { return this.request('POST', url, body); },
  put(url, body) { return this.request('PUT', url, body); },
  del(url) { return this.request('DELETE', url); },
};

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function formatMoney(n) {
  return `$${Number(n).toFixed(2)}`;
}

// Renders the nav bar's right-hand side (login state + cart count) on every page.
async function renderNav() {
  const navRight = document.getElementById('nav-right');
  if (!navRight) return;

  const [{ user }, cart] = await Promise.all([
    api.get('/api/auth/me'),
    api.get('/api/cart').catch(() => ({ items: [] })),
  ]);

  const cartCount = cart.items.reduce((sum, i) => sum + i.qty, 0);

  navRight.innerHTML = `
    <a href="/index.html">Products</a>
    <a href="/cart.html">Cart${cartCount ? `<span class="cart-badge">${cartCount}</span>` : ''}</a>
    ${
      user
        ? `<a href="/orders.html">Orders</a>
           <span>Hi, ${escapeHtml(user.name)}</span>
           <button id="logout-btn">Log out</button>`
        : `<a href="/login.html">Log in</a>
           <a href="/register.html">Sign up</a>`
    }
  `;

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await api.post('/api/auth/logout');
      window.location.href = '/index.html';
    });
  }
}

document.addEventListener('DOMContentLoaded', renderNav);
