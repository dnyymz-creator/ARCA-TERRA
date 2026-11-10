/**
 * ARCA TERRA ARQUITECTURA — MOTOR DE INTERACCIÓN & ANIMACIÓN
 * Tipografías: SYNE (Títulos Escultóricos) + SF PRO (Cuerpo)
 * Micro-interacciones 3D Tilt, Scroll Parallax, WhatsApp API Integrado
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. REVELACIÓN SUAVE AL HACER SCROLL (INTERSECTION OBSERVER)
  // =========================================================================
  const revealElements = document.querySelectorAll('[data-reveal]');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, parseInt(delay, 10));
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // =========================================================================
  // 2. EFECTO PARALLAX EN FONDOS ARQUITECTÓNICOS (Hero & Filosofía)
  // =========================================================================
  const heroImg = document.getElementById('heroImg');
  const whyBgImg = document.getElementById('whyBgImg');
  const navbar = document.querySelector('.nav-glass-bar');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Estado Scrolled del Navbar
    if (navbar) {
      if (scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Parallax Suave en Hero
    if (heroImg && scrollY < window.innerHeight * 1.5) {
      const heroOffset = scrollY * 0.25;
      heroImg.style.transform = `scale(1.05) translateY(${heroOffset}px)`;
    }

    // Parallax en Sección Por Qué / Filosofía
    if (whyBgImg) {
      const whySection = document.getElementById('why-us');
      if (whySection) {
        const rect = whySection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
          const whyOffset = (progress - 0.5) * 60;
          whyBgImg.style.transform = `scale(1.04) translateY(${whyOffset}px)`;
        }
      }
    }

    // Resaltar sección activa en el menú
    highlightCurrentSection();
  }, { passive: true });


  // =========================================================================
  // 3. INDICADOR ACTIVO EN LA NAVEGACIÓN
  // =========================================================================
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function highlightCurrentSection() {
    let currentId = '';
    const scrollPosition = window.pageYOffset + 200;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }


  // =========================================================================
  // 4. MICRO-INTERACCIÓN 3D TILT EN TARJETAS GLASSMORPHIC (Solo Dispositivos con Cursor Fino)
  // =========================================================================
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (isFinePointer) {
    const tiltCards = document.querySelectorAll('[data-tilt]');

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        card.style.transition = 'transform 0.5s ease';
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease';
      });
    });
  }


  // =========================================================================
  // 5. ACORDEÓN INTERACTIVO DE SERVICIOS
  // =========================================================================
  const serviceCards = document.querySelectorAll('.service-card');

  serviceCards.forEach(card => {
    const cardTop = card.querySelector('.service-card-top');
    cardTop.addEventListener('click', () => {
      const isActive = card.classList.contains('active');

      serviceCards.forEach(c => {
        c.classList.remove('active');
        const indicator = c.querySelector('.service-pill-indicator span');
        if (indicator) indicator.textContent = 'EXPLORAR';
      });

      if (!isActive) {
        card.classList.add('active');
        const indicator = card.querySelector('.service-pill-indicator span');
        if (indicator) indicator.textContent = 'ACTIVO';
      }
    });
  });


  // =========================================================================
  // 6. FILTRADO INTERACTIVO DEL PORTAFOLIO
  // =========================================================================
  const filterBtns = document.querySelectorAll('.filter-pill');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  // =========================================================================
  // 7. MODAL LIGHTBOX DE DETALLES DE OBRA
  // =========================================================================
  const modal = document.getElementById('projectModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBody = document.getElementById('modalBodyContent');
  const inspectButtons = document.querySelectorAll('.btn-inspect-project');

  const projectDetails = {
    bruma: {
      title: 'Casa Bruma',
      subtitle: 'Residencia Unifamiliar de Alta Gama en Lomas de Chapultepec, CDMX',
      img: 'IMAGENES/HERO PRINCIPAL.jpg',
      meta: ['850 m² Construcción', 'Año: 2024', 'Concreto Aparente & Cristal', '4 Suites'],
      desc: 'Casa Bruma se concibe como una escultura monolítica habitada. Su fachada de concreto aparente entablillado y muros de piedra volcánica negra crean una barrera acústica serena hacia la calle, mientras que su interior se desdobla en terrazas flotantes con vista a un jardín zen privado. La iluminación indirecta en 2700K y los sistemas bioclimáticos pasivos regulan naturalmente la temperatura durante todo el año.'
    },
    serene: {
      title: 'Villa Serene',
      subtitle: 'Retiro Costero en Acantilado sobre el Océano Pacífico',
      img: 'IMAGENES/1.jpg',
      meta: ['1,240 m² Superficie', 'Año: 2025', 'Acantilado Natural', 'Infinity Pool 25m'],
      desc: 'Suspendida sobre formaciones rocosas de granito frente al mar abierto, Villa Serene maximiza las visuales panorámicas mediante losas en cantiléver de hasta 8 metros sin apoyos intermedios. Cuenta con una alberca infinita que parece fundirse con el oleaje, recubrimiento de travertino crudo y cancelería oculta de piso a techo que desdibuja el límite entre interior y naturaleza.'
    },
    pabellon: {
      title: 'Pabellón Estructural',
      subtitle: 'Proceso y Ejecución de Ingeniería de Vanguardia',
      img: 'IMAGENES/2.jpg',
      meta: ['620 m² en Construcción', 'Entrega: Q3 2026', 'Trabes Postensadas', 'BIM Nivel 3'],
      desc: 'Una muestra testimonial del rigor técnico de Arca Terra. Este proyecto expone la ingeniería pura: columnas esbeltas de concreto autocompactante, ductería oculta pre-colada y cimbra de maderas recicladas que otorgan una textura táctil irrepetible a los paramentos. Cada fase de la obra se documenta con escaneo láser LiDAR para garantizar una precisión micrométrica.'
    }
  };

  inspectButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projKey = btn.getAttribute('data-project');
      const data = projectDetails[projKey];
      if (!data) return;

      modalBody.innerHTML = `
        <img src="${data.img}" alt="${data.title}" class="modal-project-img">
        <h3 class="modal-project-title">${data.title}</h3>
        <p style="font-size: 0.95rem; color: var(--accent-bronze-light); margin-bottom: 1rem; font-family: var(--font-mono);">${data.subtitle}</p>
        <div class="modal-project-meta">
          ${data.meta.map(m => `<span class="glass-pill-sm">${m}</span>`).join('')}
        </div>
        <p class="modal-project-desc">${data.desc}</p>
        <div style="display: flex; gap: 1rem; align-items: center; margin-top: 1.5rem;">
          <a href="https://wa.me/525512345678?text=Hola%20Arca%20Terra%2C%20quisiera%20conocer%20m%C3%A1s%20detalles%20de%20la%20obra%20${encodeURIComponent(data.title)}" target="_blank" rel="noopener noreferrer" class="pill-cta-btn wa-link-btn" style="padding: 10px 20px;">
            <span>Consultar sobre este proyecto en WhatsApp</span>
            <span class="cta-arrow-circle-sm">↗</span>
          </a>
        </div>
      `;

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });


  // =========================================================================
  // 8. REDIRECCIÓN A WHATSAPP Y FORMULARIO EDITORIAL
  // =========================================================================
  const architectForm = document.getElementById('architectForm');
  const waFastBtn = document.getElementById('waFastBtn');
  const formStatusMsg = document.getElementById('formStatusMsg');
  const WHATSAPP_PHONE = '5577527271'; // Teléfono oficial del despacho

  // Generador dinámico del mensaje formateado para WhatsApp
  function buildWhatsAppMessage() {
    const name = document.getElementById('clientName').value.trim() || 'un cliente interesado';
    const email = document.getElementById('clientEmail').value.trim() || 'No especificado';
    const phone = document.getElementById('clientPhone').value.trim() || 'No especificado';
    const projectType = document.getElementById('projectType').value;
    const budgetRange = document.getElementById('budgetRange').value;
    const location = document.getElementById('projectLocation').value.trim() || 'Por definir';
    const details = document.getElementById('projectDetails').value.trim() || 'Sin comentarios adicionales';

    const text = `*SOLICITUD DE PROYECTO ARQUITECTÓNICO — ARCA TERRA*\n\n` +
      `👤 *Cliente:* ${name}\n` +
      `📧 *Email:* ${email}\n` +
      `📱 *Teléfono:* ${phone}\n` +
      `🏛️ *Tipo de Encargo:* ${projectType}\n` +
      `📍 *Ubicación:* ${location}\n` +
      `💰 *Presupuesto Estimado:* ${budgetRange}\n\n` +
      `📝 *Descripción / Requerimientos:*\n${details}\n\n` +
      `_Enviado desde el portal oficial de Arca Terra Arquitectura._`;

    return encodeURIComponent(text);
  }

  // Envío Instantáneo por WhatsApp
  if (waFastBtn) {
    waFastBtn.addEventListener('click', () => {
      const nameInput = document.getElementById('clientName');
      if (!nameInput.value.trim()) {
        nameInput.focus();
        formStatusMsg.className = 'form-status-msg error';
        formStatusMsg.textContent = 'Por favor indique al menos su nombre completo para personalizar el mensaje de WhatsApp.';
        return;
      }

      const waText = buildWhatsAppMessage();
      const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${waText}`;
      
      formStatusMsg.className = 'form-status-msg success';
      formStatusMsg.textContent = 'Redirigiendo a WhatsApp con los datos de su proyecto...';

      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 400);
    });
  }

  // Envío de Formulario Tradicional
  if (architectForm) {
    architectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = document.getElementById('submitFormBtn');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Enviando...</span>`;

      // Simulación de envío seguro al despacho
      setTimeout(() => {
        formStatusMsg.className = 'form-status-msg success';
        formStatusMsg.textContent = '✓ Solicitud recibida con éxito. Nuestro Director de Proyectos se pondrá en contacto en menos de 24 horas.';
        
        const waText = buildWhatsAppMessage();
        const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${waText}`;
        
        submitBtn.innerHTML = `<span>Enviado</span>`;
        
        setTimeout(() => {
          if (confirm('¿Desea enviar una copia inmediata de este formulario directamente al WhatsApp de Arca Terra?')) {
            window.open(waUrl, '_blank');
          }
          architectForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }, 1200);
      }, 1000);
    });
  }


  // =========================================================================
  // 9. NAVEGACIÓN MÓVIL (Con animación de hamburguesa y cierre al tocar fuera)
  // =========================================================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileMenuBtn && mobileDrawer) {
    const toggleMenu = () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileMenuBtn.classList.toggle('active', isOpen);
      mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };

    const closeMenu = () => {
      mobileDrawer.classList.remove('open');
      mobileMenuBtn.classList.remove('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    };

    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Cerrar al hacer clic fuera del cajón
    document.addEventListener('click', (e) => {
      if (mobileDrawer.classList.contains('open') && !mobileDrawer.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        closeMenu();
      }
    });

    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeMenu();
      }
    });
  }

});
