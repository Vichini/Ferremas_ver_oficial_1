document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('productos-container');
  const spinner = document.getElementById('loading-spinner');
  const token = localStorage.getItem('token');

  // Function to show alert messages
  function showAlert(message, type = 'error') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type} show`;
    alertDiv.textContent = message;
    
    // Insert at the top of the page
    document.body.insertBefore(alertDiv, document.body.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      alertDiv.classList.remove('show');
      setTimeout(() => alertDiv.remove(), 300);
    }, 5000);
  }

  // Check if user is logged in
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
          <a href="home.html" aria-current="page">Inicio</a>
          <a href="carrito.html">🛒 Carrito</a>
          <span style="color: var(--light-blue); font-weight: 600;">Hola, ${nombre} 👋</span>
          <button onclick="logout()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer; font-weight: 500;">Cerrar sesión</button>
        `;
      }
    } catch (err) {
      console.error('Error al obtener usuario', err);
      // Don't show error for this as it's not critical
    }
  }

  // Load products with better error handling
  try {
    const res = await fetch('http://localhost:5000/api/productos/');
    
    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }
    
    const productos = await res.json();

    // Hide spinner
    spinner.style.display = 'none';

    if (!productos || productos.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--gray-500);">
          <h4>No hay productos disponibles</h4>
          <p>Vuelve más tarde para ver nuestros productos.</p>
        </div>
      `;
      return;
    }

    // Display products (first 4)
    productos.slice(0, 4).forEach(p => {
      const card = document.createElement('div');
      card.className = 'producto-card';
      card.innerHTML = `
        <h4>${p.nombre}</h4>
        <p>${p.descripcion}</p>
        <p class="precio">$${p.precio.toLocaleString('es-CL')}</p>
        <button onclick="agregarAlCarrito(${p.id}, '${p.nombre}', ${p.precio})" 
                aria-label="Agregar ${p.nombre} al carrito">
          Agregar al carrito
        </button>
      `;
      container.appendChild(card);
    });

  } catch (err) {
    console.error('Error al cargar productos', err);
    
    // Hide spinner
    spinner.style.display = 'none';
    
    // Show error message
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--gray-500);">
        <h4>⚠️ Error al cargar productos</h4>
        <p>No se pudieron cargar los productos. Por favor, intenta más tarde.</p>
        <button onclick="location.reload()" 
                style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--primary-blue); color: white; border: none; border-radius: 0.5rem; cursor: pointer;">
          Reintentar
        </button>
      </div>
    `;
    
    showAlert('Error al cargar productos. Verifica tu conexión a internet.', 'error');
  }
});

function logout() {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    localStorage.removeItem('token');
    showAlert('Sesión cerrada exitosamente', 'success');
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }
}

function agregarAlCarrito(id, nombre, precio) {
  try {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const productoExistente = carrito.find(p => p.id === id);
    if (productoExistente) {
      productoExistente.cantidad += 1;
      showAlert(`Se agregó otra unidad de "${nombre}" al carrito`, 'success');
    } else {
      carrito.push({ id, nombre, precio, cantidad: 1 });
      showAlert(`"${nombre}" fue agregado al carrito`, 'success');
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Add visual feedback to button
    const buttons = document.querySelectorAll(`button[onclick*="${id}"]`);
    buttons.forEach(btn => {
      const originalText = btn.textContent;
      btn.textContent = '✓ Agregado';
      btn.style.background = 'var(--primary-green)';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
      }, 2000);
    });

  } catch (err) {
    console.error('Error al agregar al carrito', err);
    showAlert('Error al agregar producto al carrito', 'error');
  }
}
