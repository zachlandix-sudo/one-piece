/* ============================================
   HERO TYPEWRITER EFFECT
   Cycles through phrases with a typing /
   deleting animation on the hero subtitle.
   ============================================ */
const typewriterEl = document.querySelector('.typewriter');
if (typewriterEl) {
  const phrases = [
    'Student at the College of Maasin',
    'Aspiring Web Developer',
    'IT Student & Problem Solver'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const type = () => {
    const current = phrases[phraseIndex];
    charIndex = deleting ? charIndex - 1 : charIndex + 1;
    typewriterEl.textContent = current.slice(0, charIndex);

    let speed = deleting ? 40 : 90;
    if (!deleting && charIndex === current.length) {
      speed = 1800; // pause at full word
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      speed = 400;
    }
    setTimeout(type, speed);
  };

  type();
}

/* ============================================
   MOBILE NAVIGATION TOGGLE
   ============================================ */
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

const closeMenu = () => {
  navLinks.classList.remove('open');
  menuToggle.classList.remove('open');
};

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  menuToggle.classList.toggle('open');
});

// Close mobile menu whenever a link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close mobile menu when clicking outside of it
document.addEventListener('click', (e) => {
  if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
    closeMenu();
  }
});

// Close mobile menu when pressing the Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

/* ============================================
   NAVBAR BACKGROUND + SCROLL PROGRESS
   ============================================ */
const navbar = document.getElementById('navbar');

// Inject a thin scroll-progress bar into the top of the navbar
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
navbar.appendChild(progressBar);

const updateProgress = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  navbar.classList.toggle('scrolled', scrollTop > 20);
  progressBar.style.width = `${progress}%`;
};

window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress(); // set initial state on load

/* ============================================
   ACTIVE NAV LINK HIGHLIGHTING
   Highlights the nav item matching the section
   currently in view.
   ============================================ */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

const highlightNav = () => {
  const scrollY = window.scrollY + 120; // offset for navbar height

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollY >= top && scrollY < top + height) {
      navItems.forEach(item => item.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
};

window.addEventListener('scroll', highlightNav);
highlightNav(); // run once on load

/* ============================================
   FADE-IN ON SCROLL (IntersectionObserver)
   Elements with the .fade-in class become
   visible once they enter the viewport.
   ============================================ */
const fadeElements = document.querySelectorAll('.fade-in');

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // only animate once
    }
  });
}, { threshold: 0.15 });

fadeElements.forEach(el => revealObserver.observe(el));

/* ============================================
   CONTACT FORM HANDLING
   NOTE: This is a front-end-only demo. To actually
   receive messages, connect this form to a service
   like Formspree, EmailJS, or your own backend.
   ============================================ */
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      formStatus.textContent = 'Please fill in all fields.';
      formStatus.style.color = '#dc2626';
      return;
    }

    // Send the message to the backend API
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Something went wrong.');
        return data;
      })
      .then((data) => {
        formStatus.textContent = data.message || 'Thanks! Your message has been received.';
        formStatus.style.color = '#16a34a';
        contactForm.reset();
        if (typeof showToast === 'function') showToast('Message sent! 🚀', 'success');
        if (typeof launchConfetti === 'function') setTimeout(() => launchConfetti(80), 200);
      })
      .catch((err) => {
        formStatus.textContent = err.message || 'Could not send your message.';
        formStatus.style.color = '#dc2626';
        if (typeof showToast === 'function') showToast(err.message || 'Message failed to send.', 'error');
      });
  });
}

/* ============================================
   BACK TO TOP BUTTON
   ============================================ */
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================
    ANIME DESCRIPTION TOGGLE
    Toggles the visibility of the anime
    description when the Read More button
    is clicked.
    ============================================ */
function toggleDesc(btn) {
  const desc = btn.nextElementSibling;
  if (desc) {
    desc.classList.toggle('visible');
    btn.textContent = desc.classList.contains('visible') ? 'Show Less' : 'Read More';
    btn.classList.toggle('active', desc.classList.contains('visible'));
  }
}

/* ============================================
   HERO MOUSE-FOLLOWER GLOW
   A soft radial glow inside the hero that
   smoothly trails the cursor.
   ============================================ */
const hero = document.querySelector('.hero');
const heroGlow = document.getElementById('heroGlow');

if (hero && heroGlow) {
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    heroGlow.style.left = `${e.clientX - rect.left}px`;
    heroGlow.style.top = `${e.clientY - rect.top}px`;
  });
}

/* ============================================
   3D TILT ON ANIME CARDS
   Gives the anime cards a subtle 3D tilt that
   follows the cursor, with a glare highlight.
   ============================================ */
const tiltCards = document.querySelectorAll('.anime-card');

tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 6;
    const rotateX = -((y - centerY) / centerY) * 6;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    card.style.boxShadow = `0 20px 40px rgba(0, 0, 0, 0.1), ${rotateY * -1}px ${rotateX}px 30px rgba(37, 99, 235, 0.15)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.boxShadow = '';
  });
});

/* ============================================
   100 MOTIVATIONAL QUOTES
   Spotlight rotator + grid of all quotes.
   ============================================ */
const quotes = [
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { text: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt' },
  { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
  { text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill' },
  { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' },
  { text: 'You miss 100% of the shots you don\'t take.', author: 'Wayne Gretzky' },
  { text: 'The best time to plant a tree was 20 years ago. The second best time is now.', author: 'Chinese Proverb' },
  { text: 'Don\'t watch the clock; do what it does. Keep going.', author: 'Sam Levenson' },
  { text: 'Whether you think you can or you think you can\'t, you\'re right.', author: 'Henry Ford' },
  { text: 'Hardships often prepare ordinary people for an extraordinary destiny.', author: 'C.S. Lewis' },
  { text: 'What you get by achieving your goals is not as important as what you become by achieving your goals.', author: 'Zig Ziglar' },
  { text: 'If you want to lift yourself up, lift up someone else.', author: 'Booker T. Washington' },
  { text: 'I have not failed. I\'ve just found 10,000 ways that won\'t work.', author: 'Thomas Edison' },
  { text: 'The only limit to our realization of tomorrow will be our doubts of today.', author: 'Franklin D. Roosevelt' },
  { text: 'Do what you can, with what you have, where you are.', author: 'Theodore Roosevelt' },
  { text: 'It always seems impossible until it\'s done.', author: 'Nelson Mandela' },
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: 'Your time is limited, so don\'t waste it living someone else\'s life.', author: 'Steve Jobs' },
  { text: 'Everything you\'ve ever wanted is on the other side of fear.', author: 'George Addair' },
  { text: 'Fall seven times and stand up eight.', author: 'Japanese Proverb' },
  { text: 'The harder the conflict, the more glorious the triumph.', author: 'Thomas Paine' },
  { text: 'Dream big and dare to fail.', author: 'Norman Vaughan' },
  { text: 'We may encounter many defeats but we must not be defeated.', author: 'Maya Angelou' },
  { text: 'The secret of your future is hidden in your daily routine.', author: 'Mike Murdock' },
  { text: 'Act as if what you do makes a difference. It does.', author: 'William James' },
  { text: 'Success usually comes to those who are too busy to be looking for it.', author: 'Henry David Thoreau' },
  { text: 'You are never too old to set another goal or to dream a new dream.', author: 'C.S. Lewis' },
  { text: 'Don\'t limit your challenges; challenge your limits.', author: 'Unknown' },
  { text: 'The way to get started is to quit talking and begin doing.', author: 'Walt Disney' },
  { text: 'A journey of a thousand miles begins with a single step.', author: 'Lao Tzu' },
  { text: 'If you\'re walking down the right path and you\'re willing to keep walking, eventually you\'ll make progress.', author: 'Barack Obama' },
  { text: 'It is during our darkest moments that we must focus to see the light.', author: 'Aristotle' },
  { text: 'The only person you are destined to become is the person you decide to be.', author: 'Ralph Waldo Emerson' },
  { text: 'Positive anything is better than negative nothing.', author: 'Elbert Hubbard' },
  { text: 'What we think, we become.', author: 'Buddha' },
  { text: 'Be the change that you wish to see in the world.', author: 'Mahatma Gandhi' },
  { text: 'Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.', author: 'Christian D. Larson' },
  { text: 'All our dreams can come true if we have the courage to pursue them.', author: 'Walt Disney' },
  { text: 'The only way to achieve the impossible is to believe it is possible.', author: 'Charles Kingsleigh' },
  { text: 'Start where you are. Use what you have. Do what you can.', author: 'Arthur Ashe' },
  { text: 'You don\'t have to be great to start, but you have to start to be great.', author: 'Zig Ziglar' },
  { text: 'Great things never come from comfort zones.', author: 'Neil Strauss' },
  { text: 'The best preparation for tomorrow is doing your best today.', author: 'H. Jackson Brown Jr.' },
  { text: 'Success is the sum of small efforts, repeated day in and day out.', author: 'Robert Collier' },
  { text: 'Don\'t be afraid to give up the good to go for the great.', author: 'John D. Rockefeller' },
  { text: 'If you can dream it, you can do it.', author: 'Walt Disney' },
  { text: 'The only impossible journey is the one you never begin.', author: 'Tony Robbins' },
  { text: 'Nothing is impossible. The word itself says "I\'m possible!"', author: 'Audrey Hepburn' },
  { text: 'Every accomplishment starts with the decision to try.', author: 'John F. Kennedy' },
  { text: 'Push yourself, because no one else is going to do it for you.', author: 'Unknown' },
  { text: 'Great minds discuss ideas; average minds discuss events; small minds discuss people.', author: 'Eleanor Roosevelt' },
  { text: 'You are braver than you believe, stronger than you seem, and smarter than you think.', author: 'A.A. Milne' },
  { text: 'Shoot for the moon. Even if you miss, you\'ll land among the stars.', author: 'Norman Vincent Peale' },
  { text: 'Do something today that your future self will thank you for.', author: 'Unknown' },
  { text: 'Success is not how high you have climbed, but how you make a positive difference to the world.', author: 'Roy T. Bennett' },
  { text: 'Motivation gets you going, but discipline keeps you growing.', author: 'John C. Maxwell' },
  { text: 'The difference between who you are and who you want to be is what you do.', author: 'Unknown' },
  { text: 'Don\'t wait for the perfect moment. Take the moment and make it perfect.', author: 'Unknown' },
  { text: 'Little by little, one travels far.', author: 'J.R.R. Tolkien' },
  { text: 'What lies behind us and what lies before us are tiny matters compared to what lies within us.', author: 'Ralph Waldo Emerson' },
  { text: 'Happiness is not something ready made. It comes from your own actions.', author: 'Dalai Lama' },
  { text: 'Set your goals high, and don\'t stop till you get there.', author: 'Bo Jackson' },
  { text: 'The pain you are feeling cannot compare to the joy that is coming.', author: 'Romans 8:18' },
  { text: 'If opportunity doesn\'t knock, build a door.', author: 'Milton Berle' },
  { text: 'It\'s not whether you get knocked down, it\'s whether you get up.', author: 'Vince Lombardi' },
  { text: 'Your attitude, not your aptitude, will determine your altitude.', author: 'Zig Ziglar' },
  { text: 'Energy and persistence conquer all things.', author: 'Benjamin Franklin' },
  { text: 'Never let the fear of striking out keep you from playing the game.', author: 'Babe Ruth' },
  { text: 'Strive not to be a success, but rather to be of value.', author: 'Albert Einstein' },
  { text: 'He who has a why to live for can bear almost any how.', author: 'Friedrich Nietzsche' },
  { text: 'Let your smile change the world, but don\'t let the world change your smile.', author: 'Unknown' },
  { text: 'Whatever the mind can conceive and believe, it can achieve.', author: 'Napoleon Hill' },
  { text: 'I can\'t change the direction of the wind, but I can adjust my sails to always reach my destination.', author: 'Jimmy Dean' },
  { text: 'We generate fears while we sit. We overcome them by action.', author: 'Dr. Henry Link' },
  { text: 'You become what you believe.', author: 'Oprah Winfrey' },
  { text: 'Do not go where the path may lead, go instead where there is no path and leave a trail.', author: 'Ralph Waldo Emerson' },
  { text: 'No one can make you feel inferior without your consent.', author: 'Eleanor Roosevelt' },
  { text: 'Keep your face always toward the sunshine—and shadows will fall behind you.', author: 'Walt Whitman' },
  { text: 'Well done is better than well said.', author: 'Benjamin Franklin' },
  { text: 'Doubt kills more dreams than failure ever will.', author: 'Suzy Kassem' },
  { text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.', author: 'Aristotle' },
  { text: 'Every morning we are born again. What we do today is what matters most.', author: 'Buddha' },
  { text: 'If you can\'t explain it simply, you don\'t understand it well enough.', author: 'Albert Einstein' },
  { text: 'Don\'t judge each day by the harvest you reap but by the seeds that you plant.', author: 'Robert Louis Stevenson' },
  { text: 'The future depends on what you do today.', author: 'Mahatma Gandhi' },
  { text: 'Challenges are what make life interesting and overcoming them is what makes life meaningful.', author: 'Joshua J. Marine' },
  { text: 'Someone\'s sitting in the shade today because someone planted a tree a long time ago.', author: 'Warren Buffett' },
  { text: 'Success is walking from failure to failure with no loss of enthusiasm.', author: 'Winston Churchill' },
  { text: 'A person who never made a mistake never tried anything new.', author: 'Albert Einstein' },
  { text: 'If you want to achieve greatness stop asking for permission.', author: 'Unknown' },
  { text: 'Nothing can dim the light which shines from within.', author: 'Maya Angelou' },
  { text: 'I am not a product of my circumstances. I am a product of my decisions.', author: 'Stephen Covey' },
  { text: 'Quality is not an act, it is a habit.', author: 'Aristotle' },
  { text: 'Sometimes you win, sometimes you learn.', author: 'John Maxwell' },
  { text: 'Success is liking yourself, liking what you do, and liking how you do it.', author: 'Maya Angelou' },
  { text: 'When one door of happiness closes, another opens; but often we look so long at the closed door that we do not see the one which has been opened for us.', author: 'Helen Keller' },
  { text: 'The best way out is always through.', author: 'Robert Frost' },
  { text: 'If you want something you\'ve never had, you must be willing to do something you\'ve never done.', author: 'Thomas Jefferson' },
  { text: 'Courage is resistance to fear, mastery of fear—not absence of fear.', author: 'Mark Twain' },
  { text: 'Opportunities don\'t happen. You create them.', author: 'Chris Grosser' }
];

// --- Quote of the Day spotlight ---
const spotlightText = document.getElementById('spotlightText');
const spotlightAuthor = document.getElementById('spotlightAuthor');
const spotlightCounter = document.getElementById('spotlightCounter');
const quotePrev = document.getElementById('quotePrev');
const quoteNext = document.getElementById('quoteNext');
const quoteRandom = document.getElementById('quoteRandom');
const quotesGrid = document.getElementById('quotesGrid');

let currentIndex = Math.floor(Math.random() * quotes.length);

const renderSpotlight = (index) => {
  currentIndex = (index + quotes.length) % quotes.length;
  const quote = quotes[currentIndex];
  spotlightText.textContent = `“${quote.text}”`;
  spotlightAuthor.textContent = `— ${quote.author}`;
  spotlightCounter.textContent = `${currentIndex + 1} / ${quotes.length}`;
};

if (spotlightText) {
  renderSpotlight(currentIndex);

  quotePrev.addEventListener('click', () => renderSpotlight(currentIndex - 1));
  quoteNext.addEventListener('click', () => renderSpotlight(currentIndex + 1));
  quoteRandom.addEventListener('click', () => {
    let r;
    do {
      r = Math.floor(Math.random() * quotes.length);
    } while (r === currentIndex);
    renderSpotlight(r);
  });
}

// --- Grid of all 100 quotes ---
if (quotesGrid) {
  const fragment = document.createDocumentFragment();
  quotes.forEach((q, i) => {
    const card = document.createElement('article');
    card.className = 'quote-card';
    card.innerHTML = `
      <span class="quote-card-mark">“</span>
      <p class="quote-card-text">${q.text}</p>
      <p class="quote-card-author">— ${q.author}</p>
      <span class="quote-card-number">${String(i + 1).padStart(3, '0')}</span>
    `;
    fragment.appendChild(card);
  });
  quotesGrid.appendChild(fragment);
}

/* ============================================
   STATS COUNTERS (Animated numbers)
   Counts up the stat numbers when the stats
   section scrolls into view.
   ============================================ */
const statsSection = document.getElementById('stats');

if (statsSection) {
  const statNumbers = document.querySelectorAll('.stat-number');

  const animateStat = (el) => {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;
    const duration = 1600;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statNumbers.forEach(animateStat);
        observer.disconnect();
      }
    });
  }, { threshold: 0.4 });

  statsObserver.observe(statsSection);
}

/* ============================================
   NEWSLETTER FORM HANDLING
   Front-end-only demo — connect to a real
   email service (e.g. Mailchimp, Formspree)
   to actually collect subscriptions.
   ============================================ */
const newsletterForm = document.getElementById('newsletterForm');
const newsletterStatus = document.getElementById('newsletterStatus');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('newsletterEmail').value.trim();

    if (!email) {
      newsletterStatus.textContent = 'Please enter your email address.';
      newsletterStatus.style.color = '#dc2626';
      return;
    }

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      newsletterStatus.textContent = 'Please enter a valid email address.';
      newsletterStatus.style.color = '#dc2626';
      return;
    }

    // Send the subscription to the backend API
    fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Something went wrong.');
        return data;
      })
      .then((data) => {
        newsletterStatus.textContent = data.message || 'Thanks for subscribing! 🎉';
        newsletterStatus.style.color = '#16a34a';
        newsletterForm.reset();
        if (typeof showToast === 'function') showToast('Subscribed! 🎉', 'success');
        if (typeof launchConfetti === 'function') setTimeout(() => launchConfetti(60), 200);
      })
      .catch((err) => {
        newsletterStatus.textContent = err.message || 'Could not subscribe. Please try again.';
        newsletterStatus.style.color = '#dc2626';
        if (typeof showToast === 'function') showToast(err.message || 'Subscription failed.', 'error');
      });
  });
}

/* ============================================
   RIPPLE EFFECT ON SKILL TAGS
   A quick ripple expands from the click point.
   ============================================ */
document.querySelectorAll('.skill-tag').forEach(tag => {
  tag.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    ripple.className = 'ripple';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

/* ============================================
   STAGGERED SECTION REVEAL
   Reveals .fade-in children of a section in a
   cascade instead of all at once.
   ============================================ */
const cascadeSections = document.querySelectorAll('.section');
const cascadeObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const items = entry.target.querySelectorAll('.fade-in');
      items.forEach((el, i) => {
        el.classList.add('visible');
        el.style.transitionDelay = `${i * 70}ms`;
      });
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

cascadeSections.forEach(sec => cascadeObserver.observe(sec));

/* ================================================================
   FEATURE PACK — EXTRA UTILITIES & INTERACTIONS
   Everything below is wrapped in null-safe guards so it runs on
   any page that includes script.js without throwing errors.
   ================================================================ */

/* ============================================
   CORE UTILITY HELPERS
   ============================================ */
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const lerp = (start, end, t) => start + (end - start) * t;

const debounce = (fn, delay = 150) => {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const throttle = (fn, limit = 100) => {
  let inThrottle = false;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  };
};

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const escapeHTML = (str) => String(str)
  .replace(/&/g, '&amp;')
  .replace(/</g, '<')
  .replace(/>/g, '>')
  .replace(/"/g, '"')
  .replace(/'/g, '&#039;');

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const pluralize = (count, singular, plural) => count === 1 ? singular : plural;

const padStart = (num, len = 2) => String(num).padStart(len, '0');

const formatDate = (date = new Date()) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${padStart(date.getDate())}, ${date.getFullYear()}`;
};

