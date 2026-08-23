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
  book:{p:{B:'#b57a42',W:'#fff3d8',R:'#d76a5a'},g:['BWWWB','BWWWB','BWRWB','BWWWB','BBBBB']},
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

/* ---------- 心情表情（像素脸） ---------- */
const MOOD_META=[
  {name:'难过',  col:'#86a6c4', pale:'#dce7f1'},
  {name:'低落',  col:'#9fb59b', pale:'#e3ebdf'},
  {name:'一般',  col:'#e6b850', pale:'#f6ead0'},
  {name:'开心',  col:'#f0a35e', pale:'#f9e2cd'},
  {name:'超开心',col:'#ef8878', pale:'#f9dcd6'},
];
// 暖色可爱表情（矢量），每张脸的五官（眼/嘴/腮红/眼泪/闪光）
const MOOD_SVG=[
  /*0 难过*/`<path d="M6.8 9.5 L10 8.4" stroke="#5a4636" stroke-width=".9" stroke-linecap="round"/><path d="M17.2 9.5 L14 8.4" stroke="#5a4636" stroke-width=".9" stroke-linecap="round"/><circle cx="8.6" cy="11.2" r="1.25" fill="#5a4636"/><circle cx="15.4" cy="11.2" r="1.25" fill="#5a4636"/><path d="M9 16.4 Q12 14 15 16.4" fill="none" stroke="#7a4a3a" stroke-width="1.2" stroke-linecap="round"/><path d="M16.1 12.6 q1 1.6 0 2.6 q-1 -1 0 -2.6 z" fill="#7fb8e6"/>`,
  /*1 低落*/`<path d="M7.3 11 h2.4" stroke="#5a4636" stroke-width="1.35" stroke-linecap="round"/><path d="M14.3 11 h2.4" stroke="#5a4636" stroke-width="1.35" stroke-linecap="round"/><path d="M9.8 15.7 Q12 14.4 14.2 15.7" fill="none" stroke="#7a4a3a" stroke-width="1.1" stroke-linecap="round"/>`,
  /*2 一般*/`<circle cx="8.6" cy="11.2" r="1.3" fill="#5a4636"/><circle cx="15.4" cy="11.2" r="1.3" fill="#5a4636"/><path d="M9.6 15.3 h4.8" stroke="#7a4a3a" stroke-width="1.2" stroke-linecap="round"/>`,
  /*3 开心*/`<circle cx="6.7" cy="13.5" r="1.5" fill="#f5a89e" opacity=".8"/><circle cx="17.3" cy="13.5" r="1.5" fill="#f5a89e" opacity=".8"/><circle cx="8.6" cy="11.1" r="1.3" fill="#5a4636"/><circle cx="15.4" cy="11.1" r="1.3" fill="#5a4636"/><path d="M8.6 14.2 Q12 18 15.4 14.2" fill="none" stroke="#7a4a3a" stroke-width="1.3" stroke-linecap="round"/>`,
  /*4 超开心*/`<circle cx="6.4" cy="13.6" r="1.9" fill="#f5a89e" opacity=".85"/><circle cx="17.6" cy="13.6" r="1.9" fill="#f5a89e" opacity=".85"/><path d="M6.9 11.7 Q8.6 9.6 10.3 11.7" fill="none" stroke="#5a4636" stroke-width="1.25" stroke-linecap="round"/><path d="M13.7 11.7 Q15.4 9.6 17.1 11.7" fill="none" stroke="#5a4636" stroke-width="1.25" stroke-linecap="round"/><path d="M8.4 14 Q12 18.8 15.6 14 Z" fill="#b95f50"/><path d="M10.3 16.4 Q12 18 13.7 16.4 Z" fill="#f0a0a0"/><circle cx="4.5" cy="6.2" r=".85" fill="#f8d98f"/><circle cx="19.5" cy="6.2" r=".85" fill="#f8d98f"/>`,
];
function moodFace(level,px){
  const m=MOOD_META[level]; if(!m) return '';
  return `<svg viewBox="0 0 24 24" width="${px}" height="${px}" style="display:block;shape-rendering:geometricPrecision">`
    +`<circle cx="12" cy="12" r="11" fill="${m.pale}"/>`
    +`<circle cx="12" cy="12" r="9" fill="#fff2d8" stroke="#e7c99b" stroke-width="1"/>`
    +MOOD_SVG[level]+`</svg>`;
}

