/* ═══════════════════════════════════════════════════════
   ŌBSIDIAN — LUXURY ECOMMERCE — APP.JS
═══════════════════════════════════════════════════════ */

'use strict';

/* ════════════════════════════════════════════════════
   PRODUCT DATA
════════════════════════════════════════════════════ */
const PRODUCTS = [
  { id:1,  name:'Relógio Noir',         category:'acessorios', price:2890,  oldPrice:3600,  emoji:'⌚', rating:5, badge:'Novo',    desc:'Relógio de aço inoxidável com mostrador de quartzo preto. Pulseira de couro genuíno italiano. À prova d\'água 50m.', sizes:['P','M','G'] },
  { id:2,  name:'Colar Obsidiana',       category:'joias',      price:1290,  oldPrice:null,  emoji:'📿', rating:5, badge:'Exclusivo',desc:'Colar artesanal em prata 950 com pedra obsidiana natural. Cada peça é única, lapidada à mão em Portugal.', sizes:['Único'] },
  { id:3,  name:'Bolsa Velvet',          category:'bolsas',     price:3400,  oldPrice:4200,  emoji:'👜', rating:4, badge:'Sale',    desc:'Bolsa em couro velvet premium com forro de seda. Ferragens banhadas a ouro 18k. Confeccionada na Itália.', sizes:['Único'] },
  { id:4,  name:'Blazer Onyx',           category:'vestuario',  price:1890,  oldPrice:null,  emoji:'🥼', rating:5, badge:'Destaque',desc:'Blazer estruturado em lã merino superfino. Corte italiano moderno. Disponível em preto, azul marinho e cinza.', sizes:['PP','P','M','G','GG'] },
  { id:5,  name:'Anel Escultura',        category:'joias',      price:780,   oldPrice:1100,  emoji:'💍', rating:5, badge:'Sale',    desc:'Anel em ouro 18k com design escultural contemporâneo. Inspirado em pedras vulcânicas. Certificado e hallmarkado.', sizes:['13','14','15','16','17','18'] },
  { id:6,  name:'Tênis Phantom',         category:'vestuario',  price:890,   oldPrice:null,  emoji:'👟', rating:4, badge:'Novo',    desc:'Tênis premium de couro plena flor com solado em borracha vulcanizada. Conforto excepcional, estilo atemporal.', sizes:['38','39','40','41','42','43','44'] },
  { id:7,  name:'Carteira Slim',         category:'acessorios', price:420,   oldPrice:580,   emoji:'👛', rating:4, badge:'Sale',    desc:'Carteira ultrafina em couro de vitelo com costura artesanal. Comporta 8 cartões e notas dobradas.', sizes:['Único'] },
  { id:8,  name:'Cachecol Cashmere',     category:'vestuario',  price:650,   oldPrice:null,  emoji:'🧣', rating:5, badge:null,      desc:'Cachecol 100% cashmere mongol grau A, ultramacio. Dimensões 190×70cm. Tintado naturalmente.', sizes:['Único'] },
  { id:9,  name:'Pulseira Titan',        category:'joias',      price:560,   oldPrice:700,   emoji:'⛓️', rating:4, badge:'Sale',    desc:'Pulseira em titânio escovado com detalhe dourado. Peso pluma, resistente a riscos. Fecho magnético.', sizes:['P','M','G'] },
  { id:10, name:'Bolsa Tote Noir',       category:'bolsas',     price:2100,  oldPrice:null,  emoji:'🛍️', rating:5, badge:'Exclusivo',desc:'Tote bag em lona premium com detalhes em couro e forro personalizado. Ideal para uso cotidiano sofisticado.', sizes:['Único'] },
  { id:11, name:'Óculos Dark',           category:'acessorios', price:980,   oldPrice:1200,  emoji:'🕶️', rating:5, badge:'Novo',    desc:'Armação acetato italiano com lentes polarizadas categoria 3. Proteção UV400. Acompanha estojo de couro.', sizes:['Único'] },
  { id:12, name:'Vestido Obsidian',      category:'vestuario',  price:1450,  oldPrice:null,  emoji:'👗', rating:5, badge:'Destaque',desc:'Vestido midi em crepe de seda com corte enviesado. Bordado artesanal na bainha. Exclusivo para ŌBSIDIAN.', sizes:['PP','P','M','G'] },
];

