/* script.js
   Handles: course data, render, search/filter, modal, login modal
*/

const courses = [
  {
    id: 'c1',
    title: 'Complete HTML & CSS Bootcamp',
    category: 'Web Development',
    duration: '6 weeks',
    level: 'Beginner',
    price: 0,
    popularity: 1200,
    featured: true,
    imageText: 'HTML • CSS',
    description: 'Learn HTML5 and modern CSS from scratch. Build responsive sites, layouts, and project-based exercises.'
  },
  {
    id: 'c2',
    title: 'JavaScript Essentials: From Zero to Hero',
    category: 'Web Development',
    duration: '8 weeks',
    level: 'Beginner → Intermediate',
    price: 15,
    popularity: 2100,
    featured: true,
    imageText: 'JavaScript',
    description: 'Core JS fundamentals, DOM, fetch API, asynchronous programming, and real projects.'
  },
  {
    id: 'c3',
    title: 'Django for Web Developers',
    category: 'Web Development',
    duration: '7 weeks',
    level: 'Intermediate',
    price: 25,
    popularity: 900,
    featured: false,
    imageText: 'Django',
    description: 'Build web apps with Python and Django. Covers models, views, templates, and deployment basics.'
  },
  {
    id: 'c4',
    title: 'Intro to Machine Learning',
    category: 'Data Science',
    duration: '10 weeks',
    level: 'Intermediate',
    price: 35,
    popularity: 1800,
    featured: true,
    imageText: 'ML Basics',
    description: 'Supervised learning, regression, classification, and practical pipelines.'
  },
  {
    id: 'c5',
    title: 'Data Visualization with Chart.js',
    category: 'Data Science',
    duration: '3 weeks',
    level: 'Beginner',
    price: 10,
    popularity: 300,
    featured: false,
    imageText: 'Charts',
    description: 'Build interactive charts and dashboards using Chart.js and vanilla JS.'
  },
  {
    id: 'c6',
    title: 'Used Car Price Prediction — Demo Frontend',
    category: 'Machine Learning',
    duration: '4 weeks',
    level: 'Intermediate',
    price: 0,
    popularity: 640,
    featured: false,
    imageText: 'Car-ML',
    description: 'Front-end interface for a prediction model. Works with dummy data; connect to API to enable predictions.'
  }
];

// populate categories dynamically
const categorySelect = document.getElementById('categorySelect');
const allCategories = ['all', ...Array.from(new Set(courses.map(c => c.category)))];
allCategories.forEach(cat => {
  const opt = document.createElement('option');
  opt.value = cat;
  opt.textContent = cat === 'all' ? 'All categories' : cat;
  categorySelect.appendChild(opt);
});

// DOM elements
const coursesGrid = document.getElementById('coursesGrid');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');

// Render functions
function renderCourses(list){
  coursesGrid.innerHTML = '';
  if(list.length === 0){
    coursesGrid.innerHTML = `<div class="course-card"><div class="course-body"><p class="meta">No courses found.</p></div></div>`;
    return;
  }
  list.forEach(course => {
    const card = document.createElement('article');
    card.className = 'course-card';
    card.innerHTML = `
      <div class="course-media" aria-hidden="true">${course.imageText}</div>
      <div class="course-body">
        <div class="meta">${course.category} • ${course.level}</div>
        <div class="title">${escapeHtml(course.title)}</div>
        <div class="meta">${course.duration} • ${course.popularity} learners</div>
        <div class="card-footer">
          <div class="price">${course.price === 0 ? 'Free' : '₹' + course.price}</div>
          <button class="btn btn-outline btn-sm" data-id="${course.id}">View</button>
        </div>
      </div>
    `;
    coursesGrid.appendChild(card);
  });
  // attach click handlers to view buttons
  document.querySelectorAll('.btn[data-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      openCourseModal(id);
    });
  });
}

// basic XSS avoider for inner text
function escapeHtml(str){
  const p = document.createElement('p');
  p.textContent = str;
  return p.innerHTML;
}

