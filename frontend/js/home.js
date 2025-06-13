document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('productos-container');
  const token = localStorage.getItem('token');

  
  if (token) {
    try {
      const res = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

      const data = await res.json();

      if (res.ok) {
        const nav = document.getElementById('nav-menu');
        const nombre = data.nombre.split(' ')[0];

        nav.innerHTML = `
          <a href="home.html">Inicio</a>
          <a href="carrito.html">🛒 Carrito</a>
          <span>Hola, ${nombre} 👋</span>
          <button onclick="logout()">Cerrar sesión</button>
        `;
      }
    } catch (err) {
      console.error('Error al obtener usuario', err);
    }
  }

  try {
    const res = await fetch('http://localhost:5000/api/productos/');
    const productos = await res.json();

    productos.slice(0, 4).forEach(p => {
      const card = document.createElement('div');
      card.className = 'producto-card';
      card.innerHTML = `
        <h4>${p.nombre}</h4>
        <p>${p.descripcion}</p>
        <p><strong>$${p.precio}</strong></p>
        <button onclick="agregarAlCarrito(${p.id}, '${p.nombre}', ${p.precio})">Agregar al carrito</button>
      `;
      container.appendChild(card);
    });

  } catch (err) {
    console.error('Error al cargar productos', err);
  }
});

function logout() {
  localStorage.removeItem('token');
  alert('Sesión cerrada');
  window.location.reload();
}

function agregarAlCarrito(id, nombre, precio) {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  const productoExistente = carrito.find(p => p.id === id);
  if (productoExistente) {
    productoExistente.cantidad += 1;
  } else {
    carrito.push({ id, nombre, precio, cantidad: 1 });
  }

  localStorage.setItem('carrito', JSON.stringify(carrito));
  alert(`"${nombre}" fue agregado al carrito.`);
}
