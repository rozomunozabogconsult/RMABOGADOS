/* app.js - RM ABOGADOS CONSULTORES */

// Especialistas del Consultorio (Por defecto)
const specialists = [
  {
    id: "general",
    name: "RM Abogados (Consulta General)",
    specialty: "Derecho General y Asesorías",
    phone: "573053121476",
    email: "rozomunozabogconsult@gmail.com",
    icon: "⚖️"
  },
  {
    id: "carlos",
    name: "Carlos Muñoz",
    specialty: "Derecho Laboral",
    phone: "573105540308",/* app.js - RM ABOGADOS CONSULTORES */

// Especialistas del Consultorio (Por defecto)
const specialists = [
  {
    id: "general",
    name: "RM Abogados (Consulta General)",
    specialty: "Derecho General y Asesorías",
    phone: "573053121476",
    email: "rozomunozabogconsult@gmail.com",
    icon: "⚖️"
  },
  {
    id: "carlos",
    name: "Carlos Muñoz",
    specialty: "Derecho Laboral",
    phone: "573105540308",
    email: "rozomunozabogconsult@gmail.com",
    icon: "💼"
  },
  {
    id: "ximena",
    name: "Ximena Rozo",
    specialty: "Derecho Administrativo",
    phone: "573108109948",
    email: "rm-abogadosconsultores@outlook.com",
    icon: "🏛️"
  }
];

// Configuración por defecto del asesor (si no hay parámetros en la URL)
const defaultAdvisor = {
  name: "RM ABOGADOS CONSULTORES",
  whatsapp: "573053121476",
  email: "rozomunozabogconsult@gmail.com",
  isDefault: true
};

let currentAdvisor = { ...defaultAdvisor };
let activeAdvisorId = "general"; // Asesor seleccionado por defecto
let activeMethod = "email"; // Método de envío seleccionado: email o whatsapp

// Inicialización de la aplicación
document.addEventListener("DOMContentLoaded", () => {
  // 1. Cargar parámetros de la URL para personalizar asesor
  loadAdvisorFromURL();

  // 2. Renderizar los selectores de asesores (Formulario y Popup)
  renderAdvisors();

  // 3. Configurar el menú emergente flotante de WhatsApp
  setupWhatsappPopup();

  // 4. Configurar el Generador de Enlaces
  setupLinkGenerator();

  // 5. Configurar el Toggler de Métodos de Envío (Correo vs WhatsApp)
  setupMethodToggler();

  // 6. Configurar el Formulario de Asesoría (Email y WhatsApp)
  setupAdvisoryForm();

  // 7. Configurar el Asistente de Triaje (Legis-Bot)
  initLegisBot();

  // 8. Configurar Botón de Tema (Claro/Oscuro)
  setupThemeToggle();

  // 9. Configurar Navegación de pestañas (Tabs)
  setupTabs();
  
  // 10. Configurar botón de cerrar modal
  setupSuccessModal();
  
  // 11. Configurar pantalla de bloqueo del panel del asesor
  setupAdvisorLockScreen();

  // 12. Verificar si viene de un envío de correo exitoso
  checkSubmissionStatus();

  // 13. Inicializar base de datos local y configurar consulta y gestión
  initializeDemoCases();
  setupClientSearch();
  setupAdvisorDashboard();
});

// Función para leer parámetros y personalizar la interfaz
function loadAdvisorFromURL() {
  const params = new URLSearchParams(window.location.search);
  const nameParam = params.get('asesor');
  const whatsappParam = params.get('whatsapp');
  const emailParam = params.get('email');

  if (nameParam || whatsappParam || emailParam) {
    currentAdvisor = {
      name: nameParam || "Asesor Jurídico RM",
      whatsapp: whatsappParam ? sanitizePhoneNumber(whatsappParam) : defaultAdvisor.whatsapp,
      email: emailParam || defaultAdvisor.email,
      isDefault: false
    };

    // Mostrar banner de que está conectado con un asesor específico
    const badge = document.getElementById("advisor-badge");
    if (badge) badge.classList.remove("hidden");
  } else {
    // Si es el por defecto, ocultamos el badge de asesor específico
    const badge = document.getElementById("advisor-badge");
    if (badge) badge.classList.add("hidden");
  }
}

// Renderiza visualmente las opciones de asesores en el Formulario y en el WhatsApp Popup
function renderAdvisors() {
  const selectorGrid = document.getElementById("advisor-selector-grid");
  const popupList = document.getElementById("whatsapp-popup-list");
  
  if (!selectorGrid || !popupList) return;
  
  selectorGrid.innerHTML = "";
  popupList.innerHTML = "";
  
  let listToRender = [...specialists];
  
  // Si hay un asesor personalizado cargado por URL, solo se ofrece este
  if (!currentAdvisor.isDefault) {
    listToRender = [{
      id: "custom",
      name: currentAdvisor.name,
      specialty: "Asesor Asignado por URL",
      phone: currentAdvisor.whatsapp,
      email: currentAdvisor.email,
      icon: "🟢"
    }];
    activeAdvisorId = "custom";
  } else {
    // Evitar que quede asignado "custom" si no hay URL parametrizada
    if (activeAdvisorId === "custom") {
      activeAdvisorId = "general";
    }
  }
  
  // 1. Renderizar tarjetas en el Formulario
  listToRender.forEach(adv => {
    const card = document.createElement("div");
    card.className = `advisor-card ${adv.id === activeAdvisorId ? 'active' : ''}`;
    card.setAttribute("data-advisor-id", adv.id);
    card.innerHTML = `
      <div class="advisor-avatar">${adv.icon}</div>
      <div class="advisor-info">
        <h4>${adv.name}</h4>
        <p>${adv.specialty}</p>
      </div>
    `;
    
    // Evento de clic para seleccionar asesor en el formulario
    card.addEventListener("click", () => {
      document.querySelectorAll(".advisor-card").forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      activeAdvisorId = adv.id;
      
      // Actualizar el pie de página aclaratorio si está en modo WhatsApp
      updateHelperText();
    });
    
    selectorGrid.appendChild(card);
    
    // 2. Renderizar enlaces directos en el Popup Flotante
    const item = document.createElement("a");
    item.className = "whatsapp-popup-item";
    item.target = "_blank";
    
    const initMessage = encodeURIComponent(`Hola ${adv.name}, vi la firma de abogados RM Abogados Consultores y requiero asesoría.`);
    item.href = `https://wa.me/${adv.phone}?text=${initMessage}`;
    
    item.innerHTML = `
      <span class="item-icon">${adv.icon}</span>
      <div class="item-details">
        <strong>${adv.name}</strong>
        <span>${adv.specialty}</span>
      </div>
    `;
    
    popupList.appendChild(item);
  });

  // Mostrar el nombre en el badge superior
  const badgeName = document.getElementById("advisor-badge-name");
  if (badgeName) {
    badgeName.textContent = currentAdvisor.name;
  }

  updateHelperText();
}

// Actualiza los textos de ayuda del pie de formulario dinámicamente
function updateHelperText() {
  const helperText = document.getElementById("form-helper-text");
  if (!helperText) return;

  if (activeMethod === "email") {
    helperText.innerHTML = `Se redactará un correo formal con tus archivos adjuntos dirigido a las bandejas autorizadas de nuestra firma.`;
  } else {
    let selectedAdv;
    if (!currentAdvisor.isDefault) {
      selectedAdv = { name: currentAdvisor.name };
    } else {
      selectedAdv = specialists.find(a => a.id === activeAdvisorId) || specialists[0];
    }
    helperText.innerHTML = `Se abrirá un chat directo de WhatsApp dirigido a <strong>${selectedAdv.name}</strong> para iniciar tu conversación.`;
  }
}

// Configura el comportamiento de apertura/cierre del menú de WhatsApp flotante
function setupWhatsappPopup() {
  const btn = document.getElementById("floating-whatsapp-btn");
  const popup = document.getElementById("whatsapp-popup");
  
  if (!btn || !popup) return;
  
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    popup.classList.toggle("hidden");
  });
  
  document.addEventListener("click", (e) => {
    if (!popup.classList.contains("hidden") && !popup.contains(e.target) && e.target !== btn) {
      popup.classList.add("hidden");
    }
  });
}

// Configura el alternador entre Correo y WhatsApp
function setupMethodToggler() {
  const emailBtn = document.getElementById("method-email-btn");
  const whatsappBtn = document.getElementById("method-whatsapp-btn");
  const attachmentGroup = document.getElementById("attachment-group");
  const submitEmailBtn = document.getElementById("submit-email-btn");
  const submitWhatsappBtn = document.getElementById("submit-whatsapp-btn");

  if (!emailBtn || !whatsappBtn) return;

  emailBtn.addEventListener("click", () => {
    activeMethod = "email";
    emailBtn.classList.add("active");
    whatsappBtn.classList.remove("active");
    
    attachmentGroup.classList.remove("hidden");
    submitEmailBtn.classList.remove("hidden");
    submitWhatsappBtn.classList.add("hidden");

    const clientEmail = document.getElementById("client-email");
    if (clientEmail) {
      clientEmail.required = true;
      const emailLabel = document.querySelector("label[for='client-email']");
      if (emailLabel) emailLabel.innerHTML = 'Correo Electrónico <span style="color: #ef4444;">*</span>';
    }

    updateHelperText();
  });

  whatsappBtn.addEventListener("click", () => {
    activeMethod = "whatsapp";
    whatsappBtn.classList.add("active");
    emailBtn.classList.remove("active");
    
    attachmentGroup.classList.add("hidden");
    submitWhatsappBtn.classList.remove("hidden");
    submitEmailBtn.classList.add("hidden");

    const clientEmail = document.getElementById("client-email");
    if (clientEmail) {
      clientEmail.required = false;
      const emailLabel = document.querySelector("label[for='client-email']");
      if (emailLabel) emailLabel.innerHTML = 'Correo Electrónico <span style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted);">(Opcional)</span>';
    }

    updateHelperText();
  });
}

// Limpia el número telefónico para WhatsApp
function sanitizePhoneNumber(phone) {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    cleaned = '57' + cleaned;
  }
  return cleaned;
}

// Configura la navegación entre secciones (SPA)
function setupTabs() {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".tab-content");

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      const targetId = link.getAttribute("data-target");
      
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      sections.forEach(section => {
        if (section.id === targetId) {
          section.classList.remove("hidden");
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          section.classList.add("hidden");
        }
      });
    });
  });
}

// Configura el generador de links para asesores
function setupLinkGenerator() {
  const form = document.getElementById("link-generator-form");
  const nameInput = document.getElementById("gen-name");
  const phoneInput = document.getElementById("gen-phone");
  const emailInput = document.getElementById("gen-email");
  const resultBox = document.getElementById("link-result-box");
  const resultLink = document.getElementById("generated-link");
  const copyBtn = document.getElementById("copy-link-btn");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = encodeURIComponent(nameInput.value.trim());
    const prefix = document.getElementById("gen-phone-prefix") ? document.getElementById("gen-phone-prefix").value : "57";
    const rawPhone = phoneInput.value.trim();
    const cleanDigits = rawPhone.replace(/\D/g, '');
    const phone = encodeURIComponent(prefix + cleanDigits);
    const email = encodeURIComponent(emailInput.value.trim());

    const baseUri = window.location.href.split('?')[0];
    const shareableUrl = `${baseUri}?asesor=${name}&whatsapp=${phone}&email=${email}`;

    resultLink.textContent = shareableUrl;
    resultBox.classList.remove("hidden");

    copyToClipboard(shareableUrl);
  });

  copyBtn.addEventListener("click", () => {
    copyToClipboard(resultLink.textContent);
  });
}

// Copiar al portapapeles con fallback para entornos locales (file://)
function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast("¡Enlace copiado al portapapeles!");
    }).catch(err => {
      fallbackCopyToClipboard(text);
    });
  } else {
    fallbackCopyToClipboard(text);
  }
}

function fallbackCopyToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showToast("¡Enlace copiado al portapapeles!");
    } else {
      showToast("Selecciona el enlace manualmente.");
    }
  } catch (err) {
    showToast("Selecciona el enlace manualmente.");
  }
  document.body.removeChild(textArea);
}

// Mostrar Toast de notificación
function showToast(message) {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");
  
  if (!toast) return;

  toastMessage.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}