/* ---------- 衣柜饰品（头顶小配饰，像素） ---------- */
// top=饰品在头部的纵向位置(占贴图高度%)，size=显示宽(px)
const ACC=[
  {key:'none',  name:'不戴',   art:null},
  {key:'bow',   name:'蝴蝶结', top:9,  size:34, p:{P:'#f3a3b5',D:'#d97a90'},
    g:['P.....P','PP...PP','PPPDPPP','PP...PP','P.....P']},
  {key:'flower',name:'小红花', top:7,  size:30, p:{R:'#e8687a',Y:'#f5c95a',G:'#7aa84a'},
    g:['.R.R.','RRRRR','.RYR.','RRRRR','.R.R.']},
  {key:'crown', name:'小皇冠', top:5,  size:36, p:{Y:'#f2c94a',R:'#e0557a'},
    g:['Y.Y.Y','YYYYY','YRYRY','YYYYY']},
  {key:'beret', name:'贝雷帽', top:4,  size:38, p:{B:'#c97a86',N:'#8a5a3a'},
    g:['..N..','.BBB.','BBBBB','BBBBB']},
  {key:'star',  name:'星星夹', top:8,  size:28, p:{Y:'#f5c95a'},
    g:['..Y..','YYYYY','.YYY.','YY.YY']},
];
const ACCMAP=Object.fromEntries(ACC.map(a=>[a.key,a]));
function accSvg(key,px){
  const a=ACCMAP[key]; if(!a||!a.g) return '';
  const h=a.g.length,w=a.g[0].length; let r='';
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const ch=a.g[y][x];const c=a.p[ch];if(!c||ch==='.')continue;
    r+=`<rect x="${x}" y="${y}" width="1" height="1" fill="${c}"/>`;}
  return `<svg viewBox="0 0 ${w} ${h}" width="${px||a.size}" height="${Math.round((px||a.size)*h/w)}" style="display:block;filter:drop-shadow(0 1px 0 rgba(80,55,30,.18))">${r}</svg>`;
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
  // —— 追加一批 ——
  {id:'bed_cream',name:'米床',  cat:'furn', img:'cc_bed_cream.png', w:72, h:106, price:65,
    dirs:[{img:'cc_bed_cream.png',w:72,h:106},{img:'cc_bed_cream_h.png',w:104,h:72}]},
  {id:'cabinet',  name:'高柜',  cat:'furn', img:'cc_cabinet.png',   w:40, h:104, price:45},
  {id:'shelf2',   name:'置物架',cat:'furn', img:'cc_shelf2.png',    w:92, h:104, price:50},
  {id:'dtable',   name:'方桌',  cat:'furn', img:'cc_dtable.png',    w:76, h:71,  price:40},
  {id:'floorlamp',name:'落地灯',cat:'furn', img:'cc_floorlamp.png', w:34, h:78,  price:35},
  {id:'toilet',   name:'马桶',  cat:'furn', img:'cc_toilet.png',    w:34, h:88,  price:30},
  {id:'bathtub',  name:'浴缸',  cat:'furn', img:'cc_bathtub.png',   w:120,h:70,  price:70},
  {id:'sink',     name:'洗手台',cat:'furn', img:'cc_sink.png',      w:56, h:80,  price:35},
  {id:'mirror',   name:'穿衣镜',cat:'deco', img:'cc_mirror.png',    w:30, h:75,  price:35},
  {id:'picture2', name:'相框',  cat:'deco', img:'cc_picture2.png',  w:30, h:52,  price:20},
  {id:'window2',  name:'木窗',  cat:'deco', img:'cc_window2.png',   w:67, h:43,  price:30},
  {id:'bathmat',  name:'地垫',  cat:'deco', img:'cc_bathmat.png',   w:40, h:46,  price:15, flat:true},
  {id:'rug_blue', name:'蓝地毯',cat:'deco', img:'cc_rug_blue.png',  w:100,h:50,  price:30, flat:true},
  {id:'rug_green',name:'绿地毯',cat:'deco', img:'cc_rug_green.png', w:100,h:50,  price:30, flat:true},
];
const CATMAP=Object.fromEntries(CATALOG.map(c=>[c.id,c]));
const STARTER_OWNED=CATALOG.filter(c=>c.price===0).map(c=>c.id);

