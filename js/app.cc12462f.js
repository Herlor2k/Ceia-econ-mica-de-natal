// Scripts da página de vendas (carregados com defer)
(function(){
  var sec=document.querySelector('.virada'),bg=sec&&sec.querySelector('.virada-bg');if(!bg||!('IntersectionObserver' in window))return;
  var vis=false,tick=false;
  function upd(){tick=false;if(!vis)return;var r=sec.getBoundingClientRect(),vh=window.innerHeight;
    var range=vh/2+r.height/2,prog=(r.top+r.height/2-vh/2)/range;prog=Math.max(-1,Math.min(1,prog));
    bg.style.transform='translate3d(0,'+(-prog*r.height*0.28)+'px,0)';}
  function onS(){if(vis&&!tick){tick=true;requestAnimationFrame(upd);}}
  new IntersectionObserver(function(es){vis=es[0].isIntersecting;onS();}).observe(sec);
  window.addEventListener('scroll',onS,{passive:true});window.addEventListener('resize',onS);
})();

(function(){var fundo=document.getElementById('oferta'),abrir=document.getElementById('abrir-oferta'),fechar=document.getElementById('fechar-oferta'),ultimo=null;
function open(e){e.preventDefault();ultimo=document.activeElement;fundo.hidden=false;document.body.style.overflow='hidden';fundo.querySelector('.oferta-sim').focus();}
function close(){fundo.hidden=true;document.body.style.overflow='';if(ultimo)ultimo.focus();}
abrir.addEventListener('click',open);fechar.addEventListener('click',close);
fundo.addEventListener('click',function(e){if(e.target===fundo)close();});
document.addEventListener('keydown',function(e){if(!fundo.hidden&&e.key==='Escape')close();});})();

(function(){
  var aberto=null, ultimo=null, zoom=document.getElementById('am-zoom');
  function abrir(id){ultimo=document.activeElement;aberto=document.getElementById(id);aberto.hidden=false;aberto.querySelector('.am-caixa').scrollTop=0;document.body.style.overflow='hidden';aberto.querySelector('.am-fechar').focus();
    if(window.fbq) fbq('trackCustom','VerBonus',{bonus:id});
    if(window.clarity) clarity('event','VerBonus '+id);}
  function fechar(){if(!aberto)return;aberto.hidden=true;aberto=null;document.body.style.overflow='';if(ultimo)ultimo.focus();}
  document.querySelectorAll('[data-amostra]').forEach(function(el){
    el.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();abrir(el.getAttribute('data-amostra'));});
  });
  document.querySelectorAll('.am-fundo').forEach(function(f){
    f.addEventListener('click',function(e){if(e.target===f)fechar();});
    f.querySelector('.am-fechar').addEventListener('click',fechar);
    f.querySelector('.am-voltar').addEventListener('click',fechar);
  });
  document.querySelectorAll('.am-pg').forEach(function(b){
    b.addEventListener('click',function(){var i=b.querySelector('img');zoom.querySelector('img').src=i.src;zoom.querySelector('img').alt=i.alt;zoom.hidden=false;});
  });
  function fecharZoom(){zoom.hidden=true;}
  zoom.addEventListener('click',fecharZoom);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){if(!zoom.hidden)fecharZoom();else fechar();}});
})();

(function(){
  var el=document.getElementById('contador-natal'); if(!el) return;
  var d=document.getElementById('cd-d'),h=document.getElementById('cd-h'),m=document.getElementById('cd-m'),s=document.getElementById('cd-s');
  function alvo(){var n=new Date(),y=n.getFullYear();var t=new Date(y,11,25,0,0,0);if(n>=new Date(y,11,26))t=new Date(y+1,11,25);return t;}
  function dois(x){return (x<10?'0':'')+x;}
  function tick(){
    var n=new Date(),t=alvo(),r=t-n;
    if(r<=0){el.querySelector('.cd-titulo').textContent='Feliz Natal!';d.textContent=h.textContent=m.textContent=s.textContent='00';return;}
    var sec=Math.floor(r/1000);
    d.textContent=Math.floor(sec/86400);h.textContent=dois(Math.floor(sec%86400/3600));m.textContent=dois(Math.floor(sec%3600/60));s.textContent=dois(sec%60);
  }
  tick(); setInterval(tick,1000);
})();

