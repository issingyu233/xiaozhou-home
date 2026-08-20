/* ===== 夏以昼喂养模拟器 ===== */

/* ---------- 像素图标 ---------- */
const ICONS = {
  heart:{p:{R:'#e0557a'},g:['.RR.RR.','RRRRRRR','RRRRRRR','.RRRRR.','..RRR..','...R...']},
  apple:{p:{R:'#e0557a',G:'#7aa84a',S:'#7a5030'},g:['...S..','..G...','.RRRR.','RRRRRR','RRRRRR','.RRRR.']},
  drop :{p:{B:'#5ab8e0',W:'#bfe8f6'},g:['...B..','..BWB.','.BWWBB','BWWBBB','BBBBBB','.BBBB.']},
  moon :{p:{Y:'#f2cf6a'},g:['..YYY.','.YY...','YY....','YY....','.YY...','..YYY.']},
  bolt :{p:{Y:'#f2b23a'},g:['...YY','..YY.','.YYYY','..YY.','.YY..','.Y...']},
  paw  :{p:{D:'#a06a44'},g:['D.D.D','D.D.D','.....','.DDD.','DDDDD']},
  coin :{p:{Y:'#f2c94a',O:'#c78a2a',W:'#ffe9a8'},g:['.OOO.','OWWYO','OWYYO','OYYYO','.OOO.']},
  hammer:{p:{D:'#6a4a30',G:'#b0895a'},g:['..GGG','.GGGG','DDG..','.DD..','DD...']},
  check:{p:{G:'#5aa050'},g:['....G','...GG','G.GG.','GGG..','.G...']},
  gem:{p:{P:'#a97bd6',W:'#e6d4f5'},g:['.WPPW.','WPPPPW','PPPPPP','.PPPP.','..PP..','...P..']},
  cart:{p:{D:'#7a4f2e',R:'#e0885a'},g:['R....','RDDDD','R.D.D','.DDD.','.D.D.']},
  home:{p:{R:'#d0785a',D:'#8a5a34'},g:['..R..','.RRR.','RRRRR','DD.DD','DD.DD']},
  cal:{p:{R:'#e0557a',W:'#fff',D:'#8a6a4a'},g:['R.R','WWW','WDW','WWW','WDW']},
  hanger:{p:{D:'#8a6a4a'},g:['..D..','.D.D.','D...D','DDDDD','.....']},
  person:{p:{B:'#7a5ec8',H:'#f6dcd2'},g:['.HH.','.HH.','BBBB','BBBB','B..B']},
  arwL:{p:{D:'#7a5a3a'},g:['..D','.D.','D..','.D.','..D']},
  arwR:{p:{D:'#7a5a3a'},g:['D..','.D.','..D','.D.','D..']},
};
function svgIcon(name,px){
  const ic=ICONS[name]; if(!ic) return '';
  const g=ic.g,h=g.length,w=g[0].length; let r='';
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const ch=g[y][x];const col=ic.p[ch];if(!col||ch==='.')continue;
    r+=`<rect x="${x}" y="${y}" width="1" height="1" fill="${col}"/>`;}
  return `<svg viewBox="0 0 ${w} ${h}" width="${px}" height="${Math.round(px*h/w)}">${r}</svg>`;
}
const NEED_ICON={mood:'heart',food:'apple',clean:'drop',energy:'bolt'};
function paintIcons(){
  document.querySelectorAll('[data-ico]').forEach(el=>{
    const key=el.dataset.ico; const name=NEED_ICON[key]||key;
    const big=el.closest('.cbtn')||el.closest('.tbtn');
    el.innerHTML=svgIcon(name,big?22:14);
  });
}

