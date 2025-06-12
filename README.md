# 🛒 Ferremas - Plataforma de Ferretería Online

**Ferremas** es una aplicación web fullstack desarrollada para ofrecer una experiencia moderna de compra en línea de productos de ferretería. Los clientes pueden explorar un catálogo, agregar productos al carrito, realizar pagos a través de **Transbank Webpay** y aprovechar promociones exclusivas.

---

## 🚀 Características principales

- 🧾 **Registro/Login con JWT**
- 🛍️ **Catálogo de productos destacados**
- 🛒 **Carrito de compras funcional**
- 💳 **Integración real con Transbank (Webpay - integración)**
- 🎁 **Promoción por registro: 15% de descuento**
- 🔐 Rutas protegidas con autenticación
- 📦 Backend en Python/Flask, Frontend en HTML/CSS/JS

---

## 🧑‍💻 Tecnologías utilizadas

| Frontend          | Backend           | Otros                |
|-------------------|-------------------|----------------------|
| HTML5 + CSS3 + JS | Python 3 + Flask  | JWT para login       |
| LocalStorage      | SQLAlchemy (ORM)  | Transbank SDK (TEST) |
| Fetch API         | Blueprints Flask  | Webpay Plus          |

---

## 🛠️ Instalación y ejecución local

### 🔁 Clona el repositorio

```bash
git clone https://github.com/tuusuario/ferremas.git
cd ferremas
⚙️ Backend
bash
Copiar
Editar
cd backend
python -m venv venv
venv\Scripts\activate  # en Windows
pip install -r requirements.txt
python app.py
🌐 Frontend
En otra terminal:

bash
Copiar
Editar
cd frontend
python -m http.server 5500
Abre en navegador:

bash
Copiar
Editar
http://localhost:5500/home.html
🔐 Datos de prueba
✉️ Usuario de ejemplo
Correo: cliente1@ferremas.cl

Contraseña: 123456

💳 Tarjeta Transbank (integración)
Número: 4051885600446623

Vencimiento: cualquier fecha futura (12/29)

CVV: 123

RUT: 11.111.111-1



🎉 Funcionalidades futuras
🧑 Panel de usuario y seguimiento de pedidos

📄 Historial de compras

🛠️ Sección de soporte y mantenciones

🖼️ Carga de imágenes para productos

📧 Notificaciones por correo

👨‍💻 Autores
Vicente Villarroel
Renato  Astargo
Proyecto académico — Duoc UC

2025

📝 Licencia
Este proyecto es solo con fines académicos. No está autorizado para producción real sin autorización de Transbank y un código de comercio válido.