// filters
function applyFilters(){
  const q = searchInput.value.trim().toLowerCase();
  const cat = categorySelect.value;
  const sort = sortSelect.value;

  let filtered = courses.filter(c => {
    const matchesQuery = c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
    const matchesCat = cat === 'all' ? true : c.category === cat;
    return matchesQuery && matchesCat;
  });

  // sorting
  if(sort === 'newest'){
    // demo: keep array order as "newest" by popularity descending
    filtered.sort((a,b) => b.popularity - a.popularity);
  } else if(sort === 'popular'){
    filtered.sort((a,b) => b.popularity - a.popularity);
  } else if(sort === 'price-low'){
    filtered.sort((a,b) => a.price - b.price);
  } else if(sort === 'price-high'){
    filtered.sort((a,b) => b.price - a.price);
  } else {
    // featured: show featured first
    filtered.sort((a,b) => (b.featured === true) - (a.featured === true));
  }

  renderCourses(filtered);
}

// modal logic
const courseModal = document.getElementById('courseModal');
const modalBody = document.getElementById('modalBody');
const closeModalBtn = document.getElementById('closeModal');

function openCourseModal(id){
  const course = courses.find(c => c.id === id);
  if(!course) return;
  modalBody.innerHTML = `
    <div style="display:flex;gap:18px;flex-wrap:wrap;">
      <div style="flex:1;min-width:240px;">
        <div style="height:160px;border-radius:10px;background:linear-gradient(135deg,var(--accent),var(--accent-2));color:white;display:flex;align-items:center;justify-content:center;font-weight:700">${course.imageText}</div>
      </div>
      <div style="flex:1.4;min-width:260px;">
        <h2>${escapeHtml(course.title)}</h2>
        <p class="meta">${escapeHtml(course.category)} • ${escapeHtml(course.duration)} • ${escapeHtml(course.level)}</p>
        <p style="margin-top:12px;color:var(--muted)">${escapeHtml(course.description)}</p>
        <div style="margin-top:16px;display:flex;gap:10px;align-items:center">
          <div class="price" style="font-weight:700">${course.price === 0 ? 'Free' : '₹' + course.price}</div>
          <button class="btn btn-primary" id="enrollBtn">Enroll</button>
        </div>
      </div>
    </div>
  `;
  courseModal.setAttribute('aria-hidden', 'false');
  // focus trapping/aria could be improved; simple focus to close
  closeModalBtn.focus();

  // enroll demo
  document.getElementById('enrollBtn').addEventListener('click', () => {
    alert('Enrollment demo — feature requires backend. In a real app this will create a record.');
  });
}

closeModalBtn.addEventListener('click', () => {
  courseModal.setAttribute('aria-hidden', 'true');
});

// click outside to close
courseModal.addEventListener('click', (e) => {
  if(e.target === courseModal){
    courseModal.setAttribute('aria-hidden', 'true');
  }
});

// search/filter events
searchInput.addEventListener('input', debounce(applyFilters, 180));
categorySelect.addEventListener('change', applyFilters);
sortSelect.addEventListener('change', applyFilters);

// initial render
renderCourses(courses);
applyFilters();

// helper: debounce
function debounce(fn, wait){
  let t;
  return function(...args){
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this,args), wait);
  }
}

/* Login modal (front-end only) */
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const closeLogin = document.getElementById('closeLogin');
const cancelLogin = document.getElementById('cancelLogin');
const submitLogin = document.getElementById('submitLogin');

loginBtn.addEventListener('click', () => {
  loginModal.setAttribute('aria-hidden', 'false');
  document.getElementById('email').focus();
});
closeLogin.addEventListener('click', () => loginModal.setAttribute('aria-hidden', 'true'));
cancelLogin.addEventListener('click', () => loginModal.setAttribute('aria-hidden', 'true'));

submitLogin.addEventListener('click', () => {
  // demo "login"
  const email = document.getElementById('email').value.trim();
  if(!email){
    alert('Enter an email to proceed (demo).');
    return;
  }
  alert(`Welcome back, ${email}! (Demo login)`);
  loginModal.setAttribute('aria-hidden', 'true');
});

/* mobile hamburger */
const hamburger = document.getElementById('hamburger');
hamburger.addEventListener('click', () => {
  // simple mobile nav: scroll to top / toggle nav display
  const nav = document.querySelector('.main-nav');
  if(nav.style.display === 'flex'){
    nav.style.display = '';
  } else {
    nav.style.display = 'flex';
    nav.style.position = 'absolute';
    nav.style.top = '72px';
    nav.style.right = '18px';
    nav.style.background = 'white';
    nav.style.padding = '12px';
    nav.style.borderRadius = '10px';
    nav.style.boxShadow = 'var(--shadow)';
    nav.style.flexDirection = 'column';
  }
});

/* small nicety: set year in footer */
document.getElementById('year').textContent = new Date().getFullYear();