/* ════════════════════════════════════════════════════
   STATE
════════════════════════════════════════════════════ */
let cart = JSON.parse(localStorage.getItem('obs_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('obs_wish') || '[]');
let activeFilter = 'all';
let shownCount = 8;
const PER_PAGE = 4;

/* ════════════════════════════════════════════════════
   HELPERS
════════════════════════════════════════════════════ */
const fmt = n => new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' }).format(n);
const $  = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
function saveState() {
  localStorage.setItem('obs_cart', JSON.stringify(cart));
  localStorage.setItem('obs_wish', JSON.stringify(wishlist));
}

/* ════════════════════════════════════════════════════
   TOAST
════════════════════════════════════════════════════ */
function toast(msg, type='success', icon='✦') {
  const c = $('#toast-container');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span class="toast-icon">${icon}</span><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => { t.style.opacity='0'; t.style.transform='translateX(20px)'; t.style.transition='all 0.4s'; setTimeout(()=>t.remove(), 400); }, 3000);
}

/* ════════════════════════════════════════════════════
   INTRO SCREEN
════════════════════════════════════════════════════ */
function initIntro() {
  const canvas = $('#intro-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 5);

  // Particles
  const pCount = 2000;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(pCount * 3);
  const pColors = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const r = 15 + Math.random() * 10;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pPos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
    pPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    pPos[i*3+2] = r * Math.cos(phi);
    const t = Math.random();
    pColors[i*3]   = 0.7 + 0.3*t;
    pColors[i*3+1] = 0.5 + 0.2*t;
    pColors[i*3+2] = 0.2 + 0.2*t;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));
  const pMat = new THREE.PointsMaterial({ size:0.06, vertexColors:true, transparent:true, opacity:0.8 });
  scene.add(new THREE.Points(pGeo, pMat));

  // Central rotating gem
  const gemGeo = new THREE.OctahedronGeometry(1.2, 2);
  const gemMat = new THREE.MeshPhongMaterial({
    color: 0xc9a96e, shininess:200,
    wireframe: false, transparent:true, opacity:0.15,
  });
  const gem = new THREE.Mesh(gemGeo, gemMat);
  scene.add(gem);
  const gemWire = new THREE.Mesh(gemGeo, new THREE.MeshBasicMaterial({ color:0xc9a96e, wireframe:true, transparent:true, opacity:0.25 }));
  scene.add(gemWire);

  // Lights
  scene.add(Object.assign(new THREE.AmbientLight(0xffffff, 0.2)));
  const pl1 = new THREE.PointLight(0xc9a96e, 2, 20);
  pl1.position.set(3,3,3);
  scene.add(pl1);
  const pl2 = new THREE.PointLight(0x6e8ac9, 1.5, 20);
  pl2.position.set(-3,-3,3);
  scene.add(pl2);

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  let frame = 0;
  function animateIntro() {
    requestAnimationFrame(animateIntro);
    frame++;
    gem.rotation.x = frame * 0.004;
    gem.rotation.y = frame * 0.006;
    gemWire.rotation.x = gem.rotation.x;
    gemWire.rotation.y = gem.rotation.y;
    pl1.position.x = Math.sin(frame * 0.01) * 4;
    pl1.position.y = Math.cos(frame * 0.012) * 4;
    renderer.render(scene, camera);
  }
  animateIntro();

  // Loading progress
  const fill = $('#loader-fill');
  const pct  = $('#loader-pct');
  const enterBtn = $('#enter-btn');
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 8 + 2;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      fill.style.width = '100%';
      pct.textContent = '100%';
      $('#intro-loader').style.opacity = '0';
      setTimeout(() => enterBtn.classList.remove('hidden'), 300);
    } else {
      fill.style.width = progress + '%';
      pct.textContent = Math.floor(progress) + '%';
    }
  }, 80);

  enterBtn.addEventListener('click', () => {
    $('#intro-screen').classList.add('exit');
    $('#site').classList.remove('hidden');
    setTimeout(() => {
      $('#intro-screen').style.display = 'none';
      document.body.style.overflow = '';
      triggerHeroReveal();
    }, 1000);
  });
}

