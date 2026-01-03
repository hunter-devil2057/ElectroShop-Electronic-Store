let products = [
    {
        id: 1,
        name: "Smartphone Pro",
        price: 799,
        stock: 10,
        image: "https://static.vecteezy.com/system/resources/thumbnails/074/286/640/small/white-smartphone-mockup-angled-flat-surface-with-bright-minimal-reflection-sleek-modern-device-free-photo.jpeg"
    },
    {
        id: 2,
        name: "Flagship Phone X",
        price: 1099,
        stock: 5,
        image: "https://thumbs.dreamstime.com/b/hand-holding-modern-smartphone-blank-screen-white-background-perfect-app-previews-ui-mockups-mobile-product-388674821.jpg"
    },
    {
        id: 3,
        name: "Ultra Laptop",
        price: 1499,
        stock: 8,
        image: "https://media.istockphoto.com/id/1182241805/photo/modern-laptop-with-empty-screen-on-white-background-mockup-design-copy-space-text.jpg?s=612x612&w=0&k=20&c=cFUF-381vXOFw_fgec6kB_2psIsvJE-JO5KNnbe5PSY="
    },
    {
        id: 4,
        name: "Gaming Laptop",
        price: 1899,
        stock: 3,
        image: "https://media.istockphoto.com/id/1221721782/photo/side-view-of-open-laptop-computer-modern-thin-edge-slim-design-blank-white-screen-display-for.jpg?s=612x612&w=0&k=20&c=h0vxz2UJL15-gkOe8jSjgKOqGsiZAF3rdJXilUNnjuI="
    },
    {
        id: 5,
        name: "Desktop PC Setup",
        price: 1299,
        stock: 7,
        image: "https://thumbs.dreamstime.com/b/realistic-computer-case-monitor-keyboard-mouse-white-background-vector-eps-52343926.jpg"
    },
    {
        id: 6,
        name: "Office Desktop",
        price: 899,
        stock: 15,
        image: "https://thumbs.dreamstime.com/b/desktop-pc-computer-isolated-white-background-clipping-path-141480540.jpg"
    }
];

let cart = {};
let currentUser = null;
const adminEmail = "admin@example.com"; // Fake admin

// Load from localStorage
if (localStorage.getItem('products')) {
    products = JSON.parse(localStorage.getItem('products'));
}
if (localStorage.getItem('cart')) {
    cart = JSON.parse(localStorage.getItem('cart'));
}
if (localStorage.getItem('currentUser')) {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    updateUI();
}

function saveData() {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('cart', JSON.stringify(cart));
    if (currentUser) localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

function updateUI() {
    document.getElementById('user-welcome').textContent = currentUser ? `Welcome, ${currentUser.email}` : 'Welcome, Guest';
    document.getElementById('login-btn').style.display = currentUser ? 'none' : 'inline';
    document.getElementById('register-btn').style.display = currentUser ? 'none' : 'inline';
    document.getElementById('logout-btn').style.display = currentUser ? 'inline' : 'none';
    document.getElementById('admin-btn').style.display = (currentUser && currentUser.email === adminEmail) ? 'inline' : 'none';
    updateCartCount();
    renderProducts();
    if (document.getElementById('admin-section').style.display !== 'none') renderAdmin();
}

function renderProducts() {
    const container = document.getElementById('products-list');
    container.innerHTML = '';
    products.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product-card';
        div.innerHTML = `
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>$${p.price}</p>
            <p>Stock: ${p.stock}</p>
            <button ${p.stock === 0 ? 'disabled' : ''} onclick="addToCart(${p.id})">Add to Cart</button>
        `;
        container.appendChild(div);
    });
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (product.stock <= 0) return alert('Out of stock!');
    if (!cart[id]) cart[id] = { ...product, qty: 0 };
    if (cart[id].qty >= product.stock) return alert('Not enough stock!');
    cart[id].qty++;
    product.stock--; // Reduce stock
    saveData();
    updateCartCount();
    renderProducts();
}

function updateCartCount() {
    const count = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cart-count').textContent = count;
}

