/**
 * NCLEX AMPLIFIED INTERNS — APPLICATION CONTROLLER
 * Comprehensive layout controller handling navigation, hero scroll effects,
 * tabbed content hub, curriculum stage switcher, testimonial slider,
 * FAQ accordions, department modals, and application form validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Render circular favicon dynamically across all browser tabs
  const renderCircularFavicon = () => {
    const img = new Image();
    img.onload = () => {
      try {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.clearRect(0, 0, size, size);
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 0, 0, size, size);

        const circularDataUrl = canvas.toDataURL('image/png');
        const existingLinks = document.querySelectorAll("link[rel*='icon']");
        existingLinks.forEach(link => {
          link.href = circularDataUrl;
        });
      } catch (e) {
        // Fallback to SVG
      }
    };
    img.src = 'assets/nclex-logo.png';
  };
  renderCircularFavicon();

  // ==========================================================================
  // 0. CINEMATIC PAGE INTRO CONTROLLER (HORIZONTAL FILL LOADING)
  // ==========================================================================
  const introOverlay = document.getElementById('page-intro-overlay');
  const introProgressBar = document.getElementById('intro-progress-bar');

  if (introOverlay) {
    document.body.classList.add('intro-active');

    let dismissed = false;

    const dismissIntro = () => {
      if (dismissed) return;
      dismissed = true;
      if (introProgressBar) {
        introProgressBar.style.width = '100%';
      }
      introOverlay.classList.add('dismissed');
      document.body.classList.remove('intro-active');
      document.body.classList.add('hero-intro-reveal');

      // Ensure hero reveal classes are marked revealed
      document.querySelectorAll('.hero-noorana .reveal-heading, .hero-noorana .reveal-text, .hero-noorana .reveal-card').forEach(el => {
        el.classList.add('revealed');
      });

      setTimeout(() => {
        introOverlay.style.display = 'none';
      }, 700);
    };

    // Smooth horizontal fill animation (2.0s duration)
    const startTime = performance.now();
    const duration = 2000;

    const animateProgress = (currentTime) => {
      if (dismissed) return;
      const elapsed = currentTime - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);

      if (introProgressBar) {
        introProgressBar.style.width = `${progress.toFixed(1)}%`;
      }

      if (progress < 100) {
        requestAnimationFrame(animateProgress);
      } else {
        setTimeout(dismissIntro, 200);
      }
    };

    requestAnimationFrame(animateProgress);

    // Also dismiss immediately if user clicks anywhere on screen
    introOverlay.addEventListener('click', dismissIntro);

    // Dismiss on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !dismissed) {
        dismissIntro();
      }
    });
  }

  // ==========================================================================
  // 1. DEPARTMENT DESCRIPTIONS DATA REPOSITORY
  // ==========================================================================
  const departmentDescriptions = {
    Technology: {
      scope: 'Assist in developing and maintaining company web applications, student portals, server-side scripting, API integrations, and database operations. Perform technical troubleshooting, network/LAN maintenance, workstation setup, and hardware diagnostics under the guidance of Gene Mathew Wagas and Mark Christian Naval.',
      req: 'Graduating undergraduate students enrolled in BS Information Technology (BSIT) or BS Computer Science (BSCS) Only.'
    },
    Creative: {
      scope: 'Design high-impact educational graphics, marketing collateral, social media assets, and promotional materials. Support photo/video editing, branding guidelines, and visual storytelling for digital review platforms.',
      req: 'Students enrolled in Multimedia Arts, Graphic Design, Fine Arts, Visual Communication, or related creative disciplines.'
    },
    Marketing: {
      scope: 'Execute digital marketing campaigns, analyze student acquisition channels, prepare social content schedules, and monitor brand reach across multiple review center platforms.',
      req: 'Students enrolled in Marketing Management, Business Administration, Advertising, Communications, or related programs.'
    },
    Operations: {
      scope: 'Support daily review center workflows, class scheduling, student record management, inventory, and cross-functional coordination across Legasynch business units.',
      req: 'Students enrolled in Industrial Engineering, Operations Management, Management Engineering, or Business Administration.'
    },
    Administration: {
      scope: 'Assist in formal documentation, HR coordination, MOA verification, attendance tracking, and executive support for leadership.',
      req: 'Students enrolled in Office Administration, Public Administration, Human Resources, or related fields.'
    },
    Content: {
      scope: 'Review, organize, and prepare nursing educational materials, practice drills, and digital learning modules for nursing students.',
      req: 'Students enrolled in Nursing, Health Sciences, Education, or technical writing backgrounds.'
    },
    Events: {
      scope: 'Coordinate logistics for virtual review sessions, webinar workshops, live student orientations, and graduation ceremonies.',
      req: 'Students in Hospitality Management, Communications, Events Management, or Business Administration.'
    }
  };

  // ==========================================================================
  // 2. MOBILE NAVIGATION DRAWER & STICKY HEADER
  // ==========================================================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawerOverlay = document.getElementById('mobile-drawer-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const closeMobileNav = () => {
    if (mobileToggle) {
      mobileToggle.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
    if (mobileDrawerOverlay) {
      mobileDrawerOverlay.classList.remove('active');
      mobileDrawerOverlay.setAttribute('aria-hidden', 'true');
      mobileDrawerOverlay.style.display = 'none';
    }
    document.body.style.overflow = '';
  };

  const toggleMobileNav = (forceClose = false) => {
    if (forceClose) {
      closeMobileNav();
      return;
    }
    if (mobileToggle && mobileDrawerOverlay) {
      const isOpen = mobileToggle.classList.contains('open');
      mobileToggle.classList.toggle('open', !isOpen);
      mobileToggle.setAttribute('aria-expanded', (!isOpen).toString());
      if (!isOpen) {
        mobileDrawerOverlay.style.display = 'flex';
        mobileDrawerOverlay.classList.add('active');
        mobileDrawerOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      } else {
        closeMobileNav();
      }
    }
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', (e) => {
      e.preventDefault();
      toggleMobileNav();
    });
  }

  if (mobileDrawerOverlay) {
    mobileDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === mobileDrawerOverlay) closeMobileNav();
    });
  }

  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileNav();
    });
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => closeMobileNav());
  });

  // ==========================================================================
  // HERO MOCKUP PERSPECTIVE & DYNAMIC SCROLL RESIZE
  // ==========================================================================
  const header = document.getElementById('site-header');
  const mockupWindow = document.querySelector('.noorana-app-window');
  const heroSection = document.querySelector('.hero-noorana');

  const updateHeroMockupScroll = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;

    // Sticky Header
    if (header) {
      if (scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Hero Mockup Perspective Scale Resizing (Desktop Only - Flat Crisp on Mobile)
    if (mockupWindow && heroSection) {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        mockupWindow.style.transform = 'none';
        mockupWindow.style.boxShadow = '0 20px 50px -10px rgba(2, 6, 23, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)';
        return;
      }

      const heroRect = heroSection.getBoundingClientRect();
      const maxScrollDistance = 450;
      
      const scrolled = Math.max(0, -heroRect.top);
      const progress = Math.min(scrolled / maxScrollDistance, 1.0);

      const startScale = 1.12;
      const endScale = 1.00;
      const startRotate = 5.5;
      const endRotate = 0.0;

      const currentScale = startScale - (progress * (startScale - endScale));
      const currentRotate = startRotate - (progress * (startRotate - endRotate));

      mockupWindow.style.transform = `perspective(1200px) rotateX(${currentRotate.toFixed(2)}deg) scale(${currentScale.toFixed(4)})`;

      const shadowSpread = Math.round(80 - (progress * 45));
      const shadowY = Math.round(35 - (progress * 20));
      const shadowOpacity = (0.13 - (progress * 0.06)).toFixed(3);
      mockupWindow.style.boxShadow = `0 ${shadowY}px ${shadowSpread}px -15px rgba(10, 25, 47, ${shadowOpacity}), 0 0 0 1px rgba(226, 232, 240, 0.8)`;
    }
  };

  let heroScrollTicking = false;
  const onHeroScroll = () => {
    if (!heroScrollTicking) {
      window.requestAnimationFrame(() => {
        updateHeroMockupScroll();
        heroScrollTicking = false;
      });
      heroScrollTicking = true;
    }
  };

  window.addEventListener('scroll', onHeroScroll, { passive: true });
  window.addEventListener('resize', onHeroScroll, { passive: true });
  updateHeroMockupScroll();

  // ==========================================================================
  // DYNAMIC INTERN MARQUEE IMAGE SHUFFLE CONTROLLER
  // ==========================================================================
  const internMarqueeTrack = document.getElementById('intern-marquee-track');
  if (internMarqueeTrack) {
    const internImages = [
      'marquee%20image/1.jpg',
      'marquee%20image/2.jpg',
      'marquee%20image/3.jpg',
      'marquee%20image/4.jpg',
      'marquee%20image/5.jpg',
      'marquee%20image/6.jpg',
      'marquee%20image/7.jpg',
      'marquee%20image/8.jpg',
      'marquee%20image/9.jpg',
      'marquee%20image/10.jpg',
      'marquee%20image/12.jpg',
      'marquee%20image/13.jpg',
      'marquee%20image/14.jpg',
      'marquee%20image/15.jpg'
    ];

    // Fisher-Yates shuffle algorithm
    const shuffled = [...internImages];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Duplicate shuffled set for seamless infinite 50% translation loop
    const loopedList = [...shuffled, ...shuffled];

    internMarqueeTrack.innerHTML = loopedList.map((src, idx) => `
      <div class="photo-card-noorana" tabindex="0" role="img" aria-label="Internship Moment ${idx + 1}">
        <img src="${src}" alt="NCLEX Amplified Intern Moment ${idx + 1}" class="marquee-photo-img" loading="${idx < 6 ? 'eager' : 'lazy'}" />
      </div>
    `).join('');
  }


  // ==========================================================================
  // 4. NAVIGATION SCROLL SPY
  // ==========================================================================
  const navLinks = document.querySelectorAll('.nav-menu-link');
  const scrollSpyTargets = document.querySelectorAll('section[id], footer[id], div[id="contact"]');

  const updateActiveNavLink = () => {
    const scrollY = window.pageYOffset + 140;
    scrollSpyTargets.forEach(target => {
      const targetHeight = target.offsetHeight;
      const targetTop = target.offsetTop;
      const targetId = target.getAttribute('id');

      if (scrollY >= targetTop && scrollY < targetTop + targetHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${targetId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // ==========================================================================
  // 5. CURRICULUM ROADMAP STAGE CONTROLLER (5 PHASES)
  // ==========================================================================
  const curriculumPhases = [
    {
      phaseTag: 'PHASE 01 OF 05',
      weeks: 'Weeks 1&ndash;2 &middot; 40 Hours',
      title: 'Orientation & Foundations',
      progressPct: '8%',
      progressText: '8% (40/500h)',
      desc: 'Company orientation, IT policies, ethical conduct, development environment & tooling setup, and web development fundamentals review.',
      topicTags: [
        'Company Culture & IT Org',
        'Code of Conduct & Ethics',
        'VS Code & Git Tooling',
        'Web Standards (HTML/CSS/JS)'
      ],
      deliverables: [
        'Workstation environment configuration & toolchain installation',
        'Git & GitHub repository workflow setup',
        'Corporate IT ethics & data compliance sign-off',
        'Baseline code review & development standards alignment'
      ]
    },
    {
      phaseTag: 'PHASE 02 OF 05',
      weeks: 'Weeks 3&ndash;6 &middot; 120 Hours',
      title: 'Front-End Engineering',
      progressPct: '32%',
      progressText: '32% (160/500h)',
      desc: 'HTML5, CSS3, JavaScript implementation, responsive design principles, front-end frameworks & components, browser debugging, QA & cross-platform testing.',
      topicTags: [
        'Responsive UI Architecture',
        'Modern CSS & Layout Systems',
        'DOM Manipulation & Events',
        'Cross-Browser QA Testing'
      ],
      deliverables: [
        'Pixel-perfect responsive landing page slice execution',
        'Interactive component UI & accessible state management',
        'Cross-browser debugging and QA testing suite',
        'Performance optimization & layout responsiveness verification'
      ]
    },
    {
      phaseTag: 'PHASE 03 OF 05',
      weeks: 'Weeks 7&ndash;10 &middot; 120 Hours',
      title: 'Back-End & Databases',
      progressPct: '56%',
      progressText: '56% (280/500h)',
      desc: 'Server-side scripting, database operations and management, REST API integration and queries, backend security, validation & troubleshooting.',
      topicTags: [
        'Server-Side Logic & Scripting',
        'Database Schema & SQL Queries',
        'RESTful API Integrations',
        'Form Sanitization & Security'
      ],
      deliverables: [
        'Relational database schema modeling and CRUD operations',
        'RESTful API route structuring & endpoint handling',
        'Server-side payload validation and error logging',
        'Database query tuning & connection pooling'
      ]
    },
    {
      phaseTag: 'PHASE 04 OF 05',
      weeks: 'Weeks 11&ndash;14 &middot; 120 Hours',
      title: 'Systems & IT Support',
      progressPct: '80%',
      progressText: '80% (400/500h)',
      desc: 'Website maintenance & optimization, LAN and network cable management, workstation hardware support, technical ticketing & diagnostics.',
      topicTags: [
        'Live Website Asset Maintenance',
        'LAN Cabling & Patch Panels',
        'Workstation Diagnostics & OS',
        'IT Support Ticketing'
      ],
      deliverables: [
        'Live website assets deployment and maintenance routines',
        'LAN cabling, patch panel crimping and router management',
        'Internal workstation hardware & OS diagnostic support',
        'Support ticket resolution & IT inventory documentation'
      ]
    },
    {
      phaseTag: 'PHASE 05 OF 05',
      weeks: 'Weeks 15&ndash;End &middot; 100 Hours',
      title: 'Turnover',
      progressPct: '100%',
      progressText: '100% (500/500h)',
      desc: 'Full-stack project implementation, promotional & digital media assets creation, technical documentation turnover, final presentation and evaluation.',
      topicTags: [
        'Production Deployment',
        'System Architecture Handover',
        'Stakeholder Demo Presentation',
        'Supervisor Evaluation Scoring'
      ],
      deliverables: [
        'Production-ready project deployment & demo',
        'Complete system architecture handover documentation',
        'Supervisor evaluation matrix review (100% total score)',
        'Formal completion ceremony & Certificate of Training issuance'
      ]
    }
  ];

  const phaseTabButtons = document.querySelectorAll('.phase-tab-btn');
  const stageDisplay = document.getElementById('curriculum-stage-display');
  const stageTitle = document.getElementById('stage-title');
  const stageProgressFill = document.getElementById('stage-progress-fill');
  const stageProgressText = document.getElementById('stage-progress-text');
  const stageDesc = document.getElementById('stage-desc');
  const stageTopicTags = document.getElementById('stage-topic-tags');
  const stageDeliverables = document.getElementById('stage-deliverables');
  const stageBgNum = document.getElementById('stage-bg-num');
  const stageFraction = document.getElementById('stage-fraction');
  const timelineProgressLine = document.getElementById('timeline-line-progress');

  let stageTimerId = null;

  const updateCurriculumStage = (index) => {
    const data = curriculumPhases[index];
    if (!data || !stageDisplay) return;

    // Clear existing 5s timer
    if (stageTimerId) clearTimeout(stageTimerId);

    // Update phase tab buttons active state and 5s countdown animation
    phaseTabButtons.forEach((btn, i) => {
      const isActive = i === index;
      const isCompleted = i < index;
      btn.classList.remove('animating-5s', 'animating-3s');
      btn.classList.toggle('active', isActive);
      btn.classList.toggle('completed', isCompleted);
      btn.setAttribute('aria-selected', isActive.toString());

      if (isActive) {
        // Trigger 5-second ring animation fill
        requestAnimationFrame(() => {
          setTimeout(() => {
            btn.classList.add('animating-5s');
          }, 30);
        });
      }
    });

    if (timelineProgressLine) {
      const pct = (index / (curriculumPhases.length - 1)) * 100;
      timelineProgressLine.style.width = `${pct}%`;
    }

    // Smooth transition animation
    stageDisplay.style.opacity = '0.4';
    stageDisplay.style.transform = 'translateY(6px)';

    setTimeout(() => {
      if (stageBgNum) stageBgNum.textContent = `0${index + 1}`;
      if (stageFraction) stageFraction.textContent = `0${index + 1} / 05`;
      if (stageTitle) stageTitle.textContent = data.title;
      if (stageProgressFill) stageProgressFill.style.width = data.progressPct;
      if (stageProgressText) stageProgressText.textContent = data.progressText;
      if (stageDesc) stageDesc.textContent = data.desc;

      // Update topic tags formatted as clean simple bullet items
      if (stageTopicTags && data.topicTags) {
        stageTopicTags.innerHTML = data.topicTags
          .map((tag) => `
            <div class="competency-simple-item">
              <span class="competency-dot"></span>
              <span class="competency-text">${tag}</span>
            </div>
          `)
          .join('');
      }

      // Update deliverables list formatted cleanly without heavy line dividers
      if (stageDeliverables && data.deliverables) {
        stageDeliverables.innerHTML = data.deliverables
          .map((d) => `
            <li class="deliverable-simple-item">
              <span class="deliverable-dot"></span>
              <span>${d}</span>
            </li>
          `)
          .join('');
      }

      stageDisplay.style.opacity = '1';
      stageDisplay.style.transform = 'translateY(0)';
    }, 140);

    // Auto-rotate every 5 seconds
    stageTimerId = setTimeout(() => {
      const nextIndex = (index + 1) % curriculumPhases.length;
      updateCurriculumStage(nextIndex);
    }, 5000);
  };

  phaseTabButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      updateCurriculumStage(index);
    });
  });

  // Initialize stage 0 timeline state with 5s auto-rotation
  updateCurriculumStage(0);

  // ==========================================================================
  // OPPORTUNITIES 3D CENTER-FOCUS SLIDING CAROUSEL CONTROLLER (5S AUTO-ROTATE)
  // ==========================================================================
  const oppTrack = document.getElementById('opp-slider-track');
  const oppViewport = document.getElementById('opp-slider-viewport');
  const oppCards = document.querySelectorAll('.opp-card-page');
  const oppDotsList = document.getElementById('opp-dots-list');
  const oppCounter = document.getElementById('opp-current-idx');
  let activeOppIdx = 0;
  let oppAutoRotateTimer = null;

  if (oppTrack && oppCards.length) {
    const startOppAutoRotate = () => {
      if (oppAutoRotateTimer) clearInterval(oppAutoRotateTimer);
      oppAutoRotateTimer = setInterval(() => {
        updateOppCarousel(activeOppIdx + 1, false);
      }, 5000);
    };

    // Generate indicator dots
    if (oppDotsList) {
      oppDotsList.innerHTML = '';
      oppCards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = `opp-dot-item ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to department ${i + 1}`);
        dot.addEventListener('click', () => updateOppCarousel(i, true));
        oppDotsList.appendChild(dot);
      });
    }

    const updateOppCarousel = (targetIndex, isUserAction = true) => {
      activeOppIdx = (targetIndex + oppCards.length) % oppCards.length;

      const firstCard = oppCards[0];
      const cardWidth = firstCard ? (firstCard.offsetWidth || 460) : 460;
      const gap = 32;
      const viewportWidth = oppViewport ? oppViewport.offsetWidth : window.innerWidth;

      const activeCardOffset = activeOppIdx * (cardWidth + gap);
      const centerOffset = (viewportWidth / 2) - (cardWidth / 2);
      const translateX = centerOffset - activeCardOffset;

      oppTrack.style.transform = `translateX(${translateX}px)`;

      oppCards.forEach((card, i) => {
        const isCenter = i === activeOppIdx;
        card.classList.toggle('active-center', isCenter);
        card.classList.toggle('side-blurred', !isCenter);
      });

      if (oppCounter) {
        oppCounter.textContent = `0${activeOppIdx + 1}`;
      }

      if (oppDotsList) {
        const dots = oppDotsList.querySelectorAll('.opp-dot-item');
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === activeOppIdx);
        });
      }

      // Reset 5s timer on manual click or rotation
      startOppAutoRotate();
    };

    oppCards.forEach((card, i) => {
      card.addEventListener('click', () => {
        if (i !== activeOppIdx) {
          updateOppCarousel(i, true);
        }
      });
    });

    const oppPrevBtn = document.getElementById('opp-prev-btn');
    const oppNextBtn = document.getElementById('opp-next-btn');

    if (oppPrevBtn) {
      oppPrevBtn.addEventListener('click', () => {
        updateOppCarousel(activeOppIdx - 1, true);
      });
    }

    if (oppNextBtn) {
      oppNextBtn.addEventListener('click', () => {
        updateOppCarousel(activeOppIdx + 1, true);
      });
    }

    // Also handle tab switch to recalculate center offset when tab becomes visible
    const tabOpportunitiesBtn = document.getElementById('tab-opportunities');
    if (tabOpportunitiesBtn) {
      tabOpportunitiesBtn.addEventListener('click', () => {
        setTimeout(() => updateOppCarousel(activeOppIdx, false), 50);
      });
    }

    // Initialize slider offset & start 5s auto-rotate
    setTimeout(() => {
      updateOppCarousel(0, false);
    }, 100);

    window.addEventListener('resize', () => updateOppCarousel(activeOppIdx, false));
  }

  // ==========================================================================
  // 5-STEP ALTERNATING PROCESS FLOW DIAGRAM CONTROLLER (5S AUTO-ROTATE)
  // ==========================================================================
  const processFlowTimeline = document.getElementById('process-flow-timeline');
  const flowDeliverableVal = document.getElementById('flow-deliverable-val');

  const flowStagesData = [
    {
      num: '01',
      title: 'Apply & Orientation',
      output: 'OJT Plan Approval & Department Onboarding'
    },
    {
      num: '02',
      title: 'Connect & Mentorship',
      output: 'Milestone Roadmap & Mentor Pairing'
    },
    {
      num: '03',
      title: 'Technical Experience',
      output: 'Production Commits & Core Software Deliverables'
    },
    {
      num: '04',
      title: 'Skill Growth & Review',
      output: 'Performance Evaluation & Skill Portfolio'
    },
    {
      num: '05',
      title: 'Program Graduation',
      output: 'Official OJT Certification & Career Clearance'
    }
  ];

  let currentFlowIndex = 0;
  let flowAutoTimer = null;

  if (processFlowTimeline) {
    const flowStepNodes = Array.from(document.querySelectorAll('.flow-step-node'));

    const updateFlowStage = (targetIndex) => {
      currentFlowIndex = (targetIndex + flowStagesData.length) % flowStagesData.length;
      const data = flowStagesData[currentFlowIndex];

      flowStepNodes.forEach((node, i) => {
        node.classList.toggle('active', i === currentFlowIndex);
      });

      if (flowDeliverableVal) flowDeliverableVal.textContent = data.output;
    };

    const startFlowAutoRotate = () => {
      if (flowAutoTimer) clearInterval(flowAutoTimer);
      flowAutoTimer = setInterval(() => {
        updateFlowStage(currentFlowIndex + 1);
      }, 5000);
    };

    flowStepNodes.forEach((node, i) => {
      node.addEventListener('click', () => {
        updateFlowStage(i);
        startFlowAutoRotate();
      });
    });

    // Initialize layout & 5s auto-rotate
    updateFlowStage(0);
    startFlowAutoRotate();

    // Recalculate when Journey tab becomes active
    const tabJourneyBtn = document.getElementById('tab-journey');
    if (tabJourneyBtn) {
      tabJourneyBtn.addEventListener('click', () => {
        setTimeout(() => updateFlowStage(currentFlowIndex), 50);
      });
    }
  }

  // ==========================================================================
  // 6. SCROLL REVEAL & EVALUATION PANEL COUNT-UP OBSERVER
  // ==========================================================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealSelector = '.reveal-heading, .reveal-text, .reveal-card, .reveal-group, .scroll-reveal';
  const revealElements = document.querySelectorAll(revealSelector);

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    // High-performance single-trigger reveal observer
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Unobserve so it triggers once smoothly and frees CPU/GPU resources
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Evaluation System Count-Up Animation Observer
    const evalSection = document.querySelector('.eval-bars-list');
    if (evalSection) {
      let animated = false;
      const evalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !animated) {
            animated = true;
            
            const pctElements = document.querySelectorAll('.eval-bar-pct');
            const fillElements = document.querySelectorAll('.eval-progress-fill');

            pctElements.forEach(el => {
              const target = parseInt(el.getAttribute('data-count'), 10) || 0;
              let current = 0;
              const duration = 1200;
              const stepTime = Math.max(Math.floor(duration / target), 15);
              const timer = setInterval(() => {
                current += 1;
                el.textContent = `${current}%`;
                if (current >= target) {
                  clearInterval(timer);
                  el.textContent = `${target}%`;
                }
              }, stepTime);
            });

            fillElements.forEach(fill => {
              const targetWidth = fill.getAttribute('data-width') || '0%';
              fill.style.width = targetWidth;
            });
          }
        });
      }, { threshold: 0.25 });

      evalObserver.observe(evalSection);
    }
  } else {
    // Fallback if reduced motion or no IntersectionObserver
    revealElements.forEach(el => el.classList.add('revealed'));
    document.querySelectorAll('.eval-bar-pct').forEach(el => {
      el.textContent = `${el.getAttribute('data-count')}%`;
    });
    document.querySelectorAll('.eval-progress-fill').forEach(fill => {
      fill.style.width = fill.getAttribute('data-width');
    });
  }

  // ==========================================================================
  // 7. TABBED CONTENT HUB CONTROLLER
  // ==========================================================================
  const hubTabs = document.querySelectorAll('.hub-tab');
  const hubPanels = document.querySelectorAll('.hub-panel');

  if (hubTabs.length && hubPanels.length) {
    hubTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('data-hub-tab');
        if (!targetId) return;

        // Deactivate all tabs and panels
        hubTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        hubPanels.forEach(p => {
          p.classList.remove('active');
        });

        // Activate clicked tab and corresponding panel
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');

          // Re-trigger entrance animation
          targetPanel.style.animation = 'none';
          targetPanel.offsetHeight; // Force reflow
          targetPanel.style.animation = '';

          // Re-observe eval bars if curriculum tab is activated
          if (targetId === 'hub-curriculum') {
            const evalSection = targetPanel.querySelector('.eval-bars-list');
            if (evalSection && 'IntersectionObserver' in window) {
              const localObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                  if (entry.isIntersecting) {
                    const pctElements = evalSection.querySelectorAll('.eval-bar-pct');
                    const fillElements = evalSection.querySelectorAll('.eval-progress-fill');
                    pctElements.forEach(el => {
                      const target = parseInt(el.getAttribute('data-count'), 10) || 0;
                      let current = 0;
                      const stepTime = Math.max(Math.floor(1200 / target), 15);
                      const timer = setInterval(() => {
                        current++;
                        el.textContent = `${current}%`;
                        if (current >= target) clearInterval(timer);
                      }, stepTime);
                    });
                    fillElements.forEach(fill => {
                      fill.style.width = fill.getAttribute('data-width') || '0%';
                    });
                    localObserver.disconnect();
                  }
                });
              }, { threshold: 0.25 });
              localObserver.observe(evalSection);
            }
          }
        }
      });
    });

    // Handle hash-based navigation to hub tabs
    const checkHubHash = () => {
      const hash = window.location.hash.replace('#', '');
      const hashTabMap = {
        'program': 'hub-experience',
        'experience': 'hub-experience',
        'curriculum': 'hub-curriculum',
        'opportunities': 'hub-opportunities',
        'journey': 'hub-journey'
      };
      
      if (hashTabMap[hash]) {
        const matchingTab = document.querySelector(`.hub-tab[data-hub-tab="${hashTabMap[hash]}"]`);
        if (matchingTab) {
          matchingTab.click();
          const hubSection = document.querySelector('.content-hub-section');
          if (hubSection) {
            setTimeout(() => {
              hubSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
          }
        }
      }
    };

    checkHubHash();
    window.addEventListener('hashchange', checkHubHash);
  }

  // ==========================================================================
  // 8. INTERN TESTIMONIALS SLIDER CONTROLLER (5S AUTO-ROTATE + PEEK PREVIEW)
  // ==========================================================================
  const testimonialCards = document.querySelectorAll('.testimonial-card-noorana');
  const testimonialDots = document.querySelectorAll('.testimonial-dot');
  const testimonialSection = document.querySelector('.testimonials-section');

  if (testimonialCards.length > 0) {
    let currentSlide = 0;
    const totalSlides = testimonialCards.length;
    let autoPlayTimer = null;

    const goToSlide = (index) => {
      currentSlide = (index + totalSlides) % totalSlides;
      const nextPeekSlide = (currentSlide + 1) % totalSlides;

      testimonialCards.forEach((card, idx) => {
        const isActive = idx === currentSlide;
        const isPeekNext = idx === nextPeekSlide && totalSlides > 1;

        card.classList.toggle('active', isActive);
        card.classList.toggle('is-peek-next', isPeekNext);
        card.setAttribute('aria-hidden', (!isActive).toString());
      });

      testimonialDots.forEach((dot, idx) => {
        const isActive = idx === currentSlide;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-selected', isActive.toString());
      });
    };

    testimonialCards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        if (card.classList.contains('is-peek-next')) {
          goToSlide(currentSlide + 1);
          resetAutoPlay();
        }
      });
    });

    testimonialDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        goToSlide(idx);
        resetAutoPlay();
      });
    });

    const startAutoPlay = () => {
      if (!autoPlayTimer) {
        autoPlayTimer = setInterval(() => {
          goToSlide(currentSlide + 1);
        }, 5000);
      }
    };

    const stopAutoPlay = () => {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    };

    const resetAutoPlay = () => {
      stopAutoPlay();
      startAutoPlay();
    };

    if (testimonialSection) {
      testimonialSection.addEventListener('mouseenter', stopAutoPlay);
      testimonialSection.addEventListener('mouseleave', startAutoPlay);

      // Touch swipe support
      let touchStartX = 0;
      testimonialSection.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        stopAutoPlay();
      }, { passive: true });

      testimonialSection.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const deltaX = touchStartX - touchEndX;
        if (Math.abs(deltaX) > 40) {
          if (deltaX > 0) {
            goToSlide(currentSlide + 1);
          } else {
            goToSlide(currentSlide - 1);
          }
        }
        resetAutoPlay();
      }, { passive: true });
    }

    // Initialize slide 0 & start auto-play
    goToSlide(0);
    startAutoPlay();
  }

  // ==========================================================================
  // 8B. INTERN CONTRIBUTION MODAL CONTROLLER
  // ==========================================================================
  const internContributionsData = [
    {
      name: 'Mark Peligros',
      role: 'Tech Support & Creatives Intern',
      school: 'Pateros Technological College (BSIT)',
      avatar: 'intern%20image/mark.png',
      contributions: [
        'Configured, deployed, and maintained workstation environments, development PCs, and classroom technical setups.',
        'Designed digital promotional banners, social media marketing graphics, and review class announcements.',
        'Provided live technical support during student NCLEX review sessions, network testing, and IT troubleshooting.'
      ],
      quote: '"I would like to express my sincere gratitude to NCLEX Amplified for the opportunity to intern during my college years. This experience provided invaluable exposure to the IT industry, offering deep insights into corporate operations and significantly enhancing my professional skill set."'
    },
    {
      name: 'Keith Ciceron',
      role: 'Software Developer & Web Developer Intern',
      school: 'San Sebastian College-Recoletos Manila (BSIT)',
      avatar: 'intern%20image/keith.png',
      contributions: [
        'Architected and developed the Intern IT Dashboard with an Automated Daily Time Record (DTR) System.',
        'Engineered and designed the official NCLEX Amplified Interns Landing Page.',
        'Developed responsive web user interfaces and interactive student exam practice modules.',
        'Built RESTful API endpoints and integrated backend data pipelines using modern JavaScript & Node.js.',
        'Conducted cross-browser quality assurance testing, performance tuning, and frontend accessibility enhancements.'
      ],
      quote: '"As a software and web developer intern, I was given real responsibility on student portal improvements, web features, and system integrations. The mentors guided me through modern production engineering standards."'
    },
    {
      name: 'Ysmael Trias',
      role: 'Computer Engineering Intern',
      school: 'Cavite State University Main (CPE)',
      avatar: 'intern%20image/ysmael.png',
      contributions: [
        'Developed automated batch scripts and utilities for internal data backups and student record processing.',
        'Monitored local network infrastructure, router bandwidth allocations, and low-latency Wi-Fi stability for mock exams.',
        'Authored technical standard operating procedures (SOPs) and comprehensive system handover documentation.'
      ],
      quote: '"The team provided structured mentorship and practical technical tasks that directly aligned with my engineering curriculum. I learned how systems operate at scale and built lasting confidence in professional workplace collaboration."'
    }
  ];

  const internModal = document.getElementById('intern-modal');
  const internModalClose = document.getElementById('intern-modal-close');
  const internModalCloseBtn = document.getElementById('intern-modal-close-btn');
  const internModalAvatar = document.getElementById('intern-modal-avatar');
  const internModalName = document.getElementById('intern-modal-name');
  const internModalRole = document.getElementById('intern-modal-role');
  const internModalSchoolText = document.getElementById('intern-modal-school-text');
  const internModalContributions = document.getElementById('intern-modal-contributions');
  const internModalQuote = document.getElementById('intern-modal-quote');

  const openInternModal = (index) => {
    const data = internContributionsData[index];
    if (!data) return;

    if (internModalAvatar) internModalAvatar.src = data.avatar;
    if (internModalName) internModalName.textContent = data.name;
    if (internModalRole) internModalRole.textContent = data.role;
    if (internModalSchoolText) internModalSchoolText.textContent = data.school;
    if (internModalQuote) internModalQuote.textContent = data.quote;

    if (internModalContributions) {
      internModalContributions.innerHTML = data.contributions.map(item => `
        <li>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>${item}</span>
        </li>
      `).join('');
    }

    if (internModal) {
      internModal.classList.add('active');
      internModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeInternModal = () => {
    if (internModal) {
      internModal.classList.remove('active');
      internModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  if (internModalClose) internModalClose.addEventListener('click', closeInternModal);
  if (internModalCloseBtn) internModalCloseBtn.addEventListener('click', closeInternModal);
  if (internModal) {
    internModal.addEventListener('click', (e) => {
      if (e.target === internModal) closeInternModal();
    });
  }

  // Bind View Contribution Buttons
  const viewContributionButtons = document.querySelectorAll('.btn-view-contribution');
  viewContributionButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const index = parseInt(btn.getAttribute('data-intern-index'), 10);
      openInternModal(index);
    });
  });

  // Keydown Escape support for both modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDeptModal();
      closeInternModal();
    }
  });

  // ==========================================================================
  // 9. FAQ ACCORDION (SINGLE-OPEN TOGGLE)
  // ==========================================================================
  const faqItems = document.querySelectorAll('.faq-item-noorana');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-btn-noorana');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
          const otherBtn = otherItem.querySelector('.faq-btn-noorana');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('open', !isExpanded);
      btn.setAttribute('aria-expanded', (!isExpanded).toString());
    });
  });

  // ==========================================================================
  // 10. DEPARTMENT DETAILS MODAL DRAWER
  // ==========================================================================
  const deptModal = document.getElementById('dept-modal');
  const deptModalClose = document.getElementById('dept-modal-close');
  const deptModalTitle = document.getElementById('dept-modal-title');
  const deptModalTag = document.getElementById('dept-modal-tag');
  const deptModalScope = document.getElementById('dept-modal-scope');
  const deptModalReq = document.getElementById('dept-modal-req');
  const deptApplyDirect = document.getElementById('dept-apply-direct');
  let selectedDeptName = '';

  const deptItems = document.querySelectorAll('.dept-item-noorana');

  const openDeptModal = (item) => {
    const dept = item.getAttribute('data-dept');
    const deptInfo = departmentDescriptions[dept] || {};
    const scope = deptInfo.scope || item.getAttribute('data-scope');
    const tags = item.getAttribute('data-tags');
    const req = deptInfo.req || item.getAttribute('data-req');

    selectedDeptName = dept;
    if (deptModalTitle) deptModalTitle.textContent = `${dept} Department`;
    if (deptModalTag) deptModalTag.textContent = tags || 'OJT Credited';
    if (deptModalScope) deptModalScope.textContent = scope || '';
    if (deptModalReq) deptModalReq.textContent = req || '';

    if (deptModal) {
      deptModal.classList.add('active');
      deptModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeDeptModal = () => {
    if (deptModal) {
      deptModal.classList.remove('active');
      deptModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  deptItems.forEach(item => {
    item.addEventListener('click', () => openDeptModal(item));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDeptModal(item);
      }
    });
  });

  if (deptModalClose) deptModalClose.addEventListener('click', closeDeptModal);
  if (deptModal) {
    deptModal.addEventListener('click', (e) => {
      if (e.target === deptModal) closeDeptModal();
    });
  }

  // ==========================================================================
  // 11. DIRECT GMAIL APPLICATION REDIRECT (NO FORM REQUIRED)
  // ==========================================================================
  const HR_EMAIL = 'nclexamplifiedhr@gmail.com';

  const applyDirectToGmail = (department = '', customData = null) => {
    // Close mobile menu drawer if open
    toggleMobileNav(true);
    // Close department modal if open
    closeDeptModal();
    // Close intern modal if open
    closeInternModal();

    const fullName = customData?.name || '[Full Name]';
    const school = customData?.school || '[School / University]';
    const hours = customData?.hours ? `${customData.hours} Hours` : '[Number of Hours]';
    const track = department || customData?.track || '';

    const subject = track 
      ? `Internship / OJT Application \u2013 ${track} \u2013 ${fullName}`
      : `Internship / OJT Application \u2013 ${fullName}`;

    const emailBody = `Dear NCLEX Amplified Review Center,

Good day!

[Reason for Applying]

Applicant Information
Full Name: ${fullName}
School / University: ${school}
Degree Program / Course: [Degree / Course]
Required OJT Hours: ${hours}
Contact Number: [Contact Number]
Email Address: [Email Address]
Preferred Internship Start Date: [Start Date]

I have attached my updated CV/Resume and other required documents for your review and consideration.

I would greatly appreciate the opportunity to complete my internship with NCLEX Amplified Review Center and contribute positively to the organization while gaining valuable professional experience.

Thank you for your time and consideration. I look forward to hearing from you regarding the status of my application and the next steps in the process.

Respectfully,
${fullName}
[Contact Number]
[Email Address]`;

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(HR_EMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

    // Open Gmail directly in a new tab/window
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
  };

  const openApplyButtons = document.querySelectorAll('.open-apply-modal');
  openApplyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (btn.id === 'btn-apply-with-plan') {
        const nameVal = document.getElementById('cert-input-name')?.value || '';
        const schoolVal = document.getElementById('cert-input-school')?.value || '';
        const hoursVal = document.getElementById('cert-input-hours')?.value || '';
        const trackVal = document.getElementById('cert-input-track')?.value || '';
        applyDirectToGmail(trackVal, { name: nameVal, school: schoolVal, hours: hoursVal, track: trackVal });
      } else {
        applyDirectToGmail();
      }
    });
  });

  if (deptApplyDirect) {
    deptApplyDirect.addEventListener('click', () => {
      applyDirectToGmail(selectedDeptName);
    });
  }

  // ==========================================================================
  // 12. INTERACTIVE IT INTERN DASHBOARD SUITE CONTROLLER
  // ==========================================================================
  // A. Tab Switcher
  const dashTabs = document.querySelectorAll('.dash-tab');
  const dashPanels = document.querySelectorAll('.dash-panel');

  dashTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPanelId = tab.getAttribute('data-dash-tab');

      dashTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      dashPanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const targetPanel = document.getElementById(targetPanelId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // B. Automated DTR Controller
  const dtrLiveClock = document.getElementById('dtr-live-clock');
  const dtrLiveDate = document.getElementById('dtr-live-date');
  const dtrBtnToggle = document.getElementById('btn-dtr-toggle');
  const dtrBtnLabel = document.getElementById('dtr-btn-label');
  const dtrUserStatus = document.getElementById('dtr-user-status');
  const dtrLastLog = document.getElementById('dtr-last-log');
  const dtrHistoryBody = document.getElementById('dtr-history-body');
  const dtrHoursText = document.getElementById('dtr-hours-text');
  const dtrProgBarFill = document.getElementById('dtr-prog-bar-fill');
  const dtrRemainingText = document.getElementById('dtr-remaining-text');
  const dtrPaceText = document.getElementById('dtr-pace-text');
  const btnExportDtr = document.getElementById('btn-export-dtr');

  let isClockedIn = false;
  let currentCompletedHours = 0;
  const targetRequiredHours = 500;

  // Fresh Shift History (starts clean with no pre-existing clutter)
  let shiftHistoryData = [];

  const renderDTRTable = () => {
    if (!dtrHistoryBody) return;
    if (shiftHistoryData.length === 0) {
      dtrHistoryBody.innerHTML = `
        <tr>
          <td colspan="5" class="dtr-empty-state-cell">
            No shifts recorded yet. Click <strong>"CLOCK IN FOR TODAY"</strong> to start logging your live hours.
          </td>
        </tr>
      `;
      return;
    }
    const displayRows = shiftHistoryData.slice(0, 4);
    dtrHistoryBody.innerHTML = displayRows.map(row => `
      <tr>
        <td><strong>${row.date}</strong></td>
        <td>${row.in}</td>
        <td>${row.out}</td>
        <td>${row.rendered}</td>
        <td><span class="badge-verified">${row.supervisor}</span></td>
      </tr>
    `).join('');
  };
  renderDTRTable();

  // Live Philippine Clock Update
  const updatePSTClock = () => {
    const now = new Date();
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Manila',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Manila',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    if (dtrLiveClock) dtrLiveClock.textContent = timeFormatter.format(now);
    if (dtrLiveDate) dtrLiveDate.textContent = dateFormatter.format(now);
  };
  setInterval(updatePSTClock, 1000);
  updatePSTClock();

  // Clock In / Clock Out Action with dynamic live tracking
  if (dtrBtnToggle) {
    dtrBtnToggle.addEventListener('click', () => {
      const now = new Date();
      const timeStr = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit', hour12: true }).format(now);
      const dateStr = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Manila', month: 'short', day: 'numeric', year: 'numeric' }).format(now);

      if (!isClockedIn) {
        // CLOCK IN
        isClockedIn = true;
        dtrBtnToggle.classList.add('is-clocked-in');
        if (dtrBtnLabel) dtrBtnLabel.textContent = 'CLOCK OUT FOR TODAY';
        if (dtrUserStatus) {
          dtrUserStatus.className = 'dtr-status-pill logged-in';
          dtrUserStatus.innerHTML = '<span class="status-indicator-dot"></span> Active Shift';
        }
        if (dtrLastLog) dtrLastLog.textContent = `Shift active since ${timeStr}. Click Clock Out when shift ends.`;

        // Insert or update active shift
        const existingTodayIdx = shiftHistoryData.findIndex(item => item.date === dateStr);
        if (existingTodayIdx !== -1) {
          shiftHistoryData[existingTodayIdx] = {
            date: dateStr,
            in: timeStr,
            out: 'In Progress...',
            rendered: 'Active',
            supervisor: 'Gene W. (Supervisor)'
          };
        } else {
          shiftHistoryData.unshift({
            date: dateStr,
            in: timeStr,
            out: 'In Progress...',
            rendered: 'Active',
            supervisor: 'Gene W. (Supervisor)'
          });
        }
        shiftHistoryData = shiftHistoryData.slice(0, 4);
        renderDTRTable();

        if (dtrPaceText) {
          dtrPaceText.textContent = 'Shift Active';
          dtrPaceText.className = 'text-success';
        }

      } else {
        // CLOCK OUT
        isClockedIn = false;
        dtrBtnToggle.classList.remove('is-clocked-in');
        if (dtrBtnLabel) dtrBtnLabel.textContent = 'CLOCK IN FOR TODAY';
        if (dtrUserStatus) {
          dtrUserStatus.className = 'dtr-status-pill';
          dtrUserStatus.innerHTML = '<span class="status-indicator-dot"></span> Logged Out';
        }
        if (dtrLastLog) dtrLastLog.textContent = `Shift completed at ${timeStr}. 8.0 hours recorded.`;

        // Credit 8 hours
        currentCompletedHours = 8;
        const percent = ((currentCompletedHours / targetRequiredHours) * 100).toFixed(1);
        const remaining = targetRequiredHours - currentCompletedHours;

        if (dtrHoursText) dtrHoursText.textContent = `${currentCompletedHours} / ${targetRequiredHours} Hrs (${percent}%)`;
        if (dtrProgBarFill) dtrProgBarFill.style.width = `${percent}%`;
        if (dtrRemainingText) dtrRemainingText.textContent = `${remaining} Hours Remaining`;
        if (dtrPaceText) {
          dtrPaceText.textContent = 'Logged 8.0 Hrs';
          dtrPaceText.className = 'text-success';
        }

        // Update shift record in table
        const existingTodayIdx = shiftHistoryData.findIndex(item => item.date === dateStr);
        if (existingTodayIdx !== -1) {
          shiftHistoryData[existingTodayIdx] = {
            date: dateStr,
            in: '08:00 AM',
            out: timeStr,
            rendered: '8.0 hrs',
            supervisor: 'Gene W. (Verified)'
          };
        } else {
          shiftHistoryData.unshift({
            date: dateStr,
            in: '08:00 AM',
            out: timeStr,
            rendered: '8.0 hrs',
            supervisor: 'Gene W. (Verified)'
          });
        }
        shiftHistoryData = shiftHistoryData.slice(0, 4);
        renderDTRTable();
      }
    });
  }

  // Export DTR action (Sample Demo)
  if (btnExportDtr) {
    btnExportDtr.addEventListener('click', () => {
      alert(`NCLEX Amplified Daily Time Record\n\n[Live Interactive DTR System]\nStatus: ${isClockedIn ? 'Active Shift in Progress' : 'Shift Logged'}\nTotal Logged: ${currentCompletedHours} / ${targetRequiredHours} Hours\nSupervisor: Gene Mathew Wagas (Lead Supervisor)`);
    });
  }

  // C. UI/UX Live Certificate Creator Studio Controller (Name only)
  const certLiveInputName = document.getElementById('cert-live-input-name');
  const certOverlayName = document.getElementById('cert-overlay-name');
  const btnDownloadTesterCert = document.getElementById('btn-download-tester-cert');

  // Real-time letter-by-letter typing synchronization
  if (certLiveInputName && certOverlayName) {
    certLiveInputName.addEventListener('input', (e) => {
      const val = e.target.value;
      certOverlayName.textContent = val.trim() !== '' ? val : 'Name of Tester';
    });
  }

  // High-Resolution 2000x1414 PNG Certificate Generator & Downloader
  if (btnDownloadTesterCert) {
    btnDownloadTesterCert.addEventListener('click', () => {
      const originalBtnHtml = btnDownloadTesterCert.innerHTML;
      btnDownloadTesterCert.innerHTML = `<span>Generating PNG...</span>`;
      btnDownloadTesterCert.style.pointerEvents = 'none';

      const canvas = document.createElement('canvas');
      canvas.width = 2000;
      canvas.height = 1414;
      const ctx = canvas.getContext('2d');

      const templateImg = new Image();
      templateImg.onload = () => {
        // 1. Draw base high-resolution certificate template
        ctx.drawImage(templateImg, 0, 0, 2000, 1414);

        // 2. Setup typography matching sample output
        const nameText = (certLiveInputName && certLiveInputName.value.trim() !== '') 
          ? certLiveInputName.value.trim() 
          : 'Name of Tester';

        let fontSize = 98;
        if (nameText.length > 30) fontSize = 68;
        else if (nameText.length > 20) fontSize = 82;

        ctx.font = `600 ${fontSize}px 'Great Vibes', 'Dancing Script', cursive`;
        ctx.fillStyle = '#0A25C9';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 3. Render name in exact position
        ctx.fillText(nameText, 1000, 755);

        // 4. Trigger download
        const safeFileName = nameText.replace(/[^a-zA-Z0-9]/g, '_');
        const dataUrl = canvas.toDataURL('image/png');

        const downloadLink = document.createElement('a');
        downloadLink.href = dataUrl;
        downloadLink.download = `NCLEX_Amplified_Certificate_${safeFileName}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        // Restore button state
        setTimeout(() => {
          btnDownloadTesterCert.innerHTML = originalBtnHtml;
          btnDownloadTesterCert.style.pointerEvents = 'auto';
        }, 600);
      };

      templateImg.onerror = () => {
        alert('Could not load certificate template image. Please check template file.');
        btnDownloadTesterCert.innerHTML = originalBtnHtml;
        btnDownloadTesterCert.style.pointerEvents = 'auto';
      };

      templateImg.src = 'certificate/template.png';
    });
  }

  // D. Live Coding Assessment & Real Interactive Compiler Sandbox Controller
  const codeLangSelect = document.getElementById('code-lang-select');
  const btnCodeRun = document.getElementById('btn-code-run');
  const btnCodeClear = document.getElementById('btn-code-clear');
  const codeFilenameLabel = document.getElementById('code-filename-label');
  const codeLineNumbers = document.getElementById('code-line-numbers');
  const codeTextarea = document.getElementById('code-textarea');
  const terminalStatusWrap = document.getElementById('terminal-status-wrap');
  const terminalStatusDot = document.getElementById('terminal-status-dot');
  const terminalStatusText = document.getElementById('terminal-status-text');
  const terminalLatencyTag = document.getElementById('terminal-latency-tag');
  const terminalCmdText = document.getElementById('terminal-cmd-text');
  const terminalStdoutContainer = document.getElementById('terminal-stdout-container');

  const TARGET_OUTPUT = 'Internship at NCLEX Amplified';

  const langMetadata = {
    python: { name: 'Python 3', filename: 'main.py', command: 'python3 main.py', placeholder: 'Write Python 3 code (e.g. print("..."))' },
    javascript: { name: 'JavaScript (Node.js)', filename: 'main.js', command: 'node main.js', placeholder: 'Write JavaScript code (e.g. console.log("..."))' },
    typescript: { name: 'TypeScript', filename: 'app.ts', command: 'ts-node app.ts', placeholder: 'Write TypeScript code (e.g. console.log("..."))' },
    java: { name: 'Java 17', filename: 'Main.java', command: 'java Main.java', placeholder: 'Write Java code (e.g. System.out.println("..."))' },
    cpp: { name: 'C++ 20', filename: 'main.cpp', command: 'g++ -O3 main.cpp && ./a.out', placeholder: 'Write C++ code (e.g. std::cout << "...")' },
    php: { name: 'PHP 8.2', filename: 'index.php', command: 'php index.php', placeholder: 'Write PHP code (e.g. echo "...")' },
    go: { name: 'Go 1.22', filename: 'main.go', command: 'go run main.go', placeholder: 'Write Go code (e.g. fmt.Println("..."))' },
    csharp: { name: 'C# (.NET 8)', filename: 'Program.cs', command: 'dotnet run', placeholder: 'Write C# code (e.g. Console.WriteLine("..."))' }
  };

  const updateLineNumbers = () => {
    if (!codeTextarea || !codeLineNumbers) return;
    const lines = (codeTextarea.value || '').split('\n').length;
    let numsHtml = '';
    for (let i = 1; i <= Math.max(lines, 1); i++) {
      numsHtml += `<span>${i}</span>`;
    }
    codeLineNumbers.innerHTML = numsHtml;
  };

  const resetTerminalState = () => {
    if (terminalStatusWrap) terminalStatusWrap.className = 'terminal-header-status';
    if (terminalStatusDot) terminalStatusDot.className = 'status-dot status-dot-idle';
    if (terminalStatusText) terminalStatusText.textContent = 'Ready · Awaiting Run';
    if (terminalLatencyTag) terminalLatencyTag.textContent = 'Output Evaluation';
    if (terminalStdoutContainer) {
      terminalStdoutContainer.innerHTML = '<div class="terminal-stdout-empty">Editor is ready. Type your code on the left and click <strong>"Run Code"</strong> to test if your output is correct.</div>';
    }
  };

  const updateLanguageSelection = () => {
    const selectedLang = codeLangSelect ? codeLangSelect.value : 'python';
    const meta = langMetadata[selectedLang] || langMetadata.python;
    
    if (codeFilenameLabel) codeFilenameLabel.textContent = meta.filename;
    if (terminalCmdText) terminalCmdText.textContent = meta.command;
    if (codeTextarea) {
      codeTextarea.value = '';
      codeTextarea.placeholder = `${meta.placeholder} to output: Internship at NCLEX Amplified`;
      updateLineNumbers();
    }
    resetTerminalState();
  };

  // Compiler Simulator: Strictly validates function names, syntax rules, and exact output
  const compileAndExecuteApplicantCode = (rawCode, lang) => {
    const trimmed = rawCode.trim();
    if (!trimmed) {
      return { status: 'empty', output: '', errorMsg: 'Code editor is empty. Please type your solution.' };
    }

    // Helper: collect variables in simple scripting
    const varMap = {};
    const lines = trimmed.split('\n');
    lines.forEach(l => {
      const vMatch = l.match(/(?:const|let|var|\$)?\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(["'`])([\s\S]*?)\2/);
      if (vMatch) {
        varMap[vMatch[1]] = vMatch[3];
      }
    });

    // Language specific compilation checks:
    if (lang === 'python') {
      if (/console\.(?:log|info)/.test(trimmed)) {
        return { status: 'error', errorType: 'NameError', errorMsg: "NameError: name 'console' is not defined. (In Python, use print(...))" };
      }
      if (/System\.out/.test(trimmed)) {
        return { status: 'error', errorType: 'NameError', errorMsg: "NameError: name 'System' is not defined. (In Python, use print(...))" };
      }
      if (/printf\s*\(/.test(trimmed)) {
        return { status: 'error', errorType: 'NameError', errorMsg: "NameError: name 'printf' is not defined. Did you mean 'print'?" };
      }
      if (/echo\s+/.test(trimmed)) {
        return { status: 'error', errorType: 'SyntaxError', errorMsg: "SyntaxError: invalid syntax. (In Python, use print(...))" };
      }
      if (/cout\s*<</.test(trimmed)) {
        return { status: 'error', errorType: 'SyntaxError', errorMsg: "SyntaxError: invalid syntax. (In Python, use print(...))" };
      }

      const printRegex = /print\s*\(([\s\S]*?)\)/;
      const match = trimmed.match(printRegex);
      if (!match) {
        return { status: 'error', errorType: 'SyntaxError', errorMsg: "SyntaxError: No valid print() function detected in Python script." };
      }

      const arg = match[1].trim();
      const strLiteralMatch = arg.match(/^(["'])([\s\S]*?)\1$/);
      if (strLiteralMatch) {
        return { status: 'executed', output: strLiteralMatch[2] };
      } else if (varMap[arg]) {
        return { status: 'executed', output: varMap[arg] };
      } else if (arg.includes('+')) {
        const parts = arg.split('+').map(p => {
          const m = p.trim().match(/^(["'])([\s\S]*?)\1$/);
          return m ? m[2] : (varMap[p.trim()] || '');
        });
        return { status: 'executed', output: parts.join('') };
      } else {
        return { status: 'error', errorType: 'SyntaxError', errorMsg: `SyntaxError: Missing quotes or undefined variable around print(${arg})` };
      }
    }

    if (lang === 'javascript' || lang === 'typescript') {
      if (/print\s*\(/.test(trimmed) && !/console\.log/.test(trimmed)) {
        return { status: 'error', errorType: 'ReferenceError', errorMsg: `ReferenceError: print is not defined. (In ${lang === 'javascript' ? 'JavaScript' : 'TypeScript'}, use console.log(...))` };
      }
      if (/System\.out/.test(trimmed)) {
        return { status: 'error', errorType: 'ReferenceError', errorMsg: "ReferenceError: System is not defined. (In JavaScript, use console.log(...))" };
      }
      if (/echo\s+/.test(trimmed)) {
        return { status: 'error', errorType: 'SyntaxError', errorMsg: "SyntaxError: Unexpected token 'echo'" };
      }

      const logRegex = /console\.(?:log|info)\s*\(([\s\S]*?)\)/;
      const match = trimmed.match(logRegex);
      if (!match) {
        return { status: 'error', errorType: 'SyntaxError', errorMsg: "SyntaxError: No valid console.log() statement found." };
      }

      const arg = match[1].trim();
      const strLiteralMatch = arg.match(/^(["'`])([\s\S]*?)\1$/);
      if (strLiteralMatch) {
        return { status: 'executed', output: strLiteralMatch[2] };
      } else if (varMap[arg]) {
        return { status: 'executed', output: varMap[arg] };
      } else if (arg.includes('+')) {
        const parts = arg.split('+').map(p => {
          const m = p.trim().match(/^(["'`])([\s\S]*?)\1$/);
          return m ? m[2] : (varMap[p.trim()] || '');
        });
        return { status: 'executed', output: parts.join('') };
      } else {
        return { status: 'error', errorType: 'SyntaxError', errorMsg: `SyntaxError: Unexpected identifier or missing string quotes: ${arg}` };
      }
    }

    if (lang === 'java') {
      if (/print\s*\(/.test(trimmed) && !/System\.out/.test(trimmed)) {
        return { status: 'error', errorType: 'CompileError', errorMsg: "error: cannot find symbol: method print(String). In Java, use System.out.println(...);" };
      }
      if (/console\.log/.test(trimmed)) {
        return { status: 'error', errorType: 'CompileError', errorMsg: "error: package console does not exist. In Java, use System.out.println(...);" };
      }
      const javaMatch = trimmed.match(/System\.out\.print(?:ln)?\s*\(\s*(["'])([\s\S]*?)\1\s*\)/);
      if (javaMatch) {
        return { status: 'executed', output: javaMatch[2] };
      }
      return { status: 'error', errorType: 'CompileError', errorMsg: "error: invalid Java syntax or missing System.out.println(\"...\");" };
    }

    if (lang === 'cpp') {
      if (/print\s*\(/.test(trimmed)) {
        return { status: 'error', errorType: 'CompileError', errorMsg: "error: ‘print’ was not declared in this scope. In C++, use std::cout << \"...\";" };
      }
      if (/console\.log/.test(trimmed)) {
        return { status: 'error', errorType: 'CompileError', errorMsg: "error: ‘console’ has not been declared." };
      }
      const cppMatch = trimmed.match(/(?:std::)?cout\s*<<\s*(["'])([\s\S]*?)\1/);
      if (cppMatch) {
        return { status: 'executed', output: cppMatch[2] };
      }
      return { status: 'error', errorType: 'CompileError', errorMsg: "error: invalid C++ syntax or missing std::cout << \"...\";" };
    }

    if (lang === 'php') {
      if (/console\.log/.test(trimmed)) {
        return { status: 'error', errorType: 'FatalError', errorMsg: "Fatal error: Uncaught Error: Call to undefined function console(). In PHP, use echo \"...\";" };
      }
      const phpMatch = trimmed.match(/(?:echo|print)\s*(?:\(?\s*)?(["'])([\s\S]*?)\1(?:\s*\)?)?/);
      if (phpMatch) {
        return { status: 'executed', output: phpMatch[2] };
      }
      return { status: 'error', errorType: 'ParseError', errorMsg: "Parse error: syntax error, unexpected token. In PHP, use echo \"...\";" };
    }

    if (lang === 'go') {
      if (/console\.log/.test(trimmed)) {
        return { status: 'error', errorType: 'CompileError', errorMsg: "undefined: console. In Go, use fmt.Println(\"...\")" };
      }
      const goMatch = trimmed.match(/(?:fmt\.)?Print(?:ln|f)?\s*\(\s*(["'])([\s\S]*?)\1\s*\)/);
      if (goMatch) {
        return { status: 'executed', output: goMatch[2] };
      }
      return { status: 'error', errorType: 'CompileError', errorMsg: "syntax error: unexpected statement. In Go, use fmt.Println(\"...\")" };
    }

    if (lang === 'csharp') {
      if (/print\s*\(/.test(trimmed) && !/Console\.Write/.test(trimmed)) {
        return { status: 'error', errorType: 'CompileError', errorMsg: "error CS0103: The name 'print' does not exist in the current context. In C#, use Console.WriteLine(\"...\");" };
      }
      if (/console\.log/.test(trimmed)) {
        return { status: 'error', errorType: 'CompileError', errorMsg: "error CS0103: The name 'console' does not exist in the current context." };
      }
      const csMatch = trimmed.match(/Console\.Write(?:Line)?\s*\(\s*(["'])([\s\S]*?)\1\s*\)/);
      if (csMatch) {
        return { status: 'executed', output: csMatch[2] };
      }
      return { status: 'error', errorType: 'CompileError', errorMsg: "error CS1525: Invalid expression term. In C#, use Console.WriteLine(\"...\");" };
    }

    return { status: 'executed', output: trimmed };
  };

  const evaluateApplicantCode = () => {
    if (!btnCodeRun) return;
    const originalHtml = btnCodeRun.innerHTML;
    btnCodeRun.innerHTML = '<span>Compiling &amp; Running...</span>';
    btnCodeRun.style.pointerEvents = 'none';

    const rawCode = codeTextarea ? codeTextarea.value : '';
    const selectedLang = codeLangSelect ? codeLangSelect.value : 'python';
    const meta = langMetadata[selectedLang] || langMetadata.python;
    const result = compileAndExecuteApplicantCode(rawCode, selectedLang);

    setTimeout(() => {
      btnCodeRun.innerHTML = originalHtml;
      btnCodeRun.style.pointerEvents = 'auto';

      if (result.status === 'empty') {
        if (terminalStatusWrap) terminalStatusWrap.className = 'terminal-header-status status-fail';
        if (terminalStatusDot) terminalStatusDot.className = 'status-dot status-dot-error';
        if (terminalStatusText) terminalStatusText.textContent = 'Test Failed · Empty Editor';
        if (terminalLatencyTag) terminalLatencyTag.textContent = '0ms';
        if (terminalStdoutContainer) {
          terminalStdoutContainer.innerHTML = `
            <div class="terminal-verdict-error">
              <strong>Error: Code editor is empty.</strong><br>
              Please write a valid ${meta.name} statement to output: <code>"${TARGET_OUTPUT}"</code>
            </div>
          `;
        }
        return;
      }

      if (result.status === 'error') {
        // SYNTAX ERROR / WRONG FUNCTION
        if (terminalStatusWrap) terminalStatusWrap.className = 'terminal-header-status status-fail';
        if (terminalStatusDot) terminalStatusDot.className = 'status-dot status-dot-error';
        if (terminalStatusText) terminalStatusText.textContent = `Execution Error (${result.errorType || 'Failed'})`;
        if (terminalLatencyTag) terminalLatencyTag.textContent = 'Runtime: 4ms';

        if (terminalStdoutContainer) {
          terminalStdoutContainer.innerHTML = `
            <div class="terminal-output-text" style="color: #F87171; font-family: monospace; white-space: pre-wrap;">${result.errorMsg}</div>
            <div class="terminal-verdict-error">
              <strong>COMPILER / SYNTAX ERROR</strong><br>
              <span class="terminal-diff-note">Your code failed to compile or run. Please verify that you are using the correct ${meta.name} function syntax.</span>
            </div>
          `;
        }
        return;
      }

      // EXECUTED OUTPUT CHECK
      const receivedOutput = result.output;
      const isExactMatch = receivedOutput.trim() === TARGET_OUTPUT;
      const randMs = Math.floor(Math.random() * 12) + 8;
      if (terminalLatencyTag) terminalLatencyTag.textContent = `Runtime: ${randMs}ms`;

      if (isExactMatch) {
        // STRICT SUCCESS / TEST PASSED
        if (terminalStatusWrap) terminalStatusWrap.className = 'terminal-header-status status-pass';
        if (terminalStatusDot) terminalStatusDot.className = 'status-dot status-dot-success';
        if (terminalStatusText) terminalStatusText.textContent = '1/1 Test Passed (Correct)';

        if (terminalStdoutContainer) {
          terminalStdoutContainer.innerHTML = `
            <div class="terminal-output-text">${TARGET_OUTPUT}</div>
            <div class="terminal-verdict-success">
              <strong>CORRECT</strong> &mdash; Output matches the required target string!
            </div>
          `;
        }
      } else {
        // WRONG OUTPUT / TEST FAILED
        if (terminalStatusWrap) terminalStatusWrap.className = 'terminal-header-status status-fail';
        if (terminalStatusDot) terminalStatusDot.className = 'status-dot status-dot-error';
        if (terminalStatusText) terminalStatusText.textContent = '0/1 Test Passed (Incorrect)';

        if (terminalStdoutContainer) {
          terminalStdoutContainer.innerHTML = `
            <div class="terminal-output-text">${receivedOutput || '(no output)'}</div>
            <div class="terminal-verdict-error">
              <strong>INCORRECT OUTPUT</strong>
              <span class="terminal-diff-note">
                Expected: <strong>"${TARGET_OUTPUT}"</strong><br>
                Received: <strong>"${receivedOutput || '(empty)'}"</strong>
              </span>
            </div>
          `;
        }
      }
    }, 180);
  };

  if (codeLangSelect) {
    codeLangSelect.addEventListener('change', updateLanguageSelection);
  }

  if (btnCodeRun) {
    btnCodeRun.addEventListener('click', evaluateApplicantCode);
  }

  if (btnCodeClear) {
    btnCodeClear.addEventListener('click', () => {
      if (codeTextarea) {
        codeTextarea.value = '';
        updateLineNumbers();
        codeTextarea.focus();
      }
      resetTerminalState();
    });
  }

  if (codeTextarea) {
    codeTextarea.addEventListener('input', updateLineNumbers);
  }

  // Initialize initial state for coding tab
  updateLanguageSelection();

  // E. Agile Kanban Board Interactions
  const kanbanCards = document.querySelectorAll('.kanban-card');
  kanbanCards.forEach(card => {
    card.addEventListener('click', () => {
      card.style.transform = 'scale(0.97)';
      setTimeout(() => { card.style.transform = ''; }, 150);
    });
  });

  // ==========================================================================
  // 13. WOW FEATURE: LIVE CERTIFICATE SIMULATOR & CALCULATOR
  // ==========================================================================
  const certInputName = document.getElementById('cert-input-name');
  const certInputSchool = document.getElementById('cert-input-school');
  const certInputHours = document.getElementById('cert-input-hours');
  const certInputTrack = document.getElementById('cert-input-track');

  const certDisplayName = document.getElementById('cert-display-name');
  const certDisplayHours = document.getElementById('cert-display-hours');
  const certDisplayTrack = document.getElementById('cert-display-track');
  const calcDurationText = document.getElementById('calc-duration-text');
  const calcTargetDate = document.getElementById('calc-target-date');
  const btnPrintCert = document.getElementById('btn-print-cert');

  const updateCertificateSimulator = () => {
    const name = certInputName?.value.trim() || 'Alex M. Santos';
    const hours = parseInt(certInputHours?.value || '500', 10);
    const track = certInputTrack?.value || 'Full-Stack Web Engineering';

    if (certDisplayName) certDisplayName.textContent = name;
    if (certDisplayHours) certDisplayHours.textContent = `${hours} Hours`;
    if (certDisplayTrack) certDisplayTrack.textContent = track;

    // Calculation: 8 hours/day, 6 days/week = 48 hours/week
    const totalWeeks = (hours / 48).toFixed(1);
    if (calcDurationText) calcDurationText.textContent = `~${totalWeeks} Weeks`;

    // Completion date projection
    const targetDateObj = new Date();
    targetDateObj.setDate(targetDateObj.getDate() + Math.round(parseFloat(totalWeeks) * 7));
    const formattedTarget = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(targetDateObj);
    if (calcTargetDate) calcTargetDate.textContent = `Target: ${formattedTarget}`;
  };

  if (certInputName) certInputName.addEventListener('input', updateCertificateSimulator);
  if (certInputSchool) certInputSchool.addEventListener('input', updateCertificateSimulator);
  if (certInputHours) certInputHours.addEventListener('change', updateCertificateSimulator);
  if (certInputTrack) certInputTrack.addEventListener('change', updateCertificateSimulator);

  if (btnPrintCert) {
    btnPrintCert.addEventListener('click', () => {
      window.print();
    });
  }

  // Global ESC Key Listener
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (deptModal && deptModal.classList.contains('active')) closeDeptModal();
      if (internModal && internModal.classList.contains('active')) closeInternModal();
      if (mobileOverlay && mobileOverlay.classList.contains('active')) toggleMobileNav(true);
    }
  });
});