/* 房间 */
const ROOMS=[
  {key:'bedroom', name:'卧室',icon:'🛏',wall:'cc_wall.png'},
  {key:'living',  name:'客厅',icon:'🛋',wall:'cc_wall2.png'},
  {key:'bathroom',name:'浴室',icon:'🛁',wall:'cc_bathwall.png'},
];
const ROOMMAP=Object.fromEntries(ROOMS.map(r=>[r.key,r]));

/* ---------- 存档 ---------- */
const KEY='xiaozhou_home_v5';
let fresh=false;
let S=load();
function load(){
  try{const r=localStorage.getItem(KEY); if(r) return JSON.parse(r);}catch(e){}
  fresh=true;
  return { room:'bedroom', rooms:{}, coins:200, gems:5, owned:STARTER_OWNED.slice(), needs:{mood:70,food:60,clean:80,energy:75} };
}
function save(){ try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){} }
// 兼容旧存档
if(!S.owned){ S.owned=[...new Set([...STARTER_OWNED, ...((S.placed||[]).map(p=>p.id))])]; }
if(S.gems==null) S.gems=5;
if(!S.rooms){ S.rooms={ bedroom:{floor:S.floor||0, placed:S.placed||[], pet:S.pet||null} }; delete S.floor; delete S.placed; delete S.pet; }
if(!S.room) S.room='bedroom';
if(!S.moods) S.moods={};   // { 'YYYY-MM-DD': {v:0-4, m:是否手动} }
if(!S.outfit) S.outfit='none';   // 头顶饰品
if(S.intimacy==null) S.intimacy=0;   // 亲密度
if(S.stage==null) S.stage=0;         // 记录上次的成长阶段，用于检测升级

/* ---------- 成长阶段 ---------- */
// 小昼随亲密度 + 累计陪伴天数成长；同一张贴图，靠缩放表现从幼到长大
const STAGES=[
  {key:'baby', name:'幼崽', spr:'🌱', grow:0.82, min:0},
  {key:'teen', name:'少年', spr:'🌿', grow:1.0,  min:80},
  {key:'youth',name:'青年', spr:'🌸', grow:1.14, min:260},
];
function daysCount(){ return Object.keys(S.moods).length || 1; }
function growthPoints(){ return (S.intimacy||0) + daysCount()*15; }
function stageIndex(){ const gp=growthPoints(); let i=0;
  for(let k=0;k<STAGES.length;k++){ if(gp>=STAGES[k].min) i=k; } return i; }
function addIntimacy(n){ S.intimacy=(S.intimacy||0)+n; }