(function(){
  var planos={
    'https://pay.wiapy.com/6aebb363605b6cd0b4100cb9':{plano:'Completo',valor:47.90},
    'https://pay.wiapy.com/6aebb460639b7ecda68b6876':{plano:'Completo oferta pop-up',valor:37.00},
    'https://pay.wiapy.com/X79lQo-CNcrL':{plano:'Essencial',valor:19.90}
  };
  document.querySelectorAll('a[href*="wiapy"]').forEach(function(a){
    a.addEventListener('click',function(e){
      // O botão "Quero o plano Essencial" da página abre o pop-up; não é ida ao checkout
      if(a.id==='abrir-oferta'){
        if(window.fbq) fbq('trackCustom','AbriuPopupOferta');
        if(window.clarity) clarity('event','AbriuPopupOferta');
        return;
      }
      var info=planos[a.href]||{plano:'Desconhecido',valor:0};
      if(window.fbq) fbq('trackCustom','CliqueComprar',{plano:info.plano,value:info.valor,currency:'BRL'});
      if(window.clarity) clarity('event','CliqueComprar '+info.plano);
      // Espera um instante para o evento ser enviado antes de sair da página
      if(e.ctrlKey||e.metaKey||e.shiftKey||e.button!==0) return;
      e.preventDefault();
      var destino=a.href,inicio=Date.now();
      if(window.carregarRastreio) window.carregarRastreio();
      (function ir(){
        // espera o Pixel carregar (no máximo 1,5 s) e mais 0,3 s para o evento ser enviado
        if(window.__pixelPronto||Date.now()-inicio>1500){setTimeout(function(){window.location.href=destino;},300);}
        else setTimeout(ir,100);
      })();
    });
  });
})();

// Leitor da amostra (19 páginas + página final)
(function(){
  var L=document.getElementById('leitor');if(!L)return;
  var T=L.querySelector('.lt-trilho'),pgs=T.children,n=pgs.length,cont=L.querySelector('.lt-cont'),
      ant=L.querySelector('.lt-ant'),prox=L.querySelector('.lt-prox'),bz=L.querySelector('.lt-zoom'),
      atual=0,ultimo=null,viuFim=false,tick=false,abriu=false;
  function track(e){if(window.fbq)fbq('trackCustom',e);if(window.clarity)clarity('event',e);}
  function semZoom(){var z=T.querySelector('.lt-pg.zoom');if(z){z.classList.remove('zoom');z.scrollTop=z.scrollLeft=0;}T.classList.remove('travado');bz.setAttribute('aria-pressed','false');}
  function upd(){tick=false;var i=Math.round(T.scrollLeft/Math.max(1,T.clientWidth));
    if(i!==atual){semZoom();atual=i;}
    cont.textContent=(i+1)+' / '+n;ant.disabled=i===0;prox.disabled=i===n-1;bz.style.visibility=i===n-1?'hidden':'visible';
    if(i===n-1&&!viuFim){viuFim=true;track('AmostraFim');}}
  function ir(i){i=Math.max(0,Math.min(n-1,i));semZoom();T.scrollTo({left:i*T.clientWidth,behavior:'smooth'});}
  function zoom(on,x,y){var pg=pgs[atual];if(!pg||pg.classList.contains('lt-pg-fim'))return;
    if(on===undefined)on=!pg.classList.contains('zoom');
    if(!on){semZoom();return;}
    var r=pg.getBoundingClientRect(),fx=x==null?.5:(x-r.left)/r.width,fy=y==null?.3:(y-r.top)/r.height;
    pg.classList.add('zoom');T.classList.add('travado');bz.setAttribute('aria-pressed','true');
    requestAnimationFrame(function(){pg.scrollLeft=fx*pg.scrollWidth-pg.clientWidth/2;pg.scrollTop=fy*pg.scrollHeight-pg.clientHeight/2;});}
  function abrir(){ultimo=document.activeElement;L.hidden=false;document.body.style.overflow='hidden';
    T.scrollLeft=0;atual=0;semZoom();upd();L.querySelector('.lt-fechar').focus();
    if(!abriu){abriu=true;track('AbriuAmostra');}}
  function fechar(){semZoom();L.hidden=true;document.body.style.overflow='';if(ultimo&&ultimo.focus)ultimo.focus();}
  document.querySelectorAll('[data-leitor]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();abrir();});});
  L.querySelector('.lt-fechar').addEventListener('click',fechar);
  ant.addEventListener('click',function(){ir(atual-1);});
  prox.addEventListener('click',function(){ir(atual+1);});
  bz.addEventListener('click',function(){zoom();});
  T.addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(upd);}},{passive:true});
  window.addEventListener('resize',function(){if(!L.hidden)T.scrollLeft=atual*T.clientWidth;});
  // toque duplo / clique duplo para ampliar
  var ultToque=0;
  T.addEventListener('touchend',function(e){if(e.touches.length)return;var t=Date.now(),c=e.changedTouches[0];
    if(t-ultToque<300&&e.target.tagName==='IMG'){e.preventDefault();zoom(undefined,c.clientX,c.clientY);ultToque=0;}else ultToque=t;});
  T.addEventListener('dblclick',function(e){if(e.target.tagName==='IMG')zoom(undefined,e.clientX,e.clientY);});
  document.addEventListener('keydown',function(e){if(L.hidden)return;
    if(e.key==='Escape'){e.stopImmediatePropagation();fechar();}else if(e.key==='ArrowRight')ir(atual+1);else if(e.key==='ArrowLeft')ir(atual-1);},true);
})();
