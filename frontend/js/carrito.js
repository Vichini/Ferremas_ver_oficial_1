document.addEventListener('DOMContentLoaded', () => {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const contenedor = document.getElementById('carrito-items');
  const total = document.getElementById('total');

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p>No hay productos en el carrito.</p>";
    total.textContent = "";
    return;
  }

  let suma = 0;
  carrito.forEach(p => {
    const item = document.createElement('div');
    item.innerHTML = `
      <p>${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad}</p>
    `;
    suma += p.precio * p.cantidad;
    contenedor.appendChild(item);
  });

  total.innerHTML = `<strong>Total: $${suma}</strong>`;
});

function vaciarCarrito() {
  localStorage.removeItem('carrito');
  location.reload();
}

async function finalizarPedido() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const token = localStorage.getItem('token');

  if (!token) {
    alert("Debes iniciar sesión para pagar.");
    return window.location.href = "login.html";
  }

  try {
    const res = await fetch('http://localhost:5000/api/pedidos/webpay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(carrito)
    });

    const data = await res.json();

    if (res.ok && data.url && data.token) {
      localStorage.removeItem('carrito');

      // Crear formulario y redirigir automáticamente a Webpay
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.url;

      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'token_ws';
      input.value = data.token;

      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
    } else {
      alert("Error al generar el enlace de pago.");
    }
  } catch (err) {
    console.error("Error al conectar con Webpay:", err);
    alert("Falló la conexión con Webpay.");
  }
}
