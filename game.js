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
  brush:{p:{D:'#6a4a30',B:'#7ab0d0'},g:['....D','...DD','..DD.','BDD..','BB...']},
  check:{p:{G:'#5aa050'},g:['....G','...GG','G.GG.','GGG..','.G...']},
  gear :{p:{D:'#8a6a4a'},g:['.D.D.','DDDDD','.DDD.','DDDDD','.D.D.']},
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
    const key=el.dataset.ico;
    const name=NEED_ICON[key]||key;
    const big=el.closest('.cbtn')||el.closest('.tbtn');
    el.innerHTML=svgIcon(name,big?22:14);
  });
}

/* ---------- 数据 ---------- */
const CELL=44;
const FLOORS=['floor_wood.png','floor_2.png'];
// 家具目录：id,名字,图,显示宽高
const CATALOG=[
  {id:'bed',     name:'小床', img:'bed_obj_6.png', w:130,h:70},
  {id:'wardrobe',name:'柜子', img:'bed_obj_0.png', w:92, h:70},
  {id:'table',   name:'桌子', img:'bed_obj_7.png', w:64, h:78},
  {id:'bath',    name:'浴桶', img:'bed_obj_9.png', w:92, h:50},
  {id:'shelf',   name:'书架', img:'plant_0.png',   w:74, h:84},
  {id:'lowshelf',name:'矮柜', img:'plant_2.png',   w:92, h:74},
  {id:'plant',   name:'绿植', img:'plant_4.png',   w:34, h:78},
];
const CATMAP=Object.fromEntries(CATALOG.map(c=>[c.id,c]));

/* ---------- 存档 ---------- */
const KEY='xiaozhu_home_v2';
let S=load();
function load(){
  try{const r=localStorage.getItem(KEY); if(r) return JSON.parse(r);}catch(e){}
  return { floor:0, coins:120, placed:[], needs:{mood:70,food:60,clean:80,energy:75} };
}
function save(){ try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){} }

/* ---------- 元素 ---------- */
const room=document.getElementById('room');
const floorEl=document.getElementById('floor');
const petEl=document.getElementById('pet');
const sayEl=document.getElementById('say');
let edit=false, selected=null;

function applyFloor(){
  floorEl.style.background=`url('${FLOORS[S.floor]}') repeat`;
  floorEl.style.backgroundSize='40px 40px';
}

/* ---------- 家具 ---------- */
function renderPlaced(){
  document.querySelectorAll('.furn').forEach(e=>e.remove());
  S.placed.forEach((f,idx)=>{
    const c=CATMAP[f.id]; if(!c) return;
    const el=document.createElement('div'); el.className='furn'; el.dataset.idx=idx;
    el.style.width=c.w+'px'; el.style.height=c.h+'px';
    el.style.left=f.x+'px'; el.style.top=f.y+'px';
    const img=document.createElement('img'); img.src=c.img; el.appendChild(img);
    room.appendChild(el);
    makeDraggable(el);
  });
}
function makeDraggable(el){
  let sx,sy,ox,oy;
  el.addEventListener('pointerdown',e=>{
    if(!edit) return; e.preventDefault();
    selectFurn(el);
    sx=e.clientX; sy=e.clientY; ox=parseInt(el.style.left); oy=parseInt(el.style.top);
    el.setPointerCapture(e.pointerId);
    const move=ev=>{ const dx=ev.clientX-sx, dy=ev.clientY-sy;
      el.style.left=(ox+dx)+'px'; el.style.top=(oy+dy)+'px'; };
    const up=()=>{ el.removeEventListener('pointermove',move); el.removeEventListener('pointerup',up);
      let nx=Math.round(parseInt(el.style.left)/CELL)*CELL;
      let ny=Math.round(parseInt(el.style.top)/CELL)*CELL;
      nx=Math.max(0,Math.min(room.clientWidth-el.offsetWidth,nx));
      ny=Math.max(room.clientHeight*0.30,Math.min(room.clientHeight-el.offsetHeight-24,ny));
      el.style.left=nx+'px'; el.style.top=ny+'px';
      S.placed[el.dataset.idx].x=nx; S.placed[el.dataset.idx].y=ny; save();
    };
    el.addEventListener('pointermove',move); el.addEventListener('pointerup',up);
  });
}
function selectFurn(el){
  document.querySelectorAll('.furn').forEach(e=>e.classList.remove('sel'));
  if(el){el.classList.add('sel'); selected=el;} else selected=null;
}

