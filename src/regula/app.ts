// @ts-nocheck
/*
 * Regula Vitae — app pessoal de hábitos.
 * Toda a interface é montada por mountRegula() dentro de um elemento raiz.
 * Dados: tabelas do Lovable Cloud (settings, daily_checkins, workouts, stretch_sessions,
 * books, reading_sessions, weights, confessions, tasks), protegidas por RLS (cada usuário vê só o seu).
 * Seções abaixo: animação dos exercícios · helpers · store (Supabase) · Hoje · Treino · Leitura ·
 * check-in · alongamento · tarefas · Saúde · loop.
 */
import { MARKUP } from "./markup";

export type RegulaContext = {
  supabase: any;
  userId: string;
  firstName?: string;
  onSignOut: () => void;
};

export function mountRegula(root: HTMLElement, ctx: RegulaContext): () => void {
root.innerHTML = MARKUP;
const AC = new AbortController();
let alive = true, rafId = 0, lastColors = 0;

const UA=26, FA=24, TH=32, SH=32, FLOOR=140;

// ---------- Exercises (side view, floor y=140, figure faces right) ----------
const EX = {
  pushup:{name:"Flexão de braço", cue:"Corpo reto da cabeça ao calcanhar, desça o peito até perto do chão.",
    tips:["Mãos um pouco mais abertas que os ombros.","Cotovelos a ~45° do corpo, não abertos em T.","Contraia glúteo e abdômen para o quadril não cair."],
    avoid:"Quadril caído ou empinado. Se não conseguir 6 reps boas, apoie os joelhos.",
    prop:"mat", guide:["sh","fN"], elbow:1, knee:-1,
    frames:[{sh:[162,96],hip:[114,116],hN:[162,140],fN:[55,139]},{sh:[164,125],hip:[112,132],hN:[162,140],fN:[55,139]}],
    seq:[0,1], move:1.1, hold:.35},
  pike:{name:"Pike push-up", cue:"Quadril alto em V invertido; leve a cabeça em direção ao chão entre as mãos.",
    tips:["Mãos na largura dos ombros, quadril bem alto.","Desça a cabeça à frente das mãos, formando um triângulo.","Empurre o chão até estender os braços."],
    avoid:"Deixar o quadril baixar e virar uma flexão comum. Não precisa encostar a cabeça no chão.",
    prop:"mat", elbow:-1, knee:-1,
    frames:[{sh:[137,111],hip:[92,85],hN:[182,140],fN:[60,139]},{sh:[156,124],hip:[95,89],hN:[182,140],fN:[60,139]}],
    seq:[0,1], move:1.2, hold:.35},
  plank:{name:"Prancha", cue:"Antebraços no chão, cotovelos sob os ombros, corpo em linha reta.",
    tips:["Cotovelos exatamente sob os ombros.","Aperte glúteos e empurre o chão com os antebraços.","Respire curto e contínuo, sem prender o ar."],
    avoid:"Quadril alto ou lombar afundando. Se tremer demais, apoie os joelhos.",
    prop:"mat", guide:["sh","fN"], elbow:1, knee:-1,
    frames:[{sh:[165,113],hip:[108,126],hN:[190,140],fN:[48,139]},{sh:[165,111],hip:[108,124],hN:[190,140],fN:[48,139]}],
    seq:[0,1], move:1.6, hold:.2},
  deadbug:{name:"Dead bug", cue:"Lombar colada no chão; estenda braço e perna opostos devagar.",
    tips:["Comece com braços para o teto e joelhos a 90°.","Estenda braço e perna opostos sem deixar a lombar descolar.","Volte ao centro e troque de lado."],
    avoid:"Arquear a lombar. Se acontecer, não estenda tanto a perna.",
    prop:"mat", elbow:1, knee:1,
    frames:[
      {sh:[170,131],hip:[120,131],hN:[171,83],hF:[169,83],fN:[88,100],fF:[88,100]},
      {sh:[170,131],hip:[120,131],hN:[216,124],hF:[169,83],fN:[88,100],fF:[58,124]},
      {sh:[170,131],hip:[120,131],hN:[171,83],hF:[216,124],fN:[58,124],fF:[88,100]}],
    seq:[0,1,0,2], move:1.2, hold:.4},
  row:{name:"Remada com toalha", cue:"Toalha presa na maçaneta, corpo inclinado para trás; puxe o peito até as mãos.",
    tips:["Pés perto da porta: quanto mais perto, mais difícil.","Corpo rígido como uma prancha, puxe com as costas.","Aperte as escápulas no fim do movimento."],
    avoid:"Porta destrancada ou maçaneta frouxa. Tranque a porta e teste antes.",
    prop:"door", towel:true, elbow:1, knee:-1,
    frames:[{sh:[129,35],hip:[151,82],hN:[176,52],fN:[178,138],toe:[189,140]},{sh:[155,27],hip:[166,79],hN:[178,44],fN:[178,138],toe:[189,140]}],
    seq:[0,1], move:1.1, hold:.4},
  superman:{name:"Superman", cue:"De bruços, eleve braços, peito e pernas juntos e segure 2 s.",
    tips:["Olhe para o chão, pescoço neutro.","Eleve só alguns centímetros: amplitude pequena basta.","Contraia glúteos para subir as pernas."],
    avoid:"Jogar a cabeça para trás ou dar tranco para subir.",
    prop:"mat", elbow:1, knee:-1,
    frames:[{sh:[165,132],hip:[115,132],hN:[212,134],fN:[52,136]},{sh:[165,124],hip:[115,133],hN:[210,112],fN:[56,120]}],
    seq:[0,1], move:1, hold:.8},
  birddog:{name:"Bird-dog", cue:"Em quatro apoios, estenda braço e perna opostos na linha do corpo.",
    tips:["Mãos sob os ombros, joelhos sob o quadril.","Estenda até a altura do tronco, sem subir além.","Imagine um copo d'água nas costas que não pode cair."],
    avoid:"Girar o quadril para o lado ao estender a perna. Com o joelho operado apoiado, use uma almofada embaixo.",
    prop:"mat", elbow:1, knee:-1,
    frames:[
      {sh:[160,92],hip:[110,96],hN:[160,140],hF:[160,140],fN:[78,139],fF:[78,139]},
      {sh:[160,92],hip:[110,96],hN:[209,86],hF:[160,140],fN:[78,139],fF:[48,92]},
      {sh:[160,92],hip:[110,96],hN:[160,140],hF:[209,86],fN:[48,92],fF:[78,139]}],
    seq:[0,1,0,2], move:1.1, hold:.6},
  shtap:{name:"Prancha com toque no ombro", cue:"Prancha alta; toque o ombro oposto sem balançar o quadril.",
    tips:["Pés um pouco afastados dão mais estabilidade.","Toque devagar, alternando os lados.","Quadril parado: é aí que está o exercício."],
    avoid:"Balançar o quadril de um lado para o outro. Afaste mais os pés se precisar.",
    prop:"mat", guide:["sh","fN"], elbow:1, knee:-1,
    frames:[
      {sh:[162,96],hip:[114,116],hN:[162,140],hF:[162,140],fN:[55,139]},
      {sh:[162,96],hip:[114,116],hN:[166,100],hF:[162,140],fN:[55,139]},
      {sh:[162,96],hip:[114,116],hN:[162,140],hF:[166,100],fN:[55,139]}],
    seq:[0,1,0,2], move:.8, hold:.35},
  bridge:{name:"Ponte de glúteo", cue:"Deitado, pés apoiados; suba o quadril até alinhar ombros, quadril e joelhos.",
    tips:["Pés na largura do quadril, perto do bumbum.","Empurre pelos calcanhares e aperte os glúteos no topo.","Segure 2 s em cima e desça devagar."],
    avoid:"Sentir mais o posterior da coxa que o glúteo: aproxime os pés. Pare se puxar na região do enxerto.",
    prop:"mat", guide:["sh","kneeN"], elbow:1, knee:1,
    frames:[{sh:[170,132],hip:[125,133],hN:[122,139],fN:[92,139]},{sh:[170,132],hip:[132,114],hN:[124,139],fN:[92,139]}],
    seq:[0,1], move:1.1, hold:.8},
  calf:{name:"Elevação de panturrilha", cue:"Mãos na parede, suba na ponta dos pés e desça devagar.",
    tips:["Peso distribuído nos dois pés.","Suba o máximo que conseguir, segure 1 s.","Desça em 2 s, sem deixar o calcanhar bater."],
    avoid:"Travar os joelhos com força ou jogar o peso para uma perna só.",
    prop:"wall", elbow:1, knee:-1,
    frames:[{sh:[130,24],hip:[130,76],hN:[175,50],fN:[130,138],toe:[141,140]},{sh:[132,15],hip:[132,67],hN:[175,46],fN:[134,129],toe:[142,140]}],
    seq:[0,1], move:.9, hold:.5},
  abd:{name:"Abdução de quadril deitado", cue:"Deitado de lado, suba a perna de cima levemente para trás.",
    tips:["Corpo em linha, quadril empilhado (um sobre o outro).","Ponta do pé levemente para baixo.","Suba até ~40° e desça sem encostar."],
    avoid:"Rolar o quadril para trás ou dobrar o joelho de cima.",
    prop:"mat", elbow:1, knee:-1,
    frames:[{sh:[165,124],hip:[115,128],hN:[122,121],hF:[213,129],fN:[52,130],fF:[52,135]},{sh:[165,124],hip:[115,128],hN:[122,121],hF:[213,129],fN:[62,90],fF:[52,135]}],
    seq:[0,1], move:1, hold:.5},
  sideplank:{name:"Prancha lateral", cue:"Antebraço sob o ombro, quadril alto, corpo em linha. 20 s de cada lado.",
    tips:["Cotovelo exatamente sob o ombro.","Empurre o quadril para cima e segure.","Versão fácil: joelhos dobrados e apoiados."],
    avoid:"Quadril caindo em direção ao chão. Troque de lado na metade do tempo.",
    prop:"mat", guide:["sh","fN"], elbow:1, knee:-1,
    frames:[{sh:[168,110],hip:[114,124],hN:[124,120],hF:[186,140],fN:[60,138]},{sh:[168,112],hip:[114,129],hN:[124,125],hF:[186,140],fN:[60,138]}],
    seq:[0,0,1,0], move:1.2, hold:.3}
};
// Every day is full body: push · pull · leg (no squat) · core
const WORKOUTS = {
  A:{title:"Full body A", ex:["pushup","row","bridge","deadbug"], reps:[["10","reps"],["12","reps"],["12","reps"],["8","por lado"]]},
  B:{title:"Full body B", ex:["pike","superman","calf","birddog"], reps:[["8","reps"],["10","reps"],["15","reps"],["8","por lado"]]},
  C:{title:"Full body C", ex:["shtap","row","abd","plank"], reps:[["10","por lado"],["12","reps"],["12","por lado"],["30","segundos"]]}
};
const TAGS=["Empurrar","Puxar","Perna","Core"];
// Monday..Sunday
const ROT = ["A","B","C","A","B","C","D7"];
const DAYN = ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"];

// ---------- Geometry ----------
function ik(a,b,L1,L2,sign){
  const dx=b[0]-a[0], dy=b[1]-a[1], d=Math.hypot(dx,dy);
  if(d<0.5) return [a[0],a[1]+L1];
  const ux=dx/d, uy=dy/d;
  if(d>=(L1+L2)*0.93){ const t=L1/(L1+L2)*d; return [a[0]+ux*t,a[1]+uy*t]; }
  const along=(L1*L1+d*d-L2*L2)/(2*d);
  const h=Math.sqrt(Math.max(0,L1*L1-along*along));
  return [a[0]+ux*along+(-uy)*sign*h, a[1]+uy*along+ux*sign*h];
}
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
function lerpP(p,q,t){ return [p[0]+(q[0]-p[0])*t, p[1]+(q[1]-p[1])*t]; }
function full(f){ return {sh:f.sh,hip:f.hip,hN:f.hN,hF:f.hF||f.hN,fN:f.fN,fF:f.fF||f.fN,toe:f.toe||null,arch:f.arch||0,hd:f.hd||[0,0]}; }
function poseAt(ex,time){
  const seg=ex.move+ex.hold, n=ex.seq.length, cyc=seg*n;
  let t=((time%cyc)+cyc)%cyc; const i=Math.floor(t/seg); const local=t-i*seg;
  const a=full(ex.frames[ex.seq[i]]), b=full(ex.frames[ex.seq[(i+1)%n]]);
  const k=local<ex.move?ease(local/ex.move):1;
  const out={};
  for(const key of ["sh","hip","hN","hF","fN","fF"]) out[key]=lerpP(a[key],b[key],k);
  if(a.toe&&b.toe) out.toe=lerpP(a.toe,b.toe,k);
  out.arch=a.arch+(b.arch-a.arch)*k; out.hd=lerpP(a.hd,b.hd,k);
  return out;
}

// ---------- Colors ----------
let C={};
function readColors(){
  const s=getComputedStyle(root);
  for(const k of ["fig","fig-far","floor","prop","accent","muted","surface2","rest"]) C[k]=s.getPropertyValue("--"+k).trim();
}
readColors();
const mq=matchMedia("(prefers-color-scheme: dark)"); mq.addEventListener("change",readColors,{signal:AC.signal});

// ---------- Drawing ----------
function draw(ctx,cv,ex,time){
  const dpr=window.devicePixelRatio||1, w=cv.clientWidth;
  if(!w) return;
  const W=Math.round(w*dpr), H=Math.round(w*170/260*dpr);
  if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H;}
  ctx.setTransform(1,0,0,1,0,0); ctx.clearRect(0,0,W,H);
  const s=W/260; ctx.setTransform(s,0,0,s,0,12*s);
  ctx.lineCap="round"; ctx.lineJoin="round";
  // props
  if(ex.prop==="mat"){ ctx.fillStyle=C.prop; ctx.fillRect(28,FLOOR,204,4); }
  if(ex.prop==="door"){ ctx.fillStyle=C.prop; ctx.fillRect(194,-8,10,FLOOR+8); ctx.fillStyle=C.muted; ctx.beginPath(); ctx.arc(191,56,3,0,7); ctx.fill(); }
  if(ex.prop==="wall"){ ctx.fillStyle=C.prop; ctx.fillRect(180,-8,10,FLOOR+8); }
  if(ex.prop==="jamb"){ ctx.fillStyle=C.prop; ctx.fillRect(112,-12,9,FLOOR+12); }
  ctx.strokeStyle=C.floor; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(8,FLOOR+.5); ctx.lineTo(252,FLOOR+.5); ctx.stroke();
  const p=poseAt(ex,time);
  const eN=ik(p.sh,p.hN,UA,FA,ex.elbow), eF=ik(p.sh,p.hF,UA,FA,ex.elbowF!==undefined?ex.elbowF:ex.elbow);
  const kN=ik(p.hip,p.fN,TH,SH,ex.knee), kF=ik(p.hip,p.fF,TH,SH,ex.kneeF!==undefined?ex.kneeF:ex.knee);
  const dx=p.sh[0]-p.hip[0], dy=p.sh[1]-p.hip[1], dl=Math.hypot(dx,dy)||1;
  const neck=[p.sh[0]+dx/dl*4,p.sh[1]+dy/dl*4], head=[p.sh[0]+dx/dl*14+(p.hd?p.hd[0]:0),p.sh[1]+dy/dl*14+(p.hd?p.hd[1]:0)];
  // guide
  if(ex.guide){
    const pts={sh:head,fN:p.fN,kneeN:kN};
    const a=ex.guide[0]==="sh"?head:pts[ex.guide[0]], b=pts[ex.guide[1]];
    ctx.save(); ctx.setLineDash([3,5]); ctx.strokeStyle=C.accent; ctx.globalAlpha=.45; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(a[0],a[1]); ctx.lineTo(b[0],b[1]); ctx.stroke(); ctx.restore();
  }
  // towel
  if(ex.strap){ ctx.strokeStyle=C.rest; ctx.lineWidth=2.5; ctx.beginPath(); ctx.moveTo(p.hN[0],p.hN[1]); ctx.lineTo(p.fN[0],p.fN[1]); ctx.stroke(); }
  if(ex.towel){ ctx.strokeStyle=C.rest; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(p.hN[0],p.hN[1]); ctx.lineTo(191,56); ctx.stroke(); }
  const limb=(a,b,c,col,wd)=>{ctx.strokeStyle=col;ctx.lineWidth=wd;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.lineTo(c[0],c[1]);ctx.stroke();};
  // far side
  limb(p.hip,kF,p.fF,C["fig-far"],6.5);
  limb(p.sh,eF,p.hF,C["fig-far"],5.5);
  // torso
  ctx.strokeStyle=C.fig; ctx.lineWidth=9; ctx.beginPath(); ctx.moveTo(p.hip[0],p.hip[1]);
  if(p.arch){ const nx=dy/dl, ny=-dx/dl; ctx.quadraticCurveTo((p.hip[0]+neck[0])/2+nx*p.arch*2,(p.hip[1]+neck[1])/2+ny*p.arch*2,neck[0],neck[1]); } else ctx.lineTo(neck[0],neck[1]);
  ctx.stroke();
  // near leg + foot
  limb(p.hip,kN,p.fN,C.fig,6.5);
  if(p.toe){ ctx.lineWidth=5; ctx.beginPath(); ctx.moveTo(p.fN[0],p.fN[1]); ctx.lineTo(p.toe[0],p.toe[1]); ctx.stroke(); }
  // near arm
  limb(p.sh,eN,p.hN,C.fig,5.5);
  // head
  ctx.fillStyle=C.fig; ctx.beginPath(); ctx.arc(head[0],head[1],8.5,0,Math.PI*2); ctx.fill();
}