const formatTime = (date = new Date()) => {
  const hours = date.getHours();
  const minutes = padStart(date.getMinutes());
  const ampm = hours >= 12 ? 'PM' : 'AM';
  return `${hours % 12 || 12}:${minutes} ${ampm}`;
};

// LocalStorage wrapper with try/catch (private mode safe)
const storage = {
  get(key, fallback = null) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }
};

// SessionStorage wrapper
const sessionStore = {
  get(key, fallback = null) {
    try {
      const value = sessionStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  remove(key) {
    try {
      sessionStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }
};

// Detect reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Detect fine pointer (mouse) vs touch
const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

// Detect whether the page is the portfolio home page
const isHomePage = () => {
  const body = document.body;
  return !body.dataset.page || body.dataset.page === 'home';
};

/* ============================================
   TOAST NOTIFICATION SYSTEM
   Auto-injects a container and shows small
   dismissible toast messages.
   ============================================ */
let toastContainer = null;

const ensureToastContainer = () => {
  if (toastContainer) return toastContainer;
  toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  toastContainer.setAttribute('aria-live', 'polite');
  document.body.appendChild(toastContainer);
  return toastContainer;
};

const showToast = (message, type = 'info', duration = 2800) => {
  const container = ensureToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icons = { info: 'ℹ️', success: '✅', error: '⚠️', warning: '🔔' };
  toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span><span class="toast-message">${escapeHTML(message)}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('toast-show'));

  const remove = () => {
    toast.classList.remove('toast-show');
    toast.classList.add('toast-hide');
    setTimeout(() => toast.remove(), 300);
  };

  toast.addEventListener('click', remove);
  setTimeout(remove, duration);
};

/* ============================================
   PRELOADER HIDE
   Hides the page preloader once the window
   finishes loading, with a safety timeout.
   ============================================ */
const preloader = document.getElementById('preloader');

const hidePreloader = () => {
  if (!preloader) return;
  preloader.classList.add('preloader-hidden');
  setTimeout(() => {
    if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
  }, 600);
};

window.addEventListener('load', hidePreloader);
setTimeout(hidePreloader, 2500); // safety fallback

/* ============================================
   DYNAMIC FOOTER YEAR
   Keeps the copyright year current.
   ============================================ */
$$('.footer-year').forEach(el => {
  el.textContent = new Date().getFullYear();
});

/* ============================================
   READING PROGRESS RING ON BACK-TO-TOP
   Draws a circular progress ring around the
   existing back-to-top button.
   ============================================ */
const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn && !backToTopBtn.querySelector('svg')) {
  const size = 46;
  const svgNS = 'http://www.w3.org/2000/svg';
  const ringSVG = document.createElementNS(svgNS, 'svg');
  ringSVG.setAttribute('class', 'progress-ring');
  ringSVG.setAttribute('width', size);
  ringSVG.setAttribute('height', size);
  ringSVG.setAttribute('viewBox', `0 0 ${size} ${size}`);

  const track = document.createElementNS(svgNS, 'circle');
  track.setAttribute('class', 'progress-ring-track');
  track.setAttribute('cx', size / 2);
  track.setAttribute('cy', size / 2);
  track.setAttribute('r', (size - 6) / 2);
  track.setAttribute('fill', 'none');

  const circle = document.createElementNS(svgNS, 'circle');
  circle.setAttribute('class', 'progress-ring-circle');
  circle.setAttribute('cx', size / 2);
  circle.setAttribute('cy', size / 2);
  circle.setAttribute('r', (size - 6) / 2);
  circle.setAttribute('fill', 'none');
  circle.setAttribute('stroke-linecap', 'round');

  ringSVG.appendChild(track);
  ringSVG.appendChild(circle);
  backToTopBtn.prepend(ringSVG);

  const circumference = 2 * Math.PI * ((size - 6) / 2);
  circle.style.strokeDasharray = `${circumference}`;
  circle.style.strokeDashoffset = `${circumference}`;

  const updateRing = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    const offset = circumference - progress * circumference;
    circle.style.strokeDashoffset = `${offset}`;
  };

  window.addEventListener('scroll', updateRing, { passive: true });
  updateRing();
}

/* ============================================
   QUOTES SEARCH / FILTER TOOLBAR
   Adds a live filter input above the quotes
   grid so users can search quotes by text or
   author. (Reuses the existing `quotesGrid`
   const declared in the quotes section above.)
   ============================================ */
