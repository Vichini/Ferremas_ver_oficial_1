document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const form = document.getElementById('loginForm');
  const box = document.getElementById('login-box');
  const yaLogueado = document.getElementById('ya-logueado');

  // Show already logged in message if token exists
  if (token) {
    box.style.display = 'none';
    yaLogueado.style.display = 'block';
    return;
  }

  // Form validation functions
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(`${fieldId}-error`);
    
    field.classList.add('error');
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
  }

  function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(`${fieldId}-error`);
    
    field.classList.remove('error');
    errorDiv.classList.remove('show');
    errorDiv.textContent = '';
  }

  function showAlert(message, type = 'error') {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
      existingAlert.remove();
    }

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type} show`;
    alertDiv.textContent = message;
    
    // Insert before the form
    form.parentNode.insertBefore(alertDiv, form);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      alertDiv.classList.remove('show');
      setTimeout(() => alertDiv.remove(), 300);
    }, 5000);
  }

  function setLoadingState(isLoading) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');
    
    submitBtn.disabled = isLoading;
    
    if (isLoading) {
      btnText.style.opacity = '0';
      btnSpinner.style.display = 'block';
    } else {
      btnText.style.opacity = '1';
      btnSpinner.style.display = 'none';
    }
  }

  // Real-time validation
  document.getElementById('correo').addEventListener('input', function() {
    clearFieldError('correo');
    if (this.value && !validateEmail(this.value)) {
      showFieldError('correo', 'Por favor ingresa un correo electrónico válido');
    }
  });

  document.getElementById('password').addEventListener('input', function() {
    clearFieldError('password');
    if (this.value && this.value.length < 6) {
      showFieldError('password', 'La contraseña debe tener al menos 6 caracteres');
    }
  });

  // Form submission
  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const correo = document.getElementById('correo').value.trim();
    const password = document.getElementById('password').value;

    // Clear previous errors
    clearFieldError('correo');
    clearFieldError('password');

    // Validate form
    let hasErrors = false;

    if (!correo) {
      showFieldError('correo', 'El correo electrónico es requerido');
      hasErrors = true;
    } else if (!validateEmail(correo)) {
      showFieldError('correo', 'Por favor ingresa un correo electrónico válido');
      hasErrors = true;
    }

    if (!password) {
      showFieldError('password', 'La contraseña es requerida');
      hasErrors = true;
    } else if (password.length < 6) {
      showFieldError('password', 'La contraseña debe tener al menos 6 caracteres');
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    // Set loading state
    setLoadingState(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        showAlert('¡Login exitoso! Redirigiendo...', 'success');
        
        // Redirect after showing success message
        setTimeout(() => {
          window.location.href = 'home.html';
        }, 1500);
      } else {
        // Handle specific error messages
        if (res.status === 401) {
          showAlert('Correo o contraseña incorrectos. Por favor verifica tus datos.', 'error');
        } else if (res.status === 404) {
          showAlert('Usuario no encontrado. ¿Necesitas registrarte?', 'error');
        } else {
          showAlert(data.error || 'Error al iniciar sesión. Intenta nuevamente.', 'error');
        }
      }
    } catch (err) {
      console.error('Error de conexión:', err);
      showAlert('Error de conexión. Verifica tu internet e intenta nuevamente.', 'error');
    } finally {
      setLoadingState(false);
    }
  });
});
