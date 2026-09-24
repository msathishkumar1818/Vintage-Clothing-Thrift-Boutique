/**
 * VINTAGE CLOTHING & THRIFT BOUTIQUE - MAIN JAVASCRIPT
 * Unified global features: Loader, Dark Mode, RTL, Navigations, Mobile Drawer, Modals, Scroll-to-Top
 */

// Immediate theme execution to ensure dark mode styles apply before paint
(function () {
  try {
    const savedTheme = localStorage.getItem('boutique-theme');
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();

document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initThemeToggle();
  initDirectionToggle();
  initDesktopDropdown();
  initMobileMenu();
  initScrollTop();
  initAuthModal();
  initActiveNav();
  initCustomSelects();
  initCustomDatepickers();
});

/* --------------------------------------------------------------------------
   1. Branded Page Loader
   -------------------------------------------------------------------------- */
function initPageLoader() {
  const loader = document.getElementById('site-loader');
  if (!loader) return;

  const hideLoader = () => {
    loader.classList.add('hidden');
    setTimeout(() => {
      if (loader.parentNode) {
        loader.style.display = 'none';
      }
    }, 450);
  };

  // Ensure loader fades out cleanly
  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 250);
  } else {
    window.addEventListener('load', () => setTimeout(hideLoader, 250));
    // Fallback safety timeout
    setTimeout(hideLoader, 1500);
  }
}

/* --------------------------------------------------------------------------
   2. Strict Dark Mode (#000000)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeToggles = document.querySelectorAll('.theme-toggle-btn');
  const savedTheme = localStorage.getItem('boutique-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const updateLogos = (isDark) => {
    const logos = document.querySelectorAll('.loader-logo-img, .brand-logo-img, .footer-brand-logo, .auth-logo-img');
    logos.forEach(img => {
      img.src = isDark ? 'assets/images/icons/logo-bright.png' : 'assets/images/icons/logo.png';
    });
  };

  const applyTheme = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('boutique-theme', 'dark');
      updateThemeIcons(true);
      updateLogos(true);
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('boutique-theme', 'light');
      updateThemeIcons(false);
      updateLogos(false);
    }
  };

  const updateThemeIcons = (isDark) => {
    themeToggles.forEach(btn => {
      const textLabel = btn.querySelector('.theme-label-text');
      if (textLabel) {
        textLabel.textContent = isDark ? 'Light' : 'Dark';
      }
      const sunIcon = btn.querySelector('.sun-icon');
      const moonIcon = btn.querySelector('.moon-icon');
      if (sunIcon && moonIcon) {
        if (isDark) {
          sunIcon.style.display = 'block';
          moonIcon.style.display = 'none';
        } else {
          sunIcon.style.display = 'none';
          moonIcon.style.display = 'block';
        }
      }
    });
  };

  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    applyTheme(true);
  } else {
    applyTheme(false);
  }

  themeToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const isCurrentlyDark = document.documentElement.classList.contains('dark');
      applyTheme(!isCurrentlyDark);
    });
  });
}

/* --------------------------------------------------------------------------
   3. RTL / LTR Direction Toggle
   -------------------------------------------------------------------------- */
function initDirectionToggle() {
  const rtlToggles = document.querySelectorAll('.rtl-toggle-btn');
  const savedDir = localStorage.getItem('boutique-dir') || 'ltr';

  const setDirection = (dir) => {
    document.documentElement.dir = dir;
    localStorage.setItem('boutique-dir', dir);
    rtlToggles.forEach(btn => {
      const label = btn.querySelector('.rtl-label');
      if (label) {
        label.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      }
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to left to right layout' : 'Switch to right to left layout');
    });
  };

  setDirection(savedDir);

  rtlToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentDir = document.documentElement.dir || 'ltr';
      setDirection(currentDir === 'rtl' ? 'ltr' : 'rtl');
    });
  });
}