// Configura el formulario de radicación/solicitud
function setupAdvisoryForm() {
  const form = document.getElementById("advisory-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const clientName = document.getElementById("client-name").value.trim();
    const clientPhonePrefix = document.getElementById("client-phone-prefix") ? document.getElementById("client-phone-prefix").value : "57";
    const clientPhoneRaw = document.getElementById("client-phone").value.trim();
    const clientEmail = document.getElementById("client-email") ? document.getElementById("client-email").value.trim() : "";
    const area = document.getElementById("client-area").value;
    const description = document.getElementById("client-desc").value.trim();

    // Generar un número de radicado único (RM-AAAAMMDD-XXXX)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const radicadoId = `RM-${year}${month}${day}-${randomCode}`;

    // 1. Validaciones y Filtros Anti-Spam / Calidad de Casos
    if (clientName.length < 3) {
      showToast("Por favor, ingresa tu nombre completo (mínimo 3 letras).");
      return;
    }

    const cleanPhone = clientPhoneRaw.replace(/\D/g, '');
    if (clientPhonePrefix === "57") {
      if (cleanPhone.length !== 10 || !cleanPhone.startsWith('3')) {
        showToast("Por favor, ingresa un celular colombiano de 10 dígitos (que empiece con 3).");
        return;
      }
    } else {
      if (cleanPhone.length < 7 || cleanPhone.length > 15) {
        showToast("Por favor, ingresa un número de teléfono celular válido.");
        return;
      }
    }

    if (description.length < 30) {
      showToast("Por favor, detalla más tu caso (mínimo 30 caracteres) para darte una respuesta adecuada.");
      return;
    }

    // Combinar indicativo y número limpio para uso posterior
    const clientPhoneFormatted = `+${clientPhonePrefix} ${cleanPhone}`;

    // Obtener datos del asesor seleccionado
    let selectedAdv;
    if (!currentAdvisor.isDefault) {
      selectedAdv = {
        name: currentAdvisor.name,
        phone: currentAdvisor.whatsapp,
        email: currentAdvisor.email
      };
    } else {
      selectedAdv = specialists.find(a => a.id === activeAdvisorId) || specialists[0];
    }

    if (activeMethod === "email") {
      // --- MÉTODO PRINCIPAL: ENVÍO POR FORMULARIO TRADICIONAL DE FORMSUBMIT (EVITA BLOQUEOS CORS EN file://) ---
      
      // Control de Cola / Cooldown (DESACTIVADO PARA PRUEBAS - Cambiar a true para producción)
      const ENABLE_COOLDOWN = false;
      const COOLDOWN_MS = 10 * 60 * 1000; // 10 minutos de espera
      const lastSubTime = localStorage.getItem("last_submission_time");
      if (ENABLE_COOLDOWN && lastSubTime) {
        const elapsed = Date.now() - parseInt(lastSubTime, 10);
        if (elapsed < COOLDOWN_MS) {
          const remainingMins = Math.ceil((COOLDOWN_MS - elapsed) / 60000);
          showToast(`Límite de envíos: Espera ${remainingMins} minuto(s) antes de enviar otro caso por correo, o usa "WhatsApp Directo".`);
          return;
        }
      }

      const primaryEmail = selectedAdv.email || "rozomunozabogconsult@gmail.com";
      let ccEmail = "rm-abogadosconsultores@outlook.com";
      
      if (primaryEmail === "rm-abogadosconsultores@outlook.com") {
        ccEmail = "rozomunozabogconsult@gmail.com";
      } else if (primaryEmail !== "rozomunozabogconsult@gmail.com") {
        ccEmail = "rozomunozabogconsult@gmail.com, rm-abogadosconsultores@outlook.com";
      }

      form.action = `https://formsubmit.co/${primaryEmail}`;
      form.method = "POST";
      form.enctype = "multipart/form-data";

      // Enviar con asunto personalizado y ordenado (incluyendo número de radicado)
      let subjectInput = document.getElementById("form-subject-input");
      if (!subjectInput) {
        subjectInput = document.createElement("input");
        subjectInput.type = "hidden";
        subjectInput.name = "_subject";
        subjectInput.id = "form-subject-input";
        form.appendChild(subjectInput);
      }
      subjectInput.value = `[${radicadoId}] Nueva Radicación: ${area} - ${clientName}`;

      // Configurar copia de correo a la segunda bandeja (outlook)
      let ccInput = document.getElementById("form-cc-input");
      if (!ccInput) {
        ccInput = document.createElement("input");
        ccInput.type = "hidden";
        ccInput.name = "_cc";
        ccInput.id = "form-cc-input";
        form.appendChild(ccInput);
      }
      ccInput.value = ccEmail;

      // Asesor que recibe la consulta
      let advisorInput = document.getElementById("form-advisor-input");
      if (!advisorInput) {
        advisorInput = document.createElement("input");
        advisorInput.type = "hidden";
        advisorInput.name = "Asesor Asignado";
        advisorInput.id = "form-advisor-input";
        form.appendChild(advisorInput);
      }
      advisorInput.value = selectedAdv.name;

      // Configurar presentación premium del correo en FormSubmit (plantilla tipo box)
      let templateInput = document.getElementById("form-template-input");
      if (!templateInput) {
        templateInput = document.createElement("input");
        templateInput.type = "hidden";
        templateInput.name = "_template";
        templateInput.id = "form-template-input";
        form.appendChild(templateInput);
      }
      templateInput.value = "box";

      // Activar recaptcha (Requerido obligatoriamente por FormSubmit para poder enviar el correo de confirmación/autoresponder)
      let captchaInput = document.getElementById("form-captcha-input");
      if (!captchaInput) {
        captchaInput = document.createElement("input");
        captchaInput.type = "hidden";
        captchaInput.name = "_captcha";
        captchaInput.id = "form-captcha-input";
        form.appendChild(captchaInput);
      }
      captchaInput.value = "true";

      let nextInput = document.getElementById("form-next-input");
      if (!nextInput) {
        nextInput = document.createElement("input");
        nextInput.type = "hidden";
        nextInput.name = "_next";
        nextInput.id = "form-next-input";
        form.appendChild(nextInput);
      }
      // Redirigir de regreso a la página local con un parámetro success=true
      const redirectUrl = window.location.href.split('?')[0] + "?success=true";
      nextInput.value = redirectUrl;

      const fileInput = document.getElementById("client-files");
      const filesCount = fileInput && fileInput.files ? fileInput.files.length : 0;

      // Configurar Autoresponder (Correo de confirmación al cliente)
      let autoresponseInput = document.getElementById("form-autoresponse-input");
      if (!autoresponseInput) {
        autoresponseInput = document.createElement("input");
        autoresponseInput.type = "hidden";
        autoresponseInput.name = "_autoresponse";
        autoresponseInput.id = "form-autoresponse-input";
        form.appendChild(autoresponseInput);
      }
      autoresponseInput.value = `Estimado(a) cliente,

Su solicitud de asesoría jurídica en RM ABOGADOS CONSULTORES ha sido registrada con éxito en nuestro sistema.

Para el control, orden y seguimiento de su caso, se le ha asignado el siguiente identificador único:
👉 NÚMERO DE RADICADO: ${radicadoId}

Un especialista de nuestro equipo revisará su caso y se comunicará con usted a través de nuestros canales autorizados durante el horario laboral.

Recuerde que las asesorías jurídicas y radicaciones tienen un costo comercial, el cual se cotizará de manera interna y personalizada de acuerdo a la complejidad de su caso antes de iniciar cualquier trámite formal.

Por favor, conserve este número de radicado para cualquier consulta de seguimiento.

Atentamente,
RM ABOGADOS CONSULTORES
Rozo Muñoz Abogados Consultores
Contacto: +57 305 312 1476`;

      // Agregar el número de radicado como un campo visible en el correo
      let radicadoInput = document.getElementById("form-radicado-input");
      if (!radicadoInput) {
        radicadoInput = document.createElement("input");
        radicadoInput.type = "hidden";
        radicadoInput.name = "Número de Radicado";
        radicadoInput.id = "form-radicado-input";
        form.appendChild(radicadoInput);
      }
      radicadoInput.value = radicadoId;

      // Obtener nombres de archivos adjuntos
      const fileNames = [];
      if (fileInput && fileInput.files) {
        for (let i = 0; i < fileInput.files.length; i++) {
          fileNames.push(fileInput.files[i].name);
        }
      }

      const legisbotPath = sessionStorage.getItem("legisbot_path") || null;
      sessionStorage.removeItem("legisbot_path"); // Limpiar después de usar

      // Guardar en la base de datos local
      const newCase = {
        id: radicadoId,
        date: new Date().toISOString(),
        name: clientName,
        phone: clientPhoneFormatted,
        email: clientEmail,
        area: area,
        description: description,
        advisor: selectedAdv.name,
        status: "Recibido",
        observation: "",
        method: "Correo",
        files: fileNames,
        origin: legisbotPath ? `LegisBot (${legisbotPath})` : "Formulario Directo"
      };
      registerNewCase(newCase);

      // Guardar información en sessionStorage para mostrarla en el modal tras la redirección
      sessionStorage.setItem("last_submission_files_count", filesCount);
      sessionStorage.setItem("last_submission_success", "true");
      sessionStorage.setItem("last_submission_primary_email", primaryEmail);
      sessionStorage.setItem("last_submission_cc_email", ccEmail);
      sessionStorage.setItem("last_submission_radicado", radicadoId);

      // Registrar marca de tiempo del envío en localStorage
      localStorage.setItem("last_submission_time", Date.now().toString());

      // Enviar el formulario de manera nativa para asegurar la entrega
      form.submit();
    } else {
      // --- MÉTODO AUXILIAR: ENVÍO POR WHATSAPP ---
      let emailText = "";
      if (clientEmail) {
        emailText = `*Correo:* ${clientEmail}\n`;
      }

      const legisbotPath = sessionStorage.getItem("legisbot_path") || null;
      sessionStorage.removeItem("legisbot_path"); // Limpiar después de usar

      // Guardar en la base de datos local
      const newCase = {
        id: radicadoId,
        date: new Date().toISOString(),
        name: clientName,
        phone: clientPhoneFormatted,
        email: clientEmail || "No registrado (WhatsApp)",
        area: area,
        description: description,
        advisor: selectedAdv.name,
        status: "Recibido",
        observation: "",
        method: "WhatsApp",
        files: [],
        origin: legisbotPath ? `LegisBot (${legisbotPath})` : "Formulario Directo"
      };
      registerNewCase(newCase);

      const message = `*Nueva Solicitud de Asesoría - RM ABOGADOS* 🇨🇴\n\n` +
                      `*Radicado:* ${radicadoId}\n` +
                      `*Nombre:* ${clientName}\n` +
                      `*WhatsApp:* ${clientPhoneFormatted}\n` +
                      emailText +
                      `*Área de Interés:* ${area}\n` +
                      `*Asesor Requerido:* ${selectedAdv.name}\n` +
                      `*Descripción del Caso:* ${description}\n\n` +
                      `_Enviado desde la firma de abogados RM Abogados Consultores_`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${selectedAdv.phone}?text=${encodedMessage}`;

      window.open(whatsappUrl, '_blank');
      showToast("¡Solicitud registrada con radicado: " + radicadoId + "! Redirigiendo a WhatsApp...");
    }
  });
}

// Configura el cierre del modal de éxito
function setupSuccessModal() {
  const modal = document.getElementById("success-modal");
  const closeBtn = document.getElementById("close-modal-btn");
  const form = document.getElementById("advisory-form");

  if (!modal || !closeBtn) return;

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    // Resetear formulario
    if (form) form.reset();
  });
}

// Configura el botón para alternar entre modo claro y oscuro
function setupThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle");
  if (!toggleBtn) return;

  const icon = toggleBtn.querySelector("span");

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-theme");
    icon.textContent = "☀️";
  }

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    const isDark = document.body.classList.contains("dark-theme");
    
    icon.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

// --- Lógica del LegisBot (Triaje Interactivo) ---
const botState = {
  step: 'start',
  selectedArea: '',
  selectedSub: ''
};

function initLegisBot() {
  const messagesContainer = document.getElementById("chat-messages");
  if (!messagesContainer) return;

  messagesContainer.innerHTML = "";
  botState.step = 'start';
  
  addBotMessage("¡Hola! Soy ⚖️ <b>LegisBot</b>, tu asistente virtual de RM ABOGADOS CONSULTORES.");
  setTimeout(() => {
    addBotMessage("¿Cuál es el área sobre la que requieres orientación legal hoy?");
    showOptions([
      { text: "💼 Trabajo o Empleo (Laboral)", value: "laboral" },
      { text: "🏛️ Reclamaciones al Estado (Administrativo)", value: "administrativo" },
      { text: "🏠 Familia o Hijos (Familia)", value: "familia" },
      { text: "📄 Arriendos o Deudas (Civil)", value: "civil" },
      { text: "🛡️ Derechos Fundamentales (Tutela/Petición)", value: "tutela" }
    ]);
  }, 800);
}

function handleOptionSelection(value, text) {
  addUserMessage(text);
  
  if (botState.step === 'start') {
    botState.selectedArea = value;
    botState.step = 'sub_category';
    
    setTimeout(() => {
      if (value === 'laboral') {
        addBotMessage("Entendido, Derecho Laboral. ¿Cuál de estos casos describe tu situación?");
        showOptions([
          { text: "Me despidieron sin justa causa", value: "despido" },
          { text: "No me han pagado mi liquidación o salario", value: "liquidacion" },
          { text: "Tengo dudas sobre mi contrato laboral", value: "contrato" }
        ]);
      } else if (value === 'administrativo') {
        addBotMessage("Entendido, Derecho Administrativo. Esta área regula tus relaciones con entidades del Estado. ¿Cuál es tu caso?");
        showOptions([
          { text: "Tengo un conflicto con un Contrato Estatal", value: "licitacion" },
          { text: "Quiero impugnar una Multa o Sanción de la administración", value: "sancion" },
          { text: "Una entidad pública no responde (Silencio Adm.)", value: "silencio" }
        ]);
      } else if (value === 'familia') {
        addBotMessage("Entendido, Derecho de Familia. ¿Cuál es tu consulta?");
        showOptions([
          { text: "Fijación o cobro de Cuota Alimentaria", value: "alimentos" },
          { text: "Custodia o visitas de menores", value: "custodia" },
          { text: "Divorcio o liquidación conyugal", value: "divorcio" }
        ]);
      } else if (value === 'civil') {
        addBotMessage("Derecho Civil y contratos entre particulares. ¿Cuál es tu caso?");
        showOptions([
          { text: "Tengo problemas con un arrendamiento", value: "arriendo" },
          { text: "Tengo deudas acumuladas o cobranzas bancarias", value: "deuda" },
          { text: "Defectos en compras o garantías (Consumidor)", value: "compraventa" }
        ]);
      } else if (value === 'tutela') {
        addBotMessage("Derechos Fundamentales. ¿Cuál es tu situación?");
        showOptions([
          { text: "Problemas de Salud (Negativa de EPS)", value: "salud" },
          { text: "Necesito radicar un Derecho de Petición formal", value: "peticion" },
          { text: "Violación al debido proceso u otro derecho", value: "vulneracion" }
        ]);
      }
    }, 600);
  } else if (botState.step === 'sub_category') {
    botState.selectedSub = value;
    botState.step = 'recommendation';
    
    setTimeout(() => {
      let recommendation = "";
      let areaFormValue = "";
      let recommendedSpecialist = "";
      
      if (botState.selectedArea === 'laboral') {
        areaFormValue = "Laboral";
        recommendedSpecialist = "<b>Carlos Muñoz</b> (Especialista en Derecho Laboral)";
        if (value === 'despido') {
          recommendation = "<b>Recomendación según Ley:</b> El <i>Artículo 64 del CST</i> regula la indemnización por despido sin justa causa. Tienes derecho a un pago calculado según tu antigüedad y salario. Te aconsejamos estructurar formalmente el caso.";
        } else if (value === 'liquidacion') {
          recommendation = "<b>Recomendación según Ley:</b> El empleador debe cancelar las prestaciones sociales tan pronto termine el contrato. La demora genera sanción moratoria equivalente a un día de salario por día de retraso (<i>Artículo 65 del CST</i>).";
        } else {
          recommendation = "<b>Recomendación según Ley:</b> Si hay subordinación, cumplimiento de horario y pago, rige el <i>Principio de Primacía de la Realidad</i>. Tienes derecho a que se reconozca un contrato de trabajo real con prestaciones.";
        }
      } else if (botState.selectedArea === 'administrativo') {
        areaFormValue = "Administrativo";
        recommendedSpecialist = "<b>Ximena Rozo</b> (Especialista en Derecho Administrativo)";
        if (value === 'licitacion') {
          recommendation = "<b>Recomendación según Ley:</b> La contratación con el Estado está regida por la <i>Ley 80 de 1993</i>. Para reclamar desequilibrios económicos o incumplimientos del Estado se debe radicar una reclamación formal antes de ir a juicio.";
        } else if (value === 'sancion') {
          recommendation = "<b>Recomendación según Ley:</b> Las sanciones y comparendos de entidades del Estado se rigen por el <i>CPACA</i>. Existen plazos estrictos para interponer recursos de reposición y apelación antes de agotar la vía administrativa.";
        } else {
          recommendation = "<b>Recomendación según Ley:</b> Si la administración pública no responde tus solicitudes en los términos de la <i>Ley 1755 de 2015</i>, se configura el silencio administrativo y la vulneración del derecho constitucional de petición.";
        }
      } else if (botState.selectedArea === 'familia') {
        areaFormValue = "Familia";
        recommendedSpecialist = "nuestros asesores generales de la oficina";
        if (value === 'alimentos') {
          recommendation = "<b>Recomendación según Ley:</b> Los alimentos para menores se regulan por el <i>Código de Infancia y Adolescencia</i>. Para cobrarlos por vía ejecutiva o fijarlos se debe citar obligatoriamente a conciliación ante el ICBF o Comisaría.";
        } else if (value === 'custodia') {
          recommendation = "<b>Recomendación según Ley:</b> La custodia y visitas se rigen por el <i>interés superior del menor</i>. Te sugerimos tramitar una solicitud de conciliación en el ICBF para definir el régimen de visitas de forma legal y ordenada.";
        } else {
          recommendation = "<b>Recomendación según Ley:</b> El divorcio de común acuerdo se tramita rápidamente ante Notaría. Si hay oposición de una parte, se debe radicar demanda judicial ante el Juez de Familia sustentando las causales legales.";
        }
      } else if (botState.selectedArea === 'civil') {
        areaFormValue = "Civil";
        recommendedSpecialist = "nuestros asesores generales de la oficina";
        if (value === 'arriendo') {
          recommendation = "<b>Recomendación según Ley:</b> Los arrendamientos se rigen por la <i>Ley 820 de 2003</i>. Si el inquilino incumple el pago, se debe notificar formalmente el inicio del proceso de restitución del inmueble.";
        } else if (value === 'deuda') {
          recommendation = "<b>Recomendación según Ley:</b> La ley de insolvencia de persona natural no comerciante te permite renegociar tu pasivo de forma voluntaria en centros de conciliación, deteniendo procesos ejecutivos y embargos.";
        } else {
          recommendation = "<b>Recomendación según Ley:</b> El Estatuto del Consumidor (<i>Ley 1480 de 2011</i>) te faculta a exigir la garantía legal de bienes defectuosos directamente ante la Superintendencia de Industria y Comercio.";
        }
      } else if (botState.selectedArea === 'tutela') {
        areaFormValue = "Tutela / Peticion";
        recommendedSpecialist = "nuestros asesores generales de la oficina";
        if (value === 'salud') {
          recommendation = "<b>Recomendación según Ley:</b> El acceso a la salud es conexo con la vida. Ante la negativa de la EPS a autorizar procedimientos o medicamentos, la <i>Acción de Tutela (Art. 86)</i> obliga a responder en un plazo de 10 días.";
        } else if (value === 'peticion') {
          recommendation = "<b>Recomendación según Ley:</b> El <i>Artículo 23 de la Constitución</i> ampara el Derecho de Petición. Las entidades públicas y privadas cuentan con 15 días hábiles para responder, so pena de incurrir en desacato constitucional.";
        } else {
          recommendation = "<b>Recomendación según Ley:</b> La Acción de Tutela procede cuando se vulneren de forma directa derechos fundamentales consagrados en la Constitución y no existan mecanismos alternativos eficaces.";
        }
      }

      addBotMessage(recommendation);
      
      setTimeout(() => {
        addBotMessage(`Para radicar formalmente tu caso adjuntando tus documentos soporte a las bandejas autorizadas, te sugiero radicar por correo electrónico. ¿Deseas ir al formulario de radicación principal?`);
        showOptions([
          { text: "Sí, ir a Radicar Caso", value: "conectar", action: () => selectAdvisoryTab(areaFormValue, text) },
          { text: "Reiniciar consulta", value: "reiniciar", action: () => initLegisBot() }
        ]);
      }, 1000);

    }, 600);
  }
}

// Redirecciona a la pestaña del formulario de asesoría y pre-rellena los datos
function selectAdvisoryTab(area, details) {
  // Guardar en sessionStorage la procedencia del LegisBot
  sessionStorage.setItem("legisbot_path", details);

  const formTabLink = document.querySelector(".nav-link[data-target='solicitud']");
  if (formTabLink) {
    formTabLink.click();
  }

  const areaSelect = document.getElementById("client-area");
  if (areaSelect) {
    if (area.includes("Laboral")) {
      areaSelect.value = "Laboral";
      activeAdvisorId = "carlos"; // Carlos Muñoz
    } else if (area.includes("Administrativo")) {
      areaSelect.value = "Administrativo";
      activeAdvisorId = "ximena"; // Ximena Rozo
    } else if (area.includes("Familia")) {
      areaSelect.value = "Familia";
      activeAdvisorId = "general"; // Oficina General
    } else if (area.includes("Civil")) {
      areaSelect.value = "Civil";
      activeAdvisorId = "general"; // Oficina General
    } else {
      areaSelect.value = "Otro / Consulta general";
      activeAdvisorId = "general"; // Oficina General
    }
  }

  // Activar por defecto el método de Correo (Principal) al venir del triaje
  const emailBtn = document.getElementById("method-email-btn");
  if (emailBtn) {
    emailBtn.click();
  }

  // Re-renderizar tarjetas para reflejar el especialista pre-seleccionado
  renderAdvisors();

  const descTextArea = document.getElementById("client-desc");
  if (descTextArea) {
    descTextArea.value = `Caso orientado mediante triaje virtual.\nTema: ${details}\n\nDetalla los hechos de tu situación legal aquí...`;
    descTextArea.focus();
  }
}

// Funciones auxiliares para el Chat
function addBotMessage(htmlContent) {
  const container = document.getElementById("chat-messages");
  if (!container) return;
  const msg = document.createElement("div");
  msg.className = "message bot";
  msg.innerHTML = htmlContent;
  container.appendChild(msg);
  scrollToBottom(container);
}

function addUserMessage(textContent) {
  const container = document.getElementById("chat-messages");
  if (!container) return;
  const msg = document.createElement("div");
  msg.className = "message user";
  msg.textContent = textContent;
  container.appendChild(msg);
  scrollToBottom(container);
}

function showOptions(options) {
  const optionsContainer = document.getElementById("chat-options");
  if (!optionsContainer) return;
  optionsContainer.innerHTML = "";
  
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt.text;
    btn.addEventListener("click", () => {
      if (opt.action) {
        opt.action();
      } else {
        handleOptionSelection(opt.value, opt.text);
      }
    });
    optionsContainer.appendChild(btn);
  });
}

function scrollToBottom(element) {
  element.scrollTop = element.scrollHeight;
}

// Pantalla de bloqueo del Panel del Asesor (Código de acceso por defecto: 1034516761)
const ADVISOR_PASSCODE = "1034516761";

function setupAdvisorLockScreen() {
  const unlockBtn = document.getElementById("unlock-panel-btn");
  const passcodeInput = document.getElementById("advisor-passcode");
  const lockScreen = document.getElementById("advisor-lock-screen");
  const formContainer = document.getElementById("advisor-panel-form-container");
  const errorMsg = document.getElementById("lock-error-msg");

  if (!unlockBtn) return;

  // Verificar si ya inició sesión en esta sesión del navegador
  if (sessionStorage.getItem("advisor_logged_in") === "true") {
    if (lockScreen) lockScreen.classList.add("hidden");
    if (formContainer) formContainer.classList.remove("hidden");
  }

  unlockBtn.addEventListener("click", () => {
    const inputCode = passcodeInput.value.trim();
    if (inputCode === ADVISOR_PASSCODE) {
      if (lockScreen) lockScreen.classList.add("hidden");
      if (formContainer) formContainer.classList.remove("hidden");
      if (errorMsg) errorMsg.classList.add("hidden");
      sessionStorage.setItem("advisor_logged_in", "true");
    } else {
      if (errorMsg) errorMsg.classList.remove("hidden");
      passcodeInput.value = "";
      passcodeInput.focus();
    }
  });

  // Permitir presionar Enter para desbloquear
  passcodeInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      unlockBtn.click();
    }
  });
}

// Verifica si venimos de una redirección de FormSubmit exitosa y muestra el modal
function checkSubmissionStatus() {
  const params = new URLSearchParams(window.location.search);
  const successParam = params.get('success');
  const sessionSuccess = sessionStorage.getItem("last_submission_success");

  if (successParam === 'true' || sessionSuccess === "true") {
    const modal = document.getElementById("success-modal");
    if (modal) {
      modal.classList.remove("hidden");
      
      // Actualizar destinatarios y número de radicado en el modal
      const primaryMail = sessionStorage.getItem("last_submission_primary_email") || "rozomunozabogconsult@gmail.com";
      const ccMail = sessionStorage.getItem("last_submission_cc_email") || "rm-abogadosconsultores@outlook.com";
      const radicado = sessionStorage.getItem("last_submission_radicado") || "RM-ASIGNANDO...";
      const modalDetails = modal.querySelector(".modal-details");
      
      if (modalDetails) {
        modalDetails.innerHTML = `
          <div style="text-align: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid var(--border-color);">
            <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Número de Radicado</span>
            <div style="font-size: 1.25rem; font-weight: 800; color: var(--accent-color); margin-top: 4px; font-family: monospace;">${radicado}</div>
          </div>
          <p><strong>Firma de Abogados:</strong> RM ABOGADOS CONSULTORES</p>
          <p><strong>Canal de Recepción:</strong> Sistema de Radicación Formal (Correo Electrónico)</p>
          <p id="modal-anexos-text" style="border-top: 1px solid var(--border-color); padding-top: 8px;"><strong>Archivos adjuntos:</strong> Ninguno</p>
        `;
      }

      // Actualizar texto de anexos si es posible
      const filesCount = sessionStorage.getItem("last_submission_files_count");
      const anexosText = document.getElementById("modal-anexos-text");
      if (anexosText && filesCount !== null) {
        const count = parseInt(filesCount, 10);
        if (count > 0) {
          anexosText.innerHTML = `<strong>Archivos adjuntos:</strong> ${count} archivo(s) cargado(s)`;
        } else {
          anexosText.innerHTML = `<strong>Archivos adjuntos:</strong> Ninguno`;
        }
      }
    }
    
    // Limpiar sessionStorage
    sessionStorage.removeItem("last_submission_success");
    sessionStorage.removeItem("last_submission_files_count");
    sessionStorage.removeItem("last_submission_primary_email");
    sessionStorage.removeItem("last_submission_cc_email");
    sessionStorage.removeItem("last_submission_radicado");
    
    // Limpiar el parámetro de la URL sin recargar la página
    if (window.history.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.delete('success');
      window.history.replaceState({ path: url.href }, '', url.href);
    }
  }
}

// ==========================================
// SISTEMA DE BASE DE DATOS LOCAL Y SEGUIMIENTO
// ==========================================

function getCasesFromStorage() {
  const cases = localStorage.getItem("rm_abogados_cases");
  return cases ? JSON.parse(cases) : [];
}

function saveCasesToStorage(cases) {
  localStorage.setItem("rm_abogados_cases", JSON.stringify(cases));
}

function registerNewCase(c) {
  const cases = getCasesFromStorage();
  cases.push(c);
  saveCasesToStorage(cases);
}

function initializeDemoCases() {
  const cases = getCasesFromStorage();
  if (cases.length === 0) {
    const demoCases = [
      {
        id: "RM-20260608-8646",
        date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // hace 2 horas
        name: "Miguel Angel",
        phone: "+57 3143211200",
        email: "miguelangelrei12@gmail.com",
        area: "Laboral",
        description: "Requiero apoyo con el cálculo de mi liquidación por despido sin justa causa tras trabajar 3 años.",
        advisor: "Carlos Muñoz",
        status: "En Proceso",
        observation: "Se programó llamada para el martes 9 de junio a las 10:00 AM para validar soportes.",
        method: "Correo",
        files: ["contrato_trabajo.pdf", "comprobantes_pago.zip"],
        origin: "LegisBot (Despido sin justa causa)"
      },
      {
        id: "RM-20260607-1234",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1.5).toISOString(), // hace día y medio
        name: "Adriana María Gómez",
        phone: "+57 3009876543",
        email: "adriana.gomez@gmail.com",
        area: "Administrativo",
        description: "Vulneración al debido proceso por una multa de tránsito impuesta sin debida notificación en la autopista norte.",
        advisor: "Ximena Rozo",
        status: "Recibido",
        observation: "",
        method: "Correo",
        files: ["fotomulta_comparendo.png"],
        origin: "Formulario Directo"
      },
      {
        id: "RM-20260605-4321",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3.5).toISOString(), // hace 3 días y medio
        name: "Jorge Iván Restrepo",
        phone: "+57 3112223344",
        email: "jorge.restrepo@outlook.com",
        area: "Civil",
        description: "Contrato de arrendamiento de local comercial que venció hace 1 mes. El inquilino no ha pagado el último canon y se niega a entregar el inmueble.",
        advisor: "RM Abogados (Consulta General)",
        status: "En Revisión",
        observation: "Revisando el contrato de arrendamiento y las cláusulas de restitución voluntaria.",
        method: "WhatsApp",
        files: [],
        origin: "Formulario Directo"
      }
    ];
    saveCasesToStorage(demoCases);
  }
}

function setupClientSearch() {
  const searchBtn = document.getElementById("search-radicado-btn");
  const radicadoInput = document.getElementById("search-radicado-input");
  const verifyInput = document.getElementById("search-verify-input");
  const resultContainer = document.getElementById("search-result-container");

  if (!searchBtn) return;

  searchBtn.addEventListener("click", () => {
    const radicado = radicadoInput.value.trim().toUpperCase();
    const verification = verifyInput.value.trim().toLowerCase();

    if (!radicado || !verification) {
      showToast("Por favor, ingresa el número de radicado y tu correo o teléfono.");
      return;
    }

    const cases = getCasesFromStorage();
    const foundCase = cases.find(c => c.id.toUpperCase() === radicado);

    if (foundCase) {
      const clientEmail = foundCase.email.toLowerCase();
      const clientPhoneClean = foundCase.phone.replace(/\D/g, '');
      const verificationClean = verification.replace(/\D/g, '');

      const matchesEmail = clientEmail === verification;
      const matchesPhone = verificationClean.length > 5 && clientPhoneClean.includes(verificationClean);

      if (matchesEmail || matchesPhone) {
        renderSearchResult(foundCase);
      } else {
        showSearchError("El correo electrónico o número de teléfono ingresado no coinciden con el registro de este radicado. Por seguridad, verifica tus datos.");
      }
    } else {
      showSearchError("No se encontró ningún caso con el número de radicado ingresado. Por favor, verifica el código.");
    }
  });

  [radicadoInput, verifyInput].forEach(input => {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        searchBtn.click();
      }
    });
  });
}

function showSearchError(message) {
  const resultContainer = document.getElementById("search-result-container");
  if (!resultContainer) return;
  resultContainer.innerHTML = `
    <div class="card" style="border-left: 5px solid #ef4444; background-color: rgba(239, 68, 68, 0.05); margin-top: 20px;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 1.5rem;">❌</span>
        <div>
          <h4 style="color: #ef4444; margin-bottom: 4px;">Error en la consulta</h4>
          <p style="font-size: 0.9rem; color: var(--text-main);">${message}</p>
        </div>
      </div>
    </div>
  `;
  resultContainer.classList.remove("hidden");
}

function renderSearchResult(c) {
  const resultContainer = document.getElementById("search-result-container");
  if (!resultContainer) return;

  const dateObj = new Date(c.date);
  const formattedDate = dateObj.toLocaleDateString('es-CO', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  let statusClass = "status-recibido";
  if (c.status === "En Revisión") statusClass = "status-revision";
  if (c.status === "En Proceso") statusClass = "status-proceso";
  if (c.status === "Resuelto") statusClass = "status-resuelto";
  if (c.status === "Cerrado") statusClass = "status-cerrado";

  // Badge del método
  const methodBadge = c.method === "Correo" 
    ? `<span class="method-badge method-email" style="font-size: 0.75rem; padding: 3px 6px; border-radius: 4px; background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.2); font-weight: 600; margin-left: 8px;">✉️ Correo</span>`
    : `<span class="method-badge method-whatsapp" style="font-size: 0.75rem; padding: 3px 6px; border-radius: 4px; background: rgba(37, 211, 102, 0.1); color: #25d366; border: 1px solid rgba(37, 211, 102, 0.2); font-weight: 600; margin-left: 8px;">💬 WhatsApp</span>`;

  // Archivos
  let filesHtml = "";
  if (c.files && c.files.length > 0) {
    filesHtml = `<div style="margin-top: 15px; padding: 10px; background: rgba(0,0,0,0.01); border-radius: 6px; border: 1px solid var(--border-color);">
      <strong>Documentos Adjuntos (${c.files.length}):</strong>
      <ul style="list-style: none; margin-top: 5px; padding-left: 0; display: flex; flex-direction: column; gap: 5px;">
        ${c.files.map(f => `<li style="font-size: 0.85rem; display: flex; align-items: center; gap: 6px;">📎 <span>${f}</span></li>`).join('')}
      </ul>
    </div>`;
  }

  const obsHtml = c.observation 
    ? `<div class="search-observation-box" style="margin-top: 15px; padding: 15px; background-color: rgba(217, 119, 6, 0.05); border-left: 4px solid var(--accent-color); border-radius: 6px;">
         <h5 style="color: var(--accent-color); font-weight: 700; margin-bottom: 5px;">Respuesta / Observaciones del Asesor:</h5>
         <p style="font-size: 0.95rem; line-height: 1.5; color: var(--text-main); white-space: pre-line;">${c.observation}</p>
       </div>`
    : `<p style="font-style: italic; color: var(--text-muted); font-size: 0.9rem; margin-top: 15px; background-color: rgba(0,0,0,0.02); padding: 10px; border-radius: 6px;">Aún no se han registrado observaciones de seguimiento para este radicado.</p>`;

  resultContainer.innerHTML = `
    <div class="card search-result-card" style="margin-top: 20px; border-left: 5px solid var(--accent-color);">
      <div class="search-result-header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 15px; margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 15px;">
        <div>
          <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 5px;">
            <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Código de Radicado</span>
            ${methodBadge}
          </div>
          <h3 style="color: var(--accent-color); font-family: monospace; font-size: 1.4rem; margin-top: 2px;">${c.id}</h3>
        </div>
        <span class="status-badge ${statusClass}">${c.status}</span>
      </div>

      <div class="search-result-grid" style="display: grid; grid-template-columns: 1fr; gap: 15px; margin-bottom: 20px;">
        <div class="search-detail-item">
          <strong>Solicitante:</strong> <span>${c.name}</span>
        </div>
        <div class="search-detail-item">
          <strong>Área Legal:</strong> <span>${c.area}</span>
        </div>
        <div class="search-detail-item">
          <strong>Asesor Asignado:</strong> <span>${c.advisor}</span>
        </div>
        <div class="search-detail-item">
          <strong>Fecha de Radicación:</strong> <span>${formattedDate}</span>
        </div>
      </div>

      <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid var(--border-color);">
        <strong>Descripción del Caso:</strong>
        <p style="font-size: 0.95rem; margin-top: 5px; color: var(--text-main); white-space: pre-line;">${c.description}</p>
      </div>
      
      ${filesHtml}

      <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid var(--border-color);">
        ${obsHtml}
      </div>
    </div>
  `;
  resultContainer.classList.remove("hidden");
}

function setupAdvisorDashboard() {
  const unlockBtn = document.getElementById("unlock-panel-btn");
  const passcodeInput = document.getElementById("advisor-passcode");

  if (sessionStorage.getItem("advisor_logged_in") === "true") {
    setupAdvisorFilterListeners();
    filterAndRenderAdvisorCases();
  }

  if (unlockBtn) {
    unlockBtn.addEventListener("click", () => {
      const code = passcodeInput.value.trim();
      if (code === ADVISOR_PASSCODE) {
        setupAdvisorFilterListeners();
        filterAndRenderAdvisorCases();
      }
    });
  }

  if (passcodeInput) {
    passcodeInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && passcodeInput.value.trim() === ADVISOR_PASSCODE) {
        setupAdvisorFilterListeners();
        filterAndRenderAdvisorCases();
      }
    });
  }
}

function setupAdvisorFilterListeners() {
  const searchInput = document.getElementById("advisor-search-input");
  const filterStatus = document.getElementById("advisor-filter-status");
  const filterArea = document.getElementById("advisor-filter-area");

  if (!searchInput) return;

  if (searchInput.dataset.listenerAttached === "true") return;

  searchInput.addEventListener("input", filterAndRenderAdvisorCases);
  if (filterStatus) filterStatus.addEventListener("change", filterAndRenderAdvisorCases);
  if (filterArea) filterArea.addEventListener("change", filterAndRenderAdvisorCases);

  searchInput.dataset.listenerAttached = "true";
}

function filterAndRenderAdvisorCases() {
  const searchInput = document.getElementById("advisor-search-input");
  const filterStatus = document.getElementById("advisor-filter-status");
  const filterArea = document.getElementById("advisor-filter-area");
  const container = document.getElementById("advisor-cases-list");

  if (!container) return;

  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
  const statusVal = filterStatus ? filterStatus.value : "all";
  const areaVal = filterArea ? filterArea.value : "all";

  const cases = getCasesFromStorage();
  let filteredCases = [...cases];

  // 1. Filtrar por búsqueda
  if (query) {
    filteredCases = filteredCases.filter(c => 
      c.id.toLowerCase().includes(query) ||
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.phone.includes(query) ||
      c.description.toLowerCase().includes(query) ||
      (c.observation && c.observation.toLowerCase().includes(query))
    );
  }

  // 2. Filtrar por estado
  if (statusVal !== "all") {
    filteredCases = filteredCases.filter(c => c.status === statusVal);
  }

  // 3. Filtrar por área
  if (areaVal !== "all") {
    filteredCases = filteredCases.filter(c => c.area === areaVal);
  }

  // Ordenar casos por tiempo (más recientes primero)
  filteredCases.sort((a, b) => new Date(b.date) - new Date(a.date));

  container.innerHTML = "";

  if (filteredCases.length === 0) {
    container.innerHTML = `
      <p style="text-align: center; color: var(--text-muted); font-style: italic; padding: 30px;">
        No se encontraron casos que coincidan con la búsqueda o filtros seleccionados.
      </p>
    `;
    return;
  }

  filteredCases.forEach(c => {
    const card = document.createElement("div");
    card.className = "card advisor-case-card";
    card.style.marginTop = "20px";
    
    const dateObj = new Date(c.date);
    const formattedDate = dateObj.toLocaleDateString('es-CO', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    let statusClass = "status-recibido";
    if (c.status === "En Revisión") statusClass = "status-revision";
    if (c.status === "En Proceso") statusClass = "status-proceso";
    if (c.status === "Resuelto") statusClass = "status-resuelto";
    if (c.status === "Cerrado") statusClass = "status-cerrado";

    // Badge del método
    const methodBadge = c.method === "Correo" 
      ? `<span class="method-badge method-email" style="font-size: 0.75rem; padding: 4px 8px; border-radius: 4px; background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.2); font-weight: 600; margin-left: 8px;">✉️ Correo</span>`
      : `<span class="method-badge method-whatsapp" style="font-size: 0.75rem; padding: 4px 8px; border-radius: 4px; background: rgba(37, 211, 102, 0.1); color: #25d366; border: 1px solid rgba(37, 211, 102, 0.2); font-weight: 600; margin-left: 8px;">💬 WhatsApp</span>`;

    // Archivos
    let filesHtml = "";
    if (c.files && c.files.length > 0) {
      filesHtml = `<div style="margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.02); border-radius: 6px;">
        <strong>Archivos Anexados (${c.files.length}):</strong>
        <ul style="list-style: none; margin-top: 5px; padding-left: 0; display: flex; flex-direction: column; gap: 5px;">
          ${c.files.map(f => `<li style="font-size: 0.85rem; display: flex; align-items: center; gap: 6px; color: var(--text-main);">📎 <span>${f}</span></li>`).join('')}
        </ul>
      </div>`;
    } else {
      filesHtml = `<p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 10px; font-style: italic;">📎 Sin archivos adjuntos.</p>`;
    }

    const waPhoneClean = c.phone.replace(/\D/g, '');
    const mailSubject = encodeURIComponent(`[${c.id}] Respuesta a tu consulta - RM ABOGADOS CONSULTORES`);
    const mailBody = encodeURIComponent(`Estimado(a) ${c.name},\n\nNos ponemos en contacto en relación a su solicitud de asesoría con número de radicado ${c.id}.\n\nAtentamente,\nRM ABOGADOS CONSULTORES`);

    card.innerHTML = `
      <div class="advisor-case-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 12px; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 5px;">
          <span style="font-family: monospace; font-size: 1.15rem; font-weight: 800; color: var(--accent-color);">${c.id}</span>
          <span style="font-size: 0.8rem; color: var(--text-muted); margin-left: 10px;">📅 ${formattedDate}</span>
          ${methodBadge}
        </div>
        <span class="status-badge ${statusClass}" id="badge-${c.id}">${c.status}</span>
      </div>

      <div class="advisor-case-body" style="display: grid; grid-template-columns: 1fr; gap: 20px;">
        <div class="advisor-case-details" style="display: grid; grid-template-columns: 1fr; gap: 10px;">
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 15px; background: rgba(0,0,0,0.01); padding: 15px; border-radius: 8px; border: 1px solid var(--border-color);">
            <div>
              <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">👤 Solicitante</span>
              <p style="font-size: 0.95rem; font-weight: 600; color: var(--text-main); margin-top: 2px;">${c.name}</p>
            </div>
            <div>
              <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">📞 WhatsApp / Teléfono</span>
              <p style="font-size: 0.95rem; font-weight: 600; margin-top: 2px;">
                <a href="https://wa.me/${waPhoneClean}" target="_blank" style="color: var(--whatsapp-color); display: inline-flex; align-items: center; gap: 4px;">${c.phone} 💬</a>
                <span style="color: var(--text-muted); font-size: 0.85rem; font-weight: normal; margin-left: 5px;">|</span>
                <a href="tel:+${waPhoneClean}" style="color: var(--accent-color); font-size: 0.85rem; font-weight: normal; margin-left: 5px;">Llamar 📞</a>
              </p>
            </div>
            <div>
              <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">✉️ Correo Electrónico</span>
              <p style="font-size: 0.95rem; font-weight: 600; margin-top: 2px;">
                <a href="mailto:${c.email}?subject=${mailSubject}&body=${mailBody}" style="color: var(--accent-color); text-decoration: underline;">${c.email}</a>
              </p>
            </div>
            <div>
              <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">⚖️ Área de la Consulta</span>
              <p style="font-size: 0.95rem; font-weight: 600; color: var(--text-main); margin-top: 2px;">${c.area}</p>
            </div>
            <div>
              <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">👨‍⚖️ Asesor Designado</span>
              <p style="font-size: 0.95rem; font-weight: 600; color: var(--text-main); margin-top: 2px;">${c.advisor}</p>
            </div>
            <div>
              <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">🚩 Origen de Registro</span>
              <p style="font-size: 0.95rem; font-weight: 600; color: var(--text-main); margin-top: 2px;">${c.origin || "Formulario Directo"}</p>
            </div>
          </div>

          <div style="margin-top: 10px; background: rgba(15,30,54,0.02); padding: 15px; border-radius: 8px; border: 1px solid var(--border-color);">
            <strong style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 5px;">📋 Descripción del Caso</strong>
            <p class="advisor-case-desc" style="font-size: 0.9rem; line-height: 1.5; color: var(--text-main); white-space: pre-line; margin-bottom: 0;">${c.description}</p>
          </div>

          ${filesHtml}
        </div>

        <div class="advisor-case-controls" style="border-top: 1px solid var(--border-color); padding-top: 15px;">
          <div class="form-group" style="margin-bottom: 15px;">
            <label for="status-select-${c.id}" style="font-weight: 700; font-size: 0.85rem;">Estado de la Solicitud</label>
            <select id="status-select-${c.id}" style="padding: 10px; border-radius: 6px;">
              <option value="Recibido" ${c.status === "Recibido" ? "selected" : ""}>Recibido</option>
              <option value="En Revisión" ${c.status === "En Revisión" ? "selected" : ""}>En Revisión</option>
              <option value="En Proceso" ${c.status === "En Proceso" ? "selected" : ""}>En Proceso</option>
              <option value="Resuelto" ${c.status === "Resuelto" ? "selected" : ""}>Resuelto</option>
              <option value="Cerrado" ${c.status === "Cerrado" ? "selected" : ""}>Cerrado</option>
            </select>
          </div>

          <div class="form-group" style="margin-bottom: 15px;">
            <label for="obs-textarea-${c.id}" style="font-weight: 700; font-size: 0.85rem;">Observaciones del Asesor (Visibles al Cliente)</label>
            <textarea id="obs-textarea-${c.id}" rows="4" placeholder="Agrega notas legales, fechas de audiencias o explicaciones que el cliente podrá consultar..." style="padding: 10px; border-radius: 6px; font-size: 0.9rem;">${c.observation || ""}</textarea>
          </div>

          <button class="btn btn-primary btn-save-case" data-case-id="${c.id}" style="width: 100%; font-size: 0.85rem; padding: 12px; border: 1px solid var(--accent-color);">
            💾 Guardar Cambios
          </button>
          
          <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; gap: 10px;">
              <a href="mailto:${c.email}?subject=${mailSubject}&body=${mailBody}" class="btn btn-outline" style="flex: 1; font-size: 0.8rem; padding: 10px; text-align: center; border-color: rgba(217, 119, 6, 0.4); color: var(--text-main); display: inline-flex; align-items: center; justify-content: center;">
                ✉️ Responder Email
              </a>
              <a href="https://wa.me/${waPhoneClean}?text=${encodeURIComponent('Hola ' + c.name + ', te contacto de RM Abogados Consultores sobre tu radicado ' + c.id)}" target="_blank" class="btn btn-outline" style="flex: 1; font-size: 0.8rem; padding: 10px; text-align: center; border-color: rgba(37, 211, 102, 0.4); color: var(--text-main); display: inline-flex; align-items: center; justify-content: center;">
                💬 Chat WhatsApp
              </a>
            </div>
            <button class="btn btn-outline btn-export-pdf" data-case-id="${c.id}" style="width: 100%; font-size: 0.8rem; padding: 10px; text-align: center; border-color: rgba(15, 30, 54, 0.3); color: var(--text-main); display: inline-flex; align-items: center; justify-content: center; gap: 6px;">
              📄 Exportar Ficha PDF / Imprimir
            </button>
          </div>
        </div>
      </div>
    `;

    const saveBtn = card.querySelector(".btn-save-case");
    saveBtn.addEventListener("click", () => {
      const caseId = saveBtn.getAttribute("data-case-id");
      const statusSelect = card.querySelector(`#status-select-${caseId}`);
      const obsTextarea = card.querySelector(`#obs-textarea-${caseId}`);

      const newStatus = statusSelect.value;
      const newObs = obsTextarea.value.trim();

      updateCaseInStorage(caseId, newStatus, newObs);
    });

    const pdfBtn = card.querySelector(".btn-export-pdf");
    pdfBtn.addEventListener("click", () => {
      const caseId = pdfBtn.getAttribute("data-case-id");
      exportCaseToPDF(caseId);
    });

    container.appendChild(card);
  });
}