if (quotesGrid) {
  const container = quotesGrid.parentNode;
  if (container) {
    const toolbar = document.createElement('div');
    toolbar.className = 'quotes-toolbar';
    toolbar.innerHTML = `
      <input
        type="search"
        id="quoteSearchInput"
        class="quotes-search"
        placeholder="Search quotes by text or author…"
        aria-label="Search quotes"
      />
      <span class="quotes-count" id="quotesResultCount">${quotes.length} quotes</span>
    `;
    container.insertBefore(toolbar, quotesGrid);

    const searchInput = toolbar.querySelector('#quoteSearchInput');
    const countLabel = toolbar.querySelector('#quotesResultCount');

    const applyQuoteFilter = debounce((query) => {
      const term = query.trim().toLowerCase();
      let visible = 0;

      Array.from(quotesGrid.children).forEach((card) => {
        const text = card.textContent.toLowerCase();
        const match = !term || text.includes(term);
        card.style.display = match ? '' : 'none';
        if (match) visible++;
      });

      if (countLabel) {
        countLabel.textContent = visible === quotes.length
          ? `${quotes.length} quotes`
          : `${visible} of ${quotes.length} quotes`;
      }
    }, 120);

    searchInput.addEventListener('input', (e) => applyQuoteFilter(e.target.value));
  }
}

/* ============================================
   COPY QUOTE TO CLIPBOARD
   Clicking a quote card (or the spotlight text)
   copies the quote to the clipboard and shows
   a toast.
   ============================================ */
const copyTextToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers / insecure contexts
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      return true;
    } catch {
      return false;
    } finally {
      textarea.remove();
    }
  }
};

if (quotesGrid) {
  quotesGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.quote-card');
    if (!card) return;
    const textEl = card.querySelector('.quote-card-text');
    const authorEl = card.querySelector('.quote-card-author');
    if (!textEl) return;
    const quoteText = `"${textEl.textContent}" ${authorEl.textContent || ''}`.trim();
    copyTextToClipboard(quoteText).then((ok) => {
      showToast(ok ? 'Quote copied to clipboard!' : 'Could not copy quote.', ok ? 'success' : 'error');
    });
  });
}

const spotlightTextEl = document.getElementById('spotlightText');
if (spotlightTextEl) {
  spotlightTextEl.style.cursor = 'pointer';
  spotlightTextEl.title = 'Click to copy this quote';
  spotlightTextEl.addEventListener('click', () => {
    const quoteText = `"${spotlightTextEl.textContent.replace(/^“|”$/g, '')}" ${(document.getElementById('spotlightAuthor') || {}).textContent || ''}`.trim();
    copyTextToClipboard(quoteText).then((ok) => {
      showToast(ok ? 'Quote copied to clipboard!' : 'Could not copy quote.', ok ? 'success' : 'error');
    });
  });
}

/* ============================================
   QUOTE FAVORITES
   Toggle ⭐ on a quote card to save it to
   localStorage. Saved favorites get a special
   visual state and persist across visits.
   ============================================ */
const FAVORITES_KEY = 'joshua_favorite_quotes';

const getFavoriteIds = () => storage.get(FAVORITES_KEY, []);
const saveFavoriteIds = (ids) => storage.set(FAVORITES_KEY, ids);

const isFavorite = (id) => getFavoriteIds().includes(id);

const renderFavoriteStates = () => {
  if (!quotesGrid) return;
  Array.from(quotesGrid.children).forEach((card, i) => {
    const btn = card.querySelector('.quote-fav-btn');
    if (btn) {
      btn.classList.toggle('is-fav', isFavorite(i));
      btn.textContent = isFavorite(i) ? '★' : '☆';
    }
  });
};

if (quotesGrid) {
  quotesGrid.addEventListener('click', (e) => {
    const favBtn = e.target.closest('.quote-fav-btn');
    if (!favBtn) return;
    e.stopPropagation();
    const card = favBtn.closest('.quote-card');
    const id = Array.from(quotesGrid.children).indexOf(card);
    if (id < 0) return;

    let ids = getFavoriteIds();
    if (ids.includes(id)) {
      ids = ids.filter((x) => x !== id);
      showToast('Removed from favorites.', 'info');
    } else {
      ids.push(id);
      showToast('Saved to favorites ⭐', 'success');
    }
    saveFavoriteIds(ids);
    renderFavoriteStates();
  });

  // Add favorite buttons to every quote card
  Array.from(quotesGrid.children).forEach((card, i) => {
    if (card.querySelector('.quote-fav-btn')) return;
    const favBtn = document.createElement('button');
    favBtn.className = 'quote-fav-btn';
    favBtn.textContent = isFavorite(i) ? '★' : '☆';
    favBtn.setAttribute('aria-label', 'Toggle favorite');
    favBtn.title = 'Save to favorites';
    card.appendChild(favBtn);
  });
}

/* ============================================
   ANIME SEARCH & GENRE FILTER
   Adds a live search box and genre filter above
   the anime grid so visitors can find shows
   quickly.
   ============================================ */
const animeGrid = document.querySelector('.anime-grid');

if (animeGrid && !document.getElementById('animeFilterToolbar')) {
  const container = animeGrid.parentNode;
  if (container) {
    const toolbar = document.createElement('div');
    toolbar.className = 'anime-toolbar';
    toolbar.id = 'animeFilterToolbar';
    toolbar.innerHTML = `
      <input
        type="search"
        id="animeSearchInput"
        class="anime-search"
        placeholder="Search anime…"
        aria-label="Search anime"
      />
      <select id="animeGenreSelect" class="anime-genre-select" aria-label="Filter by genre">
        <option value="all">All Genres</option>
      </select>
    `;
    container.insertBefore(toolbar, animeGrid);

    const searchInput = toolbar.querySelector('#animeSearchInput');
    const genreSelect = toolbar.querySelector('#animeGenreSelect');

    // Collect all unique genres from the tag lists
    const allGenres = new Set();
    $$('.anime-card', animeGrid).forEach((card) => {
      $$('.skill-tag', card).forEach((tag) => allGenres.add(tag.textContent.trim()));
    });
    [...allGenres].sort().forEach((genre) => {
      const option = document.createElement('option');
      option.value = genre;
      option.textContent = genre;
      genreSelect.appendChild(option);
    });

    const applyAnimeFilter = () => {
      const term = searchInput.value.trim().toLowerCase();
      const genre = genreSelect.value;
      $$('.anime-card', animeGrid).forEach((card) => {
        const title = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
        const tags = $$('.skill-tag', card).map((tag) => tag.textContent.trim());
        const matchesTerm = !term || title.includes(term);
        const matchesGenre = genre === 'all' || tags.includes(genre);
        card.style.display = matchesTerm && matchesGenre ? '' : 'none';
      });
    };

    searchInput.addEventListener('input', debounce(applyAnimeFilter, 120));
    genreSelect.addEventListener('change', applyAnimeFilter);
  }
}

/* ============================================
   RANDOM ANIME PICKER
   Adds a "Random Anime" button to the anime
   section that opens a random show's page (or
   scrolls to a random card).
   ============================================ */
if (animeGrid && !document.getElementById('randomAnimeBtn')) {
  const section = animeGrid.closest('section');
  if (section) {
    const btnWrap = document.createElement('div');
    btnWrap.className = 'anime-random-wrap';
    btnWrap.innerHTML = '<button class="btn btn-outline" id="randomAnimeBtn">🎲 Random Anime</button>';
    const heading = section.querySelector('.section-title, h2');
    if (heading && heading.parentNode) {
      heading.parentNode.appendChild(btnWrap);
    }

    btnWrap.querySelector('#randomAnimeBtn').addEventListener('click', () => {
      const cards = $$('.anime-card', animeGrid).filter((card) => card.style.display !== 'none');
      if (cards.length === 0) {
        showToast('No anime matches your current filter.', 'warning');
        return;
      }
      const pick = randomItem(cards);
      const viewBtn = pick.querySelector('.anime-view-btn');
      if (viewBtn && viewBtn.getAttribute('href')) {
        showToast(`Rolling the dice… → ${pick.querySelector('h3').textContent}`, 'info');
        setTimeout(() => { window.location.href = viewBtn.getAttribute('href'); }, 600);
      } else {
        pick.scrollIntoView({ behavior: 'smooth', block: 'center' });
        pick.classList.add('card-flash');
        setTimeout(() => pick.classList.remove('card-flash'), 900);
      }
    });
  }
}