/* ---------- 数据 ---------- */
const CELL=20;
const FLOORS=[
  {id:'wood', img:'floor_wood.png',  name:'木地板'},
  {id:'brick',img:'floor_brick.png', name:'红砖'},
  {id:'stone',img:'floor_stone.png', name:'石板'},
  {id:'blue', img:'floor_blue.png',  name:'蓝瓷砖'},
  {id:'green',img:'floor_green.png', name:'绿瓷砖'},
];
const CATS=[{key:'furn',name:'家具'},{key:'deco',name:'装饰'},{key:'floor',name:'地板'}];
// 家具目录：cat=分类, flat=地毯(压底), price=0 为开局自带, >0 需在商店购买
const CATALOG=[
  // —— 开局自带 ——
  {id:'bed',      name:'蓝床',  cat:'furn', img:'cc_bed.png',        w:72, h:106, price:0,
    dirs:[{img:'cc_bed.png',w:72,h:106},{img:'cc_bed_h.png',w:104,h:72}]},
  {id:'nightstand',name:'床头柜',cat:'furn',img:'cc_nightstand.png', w:70, h:58,  price:0},
  {id:'lamp',     name:'台灯',  cat:'furn', img:'cc_lamp.png',       w:34, h:78,  price:0},
  {id:'bookshelf',name:'书架',  cat:'furn', img:'cc_bookshelf.png',  w:98, h:110, price:0},
  {id:'rug',      name:'蓝地毯',cat:'deco', img:'cc_rug.png',        w:130,h:82,  price:0, flat:true},
  {id:'plant',    name:'绿植',  cat:'deco', img:'cc_plant.png',      w:40, h:68,  price:0},
  {id:'window',   name:'窗户',  cat:'deco', img:'cc_window.png',     w:78, h:50,  price:0},
  {id:'picture',  name:'挂画',  cat:'deco', img:'cc_picture.png',    w:40, h:70,  price:0},
  // —— 商店购买 ——
  {id:'dresser',  name:'抽屉柜',cat:'furn', img:'cc_dresser.png',    w:84, h:112, price:50},
  {id:'wardrobe', name:'衣柜',  cat:'furn', img:'cc_wardrobe.png',   w:40, h:104, price:45},
  {id:'chair',    name:'木椅',  cat:'furn', img:'cc_chair.png',      w:40, h:98,  price:25},
  {id:'bed_green',name:'绿床',  cat:'furn', img:'cc_bed_green.png',  w:72, h:106, price:65,
    dirs:[{img:'cc_bed_green.png',w:72,h:106},{img:'cc_bed_green_h.png',w:104,h:72}]},
  {id:'bed_wood', name:'原木床',cat:'furn', img:'cc_bed_wood.png',   w:72, h:106, price:65,
    dirs:[{img:'cc_bed_wood.png',w:72,h:106},{img:'cc_bed_wood_h.png',w:104,h:72}]},
  // dirs 顺时针:前(下) → 右 → 后(上) → 左
  {id:'sofa_green',name:'绿沙发',cat:'furn',price:60,img:'cc_sofa_green_0.png',w:92,h:69,
    dirs:[{img:'cc_sofa_green_0.png',w:92,h:69},{img:'cc_sofa_green_3.png',w:51,h:106},{img:'cc_sofa_green_2.png',w:92,h:51},{img:'cc_sofa_green_1.png',w:51,h:106}]},
  {id:'sofa_brown',name:'棕沙发',cat:'furn',price:60,img:'cc_sofa_brown_0.png',w:92,h:69,
    dirs:[{img:'cc_sofa_brown_0.png',w:92,h:69},{img:'cc_sofa_brown_3.png',w:51,h:106},{img:'cc_sofa_brown_2.png',w:92,h:51},{img:'cc_sofa_brown_1.png',w:51,h:106}]},
  {id:'armchair', name:'单人沙发',cat:'furn',price:40,img:'cc_armchair_0.png',w:55,h:69,
    dirs:[{img:'cc_armchair_0.png',w:55,h:69},{img:'cc_armchair_3.png',w:51,h:69},{img:'cc_armchair_2.png',w:55,h:51},{img:'cc_armchair_1.png',w:51,h:69}]},
  {id:'table',    name:'餐桌',  cat:'furn', img:'cc_table.png',      w:100,h:64,  price:50},
  {id:'coffee',   name:'茶几',  cat:'furn', img:'cc_coffee.png',     w:100,h:64,  price:45},
  {id:'roundtable',name:'圆桌', cat:'furn', img:'cc_roundtable.png', w:76, h:71,  price:40},
  {id:'clothtable',name:'布艺桌',cat:'furn',img:'cc_clothtable.png', w:80, h:71,  price:55},
  {id:'fireplace',name:'壁炉',  cat:'deco', img:'cc_fireplace.png',  w:70, h:92,  price:80},
  {id:'rug_orange',name:'橙地毯',cat:'deco', img:'cc_rug_orange.png',w:130,h:82,  price:30, flat:true},
];
const CATMAP=Object.fromEntries(CATALOG.map(c=>[c.id,c]));
const STARTER_OWNED=CATALOG.filter(c=>c.price===0).map(c=>c.id);