function updateCaseInStorage(caseId, status, observation) {
  const cases = getCasesFromStorage();
  const caseIndex = cases.findIndex(c => c.id === caseId);

  if (caseIndex !== -1) {
    cases[caseIndex].status = status;
    cases[caseIndex].observation = observation;
    saveCasesToStorage(cases);
    
    showToast(`Radicado ${caseId} actualizado con éxito.`);
    
    const badge = document.getElementById(`badge-${caseId}`);
    if (badge) {
      badge.textContent = status;
      badge.className = "status-badge";
      let statusClass = "status-recibido";
      if (status === "En Revisión") statusClass = "status-revision";
      if (status === "En Proceso") statusClass = "status-proceso";
      if (status === "Resuelto") statusClass = "status-resuelto";
      if (status === "Cerrado") statusClass = "status-cerrado";
      badge.classList.add(statusClass);
    }
  } else {
    showToast("Error: No se pudo encontrar el caso.");
  }
}

// Genera un documento imprimible (PDF) de la ficha de radicado en una ventana nueva
function exportCaseToPDF(caseId) {
  const cases = getCasesFromStorage();
  const c = cases.find(item => item.id === caseId);
  if (!c) {
    showToast("Error: No se encontró el caso para exportar.");
    return;
  }

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    showToast("Error: El navegador bloqueó la ventana emergente. Por favor, habilítalas.");
    return;
  }

  const dateObj = new Date(c.date);
  const formattedDate = dateObj.toLocaleDateString('es-CO', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const printDate = new Date().toLocaleDateString('es-CO', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  // Renderizar la lista de archivos adjuntos
  let filesHtml = "";
  if (c.files && c.files.length > 0) {
    filesHtml = `
      <ul style="list-style-type: none; padding-left: 0; margin-top: 5px;">
        ${c.files.map(f => `<li style="margin-bottom: 5px; font-size: 0.95rem; display: flex; align-items: center; gap: 6px;">📎 ${f}</li>`).join('')}
      </ul>
    `;
  } else {
    filesHtml = `<span style="font-style: italic; color: #64748b;">Ninguno</span>`;
  }

  const observationText = c.observation ? c.observation : "Sin observaciones registradas hasta el momento.";

  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Ficha de Radicación ${c.id}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700;800&display=swap');
    
    body {
      font-family: 'Inter', sans-serif;
      color: #1e293b;
      line-height: 1.5;
      margin: 0;
      padding: 40px;
      background-color: #ffffff;
    }
    
    .print-container {
      max-width: 800px;
      margin: 0 auto;
      border: 1px solid #e2e8f0;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    }
    
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid #0f1e36;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    
    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .logo-box {
      background: linear-gradient(135deg, #0f1e36, #d97706);
      width: 44px;
      height: 44px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 800;
      font-size: 1.2rem;
      font-family: 'Montserrat', sans-serif;
    }
    
    .logo-text {
      font-family: 'Montserrat', sans-serif;
      text-align: left;
    }
    
    .logo-title {
      font-weight: 800;
      font-size: 1.3rem;
      color: #0f1e36;
      line-height: 1;
    }
    
    .logo-subtitle {
      font-size: 0.7rem;
      color: #64748b;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-top: 2px;
    }
    
    .doc-type {
      text-align: right;
    }
    
    .doc-type h2 {
      font-family: 'Montserrat', sans-serif;
      margin: 0;
      font-size: 1rem;
      color: #d97706;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      font-weight: 700;
    }
    
    .doc-type .radicado-id {
      font-family: monospace;
      font-size: 1.35rem;
      font-weight: 800;
      color: #0f1e36;
      margin-top: 5px;
    }
    
    .section-title {
      font-family: 'Montserrat', sans-serif;
      font-size: 1.05rem;
      font-weight: 700;
      color: #0f1e36;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
      margin-top: 25px;
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .grid-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px 30px;
      margin-bottom: 20px;
    }
    
    .info-item {
      display: flex;
      flex-direction: column;
    }
    
    .info-label {
      font-size: 0.75rem;
      color: #64748b;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }
    
    .info-value {
      font-size: 0.95rem;
      font-weight: 500;
    }
    
    .status-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      background-color: #f1f5f9;
      color: #334155;
      width: fit-content;
    }
    
    .status-badge.status-recibido { background-color: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
    .status-badge.status-revision { background-color: #f3e8ff; color: #6b21a8; border: 1px solid #e9d5ff; }
    .status-badge.status-proceso { background-color: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
    .status-badge.status-resuelto { background-color: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .status-badge.status-cerrado { background-color: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; }
    
    .description-box, .observation-box {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 15px;
      font-size: 0.95rem;
      white-space: pre-line;
      line-height: 1.6;
    }
    
    .observation-box {
      border-left: 4px solid #d97706;
      background-color: #fffbeb;
    }
    
    .signatures-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-top: 60px;
      margin-bottom: 40px;
    }
    
    .signature-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
    .signature-line {
      width: 80%;
      border-top: 1px solid #cbd5e1;
      margin-bottom: 8px;
    }
    
    .signature-title {
      font-size: 0.85rem;
      font-weight: 600;
      color: #1e293b;
    }
    
    .signature-subtitle {
      font-size: 0.75rem;
      color: #64748b;
    }
    
    .habeas-data {
      border-top: 1px dashed #cbd5e1;
      padding-top: 15px;
      font-size: 0.7rem;
      color: #64748b;
      text-align: justify;
      line-height: 1.4;
      margin-top: 40px;
    }
    
    .print-footer {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: #94a3b8;
      margin-top: 20px;
      border-top: 1px solid #f1f5f9;
      padding-top: 10px;
    }

    @media print {
      body {
        padding: 0;
        background-color: transparent;
      }
      .print-container {
        border: none;
        padding: 0;
        box-shadow: none;
      }
      .section-title, .grid-info, .description-box, .observation-box, .signatures-section, .habeas-data {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>

  <div class="print-container">
    <header>
      <div class="logo-container">
        <div class="logo-box">RM</div>
        <div class="logo-text">
          <div class="logo-title">RM ABOGADOS</div>
          <div class="logo-subtitle">Consultores</div>
        </div>
      </div>
      <div class="doc-type">
        <h2>Ficha Oficial de Radicación</h2>
        <div class="doc-id-label" style="font-size: 0.7rem; color: #64748b; text-transform: uppercase; font-weight: 600; margin-top: 4px;">Radicado N°</div>
        <div class="radicado-id">${c.id}</div>
      </div>
    </header>

    <div class="section-title">Información del Radicado</div>
    <div class="grid-info">
      <div class="info-item">
        <span class="info-label">Fecha de Registro</span>
        <span class="info-value">${formattedDate}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Estado de la Solicitud</span>
        <span class="info-value">
          <span class="status-badge ${c.status === 'En Revisión' ? 'status-revision' : c.status === 'En Proceso' ? 'status-proceso' : c.status === 'Resuelto' ? 'status-resuelto' : c.status === 'Cerrado' ? 'status-cerrado' : 'status-recibido'}">
            ${c.status}
          </span>
        </span>
      </div>
      <div class="info-item">
        <span class="info-label">Canal de Recepción</span>
        <span class="info-value">${c.method || 'Formulario'}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Origen de Registro</span>
        <span class="info-value">${c.origin || 'Formulario Directo'}</span>
      </div>
    </div>

    <div class="section-title">Datos del Solicitante</div>
    <div class="grid-info">
      <div class="info-item">
        <span class="info-label">Nombre Completo</span>
        <span class="info-value">${c.name}</span>
      </div>
      <div class="info-item">
        <span class="info-label">WhatsApp / Teléfono</span>
        <span class="info-value">${c.phone}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Correo Electrónico</span>
        <span class="info-value">${c.email}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Área Jurídica</span>
        <span class="info-value">${c.area}</span>
      </div>
      <div class="info-item" style="grid-column: span 2;">
        <span class="info-label">Asesor Designado</span>
        <span class="info-value">${c.advisor}</span>
      </div>
    </div>

    <div class="section-title">Descripción del Caso (Hechos)</div>
    <div class="description-box">${c.description}</div>

    <div class="section-title">Documentos Soporte Anexados</div>
    <div style="margin-bottom: 20px;">
      ${filesHtml}
    </div>

    <div class="section-title">Seguimiento y Observaciones del Asesor</div>
    <div class="observation-box">${observationText}</div>

    <div class="signatures-section">
      <div class="signature-card">
        <div style="height: 50px;"></div>
        <div class="signature-line"></div>
        <div class="signature-title">${c.advisor}</div>
        <div class="signature-subtitle">Abogado / Asesor Responsable</div>
      </div>
      <div class="signature-card">
        <div style="height: 50px;"></div>
        <div class="signature-line"></div>
        <div class="signature-title">${c.name}</div>
        <div class="signature-subtitle">Firma del Solicitante</div>
      </div>
    </div>

    <div class="habeas-data">
      <strong>Cláusula Habeas Data:</strong> De conformidad con la Ley 1581 de 2012 de Protección de Datos Personales de la República de Colombia, la firma RM ABOGADOS CONSULTORES informa que la información registrada en esta ficha de radicación se recolecta únicamente con fines de consultoría jurídica, asesoría jurídica, defensa legal y contacto directo. Los datos proporcionados serán tratados bajo estrictas medidas de confidencialidad y secreto profesional. El solicitante puede ejercer sus derechos de acceso, rectificación y supresión de datos escribiendo a nuestros canales de contacto oficiales.
    </div>

    <div class="print-footer">
      <span>RM ABOGADOS CONSULTORES — Rozo Muñoz Abogados Consultores</span>
      <span>Generado el: ${printDate}</span>
    </div>
  </div>

  <script>
    window.onload = function() {
      window.print();
      setTimeout(function() {
        window.close();
      }, 500);
    }
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

    email: "rozomunozabogconsult@gmail.com",
    icon: "💼"
  },
  {
    id: "ximena",
    name: "Ximena Rozo",
    specialty: "Derecho Administrativo",
    phone: "573108109948",
    email: "rm-abogadosconsultores@outlook.com",
    icon: "🏛️"
  }
];

// Configuración por defecto del asesor (si no hay parámetros en la URL)
const defaultAdvisor = {
  name: "RM ABOGADOS CONSULTORES",
  whatsapp: "573053121476",
  email: "rozomunozabogconsult@gmail.com",
  isDefault: true
};

let currentAdvisor = { ...defaultAdvisor };
let activeAdvisorId = "general"; // Asesor seleccionado por defecto
let activeMethod = "email"; // Método de envío seleccionado: email o whatsapp

// Inicialización de la aplicación
document.addEventListener("DOMContentLoaded", () => {
  // 1. Cargar parámetros de la URL para personalizar asesor
  loadAdvisorFromURL();

  // 2. Renderizar los selectores de asesores (Formulario y Popup)
  renderAdvisors();

  // 3. Configurar el menú emergente flotante de WhatsApp
  setupWhatsappPopup();

  // 4. Configurar el Generador de Enlaces
  setupLinkGenerator();

  // 5. Configurar el Toggler de Métodos de Envío (Correo vs WhatsApp)
  setupMethodToggler();

  // 6. Configurar el Formulario de Asesoría (Email y WhatsApp)
  setupAdvisoryForm();

  // 7. Configurar el Asistente de Triaje (Legis-Bot)
  initLegisBot();

  // 8. Configurar Botón de Tema (Claro/Oscuro)
  setupThemeToggle();

  // 9. Configurar Navegación de pestañas (Tabs)
  setupTabs();
  
  // 10. Configurar botón de cerrar modal
  setupSuccessModal();
  
  // 11. Configurar pantalla de bloqueo del panel del asesor
  setupAdvisorLockScreen();

  // 12. Verificar si viene de un envío de correo exitoso
  checkSubmissionStatus();

  // 13. Inicializar base de datos local y configurar consulta y gestión
  initializeDemoCases();
  setupClientSearch();
  setupAdvisorDashboard();
});

// Función para leer parámetros y personalizar la interfaz
function loadAdvisorFromURL() {
  const params = new URLSearchParams(window.location.search);
  const nameParam = params.get('asesor');
  const whatsappParam = params.get('whatsapp');
  const emailParam = params.get('email');

  if (nameParam || whatsappParam || emailParam) {
    currentAdvisor = {
      name: nameParam || "Asesor Jurídico RM",
      whatsapp: whatsappParam ? sanitizePhoneNumber(whatsappParam) : defaultAdvisor.whatsapp,
      email: emailParam || defaultAdvisor.email,
      isDefault: false
    };

    // Mostrar banner de que está conectado con un asesor específico
    const badge = document.getElementById("advisor-badge");
    if (badge) badge.classList.remove("hidden");
  } else {
    // Si es el por defecto, ocultamos el badge de asesor específico
    const badge = document.getElementById("advisor-badge");
    if (badge) badge.classList.add("hidden");
  }
}

// Renderiza visualmente las opciones de asesores en el Formulario y en el WhatsApp Popup
function renderAdvisors() {
  const selectorGrid = document.getElementById("advisor-selector-grid");
  const popupList = document.getElementById("whatsapp-popup-list");
  
  if (!selectorGrid || !popupList) return;
  
  selectorGrid.innerHTML = "";
  popupList.innerHTML = "";
  
  let listToRender = [...specialists];
  
  // Si hay un asesor personalizado cargado por URL, solo se ofrece este
  if (!currentAdvisor.isDefault) {
    listToRender = [{
      id: "custom",
      name: currentAdvisor.name,
      specialty: "Asesor Asignado por URL",
      phone: currentAdvisor.whatsapp,
      email: currentAdvisor.email,
      icon: "🟢"
    }];
    activeAdvisorId = "custom";
  } else {
    // Evitar que quede asignado "custom" si no hay URL parametrizada
    if (activeAdvisorId === "custom") {
      activeAdvisorId = "general";
    }
  }
  
  // 1. Renderizar tarjetas en el Formulario
  listToRender.forEach(adv => {
    const card = document.createElement("div");
    card.className = `advisor-card ${adv.id === activeAdvisorId ? 'active' : ''}`;
    card.setAttribute("data-advisor-id", adv.id);
    card.innerHTML = `
      <div class="advisor-avatar">${adv.icon}</div>
      <div class="advisor-info">
        <h4>${adv.name}</h4>
        <p>${adv.specialty}</p>
      </div>
    `;
    
    // Evento de clic para seleccionar asesor en el formulario
    card.addEventListener("click", () => {
      document.querySelectorAll(".advisor-card").forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      activeAdvisorId = adv.id;
      
      // Actualizar el pie de página aclaratorio si está en modo WhatsApp
      updateHelperText();
    });
    
    selectorGrid.appendChild(card);
    
    // 2. Renderizar enlaces directos en el Popup Flotante
    const item = document.createElement("a");
    item.className = "whatsapp-popup-item";
    item.target = "_blank";
    
    const initMessage = encodeURIComponent(`Hola ${adv.name}, vi la firma de abogados RM Abogados Consultores y requiero asesoría.`);
    item.href = `https://wa.me/${adv.phone}?text=${initMessage}`;
    
    item.innerHTML = `
      <span class="item-icon">${adv.icon}</span>
      <div class="item-details">
        <strong>${adv.name}</strong>
        <span>${adv.specialty}</span>
      </div>
    `;
    
    popupList.appendChild(item);
  });

  // Mostrar el nombre en el badge superior
  const badgeName = document.getElementById("advisor-badge-name");
  if (badgeName) {
    badgeName.textContent = currentAdvisor.name;
  }

  updateHelperText();
}

// Actualiza los textos de ayuda del pie de formulario dinámicamente
function updateHelperText() {
  const helperText = document.getElementById("form-helper-text");
  if (!helperText) return;

  if (activeMethod === "email") {
    helperText.innerHTML = `Se redactará un correo formal con tus archivos adjuntos dirigido a las bandejas autorizadas de nuestra firma.`;
  } else {
    let selectedAdv;
    if (!currentAdvisor.isDefault) {
      selectedAdv = { name: currentAdvisor.name };
    } else {
      selectedAdv = specialists.find(a => a.id === activeAdvisorId) || specialists[0];
    }
    helperText.innerHTML = `Se abrirá un chat directo de WhatsApp dirigido a <strong>${selectedAdv.name}</strong> para iniciar tu conversación.`;
  }
}

// Configura el comportamiento de apertura/cierre del menú de WhatsApp flotante
function setupWhatsappPopup() {
  const btn = document.getElementById("floating-whatsapp-btn");
  const popup = document.getElementById("whatsapp-popup");
  
  if (!btn || !popup) return;
  
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    popup.classList.toggle("hidden");
  });
  
  document.addEventListener("click", (e) => {
    if (!popup.classList.contains("hidden") && !popup.contains(e.target) && e.target !== btn) {
      popup.classList.add("hidden");
    }
  });
}

// Configura el alternador entre Correo y WhatsApp
function setupMethodToggler() {
  const emailBtn = document.getElementById("method-email-btn");
  const whatsappBtn = document.getElementById("method-whatsapp-btn");
  const attachmentGroup = document.getElementById("attachment-group");
  const submitEmailBtn = document.getElementById("submit-email-btn");
  const submitWhatsappBtn = document.getElementById("submit-whatsapp-btn");

  if (!emailBtn || !whatsappBtn) return;

  emailBtn.addEventListener("click", () => {
    activeMethod = "email";
    emailBtn.classList.add("active");
    whatsappBtn.classList.remove("active");
    
    attachmentGroup.classList.remove("hidden");
    submitEmailBtn.classList.remove("hidden");
    submitWhatsappBtn.classList.add("hidden");

    const clientEmail = document.getElementById("client-email");
    if (clientEmail) {
      clientEmail.required = true;
      const emailLabel = document.querySelector("label[for='client-email']");
      if (emailLabel) emailLabel.innerHTML = 'Correo Electrónico <span style="color: #ef4444;">*</span>';
    }

    updateHelperText();
  });

  whatsappBtn.addEventListener("click", () => {
    activeMethod = "whatsapp";
    whatsappBtn.classList.add("active");
    emailBtn.classList.remove("active");
    
    attachmentGroup.classList.add("hidden");
    submitWhatsappBtn.classList.remove("hidden");
    submitEmailBtn.classList.add("hidden");

    const clientEmail = document.getElementById("client-email");
    if (clientEmail) {
      clientEmail.required = false;
      const emailLabel = document.querySelector("label[for='client-email']");
      if (emailLabel) emailLabel.innerHTML = 'Correo Electrónico <span style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted);">(Opcional)</span>';
    }

    updateHelperText();
  });
}

// Limpia el número telefónico para WhatsApp
function sanitizePhoneNumber(phone) {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    cleaned = '57' + cleaned;
  }
  return cleaned;
}

// Configura la navegación entre secciones (SPA)
function setupTabs() {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".tab-content");

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      const targetId = link.getAttribute("data-target");
      
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      sections.forEach(section => {
        if (section.id === targetId) {
          section.classList.remove("hidden");
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          section.classList.add("hidden");
        }
      });
    });
  });
}