/* ════════════════════════════════════════════════════
   HERO CANVAS (Particle field)
════════════════════════════════════════════════════ */
function initHeroCanvas() {
  const canvas = $('#hero-canvas');
  if (!canvas) return;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth/canvas.offsetHeight, 0.1, 100);
  camera.position.z = 4;

  const geo = new THREE.BufferGeometry();
  const N = 3000;
  const pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    pos[i*3]   = (Math.random()-0.5) * 30;
    pos[i*3+1] = (Math.random()-0.5) * 20;
    pos[i*3+2] = (Math.random()-0.5) * 20;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ size:0.04, color:0xc9a96e, transparent:true, opacity:0.5 });
  scene.add(new THREE.Points(geo, mat));

  // Floating torus knots
  const knots = [];
  for (let i=0; i<3; i++) {
    const kg = new THREE.TorusKnotGeometry(0.4+i*0.3, 0.05, 80, 12, 2, 3+i);
    const km = new THREE.MeshBasicMaterial({ color:0xc9a96e, wireframe:true, transparent:true, opacity:0.08+i*0.04 });
    const k = new THREE.Mesh(kg, km);
    k.position.set(4+i*4, 2-i*2, -3-i*2);
    scene.add(k);
    knots.push(k);
  }

  let mx=0, my=0;
  window.addEventListener('mousemove', e => { mx = (e.clientX/window.innerWidth-0.5)*2; my = -(e.clientY/window.innerHeight-0.5)*2; });

  let hFrame = 0;
  function animHero() {
    requestAnimationFrame(animHero);
    hFrame++;
    camera.position.x += (mx * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (my * 0.3 - camera.position.y) * 0.05;
    knots.forEach((k,i) => { k.rotation.x = hFrame*0.003*(i+1); k.rotation.y = hFrame*0.004*(i+1); });
    renderer.render(scene, camera);
  }
  animHero();

  const resizeHero = () => {
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
    camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', resizeHero);
}

/* ════════════════════════════════════════════════════
   PROMO CANVAS
════════════════════════════════════════════════════ */
function initPromoCanvas() {
  const canvas = $('#promo-canvas');
  if (!canvas) return;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth/canvas.offsetHeight, 0.1, 100);
  camera.position.z = 5;

  const shapes = [];
  for (let i=0; i<12; i++) {
    const g = new THREE.IcosahedronGeometry(0.1+Math.random()*0.3, 0);
    const m = new THREE.MeshBasicMaterial({ color:0xc9a96e, wireframe:true, transparent:true, opacity:0.15+Math.random()*0.2 });
    const mesh = new THREE.Mesh(g, m);
    mesh.position.set((Math.random()-0.5)*20, (Math.random()-0.5)*8, (Math.random()-0.5)*10);
    mesh.userData = { rx: (Math.random()-0.5)*0.02, ry: (Math.random()-0.5)*0.03 };
    scene.add(mesh);
    shapes.push(mesh);
  }
  let f=0;
  function animPromo() { requestAnimationFrame(animPromo); f++; shapes.forEach(s=>{ s.rotation.x+=s.userData.rx; s.rotation.y+=s.userData.ry; }); renderer.render(scene, camera); }
  animPromo();
}

/* ════════════════════════════════════════════════════
   ABOUT CANVAS
════════════════════════════════════════════════════ */
function initAboutCanvas() {
  const canvas = $('#about-canvas');
  if (!canvas) return;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  const w = canvas.parentElement.offsetWidth, h = canvas.parentElement.offsetHeight || 400;
  renderer.setSize(w, h);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, w/h, 0.1, 100);
  camera.position.z = 3;

  // Diamond
  const dGeo = new THREE.OctahedronGeometry(1.2, 3);
  const dMat = new THREE.MeshPhongMaterial({ color:0xc9a96e, shininess:300, transparent:true, opacity:0.12 });
  const diamond = new THREE.Mesh(dGeo, dMat);
  scene.add(diamond);
  const dWire = new THREE.Mesh(dGeo, new THREE.MeshBasicMaterial({ color:0xc9a96e, wireframe:true, transparent:true, opacity:0.2 }));
  scene.add(dWire);

  scene.add(Object.assign(new THREE.AmbientLight(0xffffff, 0.3)));
  const pl = new THREE.PointLight(0xc9a96e, 3, 10);
  pl.position.set(2,2,2);
  scene.add(pl);

  let af=0;
  function animAbout() {
    requestAnimationFrame(animAbout); af++;
    diamond.rotation.y = af*0.005;
    diamond.rotation.x = Math.sin(af*0.003)*0.3;
    dWire.rotation.y = diamond.rotation.y + 0.3;
    dWire.rotation.x = diamond.rotation.x;
    pl.position.x = Math.sin(af*0.01)*3;
    renderer.render(scene, camera);
  }
  animAbout();
}