/* ---------- 存档 ---------- */
const KEY='xiaozhou_home_v5';
let fresh=false;
let S=load();
function load(){
  try{const r=localStorage.getItem(KEY); if(r) return JSON.parse(r);}catch(e){}
  fresh=true;
  return { floor:0, coins:200, gems:5, owned:STARTER_OWNED.slice(), placed:[], pet:null, needs:{mood:70,food:60,clean:80,energy:75} };
}
function save(){ try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){} }
// 兼容旧存档：补上 owned（保留已摆放的家具）
if(!S.owned){ S.owned=[...new Set([...STARTER_OWNED, ...S.placed.map(p=>p.id)])]; }
if(S.gems==null) S.gems=5;

const room=document.getElementById('room');
const floorEl=document.getElementById('floor');
const petEl=document.getElementById('pet');
const sayEl=document.getElementById('say');
const selbar=document.getElementById('selbar');
let edit=false, selected=null;

function applyFloor(){
  floorEl.style.background=`url('${FLOORS[S.floor].img}') repeat`;
  floorEl.style.backgroundSize='40px 40px';
}

/* 开局样板间 */
function starterLayout(cw,ch){
  const put=(id,cx,cy)=>{ const c=CATMAP[id];
    return {id, x:Math.round(cx*cw-c.w/2), y:Math.round(cy*ch-c.h/2), f:0, r:0}; };
  return [
    put('rug',0.50,0.64), put('bed',0.74,0.50), put('nightstand',0.47,0.52),
    put('lamp',0.47,0.44), put('bookshelf',0.15,0.52), put('plant',0.90,0.64),
    put('window',0.34,0.16), put('picture',0.12,0.17),
  ];
}
function petDefault(cw,ch){ return {x:Math.round(cw/2-48), y:Math.round(ch*0.58)}; }

/* ---------- 家具渲染 ---------- */
function renderPlaced(){
  document.querySelectorAll('.furn').forEach(e=>e.remove());
  S.placed.forEach((it,idx)=>{
    const c=CATMAP[it.id]; if(!c) return;
    let img=c.img,w=c.w,h=c.h,rot=it.r||0;
    if(c.dirs){ const d=c.dirs[(it.dir||0)%c.dirs.length]; img=d.img; w=d.w; h=d.h; rot=0; } // 多方向:换朝向贴图
    const el=document.createElement('div'); el.className='furn'+(c.flat?' flat':''); el.dataset.idx=idx;
    el.style.width=w+'px'; el.style.height=h+'px';
    el.style.left=it.x+'px'; el.style.top=it.y+'px';
    el.style.transform=`rotate(${rot}deg) scaleX(${it.f?-1:1})`;
    const im=document.createElement('img'); im.src=img; el.appendChild(im);
    room.appendChild(el);
    makeDraggable(el,'furn');
  });
}
function makeDraggable(el,kind){
  let sx,sy,ox,oy,moved;
  el.addEventListener('pointerdown',e=>{
    if(!edit) return; e.preventDefault(); e.stopPropagation();
    if(kind==='furn') selectFurn(el); else selectPet();
    sx=e.clientX; sy=e.clientY; ox=parseInt(el.style.left); oy=parseInt(el.style.top); moved=false;
    hideSelbar();
    el.setPointerCapture(e.pointerId);
    const move=ev=>{ const dx=ev.clientX-sx, dy=ev.clientY-sy; if(Math.abs(dx)+Math.abs(dy)>3)moved=true;
      el.style.left=(ox+dx)+'px'; el.style.top=(oy+dy)+'px';
      if(kind!=='furn') positionSay(); };
    const up=()=>{ el.removeEventListener('pointermove',move); el.removeEventListener('pointerup',up);
      let nx=Math.round(parseInt(el.style.left)/CELL)*CELL;
      let ny=Math.round(parseInt(el.style.top)/CELL)*CELL;
      nx=Math.max(0,Math.min(room.clientWidth-el.offsetWidth,nx));
      ny=Math.max(room.clientHeight*0.05,Math.min(room.clientHeight-el.offsetHeight-14,ny));
      el.style.left=nx+'px'; el.style.top=ny+'px';
      if(kind==='furn'){ S.placed[el.dataset.idx].x=nx; S.placed[el.dataset.idx].y=ny; showSelbarFor(el); }
      else { S.pet={x:nx,y:ny}; positionSay(); }
      save();
    };
    el.addEventListener('pointermove',move); el.addEventListener('pointerup',up);
  });
}
function selectFurn(el){
  document.querySelectorAll('.furn').forEach(e=>e.classList.remove('sel'));
  petEl.classList.remove('sel');
  if(el){el.classList.add('sel'); selected=el;} else selected=null;
}
function selectPet(){ document.querySelectorAll('.furn').forEach(e=>e.classList.remove('sel'));
  selected=null; petEl.classList.add('sel'); hideSelbar(); }