// Configura el generador de links para asesores
function setupLinkGenerator() {
  const form = document.getElementById("link-generator-form");
  const nameInput = document.getElementById("gen-name");
  const phoneInput = document.getElementById("gen-phone");
  const emailInput = document.getElementById("gen-email");
  const resultBox = document.getElementById("link-result-box");
  const resultLink = document.getElementById("generated-link");
  const copyBtn = document.getElementById("copy-link-btn");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = encodeURIComponent(nameInput.value.trim());
    const prefix = document.getElementById("gen-phone-prefix") ? document.getElementById("gen-phone-prefix").value : "57";
    const rawPhone = phoneInput.value.trim();
    const cleanDigits = rawPhone.replace(/\D/g, '');
    const phone = encodeURIComponent(prefix + cleanDigits);
    const email = encodeURIComponent(emailInput.value.trim());

    const baseUri = window.location.href.split('?')[0];
    const shareableUrl = `${baseUri}?asesor=${name}&whatsapp=${phone}&email=${email}`;

    resultLink.textContent = shareableUrl;
    resultBox.classList.remove("hidden");

    copyToClipboard(shareableUrl);
  });

  copyBtn.addEventListener("click", () => {
    copyToClipboard(resultLink.textContent);
  });
}

// Copiar al portapapeles con fallback para entornos locales (file://)
function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast("¡Enlace copiado al portapapeles!");
    }).catch(err => {
      fallbackCopyToClipboard(text);
    });
  } else {
    fallbackCopyToClipboard(text);
  }
}

function fallbackCopyToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showToast("¡Enlace copiado al portapapeles!");
    } else {
      showToast("Selecciona el enlace manualmente.");
    }
  } catch (err) {
    showToast("Selecciona el enlace manualmente.");
  }
  document.body.removeChild(textArea);
}

// Mostrar Toast de notificación
function showToast(message) {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");
  
  if (!toast) return;

  toastMessage.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}

// Configura el formulario de radicación/solicitud
function setupAdvisoryForm() {
  const form = document.getElementById("advisory-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const clientName = document.getElementById("client-name").value.trim();
    const clientPhonePrefix = document.getElementById("client-phone-prefix") ? document.getElementById("client-phone-prefix").value : "57";
    const clientPhoneRaw = document.getElementById("client-phone").value.trim();
    const clientEmail = document.getElementById("client-email") ? document.getElementById("client-email").value.trim() : "";
    const area = document.getElementById("client-area").value;
    const description = document.getElementById("client-desc").value.trim();

    // Generar un número de radicado único (RM-AAAAMMDD-XXXX)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const radicadoId = `RM-${year}${month}${day}-${randomCode}`;

    // 1. Validaciones y Filtros Anti-Spam / Calidad de Casos
    if (clientName.length < 3) {
      showToast("Por favor, ingresa tu nombre completo (mínimo 3 letras).");
      return;
    }

    const cleanPhone = clientPhoneRaw.replace(/\D/g, '');
    if (clientPhonePrefix === "57") {
      if (cleanPhone.length !== 10 || !cleanPhone.startsWith('3')) {
        showToast("Por favor, ingresa un celular colombiano de 10 dígitos (que empiece con 3).");
        return;
      }
    } else {
      if (cleanPhone.length < 7 || cleanPhone.length > 15) {
        showToast("Por favor, ingresa un número de teléfono celular válido.");
        return;
      }
    }

    if (description.length < 30) {
      showToast("Por favor, detalla más tu caso (mínimo 30 caracteres) para darte una respuesta adecuada.");
      return;
    }

    // Combinar indicativo y número limpio para uso posterior
    const clientPhoneFormatted = `+${clientPhonePrefix} ${cleanPhone}`;

    // Obtener datos del asesor seleccionado
    let selectedAdv;
    if (!currentAdvisor.isDefault) {
      selectedAdv = {
        name: currentAdvisor.name,
        phone: currentAdvisor.whatsapp,
        email: currentAdvisor.email
      };
    } else {
      selectedAdv = specialists.find(a => a.id === activeAdvisorId) || specialists[0];
    }

    if (activeMethod === "email") {
      // --- MÉTODO PRINCIPAL: ENVÍO POR FORMULARIO TRADICIONAL DE FORMSUBMIT (EVITA BLOQUEOS CORS EN file://) ---
      
      // Control de Cola / Cooldown (DESACTIVADO PARA PRUEBAS - Cambiar a true para producción)
      const ENABLE_COOLDOWN = false;
      const COOLDOWN_MS = 10 * 60 * 1000; // 10 minutos de espera
      const lastSubTime = localStorage.getItem("last_submission_time");
      if (ENABLE_COOLDOWN && lastSubTime) {
        const elapsed = Date.now() - parseInt(lastSubTime, 10);
        if (elapsed < COOLDOWN_MS) {
          const remainingMins = Math.ceil((COOLDOWN_MS - elapsed) / 60000);
          showToast(`Límite de envíos: Espera ${remainingMins} minuto(s) antes de enviar otro caso por correo, o usa "WhatsApp Directo".`);
          return;
        }
      }

      const primaryEmail = selectedAdv.email || "rozomunozabogconsult@gmail.com";
      let ccEmail = "rm-abogadosconsultores@outlook.com";
      
      if (primaryEmail === "rm-abogadosconsultores@outlook.com") {
        ccEmail = "rozomunozabogconsult@gmail.com";
      } else if (primaryEmail !== "rozomunozabogconsult@gmail.com") {
        ccEmail = "rozomunozabogconsult@gmail.com, rm-abogadosconsultores@outlook.com";
      }

      form.action = `https://formsubmit.co/${primaryEmail}`;
      form.method = "POST";
      form.enctype = "multipart/form-data";

      // Enviar con asunto personalizado y ordenado (incluyendo número de radicado)
      let subjectInput = document.getElementById("form-subject-input");
      if (!subjectInput) {
        subjectInput = document.createElement("input");
        subjectInput.type = "hidden";
        subjectInput.name = "_subject";
        subjectInput.id = "form-subject-input";
        form.appendChild(subjectInput);
      }
      subjectInput.value = `[${radicadoId}] Nueva Radicación: ${area} - ${clientName}`;

      // Configurar copia de correo a la segunda bandeja (outlook)
      let ccInput = document.getElementById("form-cc-input");
      if (!ccInput) {
        ccInput = document.createElement("input");
        ccInput.type = "hidden";
        ccInput.name = "_cc";
        ccInput.id = "form-cc-input";
        form.appendChild(ccInput);
      }
      ccInput.value = ccEmail;

      // Asesor que recibe la consulta
      let advisorInput = document.getElementById("form-advisor-input");
      if (!advisorInput) {
        advisorInput = document.createElement("input");
        advisorInput.type = "hidden";
        advisorInput.name = "Asesor Asignado";
        advisorInput.id = "form-advisor-input";
        form.appendChild(advisorInput);
      }
      advisorInput.value = selectedAdv.name;

      // Configurar presentación premium del correo en FormSubmit (plantilla tipo box)
      let templateInput = document.getElementById("form-template-input");
      if (!templateInput) {
        templateInput = document.createElement("input");
        templateInput.type = "hidden";
        templateInput.name = "_template";
        templateInput.id = "form-template-input";
        form.appendChild(templateInput);
      }
      templateInput.value = "box";

      // Activar recaptcha (Requerido obligatoriamente por FormSubmit para poder enviar el correo de confirmación/autoresponder)
      let captchaInput = document.getElementById("form-captcha-input");
      if (!captchaInput) {
        captchaInput = document.createElement("input");
        captchaInput.type = "hidden";
        captchaInput.name = "_captcha";
        captchaInput.id = "form-captcha-input";
        form.appendChild(captchaInput);
      }
      captchaInput.value = "true";

      let nextInput = document.getElementById("form-next-input");
      if (!nextInput) {
        nextInput = document.createElement("input");
        nextInput.type = "hidden";
        nextInput.name = "_next";
        nextInput.id = "form-next-input";
        form.appendChild(nextInput);
      }
      // Redirigir de regreso a la página local con un parámetro success=true
      const redirectUrl = window.location.href.split('?')[0] + "?success=true";
      nextInput.value = redirectUrl;

      const fileInput = document.getElementById("client-files");
      const filesCount = fileInput && fileInput.files ? fileInput.files.length : 0;

      // Configurar Autoresponder (Correo de confirmación al cliente)
      let autoresponseInput = document.getElementById("form-autoresponse-input");
      if (!autoresponseInput) {
        autoresponseInput = document.createElement("input");
        autoresponseInput.type = "hidden";
        autoresponseInput.name = "_autoresponse";
        autoresponseInput.id = "form-autoresponse-input";
        form.appendChild(autoresponseInput);
      }
      autoresponseInput.value = `Estimado(a) cliente,

Su solicitud de asesoría jurídica en RM ABOGADOS CONSULTORES ha sido registrada con éxito en nuestro sistema.

Para el control, orden y seguimiento de su caso, se le ha asignado el siguiente identificador único:
👉 NÚMERO DE RADICADO: ${radicadoId}

Un especialista de nuestro equipo revisará su caso y se comunicará con usted a través de nuestros canales autorizados durante el horario laboral.

Recuerde que las asesorías jurídicas y radicaciones tienen un costo comercial, el cual se cotizará de manera interna y personalizada de acuerdo a la complejidad de su caso antes de iniciar cualquier trámite formal.

Por favor, conserve este número de radicado para cualquier consulta de seguimiento.

Atentamente,
RM ABOGADOS CONSULTORES
Rozo Muñoz Abogados Consultores
Contacto: +57 305 312 1476`;

      // Agregar el número de radicado como un campo visible en el correo
      let radicadoInput = document.getElementById("form-radicado-input");
      if (!radicadoInput) {
        radicadoInput = document.createElement("input");
        radicadoInput.type = "hidden";
        radicadoInput.name = "Número de Radicado";
        radicadoInput.id = "form-radicado-input";
        form.appendChild(radicadoInput);
      }
      radicadoInput.value = radicadoId;

      // Obtener nombres de archivos adjuntos
      const fileNames = [];
      if (fileInput && fileInput.files) {
        for (let i = 0; i < fileInput.files.length; i++) {
          fileNames.push(fileInput.files[i].name);
        }
      }

      const legisbotPath = sessionStorage.getItem("legisbot_path") || null;
      sessionStorage.removeItem("legisbot_path"); // Limpiar después de usar

      // Guardar en la base de datos local
      const newCase = {
        id: radicadoId,
        date: new Date().toISOString(),
        name: clientName,
        phone: clientPhoneFormatted,
        email: clientEmail,
        area: area,
        description: description,
        advisor: selectedAdv.name,
        status: "Recibido",
        observation: "",
        method: "Correo",
        files: fileNames,
        origin: legisbotPath ? `LegisBot (${legisbotPath})` : "Formulario Directo"
      };
      registerNewCase(newCase);

      // Guardar información en sessionStorage para mostrarla en el modal tras la redirección
      sessionStorage.setItem("last_submission_files_count", filesCount);
      sessionStorage.setItem("last_submission_success", "true");
      sessionStorage.setItem("last_submission_primary_email", primaryEmail);
      sessionStorage.setItem("last_submission_cc_email", ccEmail);
      sessionStorage.setItem("last_submission_radicado", radicadoId);

      // Registrar marca de tiempo del envío en localStorage
      localStorage.setItem("last_submission_time", Date.now().toString());

      // Enviar el formulario de manera nativa para asegurar la entrega
      form.submit();
    } else {
      // --- MÉTODO AUXILIAR: ENVÍO POR WHATSAPP ---
      let emailText = "";
      if (clientEmail) {
        emailText = `*Correo:* ${clientEmail}\n`;
      }

      const legisbotPath = sessionStorage.getItem("legisbot_path") || null;
      sessionStorage.removeItem("legisbot_path"); // Limpiar después de usar

      // Guardar en la base de datos local
      const newCase = {
        id: radicadoId,
        date: new Date().toISOString(),
        name: clientName,
        phone: clientPhoneFormatted,
        email: clientEmail || "No registrado (WhatsApp)",
        area: area,
        description: description,
        advisor: selectedAdv.name,
        status: "Recibido",
        observation: "",
        method: "WhatsApp",
        files: [],
        origin: legisbotPath ? `LegisBot (${legisbotPath})` : "Formulario Directo"
      };
      registerNewCase(newCase);

      const message = `*Nueva Solicitud de Asesoría - RM ABOGADOS* 🇨🇴\n\n` +
                      `*Radicado:* ${radicadoId}\n` +
                      `*Nombre:* ${clientName}\n` +
                      `*WhatsApp:* ${clientPhoneFormatted}\n` +
                      emailText +
                      `*Área de Interés:* ${area}\n` +
                      `*Asesor Requerido:* ${selectedAdv.name}\n` +
                      `*Descripción del Caso:* ${description}\n\n` +
                      `_Enviado desde la firma de abogados RM Abogados Consultores_`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${selectedAdv.phone}?text=${encodedMessage}`;

      window.open(whatsappUrl, '_blank');
      showToast("¡Solicitud registrada con radicado: " + radicadoId + "! Redirigiendo a WhatsApp...");
    }
  });
}

// Configura el cierre del modal de éxito
function setupSuccessModal() {
  const modal = document.getElementById("success-modal");
  const closeBtn = document.getElementById("close-modal-btn");
  const form = document.getElementById("advisory-form");

  if (!modal || !closeBtn) return;

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    // Resetear formulario
    if (form) form.reset();
  });
}

// Configura el botón para alternar entre modo claro y oscuro
function setupThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle");
  if (!toggleBtn) return;

  const icon = toggleBtn.querySelector("span");

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-theme");
    icon.textContent = "☀️";
  }

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    const isDark = document.body.classList.contains("dark-theme");
    
    icon.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

// --- Lógica del LegisBot (Triaje Interactivo) ---
const botState = {
  step: 'start',
  selectedArea: '',
  selectedSub: ''
};

function initLegisBot() {
  const messagesContainer = document.getElementById("chat-messages");
  if (!messagesContainer) return;

  messagesContainer.innerHTML = "";
  botState.step = 'start';
  
  addBotMessage("¡Hola! Soy ⚖️ <b>LegisBot</b>, tu asistente virtual de RM ABOGADOS CONSULTORES.");
  setTimeout(() => {
    addBotMessage("¿Cuál es el área sobre la que requieres orientación legal hoy?");
    showOptions([
      { text: "💼 Trabajo o Empleo (Laboral)", value: "laboral" },
      { text: "🏛️ Reclamaciones al Estado (Administrativo)", value: "administrativo" },
      { text: "🏠 Familia o Hijos (Familia)", value: "familia" },
      { text: "📄 Arriendos o Deudas (Civil)", value: "civil" },
      { text: "🛡️ Derechos Fundamentales (Tutela/Petición)", value: "tutela" }
    ]);
  }, 800);
}

function handleOptionSelection(value, text) {
  addUserMessage(text);
  
  if (botState.step === 'start') {
    botState.selectedArea = value;
    botState.step = 'sub_category';
    
    setTimeout(() => {
      if (value === 'laboral') {
        addBotMessage("Entendido, Derecho Laboral. ¿Cuál de estos casos describe tu situación?");
        showOptions([
          { text: "Me despidieron sin justa causa", value: "despido" },
          { text: "No me han pagado mi liquidación o salario", value: "liquidacion" },
          { text: "Tengo dudas sobre mi contrato laboral", value: "contrato" }
        ]);
      } else if (value === 'administrativo') {
        addBotMessage("Entendido, Derecho Administrativo. Esta área regula tus relaciones con entidades del Estado. ¿Cuál es tu caso?");
        showOptions([
          { text: "Tengo un conflicto con un Contrato Estatal", value: "licitacion" },
          { text: "Quiero impugnar una Multa o Sanción de la administración", value: "sancion" },
          { text: "Una entidad pública no responde (Silencio Adm.)", value: "silencio" }
        ]);
      } else if (value === 'familia') {
        addBotMessage("Entendido, Derecho de Familia. ¿Cuál es tu consulta?");
        showOptions([
          { text: "Fijación o cobro de Cuota Alimentaria", value: "alimentos" },
          { text: "Custodia o visitas de menores", value: "custodia" },
          { text: "Divorcio o liquidación conyugal", value: "divorcio" }
        ]);
      } else if (value === 'civil') {
        addBotMessage("Derecho Civil y contratos entre particulares. ¿Cuál es tu caso?");
        showOptions([
          { text: "Tengo problemas con un arrendamiento", value: "arriendo" },
          { text: "Tengo deudas acumuladas o cobranzas bancarias", value: "deuda" },
          { text: "Defectos en compras o garantías (Consumidor)", value: "compraventa" }
        ]);
      } else if (value === 'tutela') {
        addBotMessage("Derechos Fundamentales. ¿Cuál es tu situación?");
        showOptions([
          { text: "Problemas de Salud (Negativa de EPS)", value: "salud" },
          { text: "Necesito radicar un Derecho de Petición formal", value: "peticion" },
          { text: "Violación al debido proceso u otro derecho", value: "vulneracion" }
        ]);
      }
    }, 600);
  } else if (botState.step === 'sub_category') {
    botState.selectedSub = value;
    botState.step = 'recommendation';
    
    setTimeout(() => {
      let recommendation = "";
      let areaFormValue = "";
      let recommendedSpecialist = "";
      
      if (botState.selectedArea === 'laboral') {
        areaFormValue = "Laboral";
        recommendedSpecialist = "<b>Carlos Muñoz</b> (Especialista en Derecho Laboral)";
        if (value === 'despido') {
          recommendation = "<b>Recomendación según Ley:</b> El <i>Artículo 64 del CST</i> regula la indemnización por despido sin justa causa. Tienes derecho a un pago calculado según tu antigüedad y salario. Te aconsejamos estructurar formalmente el caso.";
        } else if (value === 'liquidacion') {
          recommendation = "<b>Recomendación según Ley:</b> El empleador debe cancelar las prestaciones sociales tan pronto termine el contrato. La demora genera sanción moratoria equivalente a un día de salario por día de retraso (<i>Artículo 65 del CST</i>).";
        } else {
          recommendation = "<b>Recomendación según Ley:</b> Si hay subordinación, cumplimiento de horario y pago, rige el <i>Principio de Primacía de la Realidad</i>. Tienes derecho a que se reconozca un contrato de trabajo real con prestaciones.";
        }
      } else if (botState.selectedArea === 'administrativo') {
        areaFormValue = "Administrativo";
        recommendedSpecialist = "<b>Ximena Rozo</b> (Especialista en Derecho Administrativo)";
        if (value === 'licitacion') {
          recommendation = "<b>Recomendación según Ley:</b> La contratación con el Estado está regida por la <i>Ley 80 de 1993</i>. Para reclamar desequilibrios económicos o incumplimientos del Estado se debe radicar una reclamación formal antes de ir a juicio.";
        } else if (value === 'sancion') {
          recommendation = "<b>Recomendación según Ley:</b> Las sanciones y comparendos de entidades del Estado se rigen por el <i>CPACA</i>. Existen plazos estrictos para interponer recursos de reposición y apelación antes de agotar la vía administrativa.";
        } else {
          recommendation = "<b>Recomendación según Ley:</b> Si la administración pública no responde tus solicitudes en los términos de la <i>Ley 1755 de 2015</i>, se configura el silencio administrativo y la vulneración del derecho constitucional de petición.";
        }
      } else if (botState.selectedArea === 'familia') {
        areaFormValue = "Familia";
        recommendedSpecialist = "nuestros asesores generales de la oficina";
        if (value === 'alimentos') {
          recommendation = "<b>Recomendación según Ley:</b> Los alimentos para menores se regulan por el <i>Código de Infancia y Adolescencia</i>. Para cobrarlos por vía ejecutiva o fijarlos se debe citar obligatoriamente a conciliación ante el ICBF o Comisaría.";
        } else if (value === 'custodia') {
          recommendation = "<b>Recomendación según Ley:</b> La custodia y visitas se rigen por el <i>interés superior del menor</i>. Te sugerimos tramitar una solicitud de conciliación en el ICBF para definir el régimen de visitas de forma legal y ordenada.";
        } else {
          recommendation = "<b>Recomendación según Ley:</b> El divorcio de común acuerdo se tramita rápidamente ante Notaría. Si hay oposición de una parte, se debe radicar demanda judicial ante el Juez de Familia sustentando las causales legales.";
        }
      } else if (botState.selectedArea === 'civil') {
        areaFormValue = "Civil";
        recommendedSpecialist = "nuestros asesores generales de la oficina";
        if (value === 'arriendo') {
          recommendation = "<b>Recomendación según Ley:</b> Los arrendamientos se rigen por la <i>Ley 820 de 2003</i>. Si el inquilino incumple el pago, se debe notificar formalmente el inicio del proceso de restitución del inmueble.";
        } else if (value === 'deuda') {
          recommendation = "<b>Recomendación según Ley:</b> La ley de insolvencia de persona natural no comerciante te permite renegociar tu pasivo de forma voluntaria en centros de conciliación, deteniendo procesos ejecutivos y embargos.";
        } else {
          recommendation = "<b>Recomendación según Ley:</b> El Estatuto del Consumidor (<i>Ley 1480 de 2011</i>) te faculta a exigir la garantía legal de bienes defectuosos directamente ante la Superintendencia de Industria y Comercio.";
        }
      } else if (botState.selectedArea === 'tutela') {
        areaFormValue = "Tutela / Peticion";
        recommendedSpecialist = "nuestros asesores generales de la oficina";
        if (value === 'salud') {
          recommendation = "<b>Recomendación según Ley:</b> El acceso a la salud es conexo con la vida. Ante la negativa de la EPS a autorizar procedimientos o medicamentos, la <i>Acción de Tutela (Art. 86)</i> obliga a responder en un plazo de 10 días.";
        } else if (value === 'peticion') {
          recommendation = "<b>Recomendación según Ley:</b> El <i>Artículo 23 de la Constitución</i> ampara el Derecho de Petición. Las entidades públicas y privadas cuentan con 15 días hábiles para responder, so pena de incurrir en desacato constitucional.";
        } else {
          recommendation = "<b>Recomendación según Ley:</b> La Acción de Tutela procede cuando se vulneren de forma directa derechos fundamentales consagrados en la Constitución y no existan mecanismos alternativos eficaces.";
        }
      }

      addBotMessage(recommendation);
      
      setTimeout(() => {
        addBotMessage(`Para radicar formalmente tu caso adjuntando tus documentos soporte a las bandejas autorizadas, te sugiero radicar por correo electrónico. ¿Deseas ir al formulario de radicación principal?`);
        showOptions([
          { text: "Sí, ir a Radicar Caso", value: "conectar", action: () => selectAdvisoryTab(areaFormValue, text) },
          { text: "Reiniciar consulta", value: "reiniciar", action: () => initLegisBot() }
        ]);
      }, 1000);

    }, 600);
  }
}

// Redirecciona a la pestaña del formulario de asesoría y pre-rellena los datos
function selectAdvisoryTab(area, details) {
  // Guardar en sessionStorage la procedencia del LegisBot
  sessionStorage.setItem("legisbot_path", details);

  const formTabLink = document.querySelector(".nav-link[data-target='solicitud']");
  if (formTabLink) {
    formTabLink.click();
  }

  const areaSelect = document.getElementById("client-area");
  if (areaSelect) {
    if (area.includes("Laboral")) {
      areaSelect.value = "Laboral";
      activeAdvisorId = "carlos"; // Carlos Muñoz
    } else if (area.includes("Administrativo")) {
      areaSelect.value = "Administrativo";
      activeAdvisorId = "ximena"; // Ximena Rozo
    } else if (area.includes("Familia")) {
      areaSelect.value = "Familia";
      activeAdvisorId = "general"; // Oficina General
    } else if (area.includes("Civil")) {
      areaSelect.value = "Civil";
      activeAdvisorId = "general"; // Oficina General
    } else {
      areaSelect.value = "Otro / Consulta general";
      activeAdvisorId = "general"; // Oficina General
    }
  }

  // Activar por defecto el método de Correo (Principal) al venir del triaje
  const emailBtn = document.getElementById("method-email-btn");
  if (emailBtn) {
    emailBtn.click();
  }

  // Re-renderizar tarjetas para reflejar el especialista pre-seleccionado
  renderAdvisors();

  const descTextArea = document.getElementById("client-desc");
  if (descTextArea) {
    descTextArea.value = `Caso orientado mediante triaje virtual.\nTema: ${details}\n\nDetalla los hechos de tu situación legal aquí...`;
    descTextArea.focus();
  }
}

// Funciones auxiliares para el Chat
function addBotMessage(htmlContent) {
  const container = document.getElementById("chat-messages");
  if (!container) return;
  const msg = document.createElement("div");
  msg.className = "message bot";
  msg.innerHTML = htmlContent;
  container.appendChild(msg);
  scrollToBottom(container);
}

function addUserMessage(textContent) {
  const container = document.getElementById("chat-messages");
  if (!container) return;
  const msg = document.createElement("div");
  msg.className = "message user";
  msg.textContent = textContent;
  container.appendChild(msg);
  scrollToBottom(container);
}

function showOptions(options) {
  const optionsContainer = document.getElementById("chat-options");
  if (!optionsContainer) return;
  optionsContainer.innerHTML = "";
  
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt.text;
    btn.addEventListener("click", () => {
      if (opt.action) {
        opt.action();
      } else {
        handleOptionSelection(opt.value, opt.text);
      }
    });
    optionsContainer.appendChild(btn);
  });
}

function scrollToBottom(element) {
  element.scrollTop = element.scrollHeight;
}

// Pantalla de bloqueo del Panel del Asesor (Código de acceso por defecto: 1034516761)
const ADVISOR_PASSCODE = "1034516761";

function setupAdvisorLockScreen() {
  const unlockBtn = document.getElementById("unlock-panel-btn");
  const passcodeInput = document.getElementById("advisor-passcode");
  const lockScreen = document.getElementById("advisor-lock-screen");
  const formContainer = document.getElementById("advisor-panel-form-container");
  const errorMsg = document.getElementById("lock-error-msg");

  if (!unlockBtn) return;

  // Verificar si ya inició sesión en esta sesión del navegador
  if (sessionStorage.getItem("advisor_logged_in") === "true") {
    if (lockScreen) lockScreen.classList.add("hidden");
    if (formContainer) formContainer.classList.remove("hidden");
  }

  unlockBtn.addEventListener("click", () => {
    const inputCode = passcodeInput.value.trim();
    if (inputCode === ADVISOR_PASSCODE) {
      if (lockScreen) lockScreen.classList.add("hidden");
      if (formContainer) formContainer.classList.remove("hidden");
      if (errorMsg) errorMsg.classList.add("hidden");
      sessionStorage.setItem("advisor_logged_in", "true");
    } else {
      if (errorMsg) errorMsg.classList.remove("hidden");
      passcodeInput.value = "";
      passcodeInput.focus();
    }
  });

  // Permitir presionar Enter para desbloquear
  passcodeInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      unlockBtn.click();
    }
  });
}

// Verifica si venimos de una redirección de FormSubmit exitosa y muestra el modal
function checkSubmissionStatus() {
  const params = new URLSearchParams(window.location.search);
  const successParam = params.get('success');
  const sessionSuccess = sessionStorage.getItem("last_submission_success");

  if (successParam === 'true' || sessionSuccess === "true") {
    const modal = document.getElementById("success-modal");
    if (modal) {
      modal.classList.remove("hidden");
      
      // Actualizar destinatarios y número de radicado en el modal
      const primaryMail = sessionStorage.getItem("last_submission_primary_email") || "rozomunozabogconsult@gmail.com";
      const ccMail = sessionStorage.getItem("last_submission_cc_email") || "rm-abogadosconsultores@outlook.com";
      const radicado = sessionStorage.getItem("last_submission_radicado") || "RM-ASIGNANDO...";
      const modalDetails = modal.querySelector(".modal-details");
      
      if (modalDetails) {
        modalDetails.innerHTML = `
          <div style="text-align: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid var(--border-color);">
            <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Número de Radicado</span>
            <div style="font-size: 1.25rem; font-weight: 800; color: var(--accent-color); margin-top: 4px; font-family: monospace;">${radicado}</div>
          </div>
          <p><strong>Firma de Abogados:</strong> RM ABOGADOS CONSULTORES</p>
          <p><strong>Canal de Recepción:</strong> Sistema de Radicación Formal (Correo Electrónico)</p>
          <p id="modal-anexos-text" style="border-top: 1px solid var(--border-color); padding-top: 8px;"><strong>Archivos adjuntos:</strong> Ninguno</p>
        `;
      }

      // Actualizar texto de anexos si es posible
      const filesCount = sessionStorage.getItem("last_submission_files_count");
      const anexosText = document.getElementById("modal-anexos-text");
      if (anexosText && filesCount !== null) {
        const count = parseInt(filesCount, 10);
        if (count > 0) {
          anexosText.innerHTML = `<strong>Archivos adjuntos:</strong> ${count} archivo(s) cargado(s)`;
        } else {
          anexosText.innerHTML = `<strong>Archivos adjuntos:</strong> Ninguno`;
        }
      }
    }
    
    // Limpiar sessionStorage
    sessionStorage.removeItem("last_submission_success");
    sessionStorage.removeItem("last_submission_files_count");
    sessionStorage.removeItem("last_submission_primary_email");
    sessionStorage.removeItem("last_submission_cc_email");
    sessionStorage.removeItem("last_submission_radicado");
    
    // Limpiar el parámetro de la URL sin recargar la página
    if (window.history.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.delete('success');
      window.history.replaceState({ path: url.href }, '', url.href);
    }
  }
}

// ==========================================
// SISTEMA DE BASE DE DATOS LOCAL Y SEGUIMIENTO
// ==========================================

function getCasesFromStorage() {
  const cases = localStorage.getItem("rm_abogados_cases");
  return cases ? JSON.parse(cases) : [];
}

function saveCasesToStorage(cases) {
  localStorage.setItem("rm_abogados_cases", JSON.stringify(cases));
}

function registerNewCase(c) {
  const cases = getCasesFromStorage();
  cases.push(c);
  saveCasesToStorage(cases);
}

function initializeDemoCases() {
  const cases = getCasesFromStorage();
  if (cases.length === 0) {
    const demoCases = [
      {
        id: "RM-20260608-8646",
        date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // hace 2 horas
        name: "Miguel Angel",
        phone: "+57 3143211200",
        email: "miguelangelrei12@gmail.com",
        area: "Laboral",
        description: "Requiero apoyo con el cálculo de mi liquidación por despido sin justa causa tras trabajar 3 años.",
        advisor: "Carlos Muñoz",
        status: "En Proceso",
        observation: "Se programó llamada para el martes 9 de junio a las 10:00 AM para validar soportes.",
        method: "Correo",
        files: ["contrato_trabajo.pdf", "comprobantes_pago.zip"],
        origin: "LegisBot (Despido sin justa causa)"
      },
      {
        id: "RM-20260607-1234",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1.5).toISOString(), // hace día y medio
        name: "Adriana María Gómez",
        phone: "+57 3009876543",
        email: "adriana.gomez@gmail.com",
        area: "Administrativo",
        description: "Vulneración al debido proceso por una multa de tránsito impuesta sin debida notificación en la autopista norte.",
        advisor: "Ximena Rozo",
        status: "Recibido",
        observation: "",
        method: "Correo",
        files: ["fotomulta_comparendo.png"],
        origin: "Formulario Directo"
      },
      {
        id: "RM-20260605-4321",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3.5).toISOString(), // hace 3 días y medio
        name: "Jorge Iván Restrepo",
        phone: "+57 3112223344",
        email: "jorge.restrepo@outlook.com",
        area: "Civil",
        description: "Contrato de arrendamiento de local comercial que venció hace 1 mes. El inquilino no ha pagado el último canon y se niega a entregar el inmueble.",
        advisor: "RM Abogados (Consulta General)",
        status: "En Revisión",
        observation: "Revisando el contrato de arrendamiento y las cláusulas de restitución voluntaria.",
        method: "WhatsApp",
        files: [],
        origin: "Formulario Directo"
      }
    ];
    saveCasesToStorage(demoCases);
  }
}

function setupClientSearch() {
  const searchBtn = document.getElementById("search-radicado-btn");
  const radicadoInput = document.getElementById("search-radicado-input");
  const verifyInput = document.getElementById("search-verify-input");
  const resultContainer = document.getElementById("search-result-container");

  if (!searchBtn) return;

  searchBtn.addEventListener("click", () => {
    const radicado = radicadoInput.value.trim().toUpperCase();
    const verification = verifyInput.value.trim().toLowerCase();

    if (!radicado || !verification) {
      showToast("Por favor, ingresa el número de radicado y tu correo o teléfono.");
      return;
    }

    const cases = getCasesFromStorage();
    const foundCase = cases.find(c => c.id.toUpperCase() === radicado);

    if (foundCase) {
      const clientEmail = foundCase.email.toLowerCase();
      const clientPhoneClean = foundCase.phone.replace(/\D/g, '');
      const verificationClean = verification.replace(/\D/g, '');

      const matchesEmail = clientEmail === verification;
      const matchesPhone = verificationClean.length > 5 && clientPhoneClean.includes(verificationClean);

      if (matchesEmail || matchesPhone) {
        renderSearchResult(foundCase);
      } else {
        showSearchError("El correo electrónico o número de teléfono ingresado no coinciden con el registro de este radicado. Por seguridad, verifica tus datos.");
      }
    } else {
      showSearchError("No se encontró ningún caso con el número de radicado ingresado. Por favor, verifica el código.");
    }
  });

  [radicadoInput, verifyInput].forEach(input => {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        searchBtn.click();
      }
    });
  });
}

function showSearchError(message) {
  const resultContainer = document.getElementById("search-result-container");
  if (!resultContainer) return;
  resultContainer.innerHTML = `
    <div class="card" style="border-left: 5px solid #ef4444; background-color: rgba(239, 68, 68, 0.05); margin-top: 20px;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 1.5rem;">❌</span>
        <div>
          <h4 style="color: #ef4444; margin-bottom: 4px;">Error en la consulta</h4>
          <p style="font-size: 0.9rem; color: var(--text-main);">${message}</p>
        </div>
      </div>
    </div>
  `;
  resultContainer.classList.remove("hidden");
}

function renderSearchResult(c) {
  const resultContainer = document.getElementById("search-result-container");
  if (!resultContainer) return;

  const dateObj = new Date(c.date);
  const formattedDate = dateObj.toLocaleDateString('es-CO', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  let statusClass = "status-recibido";
  if (c.status === "En Revisión") statusClass = "status-revision";
  if (c.status === "En Proceso") statusClass = "status-proceso";
  if (c.status === "Resuelto") statusClass = "status-resuelto";
  if (c.status === "Cerrado") statusClass = "status-cerrado";

  // Badge del método
  const methodBadge = c.method === "Correo" 
    ? `<span class="method-badge method-email" style="font-size: 0.75rem; padding: 3px 6px; border-radius: 4px; background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.2); font-weight: 600; margin-left: 8px;">✉️ Correo</span>`
    : `<span class="method-badge method-whatsapp" style="font-size: 0.75rem; padding: 3px 6px; border-radius: 4px; background: rgba(37, 211, 102, 0.1); color: #25d366; border: 1px solid rgba(37, 211, 102, 0.2); font-weight: 600; margin-left: 8px;">💬 WhatsApp</span>`;

  // Archivos
  let filesHtml = "";
  if (c.files && c.files.length > 0) {
    filesHtml = `<div style="margin-top: 15px; padding: 10px; background: rgba(0,0,0,0.01); border-radius: 6px; border: 1px solid var(--border-color);">
      <strong>Documentos Adjuntos (${c.files.length}):</strong>
      <ul style="list-style: none; margin-top: 5px; padding-left: 0; display: flex; flex-direction: column; gap: 5px;">
        ${c.files.map(f => `<li style="font-size: 0.85rem; display: flex; align-items: center; gap: 6px;">📎 <span>${f}</span></li>`).join('')}
      </ul>
    </div>`;
  }

  const obsHtml = c.observation 
    ? `<div class="search-observation-box" style="margin-top: 15px; padding: 15px; background-color: rgba(217, 119, 6, 0.05); border-left: 4px solid var(--accent-color); border-radius: 6px;">
         <h5 style="color: var(--accent-color); font-weight: 700; margin-bottom: 5px;">Respuesta / Observaciones del Asesor:</h5>
         <p style="font-size: 0.95rem; line-height: 1.5; color: var(--text-main); white-space: pre-line;">${c.observation}</p>
       </div>`
    : `<p style="font-style: italic; color: var(--text-muted); font-size: 0.9rem; margin-top: 15px; background-color: rgba(0,0,0,0.02); padding: 10px; border-radius: 6px;">Aún no se han registrado observaciones de seguimiento para este radicado.</p>`;

  resultContainer.innerHTML = `
    <div class="card search-result-card" style="margin-top: 20px; border-left: 5px solid var(--accent-color);">
      <div class="search-result-header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 15px; margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 15px;">
        <div>
          <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 5px;">
            <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Código de Radicado</span>
            ${methodBadge}
          </div>
          <h3 style="color: var(--accent-color); font-family: monospace; font-size: 1.4rem; margin-top: 2px;">${c.id}</h3>
        </div>
        <span class="status-badge ${statusClass}">${c.status}</span>
      </div>

      <div class="search-result-grid" style="display: grid; grid-template-columns: 1fr; gap: 15px; margin-bottom: 20px;">
        <div class="search-detail-item">
          <strong>Solicitante:</strong> <span>${c.name}</span>
        </div>
        <div class="search-detail-item">
          <strong>Área Legal:</strong> <span>${c.area}</span>
        </div>
        <div class="search-detail-item">
          <strong>Asesor Asignado:</strong> <span>${c.advisor}</span>
        </div>
        <div class="search-detail-item">
          <strong>Fecha de Radicación:</strong> <span>${formattedDate}</span>
        </div>
      </div>

      <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid var(--border-color);">
        <strong>Descripción del Caso:</strong>
        <p style="font-size: 0.95rem; margin-top: 5px; color: var(--text-main); white-space: pre-line;">${c.description}</p>
      </div>
      
      ${filesHtml}

      <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid var(--border-color);">
        ${obsHtml}
      </div>
    </div>
  `;
  resultContainer.classList.remove("hidden");
}

function setupAdvisorDashboard() {
  const unlockBtn = document.getElementById("unlock-panel-btn");
  const passcodeInput = document.getElementById("advisor-passcode");

  if (sessionStorage.getItem("advisor_logged_in") === "true") {
    setupAdvisorFilterListeners();
    filterAndRenderAdvisorCases();
  }

  if (unlockBtn) {
    unlockBtn.addEventListener("click", () => {
      const code = passcodeInput.value.trim();
      if (code === ADVISOR_PASSCODE) {
        setupAdvisorFilterListeners();
        filterAndRenderAdvisorCases();
      }
    });
  }

  if (passcodeInput) {
    passcodeInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && passcodeInput.value.trim() === ADVISOR_PASSCODE) {
        setupAdvisorFilterListeners();
        filterAndRenderAdvisorCases();
      }
    });
  }
}

function setupAdvisorFilterListeners() {
  const searchInput = document.getElementById("advisor-search-input");
  const filterStatus = document.getElementById("advisor-filter-status");
  const filterArea = document.getElementById("advisor-filter-area");

  if (!searchInput) return;

  if (searchInput.dataset.listenerAttached === "true") return;

  searchInput.addEventListener("input", filterAndRenderAdvisorCases);
  if (filterStatus) filterStatus.addEventListener("change", filterAndRenderAdvisorCases);
  if (filterArea) filterArea.addEventListener("change", filterAndRenderAdvisorCases);

  searchInput.dataset.listenerAttached = "true";
}

function filterAndRenderAdvisorCases() {
  const searchInput = document.getElementById("advisor-search-input");
  const filterStatus = document.getElementById("advisor-filter-status");
  const filterArea = document.getElementById("advisor-filter-area");
  const container = document.getElementById("advisor-cases-list");

  if (!container) return;

  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
  const statusVal = filterStatus ? filterStatus.value : "all";
  const areaVal = filterArea ? filterArea.value : "all";

  const cases = getCasesFromStorage();
  let filteredCases = [...cases];

  // 1. Filtrar por búsqueda
  if (query) {
    filteredCases = filteredCases.filter(c => 
      c.id.toLowerCase().includes(query) ||
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.phone.includes(query) ||
      c.description.toLowerCase().includes(query) ||
      (c.observation && c.observation.toLowerCase().includes(query))
    );
  }

  // 2. Filtrar por estado
  if (statusVal !== "all") {
    filteredCases = filteredCases.filter(c => c.status === statusVal);
  }

  // 3. Filtrar por área
  if (areaVal !== "all") {
    filteredCases = filteredCases.filter(c => c.area === areaVal);
  }

  // Ordenar casos por tiempo (más recientes primero)
  filteredCases.sort((a, b) => new Date(b.date) - new Date(a.date));

  container.innerHTML = "";

  if (filteredCases.length === 0) {
    container.innerHTML = `
      <p style="text-align: center; color: var(--text-muted); font-style: italic; padding: 30px;">
        No se encontraron casos que coincidan con la búsqueda o filtros seleccionados.
      </p>
    `;
    return;
  }

  filteredCases.forEach(c => {
    const card = document.createElement("div");
    card.className = "card advisor-case-card";
    card.style.marginTop = "20px";
    
    const dateObj = new Date(c.date);
    const formattedDate = dateObj.toLocaleDateString('es-CO', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    let statusClass = "status-recibido";
    if (c.status === "En Revisión") statusClass = "status-revision";
    if (c.status === "En Proceso") statusClass = "status-proceso";
    if (c.status === "Resuelto") statusClass = "status-resuelto";
    if (c.status === "Cerrado") statusClass = "status-cerrado";

    // Badge del método
    const methodBadge = c.method === "Correo" 
      ? `<span class="method-badge method-email" style="font-size: 0.75rem; padding: 4px 8px; border-radius: 4px; background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.2); font-weight: 600; margin-left: 8px;">✉️ Correo</span>`
      : `<span class="method-badge method-whatsapp" style="font-size: 0.75rem; padding: 4px 8px; border-radius: 4px; background: rgba(37, 211, 102, 0.1); color: #25d366; border: 1px solid rgba(37, 211, 102, 0.2); font-weight: 600; margin-left: 8px;">💬 WhatsApp</span>`;

    // Archivos
    let filesHtml = "";
    if (c.files && c.files.length > 0) {
      filesHtml = `<div style="margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.02); border-radius: 6px;">
        <strong>Archivos Anexados (${c.files.length}):</strong>
        <ul style="list-style: none; margin-top: 5px; padding-left: 0; display: flex; flex-direction: column; gap: 5px;">
          ${c.files.map(f => `<li style="font-size: 0.85rem; display: flex; align-items: center; gap: 6px; color: var(--text-main);">📎 <span>${f}</span></li>`).join('')}
        </ul>
      </div>`;
    } else {
      filesHtml = `<p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 10px; font-style: italic;">📎 Sin archivos adjuntos.</p>`;
    }

    const waPhoneClean = c.phone.replace(/\D/g, '');
    const mailSubject = encodeURIComponent(`[${c.id}] Respuesta a tu consulta - RM ABOGADOS CONSULTORES`);
    const mailBody = encodeURIComponent(`Estimado(a) ${c.name},\n\nNos ponemos en contacto en relación a su solicitud de asesoría con número de radicado ${c.id}.\n\nAtentamente,\nRM ABOGADOS CONSULTORES`);

    card.innerHTML = `
      <div class="advisor-case-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 12px; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 5px;">
          <span style="font-family: monospace; font-size: 1.15rem; font-weight: 800; color: var(--accent-color);">${c.id}</span>
          <span style="font-size: 0.8rem; color: var(--text-muted); margin-left: 10px;">📅 ${formattedDate}</span>
          ${methodBadge}
        </div>
        <span class="status-badge ${statusClass}" id="badge-${c.id}">${c.status}</span>
      </div>

      <div class="advisor-case-body" style="display: grid; grid-template-columns: 1fr; gap: 20px;">
        <div class="advisor-case-details" style="display: grid; grid-template-columns: 1fr; gap: 10px;">
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 15px; background: rgba(0,0,0,0.01); padding: 15px; border-radius: 8px; border: 1px solid var(--border-color);">
            <div>
              <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">👤 Solicitante</span>
              <p style="font-size: 0.95rem; font-weight: 600; color: var(--text-main); margin-top: 2px;">${c.name}</p>
            </div>
            <div>
              <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">📞 WhatsApp / Teléfono</span>
              <p style="font-size: 0.95rem; font-weight: 600; margin-top: 2px;">
                <a href="https://wa.me/${waPhoneClean}" target="_blank" style="color: var(--whatsapp-color); display: inline-flex; align-items: center; gap: 4px;">${c.phone} 💬</a>
                <span style="color: var(--text-muted); font-size: 0.85rem; font-weight: normal; margin-left: 5px;">|</span>
                <a href="tel:+${waPhoneClean}" style="color: var(--accent-color); font-size: 0.85rem; font-weight: normal; margin-left: 5px;">Llamar 📞</a>
              </p>
            </div>
            <div>
              <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">✉️ Correo Electrónico</span>
              <p style="font-size: 0.95rem; font-weight: 600; margin-top: 2px;">
                <a href="mailto:${c.email}?subject=${mailSubject}&body=${mailBody}" style="color: var(--accent-color); text-decoration: underline;">${c.email}</a>
              </p>
            </div>
            <div>
              <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">⚖️ Área de la Consulta</span>
              <p style="font-size: 0.95rem; font-weight: 600; color: var(--text-main); margin-top: 2px;">${c.area}</p>
            </div>
            <div>
              <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">👨‍⚖️ Asesor Designado</span>
              <p style="font-size: 0.95rem; font-weight: 600; color: var(--text-main); margin-top: 2px;">${c.advisor}</p>
            </div>
            <div>
              <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">🚩 Origen de Registro</span>
              <p style="font-size: 0.95rem; font-weight: 600; color: var(--text-main); margin-top: 2px;">${c.origin || "Formulario Directo"}</p>
            </div>
          </div>

          <div style="margin-top: 10px; background: rgba(15,30,54,0.02); padding: 15px; border-radius: 8px; border: 1px solid var(--border-color);">
            <strong style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 5px;">📋 Descripción del Caso</strong>
            <p class="advisor-case-desc" style="font-size: 0.9rem; line-height: 1.5; color: var(--text-main); white-space: pre-line; margin-bottom: 0;">${c.description}</p>
          </div>

          ${filesHtml}
        </div>

        <div class="advisor-case-controls" style="border-top: 1px solid var(--border-color); padding-top: 15px;">
          <div class="form-group" style="margin-bottom: 15px;">
            <label for="status-select-${c.id}" style="font-weight: 700; font-size: 0.85rem;">Estado de la Solicitud</label>
            <select id="status-select-${c.id}" style="padding: 10px; border-radius: 6px;">
              <option value="Recibido" ${c.status === "Recibido" ? "selected" : ""}>Recibido</option>
              <option value="En Revisión" ${c.status === "En Revisión" ? "selected" : ""}>En Revisión</option>
              <option value="En Proceso" ${c.status === "En Proceso" ? "selected" : ""}>En Proceso</option>
              <option value="Resuelto" ${c.status === "Resuelto" ? "selected" : ""}>Resuelto</option>
              <option value="Cerrado" ${c.status === "Cerrado" ? "selected" : ""}>Cerrado</option>
            </select>
          </div>

          <div class="form-group" style="margin-bottom: 15px;">
            <label for="obs-textarea-${c.id}" style="font-weight: 700; font-size: 0.85rem;">Observaciones del Asesor (Visibles al Cliente)</label>
            <textarea id="obs-textarea-${c.id}" rows="4" placeholder="Agrega notas legales, fechas de audiencias o explicaciones que el cliente podrá consultar..." style="padding: 10px; border-radius: 6px; font-size: 0.9rem;">${c.observation || ""}</textarea>
          </div>

          <button class="btn btn-primary btn-save-case" data-case-id="${c.id}" style="width: 100%; font-size: 0.85rem; padding: 12px; border: 1px solid var(--accent-color);">
            💾 Guardar Cambios
          </button>
          
          <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; gap: 10px;">
              <a href="mailto:${c.email}?subject=${mailSubject}&body=${mailBody}" class="btn btn-outline" style="flex: 1; font-size: 0.8rem; padding: 10px; text-align: center; border-color: rgba(217, 119, 6, 0.4); color: var(--text-main); display: inline-flex; align-items: center; justify-content: center;">
                ✉️ Responder Email
              </a>
              <a href="https://wa.me/${waPhoneClean}?text=${encodeURIComponent('Hola ' + c.name + ', te contacto de RM Abogados Consultores sobre tu radicado ' + c.id)}" target="_blank" class="btn btn-outline" style="flex: 1; font-size: 0.8rem; padding: 10px; text-align: center; border-color: rgba(37, 211, 102, 0.4); color: var(--text-main); display: inline-flex; align-items: center; justify-content: center;">
                💬 Chat WhatsApp
              </a>
            </div>
            <button class="btn btn-outline btn-export-pdf" data-case-id="${c.id}" style="width: 100%; font-size: 0.8rem; padding: 10px; text-align: center; border-color: rgba(15, 30, 54, 0.3); color: var(--text-main); display: inline-flex; align-items: center; justify-content: center; gap: 6px;">
              📄 Exportar Ficha PDF / Imprimir
            </button>
          </div>
        </div>
      </div>
    `;

    const saveBtn = card.querySelector(".btn-save-case");
    saveBtn.addEventListener("click", () => {
      const caseId = saveBtn.getAttribute("data-case-id");
      const statusSelect = card.querySelector(`#status-select-${caseId}`);
      const obsTextarea = card.querySelector(`#obs-textarea-${caseId}`);

      const newStatus = statusSelect.value;
      const newObs = obsTextarea.value.trim();

      updateCaseInStorage(caseId, newStatus, newObs);
    });

    const pdfBtn = card.querySelector(".btn-export-pdf");
    pdfBtn.addEventListener("click", () => {
      const caseId = pdfBtn.getAttribute("data-case-id");
      exportCaseToPDF(caseId);
    });

    container.appendChild(card);
  });
}

