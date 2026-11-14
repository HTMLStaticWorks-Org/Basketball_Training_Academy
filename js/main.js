/**
 * COURTLY Basketball Training Academy
 * Core JavaScript Engine - Themes, RTL, Navigation, Animations & Toasts
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initRTL();
  initHeader();
  initMobileNav();
  initCounters();
  initBackToTop();
  initActiveNav();
  initFormValidation();
  initProgramTabs();
});

/* ==========================================================================
   1. Theme Management (Dark / Light)
   ========================================================================== */
function initTheme() {
  const savedTheme = localStorage.getItem('courtly_theme') || 'dark';
  applyTheme(savedTheme);

  const themeToggles = document.querySelectorAll('.theme-toggle-btn');
  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.body.classList.contains('light') ? 'light' : 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showCourtlyToast('Theme Updated', `Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    });
  });
}

function applyTheme(theme) {
  if (theme === 'light') {
    document.body.classList.remove('dark');
    document.body.classList.add('light');
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  } else {
    document.body.classList.remove('light');
    document.body.classList.add('dark');
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
  }
  localStorage.setItem('courtly_theme', theme);
  updateThemeIcons(theme);
  window.dispatchEvent(new CustomEvent('courtly_theme_changed', { detail: { theme } }));
}

function updateThemeIcons(theme) {
  const themeIcons = document.querySelectorAll('.theme-icon');
  themeIcons.forEach(icon => {
    if (theme === 'light') {
      icon.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`;
    } else {
      icon.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`;
    }
  });
}

/* ==========================================================================
   2. RTL Management
   ========================================================================== */
function initRTL() {
  const savedRTL = localStorage.getItem('courtly_rtl') === 'true';
  applyRTL(savedRTL);

  const rtlToggles = document.querySelectorAll('.rtl-toggle-btn');
  rtlToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const isCurrentlyRTL = document.documentElement.getAttribute('dir') === 'rtl';
      const newRTL = !isCurrentlyRTL;
      applyRTL(newRTL);
      showCourtlyToast('Layout Direction', newRTL ? 'RTL Layout enabled' : 'LTR Layout enabled', 'info');
    });
  });
}

function applyRTL(isRTL) {
  if (isRTL) {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.classList.add('rtl');
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
    document.documentElement.classList.remove('rtl');
  }

  const drawer = document.getElementById('mobileNavDrawer');
  const backdrop = document.getElementById('mobileNavBackdrop');
  if (drawer) {
    const isClosed = !backdrop || backdrop.classList.contains('hidden');
    if (isRTL) {
      drawer.classList.remove('right-0', 'border-l', 'translate-x-full');
      drawer.classList.add('left-0', 'border-r');
      if (isClosed) drawer.classList.add('-translate-x-full');
    } else {
      drawer.classList.remove('left-0', 'border-r', '-translate-x-full');
      drawer.classList.add('right-0', 'border-l');
      if (isClosed) drawer.classList.add('translate-x-full');
    }
  }

  localStorage.setItem('courtly_rtl', isRTL ? 'true' : 'false');
  updateRTLButtons(isRTL);
}

function updateRTLButtons(isRTL) {
  const buttons = document.querySelectorAll('.rtl-toggle-text');
  buttons.forEach(btn => {
    btn.textContent = isRTL ? 'LTR' : 'RTL';
  });
  const icons = document.querySelectorAll('.rtl-toggle-icon svg');
  icons.forEach(svg => {
    svg.style.transform = isRTL ? 'scaleX(-1)' : 'scaleX(1)';
    svg.style.transition = 'transform 0.3s ease';
  });
  const rtlBtns = document.querySelectorAll('.rtl-toggle-btn');
  rtlBtns.forEach(btn => {
    btn.setAttribute('title', isRTL ? 'Switch to Left-to-Right (LTR)' : 'Switch to Right-to-Left (RTL)');
    btn.setAttribute('aria-label', isRTL ? 'Switch to Left-to-Right (LTR)' : 'Switch to Right-to-Left (RTL)');
    if (isRTL) {
      btn.classList.add('border-orange-500', 'text-orange-400');
    } else {
      btn.classList.remove('border-orange-500', 'text-orange-400');
    }
  });
}

/* ==========================================================================
   3. Sticky Header
   ========================================================================== */
function initHeader() {
  const header = document.querySelector('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('py-2', 'shadow-xl');
      header.classList.remove('py-4');
    } else {
      header.classList.remove('py-2', 'shadow-xl');
      header.classList.add('py-4');
    }
  });
}

/* ==========================================================================
   4. Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const drawer = document.getElementById('mobileNavDrawer');
  const closeBtn = document.getElementById('mobileMenuClose');
  const backdrop = document.getElementById('mobileNavBackdrop');

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.remove('translate-x-full', '-translate-x-full');
    if (backdrop) backdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
    drawer.classList.remove('translate-x-full', '-translate-x-full');
    if (isRTL) {
      drawer.classList.add('-translate-x-full');
    } else {
      drawer.classList.add('translate-x-full');
    }
    if (backdrop) backdrop.classList.add('hidden');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  const links = drawer.querySelectorAll('a');
  links.forEach(l => l.addEventListener('click', closeDrawer));
}

/* ==========================================================================
   5. Active Navigation Link Highlighting
   ========================================================================== */
function initActiveNav() {
  const path = window.location.pathname;
  let filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  if (!filename.includes('.html')) filename = 'index.html';

  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === filename || (filename === 'index.html' && (href === '/' || href === 'index.html'))) {
      link.classList.add('text-orange-500', 'font-bold');
      link.classList.remove('text-slate-300', 'text-slate-600');
    }
  });

  // If viewing Home 1 or Home 2, highlight the Home dropdown trigger button
  if (filename === 'index.html' || filename === 'home-2.html' || filename === '') {
    const homeBtn = document.querySelector('.home-dropdown-btn');
    if (homeBtn) {
      homeBtn.classList.add('text-orange-500', 'font-bold');
      homeBtn.classList.remove('text-slate-300', 'text-slate-600');
    }
  }
}

/* ==========================================================================
   6. Statistics Counter Animation
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter-val');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const endVal = parseInt(target.getAttribute('data-target') || '0', 10);
        const prefix = target.getAttribute('data-prefix') || '';
        const suffix = target.getAttribute('data-suffix') || '';
        const duration = 2000;
        const stepTime = 30;
        const totalSteps = duration / stepTime;
        const increment = endVal / totalSteps;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= endVal) {
            target.textContent = prefix + endVal.toLocaleString() + suffix;
            clearInterval(timer);
          } else {
            target.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
          }
        }, stepTime);

        obs.unobserve(target);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(c => observer.observe(c));
}

/* ==========================================================================
   7. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  let btn = document.getElementById('backToTopBtn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'backToTopBtn';
    btn.className = 'btn-court-primary rounded-full shadow-2xl';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>`;
    document.body.appendChild(btn);
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   8. Global Toast Notification System
   ========================================================================== */
window.showCourtlyToast = function(title, message, type = 'success') {
  let toast = document.getElementById('courtlyToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'courtlyToast';
    toast.className = 'fixed p-4 rounded-xl shadow-2xl z-50 flex items-start gap-3 border transition-all duration-300';
    document.body.appendChild(toast);
  }

  const isDark = document.body.classList.contains('dark');
  let iconSvg = '';
  let borderClass = '';
  let bgClass = isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900';

  if (type === 'success') {
    borderClass = 'border-orange-500/80';
    iconSvg = `<div class="w-7 h-7 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center flex-shrink-0"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg></div>`;
  } else if (type === 'error') {
    borderClass = 'border-red-500/80';
    iconSvg = `<div class="w-7 h-7 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center flex-shrink-0"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg></div>`;
  } else {
    borderClass = 'border-blue-500/80';
    iconSvg = `<div class="w-7 h-7 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center flex-shrink-0"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>`;
  }

  toast.className = `fixed p-4 rounded-xl shadow-2xl z-50 flex items-start gap-3 border transition-all duration-300 ${bgClass} ${borderClass}`;
  toast.innerHTML = `
    ${iconSvg}
    <div class="flex-1 pr-2">
      <h4 class="font-bold text-sm tracking-wide">${title}</h4>
      <p class="text-xs opacity-80 mt-0.5">${message}</p>
    </div>
    <button onclick="document.getElementById('courtlyToast').classList.remove('show')" class="text-xs opacity-50 hover:opacity-100 p-1">✕</button>
  `;

  setTimeout(() => toast.classList.add('show'), 50);

  if (window.toastTimeout) clearTimeout(window.toastTimeout);
  window.toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
};

/* ==========================================================================
   9. Form Validation Helper
   ========================================================================== */
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate="true"]');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const requiredInputs = form.querySelectorAll('[required]');
      let valid = true;

      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          valid = false;
          input.classList.add('border-red-500');
        } else {
          input.classList.remove('border-red-500');
        }
      });

      if (!valid) {
        showCourtlyToast('Validation Error', 'Please complete all required fields.', 'error');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 inline text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg> Processing...`;
      }

      setTimeout(() => {
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
        showCourtlyToast('Success!', 'Your request has been submitted to the Academy team.', 'success');
      }, 900);
    });
  });
}

/* ==========================================================================
   10. Program Tab Quick Jump & Active State Tracker
   ========================================================================== */
function initProgramTabs() {
  const tabBtns = document.querySelectorAll('.program-tab-btn');
  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = btn.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          tabBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const headerHeight = 85;
          const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
      }
    });
  });

  // Highlight active tab as user scrolls through program tracks
  const sections = ['#youth', '#beginner', '#advanced', '#specialized']
    .map(id => document.querySelector(id))
    .filter(Boolean);

  if (sections.length) {
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 160;
      sections.forEach(sec => {
        if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
          tabBtns.forEach(b => {
            if (b.getAttribute('href') === '#' + sec.id) {
              b.classList.add('active');
            } else {
              b.classList.remove('active');
            }
          });
        }
      });
    }, { passive: true });
  }
}


