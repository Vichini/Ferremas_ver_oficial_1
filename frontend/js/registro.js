document.getElementById('registroForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const correo = document.getElementById('correo').value;
  const password = document.getElementById('password').value;

  // 1. Enviar registro
  const res = await fetch('http://localhost:5000/api/auth/registro', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, correo, password })
  });

  const data = await res.json();

  if (res.ok) {
    // 2. Si registro exitoso, iniciar sesión automáticamente
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, password })
    });

    const loginData = await loginRes.json();

    if (loginRes.ok) {
      localStorage.setItem('token', loginData.token);
      alert('¡Bienvenido a Ferremas!');
      window.location.href = 'home.html';
    } else {
      alert('Cuenta creada pero error al iniciar sesión.');
      window.location.href = 'login.html';
    }

  } else {
    alert(data.error || 'Error al registrar');
  }
});