/* 选中操作条 */
function showSelbarFor(el){
  const idx=+el.dataset.idx;
  const it=S.placed[idx]; const c=CATMAP[it.id];
  // 只有有多方向素材的家具才显示"旋转"
  const rotBtn=selbar.querySelector('[data-act="rot"]');
  rotBtn.style.display=(c&&c.dirs)?'':'none';
  selbar.style.display='flex';
  selbar.style.left=(parseInt(el.style.left)+el.offsetWidth/2)+'px';
  selbar.style.top=Math.max(2,parseInt(el.style.top)-34)+'px';
  selbar.dataset.idx=idx;
}
function hideSelbar(){ selbar.style.display='none'; }
selbar.querySelectorAll('.sb').forEach(b=>{
  b.onclick=()=>{
    const idx=+selbar.dataset.idx; const it=S.placed[idx]; if(!it) return;
    if(b.dataset.act==='flip') it.f=it.f?0:1;
    else if(b.dataset.act==='rot'){ const c=CATMAP[it.id];
      if(c&&c.dirs){ const od=c.dirs[(it.dir||0)%c.dirs.length]; const cx=it.x+od.w/2, cy=it.y+od.h/2;
        it.dir=((it.dir||0)+1)%c.dirs.length; const nd=c.dirs[it.dir];
        it.x=Math.round(cx-nd.w/2); it.y=Math.round(cy-nd.h/2); } // 换向保持中心不动
      else it.r=((it.r||0)+90)%360; }
    else if(b.dataset.act==='del'){ S.placed.splice(idx,1); save(); hideSelbar(); selectFurn(null); renderPlaced(); return; }
    save(); renderPlaced();
    const nel=document.querySelector(`.furn[data-idx="${idx}"]`);
    if(nel){ selectFurn(nel); showSelbarFor(nel); }
  };
});

