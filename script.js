(function(){
  // 1. Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  if(menuToggle && nav){
    menuToggle.addEventListener('click',()=>{
      const open = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });
  }

  // 2. Main Dropdowns (Users, Info, etc.)
  document.querySelectorAll('.nav-group > button').forEach(button => {
    button.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopImmediatePropagation();
        
        document.querySelectorAll('.nav-group.open').forEach(g => {
          if (g !== this.parentElement) g.classList.remove('open');
        });

        this.parentElement.classList.toggle('open');
      }
    }, true);
  });

  // 3. Sub-Menu Fix (Channels) - Exact previous working logic
  document.querySelectorAll('.nav-sub-btn').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation(); 
      
      const sideMenu = this.nextElementSibling;
      if (sideMenu && sideMenu.classList.contains('nav-popover-side')) {
        document.querySelectorAll('.nav-popover-side.show-side').forEach(s => {
          if (s !== sideMenu) s.classList.remove('show-side');
        });
        sideMenu.classList.toggle('show-side');
      }
    });
  });

  // 4. Close menus when clicking outside
  document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      if (!e.target.closest('.primary-nav')) {
        document.querySelectorAll('.nav-group.open').forEach(g => g.classList.remove('open'));
        document.querySelectorAll('.nav-popover-side.show-side').forEach(s => s.classList.remove('show-side'));
      }
    }
  });

  // 5. Canvas Network Animation
  const canvas = document.getElementById('network-bg');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w=0,h=0,dpr=1,nodes=[];
  let raf=0;

  function resize(){
    dpr=Math.min(window.devicePixelRatio||1,2);
    w=window.innerWidth; h=window.innerHeight;
    canvas.width=Math.floor(w*dpr); canvas.height=Math.floor(h*dpr);
    canvas.style.width=w+'px'; canvas.style.height=h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const count=Math.max(24,Math.min(62,Math.floor((w*h)/26000)));
    nodes=Array.from({length:count},()=>({
      x:Math.random()*w,y:Math.random()*h,
      vx:(Math.random()-.5)*.6,vy:(Math.random()-.5)*.4,
      r:Math.random()*1.2+.45
    }));
  }

  function draw(){
    ctx.clearRect(0,0,w,h);
    for(let i=0;i<nodes.length;i++){
      const a=nodes[i];
      if(!reduceMotion){
        a.x+=a.vx;a.y+=a.vy;
        if(a.x<0||a.x>w)a.vx*=-1;
        if(a.y<0||a.y>h)a.vy*=-1;
      }
      ctx.beginPath();ctx.arc(a.x,a.y,a.r,0,Math.PI*2);ctx.fillStyle='rgba(94,210,255,.35)';ctx.fill();
      for(let j=i+1;j<nodes.length;j++){
        const b=nodes[j],dx=a.x-b.x,dy=a.y-b.y,dist=Math.hypot(dx,dy);
        if(dist<150){
          ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
          ctx.strokeStyle=`rgba(71,142,193,${(1-dist/150)*.085})`;ctx.lineWidth=.6;ctx.stroke();
        }
      }
    }
    if(!reduceMotion) raf=requestAnimationFrame(draw);
  }

  resize(); draw();
  window.addEventListener('resize',()=>{cancelAnimationFrame(raf);resize();draw();});
})();