/* ════════════════════════════════════════════════════
   CATEGORY 3D ICONS (mini Three.js canvases)
════════════════════════════════════════════════════ */
function initCategoryIcons() {
  const configs = [
    { id:'cat-icon-1', geo: () => new THREE.TorusGeometry(0.4, 0.12, 16, 50), color:0x6e9dc9 },
    { id:'cat-icon-2', geo: () => new THREE.CylinderGeometry(0.3,0.4,0.8,6), color:0x9dc96e },
    { id:'cat-icon-3', geo: () => new THREE.OctahedronGeometry(0.5,0), color:0xc96e9d },
    { id:'cat-icon-4', geo: () => new THREE.BoxGeometry(0.7,0.5,0.3), color:0xc9a96e },
  ];
  configs.forEach(cfg => {
    const container = document.getElementById(cfg.id);
    if (!container) return;
    const canvas = document.createElement('canvas');
    canvas.width = 100; canvas.height = 100;
    canvas.style.width = '100%'; canvas.style.height = '100%';
    container.appendChild(canvas);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
    renderer.setSize(100,100);
    renderer.setPixelRatio(devicePixelRatio);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 10);
    camera.position.z = 2;
    const mesh = new THREE.Mesh(cfg.geo(), new THREE.MeshPhongMaterial({ color:cfg.color, shininess:150, transparent:true, opacity:0.8 }));
    scene.add(mesh);
    const wire = new THREE.Mesh(cfg.geo(), new THREE.MeshBasicMaterial({ color:cfg.color, wireframe:true, transparent:true, opacity:0.3 }));
    scene.add(wire);
    const al = new THREE.AmbientLight(0xffffff,0.5);
    scene.add(al);
    const pl = new THREE.PointLight(cfg.color, 2, 5);
    pl.position.set(1,1,2);
    scene.add(pl);
    let f=0;
    const animate = () => { requestAnimationFrame(animate); f++; mesh.rotation.y=f*0.015; mesh.rotation.x=f*0.01; wire.rotation.y=mesh.rotation.y+0.5; wire.rotation.x=mesh.rotation.x; renderer.render(scene,camera); };
    animate();
  });
}

/* ════════════════════════════════════════════════════
   CURSOR
════════════════════════════════════════════════════ */
function initCursor() {
  const cur = $('#cursor'), fol = $('#cursor-follower');
  if (!cur) return;
  let mx=0, my=0, fx=0, fy=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
  function moveCursor() {
    cur.style.left = mx+'px'; cur.style.top = my+'px';
    fx += (mx-fx)*0.1; fy += (my-fy)*0.1;
    fol.style.left = fx+'px'; fol.style.top = fy+'px';
    requestAnimationFrame(moveCursor);
  }
  moveCursor();
  document.querySelectorAll('a,button,.product-card,.cat-card,.search-item').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ════════════════════════════════════════════════════
   NAVBAR
════════════════════════════════════════════════════ */
function initNavbar() {
  const nav = $('#navbar');
  const toggle = $('#menu-toggle');
  const mobileMenu = $('#mobile-menu');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  $$('.mob-link').forEach(l => l.addEventListener('click', () => {
    toggle.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }));
}

/* ════════════════════════════════════════════════════
   SEARCH
════════════════════════════════════════════════════ */
function initSearch() {
  const overlay = $('#search-overlay');
  const input = $('#search-input');
  const results = $('#search-results');

  $('#search-btn').addEventListener('click', () => { overlay.classList.add('open'); setTimeout(()=>input.focus(),100); });
  $('#search-close').addEventListener('click', () => overlay.classList.remove('open'));
  document.addEventListener('keydown', e => { if(e.key==='Escape') overlay.classList.remove('open'); });

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    results.innerHTML = '';
    if (!q) return;
    const found = PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
    if (!found.length) {
      results.innerHTML = `<p style="color:var(--muted);font-size:13px;padding:8px">Nenhum produto encontrado.</p>`;
      return;
    }
    found.slice(0,5).forEach(p => {
      const el = document.createElement('div');
      el.className = 'search-item';
      el.innerHTML = `<div class="search-item-img">${p.emoji}</div><div class="search-item-info"><h4>${p.name}</h4><span>${fmt(p.price)}</span></div>`;
      el.addEventListener('click', () => { overlay.classList.remove('open'); openModal(p.id); });
      results.appendChild(el);
    });
  });
}