/* --------------------------------------------------------------------------
   4. Desktop Home Dropdown (CLICK ONLY - Never hover)
   -------------------------------------------------------------------------- */
function initDesktopDropdown() {
  const dropdownContainers = document.querySelectorAll('.nav-item-dropdown');

  dropdownContainers.forEach(container => {
    const toggleBtn = container.querySelector('.dropdown-toggle-btn');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = container.classList.contains('open');
      
      // Close any other open dropdowns first
      dropdownContainers.forEach(c => {
        if (c !== container) {
          c.classList.remove('open');
          const btn = c.querySelector('.dropdown-toggle-btn');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });

      container.classList.toggle('open', !isOpen);
      toggleBtn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    dropdownContainers.forEach(container => {
      if (!container.contains(e.target)) {
        container.classList.remove('open');
        const toggleBtn = container.querySelector('.dropdown-toggle-btn');
        if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdownContainers.forEach(container => {
        container.classList.remove('open');
        const toggleBtn = container.querySelector('.dropdown-toggle-btn');
        if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

/* --------------------------------------------------------------------------
   5. Mobile Drawer & Mobile Accordion
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const openBtn = document.getElementById('mobile-menu-open-btn');
  const closeBtn = document.getElementById('mobile-menu-close-btn');
  const overlay = document.getElementById('mobile-menu-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-sub-link');
  const mobileAccordion = document.getElementById('mobile-home-accordion');
  const mobileAccordionToggle = document.getElementById('mobile-home-toggle-btn');

  const openDrawer = () => {
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Always start with Home accordion closed by default
    if (mobileAccordion) {
      mobileAccordion.classList.remove('open');
    }
    if (mobileAccordionToggle) {
      mobileAccordionToggle.setAttribute('aria-expanded', 'false');
    }
  };

  const closeDrawer = () => {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    // Automatically close accordion on drawer close
    if (mobileAccordion) {
      mobileAccordion.classList.remove('open');
    }
    if (mobileAccordionToggle) {
      mobileAccordionToggle.setAttribute('aria-expanded', 'false');
    }
  };

  if (openBtn) openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeDrawer();
    });
  }

  // Close drawer on clicking ANY nav link
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Mobile Accordion (Click only)
  if (mobileAccordion && mobileAccordionToggle) {
    mobileAccordionToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = mobileAccordion.classList.contains('open');
      mobileAccordion.classList.toggle('open', !isOpen);
      mobileAccordionToggle.setAttribute('aria-expanded', String(!isOpen));
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Automatically close drawer when switching or resizing to desktop view (>= 1024px)
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024 && overlay && overlay.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* --------------------------------------------------------------------------
   6. Scroll-to-Top Button
   -------------------------------------------------------------------------- */
function initScrollTop() {
  const scrollBtn = document.getElementById('scroll-top-btn');
  const header = document.querySelector('.site-header');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Header subtle elevation
    if (header) {
      if (scrollPos > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Scroll to top button visibility
    if (scrollBtn) {
      if (scrollPos > 320) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

/* --------------------------------------------------------------------------
   7. Login / Register Modal
   -------------------------------------------------------------------------- */
function initAuthModal() {
  const modalOverlay = document.getElementById('auth-modal-overlay');
  const closeBtn = document.getElementById('auth-modal-close-btn');
  const openButtons = document.querySelectorAll('.open-login-btn, #header-login-btn, #mobile-login-btn');
  const tabLogin = document.getElementById('tab-login-btn');
  const tabRegister = document.getElementById('tab-register-btn');
  const loginForm = document.getElementById('form-login');
  const registerForm = document.getElementById('form-register');

  const openModal = (e) => {
    if (e) e.preventDefault();
    if (!modalOverlay) return;
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  openButtons.forEach(btn => btn.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  // Tab switching
  if (tabLogin && tabRegister && loginForm && registerForm) {
    tabLogin.addEventListener('click', () => {
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      loginForm.style.display = 'flex';
      registerForm.style.display = 'none';
    });

    tabRegister.addEventListener('click', () => {
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      registerForm.style.display = 'flex';
      loginForm.style.display = 'none';
    });
  }

  // Prevent default submission demo
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Welcome back to Vintage Clothing & Thrift Boutique!');
      closeModal();
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for creating an account with Vintage Clothing & Thrift Boutique!');
      closeModal();
    });
  }
}

/* --------------------------------------------------------------------------
   8. Active Navigation Detection
   -------------------------------------------------------------------------- */
function initActiveNav() {
  const currentPath = decodeURIComponent(window.location.pathname);
  let pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1);
  pageName = pageName.split('?')[0].split('#')[0];
  if (!pageName || pageName === '' || pageName === '/') {
    pageName = 'index.html';
  }

  const navLinks = document.querySelectorAll('.nav-link, .dropdown-item, .mobile-nav-link, .mobile-sub-link');
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle-btn');
  const mobileHomeToggle = document.getElementById('mobile-home-toggle-btn');

  // Reset all active classes first
  navLinks.forEach(link => link.classList.remove('active'));
  dropdownToggles.forEach(btn => btn.classList.remove('active'));
  if (mobileHomeToggle) mobileHomeToggle.classList.remove('active');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const cleanHref = href.split('?')[0].split('#')[0];

    if (cleanHref === pageName || (pageName === 'index.html' && (cleanHref === '' || cleanHref === './'))) {
      link.classList.add('active');

      // If it's a dropdown sub-item (e.g. Home 1 or Home 2), highlight desktop Home toggle button
      const parentDropdown = link.closest('.nav-item-dropdown');
      if (parentDropdown) {
        const toggleBtn = parentDropdown.querySelector('.dropdown-toggle-btn');
        if (toggleBtn) toggleBtn.classList.add('active');
      }

      // If it's in mobile menu home submenu (Home 1 or Home 2), highlight mobile Home toggle
      const mobileSubmenu = link.closest('.mobile-submenu');
      if (mobileSubmenu && mobileHomeToggle) {
        mobileHomeToggle.classList.add('active');
      }
    }
  });
}

/* --------------------------------------------------------------------------
   9. Luxury Custom Select Dropdowns (No OS Popup Overflow)
   -------------------------------------------------------------------------- */
function initCustomSelects() {
  const selects = document.querySelectorAll('select.form-input');
  if (!selects.length) return;

  selects.forEach(select => {
    if (select.dataset.customized === 'true') return;
    select.dataset.customized = 'true';

    // Hide native select visually while keeping accessible for form submission
    select.classList.add('custom-select-hidden');

    // Create custom wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-select-wrapper';

    // Insert wrapper before select and move select into wrapper
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);

    // Create trigger button
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'custom-select-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');

    const selectedOption = select.options[select.selectedIndex] || select.options[0];
    const initialText = selectedOption ? selectedOption.textContent : 'Select...';

    trigger.innerHTML = `
      <span class="custom-select-label">${initialText}</span>
      <svg class="custom-select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    `;

    // Create options dropdown menu
    const menu = document.createElement('div');
    menu.className = 'custom-select-menu';
    menu.setAttribute('role', 'listbox');

    Array.from(select.options).forEach((opt, idx) => {
      const optionItem = document.createElement('div');
      optionItem.className = 'custom-select-option' + (idx === select.selectedIndex ? ' selected' : '');
      optionItem.setAttribute('role', 'option');
      optionItem.setAttribute('data-value', opt.value);
      optionItem.textContent = opt.textContent;

      optionItem.addEventListener('click', (e) => {
        e.stopPropagation();
        select.value = opt.value;
        select.selectedIndex = idx;
        trigger.querySelector('.custom-select-label').textContent = opt.textContent;

        menu.querySelectorAll('.custom-select-option').forEach(el => el.classList.remove('selected'));
        optionItem.classList.add('selected');

        wrapper.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');

        // Dispatch change event so existing listeners / validation fire
        select.dispatchEvent(new Event('change', { bubbles: true }));
      });

      menu.appendChild(optionItem);
    });

    wrapper.appendChild(trigger);
    wrapper.appendChild(menu);

    // Toggle dropdown on trigger click
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = wrapper.classList.contains('open');

      // Close all other open custom selects
      document.querySelectorAll('.custom-select-wrapper.open').forEach(other => {
        if (other !== wrapper) {
          other.classList.remove('open');
          const otherTrigger = other.querySelector('.custom-select-trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      wrapper.classList.toggle('open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // Close when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.custom-select-wrapper.open').forEach(wrapper => {
      wrapper.classList.remove('open');
      const trigger = wrapper.querySelector('.custom-select-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.custom-select-wrapper.open').forEach(wrapper => {
        wrapper.classList.remove('open');
        const trigger = wrapper.querySelector('.custom-select-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

/* --------------------------------------------------------------------------
   10. Luxury Custom Datepicker (Zero OS Popup Overflow)
   -------------------------------------------------------------------------- */
function initCustomDatepickers() {
  const dateInputs = document.querySelectorAll('input[type="date"]');
  if (!dateInputs.length) return;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  dateInputs.forEach(input => {
    if (input.dataset.datepickerInit === 'true') return;
    input.dataset.datepickerInit = 'true';

    // Hide native date input
    input.classList.add('custom-datepicker-hidden');

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-datepicker-wrapper';
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);

    // Initial date tracking
    let currentSelectedDate = input.value ? new Date(input.value + 'T00:00:00') : null;
    let viewingDate = currentSelectedDate ? new Date(currentSelectedDate) : new Date();

    // Create trigger button
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'custom-datepicker-trigger';
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-expanded', 'false');

    const updateTriggerText = () => {
      if (currentSelectedDate && !isNaN(currentSelectedDate.getTime())) {
        const y = currentSelectedDate.getFullYear();
        const m = String(currentSelectedDate.getMonth() + 1).padStart(2, '0');
        const d = String(currentSelectedDate.getDate()).padStart(2, '0');
        trigger.querySelector('.custom-datepicker-label').textContent = `${y}-${m}-${d}`;
        trigger.classList.add('has-value');
      } else {
        trigger.querySelector('.custom-datepicker-label').textContent = 'Select date (YYYY-MM-DD)';
        trigger.classList.remove('has-value');
      }
    };

    trigger.innerHTML = `
      <span class="custom-datepicker-label">Select date (YYYY-MM-DD)</span>
      <svg class="custom-datepicker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    `;
    updateTriggerText();
    wrapper.appendChild(trigger);

    // Create Calendar Popup
    const popup = document.createElement('div');
    popup.className = 'custom-datepicker-popup';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-label', 'Calendar Picker');
    wrapper.appendChild(popup);

    const renderCalendar = () => {
      const year = viewingDate.getFullYear();
      const month = viewingDate.getMonth();

      const firstDayIndex = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const daysInPrevMonth = new Date(year, month, 0).getDate();

      const today = new Date();
      const isCurrentMonthToday = today.getFullYear() === year && today.getMonth() === month;

      let html = `
        <div class="calendar-header">
          <button type="button" class="calendar-nav-btn prev-month-btn" aria-label="Previous Month">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <div class="calendar-current-month">${monthNames[month]} ${year}</div>
          <button type="button" class="calendar-nav-btn next-month-btn" aria-label="Next Month">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
        <div class="calendar-weekdays">
          ${dayNames.map(d => `<span class="calendar-weekday">${d}</span>`).join('')}
        </div>
        <div class="calendar-days-grid">
      `;

      // Previous month filler days
      for (let i = firstDayIndex - 1; i >= 0; i--) {
        const d = daysInPrevMonth - i;
        html += `<button type="button" class="calendar-day-cell prev-month-day" disabled>${d}</button>`;
      }

      // Current month days
      for (let day = 1; day <= daysInMonth; day++) {
        const isToday = isCurrentMonthToday && today.getDate() === day;
        const isSelected = currentSelectedDate &&
          currentSelectedDate.getFullYear() === year &&
          currentSelectedDate.getMonth() === month &&
          currentSelectedDate.getDate() === day;

        const classes = [
          'calendar-day-cell',
          isToday ? 'today' : '',
          isSelected ? 'selected' : ''
        ].filter(Boolean).join(' ');

        html += `<button type="button" class="${classes}" data-day="${day}">${day}</button>`;
      }

      // Next month filler days to complete grid
      const totalCells = firstDayIndex + daysInMonth;
      const remainingCells = (7 - (totalCells % 7)) % 7;
      for (let j = 1; j <= remainingCells; j++) {
        html += `<button type="button" class="calendar-day-cell next-month-day" disabled>${j}</button>`;
      }

      html += `
        </div>
        <div class="calendar-footer">
          <button type="button" class="calendar-action-btn clear-btn">Clear Date</button>
          <button type="button" class="calendar-action-btn today-btn">Select Today</button>
        </div>
      `;

      popup.innerHTML = html;

      // Event listeners for calendar controls
      popup.querySelector('.prev-month-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        viewingDate.setMonth(viewingDate.getMonth() - 1);
        renderCalendar();
      });

      popup.querySelector('.next-month-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        viewingDate.setMonth(viewingDate.getMonth() + 1);
        renderCalendar();
      });

      popup.querySelectorAll('.calendar-day-cell:not([disabled])').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const day = parseInt(btn.dataset.day, 10);
          currentSelectedDate = new Date(year, month, day);

          const y = currentSelectedDate.getFullYear();
          const m = String(currentSelectedDate.getMonth() + 1).padStart(2, '0');
          const d = String(currentSelectedDate.getDate()).padStart(2, '0');
          input.value = `${y}-${m}-${d}`;
          input.dispatchEvent(new Event('change', { bubbles: true }));

          updateTriggerText();
          wrapper.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
        });
      });

      popup.querySelector('.today-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        const now = new Date();
        currentSelectedDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        viewingDate = new Date(currentSelectedDate);

        const y = currentSelectedDate.getFullYear();
        const m = String(currentSelectedDate.getMonth() + 1).padStart(2, '0');
        const d = String(currentSelectedDate.getDate()).padStart(2, '0');
        input.value = `${y}-${m}-${d}`;
        input.dispatchEvent(new Event('change', { bubbles: true }));

        updateTriggerText();
        wrapper.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      });

      popup.querySelector('.clear-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        currentSelectedDate = null;
        input.value = '';
        input.dispatchEvent(new Event('change', { bubbles: true }));

        updateTriggerText();
        renderCalendar();
      });
    };

    renderCalendar();

    // Toggle popup
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = wrapper.classList.contains('open');

      // Close all other pickers and selects
      document.querySelectorAll('.custom-datepicker-wrapper.open, .custom-select-wrapper.open').forEach(el => {
        if (el !== wrapper) {
          el.classList.remove('open');
          const t = el.querySelector('button');
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });

      if (!isOpen) {
        if (currentSelectedDate) {
          viewingDate = new Date(currentSelectedDate);
        } else {
          viewingDate = new Date();
        }
        renderCalendar();
      }

      wrapper.classList.toggle('open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // Global close on click outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.custom-datepicker-wrapper.open').forEach(wrapper => {
      wrapper.classList.remove('open');
      const trigger = wrapper.querySelector('.custom-datepicker-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  });

  // Global close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.custom-datepicker-wrapper.open').forEach(wrapper => {
        wrapper.classList.remove('open');
        const trigger = wrapper.querySelector('.custom-datepicker-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
    }
  });
}