/* ---------- 装修模式 ---------- */
function setEdit(on){
  edit=on;
  document.getElementById('grid').style.display=on?'block':'none';
  document.getElementById('tray').style.display=on?'flex':'none';
  document.getElementById('hint').style.display=on?'block':'none';
  document.getElementById('care').style.display=on?'none':'flex';
  document.getElementById('btnEdit').style.display=on?'none':'flex';
  document.getElementById('btnDone').style.display=on?'flex':'none';
  document.getElementById('btnShop').style.display=on?'none':'flex';
  document.getElementById('roomsel').style.display=on?'none':'flex';
  document.getElementById('nav').style.display=on?'none':'flex';
  document.getElementById('needs').style.display=on?'none':'flex';
  document.getElementById('topr').style.display=on?'none':'flex';
  if(!on){ selectFurn(null); petEl.classList.remove('sel'); hideSelbar(); }
  else { renderCats(); renderTray(); }
}
document.getElementById('btnEdit').onclick=()=>setEdit(true);
document.getElementById('btnDone').onclick=()=>setEdit(false);
/* 商店 */
const shopEl=document.getElementById('shop');
document.getElementById('btnShop').onclick=()=>openShop();
document.getElementById('shopClose').onclick=()=>closeShop();
function openShop(){ renderShop(); shopEl.style.display='flex'; }
function closeShop(){ shopEl.style.display='none'; }
function shopMsg(t){ const m=document.getElementById('shopmsg'); m.textContent=t; m.style.opacity=1; clearTimeout(shopMsg._t); shopMsg._t=setTimeout(()=>m.style.opacity=0,1600); }
function renderShop(){
  document.getElementById('shopCoin').textContent=S.coins;
  const box=document.getElementById('shopitems'); box.innerHTML='';
  CATALOG.filter(c=>c.price>0).forEach(c=>{
    const owned=S.owned.includes(c.id), can=S.coins>=c.price;
    const it=document.createElement('div'); it.className='sitem';
    it.innerHTML=`<div class="pic"><img src="${c.img}"></div><div class="nm">${c.name}</div>`+
      (owned?`<div class="price got">已拥有</div>`:`<div class="price${can?'':' no'}"><span class="ci"></span>${c.price}</div>`);
    const ci=it.querySelector('.ci'); if(ci) ci.innerHTML=svgIcon('coin',12);
    if(!owned) it.onclick=()=>buy(c.id);
    box.appendChild(it);
  });
}
function buy(id){
  const c=CATMAP[id]; if(!c||S.owned.includes(id)) return;
  if(S.coins<c.price){ shopMsg('金币不够啦~ 多陪陪小昼攒金币'); return; }
  S.coins-=c.price; S.owned.push(id); save(); renderShop(); renderNeeds();
  shopMsg('买到「'+c.name+'」啦！进装修就能摆上~');
}
document.getElementById('arwL').onclick=()=>bubble('厨房·浴室 之后解锁哦~');
document.getElementById('arwR').onclick=()=>bubble('厨房·浴室 之后解锁哦~');
document.querySelectorAll('#nav .n').forEach(n=>{ n.onclick=()=>{
  if(n.dataset.nav==='home') return;
  const txt={mood:'心情日历 之后做~',closet:'衣柜换装 之后做~',me:'个人页 之后做~'};
  bubble(txt[n.dataset.nav]||'之后做~'); }; });

/* 托盘：分类 + 内容 */
let curCat='furn';
function renderCats(){
  const cats=document.getElementById('cats'); cats.innerHTML='';
  CATS.forEach(ct=>{ const b=document.createElement('div'); b.className='cat'+(ct.key===curCat?' on':'');
    b.textContent=ct.name; b.onclick=()=>{curCat=ct.key; renderCats(); renderTray();}; cats.appendChild(b); });
}
function renderTray(){
  const box=document.getElementById('items'); box.innerHTML='';
  if(curCat==='floor'){
    FLOORS.forEach((fl,i)=>{ const it=document.createElement('div'); it.className='item floor'+(i===S.floor?' on':'');
      const sw=document.createElement('div'); sw.className='sw'; sw.style.background=`url('${fl.img}') repeat`; sw.style.backgroundSize='20px 20px';
      it.appendChild(sw); it.title=fl.name;
      it.onclick=()=>{ S.floor=i; applyFloor(); save(); renderTray(); bubble('换地板咯~'); };
      box.appendChild(it); });
  } else {
    const list=CATALOG.filter(c=>c.cat===curCat && S.owned.includes(c.id));
    if(!list.length){ const e=document.createElement('div'); e.style.cssText='color:#a58a5a;font-size:11px;padding:14px 8px;'; e.textContent='这类还没有家具，去商店买几件吧~'; box.appendChild(e); }
    list.forEach(c=>{ const it=document.createElement('div'); it.className='item';
      const img=document.createElement('img'); img.src=c.img; it.appendChild(img); it.title=c.name;
      it.onclick=()=>{ S.placed.push({id:c.id,
        x:Math.round((room.clientWidth-c.w)/2/CELL)*CELL, y:Math.round(room.clientHeight*0.42/CELL)*CELL, f:0,r:0});
        save(); renderPlaced(); bubble('放好啦，拖我摆位置~'); };
      box.appendChild(it); });
  }
}
room.addEventListener('pointerdown',e=>{ if(edit && !e.target.closest('.furn') && e.target!==petEl && !e.target.closest('#selbar')){ selectFurn(null); petEl.classList.remove('sel'); hideSelbar(); } });
selbar.addEventListener('pointerdown',e=>e.stopPropagation());