function updateCaseInStorage(caseId, status, observation) {
  const cases = getCasesFromStorage();
  const caseIndex = cases.findIndex(c => c.id === caseId);

  if (caseIndex !== -1) {
    cases[caseIndex].status = status;
    cases[caseIndex].observation = observation;
    saveCasesToStorage(cases);
    
    showToast(`Radicado ${caseId} actualizado con éxito.`);
    
    const badge = document.getElementById(`badge-${caseId}`);
    if (badge) {
      badge.textContent = status;
      badge.className = "status-badge";
      let statusClass = "status-recibido";
      if (status === "En Revisión") statusClass = "status-revision";
      if (status === "En Proceso") statusClass = "status-proceso";
      if (status === "Resuelto") statusClass = "status-resuelto";
      if (status === "Cerrado") statusClass = "status-cerrado";
      badge.classList.add(statusClass);
    }
  } else {
    showToast("Error: No se pudo encontrar el caso.");
  }
}

// Genera un documento imprimible (PDF) de la ficha de radicado en una ventana nueva
function exportCaseToPDF(caseId) {
  const cases = getCasesFromStorage();
  const c = cases.find(item => item.id === caseId);
  if (!c) {
    showToast("Error: No se encontró el caso para exportar.");
    return;
  }

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    showToast("Error: El navegador bloqueó la ventana emergente. Por favor, habilítalas.");
    return;
  }

  const dateObj = new Date(c.date);
  const formattedDate = dateObj.toLocaleDateString('es-CO', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const printDate = new Date().toLocaleDateString('es-CO', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  // Renderizar la lista de archivos adjuntos
  let filesHtml = "";
  if (c.files && c.files.length > 0) {
    filesHtml = `
      <ul style="list-style-type: none; padding-left: 0; margin-top: 5px;">
        ${c.files.map(f => `<li style="margin-bottom: 5px; font-size: 0.95rem; display: flex; align-items: center; gap: 6px;">📎 ${f}</li>`).join('')}
      </ul>
    `;
  } else {
    filesHtml = `<span style="font-style: italic; color: #64748b;">Ninguno</span>`;
  }

  const observationText = c.observation ? c.observation : "Sin observaciones registradas hasta el momento.";

  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Ficha de Radicación ${c.id}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700;800&display=swap');
    
    body {
      font-family: 'Inter', sans-serif;
      color: #1e293b;
      line-height: 1.5;
      margin: 0;
      padding: 40px;
      background-color: #ffffff;
    }
    
    .print-container {
      max-width: 800px;
      margin: 0 auto;
      border: 1px solid #e2e8f0;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    }
    
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid #0f1e36;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    
    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .logo-box {
      background: linear-gradient(135deg, #0f1e36, #d97706);
      width: 44px;
      height: 44px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 800;
      font-size: 1.2rem;
      font-family: 'Montserrat', sans-serif;
    }
    
    .logo-text {
      font-family: 'Montserrat', sans-serif;
      text-align: left;
    }
    
    .logo-title {
      font-weight: 800;
      font-size: 1.3rem;
      color: #0f1e36;
      line-height: 1;
    }
    
    .logo-subtitle {
      font-size: 0.7rem;
      color: #64748b;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-top: 2px;
    }
    
    .doc-type {
      text-align: right;
    }
    
    .doc-type h2 {
      font-family: 'Montserrat', sans-serif;
      margin: 0;
      font-size: 1rem;
      color: #d97706;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      font-weight: 700;
    }
    
    .doc-type .radicado-id {
      font-family: monospace;
      font-size: 1.35rem;
      font-weight: 800;
      color: #0f1e36;
      margin-top: 5px;
    }
    
    .section-title {
      font-family: 'Montserrat', sans-serif;
      font-size: 1.05rem;
      font-weight: 700;
      color: #0f1e36;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
      margin-top: 25px;
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .grid-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px 30px;
      margin-bottom: 20px;
    }
    
    .info-item {
      display: flex;
      flex-direction: column;
    }
    
    .info-label {
      font-size: 0.75rem;
      color: #64748b;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }
    
    .info-value {
      font-size: 0.95rem;
      font-weight: 500;
    }
    
    .status-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      background-color: #f1f5f9;
      color: #334155;
      width: fit-content;
    }
    
    .status-badge.status-recibido { background-color: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
    .status-badge.status-revision { background-color: #f3e8ff; color: #6b21a8; border: 1px solid #e9d5ff; }
    .status-badge.status-proceso { background-color: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
    .status-badge.status-resuelto { background-color: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .status-badge.status-cerrado { background-color: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; }
    
    .description-box, .observation-box {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 15px;
      font-size: 0.95rem;
      white-space: pre-line;
      line-height: 1.6;
    }
    
    .observation-box {
      border-left: 4px solid #d97706;
      background-color: #fffbeb;
    }
    
    .signatures-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-top: 60px;
      margin-bottom: 40px;
    }
    
    .signature-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
    .signature-line {
      width: 80%;
      border-top: 1px solid #cbd5e1;
      margin-bottom: 8px;
    }
    
    .signature-title {
      font-size: 0.85rem;
      font-weight: 600;
      color: #1e293b;
    }
    
    .signature-subtitle {
      font-size: 0.75rem;
      color: #64748b;
    }
    
    .habeas-data {
      border-top: 1px dashed #cbd5e1;
      padding-top: 15px;
      font-size: 0.7rem;
      color: #64748b;
      text-align: justify;
      line-height: 1.4;
      margin-top: 40px;
    }
    
    .print-footer {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: #94a3b8;
      margin-top: 20px;
      border-top: 1px solid #f1f5f9;
      padding-top: 10px;
    }

    @media print {
      body {
        padding: 0;
        background-color: transparent;
      }
      .print-container {
        border: none;
        padding: 0;
        box-shadow: none;
      }
      .section-title, .grid-info, .description-box, .observation-box, .signatures-section, .habeas-data {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>

  <div class="print-container">
    <header>
      <div class="logo-container">
        <div class="logo-box">RM</div>
        <div class="logo-text">
          <div class="logo-title">RM ABOGADOS</div>
          <div class="logo-subtitle">Consultores</div>
        </div>
      </div>
      <div class="doc-type">
        <h2>Ficha Oficial de Radicación</h2>
        <div class="doc-id-label" style="font-size: 0.7rem; color: #64748b; text-transform: uppercase; font-weight: 600; margin-top: 4px;">Radicado N°</div>
        <div class="radicado-id">${c.id}</div>
      </div>
    </header>

    <div class="section-title">Información del Radicado</div>
    <div class="grid-info">
      <div class="info-item">
        <span class="info-label">Fecha de Registro</span>
        <span class="info-value">${formattedDate}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Estado de la Solicitud</span>
        <span class="info-value">
          <span class="status-badge ${c.status === 'En Revisión' ? 'status-revision' : c.status === 'En Proceso' ? 'status-proceso' : c.status === 'Resuelto' ? 'status-resuelto' : c.status === 'Cerrado' ? 'status-cerrado' : 'status-recibido'}">
            ${c.status}
          </span>
        </span>
      </div>
      <div class="info-item">
        <span class="info-label">Canal de Recepción</span>
        <span class="info-value">${c.method || 'Formulario'}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Origen de Registro</span>
        <span class="info-value">${c.origin || 'Formulario Directo'}</span>
      </div>
    </div>

    <div class="section-title">Datos del Solicitante</div>
    <div class="grid-info">
      <div class="info-item">
        <span class="info-label">Nombre Completo</span>
        <span class="info-value">${c.name}</span>
      </div>
      <div class="info-item">
        <span class="info-label">WhatsApp / Teléfono</span>
        <span class="info-value">${c.phone}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Correo Electrónico</span>
        <span class="info-value">${c.email}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Área Jurídica</span>
        <span class="info-value">${c.area}</span>
      </div>
      <div class="info-item" style="grid-column: span 2;">
        <span class="info-label">Asesor Designado</span>
        <span class="info-value">${c.advisor}</span>
      </div>
    </div>

    <div class="section-title">Descripción del Caso (Hechos)</div>
    <div class="description-box">${c.description}</div>

    <div class="section-title">Documentos Soporte Anexados</div>
    <div style="margin-bottom: 20px;">
      ${filesHtml}
    </div>

    <div class="section-title">Seguimiento y Observaciones del Asesor</div>
    <div class="observation-box">${observationText}</div>

    <div class="signatures-section">
      <div class="signature-card">
        <div style="height: 50px;"></div>
        <div class="signature-line"></div>
        <div class="signature-title">${c.advisor}</div>
        <div class="signature-subtitle">Abogado / Asesor Responsable</div>
      </div>
      <div class="signature-card">
        <div style="height: 50px;"></div>
        <div class="signature-line"></div>
        <div class="signature-title">${c.name}</div>
        <div class="signature-subtitle">Firma del Solicitante</div>
      </div>
    </div>

    <div class="habeas-data">
      <strong>Cláusula Habeas Data:</strong> De conformidad con la Ley 1581 de 2012 de Protección de Datos Personales de la República de Colombia, la firma RM ABOGADOS CONSULTORES informa que la información registrada en esta ficha de radicación se recolecta únicamente con fines de consultoría jurídica, asesoría jurídica, defensa legal y contacto directo. Los datos proporcionados serán tratados bajo estrictas medidas de confidencialidad y secreto profesional. El solicitante puede ejercer sus derechos de acceso, rectificación y supresión de datos escribiendo a nuestros canales de contacto oficiales.
    </div>

    <div class="print-footer">
      <span>RM ABOGADOS CONSULTORES — Rozo Muñoz Abogados Consultores</span>
      <span>Generado el: ${printDate}</span>
    </div>
  </div>

  <script>
    window.onload = function() {
      window.print();
      setTimeout(function() {
        window.close();
      }, 500);
    }
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
