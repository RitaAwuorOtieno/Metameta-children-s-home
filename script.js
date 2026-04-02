document.addEventListener('DOMContentLoaded', () => {
  // Active nav
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav a");
  navLinks.forEach((link) => {
    const linkPath = link.getAttribute("href");
    if (linkPath === currentPath) {
      link.classList.add("active");
    }
  });

  // Hamburger menu toggle
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');
  
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', nav.classList.contains('active'));
      
      // Close when clicking link
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          nav.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
        });
      });
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('active')) {
        nav.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !hamburger.contains(e.target) && nav.classList.contains('active')) {
        nav.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Reveal animations
  const revealItems = document.querySelectorAll(".reveal");
  if (revealItems.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  // Counter animations
  const countUpItems = document.querySelectorAll("[data-count]");
  if (countUpItems.length > 0) {
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = Number(el.dataset.count);
          const suffix = el.dataset.suffix || "";
          let current = 0;
          const step = Math.max(1, Math.floor(target / 60));
          const tick = () => {
            current += step;
            if (current >= target) {
              el.textContent = `${target.toLocaleString()}${suffix}`;
              return;
            }
            el.textContent = `${current.toLocaleString()}${suffix}`;
            requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.6 }
    );
    countUpItems.forEach((item) => countObserver.observe(item));
  }

  // NEW: Header scroll effect
  const header = document.querySelector('.site-header');
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Header hide/show on scroll direction
    if (currentScrollY > lastScrollY && currentScrollY > 200) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }
    
    lastScrollY = currentScrollY;
  });

  // NEW: Hero Slider Functionality
  let currentSlide = 0;
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  let autoSlideInterval;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
      dots[i].classList.toggle('active', i === index);
    });
    currentSlide = index;
  }

  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  function prevSlide() {
    const prev = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    showSlide(prev);
  }

  // Navigation
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
  });

  // Auto-advance (5 seconds)
  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // Pause on hover
  const slider = document.querySelector('.hero-slider');
  if (slider) {
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  // Start slider
  if (slides.length > 0) {
    showSlide(0);
    startAutoSlide();
  }

  // Existing Alumni Modal functionality preserved
  window.openAlumniModal = function() {
    const modal = document.getElementById('alumniModal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      stopAutoSlide(); // Pause slider when modal opens
    }
  };

  window.closeAlumniModal = function() {
    const modal = document.getElementById('alumniModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // Photo preview
  window.previewPhoto = function(event) {
    const input = event.target;
    const preview = document.getElementById('photoPreview');
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        preview.classList.add('has-image');
      };
      reader.readAsDataURL(input.files[0]);
    }
  };

  // Alumni submission functions (existing preserved)
  window.saveAlumniSubmission = function(data) {
    let submissions = JSON.parse(localStorage.getItem('alumniSubmissions') || '[]');
    submissions.unshift(data);
    localStorage.setItem('alumniSubmissions', JSON.stringify(submissions));
  };

  window.createAlumniCard = function(alumni, index) {
    const photoHTML = alumni.photo 
      ? `<a class="testimonial-photo-link" href="${alumni.photo}" target="_blank" rel="noopener">
          <img class="testimonial-photo" src="${alumni.photo}" alt="${alumni.name}">
         </a>`
      : `<div class="testimonial-photo-placeholder">${alumni.name.charAt(0)}</div>`;
    
    const statusHTML = alumni.currentStatus ? `<span class="testimonial-status">${alumni.currentStatus}</span>` : '';
    
    return `
      <article class="testimonial-card" data-index="${index}">
        ${photoHTML}
        <div class="testimonial-quote">❝</div>
        <p>${alumni.story}</p>
        ${alumni.lifeUpdate ? `<div class="life-update">Now: ${alumni.lifeUpdate}</div>` : ''}
        <div class="testimonial-meta">
          <div>
            <span class="testimonial-name">${alumni.name}</span>
            ${statusHTML}
          </div>
          <span class="testimonial-year">${alumni.year}</span>
        </div>
        ${alumni.encouragement ? `<div class="encouragement-note">💬 ${alumni.encouragement}</div>` : ''}
      </article>
    `;
  };

  window.loadAlumniSubmissions = function() {
    const grid = document.getElementById('alumniSubmissionsGrid');
    if (!grid) return;
    const submissions = JSON.parse(localStorage.getItem('alumniSubmissions') || '[]');
    if (submissions.length > 0) {
      const section = document.getElementById('alumniSubmissionsSection');
      if (section) section.style.display = 'block';
      grid.innerHTML = submissions.map((alumni, index) => createAlumniCard(alumni, index)).join('');
    }
  };

  // Load alumni on page load
  loadAlumniSubmissions();

  // Theme Toggle Functionality
  const themeToggle = document.querySelector('.theme-toggle');
  const themeIcon = document.querySelector('.theme-icon');
  
  // Check for saved theme preference or default to light
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeIcon) themeIcon.textContent = '🌙';
  }
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      if (newTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeIcon) themeIcon.textContent = '🌙';
      } else {
        document.documentElement.removeAttribute('data-theme');
        if (themeIcon) themeIcon.textContent = '☀️';
      }
      
      // Save preference
      localStorage.setItem('theme', newTheme);
    });
  }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^=\"#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});