/* ============================================
   GALLERY LIGHTBOX
   A dynamic full-screen lightbox for gallery
   images with prev/next controls, captions,
   and keyboard navigation.
   ============================================ */
const galleryItems = $$('.gallery-item');

if (galleryItems.length > 0) {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.id = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Close lightbox">✕</button>
    <button class="lightbox-prev" aria-label="Previous image">‹</button>
    <button class="lightbox-next" aria-label="Next image">›</button>
    <figure class="lightbox-figure">
      <img class="lightbox-img" src="" alt="" />
      <figcaption class="lightbox-caption"></figcaption>
    </figure>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  let currentGalleryIndex = 0;

  const openLightbox = (index) => {
    if (index < 0) index = galleryItems.length - 1;
    if (index >= galleryItems.length) index = 0;
    currentGalleryIndex = index;

    const item = galleryItems[index];
    const img = item.querySelector('img');
    const caption = item.querySelector('figcaption');
    lightboxImg.src = img ? img.src : '';
    lightboxImg.alt = img ? img.alt : '';
    lightboxCaption.textContent = caption ? caption.textContent : '';
    lightbox.classList.add('lightbox-open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('lightbox-open');
    document.body.style.overflow = '';
  };

  galleryItems.forEach((item, i) => {
    item.style.cursor = 'zoom-in';
    item.addEventListener('click', () => openLightbox(i));
  });

  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => openLightbox(currentGalleryIndex - 1));
  lightbox.querySelector('.lightbox-next').addEventListener('click', () => openLightbox(currentGalleryIndex + 1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('lightbox-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openLightbox(currentGalleryIndex - 1);
    if (e.key === 'ArrowRight') openLightbox(currentGalleryIndex + 1);
  });
}

/* ============================================
   TESTIMONIAL AUTO-ROTATOR
   If testimonials are laid out as a slider, this
   fades between them automatically with dots.
   ============================================ */
const testimonialCards = $$('.testimonial-card');

if (testimonialCards.length > 1) {
  const wrapper = testimonialCards[0].parentNode;
  if (wrapper) {
    wrapper.classList.add('testimonial-slider');

    // Show only one card at a time
    testimonialCards.forEach((card, i) => {
      card.classList.add('testimonial-slide');
      card.style.display = i === 0 ? '' : 'none';
    });

    // Build dot navigation
    const dotsWrap = document.createElement('div');
    dotsWrap.className = 'testimonial-dots';
    testimonialCards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Show testimonial ${i + 1}`);
      dot.addEventListener('click', () => showTestimonial(i));
      dotsWrap.appendChild(dot);
    });
    wrapper.appendChild(dotsWrap);

    let testimonialIndex = 0;
    let testimonialTimer = null;

    const showTestimonial = (index) => {
      testimonialIndex = (index + testimonialCards.length) % testimonialCards.length;
      testimonialCards.forEach((card, i) => {
        card.style.display = i === testimonialIndex ? '' : 'none';
      });
      $$('.testimonial-dot', dotsWrap).forEach((dot, i) => {
        dot.classList.toggle('active', i === testimonialIndex);
      });
      resetTestimonialTimer();
    };

    const resetTestimonialTimer = () => {
      if (testimonialTimer) clearInterval(testimonialTimer);
      if (prefersReducedMotion) return;
      testimonialTimer = setInterval(() => {
        showTestimonial(testimonialIndex + 1);
      }, 5000);
    };

    // Pause on hover
    wrapper.addEventListener('mouseenter', () => {
      if (testimonialTimer) clearInterval(testimonialTimer);
    });
    wrapper.addEventListener('mouseleave', resetTestimonialTimer);

    resetTestimonialTimer();
  }
}

/* ============================================
   FAQ SINGLE-OPEN ACCORDION
   Ensures only one <details> element is open at
   a time inside the FAQ list.
   ============================================ */
const faqList = document.querySelector('.faq-list');

if (faqList) {
  const faqItems = $$('.faq-item', faqList);
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });
}

/* ============================================
   CUSTOM CURSOR GLOW + MAGNETIC BUTTONS
   On devices with a fine pointer, adds a soft
   glowing cursor follower and makes .btn
   elements gently pull toward the cursor.
   ============================================ */
if (hasFinePointer && !prefersReducedMotion) {
  const cursorGlow = document.createElement('div');
  cursorGlow.className = 'cursor-glow';
  document.body.appendChild(cursorGlow);

  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;
  let glowX = cursorX;
  let glowY = cursorY;

  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
  });

  const animateCursorGlow = () => {
    glowX = lerp(glowX, cursorX, 0.12);
    glowY = lerp(glowY, cursorY, 0.12);
    cursorGlow.style.transform = `translate(${glowX - 60}px, ${glowY - 60}px)`;
    requestAnimationFrame(animateCursorGlow);
  };
  animateCursorGlow();

  // Magnetic effect on buttons
  $$('.btn, .anime-view-btn, .quote-btn').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ============================================
   GLOBAL KEYBOARD SHORTCUTS
   Quick keys for power users:
     Q → jump to quotes section
     A → jump to anime section
     P → jump to projects section
     R → random quote (if spotlight exists)
     T → back to top
   ============================================ */
document.addEventListener('keydown', (e) => {
  // Don't hijack typing in inputs/textareas
  const tag = (e.target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const key = e.key.toLowerCase();
  if (key === 'q') scrollToSection('quotes');
  if (key === 'a') scrollToSection('anime');
  if (key === 'p') scrollToSection('projects');
  if (key === 't') window.scrollTo({ top: 0, behavior: 'smooth' });
  if (key === 'r') {
    const randomBtn = document.getElementById('quoteRandom');
    if (randomBtn) randomBtn.click();
  }
});

/* ============================================
   CANVAS CONFETTI
   A lightweight confetti burst drawn on a
   full-screen canvas. Exposed globally as
   launchConfetti().
   ============================================ */
let confettiCanvas = null;
let confettiCtx = null;
let confettiParticles = [];
let confettiAnimating = false;

const ensureConfettiCanvas = () => {
  if (confettiCanvas) return confettiCanvas;
  confettiCanvas = document.createElement('canvas');
  confettiCanvas.className = 'confetti-canvas';
  document.body.appendChild(confettiCanvas);
  confettiCtx = confettiCanvas.getContext('2d');
  const resize = () => {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);
  return confettiCanvas;
};

const launchConfetti = (count = 120) => {
  if (prefersReducedMotion) return;
  ensureConfettiCanvas();
  const colors = ['#2563eb', '#dc2626', '#16a34a', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
  for (let i = 0; i < count; i++) {
    confettiParticles.push({
      x: Math.random() * confettiCanvas.width,
      y: -20 - Math.random() * 60,
      w: randomInt(6, 12),
      h: randomInt(8, 16),
      color: randomItem(colors),
      vy: randomInt(2, 5),
      vx: (Math.random() - 0.5) * 2,
      rotation: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.15
    });
  }
  if (!confettiAnimating) animateConfetti();
};

const animateConfetti = () => {
  confettiAnimating = true;
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  confettiParticles = confettiParticles.filter((p) => p.y < confettiCanvas.height + 40);

  confettiParticles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.vr;
    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate(p.rotation);
    confettiCtx.fillStyle = p.color;
    confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    confettiCtx.restore();
  });

  if (confettiParticles.length > 0) {
    requestAnimationFrame(animateConfetti);
  } else {
    confettiAnimating = false;
    if (confettiCanvas) {
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }
};

window.launchConfetti = launchConfetti;

// Fire a small confetti burst when a form submits successfully
const contactFormEl = document.getElementById('contactForm');
if (contactFormEl) {
  contactFormEl.addEventListener('submit', (e) => {
    setTimeout(() => launchConfetti(80), 200);
  });
}

/* ============================================
   POMODORO STUDY TIMER WIDGET
   A small floating widget for timed study
   sessions (25/5 default). Self-contained and
   appended to the body.
   ============================================ */
const buildPomodoroWidget = () => {
  const POMO_KEY = 'pomodoro_state_v1';
  const widget = document.createElement('div');
  widget.className = 'pomodoro-widget';
  widget.innerHTML = `
    <button class="pomodoro-toggle" aria-label="Toggle pomodoro timer">⏱️</button>
    <div class="pomodoro-panel">
      <div class="pomodoro-header">
        <span class="pomodoro-title">Study Timer</span>
        <span class="pomodoro-status" id="pomodoroStatus">Ready</span>
        <button class="pomodoro-close" aria-label="Close">✕</button>
      </div>
      <div class="pomodoro-modes">
        <button class="pomodoro-mode active" data-mode="focus" data-min="25">Focus 25</button>
        <button class="pomodoro-mode" data-mode="break" data-min="5">Break 5</button>
        <button class="pomodoro-mode" data-mode="long" data-min="15">Long 15</button>
      </div>
      <div class="pomodoro-time" id="pomodoroDisplay">25:00</div>
      <div class="pomodoro-controls">
        <button class="btn btn-primary pomodoro-start">Start</button>
        <button class="btn btn-outline pomodoro-reset">Reset</button>
      </div>
      <div class="pomodoro-sessions">Sessions completed: <strong>0</strong></div>
    </div>
  `;
  document.body.appendChild(widget);

  const panel = widget.querySelector('.pomodoro-panel');
  const toggle = widget.querySelector('.pomodoro-toggle');
  const display = widget.querySelector('#pomodoroDisplay');
  const statusEl = widget.querySelector('#pomodoroStatus');
  const startBtn = widget.querySelector('.pomodoro-start');
  const resetBtn = widget.querySelector('.pomodoro-reset');
  const sessionsEl = widget.querySelector('.pomodoro-sessions strong');
  const modeBtns = $$('.pomodoro-mode', widget);

  const MODES = { focus: 25 * 60, break: 5 * 60, long: 15 * 60 };
  const SESSION_KEY = 'pomodoro_sessions';
  const originalTitle = document.title;

  // --- Restore saved state (or start fresh) ---
  const saved = storage.get(POMO_KEY, null) || {};
  let mode = saved.mode && MODES[saved.mode] ? saved.mode : 'focus';
  let totalSeconds = MODES[mode];
  let remaining = saved.remaining != null ? Math.max(1, Math.min(saved.remaining, totalSeconds)) : totalSeconds;
  let running = !!saved.running;
  let endTime = saved.endTime || 0;
  let tickTimer = null;
  let audioCtx = null;
  let completed = storage.get(SESSION_KEY, 0);

  sessionsEl.textContent = completed;
  modeBtns.forEach((b) => b.classList.toggle('active', b.dataset.mode === mode));

  // --- Small beep via Web Audio (unlocked on first user gesture) ---
  const unlockAudio = () => {
    if (audioCtx) return;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      /* audio not available */
    }
  };
  const beep = (count = 3) => {
    if (!audioCtx || prefersReducedMotion) return;
    const now = audioCtx.currentTime;
    for (let i = 0; i < count; i++) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.001, now + i * 0.45);
      gain.gain.exponentialRampToValueAtTime(0.3, now + i * 0.45 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.45 + 0.35);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(now + i * 0.45);
      osc.stop(now + i * 0.45 + 0.4);
    }
  };

  const persist = () => {
    storage.set(POMO_KEY, { mode, remaining, running, endTime });
  };

  const renderTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    display.textContent = `${padStart(m)}:${padStart(s)}`;
  };

  const renderStatus = () => {
    statusEl.textContent = running ? 'Running' : 'Paused';
    statusEl.classList.toggle('is-running', running);
    toggle.classList.toggle('is-running', running);
    startBtn.textContent = running ? 'Pause' : 'Start';
    document.title = running ? `${display.textContent} · ${mode} — ${originalTitle}` : originalTitle;
  };

  const stopTimer = () => {
    running = false;
    endTime = 0;
    if (tickTimer) {
      clearInterval(tickTimer);
      tickTimer = null;
    }
    persist();
    renderStatus();
  };

  const completeSession = () => {
    stopTimer();
    completed++;
    storage.set(SESSION_KEY, completed);
    sessionsEl.textContent = completed;
    launchConfetti(90);
    beep(3);
    showToast('Pomodoro complete! 🎉 Time for a break.', 'success', 4200);

    // Auto-switch to break mode for the next session
    const nextMode = mode === 'focus' ? 'break' : 'focus';
    mode = nextMode;
    totalSeconds = MODES[mode];
    remaining = totalSeconds;
    modeBtns.forEach((b) => b.classList.toggle('active', b.dataset.mode === mode));
    persist();
    renderTime(remaining);
    renderStatus();
  };

  const startTimer = () => {
    unlockAudio();
    if (running) {
      // Pause: bank the remaining time
      remaining = Math.max(1, Math.round((endTime - Date.now()) / 1000));
      stopTimer();
      return;
    }
    if (remaining <= 0) remaining = totalSeconds;
    running = true;
    endTime = Date.now() + remaining * 1000;
    persist();
    renderStatus();

    tickTimer = setInterval(() => {
      remaining = Math.max(0, Math.round((endTime - Date.now()) / 1000));
      renderTime(remaining);
      if (remaining <= 0) {
        clearInterval(tickTimer);
        tickTimer = null;
        completeSession();
      }
    }, 250);
  };

  const resetTimer = () => {
    stopTimer();
    remaining = totalSeconds;
    renderTime(remaining);
    renderStatus();
  };

  // --- UI events ---
  toggle.addEventListener('click', () => {
    panel.classList.toggle('open');
    widget.classList.toggle('widget-open');
    if (panel.classList.contains('open')) unlockAudio();
  });
  widget.querySelector('.pomodoro-close').addEventListener('click', () => {
    panel.classList.remove('open');
    widget.classList.remove('widget-open');
  });

  modeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      modeBtns.forEach((m) => m.classList.remove('active'));
      btn.classList.add('active');
      mode = btn.dataset.mode;
      totalSeconds = MODES[mode];
      remaining = totalSeconds;
      stopTimer();
      renderTime(remaining);
      renderStatus();
    });
  });

  startBtn.addEventListener('click', startTimer);
  resetBtn.addEventListener('click', resetTimer);

  // --- Visibility: sync countdown when tab is revisited ---
  document.addEventListener('visibilitychange', () => {
    if (!running || document.hidden) return;
    remaining = Math.max(0, Math.round((endTime - Date.now()) / 1000));
    renderTime(remaining);
    if (remaining <= 0) {
      clearInterval(tickTimer);
      tickTimer = null;
      completeSession();
    } else {
      persist();
    }
  });

  // --- Init ---
  if (running && endTime) {
    // Resume an active timer across page reloads
    remaining = Math.max(0, Math.round((endTime - Date.now()) / 1000));
    if (remaining <= 0) {
      running = false;
      endTime = 0;
      persist();
      renderTime(totalSeconds);
      renderStatus();
    } else {
      running = true;
      renderTime(remaining);
      renderStatus();
      startBtn.textContent = 'Pause';
      tickTimer = setInterval(() => {
        remaining = Math.max(0, Math.round((endTime - Date.now()) / 1000));
        renderTime(remaining);
        if (remaining <= 0) {
          clearInterval(tickTimer);
          tickTimer = null;
          completeSession();
        }
      }, 250);
    }
  } else {
    renderTime(remaining);
    renderStatus();
  }
};

buildPomodoroWidget();

/* ============================================
   TODO LIST WIDGET
   A small floating to-do widget persisted in
   localStorage. Great for quick study tasks.
   ============================================ */
const buildTodoWidget = () => {
  const TODO_KEY = 'joshua_todos';
  const widget = document.createElement('div');
  widget.className = 'todo-widget';
  widget.innerHTML = `
    <button class="todo-toggle" aria-label="Toggle todo list">📋</button>
    <div class="todo-panel">
      <div class="todo-header">
        <span class="todo-title">Quick Tasks</span>
        <button class="todo-close" aria-label="Close">✕</button>
      </div>
      <form class="todo-form">
        <input type="text" class="todo-input" placeholder="Add a task…" aria-label="New task" />
        <button type="submit" class="btn btn-primary">Add</button>
      </form>
      <ul class="todo-list"></ul>
    </div>
  `;
  document.body.appendChild(widget);

  const panel = widget.querySelector('.todo-panel');
  const list = widget.querySelector('.todo-list');
  const input = widget.querySelector('.todo-input');
  const form = widget.querySelector('.todo-form');

  let todos = storage.get(TODO_KEY, []);

  const renderTodos = () => {
    list.innerHTML = '';
    if (todos.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'todo-empty';
      empty.textContent = 'No tasks yet. Add one above!';
      list.appendChild(empty);
      return;
    }
    todos.forEach((todo, i) => {
      const li = document.createElement('li');
      li.className = 'todo-item' + (todo.done ? ' done' : '');
      li.innerHTML = `
        <input type="checkbox" class="todo-check" ${todo.done ? 'checked' : ''} aria-label="Mark done" />
        <span class="todo-text">${escapeHTML(todo.text)}</span>
        <button class="todo-delete" aria-label="Delete task">✕</button>
      `;
      li.querySelector('.todo-check').addEventListener('change', () => {
        todos[i].done = li.querySelector('.todo-check').checked;
        storage.set(TODO_KEY, todos);
        renderTodos();
      });
      li.querySelector('.todo-delete').addEventListener('click', () => {
        todos = todos.filter((_, idx) => idx !== i);
        storage.set(TODO_KEY, todos);
        renderTodos();
      });
      list.appendChild(li);
    });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) {
      showToast('Please enter a task.', 'warning');
      return;
    }
    todos.push({ text, done: false });
    storage.set(TODO_KEY, todos);
    input.value = '';
    renderTodos();
    showToast('Task added!', 'success');
  });

  widget.querySelector('.todo-toggle').addEventListener('click', () => {
    panel.classList.toggle('open');
    widget.classList.toggle('widget-open');
  });
  widget.querySelector('.todo-close').addEventListener('click', () => {
    panel.classList.remove('open');
    widget.classList.remove('widget-open');
  });

  renderTodos();
};

buildTodoWidget();

/* ============================================
   FORM DRAFT AUTOSAVE
   Saves contact form / newsletter form field
   values into sessionStorage so a refresh does
   not wipe a partially typed message.
   ============================================ */
const autosaveForms = (form, key) => {
  if (!form) return;
  const fields = $$('input, textarea, select', form);

  fields.forEach((field) => {
    const saved = sessionStore.get(key, {});
    const fieldKey = field.id || field.name;
    if (fieldKey && saved[fieldKey] !== undefined && !field.value) {
      field.value = saved[fieldKey];
    }
  });

  const persist = debounce(() => {
    const data = {};
    fields.forEach((field) => {
      const fieldKey = field.id || field.name;
      if (fieldKey) data[fieldKey] = field.value;
    });
    sessionStore.set(key, data);
  }, 300);

  fields.forEach((field) => field.addEventListener('input', persist));

  form.addEventListener('submit', () => sessionStore.remove(key));
};

autosaveForms(document.getElementById('contactForm'), 'draft_contact');
autosaveForms(document.getElementById('newsletterForm'), 'draft_newsletter');

/* ============================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   Smoothly scrolls to same-page anchors and
   accounts for a fixed navbar height.
   ============================================ */
const initSmoothScroll = () => {
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const hash = anchor.getAttribute('href');
      if (hash.length < 2) return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      const navbarOffset = (navbar ? navbar.offsetHeight : 0) + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - navbarOffset;
      window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
      history.replaceState(null, '', hash);
    });
  });
};
initSmoothScroll();

/* ============================================
   IMAGE ERROR FALLBACK
   Replaces broken images with a friendly
   placeholder so the layout never breaks.
   ============================================ */
$$('img').forEach((img) => {
  img.addEventListener('error', function handleError() {
    this.removeEventListener('error', handleError);
    this.src = 'data:image/svg+xml,' + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
        <rect width="100%" height="100%" fill="#e2e8f0"/>
        <text x="50%" y="50%" font-family="sans-serif" font-size="20" fill="#64748b" text-anchor="middle" dominant-baseline="middle">Image unavailable</text>
      </svg>`
    );
    this.style.opacity = '0.7';
  });
});