function renderCart() {
    const tbody = document.querySelector('#cart-table tbody');
    tbody.innerHTML = '';
    let total = 0;
    Object.values(cart).forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${item.image}" width="50"> ${item.name}</td>
            <td>$${item.price}</td>
            <td><input type="number" min="1" max="${item.stock + item.qty}" value="${item.qty}" onchange="updateQty(${item.id}, this.value)"></td>
            <td>$${item.price * item.qty}</td>
            <td><button onclick="removeFromCart(${item.id})">Remove</button></td>
        `;
        tbody.appendChild(tr);
        total += item.price * item.qty;
    });
    document.getElementById('cart-total').textContent = total;
}

function updateQty(id, qty) {
    qty = parseInt(qty);
    const product = products.find(p => p.id === id);
    const diff = qty - cart[id].qty;
    if (diff > product.stock) return alert('Not enough stock!');
    cart[id].qty = qty;
    product.stock -= diff;
    saveData();
    renderProducts();
    renderCart();
}

function removeFromCart(id) {
    const product = products.find(p => p.id === id);
    product.stock += cart[id].qty;
    delete cart[id];
    saveData();
    renderProducts();
    renderCart();
    updateCartCount();
}

// Login/Register (fake)
document.getElementById('login-btn').onclick = () => document.getElementById('login-section').style.display = 'flex';
document.getElementById('register-btn').onclick = () => document.getElementById('register-section').style.display = 'flex';
document.getElementById('do-login').onclick = () => {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[email] && users[email] === pass) {
        currentUser = { email };
        saveData();
        updateUI();
        document.getElementById('login-section').style.display = 'none';
    } else {
        document.getElementById('login-msg').textContent = 'Invalid credentials';
    }
};
document.getElementById('do-register').onclick = () => {
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-pass').value;
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[email]) {
        document.getElementById('reg-msg').textContent = 'Email already registered';
    } else {
        users[email] = pass;
        localStorage.setItem('users', JSON.stringify(users));
        alert('Registered! (No email sent - demo)');
        document.getElementById('register-section').style.display = 'none';
    }
};
document.getElementById('logout-btn').onclick = () => {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUI();
};

// Admin
document.getElementById('admin-btn').onclick = () => {
    document.getElementById('products-section').style.display = 'none';
    document.getElementById('admin-section').style.display = 'block';
    renderAdmin();
};

function renderAdmin() {
    const container = document.getElementById('admin-list');
    container.innerHTML = '';
    products.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product-card';
        div.innerHTML = `
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>$${p.price} | Stock: ${p.stock}</p>
            <button onclick="editProduct(${p.id})">Edit</button>
            <button onclick="deleteProduct(${p.id})">Delete</button>
        `;
        container.appendChild(div);
    });
}

document.getElementById('admin-form').onsubmit = (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const newProd = {
        id: id ? parseInt(id) : Date.now(),
        name: document.getElementById('admin-name').value,
        price: parseFloat(document.getElementById('admin-price').value),
        stock: parseInt(document.getElementById('admin-stock').value),
        image: document.getElementById('admin-image').value
    };
    if (id) {
        const idx = products.findIndex(p => p.id === parseInt(id));
        products[idx] = newProd;
    } else {
        products.push(newProd);
    }
    saveData();
    renderAdmin();
    renderProducts();
    e.target.reset();
    document.getElementById('edit-id').value = '';
    document.getElementById('admin-save').textContent = 'Add Product';
};

function editProduct(id) {
    const p = products.find(pr => pr.id === id);
    document.getElementById('edit-id').value = p.id;
    document.getElementById('admin-name').value = p.name;
    document.getElementById('admin-price').value = p.price;
    document.getElementById('admin-stock').value = p.stock;
    document.getElementById('admin-image').value = p.image;
    document.getElementById('admin-save').textContent = 'Update Product';
}

function deleteProduct(id) {
    if (confirm('Delete product?')) {
        products = products.filter(p => p.id !== id);
        saveData();
        renderAdmin();
        renderProducts();
    }
}

// Cart modal
document.getElementById('cart-btn').onclick = () => {
    renderCart();
    document.getElementById('cart-section').style.display = 'flex';
};
document.getElementById('checkout-btn').onclick = () => alert('Checkout complete! (Demo only - no payment)');

// Close modals
document.querySelectorAll('.close-modal').forEach(btn => {
    btn.onclick = () => btn.closest('.modal').style.display = 'none';
});

// Initial render
updateUI();