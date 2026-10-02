/**
 * EZION TECHNOLOGIES - MAIN SCRIPT
 * High performance, zero-dependency interactions & animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header & Scroll State
  const header = document.querySelector('.site-header');
  const handleScroll = () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Mobile Navigation Toggle
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileDrawer = document.querySelector('.mobile-menu-drawer');
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('is-open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close when clicking any nav link
    mobileDrawer.querySelectorAll('.nav-link, .btn').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Active Nav Link on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  const highlightNav = () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });

  // 4. Counter Animation for Stats
  const statNumbers = document.querySelectorAll('.counter-val');
  let animated = false;

  const countUp = (el, target) => {
    let start = 0;
    const duration = 1600;
    const startTime = performance.now();

    const update = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * target);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    };
    requestAnimationFrame(update);
  };

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        statNumbers.forEach(item => {
          const target = parseInt(item.getAttribute('data-target'), 10);
          if (!isNaN(target)) {
            countUp(item, target);
          }
        });
        animated = true;
      }
    });
  }, { threshold: 0.3 });

  const statsBanner = document.querySelector('.stats-banner');
  if (statsBanner) {
    statObserver.observe(statsBanner);
  }

  // 5. Services Filter Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');
  const categoryHeaders = document.querySelectorAll('.category-header');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      categoryHeaders.forEach(header => {
        const cat = header.getAttribute('data-category');
        if (filter === 'all' || filter === cat) {
          header.style.display = 'flex';
        } else {
          header.style.display = 'none';
        }
      });

      serviceCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || filter === cat) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transition = 'opacity 0.3s ease';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 6. Modal Handler (Get a Quote)
  const quoteModal = document.getElementById('quote-modal');
  const openQuoteBtns = document.querySelectorAll('.btn-open-quote');
  const closeBtns = document.querySelectorAll('.modal-close-btn, .modal-overlay-backdrop');

  const openModal = (modal) => {
    if (!modal) return;
    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
  };

  openQuoteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(quoteModal);
    });
  });

  // Close modals on click
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('.modal-close-btn')) {
        closeModal(modal);
      }
    });
  });

  // Close modals on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.is-active').forEach(m => closeModal(m));
    }
  });



  // 7. Interactive Form Submissions with Feedback
  const handleFormSubmit = (formId, toastId) => {
    const form = document.getElementById(formId);
    const toast = document.getElementById(toastId);
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg style="animation: spin 1s linear infinite; width: 18px; height: 18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10"></path>
          </svg>
          Submitting...
        `;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
        form.reset();
        if (toast) {
          toast.style.display = 'flex';
          setTimeout(() => {
            toast.style.display = 'none';
          }, 6000);
        }
        // If it was a modal form, auto close after 2s
        if (form.closest('.modal-overlay')) {
          setTimeout(() => {
            closeModal(form.closest('.modal-overlay'));
          }, 1800);
        }
      }, 900);
    });
  };

  handleFormSubmit('contact-form', 'contact-toast');
  handleFormSubmit('modal-quote-form', 'modal-quote-toast');

  // 8. Global Network Node Hover Interactivity
  const networkNodes = document.querySelectorAll('.interactive-node');
  const networkInfo = document.getElementById('network-hover-info');

  networkNodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      const city = node.getAttribute('data-city');
      const info = node.getAttribute('data-info');
      if (networkInfo) {
        networkInfo.innerHTML = `<strong>${city}:</strong> ${info}`;
        networkInfo.style.opacity = '1';
      }
    });

    node.addEventListener('mouseleave', () => {
      if (networkInfo) {
        networkInfo.innerHTML = 'Hover over any node to inspect global hubs & delivery synchronization.';
      }
    });
  });
});