/* ============================================
   ESTIMATED READING TIME
   Injects a small "X min read" label next to
   elements marked with [data-reading-time].
   ============================================ */
$$('[data-reading-time]').forEach((el) => {
  const text = el.textContent.trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  const badge = document.createElement('span');
  badge.className = 'reading-time-badge';
  badge.textContent = `${minutes} ${pluralize(minutes, 'min', 'mins')} read`;
  el.appendChild(badge);
});

/* ============================================
   SUBPAGE NAV ACTIVE STATE
   On non-home pages, highlights the nav link
   matching the current page.
   ============================================ */
(() => {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav-link').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    const hrefPath = href.split('#')[0].split('/').pop() || 'index.html';
    if (hrefPath === path) link.classList.add('active');
  });
})();

/* ============================================
   COUNTDOWN TIMERS
   Elements with [data-countdown] show a live
   countdown to a future date, updating every
   second.
   ============================================ */
$$('[data-countdown]').forEach((el) => {
  const targetDate = new Date(el.dataset.countdown).getTime();
  if (isNaN(targetDate)) return;

  const updateCountdown = () => {
    const now = Date.now();
    const diff = targetDate - now;
    if (diff <= 0) {
      el.textContent = 'Countdown finished!';
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    el.textContent = `${days}d ${padStart(hours)}h ${padStart(minutes)}m ${padStart(seconds)}s`;
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);
});

/* ============================================
   PROCEDURAL BLOB GENERATOR
   Injects a random SVG blob shape into any
   element marked with [data-blob].
   ============================================ */
$$('[data-blob]').forEach((el) => {
  const seed = randomInt(3, 7);
  let points = '';
  for (let i = 0; i < seed; i++) {
    const angle = (i / seed) * Math.PI * 2;
    const radius = randomInt(35, 60);
    points += `${(50 + Math.cos(angle) * radius).toFixed(1)},${(50 + Math.sin(angle) * radius).toFixed(1)} `;
  }
  const svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <polygon points="${points.trim()}" fill="currentColor" />
  </svg>`;
  el.innerHTML = svg;
});

/* ============================================
   TIME-BASED HERO GREETING
   Swaps the hero greeting text based on the
   time of day (morning/afternoon/evening).
   ============================================ */
const heroGreeting = document.querySelector('.hero-greeting');
if (heroGreeting) {
  const hour = new Date().getHours();
  let greeting = 'Hello, my name is';
  if (hour >= 5 && hour < 12) greeting = 'Good morning, I am';
  else if (hour >= 12 && hour < 17) greeting = 'Good afternoon, I am';
  else if (hour >= 17 && hour < 21) greeting = 'Good evening, I am';
  else greeting = 'Hello, I am';
  heroGreeting.textContent = greeting;
}

/* ============================================
   ONLINE / OFFLINE TOASTS
   Notifies the visitor when their connection
   status changes.
   ============================================ */
window.addEventListener('online', () => showToast('You are back online!', 'success'));
window.addEventListener('offline', () => showToast('You are offline — some features may not work.', 'warning'));

/* ============================================
   SCROLL POSITION RESTORE
   Restores the previous scroll position when a
   page loads (for in-page navigation).
   ============================================ */
(() => {
  const savedScroll = sessionStore.get('scroll_pos', null);
  if (savedScroll && savedScroll > 0 && window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      target.scrollIntoView({ behavior: 'auto' });
    }
  } else if (savedScroll && savedScroll > 0) {
    window.scrollTo(0, savedScroll);
  }
})();

window.addEventListener('beforeunload', () => {
  sessionStore.set('scroll_pos', window.scrollY);
});

/* ============================================
   EXTERNAL LINK HARDENING
   All external links automatically get
   target="_blank" and rel="noopener".
   ============================================ */
$$('a[href^="http"]').forEach((link) => {
  if (!link.hasAttribute('target')) {
    link.setAttribute('target', '_blank');
  }
  link.setAttribute('rel', 'noopener');
});

/* ============================================
   ANIME STAR RATING
   Elements with [data-rating] render a ★★★★☆
   rating display.
   ============================================ */
$$('[data-rating]').forEach((el) => {
  const rating = parseFloat(el.dataset.rating);
  if (isNaN(rating)) return;
  const max = 5;
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let stars = '';
  for (let i = 0; i < max; i++) {
    if (i < full) stars += '★';
    else if (i === full && half) stars += '⯨';
    else stars += '☆';
  }
  el.textContent = stars + ` (${rating.toFixed(1)})`;
  el.title = `Rated ${rating.toFixed(1)} / ${max}`;
});

/* ============================================
   MESSAGE WORD COUNTER
   A live word count for the contact form
   message textarea.
   ============================================ */
const messageTextarea = document.getElementById('message');
if (messageTextarea) {
  const counter = document.createElement('span');
  counter.className = 'word-counter';
  messageTextarea.insertAdjacentElement('afterend', counter);

  const updateWordCount = () => {
    const words = messageTextarea.value.trim().split(/\s+/).filter(Boolean).length;
    counter.textContent = `${words} ${pluralize(words, 'word', 'words')}`;
  };

  messageTextarea.addEventListener('input', updateWordCount);
  updateWordCount();
}

/* ============================================
   TOUCH DEVICE TILT DISABLE
   The 3D tilt effect on anime cards feels odd
   on touch screens — disable transforms there.
   ============================================ */
if (!hasFinePointer) {
  $$('.anime-card').forEach((card) => {
    card.addEventListener('touchstart', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    }, { passive: true });
  });
}

/* ============================================
   COPY-TO-CLIPBOARD DATA ATTRIBUTES
   Any element with [data-copy] copies its text
   content when clicked.
   ============================================ */
$$('[data-copy]').forEach((el) => {
  el.style.cursor = 'pointer';
  el.title = 'Click to copy';
  el.addEventListener('click', () => {
    const text = el.dataset.copy === '' ? el.textContent.trim() : el.dataset.copy;
    copyTextToClipboard(text).then((ok) => {
      showToast(ok ? 'Copied to clipboard!' : 'Copy failed.', ok ? 'success' : 'error');
    });
  });
});

/* ============================================
   CARDS ENTRANCE HOVER LIFT
   A subtle lift animation for cards that are
   already animated by CSS — no-op safety check.
   ============================================ */
$$('.project-card, .subject-card, .service-card, .fact-card, .cert-card').forEach((card) => {
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = '';
  });
});

/* ============================================
   SECTION COUNT INDICATOR
   Injects a small "Section X / N" breadcrumb
   into any element marked [data-section-progress].
   ============================================ */
const sectionProgressEls = $$('[data-section-progress]');
if (sectionProgressEls.length > 0) {
  const allSections = $$('section[id]');
  window.addEventListener('scroll', throttle(() => {
    const scrollY = window.scrollY + window.innerHeight * 0.4;
    let current = -1;
    allSections.forEach((sec, i) => {
      if (scrollY >= sec.offsetTop) current = i;
    });
    sectionProgressEls.forEach((el) => {
      el.textContent = current >= 0 ? `Section ${current + 1} / ${allSections.length}` : `Section 0 / ${allSections.length}`;
    });
  }, 150));
}

/* ============================================
   LIVE CLOCK WIDGET
   Any element with [data-clock] shows a live
   updating local time.
   ============================================ */
$$('[data-clock]').forEach((el) => {
  const tick = () => {
    el.textContent = formatTime();
  };
  tick();
  setInterval(tick, 1000);
});

/* ============================================
   AUTO-DISMISS ALERTS
   Elements with .auto-dismiss are hidden after
   a few seconds.
   ============================================ */
$$('.auto-dismiss').forEach((el) => {
  const seconds = parseInt(el.dataset.dismissSeconds, 10) || 5;
  setTimeout(() => {
    el.style.transition = 'opacity 0.5s ease';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 500);
  }, seconds * 1000);
});

/* ============================================
   READING PROGRESS BAR (alternate)
   If no scroll progress bar exists, adds a
   minimal one at the very top of the page.
   ============================================ */
if (!document.querySelector('.scroll-progress')) {
  const altProgress = document.createElement('div');
  altProgress.className = 'scroll-progress alt-progress';
  document.body.prepend(altProgress);
  window.addEventListener('scroll', throttle(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    altProgress.style.width = `${progress}%`;
  }, 80));
}

/* ============================================
   BUTTON RIPPLE (universal)
   Adds a ripple to any .btn-primary on click,
   in addition to the existing skill-tag ripple.
   ============================================ */
$$('.btn-primary, .btn-outline').forEach((btn) => {
  btn.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height) * 1.2;
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    ripple.className = 'ripple';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

/* ============================================
   IDLE TIMER NOTIFICATION
   After 5 minutes of no interaction, shows a
   gentle "still there?" toast.
   ============================================ */
(() => {
  const IDLE_MS = 5 * 60 * 1000;
  let idleTimer = null;
  const resetIdle = () => {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      showToast('Still there? Take a break! 💤', 'info', 4000);
    }, IDLE_MS);
  };
  ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'].forEach((evt) => {
    window.addEventListener(evt, resetIdle, { passive: true });
  });
  resetIdle();
})();

/* ============================================
   DYNAMIC YEAR IN MULTIPLE SPOTS
   Also updates any [data-year] element.
   ============================================ */
$$('[data-year]').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

/* ============================================
   TITLE FLASH ON BLUR/FOCUS
   Shows a friendly message in the tab title
   when the visitor leaves the tab.
   ============================================ */
(() => {
  const originalTitle = document.title;
  let titleTimer = null;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      document.title = '👋 Come back soon!';
    } else {
      document.title = originalTitle;
    }
    clearTimeout(titleTimer);
    titleTimer = setTimeout(() => { document.title = originalTitle; }, 4000);
  });
})();

/* ============================================
   CONSOLE WELCOME BANNER
   A fun little console message for curious
   visitors inspecting the page.
   ============================================ */
(() => {
  const style = 'color:#2563eb;font-size:16px;font-weight:bold;';
  console.log('%c👋 Hey there, curious developer!', style);
  console.log('%cThis portfolio was built with HTML, CSS, and vanilla JS. Feel free to explore the code!', 'color:#64748b;');
})();

/* ============================================
   EMOJI RAIN EFFECT
   launchEmojiRain() drops floating emojis from
   the top of the screen. Exposed globally.
   ============================================ */
let emojiRainActive = false;

const launchEmojiRain = (emojis = ['🎉', '✨', '⭐', '🎊', '💫'], count = 30) => {
  if (emojiRainActive) return;
  emojiRainActive = true;

  const layer = document.createElement('div');
  layer.className = 'emoji-rain-layer';
  document.body.appendChild(layer);

  for (let i = 0; i < count; i++) {
    const emoji = document.createElement('span');
    emoji.className = 'emoji-rain-item';
    emoji.textContent = randomItem(emojis);
    emoji.style.left = `${Math.random() * 100}vw`;
    emoji.style.fontSize = `${randomInt(18, 42)}px`;
    emoji.style.animationDuration = `${randomInt(3, 6)}s`;
    emoji.style.animationDelay = `${Math.random() * 2}s`;
    layer.appendChild(emoji);
  }

  setTimeout(() => {
    layer.remove();
    emojiRainActive = false;
  }, 8000);
};

window.launchEmojiRain = launchEmojiRain;

/* ============================================
   CONFETTI ON NAV BAR CLICK (delight)
   Small celebration when the logo is clicked.
   ============================================ */
const logoEl = document.querySelector('.logo');
if (logoEl) {
  logoEl.addEventListener('click', (e) => {
    if (e.metaKey || e.ctrlKey) return;
    launchConfetti(40);
  });
}

/* ============================================
   BACK-TO-TOP EXTRA BEHAVIOR
   Double-clicking the back-to-top button also
   fires confetti as a fun surprise.
   ============================================ */
if (backToTopBtn) {
  backToTopBtn.addEventListener('dblclick', () => {
    launchConfetti(70);
    launchEmojiRain(['⬆️', '🚀', '✨'], 14);
  });
}

/* ============================================
   FINAL SAFETY: run-once guard for toggles
   Ensures no duplicate mobile-nav listeners if
   the script is ever included twice.
   ============================================ */
if (!window.__portfolioJSInitialized) {
  window.__portfolioJSInitialized = true;
  console.info('Portfolio feature pack loaded successfully.');
}
