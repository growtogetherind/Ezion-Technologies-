/**
 * EZION TECHNOLOGIES & EZION MEDIA - MAIN SCRIPT
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

  // 2. Mobile Navigation Toggle & Drawer
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

  // 4. "Enquire" Link Behavior on Service Cards
  const enquireLinks = document.querySelectorAll('.service-enquire-link');
  const serviceSelect = document.getElementById('service-select');
  const projectMessage = document.getElementById('project-message');

  enquireLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const serviceName = link.getAttribute('data-service');
      if (serviceSelect && serviceName) {
        // Find matching option in select
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].value === serviceName) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      }
      // If contact form is on the same page, scroll and focus message
      const contactSec = document.getElementById('contact');
      if (contactSec) {
        setTimeout(() => {
          projectMessage?.focus();
        }, 600);
      }
    });
  });

  // 5. Interactive Form Submissions with Toast Feedback
  const setupFormSubmission = (formId, toastId) => {
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
          <svg style="animation: spin 1s linear infinite; width: 18px; height: 18px; vertical-align: middle; margin-right: 8px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10"></path>
          </svg>
          Sending...
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
          toast.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          setTimeout(() => {
            toast.style.display = 'none';
          }, 7000);
        }
      }, 850);
    });
  };

  setupFormSubmission('contact-form', 'contact-toast');
  setupFormSubmission('detailed-proposal-form', 'detailed-proposal-toast');

  // 6. Interactive Network Nodes Hover Info
  const networkNodes = document.querySelectorAll('.interactive-node');
  networkNodes.forEach(node => {
    node.style.cursor = 'pointer';
    node.addEventListener('mouseenter', () => {
      node.querySelector('.node-circle')?.setAttribute('r', '10');
    });
    node.addEventListener('mouseleave', () => {
      node.querySelector('.node-circle')?.setAttribute('r', '8');
    });
  });
});