/* ---------- 心情记录 ---------- */
function dateKey(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function todayKey(){ return dateKey(new Date()); }
if(!S.startDate) S.startDate=todayKey();
function computeMoodLevel(){ const n=S.needs; const s=(n.mood*2+n.food+n.clean+n.energy)/5;
  return s>=85?4:s>=68?3:s>=48?2:s>=28?1:0; }
// 当天若非手动设定，则按需求自动刷新
function recordTodayMood(){ const k=todayKey(); const r=S.moods[k];
  if(r&&r.m) return; S.moods[k]={v:computeMoodLevel(), m:false}; }
function moodStreak(){ let n=0; const d=new Date();
  while(S.moods[dateKey(d)]){ n++; d.setDate(d.getDate()-1); } return n; }

const room=document.getElementById('room');
const floorEl=document.getElementById('floor');
const petEl=document.getElementById('pet');
const sayEl=document.getElementById('say');
const selbar=document.getElementById('selbar');
const wallEl=document.getElementById('wall');
const growthEl=document.getElementById('growth');
let edit=false, selected=null;

/* 当前房间 */
function cur(){ if(!S.rooms[S.room]) S.rooms[S.room]=initRoom(S.room); return S.rooms[S.room]; }
function applyFloor(){
  floorEl.style.background=`url('${FLOORS[cur().floor].img}') repeat`;
  floorEl.style.backgroundSize='40px 40px';
}
function applyRoom(){
  const rm=ROOMMAP[S.room];
  wallEl.style.background=`url('${rm.wall}') repeat`; wallEl.style.backgroundSize='27px auto';
  applyFloor();
  const tag=document.getElementById('roomName'); if(tag) tag.textContent=rm.icon+' '+rm.name;
}
function switchRoom(d){ if(edit) return;
  const i=ROOMS.findIndex(r=>r.key===S.room); S.room=ROOMS[(i+d+ROOMS.length)%ROOMS.length].key; save();
  hideSelbar(); applyRoom(); renderPlaced(); placePet(); bubble('来到'+ROOMMAP[S.room].name+'~');
}

/* 开局布置 */
function put(id,cx,cy,cw,ch){ const c=CATMAP[id]; return {id, x:Math.round(cx*cw-c.w/2), y:Math.round(cy*ch-c.h/2), f:0, r:0, dir:0}; }
function bedroomStarter(cw,ch){ return [
  put('rug',0.50,0.64,cw,ch), put('bed',0.74,0.50,cw,ch), put('nightstand',0.47,0.52,cw,ch),
  put('lamp',0.47,0.44,cw,ch), put('bookshelf',0.15,0.52,cw,ch), put('plant',0.90,0.64,cw,ch),
  put('window',0.34,0.16,cw,ch), put('picture',0.12,0.17,cw,ch),
]; }
function livingStarter(cw,ch){ return [
  put('rug_orange',0.50,0.66,cw,ch), put('sofa_green',0.34,0.46,cw,ch), put('coffee',0.50,0.60,cw,ch),
  put('armchair',0.80,0.52,cw,ch), put('fireplace',0.16,0.40,cw,ch), put('plant',0.90,0.72,cw,ch),
]; }
function bathroomStarter(cw,ch){ return [
  put('bathmat',0.46,0.74,cw,ch), put('bathtub',0.24,0.52,cw,ch), put('toilet',0.55,0.56,cw,ch),
  put('sink',0.76,0.52,cw,ch), put('mirror',0.76,0.27,cw,ch), put('plant',0.92,0.70,cw,ch),
]; }
function initRoom(key){
  const cw=room.clientWidth, ch=room.clientHeight;
  if(key==='living'){ ['sofa_green','coffee','rug_orange','armchair','fireplace'].forEach(id=>{ if(!S.owned.includes(id)) S.owned.push(id); });
    return {floor:0, placed:livingStarter(cw,ch), pet:petDefault(cw,ch)}; }
  if(key==='bathroom'){ ['bathtub','sink','toilet','mirror','bathmat'].forEach(id=>{ if(!S.owned.includes(id)) S.owned.push(id); });
    return {floor:3, placed:bathroomStarter(cw,ch), pet:petDefault(cw,ch)}; }  // floor 3 = 蓝瓷砖
  return {floor:0, placed:bedroomStarter(cw,ch), pet:petDefault(cw,ch)};
}
function petDefault(cw,ch){ return {x:Math.round(cw/2-48), y:Math.round(ch*0.58)}; }

/* ---------- 家具渲染 ---------- */
function renderPlaced(){
  document.querySelectorAll('.furn').forEach(e=>e.remove());
  cur().placed.forEach((it,idx)=>{
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
      if(kind==='furn'){ cur().placed[el.dataset.idx].x=nx; cur().placed[el.dataset.idx].y=ny; showSelbarFor(el); }
      else { cur().pet={x:nx,y:ny}; positionSay(); }
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
  const it=cur().placed[idx]; const c=CATMAP[it.id];
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
    const idx=+selbar.dataset.idx; const it=cur().placed[idx]; if(!it) return;
    if(b.dataset.act==='flip') it.f=it.f?0:1;
    else if(b.dataset.act==='rot'){ const c=CATMAP[it.id];
      if(c&&c.dirs){ const od=c.dirs[(it.dir||0)%c.dirs.length]; const cx=it.x+od.w/2, cy=it.y+od.h/2;
        it.dir=((it.dir||0)+1)%c.dirs.length; const nd=c.dirs[it.dir];
        it.x=Math.round(cx-nd.w/2); it.y=Math.round(cy-nd.h/2); } // 换向保持中心不动
      else it.r=((it.r||0)+90)%360; }
    else if(b.dataset.act==='del'){ cur().placed.splice(idx,1); save(); hideSelbar(); selectFurn(null); renderPlaced(); return; }
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
  growthEl.style.display=on?'none':'flex';
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
document.getElementById('arwL').onclick=()=>switchRoom(-1);
document.getElementById('arwR').onclick=()=>switchRoom(1);
function setNav(key){ document.querySelectorAll('#nav .n').forEach(n=>n.classList.toggle('on',n.dataset.nav===key)); }
document.querySelectorAll('#nav .n').forEach(n=>{ n.onclick=()=>{
  const k=n.dataset.nav;
  if(k==='mood'){ openMood(); return; }
  closeMood();
  if(k==='closet'){ openCloset(); return; }
  closeCloset();
  if(k==='home'){ setNav('home'); return; }
  setNav('home');
  bubble('个人页 之后做~'); }; });

/* ---------- 衣柜换装 ---------- */
const closetPage=document.getElementById('closet');
function openCloset(){ if(edit) setEdit(false); setNav('closet'); closetPage.style.display='flex'; renderCloset(); }
function closeCloset(){ if(closetPage) closetPage.style.display='none'; }
function renderCloset(){
  const box=document.getElementById('closetItems'); box.innerHTML='';
  ACC.forEach(a=>{ const it=document.createElement('div'); it.className='citem'+(a.key===S.outfit?' on':'');
    it.innerHTML='<div class="cpic">'+(a.g?accSvg(a.key,Math.min(a.size,34)):'<span class="cnone">∅</span>')+'</div><div class="cnm">'+a.name+'</div>';
    it.onclick=()=>{ S.outfit=a.key; save(); renderOutfit(); renderCloset();
      bubble(a.g?('戴上「'+a.name+'」啦~'):'摘下来啦~'); };
    box.appendChild(it); });
}
document.getElementById('closetClose').onclick=()=>{ closeCloset(); setNav('home'); };

/* ---------- 心情日历页 ---------- */
const moodPage=document.getElementById('moodpage');
let moodView=null; // {y, m(0-11)}
function thisMonth(){ const d=new Date(); return {y:d.getFullYear(), m:d.getMonth()}; }
function openMood(){ if(edit) setEdit(false); recordTodayMood(); save();
  moodView=thisMonth(); setNav('mood'); moodPage.style.display='flex'; renderMood(); }
function closeMood(){ closePicker(); moodPage.style.display='none'; }
document.getElementById('moodClose').onclick=()=>{ closeMood(); setNav('home'); };
document.getElementById('moodPrev').onclick=()=>{ moodView.m--; if(moodView.m<0){moodView.m=11;moodView.y--;} renderMood(); };
document.getElementById('moodNext').onclick=()=>{ const t=thisMonth();
  if(moodView.y>t.y||(moodView.y===t.y&&moodView.m>=t.m)) return;
  moodView.m++; if(moodView.m>11){moodView.m=0;moodView.y++;} renderMood(); };
function renderMood(){
  const t=thisMonth();
  document.getElementById('moodMon').textContent=moodView.y+' 年 '+(moodView.m+1)+' 月';
  const nextBtn=document.getElementById('moodNext');
  nextBtn.classList.toggle('off', moodView.y>t.y||(moodView.y===t.y&&moodView.m>=t.m));
  const grid=document.getElementById('moodGrid'); grid.innerHTML='';
  const first=new Date(moodView.y,moodView.m,1);
  const lead=(first.getDay()+6)%7;               // 周一为首列
  const days=new Date(moodView.y,moodView.m+1,1); days.setDate(0); const total=days.getDate();
  const tk=todayKey();
  const today0=new Date(); today0.setHours(0,0,0,0);
  for(let i=0;i<lead;i++){ const b=document.createElement('div'); b.className='mcell empty'; grid.appendChild(b); }
  let sum=0,cnt=0;
  for(let day=1;day<=total;day++){
    const cd=new Date(moodView.y,moodView.m,day); cd.setHours(0,0,0,0);
    const k=dateKey(cd); const rec=S.moods[k]; const isToday=k===tk;
    const editable=cd.getTime()<=today0.getTime();
    const cell=document.createElement('div');
    cell.className='mcell'+(rec?' has':' blank')+(isToday?' today':'')+(editable?' pick':'');
    if(rec){ cell.innerHTML=moodFace(rec.v,26)+'<span class="dn">'+day+'</span>'+(rec.note?'<span class="ndot"></span>':'');
      cell.style.background=MOOD_META[rec.v].pale; cell.style.borderColor=MOOD_META[rec.v].col;
      sum+=rec.v; cnt++; }
    else { cell.innerHTML='<span class="dn">'+day+'</span>'; }
    if(editable){ cell.onclick=()=>openPicker(k,(moodView.m+1)+'月'+day+'日',isToday); }
    grid.appendChild(cell);
  }
  const avg=cnt?Math.round(sum/cnt):2;
  document.getElementById('moodFoot').innerHTML=
    '本月记录 '+cnt+' 天 · 连续陪伴 '+moodStreak()+' 天<br>平均心情：'+MOOD_META[avg].name+'（点任意日期写心情和日记）';
}

/* ---------- 日记编辑器（选心情 + 写一句话） ---------- */
let pickEl=null, pickKey=null, pickV=2, pickToday=false;
function buildPicker(){
  pickEl=document.createElement('div'); pickEl.id='moodPick';
  pickEl.innerHTML='<div class="pkcard">'
    +'<div class="pkttl"><span id="pkDate"></span><button id="pkClose">✕</button></div>'
    +'<div class="pklab">今天心情</div>'
    +'<div class="pkrow"></div>'
    +'<div class="pklab">写点什么</div>'
    +'<textarea id="pkNote" maxlength="140" placeholder="今天和小昼发生了什么呀…"></textarea>'
    +'<div class="pkbtns"><button id="pkClear">清除这天</button><button id="pkSave">保存</button></div>'
    +'</div>';
  document.querySelector('.mbox').appendChild(pickEl);
  const row=pickEl.querySelector('.pkrow');
  MOOD_META.forEach((m,i)=>{ const b=document.createElement('div'); b.className='pkface';
    b.innerHTML=moodFace(i,42)+'<span>'+m.name+'</span>';
    b.onclick=()=>{ pickV=i; pickEl.querySelectorAll('.pkface').forEach((f,j)=>f.classList.toggle('on',j===i)); };
    row.appendChild(b); });
  pickEl.querySelector('#pkClose').onclick=closePicker;
  pickEl.addEventListener('click',e=>{ if(e.target===pickEl) closePicker(); });
  pickEl.querySelector('#pkSave').onclick=()=>{ const note=pickEl.querySelector('#pkNote').value.trim();
    S.moods[pickKey]={v:pickV, m:true, note:note}; save(); closePicker(); renderMood();
    if(pickToday) bubble(note?'今天的日记记好啦~':'今天心情：'+MOOD_META[pickV].name+'~'); };
  pickEl.querySelector('#pkClear').onclick=()=>{ if(!pickToday){ delete S.moods[pickKey]; }
    else { S.moods[pickKey]={v:computeMoodLevel(),m:false}; }
    save(); closePicker(); renderMood(); };
}
function openPicker(key,label,isToday){
  if(!pickEl) buildPicker();
  pickKey=key; pickToday=isToday;
  const rec=S.moods[key];
  pickV=rec?rec.v:computeMoodLevel();
  pickEl.querySelector('#pkDate').textContent=label;
  pickEl.querySelector('#pkNote').value=(rec&&rec.note)||'';
  pickEl.querySelector('#pkClear').textContent=isToday?'恢复自动':'清除这天';
  pickEl.querySelectorAll('.pkface').forEach((f,i)=>f.classList.toggle('on',i===pickV));
  pickEl.style.display='flex';
}
function closePicker(){ if(pickEl) pickEl.style.display='none'; }

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
    FLOORS.forEach((fl,i)=>{ const it=document.createElement('div'); it.className='item floor'+(i===cur().floor?' on':'');
      const sw=document.createElement('div'); sw.className='sw'; sw.style.background=`url('${fl.img}') repeat`; sw.style.backgroundSize='20px 20px';
      it.appendChild(sw); it.title=fl.name;
      it.onclick=()=>{ cur().floor=i; applyFloor(); save(); renderTray(); bubble('换地板咯~'); };
      box.appendChild(it); });
  } else {
    const list=CATALOG.filter(c=>c.cat===curCat && S.owned.includes(c.id));
    if(!list.length){ const e=document.createElement('div'); e.style.cssText='color:#a58a5a;font-size:11px;padding:14px 8px;'; e.textContent='这类还没有家具，去商店买几件吧~'; box.appendChild(e); }
    list.forEach(c=>{ const it=document.createElement('div'); it.className='item';
      const img=document.createElement('img'); img.src=c.img; it.appendChild(img); it.title=c.name;
      it.onclick=()=>{ cur().placed.push({id:c.id,
        x:Math.round((room.clientWidth-c.w)/2/CELL)*CELL, y:Math.round(room.clientHeight*0.42/CELL)*CELL, f:0,r:0,dir:0});
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
    if(k==='clean' && S.room!=='bathroom'){          // 洗澡要去浴室
      S.room='bathroom'; save(); hideSelbar(); applyRoom(); renderPlaced(); placePet();
      bubble('去浴室洗香香~');
    }
    S.needs[map[k]]=Math.min(100,S.needs[map[k]]+18);
    if(k!=='pet') S.needs.mood=Math.min(100,S.needs.mood+6);
    S.coins+=1; addIntimacy(4); recordTodayMood(); save(); renderNeeds();
    const up=checkStageUp();
    if(!up){ const t=CARE_TXT[k]; bubble(t[Math.floor(Math.random()*t.length)]); petHop(); }
  };
});
petEl.addEventListener('click',e=>{ if(edit) return; S.needs.mood=Math.min(100,S.needs.mood+4); addIntimacy(1); save(); renderNeeds();
  if(!checkStageUp()){ bubble('妹妹~'); petHop(); } });
// 点徽章看看成长进度
if(growthEl) growthEl.addEventListener('click',()=>{ if(edit) return; const idx=stageIndex(); const next=STAGES[idx+1];
  bubble(next?('陪小昼一起长大~ 距「'+next.name+'」还差 '+Math.max(1,next.min-growthPoints())+' 亲密度'):'小昼已经长成青年啦，谢谢你的陪伴~'); });

/* ---------- 角色定位 ---------- */
/* 头顶饰品叠加层：与角色同位、同缩放、同漂浮 */
const petAcc=document.createElement('div'); petAcc.id='petAcc'; room.appendChild(petAcc);
function syncAcc(){ petAcc.style.left=petEl.style.left; petAcc.style.top=petEl.style.top;
  petAcc.style.width=petEl.offsetWidth+'px'; petAcc.style.height=petEl.offsetHeight+'px'; }
function renderOutfit(){
  const a=ACCMAP[S.outfit]||ACCMAP.none;
  if(!a.g){ petAcc.innerHTML=''; petAcc.style.display='none'; return; }
  petAcc.style.display='block';
  petAcc.innerHTML='<span class="accItem" style="top:'+a.top+'%">'+accSvg(a.key)+'</span>';
  syncAcc();
}
function placePet(){
  if(!cur().pet) cur().pet=petDefault(room.clientWidth,room.clientHeight);
  petEl.style.left=cur().pet.x+'px'; petEl.style.top=cur().pet.y+'px';
  positionSay(); syncAcc();
}
function positionSay(){ sayEl.style.left=(parseInt(petEl.style.left)+petEl.offsetWidth/2)+'px';
  sayEl.style.top=(parseInt(petEl.style.top)-38)+'px'; syncAcc(); }
function bubble(t){ positionSay(); sayEl.textContent=t; sayEl.style.opacity=1;
  clearTimeout(bubble._t); bubble._t=setTimeout(()=>sayEl.style.opacity=0,1800); }
function petHop(){ const g=STAGES[stageIndex()].grow; petEl.style.animation='none';
  petEl.animate([{transform:`translateY(0) scale(${g})`},{transform:`translateY(-12px) scale(${g})`},{transform:`translateY(0) scale(${g})`}],{duration:340})
    .onfinish=()=>{ petEl.style.animation=''; }; }

/* ---------- 成长表现 + 徽章 ---------- */
function applyGrowth(){
  const idx=stageIndex(); const st=STAGES[idx];
  petEl.style.setProperty('--grow', st.grow);          // 缩放整张贴图（不拆层）
  if(typeof petAcc!=='undefined'){ petAcc.style.setProperty('--grow', st.grow); syncAcc(); }
  if(growthEl){
    growthEl.querySelector('.gspr').textContent=st.spr;
    growthEl.querySelector('.gname').textContent=st.name;
    const gp=growthPoints(); const next=STAGES[idx+1];
    const isMax=!next; growthEl.classList.toggle('max',isMax);
    let frac=1;
    if(next){ frac=(gp-st.min)/(next.min-st.min); frac=Math.max(0.04,Math.min(1,frac)); }
    growthEl.querySelector('.gbar i').style.width=Math.round(frac*100)+'%';
  }
}
// 检测升级：陪伴让小昼长大了
function checkStageUp(silent){
  const idx=stageIndex();
  if(idx>(S.stage||0)){ S.stage=idx; save(); applyGrowth();
    if(!silent){ petHop(); setTimeout(()=>bubble('小昼长大啦，现在是'+STAGES[idx].name+'~'),120); }
    return true;
  }
  S.stage=idx; applyGrowth(); return false;
}

/* 需求缓降 */
setInterval(()=>{ for(const k in S.needs) S.needs[k]=Math.max(0,S.needs[k]-1); recordTodayMood(); save(); renderNeeds(); }, 20000);

/* ---------- 启动 ---------- */
paintIcons();
cur();          // 确保当前房间已初始化
applyRoom();
save();
renderPlaced();
makeDraggable(petEl,'pet');
placePet();
renderNeeds();
recordTodayMood(); save();
checkStageUp(true);   // 应用当前成长阶段的缩放与徽章（启动不弹升级提示）
renderOutfit();       // 戴上已选的头顶饰品
setTimeout(()=>bubble('妹妹，你回来啦~'),700);
