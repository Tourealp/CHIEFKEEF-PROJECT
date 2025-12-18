// ============================================
// CHIEF KEEF - OPTIMIZED SCRIPT.JS
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  // Utility functions
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ============================================
  // 1. BURGER MENU & MOBILE NAVIGATION
  // ============================================
  const burgerMenu = $("#burgerMenu");
  const menu = $("#menu");
  const navbar = $("#navbar");

  if (burgerMenu && menu) {
    burgerMenu.addEventListener("click", (e) => {
      e.stopPropagation();
      burgerMenu.classList.toggle("active");
      menu.classList.toggle("active");
      document.body.style.overflow = menu.classList.contains("active") ? "hidden" : "";
    });

    document.addEventListener("click", (e) => {
      if (!menu.contains(e.target) && !burgerMenu.contains(e.target)) {
        burgerMenu.classList.remove("active");
        menu.classList.remove("active");
        document.body.style.overflow = "";
      }
    });

    $$(".menu .dropdown a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 480) {
          burgerMenu.classList.remove("active");
          menu.classList.remove("active");
          document.body.style.overflow = "";
        }
      });
    });

    const homeLink = $(".menu .home");
    if (homeLink) {
      homeLink.addEventListener("click", () => {
        if (window.innerWidth <= 480) {
          burgerMenu.classList.remove("active");
          menu.classList.remove("active");
          document.body.style.overflow = "";
        }
      });
    }
  }

  // ============================================
  // 2. DROPDOWN MENU (MOBILE)
  // ============================================
  const dropdownItems = $$(".artist_dropdown, .live_dropdown, .music_dropdown, .contact_dropdown");

  dropdownItems.forEach((item) => {
    const link = item.querySelector("a");
    if (!link) return;

    link.addEventListener("click", (e) => {
      if (window.innerWidth <= 480) {
        e.preventDefault();
        e.stopPropagation();
        item.classList.toggle("active");

        dropdownItems.forEach((other) => {
          if (other !== item) other.classList.remove("active");
        });
      }
    });
  });

  // ============================================
  // 3. SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href || href === "#") {
        if (this.classList.contains("dropdown-toggle")) {
          return;
        }
      }

      const target = $(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        if (burgerMenu && menu && window.innerWidth <= 480) {
          burgerMenu.classList.remove("active");
          menu.classList.remove("active");
          document.body.style.overflow = "";
        }
      }
    });
  });

  // ============================================
  // 4. NAVBAR SCROLL EFFECT
  // ============================================
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateNavbar() {
    if (window.scrollY > 100) {
      navbar?.classList.add("nav--solid");
    } else {
      navbar?.classList.remove("nav--solid");
    }
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });

  // ============================================
  // 5. INTERSECTION OBSERVER - REVEAL SECTIONS
  // ============================================
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -80px 0px",
    }
  );

  $$(".hidden").forEach((section) => {
    revealObserver.observe(section);
  });

  // ============================================
  // 6. HERO VIDEO WITH POSTER TRANSITION
  // ============================================
  window.addEventListener('load', function() {
    const video = document.getElementById('heroVideo');
    const container = document.querySelector('.video-background');

    if (!video || !container) return;

    // Charger la vidéo de manière différée
    setTimeout(function() {
      video.autoplay = true;
      video.play().catch(err => console.log('Autoplay non disponible:', err));

      // Ajouter la classe quand la vidéo commence à jouer
      video.addEventListener('playing', function() {
        container.classList.add('video-loaded');
      }, { once: true });

    }, 100); // Petit délai pour laisser le rendu du poster
  });

  // ============================================
  // 7. HERO PARALLAX EFFECT
  // ============================================
  const heroContent = $(".hero-content");
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let parallaxTicking = false;

  function updateParallax() {
    if (prefersReducedMotion) return;
    const scrollY = window.scrollY;
    if (heroContent && scrollY < window.innerHeight) {
      const translateY = scrollY * 0.45;
      const opacity = Math.max(0.3, 1 - scrollY / (window.innerHeight * 0.85));
      heroContent.style.transform = `translateY(${translateY}px)`;
      heroContent.style.opacity = opacity;
    }
    parallaxTicking = false;
  }

  window.addEventListener("scroll", () => {
    if (!parallaxTicking) {
      requestAnimationFrame(updateParallax);
      parallaxTicking = true;
    }
  }, { passive: true });

  // ============================================
  // 8. STATS COUNTER ANIMATION
  // ============================================
  const aboutSection = $("#about");

  if (aboutSection) {
    const counters = [];
    const duration = 2500;

    const statsObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          $$(".stat-item[data-count]", entry.target).forEach((item) => {
            const target = parseInt(item.getAttribute("data-count") || "0", 10);
            const numEl = item.querySelector(".stat-number") || item.querySelector("h3");
            if (numEl) {
              counters.push({ el: numEl, target, current: 0 });
            }
          });

          let startTime = null;

          function animateCounters(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            let allDone = true;

            counters.forEach((counter) => {
              if (counter.current >= counter.target) return;

              allDone = false;
              const percentage = Math.min(progress / duration, 1);
              const easeOut = 1 - Math.pow(1 - percentage, 3);
              counter.current = Math.floor(easeOut * counter.target);
              counter.el.textContent = counter.current;
            });

            if (!allDone) {
              requestAnimationFrame(animateCounters);
            } else {
              counters.forEach((c) => (c.el.textContent = c.target));
            }
          }

          requestAnimationFrame(animateCounters);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );

    statsObserver.observe(aboutSection);
  }

  // ============================================
  // 9. PARTICLES CANVAS (OPTIMIZED)
  // ============================================
  const canvas = $("#particles-canvas");
  
  if (canvas) {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      canvas.style.display = "none";
    } else {
      const ctx = canvas.getContext("2d", { alpha: true });
      let w = (canvas.width = window.innerWidth);
      let h = (canvas.height = window.innerHeight);
      const particles = [];
      const particleCount = 40;
      const connectionDistance = 120;
      const connectionDistanceSq = connectionDistance * connectionDistance;

      class Particle {
        constructor() {
          this.reset();
        }
        reset() {
          this.x = Math.random() * w;
          this.y = Math.random() * h;
          this.size = Math.random() * 2.5 + 0.8;
          this.vx = Math.random() * 0.6 - 0.3;
          this.vy = Math.random() * 0.6 - 0.3;
          this.opacity = Math.random() * 0.6 + 0.2;
        }
        update() {
          this.x += this.vx;
          this.y += this.vy;
          if (this.x > w) this.x = 0;
          if (this.x < 0) this.x = w;
          if (this.y > h) this.y = 0;
          if (this.y < 0) this.y = h;
        }
        draw() {
          ctx.fillStyle = `rgba(255,255,0,${this.opacity})`;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }

      let lastFrameTime = 0;
      const targetFPS = 30;
      const frameInterval = 1000 / targetFPS;
      let isCanvasVisible = true;
      let animationId = null;

      function loop(currentTime) {
        animationId = requestAnimationFrame(loop);

        if (!isCanvasVisible) return;

        const elapsed = currentTime - lastFrameTime;
        if (elapsed < frameInterval) return;
        lastFrameTime = currentTime - (elapsed % frameInterval);

        ctx.clearRect(0, 0, w, h);

        particles.forEach((p) => {
          p.update();
          p.draw();
        });

        for (let i = 0; i < particles.length; i++) {
          let connectionsDrawn = 0;
          const maxConnections = 3;

          for (let j = i + 1; j < particles.length && connectionsDrawn < maxConnections; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distSq = dx * dx + dy * dy;

            if (distSq < connectionDistanceSq) {
              const opacity = 0.15 * (1 - distSq / connectionDistanceSq);
              ctx.strokeStyle = `rgba(255,255,0,${opacity})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
              connectionsDrawn++;
            }
          }
        }
      }

      if ("IntersectionObserver" in window) {
        const canvasObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              isCanvasVisible = entry.isIntersecting;
              if (!isCanvasVisible && animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
              } else if (isCanvasVisible && !animationId) {
                animationId = requestAnimationFrame(loop);
              }
            });
          },
          { threshold: 0.1 }
        );
        canvasObserver.observe(canvas);
      }

      animationId = requestAnimationFrame(loop);

      let resizeTimeout;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          const newIsMobile = window.innerWidth <= 768;
          if (newIsMobile) {
            canvas.style.display = "none";
            if (animationId) {
              cancelAnimationFrame(animationId);
              animationId = null;
            }
            return;
          }
          canvas.style.display = "block";
          w = canvas.width = window.innerWidth;
          h = canvas.height = window.innerHeight;
          particles.forEach((p) => p.reset());
          if (!animationId && isCanvasVisible) {
            animationId = requestAnimationFrame(loop);
          }
        }, 200);
      }, { passive: true });
    }
  }

  // ============================================
  // 10. ALBUM CARDS HOVER EFFECT
  // ============================================
  $$(".album-card1, .album-card2, .album-card3").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transition = "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";
    });
  });

  // ============================================
  // 11. NEWSLETTER FORM
  // ============================================
  const newsletterForm = $(".newsletter-form");
  
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = newsletterForm.querySelector('input[type="text"]')?.value || "";
      const email = newsletterForm.querySelector('input[type="email"]')?.value || "";

      if (email) {
        const btn = newsletterForm.querySelector(".btn-solid");
        const originalText = btn.textContent;
        btn.textContent = "✓ SUBSCRIBED!";
        btn.style.background = "#00ff00";
        btn.style.color = "#000";

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = "";
          btn.style.color = "";
          newsletterForm.reset();
        }, 2500);

        console.log("Newsletter subscription:", { name, email });
      }
    });
  }

  // ============================================
  // 12. VIDEO LAZY LOADING
  // ============================================
  const videoContainer = $(".video-container");
  
  if (videoContainer) {
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const iframe = entry.target.querySelector("iframe");
            if (iframe && !iframe.src) {
              iframe.src = iframe.getAttribute("data-src");
            }
            videoObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    videoObserver.observe(videoContainer);
  }

  // ============================================
  // 13. DYNAMIC YEAR IN FOOTER
  // ============================================
  const yearElement = $("#year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ============================================
  // 14. SCROLL TO TOP BUTTON
  // ============================================
  const scrollIndicator = $(".scroll-indicator");
  
  if (scrollIndicator) {
    scrollIndicator.addEventListener("click", () => {
      window.scrollTo({
        top: document.querySelector("#about")?.offsetTop || 0,
        behavior: "smooth",
      });
    });
  }

  // ============================================
  // 15. KEYBOARD NAVIGATION (ACCESSIBILITY)
  // ============================================
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu?.classList.contains("active")) {
      burgerMenu?.classList.remove("active");
      menu?.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // ============================================
  // 16. PREVENT FOUC
  // ============================================
  document.body.style.opacity = "1";

  // ============================================
  // 17. MOBILE SLIDESHOW FOR CARDS
  // ============================================
  function initSlideshow(containerSelector, cardSelector) {
    const container = $(containerSelector);
    if (!container) return;

    if (window.innerWidth > 425) return;

    const cards = container.querySelectorAll(cardSelector);
    if (cards.length <= 1) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'slideshow-wrapper';
    container.parentNode.insertBefore(wrapper, container);
    wrapper.appendChild(container);

    const controls = document.createElement('div');
    controls.className = 'slideshow-controls';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'slideshow-btn';
    prevBtn.innerHTML = '‹';
    prevBtn.setAttribute('aria-label', 'Previous');
    controls.appendChild(prevBtn);

    const indicators = document.createElement('div');
    indicators.className = 'slideshow-indicators';
    cards.forEach((_, index) => {
      const indicator = document.createElement('div');
      indicator.className = 'slideshow-indicator';
      if (index === 0) indicator.classList.add('active');
      indicator.setAttribute('data-index', index);
      indicators.appendChild(indicator);
    });
    controls.appendChild(indicators);

    const nextBtn = document.createElement('button');
    nextBtn.className = 'slideshow-btn';
    nextBtn.innerHTML = '›';
    nextBtn.setAttribute('aria-label', 'Next');
    controls.appendChild(nextBtn);

    wrapper.appendChild(controls);

    let currentIndex = 0;
    const totalCards = cards.length;

    function updateSlideshow() {
      container.scrollTo({
        left: currentIndex * container.offsetWidth,
        behavior: 'smooth'
      });

      indicators.querySelectorAll('.slideshow-indicator').forEach((ind, idx) => {
        ind.classList.toggle('active', idx === currentIndex);
      });
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % totalCards;
      updateSlideshow();
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + totalCards) % totalCards;
      updateSlideshow();
    }

    function goToSlide(index) {
      currentIndex = index;
      updateSlideshow();
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    indicators.querySelectorAll('.slideshow-indicator').forEach((ind, idx) => {
      ind.addEventListener('click', () => goToSlide(idx));
    });

    let touchStartX = 0;
    let touchEndX = 0;

    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });

    function handleSwipe() {
      const swipeThreshold = 50;
      if (touchStartX - touchEndX > swipeThreshold) {
        nextSlide();
      } else if (touchEndX - touchStartX > swipeThreshold) {
        prevSlide();
      }
    }

    let autoplayInterval;
    function startAutoplay() {
      autoplayInterval = setInterval(() => {
        nextSlide();
      }, 5000);
    }

    function stopAutoplay() {
      clearInterval(autoplayInterval);
    }

    wrapper.addEventListener('mouseenter', stopAutoplay);
    wrapper.addEventListener('mouseleave', startAutoplay);
    wrapper.addEventListener('touchstart', stopAutoplay);

    startAutoplay();
  }

  let slideshowsInitialized = false;

  function initMobileSlideshows() {
    if (window.innerWidth <= 425 && !slideshowsInitialized) {
      initSlideshow('.albums-grid', '.album-card1, .album-card2, .album-card3');
      initSlideshow('.stats-grid', '.stat-item');
      slideshowsInitialized = true;
    }
  }

  initMobileSlideshows();

  let resizeTimeout;
  let wasMobile = window.innerWidth <= 425;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const isMobile = window.innerWidth <= 425;
      if (isMobile !== wasMobile) {
        wasMobile = isMobile;
        if (isMobile && !slideshowsInitialized) {
          initMobileSlideshows();
        } else if (!isMobile && slideshowsInitialized) {
          document.querySelectorAll('.slideshow-wrapper').forEach(wrapper => {
            const container = wrapper.querySelector('.albums-grid, .stats-grid');
            if (container) {
              wrapper.parentNode.insertBefore(container, wrapper);
              wrapper.remove();
            }
          });
          slideshowsInitialized = false;
        }
      }
    }, 250);
  });



  // ============================================
  // 19. YOUTUBE VIDEO WITH FALLBACK
  // ============================================
  function initYouTubePlayer() {
    const youtubeVideoId = 'z0p0tAwRlU8'; // The Therapist: Chief Keef
    let fallbackTriggered = false;

    // Fonction pour activer la vidéo locale
    function switchToLocalVideo() {
      if (fallbackTriggered) return;
      fallbackTriggered = true;

      console.log("🎬 YouTube indisponible : Chargement de la vidéo locale...");
      
      // 1. Cacher YouTube
      const ytElement = $("#youtube-player");
      if (ytElement) ytElement.style.display = 'none';
      
      // 2. Préparer la vidéo locale
      const localVideo = $("#local-fallback");
      if (localVideo) {
        const sourceTag = localVideo.querySelector('source');
        
        if (sourceTag && sourceTag.getAttribute('data-src')) {
          sourceTag.src = sourceTag.getAttribute('data-src');
          localVideo.load();
        }
        
        // 3. Afficher la vidéo
        localVideo.classList.remove('d-none');
        console.log("✅ Vidéo locale chargée");
      }
    }

    // Méthode 1 : L'API YouTube
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

    let player;
    
    window.onYouTubeIframeAPIReady = function() {
      try {
        player = new YT.Player('youtube-player', {
          height: '100%',
          width: '100%',
          videoId: youtubeVideoId,
          events: {
            'onError': onPlayerError,
            'onReady': function() { 
              clearTimeout(fallbackTimer);
              console.log("✅ YouTube chargé avec succès");
            }
          },
          playerVars: {
            'rel': 0,
          }
        });
      } catch(err) {
        console.error("❌ YouTube Player error:", err);
        switchToLocalVideo();
      }
    };

    // Si YouTube renvoie une erreur
    window.onPlayerError = function(event) {
      console.error("❌ YouTube error:", event);
      switchToLocalVideo();
    };

    // Méthode 2 : Le Timer de sécurité (3 secondes)
    const fallbackTimer = setTimeout(function() {
      if (!window.YT || !player) {
        console.log("⏱️ YouTube timeout : Activation du fallback");
        switchToLocalVideo();
      }
    }, 3000);
  }

  // Initialiser YouTube Player
  initYouTubePlayer();

  // ============================================
  // 20. AUDIO PLAYER - COMPLETE
  // ============================================
  const audioBtn = $("#audioPlayBtn");
  const audioPlayer = $("#audioPlayer");
  const currentSongEl = $("#currentSong");
  const songInfo = $("#songInfo");
  const playIcon = $(".play-icon");
  const pauseIcon = $(".pause-icon");

  if (audioBtn && audioPlayer && currentSongEl) {
    let showInfo = true;

    // Déterminer le chemin correct selon la localisation du fichier
    const isPages = window.location.pathname.includes('/pages/');
    const audioPath = isPages ? '../audios/' : 'audios/';

    const songs = [
      { src: audioPath + 'sosa_chamb.mp3', name: 'SOSA CHAMB' },
      { src: audioPath + 'whatup.mp3', name: 'What Up' },
      { src: audioPath + 'himalaya.mp3', name: 'HIMALAYA' }
    ];

    let currentSongIndex = 0;

    function loadSong(index) {
      audioPlayer.src = songs[index].src;
      currentSongEl.textContent = songs[index].name;
      currentSongIndex = index;
      console.log("🎵 Chargement:", songs[index].name, "->", songs[index].src);
    }

    audioBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      if (audioPlayer.paused) {
        audioPlayer.play().catch(err => console.error("Erreur lecture audio:", err));
        audioBtn.classList.add('playing');
        if (playIcon) playIcon.style.display = 'none';
        if (pauseIcon) pauseIcon.style.display = 'flex';
      } else {
        audioPlayer.pause();
        audioBtn.classList.remove('playing');
        if (playIcon) playIcon.style.display = 'flex';
        if (pauseIcon) pauseIcon.style.display = 'none';
      }
    });

    audioBtn.addEventListener('dblclick', function(e) {
      e.preventDefault();
      e.stopPropagation();
      showInfo = !showInfo;
      if (songInfo) songInfo.classList.toggle('hidden');
    });

    currentSongEl?.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      audioBtn.classList.toggle('hidden');
    });

    audioPlayer.addEventListener('ended', function() {
      currentSongIndex = (currentSongIndex + 1) % songs.length;
      loadSong(currentSongIndex);
      audioPlayer.play().catch(err => console.error("Erreur lecture audio:", err));
    });

    loadSong(0);
    console.log("✅ Audio player initialized - Path:", audioPath);
  } else {
    console.warn("⚠️ Audio player elements not found");
  }




        // Impact slideshow auto-play
        const impactSlideshow = document.getElementById('impactSlideshow');
        if (impactSlideshow) {
            let currentSlide = 0;
            const slides = impactSlideshow.querySelectorAll('.impact-slide');

            function goToSlide(idx) {
                currentSlide = (idx + slides.length) % slides.length;
                const targetLeft = slides[currentSlide].offsetLeft;
                impactSlideshow.scrollTo({ left: targetLeft, behavior: 'smooth' });
                updateIndicators();
            }

            function updateIndicators() {
                document.querySelectorAll('#impactIndicators .slideshow-indicator').forEach((ind, idx) => {
                    ind.classList.toggle('active', idx === currentSlide);
                });
            }

            const controls = document.createElement('div');
            controls.className = 'impact-slideshow-controls';
            controls.innerHTML = `
                <button class="slideshow-btn" id="prevImpact">‹</button>
                <div class="slideshow-indicators" id="impactIndicators"></div>
                <button class="slideshow-btn" id="nextImpact">›</button>
            `;
            impactSlideshow.parentNode.appendChild(controls);

            const indicators = controls.querySelector('#impactIndicators');
            slides.forEach((_, idx) => {
                const ind = document.createElement('div');
                ind.className = 'slideshow-indicator' + (idx === 0 ? ' active' : '');
                ind.addEventListener('click', () => goToSlide(idx));
                indicators.appendChild(ind);
            });

            controls.querySelector('#nextImpact').addEventListener('click', () => goToSlide(currentSlide + 1));
            controls.querySelector('#prevImpact').addEventListener('click', () => goToSlide(currentSlide - 1));

            let touchStartX = 0;
            let touchEndX = 0;
            impactSlideshow.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; });
            impactSlideshow.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                if (touchEndX - touchStartX > 50) { goToSlide(currentSlide - 1); }
                else if (touchStartX - touchEndX > 50) { goToSlide(currentSlide + 1); }
            });

            setInterval(() => { goToSlide(currentSlide + 1); }, 5000);
        }

        // Areas of Impact pagination controls (desktop + mobile)
        {
            const areasGrid = document.querySelector('.areas-grid');
            if (areasGrid) {
                const cards = Array.from(areasGrid.querySelectorAll('.area-card'));
                const controls = document.createElement('div');
                controls.className = 'impact-slideshow-controls';
                controls.innerHTML = `
                    <button class="slideshow-btn" id="prevArea">‹</button>
                    <div class="slideshow-indicators" id="areaIndicators"></div>
                    <button class="slideshow-btn" id="nextArea">›</button>
                `;
                // Append controls under the section-block wrapper if present, else after grid
                const container = areasGrid.parentNode || areasGrid;
                container.appendChild(controls);

                const indicators = controls.querySelector('#areaIndicators');
                let currentPage = 0;
                let cardsPerPage = 4;

                function updateCardsPerPage() {
                    if (window.innerWidth <= 768) cardsPerPage = 1;
                    else if (window.innerWidth <= 1024) cardsPerPage = 2;
                    else cardsPerPage = 4;
                }

                function pagesCount() {
                    return Math.max(1, Math.ceil(cards.length / cardsPerPage));
                }

                function buildIndicators() {
                    indicators.innerHTML = '';
                    for (let i = 0; i < pagesCount(); i++) {
                        const ind = document.createElement('div');
                        ind.className = 'slideshow-indicator' + (i === currentPage ? ' active' : '');
                        ind.addEventListener('click', () => { currentPage = i; renderPage(); });
                        indicators.appendChild(ind);
                    }
                }

                function renderPage() {
                    const start = currentPage * cardsPerPage;
                    const end = start + cardsPerPage;
                    cards.forEach((card, idx) => { card.style.display = (idx >= start && idx < end) ? '' : 'none'; });
                    indicators.querySelectorAll('.slideshow-indicator').forEach((ind, idx) => ind.classList.toggle('active', idx === currentPage));
                }

                updateCardsPerPage();
                buildIndicators();
                renderPage();

                controls.querySelector('#nextArea').addEventListener('click', () => {
                    currentPage = (currentPage + 1) % pagesCount();
                    renderPage();
                });
                controls.querySelector('#prevArea').addEventListener('click', () => {
                    currentPage = (currentPage - 1 + pagesCount()) % pagesCount();
                    renderPage();
                });

                window.addEventListener('resize', () => {
                    const oldPages = pagesCount();
                    updateCardsPerPage();
                    const newPages = pagesCount();
                    if (currentPage >= newPages) currentPage = newPages - 1;
                    buildIndicators();
                    renderPage();
                });
            }
        }

        const artistsCarousel = document.getElementById('artistsCarousel');
        if (artistsCarousel) {
            const artistCards = artistsCarousel.querySelectorAll('.artist-card');
            let currentArtist = 0;

            function goToArtist(idx) {
                currentArtist = (idx + artistCards.length) % artistCards.length;
                const left = artistCards[currentArtist].offsetLeft - artistsCarousel.offsetLeft;
                artistsCarousel.scrollTo({ left, behavior: 'smooth' });
                updateArtistIndicators();
            }

            function updateArtistIndicators() {
                document.querySelectorAll('#artistsIndicators .slideshow-indicator').forEach((ind, idx) => {
                    ind.classList.toggle('active', idx === currentArtist);
                });
            }

            const controls = document.createElement('div');
            controls.className = 'impact-slideshow-controls';
            controls.innerHTML = `
                <button class="slideshow-btn" id="prevArtists">‹</button>
                <div class="slideshow-indicators" id="artistsIndicators"></div>
                <button class="slideshow-btn" id="nextArtists">›</button>
            `;
            artistsCarousel.parentNode.appendChild(controls);

            const indicators = controls.querySelector('#artistsIndicators');
            artistCards.forEach((_, idx) => {
                const ind = document.createElement('div');
                ind.className = 'slideshow-indicator' + (idx === 0 ? ' active' : '');
                ind.addEventListener('click', () => goToArtist(idx));
                indicators.appendChild(ind);
            });

            controls.querySelector('#nextArtists').addEventListener('click', () => goToArtist(currentArtist + 1));
            controls.querySelector('#prevArtists').addEventListener('click', () => goToArtist(currentArtist - 1));

            let touchStartX = 0;
            let touchEndX = 0;
            artistsCarousel.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; });
            artistsCarousel.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                if (touchEndX - touchStartX > 50) { goToArtist(currentArtist - 1); }
                else if (touchStartX - touchEndX > 50) { goToArtist(currentArtist + 1); }
            });

            function applyParallax() {
                const rect = artistsCarousel.getBoundingClientRect();
                const center = rect.left + rect.width / 2;
                artistCards.forEach(card => {
                    const c = card.getBoundingClientRect();
                    const dx = (c.left + c.width / 2) - center;
                    const t = Math.max(0, 1 - Math.abs(dx) / rect.width);
                    card.style.transform = `translateY(${-(t*10)}px) scale(${1 + t*0.02})`;
                });
            }
            artistsCarousel.addEventListener('scroll', applyParallax);
            window.addEventListener('resize', applyParallax);
            setTimeout(applyParallax, 0);
        }

        const artistsSection = document.querySelector('.artists-section');
        if (artistsSection) {
            function parallaxBg() {
                const r = artistsSection.getBoundingClientRect();
                artistsSection.style.backgroundPosition = `center ${r.top * 0.3}px`;
            }
            window.addEventListener('scroll', parallaxBg);
            window.addEventListener('resize', parallaxBg);
            setTimeout(parallaxBg, 0);
        }


  //NEWS
          // Filter functionality
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                const cards = document.querySelectorAll('.news-card');
                
                cards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });

        // Initialize slideshow on mobile
        if (window.innerWidth <= 768) {
            const newsGrid = document.querySelector('.news-grid');
            if (newsGrid) {
                // Add slideshow controls similar to other pages
                const wrapper = document.createElement('div');
                wrapper.className = 'slideshow-wrapper';
                newsGrid.parentNode.insertBefore(wrapper, newsGrid);
                wrapper.appendChild(newsGrid);

                const controls = document.createElement('div');
                controls.className = 'slideshow-controls';
                controls.innerHTML = `
                    <button class="slideshow-btn" id="prevNews">‹</button>
                    <div class="slideshow-indicators" id="newsIndicators"></div>
                    <button class="slideshow-btn" id="nextNews">›</button>
                `;
                wrapper.appendChild(controls);

                // Slideshow logic
                const cards = newsGrid.querySelectorAll('.news-card');
                const indicators = controls.querySelector('#newsIndicators');
                let currentIndex = 0;

                cards.forEach((_, idx) => {
                    const ind = document.createElement('div');
                    ind.className = 'slideshow-indicator';
                    if (idx === 0) ind.classList.add('active');
                    ind.addEventListener('click', () => {
                        currentIndex = idx;
                        updateSlideshow();
                    });
                    indicators.appendChild(ind);
                });

                function updateSlideshow() {
                    newsGrid.scrollTo({
                        left: currentIndex * newsGrid.offsetWidth,
                        behavior: 'smooth'
                    });
                    indicators.querySelectorAll('.slideshow-indicator').forEach((ind, idx) => {
                        ind.classList.toggle('active', idx === currentIndex);
                    });
                }

                controls.querySelector('#nextNews').addEventListener('click', () => {
                    currentIndex = (currentIndex + 1) % cards.length;
                    updateSlideshow();
                });

                controls.querySelector('#prevNews').addEventListener('click', () => {
                    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
                    updateSlideshow();
                });
            }
        }


// ============================================
// PAGE TRACKS
// ============================================
(function() {
    const audioPlayerContainer = document.getElementById('audioPlayerContainer');
    if (!audioPlayerContainer) return;
    
    const nowPlayingTitle = document.getElementById('nowPlayingTitle');
    const nowPlayingArtist = document.getElementById('nowPlayingArtist');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const progressBar = document.getElementById('progressBar');
    const progressBarContainer = document.getElementById('progressBarContainer');
    const currentTimeEl = document.getElementById('currentTime');
    const totalTimeEl = document.getElementById('totalTime');
    const closePlayerBtn = document.getElementById('closePlayer');
    const audioFrame = document.getElementById('audioFrame');
    const fallbackLinks = document.getElementById('fallbackLinks');
    const audioFrameContainer = document.getElementById('audioFrameContainer');
    
    let currentTrack = null;
    let isPlaying = false;

    function showFallback(trackName, trackArtist) {
        const q = encodeURIComponent(trackName + ' ' + trackArtist);
        document.getElementById('spotifyLink').href = `https://open.spotify.com/search/${q}`;
        document.getElementById('appleLink').href = `https://music.apple.com/search?term=${q}`;
        audioFrameContainer.style.display = 'none';
        fallbackLinks.style.display = 'block';
        audioPlayerContainer.classList.add('active');
        isPlaying = false;
        playPauseBtn.textContent = '▶';
        setTimeout(() => { audioPlayerContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 100);
    }

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const tracksList = document.getElementById('tracksList');
    const trackRows = tracksList ? tracksList.querySelectorAll('.track-row') : [];

    if (searchInput && trackRows.length > 0) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            trackRows.forEach(row => {
                const trackName = row.getAttribute('data-name').toLowerCase();
                if (trackName.includes(searchTerm)) {
                    row.style.display = 'grid';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // Sort functionality
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect && trackRows.length > 0) {
        sortSelect.addEventListener('change', function() {
            const sortBy = this.value;
            const rows = Array.from(trackRows);
            
            rows.sort((a, b) => {
                if (sortBy === 'name') {
                    return a.getAttribute('data-name').localeCompare(b.getAttribute('data-name'));
                } else if (sortBy === 'album') {
                    return a.getAttribute('data-album').localeCompare(b.getAttribute('data-album'));
                } else if (sortBy === 'duration') {
                    return a.getAttribute('data-duration').localeCompare(b.getAttribute('data-duration'));
                }
            });

            rows.forEach(row => tracksList.appendChild(row));
        });
    }

    trackRows.forEach(row => {
        row.addEventListener('click', function() {
            const trackName = this.querySelector('.track-name').textContent;
            const trackArtist = this.querySelector('.track-artist').textContent;
            const audioUrl = this.getAttribute('data-audio');
            const duration = this.getAttribute('data-duration');

            currentTrack = this;
            trackRows.forEach(r => r.classList.remove('playing'));
            this.classList.add('playing');

            nowPlayingTitle.textContent = trackName;
            nowPlayingArtist.textContent = trackArtist;
            totalTimeEl.textContent = duration;

            const trackNameLower = trackName.toLowerCase();
            if (trackNameLower === "i don't like") {
                const videoId = (audioUrl || '').match(/(?:youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/watch\?v=)([^&\n?#]+)/)?.[1];
                if (videoId) {
                    audioFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`;
                    audioFrameContainer.style.display = 'block';
                    fallbackLinks.style.display = 'none';
                    audioPlayerContainer.classList.add('active');
                    isPlaying = true;
                    playPauseBtn.textContent = '⏸';
                    setTimeout(() => { audioPlayerContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 100);
                } else {
                    showFallback(trackName, trackArtist);
                }
            } else {
                showFallback(trackName, trackArtist);
            }
        });
    });

    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (isPlaying) {
                const currentSrc = audioFrame.src;
                audioFrame.src = '';
                setTimeout(() => { audioFrame.src = currentSrc.replace('autoplay=1', 'autoplay=0'); }, 100);
                isPlaying = false;
                this.textContent = '▶';
            } else {
                if (currentTrack) {
                    if (audioFrameContainer.style.display === 'block') {
                        const audioUrl = currentTrack.getAttribute('data-audio') || '';
                        const videoId = audioUrl.match(/(?:youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/watch\?v=)([^&\n?#]+)/)?.[1];
                        if (videoId) {
                            audioFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`;
                            isPlaying = true;
                            this.textContent = '⏸';
                        }
                    }
                }
            }
        });
    }

    if (closePlayerBtn) {
        closePlayerBtn.addEventListener('click', function() {
            audioFrame.src = '';
            audioFrameContainer.style.display = 'none';
            fallbackLinks.style.display = 'none';
            audioPlayerContainer.classList.remove('active');
            trackRows.forEach(r => r.classList.remove('playing'));
            document.querySelectorAll('.featured-card').forEach(c => c.classList.remove('playing'));
            isPlaying = false;
            playPauseBtn.textContent = '▶';
            progressBar.style.width = '0%';
        });
    }

    if (progressBarContainer) {
        progressBarContainer.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            progressBar.style.width = (percent * 100) + '%';
        });
    }

    setInterval(() => {
        if (isPlaying && currentTrack) {
            const currentWidth = parseFloat(progressBar.style.width) || 0;
            if (currentWidth < 100) {
                progressBar.style.width = (currentWidth + 0.1) + '%';
            }
        }
    }, 1000);

    document.querySelectorAll('.featured-card').forEach(card => {
        card.addEventListener('click', function() {
            const trackName = this.querySelector('h3').textContent;
            const trackArtist = this.getAttribute('data-artist') || 'Chief Keef';
            const audioUrl = this.getAttribute('data-audio');

            const trackRow = Array.from(trackRows).find(row => 
                row.querySelector('.track-name').textContent.toLowerCase() === trackName.toLowerCase()
            );

            if (trackRow) {
                trackRow.click();
            } else {
                currentTrack = this;
                nowPlayingTitle.textContent = trackName;
                nowPlayingArtist.textContent = trackArtist;
                const trackNameLower = trackName.toLowerCase();
                if (trackNameLower === "i don't like") {
                    const videoId = (audioUrl || '').match(/(?:youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/watch\?v=)([^&\n?#]+)/)?.[1];
                    if (videoId) {
                        audioFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`;
                        audioFrameContainer.style.display = 'block';
                        fallbackLinks.style.display = 'none';
                        audioPlayerContainer.classList.add('active');
                        isPlaying = true;
                        playPauseBtn.textContent = '⏸';
                        this.classList.add('playing');
                        setTimeout(() => { audioPlayerContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 100);
                    } else {
                        showFallback(trackName, trackArtist);
                    }
                } else {
                    showFallback(trackName, trackArtist);
                }
            }
        });
    });

    // Initialize mobile slideshow for featured tracks
    if (window.innerWidth <= 768) {
        const featuredGrid = document.querySelector('.featured-grid');
        if (featuredGrid) {
            const wrapper = document.createElement('div');
            wrapper.className = 'slideshow-wrapper';
            featuredGrid.parentNode.insertBefore(wrapper, featuredGrid);
            wrapper.appendChild(featuredGrid);

            const controls = document.createElement('div');
            controls.className = 'slideshow-controls';
            controls.innerHTML = `
                <button class="slideshow-btn" id="prevFeatured">‹</button>
                <div class="slideshow-indicators" id="featuredIndicators"></div>
                <button class="slideshow-btn" id="nextFeatured">›</button>
            `;
            wrapper.appendChild(controls);

            const cards = featuredGrid.querySelectorAll('.featured-card');
            const indicators = controls.querySelector('#featuredIndicators');
            let currentIndex = 0;

            cards.forEach((_, idx) => {
                const ind = document.createElement('div');
                ind.className = 'slideshow-indicator';
                if (idx === 0) ind.classList.add('active');
                ind.addEventListener('click', () => {
                    currentIndex = idx;
                    updateSlideshow();
                });
                indicators.appendChild(ind);
            });

            function updateSlideshow() {
                featuredGrid.scrollTo({
                    left: currentIndex * featuredGrid.offsetWidth,
                    behavior: 'smooth'
                });
                indicators.querySelectorAll('.slideshow-indicator').forEach((ind, idx) => {
                    ind.classList.toggle('active', idx === currentIndex);
                });
            }

            controls.querySelector('#nextFeatured').addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % cards.length;
                updateSlideshow();
            });

            controls.querySelector('#prevFeatured').addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + cards.length) % cards.length;
                updateSlideshow();
            });
        }
    }
})();

// ============================================
// PAGE QUIZ
// ============================================
(function() {
    const quizContainer = document.getElementById('game-quiz');
    if (!quizContainer) return;

    const tabs = document.querySelectorAll('.quiz-tab');
    const sections = {
        quiz: document.getElementById('game-quiz'),
        memory: document.getElementById('game-memory'),
        match: document.getElementById('game-match'),
        emoji: document.getElementById('game-emoji')
    };
    const boardGame = document.getElementById('boardGame');
    const scoreEl = document.getElementById('score');
    const timerEl = document.getElementById('timer');
    const tipsEl = document.getElementById('tips');
    const boardTips = document.getElementById('boardTips');
    const bestEl = document.getElementById('best');
    const streakEl = document.getElementById('streak');
    const timerBar = document.getElementById('timerBar');
    const timerBarGlobal = document.getElementById('timerBarGlobal');
    const difficultySel = document.getElementById('difficulty');
    const confetti = document.createElement('div');
    confetti.id = 'confetti';
    document.body.appendChild(confetti);

    let score = 0;
    let timer = 0;
    let timerInt = null;
    let best = parseInt(localStorage.getItem('quiz_best') || '0', 10);
    bestEl.textContent = best;
    let streak = 0;
    streakEl.textContent = streak;
    let currentGame = 'quiz';
    let memoryPaused = false;
    let memoryHints = 1;
    let matchPaused = false;
    let matchHints = 1;
    let matchCorrect = new Set();

    function setActive(game) {
        clearInterval(timerInt);
        timerBarGlobal.style.width = '0%';
        timerBar.style.width = '0%';
        currentGame = game;
        tabs.forEach(t => t.classList.toggle('active', t.dataset.game === game));
        Object.keys(sections).forEach(k => {
            sections[k].style.display = k === game ? 'block' : 'none';
            if (k === game) sections[k].classList.add('fade-in');
        });
        boardGame.textContent = game === 'quiz' ? 'Quiz' : game === 'memory' ? 'Memory' : game === 'match' ? 'Match' : 'Emoji';
        boardTips.textContent = game === 'quiz' ? 'Answer within the time limit.' : game === 'memory' ? 'Find all pairs to win.' : game === 'match' ? 'Drag the tracks to the correct album.' : 'Guess the title from emojis.';
        if (game === 'memory') {
            memoryPaused = false;
            memoryHints = 1;
            startMemoryTimer();
        } else if (game === 'match') {
            matchPaused = false;
            matchHints = 1;
            startMatchTimer();
        } else if (game === 'emoji') {
            startEmoji();
        }
    }

    tabs.forEach(t => t.addEventListener('click', () => setActive(t.dataset.game)));
    setActive('quiz');

    function resetTimer(seconds, barEl) {
        clearInterval(timerInt);
        timer = seconds;
        timerEl.textContent = seconds + 's';
        const bar = barEl || timerBar;
        if (bar) bar.style.width = '100%';
        const start = Date.now();
        timerInt = setInterval(() => {
            const elapsed = Math.floor((Date.now() - start) / 1000);
            const remaining = Math.max(0, seconds - elapsed);
            timer = remaining;
            timerEl.textContent = remaining + 's';
            if (bar) bar.style.width = ((remaining / seconds) * 100) + '%';
            if (remaining <= 0) {
                clearInterval(timerInt);
                if (currentQuiz) lockQuiz();
                triggerShake(quizChoices);
            }
        }, 100);
    }

    const quizData = [
        { q: "Which album popularized drill worldwide?", choices: ["Finally Rich", "Bang 3", "Almighty So", "Dedication"], answer: 0 },
        { q: "Which track blew up with a Kanye West remix?", choices: ["Love Sosa", "I Don't Like", "Kobe", "Kay Kay"], answer: 1 },
        { q: "Chief Keef's iconic nickname?", choices: ["Sosa", "Dirt", "Pop", "Headie"], answer: 0 },
        { q: "His independent label?", choices: ["Glo Gang", "OVO", "TDE", "MMG"], answer: 0 },
        { q: "What year was Finally Rich released?", choices: ["2012", "2013", "2011", "2014"], answer: 1 },
        { q: "Which producer worked heavily with Keef on Bang 3?", choices: ["Southside", "TM88", "Metro Boomin", "Zaytoven"], answer: 0 },
        { q: "Chief Keef's real first name?", choices: ["Keith", "Kenneth", "Kevin", "Kendrick"], answer: 0 },
        { q: "What is the iconic hand gesture associated with Glo Gang?", choices: ["Glo up", "Block sign", "Peace sign", "Glo flex"], answer: 0 }
    ];

    let quizIndex = 0;
    let currentQuiz = null;
    const quizQuestion = document.getElementById('quizQuestion');
    const quizChoices = document.getElementById('quizChoices');
    const questionNum = document.getElementById('questionNum');

    function renderQuiz() {
        const data = quizData[quizIndex];
        questionNum.textContent = `Question ${quizIndex + 1} / ${quizData.length}`;
        quizQuestion.textContent = data.q;
        quizChoices.innerHTML = '';
        data.choices.forEach((c, i) => {
            const div = document.createElement('div');
            div.className = 'choice';
            div.textContent = c;
            div.dataset.index = String(i);
            div.addEventListener('click', () => chooseAnswer(i, div));
            quizChoices.appendChild(div);
        });
        currentQuiz = { locked: false };
        const d = difficultySel.value;
        const secs = d === 'easy' ? 12 : (d === 'hard' ? 8 : 10);
        resetTimer(secs, timerBar);
        tipsEl.textContent = 'Choose the correct answer!';
    }

    function chooseAnswer(i, el) {
        if (!currentQuiz || currentQuiz.locked) return;
        currentQuiz.locked = true;
        const correct = i === quizData[quizIndex].answer;
        const all = Array.from(quizChoices.querySelectorAll('.choice'));
        all.forEach(choice => {
            choice.style.pointerEvents = 'none';
            choice.classList.add('locked');
        });
        if (correct) {
            el.style.background = 'rgba(29,185,84,0.25)';
            el.style.borderColor = '#1DB954';
            score += 1;
            scoreEl.textContent = score;
            triggerPop(scoreEl);
            tipsEl.textContent = '✅ Correct!';
            streak += 1;
        } else {
            el.style.background = 'rgba(255,77,79,0.25)';
            el.style.borderColor = '#ff4d4f';
            tipsEl.textContent = '❌ Wrong!';
            streak = 0;
            triggerShake(quizChoices);
            const idx = quizData[quizIndex].answer;
            const correctEl = quizChoices.querySelector(`.choice[data-index="${idx}"]`);
            if (correctEl) {
                correctEl.style.background = 'rgba(29,185,84,0.25)';
                correctEl.style.borderColor = '#1DB954';
            }
        }
        streakEl.textContent = streak;
        clearInterval(timerInt);
        if (score > best) {
            best = score;
            localStorage.setItem('quiz_best', String(best));
            bestEl.textContent = best;
            showConfetti(20);
        }
        setTimeout(() => {
            if (quizIndex < quizData.length - 1) {
                quizIndex++;
                renderQuiz();
            } else {
                tipsEl.textContent = '🎉 Quiz Finished! Great job!';
            }
        }, 1000);
    }

    function startMemoryTimer() {
        const d = difficultySel.value;
        const secs = d === 'easy' ? 90 : (d === 'hard' ? 45 : 60);
        resetTimer(secs, timerBarGlobal);
    }

    function startMatchTimer() {
        const d = difficultySel.value;
        const secs = d === 'easy' ? 90 : (d === 'hard' ? 45 : 60);
        resetTimer(secs, timerBarGlobal);
    }

    function lockQuiz() {
        if (!currentQuiz) return;
        currentQuiz.locked = true;
        tipsEl.textContent = "⏱️ Time's up!";
    }

    document.getElementById('startQuiz').addEventListener('click', () => {
        score = 0;
        scoreEl.textContent = score;
        streak = 0;
        streakEl.textContent = streak;
        quizIndex = 0;
        renderQuiz();
    });

    document.getElementById('nextQuiz').addEventListener('click', () => {
        if (quizIndex < quizData.length - 1) {
            quizIndex++;
            renderQuiz();
        } else {
            tipsEl.textContent = '✨ Quiz finished!';
            clearInterval(timerInt);
        }
    });

    const memoryValues = ['SOSA', 'GLO', '300', 'FRICH', 'BANG3', 'KOBE'];
    let memoryFirst = null;
    let memoryLock = false;
    let memoryFound = 0;

    function setupMemory() {
        const grid = document.getElementById('memoryGrid');
        grid.innerHTML = '';
        memoryFound = 0;
        scoreEl.textContent = score;
        const arr = [...memoryValues, ...memoryValues].sort(() => Math.random() - 0.5);
        arr.forEach(val => {
            const c = document.createElement('div');
            c.className = 'card';
            c.dataset.val = val;
            c.textContent = '?';
            c.addEventListener('click', () => onMemoryClick(c));
            grid.appendChild(c);
        });
        tipsEl.textContent = 'Find all pairs!';
    }

    function onMemoryClick(card) {
        if (memoryLock || card.classList.contains('revealed')) return;
        card.classList.add('flip');
        setTimeout(() => {
            card.classList.add('revealed');
            card.textContent = card.dataset.val;
        }, 180);
        if (!memoryFirst) {
            memoryFirst = card;
            return;
        }
        memoryLock = true;
        setTimeout(() => {
            if (memoryFirst.dataset.val === card.dataset.val) {
                score += 1;
                scoreEl.textContent = score;
                triggerPop(scoreEl);
                tipsEl.textContent = '✅ Pair found!';
                showConfetti(12);
                memoryFound += 1;
                if (memoryFound === memoryValues.length) {
                    tipsEl.textContent = '🎉 Memory completed!';
                    if (score > best) {
                        best = score;
                        localStorage.setItem('quiz_best', String(best));
                        bestEl.textContent = best;
                    }
                }
            } else {
                memoryFirst.classList.remove('revealed');
                memoryFirst.classList.remove('flip');
                memoryFirst.textContent = '?';
                card.classList.remove('revealed');
                card.classList.remove('flip');
                card.textContent = '?';
                triggerShake(document.getElementById('memoryGrid'));
                tipsEl.textContent = '❌ Not a match!';
            }
            memoryFirst = null;
            memoryLock = false;
        }, 600);
    }

    document.getElementById('restartMemory').addEventListener('click', () => {
        score = 0;
        scoreEl.textContent = score;
        setupMemory();
        startMemoryTimer();
    });

    document.getElementById('hintMemory').addEventListener('click', () => {
        if (memoryHints <= 0) {
            tipsEl.textContent = 'No hints left!';
            return;
        }
        memoryHints--;
        const cards = document.querySelectorAll('#memoryGrid .card');
        cards.forEach(c => {
            c.classList.add('revealed');
            c.textContent = c.dataset.val;
        });
        setTimeout(() => {
            cards.forEach(c => {
                if (!c.classList.contains('flip')) {
                    c.classList.remove('revealed');
                    c.textContent = '?';
                }
            });
        }, 1200);
        document.getElementById('hintMemory').textContent = `Hint (${memoryHints})`;
    });

    document.getElementById('pauseMemory').addEventListener('click', () => {
        memoryPaused = !memoryPaused;
        if (memoryPaused) {
            clearInterval(timerInt);
            tipsEl.textContent = '⏸️ Paused';
        } else {
            startMemoryTimer();
            tipsEl.textContent = '▶️ Resumed';
        }
    });

    const matchPairs = [
        { track: 'Love Sosa', album: 'Finally Rich' },
        { track: "I Don't Like", album: 'Finally Rich' },
        { track: 'Kobe', album: 'Bang 3' },
        { track: 'Kay Kay', album: 'Finally Rich' }
    ];

    function setupMatch() {
        const drag = document.getElementById('dragTracks');
        const drop = document.getElementById('dropAlbums');
        drag.innerHTML = '';
        drop.innerHTML = '';
        matchCorrect.clear();
        const tracks = [...matchPairs].sort(() => Math.random() - 0.5);
        const albums = [...new Set(matchPairs.map(m => m.album))].sort(() => Math.random() - 0.5);
        tracks.forEach(t => {
            const el = document.createElement('div');
            el.className = 'draggable';
            el.textContent = t.track;
            el.draggable = true;
            el.dataset.track = t.track;
            el.addEventListener('dragstart', e => {
                if (matchPaused || el.classList.contains('disabled')) {
                    e.preventDefault();
                    return;
                }
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', t.track);
            });
            drag.appendChild(el);
        });
        albums.forEach(a => {
            const dz = document.createElement('div');
            dz.className = 'dropzone';
            dz.textContent = a;
            dz.dataset.album = a;
            dz.addEventListener('dragover', e => {
                if (matchPaused) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });
            dz.addEventListener('dragleave', () => dz.classList.remove('wrong'));
            dz.addEventListener('drop', e => {
                if (matchPaused) return;
                e.preventDefault();
                const track = e.dataTransfer.getData('text/plain');
                const pair = matchPairs.find(m => m.track === track);
                if (!pair) return;
                const el = drag.querySelector(`[data-track="${track}"]`);
                if (pair.album === dz.dataset.album) {
                    dz.classList.remove('wrong');
                    dz.classList.add('correct');
                    score += 1;
                    scoreEl.textContent = score;
                    triggerPop(scoreEl);
                    tipsEl.textContent = '✅ Good match!';
                    showConfetti(10);
                    matchCorrect.add(track);
                    if (el) {
                        el.draggable = false;
                        el.classList.add('disabled');
                    }
                    if (matchCorrect.size === matchPairs.length) {
                        clearInterval(timerInt);
                        tipsEl.textContent = '🎉 All matched!';
                        if (score > best) {
                            best = score;
                            localStorage.setItem('quiz_best', String(best));
                            bestEl.textContent = best;
                        }
                    }
                } else {
                    dz.classList.remove('correct');
                    dz.classList.add('wrong');
                    tipsEl.textContent = '❌ Wrong album!';
                    triggerShake(drop);
                }
            });
            drop.appendChild(dz);
        });
        tipsEl.textContent = 'Drag tracks to albums!';
    }

    document.getElementById('restartMatch').addEventListener('click', () => {
        score = 0;
        scoreEl.textContent = score;
        setupMatch();
        startMatchTimer();
    });

    document.getElementById('pauseMatch').addEventListener('click', () => {
        matchPaused = !matchPaused;
        if (matchPaused) {
            clearInterval(timerInt);
            tipsEl.textContent = '⏸️ Paused';
        } else {
            startMatchTimer();
            tipsEl.textContent = '▶️ Resumed';
        }
    });

    document.getElementById('hintMatch').addEventListener('click', () => {
        if (matchHints <= 0) {
            tipsEl.textContent = 'No hints left!';
            return;
        }
        matchHints--;
        const remaining = matchPairs.filter(m => !matchCorrect.has(m.track));
        if (remaining.length === 0) return;
        const pick = remaining[Math.floor(Math.random() * remaining.length)];
        const dz = document.querySelector(`#dropAlbums .dropzone[data-album="${pick.album}"]`);
        if (dz) {
            dz.classList.add('hint');
            setTimeout(() => dz.classList.remove('hint'), 1200);
        }
        document.getElementById('hintMatch').textContent = `Hint (${matchHints})`;
    });

    // Emoji Guess
    const emojiData = [
        { clue: '💗🎶', choices: ['Love Sosa', 'Faneto', 'Kobe', 'Kay Kay'], answer: 0 },
        { clue: '🚫👍', choices: ["I Don't Like", 'Hate Bein\' Sober', 'Earned It', 'Kobe'], answer: 0 },
        { clue: '🏀🎯', choices: ['Kobe', 'Love Sosa', 'Top Sosa', 'Bang 3'], answer: 0 },
        { clue: '🍹🚫', choices: ['Hate Bein\' Sober', 'Faneto', 'Kay Kay', 'Earned It'], answer: 0 },
        { clue: '💥3️⃣', choices: ['Bang 3', 'Finally Rich', 'Dedication', 'Back From The Dead'], answer: 0 }
    ];

    let emojiIndex = 0;
    let emojiLocked = false;
    const emojiPrompt = document.getElementById('emojiPrompt');
    const emojiChoices = document.getElementById('emojiChoices');
    const emojiBar = document.getElementById('emojiTimerBar');
    const emojiNum = document.getElementById('emojiNum');

    function renderEmoji() {
        const d = emojiData[emojiIndex];
        emojiNum.textContent = `Question ${emojiIndex + 1} / ${emojiData.length}`;
        emojiPrompt.textContent = d.clue;
        emojiChoices.innerHTML = '';
        d.choices.forEach((c, i) => {
            const div = document.createElement('div');
            div.className = 'choice';
            div.textContent = c;
            div.dataset.index = String(i);
            div.addEventListener('click', () => chooseEmoji(i, div));
            emojiChoices.appendChild(div);
        });
        emojiLocked = false;
        const diff = difficultySel.value;
        const secs = diff === 'easy' ? 14 : (diff === 'hard' ? 8 : 10);
        resetTimer(secs, emojiBar);
        tipsEl.textContent = 'Choose the correct answer!';
    }

    function chooseEmoji(i, el) {
        if (emojiLocked) return;
        emojiLocked = true;
        const correct = i === emojiData[emojiIndex].answer;
        const all = Array.from(emojiChoices.querySelectorAll('.choice'));
        all.forEach(ch => {
            ch.style.pointerEvents = 'none';
            ch.classList.add('locked');
        });
        if (correct) {
            el.style.background = 'rgba(29,185,84,0.25)';
            el.style.borderColor = '#1DB954';
            score += 1;
            scoreEl.textContent = score;
            triggerPop(scoreEl);
            tipsEl.textContent = '✅ Correct!';
            streak += 1;
        } else {
            el.style.background = 'rgba(255,77,79,0.25)';
            el.style.borderColor = '#ff4d4f';
            tipsEl.textContent = '❌ Wrong!';
            streak = 0;
            triggerShake(emojiChoices);
            const idx = emojiData[emojiIndex].answer;
            const correctEl = emojiChoices.querySelector(`.choice[data-index="${idx}"]`);
            if (correctEl) {
                correctEl.style.background = 'rgba(29,185,84,0.25)';
                correctEl.style.borderColor = '#1DB954';
            }
        }
        streakEl.textContent = streak;
        clearInterval(timerInt);
        if (score > best) {
            best = score;
            localStorage.setItem('quiz_best', String(best));
            bestEl.textContent = best;
            showConfetti(15);
        }
        setTimeout(() => {
            if (emojiIndex < emojiData.length - 1) {
                emojiIndex++;
                renderEmoji();
            } else {
                tipsEl.textContent = '🎉 Emoji Guess finished!';
            }
        }, 1000);
    }

    function startEmoji() {
        emojiIndex = 0;
        renderEmoji();
    }

    document.getElementById('startEmoji').addEventListener('click', () => {
        score = 0;
        scoreEl.textContent = score;
        streak = 0;
        streakEl.textContent = streak;
        emojiIndex = 0;
        renderEmoji();
    });

    document.getElementById('nextEmoji').addEventListener('click', () => {
        if (emojiIndex < emojiData.length - 1) {
            emojiIndex++;
            renderEmoji();
        } else {
            tipsEl.textContent = '✨ Quiz finished!';
        }
    });

    function triggerPop(el) {
        el.classList.add('animate-pop');
        setTimeout(() => el.classList.remove('animate-pop'), 300);
    }

    function triggerShake(el) {
        el.classList.add('animate-shake');
        setTimeout(() => el.classList.remove('animate-shake'), 350);
    }

    function showConfetti(n) {
        confetti.innerHTML = '';
        const colors = ['#ffff00', '#8000ff', '#f9c74f', '#90be6d', '#ff4d4f'];
        for (let i = 0; i < n; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + '%';
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.transform = 'translateY(-20px) rotate(' + Math.floor(Math.random() * 360) + 'deg)';
            piece.style.animationDuration = (1.4 + Math.random() * 1.4) + 's';
            confetti.appendChild(piece);
        }
        setTimeout(() => {
            confetti.innerHTML = '';
        }, 2000);
    }

    setupMemory();
    setupMatch();
    difficultySel.addEventListener('change', () => {
        if (currentGame === 'quiz') {
            renderQuiz();
        } else if (currentGame === 'memory') {
            startMemoryTimer();
        } else {
            startMatchTimer();
        }
    });
})();




// PAGE FEATURES
    document.getElementById('year').textContent = new Date().getFullYear();
    if (window.innerWidth <= 768) {
      function initSlideshow(containerSelector, cardSelector, wrapperId) {
        const container = document.querySelector(containerSelector); if (!container) return;
        const wrapper = document.createElement('div'); wrapper.className = 'slideshow-wrapper'; wrapper.id = wrapperId; container.parentNode.insertBefore(wrapper, container); wrapper.appendChild(container);
        const controls = document.createElement('div'); controls.className = 'slideshow-controls'; controls.innerHTML = `<button class="slideshow-btn" id="prev${wrapperId}">‹</button><div class="slideshow-indicators" id="${wrapperId}Indicators"></div><button class="slideshow-btn" id="next${wrapperId}">›</button>`; wrapper.appendChild(controls);
        const cards = container.querySelectorAll(cardSelector); const indicators = controls.querySelector(`#${wrapperId}Indicators`); let currentIndex = 0;
        cards.forEach((_, idx) => { const ind = document.createElement('div'); ind.className = 'slideshow-indicator'; if (idx === 0) ind.classList.add('active'); ind.addEventListener('click', () => { currentIndex = idx; updateSlideshow(); }); indicators.appendChild(ind); });
        function updateSlideshow() { container.scrollTo({ left: currentIndex * container.offsetWidth, behavior: 'smooth' }); indicators.querySelectorAll('.slideshow-indicator').forEach((ind, idx) => ind.classList.toggle('active', idx === currentIndex)); }
        controls.querySelector(`#next${wrapperId}`).addEventListener('click', () => { currentIndex = (currentIndex + 1) % cards.length; updateSlideshow(); });
        controls.querySelector(`#prev${wrapperId}`).addEventListener('click', () => { currentIndex = (currentIndex - 1 + cards.length) % cards.length; updateSlideshow(); });
      }
      initSlideshow('#featuresSlides', '.slide', 'features');
      initSlideshow('#majorGrid', '.major-card', 'major');
      initSlideshow('#collabTimeline', '.timeline-card', 'timeline');
      initSlideshow('.stats-row', '.stat', 'stats');
    }



    // PAGES TOURS AND SHOWS
// Timeline Slideshow
      const timeline = document.getElementById('tourTimeline');
      const items = timeline ? timeline.querySelectorAll('.tour-timeline-item') : [];
      const indicators = document.getElementById('tourIndicators');
      const prevBtn = document.getElementById('prevTour');
      const nextBtn = document.getElementById('nextTour');
      
      if (timeline && items.length > 0) {
        let currentIndex = 0;

        // Create indicators
        items.forEach((_, idx) => {
          const ind = document.createElement('div');
          ind.className = 'tour-slideshow-indicator';
          if (idx === 0) ind.classList.add('active');
          ind.addEventListener('click', () => goToSlide(idx));
          indicators.appendChild(ind);
        });

        function updateIndicators() {
          indicators.querySelectorAll('.tour-slideshow-indicator').forEach((ind, idx) => {
            ind.classList.toggle('active', idx === currentIndex);
          });
        }

        function goToSlide(idx) {
          currentIndex = idx;
          timeline.scrollTo({
            left: items[idx].offsetLeft - timeline.offsetLeft,
            behavior: 'smooth'
          });
          updateIndicators();
        }

        nextBtn.addEventListener('click', () => {
          currentIndex = (currentIndex + 1) % items.length;
          goToSlide(currentIndex);
        });

        prevBtn.addEventListener('click', () => {
          currentIndex = (currentIndex - 1 + items.length) % items.length;
          goToSlide(currentIndex);
        });

        // Touch swipe
        let touchStartX = 0;
        let touchEndX = 0;
        timeline.addEventListener('touchstart', (e) => {
          touchStartX = e.changedTouches[0].screenX;
        });
        timeline.addEventListener('touchend', (e) => {
          touchEndX = e.changedTouches[0].screenX;
          if (touchStartX - touchEndX > 50) {
            currentIndex = (currentIndex + 1) % items.length;
            goToSlide(currentIndex);
          } else if (touchEndX - touchStartX > 50) {
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            goToSlide(currentIndex);
          }
        });

        // Auto-play
        setInterval(() => {
          currentIndex = (currentIndex + 1) % items.length;
          goToSlide(currentIndex);
        }, 5000);
      }







    
    


  // ============================================
  // 21. ERROR HANDLING
  // ============================================
  window.addEventListener("error", (e) => {
    console.error("❌ Script error:", e.message);
  });

  console.log("✅ Chief Keef site initialized - Welcome to the GLO!");
});