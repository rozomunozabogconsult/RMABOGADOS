# Consultorio Jurídico Digital - Asesoría Legal Colombia

Esta es una demostración interactiva de una plataforma web (SPA) premium de **Consultorio Jurídico Digital** orientada al derecho colombiano (Constitución de 1991, Código Sustantivo del Trabajo, Código Civil, etc.). 

Su principal funcionalidad es permitir que asesores o abogados independientes generen un **enlace personalizado** para compartir con personas que requieren asesoría, adaptando la página web automáticamente y dirigiendo los casos directo a su número de WhatsApp.

## Características Principales

1. **Diseño Premium y Responsivo**: Paleta de colores prestigiosa (azul marino profundo y oro ocre), animaciones fluidas, soporte de tema claro/oscuro y diseño optimizado para dispositivos móviles.
2. **Triaje Legal Interactivo (LegisBot)**: Chatbot integrado de preguntas y respuestas que guía preliminarmente a los ciudadanos sobre su situación jurídica (Laboral, Familia, Civil, Tutelas/Derechos de Petición) citando leyes colombianas.
3. **Generador de Enlaces Personalizados**: Panel visual integrado en la misma web que permite a los asesores/abogados ingresar su Nombre, WhatsApp y Email para obtener un link único de la forma `?asesor=Nombre&whatsapp=Telefono&email=correo`.
4. **Redirección Directa a WhatsApp**: Formulario de registro de casos estructurado que se conecta con la API de WhatsApp, enviando un resumen formateado del caso directamente al asesor configurado en la URL.
5. **Guía de Legislación Básica**: Fichas informativas claras sobre la Acción de Tutela (Art. 86), Derecho de Petición (Art. 23) y derechos civiles/laborales en Colombia.

## Estructura de Archivos

- `index.html`: Estructura semántica, paneles modulares y guías legislativas.
- `style.css`: Estilos basados en variables CSS, transiciones suaves y efectos de cristalería (glassmorphism).
- `app.js`: Lógica para procesar parámetros de URL, control de navegación de pestañas, el chatbot LegisBot y enrutador de WhatsApp.

## Instrucciones de Uso

### 1. Iniciar la Demostración
Puedes abrir el archivo `index.html` directamente en cualquier navegador de forma local. No requiere de servidores web complejos ni dependencias externas.

### 2. Personalizar la Página como Asesor (Generación de Links)
1. Ve a la pestaña **Panel Asesor** en el menú.
2. Introduce tu nombre, número de WhatsApp (ej. `573001234567` para Colombia) y correo electrónico.
3. Haz clic en **Generar y Copiar Enlace Compartible**.
4. ¡El link se copiará a tu portapapeles! 
5. Abre una pestaña nueva con el enlace copiado. Notarás que ahora la cabecera superior y el formulario muestran tu nombre como el asesor de turno.
6. Al diligenciar el formulario o terminar el chatbot de triaje, la solicitud se preparará para ser enviada directo a tu WhatsApp.