/* ---------- 照料 + 需求 ---------- */
function clampNeeds(){ for(const k in S.needs) S.needs[k]=Math.max(0,Math.min(100,S.needs[k])); }
function renderNeeds(){
  clampNeeds();
  document.querySelectorAll('[data-need]').forEach(i=>{
    const v=S.needs[i.dataset.need]; i.style.width=v+'%';
    i.style.background=v>=60?'linear-gradient(90deg,#8fd6a8,#57b07a)':v>=30?'linear-gradient(90deg,#f0c86a,#e0a94a)':'linear-gradient(90deg,#f0a0b0,#d0506a)';
  });
  document.getElementById('coinN').textContent=S.coins;
  const g=document.getElementById('gemN'); if(g) g.textContent=(S.gems||0);
}
const CARE_TXT={pet:['嘿嘿~','舒服…','再摸摸'],food:['谢谢~','好吃！','嗯！甜'],clean:['香香的~','搓搓澡','舒服'],energy:['困了…','晚安~','抱抱睡']};
document.querySelectorAll('[data-care]').forEach(b=>{
  b.onclick=()=>{ if(edit) return;
    const k=b.dataset.care; const map={pet:'mood',food:'food',clean:'clean',energy:'energy'};
    S.needs[map[k]]=Math.min(100,S.needs[map[k]]+18);
    if(k!=='pet') S.needs.mood=Math.min(100,S.needs.mood+6);
    S.coins+=1; save(); renderNeeds();
    const t=CARE_TXT[k]; bubble(t[Math.floor(Math.random()*t.length)]); petHop();
  };
});
petEl.addEventListener('click',e=>{ if(edit) return; S.needs.mood=Math.min(100,S.needs.mood+4); save(); renderNeeds(); bubble('妹妹~'); petHop(); });

/* ---------- 角色定位 ---------- */
function placePet(){
  if(!S.pet) S.pet=petDefault(room.clientWidth,room.clientHeight);
  petEl.style.left=S.pet.x+'px'; petEl.style.top=S.pet.y+'px';
  positionSay();
}
function positionSay(){ sayEl.style.left=(parseInt(petEl.style.left)+petEl.offsetWidth/2)+'px';
  sayEl.style.top=(parseInt(petEl.style.top)-38)+'px'; }
function bubble(t){ positionSay(); sayEl.textContent=t; sayEl.style.opacity=1;
  clearTimeout(bubble._t); bubble._t=setTimeout(()=>sayEl.style.opacity=0,1800); }
function petHop(){ petEl.style.animation='none';
  petEl.animate([{transform:'translateY(0)'},{transform:'translateY(-12px)'},{transform:'translateY(0)'}],{duration:340})
    .onfinish=()=>{ petEl.style.animation=''; }; }

/* 需求缓降 */
setInterval(()=>{ for(const k in S.needs) S.needs[k]=Math.max(0,S.needs[k]-1); save(); renderNeeds(); }, 20000);

/* ---------- 启动 ---------- */
paintIcons();
applyFloor();
if(fresh){ S.placed=starterLayout(room.clientWidth,room.clientHeight); S.pet=petDefault(room.clientWidth,room.clientHeight); save(); }
renderPlaced();
makeDraggable(petEl,'pet');
placePet();
renderNeeds();
setTimeout(()=>bubble('妹妹，你回来啦~'),700);
