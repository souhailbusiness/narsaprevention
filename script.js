(function(){
  const header = document.getElementById('site-header');
  const burger = document.getElementById('burgerBtn');
  const primaryNav = document.getElementById('primary-nav');
  const mobileNav = document.getElementById('mobileNav');

  // Build mobile nav content by cloning the desktop list (keeps markup DRY)
  const desktopList = primaryNav.querySelector('.nav-list');
  function buildMobileNav(){
    mobileNav.innerHTML = '';
    const clone = desktopList.cloneNode(true);
    clone.querySelectorAll('[role]').forEach(el=>el.removeAttribute('role'));
    mobileNav.appendChild(clone);
    mobileNav.setAttribute('aria-hidden','true');

    // Attach toggles to items that have submenus
    mobileNav.querySelectorAll('li').forEach(li=>{
      const submenu = li.querySelector('.submenu, .submenu-inner');
      if(submenu){
        const toggle = document.createElement('button');
        toggle.className = 'toggle-btn submenu-toggle';
        toggle.setAttribute('aria-expanded','false');
        toggle.innerHTML = '<i class="chevron fa-solid fa-chevron-down" aria-hidden="true"></i>';
        li.firstElementChild.after(toggle);

        toggle.addEventListener('click', function(e){
          e.stopPropagation();
          const sub = li.querySelector('ul');
          if(sub){
            const open = sub.classList.toggle('open');
            toggle.classList.toggle('open', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
          }
        });
      }
    });
  }
  buildMobileNav();

  // Burger toggle
  burger.addEventListener('click', function(){
    const open = mobileNav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobileNav.setAttribute('aria-hidden', open ? 'false' : 'true');
  });

  // Desktop: click to toggle .open on li for accessibility on touch devices
  primaryNav.querySelectorAll('.nav-list > li > a').forEach(a=>{
    a.addEventListener('click', function(e){
      const li = a.parentElement;
      // prevent default if it has submenu
      if(li.querySelector('.submenu')){
        e.preventDefault();
        const isOpen = li.classList.toggle('open');
        // close others
        primaryNav.querySelectorAll('.nav-list > li').forEach(other=>{
          if(other!==li) other.classList.remove('open');
        });
        // update aria-expanded on all top-level links
        primaryNav.querySelectorAll('.nav-list > li > a').forEach(x=>{
          const px = x.parentElement;
          x.setAttribute('aria-expanded', px.classList.contains('open') ? 'true' : 'false');
        });
      } else {
        // mark active
        primaryNav.querySelectorAll('a.is-active').forEach(x=>x.classList.remove('is-active'));
        a.classList.add('is-active');
      }
    });
  });

  // Submenu keyboard and Escape handling
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      // close mobile and all open desktop dropdowns
      mobileNav.classList.remove('open');
      burger.setAttribute('aria-expanded','false');
      primaryNav.querySelectorAll('.nav-list > li.open').forEach(li=>li.classList.remove('open'));
    }
  });

  // Click outside closes open dropdowns (desktop)
  document.addEventListener('click', function(e){
    if(!primaryNav.contains(e.target)){
      primaryNav.querySelectorAll('.nav-list > li.open').forEach(li=>li.classList.remove('open'));
    }
    if(!mobileNav.contains(e.target) && !burger.contains(e.target)){
      // do not force close if clicking inside the header brand area
    }
  });

  // Scroll effect: add shrink when scrolled
  const shrinkThreshold = 20;
  function onScroll(){
    if(window.scrollY > shrinkThreshold){
      header.classList.add('shrink');
    } else {
      header.classList.remove('shrink');
    }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Accessibility: focus trapping minimal — focus main when menu closes for keyboard users
  burger.addEventListener('keydown', function(e){
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      burger.click();
    }
  });

  // Set ARIA attributes for desktop menu items that have submenus
  primaryNav.querySelectorAll('.nav-list > li').forEach(li=>{
    const link = li.querySelector('a');
    const submenu = li.querySelector('.submenu');
    if(submenu && link){
      link.setAttribute('aria-haspopup','true');
      link.setAttribute('aria-expanded','false');
      // ensure a visual chevron exists for desktop links
      if(!link.querySelector('.chevron')){
        const che = document.createElement('i');
        che.className = 'chevron fa-solid fa-chevron-down';
        che.setAttribute('aria-hidden','true');
        link.appendChild(che);
      }
      li.addEventListener('mouseenter', ()=>{ link.setAttribute('aria-expanded','true') });
      li.addEventListener('mouseleave', ()=>{ link.setAttribute('aria-expanded','false') });
    }
  });

})();