/* ---------- 装修模式 ---------- */
function setEdit(on){
  edit=on;
  document.getElementById('grid').style.display=on?'block':'none';
  document.getElementById('tray').style.display=on?'flex':'none';
  document.getElementById('editbar').style.display=on?'flex':'none';
  document.getElementById('hint').style.display=on?'block':'none';
  document.getElementById('care').style.display=on?'none':'flex';
  document.getElementById('btnEdit').style.display=on?'none':'flex';
  if(!on) selectFurn(null);
}
document.getElementById('btnEdit').onclick=()=>setEdit(true);
document.getElementById('btnDone').onclick=()=>setEdit(false);
document.getElementById('btnFloor').onclick=()=>{ S.floor=(S.floor+1)%FLOORS.length; applyFloor(); save(); };

/* 托盘 */
const tray=document.getElementById('tray');
CATALOG.forEach(c=>{
  const it=document.createElement('div'); it.className='item'; it.title=c.name;
  const img=document.createElement('img'); img.src=c.img; it.appendChild(img);
  it.onclick=()=>{
    S.placed.push({id:c.id,
      x:Math.round((room.clientWidth-c.w)/2/CELL)*CELL,
      y:Math.round(room.clientHeight*0.42/CELL)*CELL});
    save(); renderPlaced(); bubble('放好啦，拖我到喜欢的位置~');
  };
  tray.appendChild(it);
});
room.addEventListener('pointerdown',e=>{ if(edit && !e.target.closest('.furn')) selectFurn(null); });
document.addEventListener('dblclick',e=>{ const f=e.target.closest('.furn');
  if(edit&&f){ S.placed.splice(f.dataset.idx,1); save(); renderPlaced(); } });

/* ---------- 照料 + 需求 ---------- */
function clampNeeds(){ for(const k in S.needs) S.needs[k]=Math.max(0,Math.min(100,S.needs[k])); }
function renderNeeds(){
  clampNeeds();
  document.querySelectorAll('[data-need]').forEach(i=>{
    const v=S.needs[i.dataset.need]; i.style.width=v+'%';
    i.style.background=v>=60?'linear-gradient(90deg,#8fd6a8,#57b07a)'
      :v>=30?'linear-gradient(90deg,#f0c86a,#e0a94a)'
      :'linear-gradient(90deg,#f0a0b0,#d0506a)';
  });
  document.getElementById('coinN').textContent=S.coins;
}
const CARE_TXT={pet:['嘿嘿~','舒服…','再摸摸'],food:['谢谢~','好吃！','嗯！甜'],
  clean:['香香的~','搓搓澡','舒服'],energy:['困了…','晚安~','抱抱睡']};
document.querySelectorAll('[data-care]').forEach(b=>{
  b.onclick=()=>{
    const k=b.dataset.care;
    const map={pet:'mood',food:'food',clean:'clean',energy:'energy'};
    S.needs[map[k]]=Math.min(100,S.needs[map[k]]+18);
    if(k!=='pet') S.needs.mood=Math.min(100,S.needs.mood+6);
    S.coins+=1; save(); renderNeeds();
    const t=CARE_TXT[k]; bubble(t[Math.floor(Math.random()*t.length)]);
    petHop();
  };
});
petEl.onclick=()=>{ S.needs.mood=Math.min(100,S.needs.mood+4); save(); renderNeeds(); bubble('妹妹~'); petHop(); };

function bubble(t){
  sayEl.textContent=t;
  sayEl.style.top=(petEl.offsetTop-40)+'px';
  sayEl.style.opacity=1;
  clearTimeout(bubble._t); bubble._t=setTimeout(()=>sayEl.style.opacity=0,1800);
}
function petHop(){
  petEl.style.animation='none';
  petEl.animate([
    {transform:'translateX(-50%) translateY(0)'},
    {transform:'translateX(-50%) translateY(-12px)'},
    {transform:'translateX(-50%) translateY(0)'}],{duration:340})
    .onfinish=()=>{ petEl.style.animation=''; };
}

/* 需求缓降 */
setInterval(()=>{ for(const k in S.needs) S.needs[k]=Math.max(0,S.needs[k]-1); save(); renderNeeds(); }, 20000);

/* ---------- 启动 ---------- */
paintIcons();
applyFloor();
renderPlaced();
renderNeeds();
setTimeout(()=>bubble('妹妹，你回来啦~'),700);