// ================= Helpers =================
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const pad=n=>String(n).padStart(2,"0");
function dayKey(d){ d=d?new Date(d):new Date(); return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate()); }
function uid(){ if(crypto&&crypto.randomUUID) return crypto.randomUUID(); return "10000000-1000-4000-8000-100000000000".replace(/[018]/g,c=>(+c^crypto.getRandomValues(new Uint8Array(1))[0]&15>>+c/4).toString(16)); }
const safeId=s=>/^[A-Za-z0-9_-]{1,80}$/.test(String(s))?String(s):uid();
function fmtDur(sec){ sec=Math.round(sec||0); const h=Math.floor(sec/3600), m=Math.floor(sec%3600/60); return h? h+"h"+(m?pad(m):""): m+"min"; }
const fmtClock=s=>{ s=Math.max(0,Math.floor(s)); return pad(Math.floor(s/60))+":"+pad(s%60); };
const monIdx=d=>((d||new Date()).getDay()+6)%7;
const WD=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const WDL=["domingo","segunda","terça","quarta","quinta","sexta","sábado"];
const MON=["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
const shortDate=ts=>{ const d=new Date(ts); return WD[d.getDay()].toLowerCase()+" "+pad(d.getDate())+"/"+pad(d.getMonth()+1); };
const SPINES=["#5B4BB7","#0E7A5E","#B06F12","#9A3B20","#2F6DB5","#7A5C2E","#8A3F7A","#3E7F86"];
function toast(m){ const t=$("toast"); t.textContent=m; t.classList.add("on"); clearTimeout(t._t); t._t=setTimeout(()=>t.classList.remove("on"),2400); }
function twoStep(btn,label,fn){
  btn.addEventListener("click",()=>{
    if(btn.dataset.armed){ fn(); return; }
    btn.dataset.armed="1"; const old=btn.textContent; btn.textContent=label;
    setTimeout(()=>{ delete btn.dataset.armed; btn.textContent=old; },3000);
  });
}

// ================= Store (Supabase / Lovable Cloud) =================
const sb=ctx.supabase, UID=ctx.userId;
const S={books:{},logs:{},tasks:{},settings:{readGoalMin:20,bedTarget:"22:30",wakeTarget:"06:00",waterGoal:8,weightGoal:90}};
let queue=Promise.resolve();
function enqueue(fn){
  queue=queue.then(fn).then(r=>{ if(r&&r.error) throw r.error; }).catch(e=>{ console.error(e); setSync("err"); toast("Não consegui salvar. Confira a internet e tente de novo."); });
  return queue;
}
function setSync(mode){
  const el=$("sync"); el.className="sync "+(mode==="ok"?"ok":mode==="err"?"local":"");
  el.querySelector("span").textContent=mode==="ok"?"Sincronizado":mode==="err"?"Erro ao salvar":"Carregando…";
  $("localBanner").hidden=mode!=="err";
}
const KIND={workouts:"workouts",reading:"reading_sessions",stretch:"stretch_sessions",weights:"weights",confession:"confessions"};
const iso=ms=>new Date(ms).toISOString();
function toRow(kind,r){ const b={id:r.id,user_id:UID,day:r.day,ts:iso(r.ts)};
  if(kind==="workouts") return Object.assign(b,{workout:r.workout,rounds:r.rounds||0,secs:r.secs||0,knee:r.knee==null?null:r.knee,note:r.note||null});
  if(kind==="reading") return Object.assign(b,{book_id:r.bookId||null,secs:r.secs||0,pages:r.pages||0,note:r.note||null});
  if(kind==="stretch") return Object.assign(b,{secs:r.secs||0});
  if(kind==="weights") return Object.assign(b,{kg:r.kg});
  return b; }
function fromRow(kind,r){ const b={id:r.id,day:r.day,ts:Date.parse(r.ts)};
  if(kind==="workouts") return Object.assign(b,{workout:r.workout,rounds:r.rounds,secs:r.secs,knee:r.knee,note:r.note||""});
  if(kind==="reading") return Object.assign(b,{bookId:r.book_id,secs:r.secs,pages:r.pages,note:r.note||""});
  if(kind==="stretch") return Object.assign(b,{secs:r.secs});
  if(kind==="weights") return Object.assign(b,{kg:Number(r.kg)});
  return b; }
function dayFromRow(r){ const sl={}; if(r.bed) sl.bed=r.bed; if(r.wake) sl.wake=r.wake; if(r.sleep_quality) sl.q=r.sleep_quality;
  return {sleep:sl,oracao:r.oracao,terco:r.terco,exame:r.exame,water:r.water,vitd:r.vitd}; }
function bookFromRow(r){ return {id:r.id,title:r.title,author:r.author||"",currentPage:r.current_page,totalPages:r.total_pages,status:r.status,color:r.color,createdAt:Date.parse(r.created_at)}; }
function bookToRow(b){ return {id:b.id,user_id:UID,title:b.title,author:b.author||null,current_page:b.currentPage||0,total_pages:b.totalPages||0,status:b.status,color:b.color||null,created_at:iso(b.createdAt||Date.now())}; }
function taskFromRow(r){ return {id:r.id,title:r.title,done:r.done,due:r.due||"",createdAt:Date.parse(r.created_at),doneAt:r.done_at?Date.parse(r.done_at):0}; }
function taskToRow(t){ return {id:t.id,user_id:UID,title:t.title,done:!!t.done,due:t.due||null,created_at:iso(t.createdAt||Date.now()),done_at:t.doneAt?iso(t.doneAt):null}; }
async function fetchAll(table){
  const out=[];
  for(let from=0;;from+=1000){ const {data,error}=await sb.from(table).select("*").range(from,from+999); if(error) throw error; out.push(...data); if(data.length<1000) break; }
  return out;
}
async function loadAll(){
  try{
    const kinds=Object.keys(KIND);
    const res=await Promise.all([fetchAll("books"),fetchAll("tasks"),sb.from("settings").select("*").maybeSingle(),fetchAll("daily_checkins"),...kinds.map(k=>fetchAll(KIND[k]))]);
    if(!alive) return;
    const [books,tasks,settings,days]=res, lists=res.slice(4);
    if(settings.error) throw settings.error;
    const logs={}; const put=(m,k,id,v)=>{ const L=logs[m]=logs[m]||{}; (L[k]=L[k]||{})[id]=v; };
    kinds.forEach((k,i)=>lists[i].forEach(r=>{ const rec=fromRow(k,r); put(rec.day.slice(0,7),k,rec.id,rec); }));
    days.forEach(r=>put(r.day.slice(0,7),"days",r.day,dayFromRow(r)));
    S.logs=overlayPending(logs);
    const bk={}; books.forEach(r=>{ bk[r.id]=bookFromRow(r); }); S.books=bk;
    const tk={}; tasks.forEach(r=>{ tk[r.id]=taskFromRow(r); }); S.tasks=tk;
    if(settings.data){ const s=settings.data; S.settings={readGoalMin:s.read_goal_min,bedTarget:s.bed_target,wakeTarget:s.wake_target,waterGoal:s.water_goal,weightGoal:Number(s.weight_goal)}; }
    setSync("ok"); renderAll();
  }catch(e){ console.error(e); setSync("err"); toast("Não consegui carregar os dados. Confira a internet."); }
}
function addRecord(kind,rec){
  const m=rec.day.slice(0,7), cur=S.logs[m]||{};
  S.logs=Object.assign({},S.logs,{[m]:Object.assign({},cur,{[kind]:Object.assign({},cur[kind]||{},{[rec.id]:rec})})});
  renderAll();
  enqueue(()=>sb.from(KIND[kind]).insert(toRow(kind,rec)));
}
function removeRecord(kind,rec){
  const m=rec.day.slice(0,7), cur=S.logs[m]; if(!cur||!cur[kind]) return;
  const coll=Object.assign({},cur[kind]); delete coll[rec.id];
  S.logs=Object.assign({},S.logs,{[m]:Object.assign({},cur,{[kind]:coll})}); renderAll();
  enqueue(()=>sb.from(KIND[kind]).delete().eq("id",rec.id));
}
function saveBook(b){ S.books=Object.assign({},S.books,{[b.id]:b}); renderAll(); enqueue(()=>sb.from("books").upsert(bookToRow(b))); }
function removeBook(id){ const o=Object.assign({},S.books); delete o[id]; S.books=o; renderAll(); enqueue(()=>sb.from("books").delete().eq("id",id)); }
function saveSettings(p){
  S.settings=Object.assign({},S.settings,p); renderAll(); const s=S.settings;
  enqueue(()=>sb.from("settings").upsert({user_id:UID,read_goal_min:s.readGoalMin,bed_target:s.bedTarget,wake_target:s.wakeTarget,water_goal:s.waterGoal,weight_goal:s.weightGoal}));
}
function all(kind){ const out=[]; for(const m in S.logs){ const c=S.logs[m]&&S.logs[m][kind]; if(c) for(const k in c) out.push(c[k]); } return out.sort((a,b)=>String(b.day||"").localeCompare(String(a.day||""))||b.ts-a.ts); }
function readMinOn(day){ return Math.round(all("reading").filter(s=>s.day===day).reduce((a,s)=>a+(s.secs||0),0)/60); }
function streakOf(daysSet){
  const days=[...daysSet].sort(); let best=0;
  for(const d of days){ const p=new Date(d+"T12:00"); p.setDate(p.getDate()-1); if(daysSet.has(dayKey(p))) continue;
    let len=1; const n=new Date(d+"T12:00"); for(;;){ n.setDate(n.getDate()+1); if(daysSet.has(dayKey(n))) len++; else break; } best=Math.max(best,len); }
  let cur=0; const probe=new Date();
  if(!daysSet.has(dayKey(probe))){ probe.setDate(probe.getDate()-1); if(!daysSet.has(dayKey(probe))) return {cur:0,best}; }
  while(daysSet.has(dayKey(probe))){ cur++; probe.setDate(probe.getDate()-1); }
  return {cur,best:Math.max(best,cur)};
}

// ================= Modal =================
let modalLocked=false;
function openModal(html,locked){ $("modal").innerHTML=html; $("modalBg").hidden=false; modalLocked=!!locked; }
function closeModal(){ $("modalBg").hidden=true; $("modal").innerHTML=""; modalLocked=false; }
$("modalBg").addEventListener("click",e=>{ if(e.target.id==="modalBg"&&!modalLocked) closeModal(); });
function scaleHTML(id,val){ let h=`<div class="scale" id="${id}" role="group">`; for(let i=0;i<=10;i++) h+=`<button type="button" data-v="${i}" aria-pressed="${i===val}">${i}</button>`; return h+"</div>"; }
function wireScale(id){ const el=$(id); el.addEventListener("click",e=>{ const b=e.target.closest("button"); if(!b) return; el.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false")); }); return ()=>+(el.querySelector('[aria-pressed="true"]')||{dataset:{v:0}}).dataset.v; }

// ================= Navigation =================
let view="hoje"; const VIEWS=["hoje","treino","leitura","saude","casa"];
function go(v){
  view=v; VIEWS.forEach(k=>$("v-"+k).hidden=k!==v);
  document.querySelectorAll(".nav button").forEach(b=>b.setAttribute("aria-current",b.dataset.view===v?"page":"false"));
  try{ localStorage.setItem("rv_view",v); }catch(e){}
  window.scrollTo(0,0); renderAll();
}
document.querySelectorAll(".nav button").forEach(b=>b.addEventListener("click",()=>go(b.dataset.view)));

// ================= HOJE =================
function renderHoje(){
  const now=new Date(), today=dayKey();
  const h=now.getHours();
  $("helloTitle").textContent=(h<12?"Bom dia":h<18?"Boa tarde":"Boa noite")+(ctx.firstName?", "+ctx.firstName:"");
  $("todayLabel").textContent=WDL[now.getDay()]+", "+now.getDate()+" de "+MON[now.getMonth()];
  const w=ROT[monIdx()], doneToday=all("workouts").filter(x=>x.day===today);
  $("hTreinoName").textContent=w==="D7"?"Caminhada":WORKOUTS[w].title;
  const st=$("hTreinoStatus");
  if(doneToday.length){ const x=doneToday[0]; st.className="status done"; st.textContent="Feito";
    $("hTreinoSub").textContent=fmtClock(x.secs)+(x.knee!=null?" · joelho "+x.knee+"/10":""); $("hTreinoBtn").textContent="Ver treino"; }
  else { st.className="status"; st.textContent="Pendente"; $("hTreinoSub").textContent=w==="D7"?"20 min leve + mobilidade":WORKOUTS[w].ex.map(k=>EX[k].name).join(" · "); $("hTreinoBtn").textContent=w==="D7"?"Registrar caminhada":"Abrir treino"; }
  const goal=S.settings.readGoalMin||20, min=readMinOn(today);
  $("hReadMin").textContent=min; $("hReadGoal").textContent=goal;
  $("hReadBar").style.width=Math.min(100,min/goal*100)+"%";
  const rs=$("hLeituraStatus"); rs.className="status"+(min>=goal?" readdone":""); rs.textContent=min>=goal?"Meta batida":"Em aberto";
  const stk=streakOf(new Set(all("reading").map(s=>s.day)));
  const reading=Object.values(S.books).filter(b=>b.status==="lendo");
  $("hReadSub").textContent=(stk.cur?stk.cur+" dias seguidos":"Sem sequência ativa")+(reading.length?" · lendo "+reading.map(b=>b.title).slice(0,2).join(", "):"");
  // week grid
  const g=$("hWeek"); let html='<span></span>'; const days=[];
  for(let i=6;i>=0;i--){ const d=new Date(); d.setDate(d.getDate()-i); days.push(d); html+=`<span class="h${i===0?" today":""}">${WD[d.getDay()]}</span>`; }
  const wdays=new Set(all("workouts").map(x=>x.day)), sdays=new Set(all("stretch").map(x=>x.day));
  const row=(lab,fn)=>{ html+=`<span class="lab">${lab}</span>`+days.map(d=>{ const r=fn(dayKey(d)); return `<span class="dot ${r[0]||""}" title="${esc(r[1]||"")}"></span>`; }).join(""); };
  row("Treino",k=>[wdays.has(k)?"t":""]);
  row("Alongar",k=>[sdays.has(k)?"t":""]);
  row("Leitura",k=>{ const m=readMinOn(k); return [m>=goal?"r":m>0?"r half":"",m+" min"]; });
  row("Sono",k=>{ const sl=sleepOf(k); if(!sl) return [""]; return [sl.mins>=targetSleepMins()-30?"s":"s half",fmtHM(sl.mins)]; });
  row("Oração",k=>[dayDoc(k).oracao?"p":""]);
  row("Terço",k=>[dayDoc(k).terco?"p":""]);
  row("Exame",k=>[dayDoc(k).exame?"p":""]);
  row("Água",k=>{ const w=dayDoc(k).water||0; return [w>=(S.settings.waterGoal||8)?"w":w>0?"w half":"",w+" copos"]; });
  row("Vitamina D",k=>[dayDoc(k).vitd?"w":""]);
  g.innerHTML=html;
}
$("hTreinoBtn").addEventListener("click",()=>{ go("treino"); const w=ROT[monIdx()]; select(w,monIdx()); if(w==="D7") openWalk(); });
$("hReadBtn").addEventListener("click",()=>go("leitura"));

// ================= TREINO =================
let current="A", selDay=monIdx();
const cards=[]; const stage={cv:$("stageCanvas"),ctx:$("stageCanvas").getContext("2d")};
function weekDate(i){ const d=new Date(); d.setDate(d.getDate()-monIdx()+i); return d; }
function buildWeek(){
  const wk=$("week"); wk.innerHTML="";
  ROT.forEach((w,i)=>{ const b=document.createElement("button"); b.type="button"; b.className="day"; b.dataset.i=i;
    b.innerHTML=`<small>${DAYN[i]}</small><b>${w==="D7"?"Livre":w}</b>`; b.addEventListener("click",()=>select(w,i)); wk.appendChild(b); });
}
function markWeek(){
  const wdays=new Set(all("workouts").map(x=>x.day));
  document.querySelectorAll(".day").forEach(d=>{ const i=+d.dataset.i;
    d.classList.toggle("sel",i===selDay); d.classList.toggle("today",i===monIdx()); d.classList.toggle("done",wdays.has(dayKey(weekDate(i)))); });
}
function buildTabs(){
  const t=$("tabs"); t.innerHTML="";
  for(const k of ["A","B","C","S"]){ const b=document.createElement("button"); b.type="button"; b.className="tab"; b.setAttribute("role","tab"); b.id="tab"+k; b.textContent=k==="S"?"Alongamento":WORKOUTS[k].title; b.addEventListener("click",()=>k==="S"?showStretch():select(k)); t.appendChild(b); }
}
function select(w,dayI){
  selDay=dayI!==undefined?dayI:ROT.indexOf(w); markWeek(); showStretchSec(false);
  $("sunday").hidden=w!=="D7";
  if(w==="D7") return;
  if(w!==current||!cards.length){ current=w; resetTimer(); buildGrid(); }
  ["A","B","C","S"].forEach(k=>$("tab"+k).setAttribute("aria-selected",k===current?"true":"false"));
}
function buildGrid(){
  const g=$("grid"); g.innerHTML=""; cards.length=0;
  WORKOUTS[current].ex.forEach((key,i)=>{
    const ex=EX[key], rp=WORKOUTS[current].reps[i];
    const el=document.createElement("article"); el.className="excard";
    el.innerHTML=`<div class="eyebrow">${TAGS[i]}</div><h3>${ex.name}<span>${rp[0]} ${rp[1]}</span></h3><canvas class="anim" aria-label="Animação: ${ex.name}"></canvas>
      <ul>${ex.tips.map(t=>`<li>${t}</li>`).join("")}</ul><div class="avoid"><b>Evite:</b> ${ex.avoid}</div>`;
    g.appendChild(el); const cv=el.querySelector("canvas"); cards.push({el,cv,ctx:cv.getContext("2d"),ex,off:i*.37});
  });
  updateUI();
}
// round tracker
const REST=60;
let plan=[], idx=0, started=false, finished=false, t0=0, elapsedBefore=0, stepStart=0, audio=null, wake=null, lastWhole=null;
function makePlan(){
  const R=+$("roundsSel").value; plan=[];
  for(let r=0;r<R;r++){ for(let e=0;e<4;e++){ const rp=WORKOUTS[current].reps[e]; plan.push({type:"work",r,e,timed:rp[1]==="segundos"?+rp[0]:0}); }
    if(r<R-1) plan.push({type:"rest",r,e:0,dur:REST}); }
}
function resetTimer(){ started=false; finished=false; makePlan(); idx=0; elapsedBefore=0; $("startBtn").textContent="Iniciar"; releaseWake(); updateUI(); }
function elapsed(){ return started&&!finished?elapsedBefore+(performance.now()-t0)/1000:elapsedBefore; }
function stepLeft(){ const s=plan[idx]; const d=s.type==="rest"?s.dur:s.timed; return d?d-(performance.now()-stepStart)/1000:null; }
function beep(freq,len){ if(!audio) return; try{ const o=audio.createOscillator(), g=audio.createGain(); o.frequency.value=freq;
  g.gain.setValueAtTime(.0001,audio.currentTime); g.gain.exponentialRampToValueAtTime(.25,audio.currentTime+.01); g.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+len);
  o.connect(g).connect(audio.destination); o.start(); o.stop(audio.currentTime+len+.02); }catch(e){} }
async function requestWake(){ try{ if("wakeLock" in navigator) wake=await navigator.wakeLock.request("screen"); }catch(e){ wake=null; } }
function releaseWake(){ try{ wake&&wake.release(); }catch(e){} wake=null; }
function goTo(i){
  if(i>=plan.length){ elapsedBefore=elapsed(); finished=true; idx=plan.length-1; $("startBtn").textContent="Recomeçar"; beep(880,.6); releaseWake(); updateUI(); openWorkoutSave(); return; }
  idx=Math.max(0,i); stepStart=performance.now(); lastWhole=null;
  const s=plan[idx]; beep(s.type==="work"?880:520,.3);
  $("startBtn").textContent=s.type==="rest"?"Pular descanso":(s.timed?"Pular":"Feito"); updateUI();
}
function updateUI(){
  const step=plan[idx]; if(!step) return;
  const R=+$("roundsSel").value, W=WORKOUTS[current], ex=EX[W.ex[step.e]], rp=W.reps[step.e];
  const ph=$("phase"), left=started&&!finished?stepLeft():null;
  if(finished){ ph.className="phase"; ph.textContent="Concluído"; }
  else if(!started){ ph.className="phase idle"; ph.textContent="Pronto"; }
  else if(step.type==="work"){ ph.className="phase"; ph.textContent="Série"; }
  else { ph.className="phase rest"; ph.textContent="Descanso"; }
  if(finished){ $("big").textContent=fmtClock(elapsedBefore); $("unit").textContent="tempo total"; }
  else if(step.type==="rest"){ $("big").textContent=Math.max(0,Math.ceil(left==null?REST:left)); $("unit").textContent="segundos de descanso"; }
  else if(step.timed&&left!=null){ $("big").textContent=Math.max(0,Math.ceil(left)); $("unit").textContent="segundos"; }
  else { $("big").textContent=rp[0]; $("unit").textContent=rp[1]==="reps"?"repetições":rp[1]; }
  $("bar").className="bar"+(step.type==="rest"?" rest":"");
  let pct= finished?100: step.type==="rest"?(1-(left==null?REST:left)/REST)*100 : (step.timed&&left!=null)?(1-left/step.timed)*100 : step.e/4*100;
  $("barFill").style.width=Math.max(0,Math.min(100,pct)).toFixed(1)+"%";
  $("roundTxt").textContent=(step.r+1)+"/"+R; $("exTxt").textContent=step.type==="rest"?"—":(step.e+1)+"/4";
  $("totalTxt").textContent=fmtClock(elapsed());
  $("nowName").textContent=finished?"Treino feito":(step.type==="rest"?"Próximo: ":"")+ex.name;
  $("nowCue").textContent=finished?"Registrado no histórico.":ex.cue;
  const dots=$("roundDots"); if(dots.children.length!==R){ dots.innerHTML=""; for(let i=0;i<R;i++) dots.appendChild(document.createElement("span")); }
  [...dots.children].forEach((d,i)=>{ d.className=finished||i<step.r||(step.type==="rest"&&i===step.r)?"done":(i===step.r?"cur":""); });
  cards.forEach((c,i)=>c.el.classList.toggle("active",started&&!finished&&step.type==="work"&&i===step.e));
}
$("startBtn").addEventListener("click",()=>{
  if(!audio){ try{ audio=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} }
  if(audio&&audio.state==="suspended") audio.resume();
  if(finished) resetTimer();
  if(!started){ started=true; t0=performance.now(); elapsedBefore=0; requestWake(); goTo(0); return; }
  goTo(idx+1);
});
$("skipBtn").addEventListener("click",()=>{ if(started&&!finished) goTo(idx-1); });
$("resetBtn").addEventListener("click",resetTimer);
$("roundsSel").addEventListener("change",resetTimer);
document.addEventListener("visibilitychange",()=>{ if(document.visibilityState==="visible"&&((started&&!finished)||rt.on||st.on)) requestWake(); },{signal:AC.signal});

function openWorkoutSave(){
  const secs=Math.round(elapsedBefore), rounds=+$("roundsSel").value;
  openModal(`<h2>Treino concluído</h2>
    <p style="margin:0">${esc(WORKOUTS[current].title)} · ${rounds} rounds · <b class="num">${fmtClock(secs)}</b></p>
    <div><div class="muted" style="font-size:14px;margin-bottom:6px">Dor no joelho durante o treino (0 = nenhuma)</div>${scaleHTML("kneeScale",0)}</div>
    <label class="f" for="wNote">Observação (opcional)<textarea id="wNote" placeholder="Ex: ponte puxou um pouco no posterior"></textarea></label>
    <div class="row"><button class="btn primary" type="button" id="wSave">Salvar treino</button><button class="btn" type="button" id="wDiscard">Descartar</button></div>`,true);
  const knee=wireScale("kneeScale");
  $("wSave").addEventListener("click",()=>{ addRecord("workouts",{id:uid(),day:dayKey(),ts:Date.now(),workout:current,rounds,secs,knee:knee(),note:$("wNote").value.trim()}); closeModal(); toast("Treino salvo"); });
  twoStep($("wDiscard"),"Toque de novo para descartar",()=>{ closeModal(); toast("Treino descartado"); });
}
function openWalk(){
  openModal(`<h2>Caminhada + mobilidade</h2>
    <label class="f" for="walkMin">Minutos<input id="walkMin" type="number" min="1" value="20" inputmode="numeric"></label>
    <div><div class="muted" style="font-size:14px;margin-bottom:6px">Dor no joelho (0 = nenhuma)</div>${scaleHTML("walkKnee",0)}</div>
    <div class="row"><button class="btn primary" type="button" id="walkSave">Salvar</button><button class="btn" type="button" id="walkCancel">Cancelar</button></div>`);
  const knee=wireScale("walkKnee");
  $("walkSave").addEventListener("click",()=>{ const m=Math.max(1,+$("walkMin").value||20); addRecord("workouts",{id:uid(),day:dayKey(),ts:Date.now(),workout:"Caminhada",rounds:0,secs:m*60,knee:knee(),note:""}); closeModal(); toast("Caminhada salva"); });
  $("walkCancel").addEventListener("click",closeModal);
}
$("walkBtn").addEventListener("click",openWalk);
function renderTreino(){
  markWeek();
  const list=all("workouts").slice(0,8), el=$("wHistory");
  if(!list.length){ el.innerHTML='<div class="empty">Nenhum treino registrado ainda. O primeiro entra aqui quando você terminar os rounds.</div>'; return; }
  el.innerHTML=list.map(x=>`<div class="item"><span class="tag">${x.workout==="Caminhada"?"Cam":esc(x.workout)}</span>
    <div class="grow"><div class="t1">${x.workout==="Caminhada"?"Caminhada":esc((WORKOUTS[x.workout]||{title:x.workout}).title)+" · "+x.rounds+" rounds"}</div>
    <div class="t2">${shortDate(x.ts)} · <span class="num">${fmtClock(x.secs)}</span>${x.knee!=null?" · joelho "+x.knee+"/10":""}${x.note?" · "+esc(x.note):""}</div></div>
    <button class="btn danger" type="button" data-del="${esc(x.id)}" style="padding:6px 10px">Excluir</button></div>`).join("");
  el.querySelectorAll("[data-del]").forEach(b=>{ const rec=list.find(x=>x.id===b.dataset.del); twoStep(b,"Confirmar",()=>removeRecord("workouts",rec)); });
}

// ================= LEITURA =================
function renderLeitura(){
  const goal=S.settings.readGoalMin||20, today=dayKey(), min=readMinOn(today), ses=all("reading");
  $("goalLabel").textContent=goal; $("lTodayMin").textContent=min;
  $("lGoalBar").style.width=Math.min(100,min/goal*100)+"%";
  const stk=streakOf(new Set(ses.map(s=>s.day))); $("lStreak").textContent=stk.cur;
  // select
  const sel=$("timerBook"), keep=sel.value, open=Object.values(S.books).filter(b=>b.status!=="lido").sort((a,b)=>(a.status==="lendo"?0:1)-(b.status==="lendo"?0:1)||(b.createdAt||0)-(a.createdAt||0));
  sel.innerHTML=open.length?open.map(b=>`<option value="${esc(b.id)}">${esc(b.title)}</option>`).join(""):'<option value="">Adicione um livro na biblioteca</option>';
  if(open.find(b=>b.id===keep)) sel.value=keep;
  // chart
  const days=[]; let maxv=goal;
  for(let i=6;i>=0;i--){ const d=new Date(); d.setDate(d.getDate()-i); const m=readMinOn(dayKey(d)); maxv=Math.max(maxv,m); days.push({m,lab:WD[d.getDay()],today:i===0}); }
  const H=96;
  $("weekChart").innerHTML=days.map(x=>`<div class="d${x.today?" today":""}"><span class="v">${x.m||""}</span><div class="col" style="height:${Math.max(3,x.m/maxv*H)}px"></div><span class="lab">${x.lab}</span></div>`).join("");
  // books
  const f=$("filterStatus").value, ord={lendo:0,quero:1,lido:2};
  let books=Object.values(S.books).sort((a,b)=>(ord[a.status]-ord[b.status])||(b.createdAt||0)-(a.createdAt||0));
  if(f!=="all") books=books.filter(b=>b.status===f);
  const bl=$("bookList");
  if(!books.length) bl.innerHTML='<div class="empty">Nenhum livro aqui ainda. Adicione um ou traga o backup do app Foco.</div>';
  else { bl.innerHTML=books.map(b=>{ const pct=b.totalPages?Math.min(100,Math.round((b.currentPage||0)/b.totalPages*100)):0;
      return `<button type="button" class="book" data-id="${esc(b.id)}"><span class="spine" style="background:${esc(b.color||SPINES[0])}"></span>
      <span class="grow"><span class="t1">${esc(b.title)}</span><span class="t2"><span>${esc(b.author||"—")}</span><span class="badge ${esc(b.status)}">${b.status==="lido"?"Lido":b.status==="quero"?"Quero ler":"Lendo"}</span></span>
      <span class="bar read"><i style="width:${pct}%"></i></span><span class="t2"><span class="num">${b.currentPage||0}/${b.totalPages||"?"} pág</span><span>${pct}%</span></span></span></button>`; }).join("");
    bl.querySelectorAll(".book").forEach(el=>el.addEventListener("click",()=>openBook(S.books[el.dataset.id]))); }
  // stats
  $("stTime").textContent=fmtDur(ses.reduce((a,s)=>a+(s.secs||0),0));
  $("stPages").textContent=ses.reduce((a,s)=>a+(s.pages||0),0);
  $("stBooks").textContent=Object.values(S.books).filter(b=>b.status==="lido").length;
  $("stBest").textContent=stk.best;
  const rec=ses.slice(0,6), rl=$("recentSessions");
  rl.innerHTML=rec.length?rec.map(s=>{ const b=S.books[s.bookId]; return `<div class="item"><span class="tag" style="background:var(--read-soft);color:var(--read);font-family:var(--mono);font-size:13px">${fmtDur(s.secs)}</span>
    <div class="grow"><div class="t1">${b?esc(b.title):"(livro removido)"}</div><div class="t2">${shortDate(s.ts)}${s.pages?" · "+s.pages+" pág":""}${s.note?" · "+esc(s.note):""}</div></div></div>`; }).join("")
    :'<div class="empty">Nenhuma sessão ainda.</div>';
}
$("filterStatus").addEventListener("change",renderLeitura);
$("addBook").addEventListener("click",()=>openBook(null));
$("goalBtn").addEventListener("click",()=>{
  openModal(`<h2>Meta diária de leitura</h2><label class="f" for="gMin">Minutos por dia<input id="gMin" type="number" min="1" inputmode="numeric" value="${S.settings.readGoalMin||20}"></label>
    <div class="row"><button class="btn readbtn" type="button" id="gSave">Salvar</button><button class="btn" type="button" id="gCancel">Cancelar</button></div>`);
  $("gSave").addEventListener("click",()=>{ saveSettings({readGoalMin:Math.max(1,+$("gMin").value||20)}); closeModal(); toast("Meta atualizada"); });
  $("gCancel").addEventListener("click",closeModal);
});
function openBook(book){
  const b=book||{};
  openModal(`<h2>${book?"Editar livro":"Novo livro"}</h2>
    <label class="f" for="mTitle">Título<input id="mTitle" value="${esc(b.title||"")}" placeholder="Ex: Confissões"></label>
    <label class="f" for="mAuthor">Autor<input id="mAuthor" value="${esc(b.author||"")}" placeholder="Ex: Santo Agostinho"></label>
    <div class="row"><label class="f" for="mCur">Página atual<input id="mCur" type="number" min="0" inputmode="numeric" value="${b.currentPage||0}"></label>
    <label class="f" for="mTot">Total de páginas<input id="mTot" type="number" min="0" inputmode="numeric" value="${b.totalPages||""}"></label></div>
    <label class="f" for="mStatus">Status<select id="mStatus"><option value="lendo">Lendo</option><option value="quero">Quero ler</option><option value="lido">Lido</option></select></label>
    <div class="row"><button class="btn readbtn" type="button" id="mSave">Salvar</button>${book?'<button class="btn danger" type="button" id="mDel">Excluir livro</button>':""}<button class="btn" type="button" id="mCancel">Cancelar</button></div>`);
  $("mStatus").value=b.status||"lendo";
  $("mSave").addEventListener("click",()=>{
    const title=$("mTitle").value.trim(); if(!title){ toast("Dê um título ao livro"); return; }
    const nb=Object.assign({},b,{id:b.id||uid(),title,author:$("mAuthor").value.trim(),currentPage:+$("mCur").value||0,totalPages:+$("mTot").value||0,status:$("mStatus").value,
      createdAt:b.createdAt||Date.now(),color:b.color||SPINES[Object.keys(S.books).length%SPINES.length]});
    saveBook(nb); closeModal(); toast("Livro salvo");
  });
  if(book) twoStep($("mDel"),"Toque de novo para excluir",()=>{ removeBook(b.id); closeModal(); toast("Livro excluído. As sessões continuam nos números."); });
  $("mCancel").addEventListener("click",closeModal);
}
// focus timer
const rt={on:false,paused:false,start:0,elapsed:0,bookId:null,int:null};
$("startRead").addEventListener("click",()=>{
  const id=$("timerBook").value, b=S.books[id]; if(!b){ toast("Adicione um livro primeiro"); return; }
  Object.assign(rt,{on:true,paused:false,start:Date.now(),elapsed:0,bookId:id});
  $("focusBook").textContent=b.title; $("focusClock").textContent="00:00"; $("pauseRead").textContent="Pausar"; $("focus").hidden=false; requestWake();
  clearInterval(rt.int); rt.int=setInterval(()=>{ if(rt.paused) return; rt.elapsed=Math.floor((Date.now()-rt.start)/1000); $("focusClock").textContent=fmtClock(rt.elapsed); },500);
});
$("pauseRead").addEventListener("click",()=>{
  if(rt.paused){ rt.paused=false; rt.start=Date.now()-rt.elapsed*1000; $("pauseRead").textContent="Pausar"; }
  else { rt.paused=true; $("pauseRead").textContent="Retomar"; }
});
$("finishRead").addEventListener("click",()=>{
  clearInterval(rt.int); rt.on=false; releaseWake(); $("focus").hidden=true;
  const secs=rt.elapsed, b=S.books[rt.bookId];
  if(secs<10||!b){ toast("Sessão muito curta, não registrada"); return; }
  const startPage=b.currentPage||0;
  openModal(`<h2>Sessão concluída</h2><p style="margin:0">${esc(b.title)} · <b class="num">${fmtDur(secs)}</b></p>
    <label class="f" for="sEnd">Em que página você parou?<input id="sEnd" type="number" inputmode="numeric" min="${startPage}" value="${startPage}"></label>
    <div class="muted" style="font-size:14px">Começou na página ${startPage}.</div>
    <label class="f" for="sNote">Um aprendizado rápido (opcional)<textarea id="sNote" placeholder="O que ficou dessa leitura?"></textarea></label>
    <div class="row"><button class="btn readbtn" type="button" id="sSave">Salvar sessão</button><button class="btn" type="button" id="sDiscard">Descartar</button></div>`,true);
  $("sSave").addEventListener("click",()=>{
    const end=+$("sEnd").value||startPage, pages=Math.max(0,end-startPage);
    addRecord("reading",{id:uid(),bookId:b.id,ts:Date.now(),day:dayKey(),secs,pages,note:$("sNote").value.trim()});
    const nb=Object.assign({},b); if(end>startPage) nb.currentPage=end;
    let msg="Sessão salva";
    if(nb.totalPages&&nb.currentPage>=nb.totalPages){ nb.currentPage=nb.totalPages; nb.status="lido"; msg="Livro concluído. Parabéns!"; }
    else if(nb.status==="quero") nb.status="lendo";
    if(nb.currentPage!==b.currentPage||nb.status!==b.status) saveBook(nb);
    closeModal(); toast(msg);
  });
  twoStep($("sDiscard"),"Toque de novo para descartar",()=>{ closeModal(); toast("Sessão descartada"); });
});
// import from the old Foco app backup
$("importFile").addEventListener("change",ev=>{
  const f=ev.target.files[0]; ev.target.value=""; if(!f) return;
  const r=new FileReader();
  r.onload=()=>{
    let d; try{ d=JSON.parse(r.result); }catch(e){ toast("Esse arquivo não é um backup válido do Foco."); return; }
    if(!d||!Array.isArray(d.books)||!Array.isArray(d.sessions)){ toast("Esse arquivo não é um backup válido do Foco."); return; }
    const norm=s=>String(s||"").trim().toLowerCase();
    const existing={}; Object.values(S.books).forEach(b=>{ existing[norm(b.title)+"|"+norm(b.author)]=b.id; });
    const idMap={}, newBooks=[];
    d.books.forEach((b,i)=>{
      const key=norm(b.title)+"|"+norm(b.author);
      if(existing[key]){ idMap[b.id]=existing[key]; return; }
      const nb={id:uid(),title:String(b.title||"Sem título").slice(0,200),author:String(b.author||"").slice(0,200),currentPage:+b.currentPage||0,totalPages:+b.totalPages||0,
        status:["lendo","quero","lido"].includes(b.status)?b.status:"lendo",createdAt:+b.createdAt||Date.now(),color:SPINES[(Object.keys(S.books).length+i)%SPINES.length]};
      idMap[b.id]=nb.id; existing[key]=nb.id; newBooks.push(nb);
    });
    const seen=new Set(all("reading").map(s=>s.ts+"|"+s.secs)), newSes=[];
    d.sessions.forEach(s=>{ const ts=+s.ts||Date.now(), secs=+s.secs||0; if(seen.has(ts+"|"+secs)) return;
      const day=/^\d{4}-\d{2}-\d{2}$/.test(s.day)?s.day:dayKey(ts);
      newSes.push({id:uid(),bookId:idMap[s.bookId]||null,ts,day,secs,pages:+s.pages||0,note:String(s.note||"").slice(0,1000)}); });
    const bk=Object.assign({},S.books); newBooks.forEach(b=>{ bk[b.id]=b; }); S.books=bk;
    newSes.forEach(rec=>{ const m=rec.day.slice(0,7), cur=S.logs[m]||{}; S.logs=Object.assign({},S.logs,{[m]:Object.assign({},cur,{reading:Object.assign({},cur.reading||{},{[rec.id]:rec})})}); });
    if(newBooks.length) enqueue(()=>sb.from("books").insert(newBooks.map(bookToRow)));
    if(newSes.length) enqueue(()=>sb.from("reading_sessions").insert(newSes.map(x=>toRow("reading",x))));
    if(d.settings&&+d.settings.goalMin) saveSettings({readGoalMin:+d.settings.goalMin});
    renderAll(); toast(`Importado: ${newBooks.length} livros e ${newSes.length} sessões`);
  };
  r.readAsText(f);
});

// ================= Daily check-in (daily_checkins, one row per day) =================
function dayDoc(day){ const m=S.logs[day.slice(0,7)]; return (m&&m.days&&m.days[day])||{}; }
const mergeInto=(d,patch)=>{ for(const k in patch) d[k]=(patch[k]&&typeof patch[k]==="object")?Object.assign({},d[k]||{},patch[k]):patch[k]; return d; };
const pendingDay={}; let dayTimer=null;
function setDay(day,patch){
  const m=day.slice(0,7), cur=S.logs[m]||{}, days=Object.assign({},cur.days||{});
  days[day]=mergeInto(Object.assign({},days[day]||{}),patch);
  S.logs=Object.assign({},S.logs,{[m]:Object.assign({},cur,{days})}); renderAll();
  pendingDay[day]=true; clearTimeout(dayTimer); dayTimer=setTimeout(flushDays,600);
}
function dayRow(day){ const d=dayDoc(day), sl=d.sleep||{};
  return {user_id:UID,day,bed:sl.bed||null,wake:sl.wake||null,sleep_quality:sl.q||null,oracao:!!d.oracao,terco:!!d.terco,exame:!!d.exame,water:d.water||0,vitd:!!d.vitd,updated_at:new Date().toISOString()}; }
function flushDays(){
  clearTimeout(dayTimer); const days=Object.keys(pendingDay); if(!days.length) return queue;
  const rows=days.map(dayRow); days.forEach(d=>{ delete pendingDay[d]; });
  return enqueue(()=>sb.from("daily_checkins").upsert(rows,{onConflict:"user_id,day"}));
}
function overlayPending(o){
  for(const day in pendingDay){ const cur=dayDoc(day), m=day.slice(0,7), L=o[m]=o[m]||{}; L.days=Object.assign({},L.days||{},{[day]:cur}); }
  return o;
}
window.addEventListener("pagehide",()=>{ flushDays(); },{signal:AC.signal});
document.addEventListener("visibilitychange",()=>{ if(document.visibilityState==="visible"){ flushDays(); queue.then(loadAll); } else flushDays(); },{signal:AC.signal});

// ================= Sleep helpers =================
const toMin=t=>{ if(!t||!/^\d{2}:\d{2}$/.test(t)) return null; const a=t.split(":").map(Number); return a[0]*60+a[1]; };
const fmtHM=m=>{ m=Math.max(0,Math.round(m)); return Math.floor(m/60)+"h"+pad(m%60); };
const minToClock=m=>{ m=((Math.round(m)%1440)+1440)%1440; return pad(Math.floor(m/60))+":"+pad(m%60); };
function targetSleepMins(){ const b=toMin(S.settings.bedTarget), w=toMin(S.settings.wakeTarget); return b==null||w==null?480:(w-b+1440)%1440; }
function lateBy(bed,target){ const b=toMin(bed), t=toMin(target); if(b==null||t==null) return 0; return ((b-t+720+1440)%1440)-720; }
function sleepOf(day){
  const sl=dayDoc(day).sleep; if(!sl) return null;
  const b=toMin(sl.bed), w=toMin(sl.wake);
  if(b==null||w==null) return (sl.q||sl.bed||sl.wake)?{mins:0,q:sl.q,bed:sl.bed,wake:sl.wake,partial:true}:null;
  return {mins:(w-b+1440)%1440,q:sl.q,bed:sl.bed,wake:sl.wake};
}
const diffDays=(a,b)=>Math.round((new Date(a+"T12:00")-new Date(b+"T12:00"))/864e5);
const kgFmt=v=>(+v).toLocaleString("pt-BR",{minimumFractionDigits:1,maximumFractionDigits:1});
function lastConfession(){ return all("confession")[0]||null; }
function lastWeight(){ return all("weights")[0]||null; }
function weekStartKey(){ const d=new Date(); d.setDate(d.getDate()-monIdx()); return dayKey(d); }

// ================= Check-in UI =================
let ciOffset=0;
function ciDayKey(){ const d=new Date(); d.setDate(d.getDate()-ciOffset); return dayKey(d); }
$("ciPrev").addEventListener("click",()=>{ ciOffset=Math.min(ciOffset+1,60); renderCheckin(); });
$("ciNext").addEventListener("click",()=>{ ciOffset=Math.max(ciOffset-1,0); renderCheckin(); });
function renderCheckin(){
  const day=ciDayKey(), today=dayKey(), dd=dayDoc(day);
  $("ciDay").textContent=ciOffset===0?"Hoje":ciOffset===1?"Ontem":shortDate(new Date(day+"T12:00"));
  $("ciNext").disabled=ciOffset===0;
  // sleep
  const sl=dd.sleep||{};
  if(document.activeElement!==$("bedIn")) $("bedIn").value=sl.bed||"";
  if(document.activeElement!==$("wakeIn")) $("wakeIn").value=sl.wake||"";
  const info=sleepOf(day), tgt=targetSleepMins();
  $("sleepDur").textContent=info&&!info.partial?fmtHM(info.mins):"noite anterior";
  let msg="Meta: deitar "+S.settings.bedTarget+", acordar "+S.settings.wakeTarget+" ("+fmtHM(tgt)+")", cls="";
  if(info&&!info.partial){
    const late=lateBy(sl.bed,S.settings.bedTarget), okDur=info.mins>=tgt-30;
    if(late<=15){ msg="Deitou no horário · "+(okDur?"sono dentro da meta":"faltaram "+fmtHM(tgt-info.mins)); cls=okDur?"good":""; }
    else { msg="Deitou "+fmtHM(late)+" depois da meta"; cls="bad"; }
  }
  $("sleepInfo").textContent=msg; $("sleepInfo").className="okline "+cls;
  $("sleepQ").querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(+b.dataset.v===sl.q)));
  // chips
  document.querySelectorAll("#checkin .chip").forEach(c=>c.setAttribute("aria-pressed",String(!!dd[c.dataset.k])));
  $("spiritCount").textContent=["oracao","terco","exame"].filter(k=>dd[k]).length+"/3";
  // confession
  const lc=lastConfession(), ci=$("confInfo");
  if(!lc){ ci.textContent="Confissão: sem registro"; ci.className="okline"; }
  else { const n=diffDays(today,lc.day); ci.textContent=n<=0?"Confessou hoje":"Última confissão há "+n+(n===1?" dia":" dias")+(n>15?" · já passou dos 15":""); ci.className="okline "+(n>15?"bad":"good"); }
  // water
  const goal=S.settings.waterGoal||8, w=dd.water||0;
  $("waterN").textContent=w+"/"+goal; $("waterMl").textContent=(w*250).toLocaleString("pt-BR")+" ml";
  let cups=""; for(let i=0;i<Math.max(goal,w);i++) cups+=`<i class="${i<w?"f":""}"></i>`; $("cups").innerHTML=cups;
  // weight
  const lw=lastWeight(), wi=$("weightInfo"), wg=S.settings.weightGoal||90;
  if(!lw){ wi.textContent="Peso: nenhuma pesagem ainda"; wi.className="okline"; }
  else { const n=diffDays(today,lw.day), diff=lw.kg-wg;
    wi.textContent=kgFmt(lw.kg)+" kg · "+(diff>0?"faltam "+kgFmt(diff)+" kg":"meta batida")+(n>=7?" · pesagem da semana pendente":"");
    wi.className="okline "+(n>=7?"bad":""); }
  // stretch
  const ws=weekStartKey(), sdays=new Set(all("stretch").filter(x=>x.day>=ws).map(x=>x.day));
  $("stretchWeek").textContent=sdays.size+"/3 na semana";
  $("stretchInfo").textContent=all("stretch").some(x=>x.day===day)?"Feito neste dia.":sdays.size>=3?"Meta da semana cumprida.":"Rotina guiada de ~10 min, 3 vezes por semana.";
  $("stretchInfo").className="okline "+(all("stretch").some(x=>x.day===day)||sdays.size>=3?"good":"");
}
$("bedIn").addEventListener("change",e=>setDay(ciDayKey(),{sleep:{bed:e.target.value}}));
$("wakeIn").addEventListener("change",e=>setDay(ciDayKey(),{sleep:{wake:e.target.value}}));
$("sleepQ").addEventListener("click",e=>{ const b=e.target.closest("button"); if(b) setDay(ciDayKey(),{sleep:{q:+b.dataset.v}}); });
document.querySelectorAll("#checkin .chip").forEach(c=>c.addEventListener("click",()=>{ const k=c.dataset.k, day=ciDayKey(); setDay(day,{[k]:!dayDoc(day)[k]}); }));
$("waterPlus").addEventListener("click",()=>{ const day=ciDayKey(); setDay(day,{water:(dayDoc(day).water||0)+1}); });
$("waterMinus").addEventListener("click",()=>{ const day=ciDayKey(); setDay(day,{water:Math.max(0,(dayDoc(day).water||0)-1)}); });
$("confBtn").addEventListener("click",()=>{
  const day=ciDayKey(); if(all("confession").some(x=>x.day===day)){ toast("Confissão já registrada neste dia"); return; }
  addRecord("confession",{id:uid(),day,ts:Date.now()}); toast("Confissão registrada. Deo gratias!");
});
$("weighBtn").addEventListener("click",()=>openWeigh(ciDayKey()));
$("weighBtn2").addEventListener("click",()=>openWeigh(dayKey()));
$("goStretch").addEventListener("click",()=>{ go("treino"); showStretch(); });
$("goCasa").addEventListener("click",()=>go("casa"));
$("goalsBtn").addEventListener("click",openGoals);
function openWeigh(day){
  const lw=lastWeight();
  openModal(`<h2>Pesagem</h2><p class="muted" style="margin:0">${day===dayKey()?"Hoje":shortDate(new Date(day+"T12:00"))} · de preferência ao acordar, antes de comer.</p>
    <label class="f" for="kgIn">Peso (kg)<input id="kgIn" inputmode="decimal" placeholder="${lw?kgFmt(lw.kg):"Ex: 96,5"}"></label>
    <div class="row"><button class="btn primary" type="button" id="kgSave">Salvar</button><button class="btn" type="button" id="kgCancel">Cancelar</button></div>`);
  setTimeout(()=>{ try{ $("kgIn").focus(); }catch(e){} },100);
  $("kgSave").addEventListener("click",()=>{ const v=parseFloat(String($("kgIn").value).replace(",",".")); if(!(v>30&&v<300)){ toast("Digite o peso em kg, ex: 96,5"); return; }
    addRecord("weights",{id:uid(),day,ts:Date.now(),kg:Math.round(v*10)/10}); closeModal(); toast("Peso registrado"); });
  $("kgCancel").addEventListener("click",closeModal);
}
function openGoals(){
  const s=S.settings;
  openModal(`<h2>Metas</h2>
    <div class="row"><label class="f" for="gBed">Deitar até<input type="time" id="gBed" value="${esc(s.bedTarget)}"></label><label class="f" for="gWake">Acordar às<input type="time" id="gWake" value="${esc(s.wakeTarget)}"></label></div>
    <div class="row"><label class="f" for="gWater">Água (copos de 250 ml)<input type="number" id="gWater" min="1" max="20" inputmode="numeric" value="${s.waterGoal||8}"></label>
    <label class="f" for="gWeight">Peso meta (kg)<input id="gWeight" inputmode="decimal" value="${kgFmt(s.weightGoal||90)}"></label></div>
    <label class="f" for="gRead">Leitura por dia (min)<input type="number" id="gRead" min="1" inputmode="numeric" value="${s.readGoalMin||20}"></label>
    <div class="row"><button class="btn primary" type="button" id="gSave2">Salvar metas</button><button class="btn" type="button" id="gCancel2">Cancelar</button></div>`);
  $("gSave2").addEventListener("click",()=>{
    const wg=parseFloat(String($("gWeight").value).replace(",","."));
    saveSettings({bedTarget:$("gBed").value||"22:30",wakeTarget:$("gWake").value||"06:00",waterGoal:Math.max(1,+$("gWater").value||8),weightGoal:wg>30?wg:90,readGoalMin:Math.max(1,+$("gRead").value||20)});
    closeModal(); toast("Metas salvas");
  });
  $("gCancel2").addEventListener("click",closeModal);
}

// ================= Stretching (guided) =================
const STRETCH=[
  {name:"Gato-vaca",cue:"Em quatro apoios, arredonde as costas olhando para o umbigo e depois afunde, olhando à frente. Siga a respiração.",secs:40,
   a:{prop:"mat",elbow:1,knee:-1,frames:[{sh:[160,92],hip:[110,94],hN:[160,140],fN:[78,139],arch:9,hd:[-3,7]},{sh:[160,92],hip:[110,95],hN:[160,140],fN:[78,139],arch:-7,hd:[3,-6]}],seq:[0,1],move:1.8,hold:.7}},
  {name:"Dorsal (cachorrinho)",cue:"De quatro apoios, deslize as mãos à frente e leve o peito ao chão, quadril alto sobre os joelhos.",secs:40,
   a:{prop:"mat",elbow:1,knee:-1,frames:[{sh:[150,92],hip:[102,98],hN:[150,140],fN:[68,139]},{sh:[160,125],hip:[102,100],hN:[208,138],fN:[68,139]}],seq:[0,1],move:1.6,hold:2}},
  {name:"Flexor do quadril",cue:"Semi-ajoelhado, almofada sob o joelho de apoio. Contraia o glúteo e leve o quadril à frente, tronco reto.",secs:30,sides:true,
   a:{prop:"mat",elbow:1,knee:-1,frames:[{sh:[122,56],hip:[122,106],hN:[142,100],hF:[142,100],fN:[160,139],fF:[82,139]},{sh:[137,58],hip:[134,110],hN:[150,104],hF:[150,104],fN:[160,139],fF:[82,139]}],seq:[0,1],move:1.5,hold:2}},
  {name:"Quadríceps em pé",cue:"Mão na parede, puxe o calcanhar em direção ao glúteo, joelhos alinhados. No joelho operado, só até sentir tensão leve.",secs:30,sides:true,
   a:{prop:"wall",elbow:1,knee:-1,frames:[{sh:[130,24],hip:[130,76],hN:[132,72],hF:[176,50],fN:[130,138],fF:[132,138],toe:[141,140]},{sh:[130,24],hip:[130,76],hN:[117,77],hF:[176,50],fN:[116,79],fF:[132,138],toe:[111,70]}],seq:[0,1],move:1.5,hold:2}},
  {name:"Posterior de coxa com toalha",cue:"Deitado, perna estendida para cima com a toalha no pé e a outra no chão. Tensão leve: é a região do enxerto.",secs:30,sides:true,
   a:{prop:"mat",strap:true,elbow:-1,knee:1,frames:[{sh:[170,132],hip:[120,133],hN:[140,112],fN:[98,104],fF:[58,136]},{sh:[170,132],hip:[120,133],hN:[150,100],fN:[126,70],fF:[58,136]}],seq:[0,1],move:1.5,hold:2}},
  {name:"Glúteo em figura 4",cue:"Deitado, cruze o tornozelo sobre o joelho oposto e puxe a coxa de baixo em direção ao peito.",secs:30,sides:true,
   a:{prop:"mat",elbow:-1,knee:1,frames:[{sh:[170,132],hip:[125,133],hN:[124,139],fN:[96,139],fF:[92,139]},{sh:[170,132],hip:[125,133],hN:[128,120],fN:[106,110],fF:[92,139]},{sh:[170,132],hip:[125,133],hN:[128,110],fN:[128,100],fF:[100,98]}],seq:[0,1,2],move:1.3,hold:1.2}},
  {name:"Panturrilha na parede",cue:"Mãos na parede, perna de trás estendida com o calcanhar no chão. Incline o corpo à frente.",secs:30,sides:true,
   a:{prop:"wall",elbow:1,knee:-1,frames:[{sh:[128,32],hip:[116,82],hN:[176,54],fN:[138,138],fF:[92,138],toe:[148,140]},{sh:[148,40],hip:[124,86],hN:[176,52],fN:[138,138],fF:[92,138],toe:[148,140]}],seq:[0,1],move:1.5,hold:2}},
  {name:"Peitoral na porta",cue:"Antebraço no batente, cotovelo na altura do ombro. Dê um passo à frente até sentir o peito abrir.",secs:30,sides:true,
   a:{prop:"jamb",elbow:-1,knee:-1,frames:[{sh:[134,26],hip:[134,78],hN:[123,-2],fN:[140,138],fF:[128,138],toe:[150,140]},{sh:[152,28],hip:[148,78],hN:[123,-2],fN:[170,138],fF:[132,138],toe:[180,140]}],seq:[0,1],move:1.5,hold:2}},
  {name:"Joelhos ao peito",cue:"Deitado, abrace as coxas por trás dos joelhos e traga-as ao peito. Solte a lombar e respire.",secs:40,
   a:{prop:"mat",elbow:-1,knee:1,frames:[{sh:[170,132],hip:[125,133],hN:[122,139],fN:[92,139]},{sh:[170,132],hip:[125,131],hN:[140,108],fN:[112,104]}],seq:[0,1],move:1.5,hold:2}}
];
const PREP=5;
const ST_STEPS=[]; STRETCH.forEach((x,i)=>{ if(x.sides){ ST_STEPS.push({i,side:"Lado direito",secs:x.secs}); ST_STEPS.push({i,side:"Lado esquerdo",secs:x.secs}); } else ST_STEPS.push({i,side:"",secs:x.secs}); });
const st={on:false,paused:false,k:0,stepStart:0,pausedAt:0,t0:0,done:false,lastWhole:null,phase:"idle"};
function stTotalLeft(){ let t=0; for(let j=st.k;j<ST_STEPS.length;j++) t+=ST_STEPS[j].secs+PREP; if(st.on){ t-=Math.min(ST_STEPS[st.k].secs+PREP,((st.paused?st.pausedAt:performance.now())-st.stepStart)/1000); } return Math.max(0,t); }
function buildStretchList(){
  $("stList").innerHTML=STRETCH.map((x,i)=>`<div class="st" data-i="${i}"><canvas class="anim stc" aria-label="Animação: ${x.name}"></canvas><div class="grow"><div class="n">${i+1}</div><div class="t1">${x.name}</div><div class="t2">${x.cue}</div></div><span class="dur">${x.sides?x.secs+" s × 2":x.secs+" s"}</span></div>`).join("");
  const b=document.createElement("button"); b.type="button"; b.className="btn"; b.id="stManual"; b.textContent="Já fiz, só registrar";
  $("stReset").parentNode.appendChild(b); collectStretchCanvases();
  b.addEventListener("click",()=>{ addRecord("stretch",{id:uid(),day:dayKey(),ts:Date.now(),secs:0}); toast("Alongamento registrado"); });
}
const stCards=[];
function collectStretchCanvases(){ stCards.length=0; document.querySelectorAll("#stList .st").forEach((r,i)=>{ const cv=r.querySelector("canvas"); stCards.push({cv,ctx:cv.getContext("2d"),a:STRETCH[i].a,off:i*.41}); }); }
function showStretchSec(on){ $("wPlayer").hidden=on; $("grid").hidden=on; $("stretchSec").hidden=!on; if(on) $("sunday").hidden=true; }
function showStretch(){ showStretchSec(true); ["A","B","C","S"].forEach(k=>$("tab"+k).setAttribute("aria-selected",k==="S"?"true":"false")); stUI(); }
function stReset(){ Object.assign(st,{on:false,paused:false,k:0,done:false,lastWhole:null,phase:"idle"}); $("stStart").textContent="Iniciar"; stUI(); }
function stGo(k){
  if(k>=ST_STEPS.length){ st.on=false; st.done=true; st.phase="done"; $("stStart").textContent="Recomeçar"; beep(880,.6); releaseWake();
    addRecord("stretch",{id:uid(),day:dayKey(),ts:Date.now(),secs:Math.round((performance.now()-st.t0)/1000)}); toast("Alongamento registrado"); stUI(); return; }
  st.k=Math.max(0,k); st.stepStart=performance.now(); st.lastWhole=null; st.phase="prep"; stUI();
}
$("stStart").addEventListener("click",()=>{
  if(!audio){ try{ audio=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} }
  if(audio&&audio.state==="suspended") audio.resume();
  if(st.done) stReset();
  if(!st.on){ st.on=true; st.paused=false; st.t0=performance.now(); requestWake(); $("stStart").textContent="Pausar"; stGo(0); return; }
  if(st.paused){ st.paused=false; st.stepStart+=performance.now()-st.pausedAt; $("stStart").textContent="Pausar"; }
  else { st.paused=true; st.pausedAt=performance.now(); $("stStart").textContent="Continuar"; }
  stUI();
});
$("stSkip").addEventListener("click",()=>{ if(st.on&&!st.paused) stGo(st.k+1); });
$("stReset").addEventListener("click",stReset);
function stTick(){
  if(!st.on||st.paused) return;
  const el=(performance.now()-st.stepStart)/1000, s=ST_STEPS[st.k];
  if(el<PREP){ st.phase="prep"; }
  else { if(st.phase==="prep"){ st.phase="hold"; beep(880,.3); }
    const left=s.secs-(el-PREP), w=Math.ceil(left);
    if(w!==st.lastWhole&&w<=3&&w>=1) beep(660,.12); st.lastWhole=w;
    if(left<=0){ beep(520,.3); stGo(st.k+1); return; } }
  if(view==="treino") stUI();
}
function stUI(){
  const s=ST_STEPS[Math.min(st.k,ST_STEPS.length-1)], x=STRETCH[s.i];
  const el=st.on?((st.paused?st.pausedAt:performance.now())-st.stepStart)/1000:0;
  const ph=$("stPhase");
  if(st.done){ ph.className="phase"; ph.textContent="Concluído"; $("stName").textContent="Alongamento feito"; $("stSide").textContent="Registrado"; $("stCue").textContent="Bom trabalho. Até a próxima."; $("stBig").textContent="0"; $("stNext").textContent=""; }
  else {
    $("stName").textContent=x.name; $("stSide").textContent=(s.side||"Alongamento guiado"); $("stCue").textContent=x.cue;
    const nx=ST_STEPS[st.k+1]; $("stNext").textContent=nx?"Depois: "+STRETCH[nx.i].name+(nx.side?" · "+nx.side.toLowerCase():""):"Último passo";
    if(!st.on){ ph.className="phase idle"; ph.textContent="Pronto"; $("stBig").textContent=s.secs; }
    else if(st.paused){ ph.className="phase idle"; ph.textContent="Pausado"; }
    else if(el<PREP){ ph.className="phase rest"; ph.textContent="Posicione-se"; $("stBig").textContent=Math.ceil(PREP-el); }
    else { ph.className="phase"; ph.textContent="Segure"; $("stBig").textContent=Math.max(0,Math.ceil(s.secs-(el-PREP))); }
  }
  const hold=Math.max(0,el-PREP); $("stBar").className="bar"+(st.on&&el<PREP?" rest":"");
  $("stBarFill").style.width=(st.done?100:st.on?(el<PREP?el/PREP:Math.min(1,hold/s.secs))*100:0).toFixed(1)+"%";
  $("stStep").textContent=(st.done?ST_STEPS.length:st.k+1)+"/"+ST_STEPS.length;
  $("stLeft").textContent=fmtClock(st.done?0:stTotalLeft());
  document.querySelectorAll("#stList .st").forEach(r=>r.classList.toggle("active",st.on&&!st.done&&+r.dataset.i===s.i));
}

// ================= Tasks (casa) =================
function saveTask(t){ S.tasks=Object.assign({},S.tasks,{[t.id]:t}); renderAll(); enqueue(()=>sb.from("tasks").upsert(taskToRow(t))); }
function delTask(id){ const o=Object.assign({},S.tasks); delete o[id]; S.tasks=o; renderAll(); enqueue(()=>sb.from("tasks").delete().eq("id",id)); }
function addTask(title,due){ title=String(title||"").trim(); if(!title) return false; saveTask({id:uid(),title:title.slice(0,300),done:false,createdAt:Date.now(),due:due||""}); return true; }
function openTasks(){ return Object.values(S.tasks).filter(t=>!t.done).sort((a,b)=>{ const da=a.due||"9999", db=b.due||"9999"; return da<db?-1:da>db?1:(a.createdAt||0)-(b.createdAt||0); }); }
function dueLabel(t){
  if(!t.due) return ""; const n=diffDays(t.due,dayKey());
  const txt=n<0?"atrasada ("+t.due.slice(8)+"/"+t.due.slice(5,7)+")":n===0?"hoje":n===1?"amanhã":t.due.slice(8)+"/"+t.due.slice(5,7);
  return `<span class="due${n<0?" late":""}">${txt}</span>`;
}
function taskHTML(t){
  return `<div class="task${t.done?" done":""}"><input type="checkbox" data-id="${esc(t.id)}" ${t.done?"checked":""} aria-label="Concluir: ${esc(t.title)}">
    <div class="grow"><div class="t1">${esc(t.title)}</div>${dueLabel(t)}</div><button type="button" class="x" data-del="${esc(t.id)}" aria-label="Excluir tarefa">✕</button></div>`;
}
function wireTaskList(el){
  el.addEventListener("change",e=>{ const id=e.target.dataset&&e.target.dataset.id; const t=id&&S.tasks[id]; if(!t) return;
    saveTask(Object.assign({},t,{done:e.target.checked,doneAt:e.target.checked?Date.now():0})); if(e.target.checked) toast("Tarefa concluída"); });
  el.addEventListener("click",e=>{ const b=e.target.closest("[data-del]"); if(b){ delTask(b.dataset.del); toast("Tarefa excluída"); } });
}
["hTasks","taskList","doneList"].forEach(id=>wireTaskList($(id)));
$("hTaskForm").addEventListener("submit",e=>{ e.preventDefault(); if(addTask($("hTaskIn").value)) $("hTaskIn").value=""; });
$("taskForm").addEventListener("submit",e=>{ e.preventDefault(); if(addTask($("taskIn").value,$("taskDue").value)){ $("taskIn").value=""; $("taskDue").value=""; } });
twoStep($("clearDone"),"Toque de novo para limpar",()=>{ Object.values(S.tasks).filter(t=>t.done).forEach(t=>delTask(t.id)); toast("Concluídas removidas"); });
function renderHomeTasks(){ const l=openTasks(); $("hTasks").innerHTML=l.length?l.slice(0,5).map(taskHTML).join("")+(l.length>5?`<div class="muted" style="font-size:14px">+${l.length-5} na aba Casa</div>`:""):'<div class="empty">Nada pendente em casa.</div>'; }
function renderCasa(){
  const l=openTasks(); $("taskList").innerHTML=l.length?l.map(taskHTML).join(""):'<div class="empty">Nada pendente. Adicione o que não pode esquecer.</div>';
  const d=Object.values(S.tasks).filter(t=>t.done).sort((a,b)=>(b.doneAt||0)-(a.doneAt||0)).slice(0,30);
  $("doneList").innerHTML=d.length?d.map(taskHTML).join(""):'<div class="empty">Nenhuma concluída ainda.</div>';
}

// ================= Saúde view =================
function renderSaude(){
  const wg=S.settings.weightGoal||90, ws=all("weights"), lw=ws[0];
  $("wNow").textContent=lw?kgFmt(lw.kg)+" kg":"—";
  $("wGoalTxt").textContent="meta "+kgFmt(wg)+" kg"+(lw?(lw.kg>wg?" · faltam "+kgFmt(lw.kg-wg)+" kg":" · meta batida"):"");
  const pts=ws.slice(0,16).reverse();
  if(pts.length<2) $("wChart").innerHTML='<div class="empty">O gráfico aparece a partir da segunda pesagem.</div>';
  else {
    const W=520,H=190,L=40,R=46,T=12,B=24;
    let lo=Math.min(wg,...pts.map(p=>p.kg))-1, hi=Math.max(wg,...pts.map(p=>p.kg))+1;
    const x=i=>L+i*(W-L-R)/(pts.length-1), y=v=>T+(hi-v)/(hi-lo)*(H-T-B);
    let g=""; const step=(hi-lo)>8?2:1;
    for(let v=Math.ceil(lo);v<=hi;v+=step){ g+=`<line class="grid" x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}"/><text x="${L-6}" y="${y(v)+4}" text-anchor="end">${v}</text>`; }
    g+=`<line class="goal" x1="${L}" x2="${W-R}" y1="${y(wg)}" y2="${y(wg)}"/><text x="${W-R+4}" y="${y(wg)+4}">meta</text>`;
    const line=pts.map((p,i)=>`${x(i).toFixed(1)},${y(p.kg).toFixed(1)}`).join(" ");
    g+=`<polyline points="${line}" fill="none" stroke="var(--water)" stroke-width="2.5" stroke-linejoin="round"/>`;
    g+=pts.map((p,i)=>`<circle cx="${x(i)}" cy="${y(p.kg)}" r="${i===pts.length-1?5:3}" fill="var(--water)"/>`).join("");
    g+=`<text x="${x(pts.length-1)+8}" y="${y(pts[pts.length-1].kg)-6}" style="fill:var(--ink);font-weight:700">${kgFmt(pts[pts.length-1].kg)}</text>`;
    g+=`<text x="${x(0)}" y="${H-6}" text-anchor="start">${pts[0].day.slice(8)}/${pts[0].day.slice(5,7)}</text><text x="${x(pts.length-1)}" y="${H-6}" text-anchor="end">${pts[pts.length-1].day.slice(8)}/${pts[pts.length-1].day.slice(5,7)}</text>`;
    $("wChart").innerHTML=`<svg class="ch" viewBox="0 0 ${W} ${H}" role="img" aria-label="Evolução do peso">${g}</svg>`;
  }
  const wl=$("wList"); const last=ws.slice(0,5);
  wl.innerHTML=last.map(p=>`<div class="item"><div class="grow"><div class="t1 num">${kgFmt(p.kg)} kg</div><div class="t2">${shortDate(p.ts)}</div></div><button class="btn danger" type="button" data-wdel="${esc(p.id)}" style="padding:6px 10px">Excluir</button></div>`).join("");
  wl.querySelectorAll("[data-wdel]").forEach(b=>{ const rec=last.find(p=>p.id===b.dataset.wdel); twoStep(b,"Confirmar",()=>removeRecord("weights",rec)); });
  // sleep 14 nights
  const nights=[]; for(let i=13;i>=0;i--){ const d=new Date(); d.setDate(d.getDate()-i); const k=dayKey(d); nights.push({k,d,sl:sleepOf(k)}); }
  const full=nights.filter(n=>n.sl&&!n.sl.partial), tgt=targetSleepMins();
  if(!full.length){ $("sleepStats").innerHTML='<span>Registre o sono no check-in de Hoje.</span>'; $("sChart").innerHTML=""; }
  else {
    const avg=full.reduce((a,n)=>a+n.sl.mins,0)/full.length;
    const bedAvg=full.reduce((a,n)=>{ let b=toMin(n.sl.bed); if(b<720) b+=1440; return a+b; },0)/full.length;
    const qs=full.filter(n=>n.sl.q); const qAvg=qs.length?qs.reduce((a,n)=>a+n.sl.q,0)/qs.length:0;
    const onTime=full.filter(n=>lateBy(n.sl.bed,S.settings.bedTarget)<=15).length;
    $("sleepStats").innerHTML=`<span>Média <b>${fmtHM(avg)}</b></span><span>Deita em média <b>${minToClock(bedAvg)}</b></span>${qAvg?`<span>Qualidade <b>${qAvg.toFixed(1).replace(".",",")}</b>/5</span>`:""}<span>No horário <b>${onTime}/${full.length}</b></span>`;
    const W=520,H=170,L=30,T=10,B=22, max=Math.max(600,...full.map(n=>n.sl.mins)), bw=(W-L)/14;
    const y=m=>T+(1-m/max)*(H-T-B);
    let g=""; for(let h=0;h<=max/60;h+=2) g+=`<line class="grid" x1="${L}" x2="${W}" y1="${y(h*60)}" y2="${y(h*60)}"/><text x="${L-6}" y="${y(h*60)+4}" text-anchor="end">${h}h</text>`;
    nights.forEach((n,i)=>{ const x=L+i*bw+bw*.18, w=bw*.64;
      if(n.sl&&!n.sl.partial) g+=`<rect x="${x}" y="${y(n.sl.mins)}" width="${w}" height="${H-B-y(n.sl.mins)}" rx="3" fill="var(--sleep)" opacity="${n.sl.mins>=tgt-30?1:.5}"><title>${fmtHM(n.sl.mins)}${n.sl.q?" · qualidade "+n.sl.q:""}</title></rect>`;
      g+=`<text x="${x+w/2}" y="${H-6}" text-anchor="middle">${WD[n.d.getDay()][0]}</text>`; });
    g+=`<line class="goal" x1="${L}" x2="${W}" y1="${y(tgt)}" y2="${y(tgt)}"/>`;
    $("sChart").innerHTML=`<svg class="ch" viewBox="0 0 ${W} ${H}" role="img" aria-label="Horas de sono nas últimas 14 noites">${g}</svg>`;
  }
  // 30-day habits
  const days=[]; for(let i=29;i>=0;i--){ const d=new Date(); d.setDate(d.getDate()-i); days.push(dayKey(d)); }
  const goal=S.settings.waterGoal||8, rg=S.settings.readGoalMin||20, wdays=new Set(all("workouts").map(x=>x.day));
  const rows=[["Oração da manhã",k=>dayDoc(k).oracao,"--spirit"],["Terço",k=>dayDoc(k).terco,"--spirit"],["Exame de consciência",k=>dayDoc(k).exame,"--spirit"],
    ["Água na meta",k=>(dayDoc(k).water||0)>=goal,"--water"],["Vitamina D",k=>dayDoc(k).vitd,"--water"],["Treino",k=>wdays.has(k),"--accent"],["Leitura na meta",k=>readMinOn(k)>=rg,"--read"]];
  $("habitPct").innerHTML=rows.map(r=>{ const n=days.filter(r[1]).length; return `<div class="pct"><span>${r[0]}</span><span class="bar"><i style="width:${n/30*100}%;background:var(${r[2]})"></i></span><span class="num">${n}/30</span></div>`; }).join("");
  const cf=all("confession").slice(0,6);
  $("confHist").textContent=cf.length?"Confissões: "+cf.map(c=>c.day.slice(8)+"/"+c.day.slice(5,7)).join(", "):"Nenhuma confissão registrada ainda.";
}

// ================= Loop & init =================
function renderAll(){ if(view==="hoje"){ renderHoje(); renderCheckin(); renderHomeTasks(); } if(view==="treino") renderTreino(); if(view==="leitura") renderLeitura(); if(view==="saude") renderSaude(); if(view==="casa") renderCasa(); }
function tick(now){
  if(!alive) return;
  if(now-lastColors>1000){ lastColors=now; readColors(); }
  if(started&&!finished){ const left=stepLeft(); if(left!=null){ const w=Math.ceil(left); if(w!==lastWhole&&w<=3&&w>=1) beep(660,.12); lastWhole=w; if(left<=0) goTo(idx+1); } updateUI(); }
  stTick(); if(view==="treino"&&!$("stretchSec").hidden){ const t=now/1000, sc=$("stCanvas"); const cur=STRETCH[ST_STEPS[Math.min(st.k,ST_STEPS.length-1)].i];
    draw(sc.getContext("2d"),sc,cur.a,t); stCards.forEach(c=>draw(c.ctx,c.cv,c.a,t+c.off)); }
  if(view==="treino"&&$("stretchSec").hidden){ const t=now/1000, step=plan[idx], k=WORKOUTS[current].ex[step?step.e:0];
    draw(stage.ctx,stage.cv,EX[k],t); cards.forEach(c=>draw(c.ctx,c.cv,c.ex,t+c.off)); }
  rafId=requestAnimationFrame(tick);
}
buildWeek(); buildTabs(); buildStretchList();
{ const w=ROT[monIdx()]; select(w==="D7"?"A":w, monIdx()); if(w==="D7") $("sunday").hidden=false; }
let startView="hoje";
const hv=(location.hash||"").slice(1); if(VIEWS.includes(hv)) startView=hv;
else { try{ const s=localStorage.getItem("rv_view"); if(VIEWS.includes(s)) startView=s; }catch(e){} }
go(startView);
rafId=requestAnimationFrame(tick);
$("signOut").addEventListener("click",()=>{ flushDays(); queue.then(()=>ctx.onSignOut()); });
loadAll();


return () => {
  alive = false;
  cancelAnimationFrame(rafId);
  AC.abort();
  try { clearInterval(rt.int); } catch (e) {}
  try { flushDays(); } catch (e) {}
  try { releaseWake(); } catch (e) {}
  root.innerHTML = "";
};
}