/* ════════════════════════════════════════════════════
   CART
════════════════════════════════════════════════════ */
function updateCartBadge() {
  const count = cart.reduce((a,i)=>a+i.qty, 0);
  $('#cart-count').textContent = count;
  $('#cart-count').style.display = count ? 'flex' : 'none';
}
function updateWishBadge() {
  const count = wishlist.length;
  $('#wishlist-count').textContent = count;
  $('#wishlist-count').style.display = count ? 'flex' : 'none';
}
function renderCart() {
  const container = $('#cart-items');
  container.innerHTML = '';
  if (!cart.length) {
    container.innerHTML = `<div style="text-align:center;padding:60px 20px;color:var(--muted)"><div style="font-size:3rem;margin-bottom:16px">🛒</div><p>Seu carrinho está vazio</p></div>`;
    $('#cart-total-price').textContent = 'R$ 0,00';
    return;
  }
  cart.forEach(item => {
    const p = PRODUCTS.find(x=>x.id===item.id);
    if(!p) return;
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <div class="cart-item-emoji">${p.emoji}</div>
      <div class="cart-item-info">
        <h4>${p.name}</h4>
        <span class="item-price">${fmt(p.price)}</span>
        <div class="cart-item-qty">
          <button class="qty-btn" data-id="${p.id}" data-d="-1">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" data-id="${p.id}" data-d="1">+</button>
        </div>
      </div>
      <button class="cart-item-remove" data-id="${p.id}">✕</button>`;
    container.appendChild(el);
  });
  const total = cart.reduce((a,i)=>{ const p=PRODUCTS.find(x=>x.id===i.id); return a+(p?p.price*i.qty:0); },0);
  $('#cart-total-price').textContent = fmt(total);

  container.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = +btn.dataset.id, d = +btn.dataset.d;
      const ci = cart.find(x=>x.id===id);
      if(ci) { ci.qty += d; if(ci.qty<=0) cart = cart.filter(x=>x.id!==id); }
      saveState(); renderCart(); updateCartBadge();
    });
  });
  container.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      cart = cart.filter(x=>x.id!==+btn.dataset.id);
      saveState(); renderCart(); updateCartBadge();
      toast('Item removido','error','✕');
    });
  });
}
function addToCart(id, qty=1) {
  const ci = cart.find(x=>x.id===id);
  if(ci) ci.qty+=qty; else cart.push({id,qty});
  saveState(); renderCart(); updateCartBadge();
  const p = PRODUCTS.find(x=>x.id===id);
  toast(`${p.emoji} ${p.name} adicionado!`,'success','✦');
}
function initCart() {
  $('#cart-btn').addEventListener('click', () => {
    $('#cart-drawer').classList.add('open');
    $('#cart-overlay').classList.add('open');
  });
  const close = () => { $('#cart-drawer').classList.remove('open'); $('#cart-overlay').classList.remove('open'); };
  $('#cart-close').addEventListener('click', close);
  $('#cart-overlay').addEventListener('click', close);
  $('#checkout-btn').addEventListener('click', () => toast('🎉 Redirecionando para pagamento...','success','✦'));
  renderCart(); updateCartBadge(); updateWishBadge();
}

/* ════════════════════════════════════════════════════
   PRODUCTS
════════════════════════════════════════════════════ */
function buildStars(rating) {
  return [1,2,3,4,5].map(i=>`<span class="star ${i<=rating?'':'empty'}">★</span>`).join('');
}
function renderProducts() {
  const grid = $('#products-grid');
  const filtered = activeFilter==='all' ? PRODUCTS : PRODUCTS.filter(p=>p.category===activeFilter);
  grid.innerHTML = '';
  filtered.slice(0, shownCount).forEach((p,i) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.category = p.category;
    card.style.animationDelay = (i%4 * 0.08)+'s';
    const inWish = wishlist.includes(p.id);
    card.innerHTML = `
      <div class="product-img">
        ${p.badge ? `<span class="product-badge ${p.badge==='Sale'?'sale':''}">${p.badge}</span>` : ''}
        <span style="position:relative;z-index:1;transition:transform 0.4s">${p.emoji}</span>
        <div class="product-actions">
          <button class="action-btn wish-btn" data-id="${p.id}" title="Lista de Desejos">${inWish?'❤️':'🤍'}</button>
          <button class="action-btn quick-view" data-id="${p.id}" title="Ver Detalhes">👁</button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-category">${p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-rating">${buildStars(p.rating)}</div>
        <div class="product-price-row">
          <div>
            <span class="product-price">${fmt(p.price)}</span>
            ${p.oldPrice ? `<span class="product-old-price">${fmt(p.oldPrice)}</span>` : ''}
          </div>
          <button class="add-cart-btn" data-id="${p.id}" title="Adicionar ao Carrinho">+</button>
        </div>
      </div>`;
    card.querySelector('.add-cart-btn').addEventListener('click', e => { e.stopPropagation(); addToCart(p.id); });
    card.querySelector('.quick-view').addEventListener('click', e => { e.stopPropagation(); openModal(p.id); });
    card.querySelector('.wish-btn').addEventListener('click', e => {
      e.stopPropagation();
      toggleWish(p.id);
      const btn = e.currentTarget;
      btn.textContent = wishlist.includes(p.id) ? '❤️' : '🤍';
    });
    card.addEventListener('click', () => openModal(p.id));
    grid.appendChild(card);
  });
  const btn = $('#load-more');
  btn.style.display = filtered.length > shownCount ? 'inline-flex' : 'none';
}
function toggleWish(id) {
  if(wishlist.includes(id)) { wishlist=wishlist.filter(x=>x!==id); toast('Removido da lista','error','🤍'); }
  else { wishlist.push(id); toast('Adicionado à lista!','success','❤️'); }
  saveState(); updateWishBadge();
}
function initProducts() {
  $$('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      shownCount = 8;
      renderProducts();
    });
  });
  $('#load-more').addEventListener('click', () => { shownCount+=PER_PAGE; renderProducts(); });
  renderProducts();
}

/* ════════════════════════════════════════════════════
   CATEGORY FILTER (click category cards)
════════════════════════════════════════════════════ */
function initCategories() {
  $$('.cat-card').forEach(card => {
    card.addEventListener('click', () => {
      const f = card.dataset.filter;
      const target = document.getElementById('featured');
      target.scrollIntoView({behavior:'smooth'});
      setTimeout(()=>{
        $$('.filter-btn').forEach(b=>b.classList.remove('active'));
        const btn = document.querySelector(`.filter-btn[data-filter="${f}"]`);
        if(btn) btn.classList.add('active');
        activeFilter = f; shownCount = 8; renderProducts();
      }, 700);
    });
  });
}

/* ════════════════════════════════════════════════════
   PRODUCT MODAL
════════════════════════════════════════════════════ */
function openModal(id) {
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  const inWish = wishlist.includes(p.id);
  let qty = 1;
  let selectedSize = p.sizes[0] || null;

  const body = $('#modal-body');
  body.innerHTML = `
    <div class="modal-img-side">${p.emoji}</div>
    <div class="modal-info-side">
      <div class="modal-cat">${p.category}</div>
      <h2 class="modal-title">${p.name}</h2>
      <div class="modal-price">${fmt(p.price)}</div>
      ${p.oldPrice ? `<div class="modal-old-price">${fmt(p.oldPrice)}</div>` : ''}
      <div class="modal-rating" style="margin-bottom:16px">${buildStars(p.rating)}</div>
      <p class="modal-desc">${p.desc}</p>
      ${p.sizes.length ? `
      <div class="modal-sizes">
        <h4>Tamanho</h4>
        <div class="size-opts">
          ${p.sizes.map(s=>`<button class="size-btn ${s===selectedSize?'active':''}" data-size="${s}">${s}</button>`).join('')}
        </div>
      </div>` : ''}
      <div class="modal-qty">
        <label>Qtd.</label>
        <div class="modal-qty-ctrl">
          <button class="modal-qty-btn" id="mq-minus">−</button>
          <span class="modal-qty-num" id="mq-num">1</span>
          <button class="modal-qty-btn" id="mq-plus">+</button>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn-primary" style="flex:1" id="modal-add-cart">Adicionar ao Carrinho</button>
        <button class="modal-wish-btn" id="modal-wish">${inWish?'❤️':'🤍'}</button>
      </div>
    </div>`;

  body.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      body.querySelectorAll('.size-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      selectedSize = btn.dataset.size;
    });
  });
  body.querySelector('#mq-minus').addEventListener('click', () => { if(qty>1) qty--; body.querySelector('#mq-num').textContent=qty; });
  body.querySelector('#mq-plus').addEventListener('click',  () => { if(qty<10) qty++; body.querySelector('#mq-num').textContent=qty; });
  body.querySelector('#modal-add-cart').addEventListener('click', () => { addToCart(id, qty); });
  body.querySelector('#modal-wish').addEventListener('click', e => {
    toggleWish(id);
    e.currentTarget.textContent = wishlist.includes(id) ? '❤️' : '🤍';
  });

  $('#modal-overlay').classList.add('open');
  $('#product-modal').classList.add('open');
}
function initModal() {
  const close = () => { $('#modal-overlay').classList.remove('open'); $('#product-modal').classList.remove('open'); };
  $('#modal-close').addEventListener('click', close);
  $('#modal-overlay').addEventListener('click', close);
  document.addEventListener('keydown', e => { if(e.key==='Escape') close(); });
}

/* ════════════════════════════════════════════════════
   HERO REVEAL
════════════════════════════════════════════════════ */
function triggerHeroReveal() {
  $$('#hero .reveal-up').forEach((el,i) => {
    setTimeout(() => el.classList.add('visible'), 200+i*150);
  });
  animateStats();
}
function animateStats() {
  $$('.stat-num').forEach(el => {
    const target = +el.dataset.target;
    let cur = 0;
    const step = target / 60;
    const interval = setInterval(() => {
      cur += step;
      if(cur >= target) { el.textContent = target.toLocaleString('pt-BR'); clearInterval(interval); }
      else el.textContent = Math.floor(cur).toLocaleString('pt-BR');
    }, 20);
  });
}

/* ════════════════════════════════════════════════════
   SCROLL REVEAL
════════════════════════════════════════════════════ */
function initScrollReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold:0.1, rootMargin:'0px 0px -60px 0px' });
  $$('.reveal-up').forEach(el => obs.observe(el));
}

/* ════════════════════════════════════════════════════
   COUNTDOWN TIMER
════════════════════════════════════════════════════ */
function initTimer() {
  const end = new Date(Date.now() + 7*60*60*1000 + 43*60*1000 + 20*1000);
  function tick() {
    const diff = Math.max(0, end - Date.now());
    const h = Math.floor(diff/3600000);
    const m = Math.floor((diff%3600000)/60000);
    const s = Math.floor((diff%60000)/1000);
    const pad = n => String(n).padStart(2,'0');
    $('#t-h').textContent = pad(h);
    $('#t-m').textContent = pad(m);
    $('#t-s').textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);
}

/* ════════════════════════════════════════════════════
   TESTIMONIALS SLIDER
════════════════════════════════════════════════════ */
function initTestimonials() {
  const track = $('#testimonials-track');
  let idx = 0;
  function updateSlide() {
    const cardW = track.querySelector('.testimonial-card').offsetWidth + 24;
    track.style.transform = `translateX(-${idx*cardW}px)`;
  }
  $('#test-next').addEventListener('click', () => { const max = track.querySelectorAll('.testimonial-card').length-1; idx=Math.min(idx+1,max); updateSlide(); });
  $('#test-prev').addEventListener('click', () => { idx=Math.max(idx-1,0); updateSlide(); });
  window.addEventListener('resize', updateSlide);
  // Auto slide
  setInterval(() => {
    const max = track.querySelectorAll('.testimonial-card').length-1;
    idx = idx<max ? idx+1 : 0;
    updateSlide();
  }, 5000);
}

/* ════════════════════════════════════════════════════
   NEWSLETTER
════════════════════════════════════════════════════ */
function initNewsletter() {
  $('#nl-btn').addEventListener('click', () => {
    const val = $('#nl-email').value.trim();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      $('#nl-msg').textContent = '⚠ Email inválido.';
      $('#nl-msg').style.color = 'var(--red)';
      return;
    }
    $('#nl-email').value = '';
    $('#nl-msg').textContent = '✦ Você agora faz parte do clube ŌBSIDIAN!';
    $('#nl-msg').style.color = 'var(--gold)';
    toast('📧 Bem-vindo ao clube!','success','✦');
  });
}

/* ════════════════════════════════════════════════════
   WISHLIST BTN (header)
════════════════════════════════════════════════════ */
function initWishlistBtn() {
  $('#wishlist-btn').addEventListener('click', () => {
    if(!wishlist.length) { toast('Sua lista de desejos está vazia','error','🤍'); return; }
    // Filter to show wishlist items
    activeFilter = 'all';
    shownCount = wishlist.length;
    const grid = $('#products-grid');
    grid.innerHTML = '';
    wishlist.forEach((id,i) => {
      const p = PRODUCTS.find(x=>x.id===id);
      if(!p) return;
      const card = document.createElement('div');
      card.className = 'product-card';
      card.style.animationDelay = (i%4*0.08)+'s';
      card.innerHTML = `
        <div class="product-img">
          ${p.badge ? `<span class="product-badge ${p.badge==='Sale'?'sale':''}">${p.badge}</span>` : ''}
          <span style="position:relative;z-index:1">${p.emoji}</span>
        </div>
        <div class="product-info">
          <div class="product-category">${p.category}</div>
          <div class="product-name">${p.name}</div>
          <div class="product-rating">${buildStars(p.rating)}</div>
          <div class="product-price-row">
            <span class="product-price">${fmt(p.price)}</span>
            <button class="add-cart-btn" data-id="${p.id}">+</button>
          </div>
        </div>`;
      card.querySelector('.add-cart-btn').addEventListener('click', e => { e.stopPropagation(); addToCart(p.id); });
      card.addEventListener('click', () => openModal(p.id));
      grid.appendChild(card);
    });
    document.getElementById('featured').scrollIntoView({behavior:'smooth'});
    toast(`❤️ Mostrando ${wishlist.length} item(s) favoritos`,'success','❤️');
  });
}

/* ════════════════════════════════════════════════════
   SMOOTH SCROLL LINKS
════════════════════════════════════════════════════ */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if(target) { e.preventDefault(); target.scrollIntoView({behavior:'smooth'}); }
    });
  });
}

/* ════════════════════════════════════════════════════
   PARALLAX
════════════════════════════════════════════════════ */
function initParallax() {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const heroContent = $('.hero-content');
    if(heroContent) heroContent.style.transform = `translateY(${y*0.2}px)`;
  });
}

/* ════════════════════════════════════════════════════
   INIT ALL
════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.overflow = 'hidden';
  initIntro();
  initCursor();
  initNavbar();
  initSearch();
  initCart();
  initProducts();
  initCategories();
  initModal();
  initScrollReveal();
  initTimer();
  initTestimonials();
  initNewsletter();
  initWishlistBtn();
  initSmoothScroll();
  initParallax();

  // These canvases init after site is shown
  setTimeout(() => {
    initHeroCanvas();
    initPromoCanvas();
    initAboutCanvas();
    initCategoryIcons();
  }, 1100);
});
