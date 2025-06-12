document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const form = document.getElementById('loginForm');
  const box = document.getElementById('login-box');
  const yaLogueado = document.getElementById('ya-logueado');

  if (token) {
    box.style.display = 'none';
    yaLogueado.style.display = 'block';
    return;
  }

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const correo = document.getElementById('correo').value;
    const password = document.getElementById('password').value;

    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      alert('¡Login exitoso!');
      window.location.href = 'home.html';
    } else {
      alert(data.error || 'Error al iniciar sesión');
    }
  });
});
