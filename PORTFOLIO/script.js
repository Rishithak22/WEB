// Cursor
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});
(function anim() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(anim);
})();
  document.querySelectorAll('a,button,.skill-card,.proj-card,.exp-card,.edu-card,.c-link').forEach(el=>{
    el.addEventListener('mouseenter',()=>{ring.style.transform='translate(-50%,-50%) scale(2)';ring.style.opacity='0.25';});
    el.addEventListener('mouseleave',()=>{ring.style.transform='translate(-50%,-50%) scale(1)';ring.style.opacity='0.5';});
  });
 
  // Navbar
  window.addEventListener('scroll',()=>document.getElementById('navbar').classList.toggle('scrolled',window.scrollY>50));
function toggleNav() {
    document.getElementById('navbar').classList.toggle('open');
}
 
  // Typed text
  const roles=['Aspiring Software Developer','Front-end Developer','MCA Student','UI Enthusiast','Bootstrap Expert','Problem Solver'];
  let ri=0,ci=0,del=false;
  const tel=document.getElementById('typedEl');
  function type(){
    const cur=roles[ri];
      if (!del) {
          tel.textContent = cur.slice(0, ci + 1);
          ci++;
          if (ci === cur.length) {
              del = true;
              setTimeout(type, 1800);
              return;
          }
          setTimeout(type, 75);
      }
      else {
          tel.textContent = cur.slice(0, ci - 1);
          ci--;
          if (ci === 0) {
              del = false;
              ri = (ri + 1) % roles.length;
              setTimeout(type, 400);
              return;
          }
          setTimeout(type, 42);
      }
  }
  type();
 
// Reveal
document.body.classList.add('js-ready');
  
  const ro=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');}),{threshold:0});
  document.querySelectorAll('.reveal').forEach(r=>ro.observe(r));
 
/* ===== SKILL BARS ===== */
function fillBar(card) {
  if (card.dataset.filled) return;
  card.dataset.filled = '1';
  const fill = card.querySelector('.bar-fill');
  const pct  = card.dataset.fill;
  if (fill && pct) {
    setTimeout(() => { fill.style.width = pct + '%'; }, 100);
  }
}
 
function checkBars() {
  document.querySelectorAll('.skill-card[data-fill]').forEach(card => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      fillBar(card);
    }
  });
}
 
window.addEventListener('scroll', checkBars);
document.addEventListener('DOMContentLoaded', () => { checkBars(); setTimeout(checkBars, 300); setTimeout(checkBars, 800); });
window.addEventListener('load', checkBars);
checkBars();
 
  // Count up
  function runCountUp(container) {
  container.querySelectorAll('[data-target]').forEach(num => {
    if (num.dataset.counted) return;          /* don't run twice */
    num.dataset.counted = '1';
    const target = +num.dataset.target;
    let current  = 0;
    const step   = Math.ceil(target / 50);
    const timer  = setInterval(() => {
      current = Math.min(current + step, target);
      num.textContent = current + '+';
      if (current >= target) clearInterval(timer);
    }, 35);
  });
}
 
function checkStats() {
  document.querySelectorAll('[data-target]').forEach(num => {
    const rect = num.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      if (num.dataset.counted) return;
      num.dataset.counted = '1';
      const target = +num.dataset.target;
      let current = 0;
      const step = Math.ceil(target / 50);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        num.textContent = current + '+';
        if (current >= target) clearInterval(timer);
      }, 35);
    }
  });
}
 
/* Run on scroll AND immediately on load */
window.addEventListener('scroll', checkStats);
window.addEventListener('load', checkStats);
checkStats(); /* also run right now */
 

  // Form
  function handleSubmit(e){
    e.preventDefault();
    const btn=e.target.querySelector('.f-submit');
    btn.textContent='Message Sent! ✓';btn.style.background='#9f60e8';
    setTimeout(()=>{btn.textContent='Send Message →';btn.style.background='';e.target.reset();},3000);
  }