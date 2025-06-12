document.addEventListener('DOMContentLoaded', async () => {
  const res = await fetch('http://localhost:5000/api/productos/');
  const productos = await res.json();

  const contenedor = document.getElementById('catalogo');
  productos.forEach(p => {
    const div = document.createElement('div');
    div.innerHTML = `
      <h3>${p.nombre}</h3>
      <p>${p.descripcion}</p>
      <strong>Precio: $${p.precio}</strong>
      <p>Stock: ${p.stock}</p>
      <hr>
    `;
    contenedor.appendChild(div);
  });
});
