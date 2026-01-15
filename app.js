// =====================================================
// Personalizados — Canvas Mockup (Camiseta & Caneca)
// Assets:
//  - assets/tshirt.png   (frente à esquerda, verso à direita)
//  - assets/mug-blue.png (duas canecas; usamos a da direita)
// =====================================================

// ---------- Estado ----------
const state = {
  product: "tshirt",   // "tshirt" | "mug"
  side: "front",       // "front" | "back" (camiseta)
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  rotateDeg: 0,
  artImg: null,
};

// ---------- Canvas ----------
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const statusMsg = document.getElementById("statusMsg");
const downloadLink = document.getElementById("downloadLink");

// Ano footer
document.getElementById("year").textContent = new Date().getFullYear();

// Inputs
const fileInput = document.getElementById("fileInput");
const dropzone = document.getElementById("dropzone");
const scaleEl = document.getElementById("scale");
const offsetXEl = document.getElementById("offsetX");
const offsetYEl = document.getElementById("offsetY");
const rotateEl = document.getElementById("rotate");

// Botões
document.getElementById("btnExport").addEventListener("click", exportPNG);
document.getElementById("btnReset").addEventListener("click", resetAll);
document.getElementById("btnCenter").addEventListener("click", centerArt);
document.getElementById("btnClearArt").addEventListener("click", clearArt);

// Segmentados produto
document.querySelectorAll('[data-product]').forEach(btn => {
  btn.addEventListener("click", () => setProduct(btn.dataset.product));
});

// Segmentados lado
document.querySelectorAll('[data-side]').forEach(btn => {
  btn.addEventListener("click", () => setSide(btn.dataset.side));
});

function setActive(selector, value, attr){
  document.querySelectorAll(selector).forEach(b => {
    b.classList.toggle("is-active", b.getAttribute(attr) === value);
  });
}

// Sliders
scaleEl.addEventListener("input", () => { state.scale = parseFloat(scaleEl.value); render(); });
offsetXEl.addEventListener("input", () => { state.offsetX = parseInt(offsetXEl.value, 10); render(); });
offsetYEl.addEventListener("input", () => { state.offsetY = parseInt(offsetYEl.value, 10); render(); });
rotateEl.addEventListener("input", () => { state.rotateDeg = parseFloat(rotateEl.value); render(); });

// Upload (click)
fileInput.addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  await loadArtFile(file);
});

// Drag & drop
["dragenter","dragover"].forEach(ev => {
  dropzone.addEventListener(ev, (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });
});
["dragleave","drop"].forEach(ev => {
  dropzone.addEventListener(ev, (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
  });
});
dropzone.addEventListener("drop", async (e) => {
  const file = e.dataTransfer.files?.[0];
  if (!file) return;
  await loadArtFile(file);
});

// Enter abre seletor
dropzone.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") fileInput.click();
});

// ---------- Assets ----------
const ASSETS = {
  tshirt: { img: null },
  mug: { img: null, crop: null, blueMap: null }
};

(async function boot(){
  setStatus("Carregando assets...", false);
  try{
    ASSETS.tshirt.img = await loadImage("assets/tshirt.png");
    ASSETS.mug.img = await loadImage("assets/mug-blue.png");

    // Prepara crop da caneca (usamos a metade direita)
    ASSETS.mug.crop = makeRightHalfCrop(ASSETS.mug.img);

    // Detecta área azul dentro do crop (top/bottom por coluna)
    ASSETS.mug.blueMap = buildBlueColumnMap(ASSETS.mug.crop);

    setStatus("Pronto ✅", true);
  }catch(err){
    console.error(err);
    setStatus("Falha ao carregar assets. Veja se estão em /assets.", false);
  }finally{
    syncUI();
    render();
  }
})();

// ---------- UI / Status ----------
function setStatus(msg, ok=false){
  statusMsg.textContent = msg;
  statusMsg.style.color = ok ? "rgba(53,195,138,.95)" : "rgba(154,164,178,.95)";
}

function syncUI(){
  setActive('.segmented__btn[data-product]', state.product, 'data-product');
  setActive('.segmented__btn[data-side]', state.side, 'data-side');

  // Desativa/oculta lado quando for caneca
  const sideGroup = document.getElementById("sideGroup");
  if (state.product === "mug") {
    sideGroup.style.opacity = "0.55";
    sideGroup.style.pointerEvents = "none";
  } else {
    sideGroup.style.opacity = "1";
    sideGroup.style.pointerEvents = "auto";
  }
}

function setProduct(productKey){
  if (!["tshirt","mug"].includes(productKey)) return;
  state.product = productKey;
  setStatus(productKey === "tshirt" ? "Camiseta selecionada" : "Caneca selecionada", true);
  syncUI();
  render();
}

function setSide(side){
  if (!["front","back"].includes(side)) return;
  state.side = side;
  setStatus(side === "front" ? "Camiseta: Frente" : "Camiseta: Verso", true);
  syncUI();
  render();
}

// ---------- Arte ----------
async function loadArtFile(file){
  if (!file.type.startsWith("image/")) {
    setStatus("Arquivo inválido. Envie uma imagem.", false);
    return;
  }
  setStatus("Carregando arte...", false);

  const url = URL.createObjectURL(file);
  try{
    const img = await loadImage(url);
    state.artImg = img;

    // Reset leve
    centerArt();
    state.scale = 1;
    state.rotateDeg = 0;
    scaleEl.value = "1";
    rotateEl.value = "0";

    setStatus("Arte carregada ✅", true);
    render();
  } catch (err){
    console.error(err);
    setStatus("Falha ao carregar a imagem.", false);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function centerArt(){
  state.offsetX = 0;
  state.offsetY = 0;
  offsetXEl.value = "0";
  offsetYEl.value = "0";
  render();
}

function clearArt(){
  state.artImg = null;
  setStatus("Arte removida.", true);
  render();
}

function resetAll(){
  state.product = "tshirt";
  state.side = "front";
  state.artImg = null;
  state.scale = 1;
  state.offsetX = 0;
  state.offsetY = 0;
  state.rotateDeg = 0;

  scaleEl.value = "1";
  offsetXEl.value = "0";
  offsetYEl.value = "0";
  rotateEl.value = "0";

  syncUI();
  setStatus("Resetado ✅", true);
  render();
}

// ---------- Render ----------
function render(){
  ctx.clearRect(0,0,canvas.width, canvas.height);

  drawBackground(ctx);

  if (state.product === "tshirt") {
    renderTshirt(ctx);
  } else {
    renderMug(ctx);
  }

  drawFooterLabel(ctx);
}

function drawBackground(ctx){
  const g = ctx.createLinearGradient(0,0,900,900);
  g.addColorStop(0, "rgba(255,255,255,0.05)");
  g.addColorStop(1, "rgba(255,255,255,0.00)");
  ctx.fillStyle = g;
  ctx.fillRect(0,0,900,900);
}

// ---------- Camiseta (mockup real) ----------
function renderTshirt(ctx){
  const img = ASSETS.tshirt.img;
  if (!img) {
    drawLoading(ctx, "Carregando camiseta...");
    return;
  }

  // A imagem tem duas camisetas (frente esquerda, verso direita)
  const halfW = Math.floor(img.width / 2);
  const sx = (state.side === "front") ? 0 : halfW;
  const sy = 0;
  const sw = halfW;
  const sh = img.height;

  // Desenha o recorte no canvas (fit contain)
  const dest = containFitRect(sw, sh, 900, 900, 40); // margem 40
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, sx, sy, sw, sh, dest.x, dest.y, dest.w, dest.h);

  // Define área de impressão (percentual do mockup)
  // Ajuste fino depois, mas já fica bom e “natural”
  const print = {
    x: dest.x + dest.w * 0.28,
    y: dest.y + dest.h * 0.28,
    w: dest.w * 0.44,
    h: dest.h * 0.48
  };

  if (!state.artImg) {
    drawPrintAreaHint(ctx, print);
    return;
  }

  // Desenha arte (clippada na área)
  drawArtFlatInArea(ctx, state.artImg, print, {
    scale: state.scale,
    offsetX: state.offsetX,
    offsetY: state.offsetY,
    rotateDeg: state.rotateDeg
  });

  // “Realismo” leve: aplica sombras do próprio mockup por cima (multiply)
  // A gente extrai uma camada de sombra aproximada do próprio desenho:
  applyFabricShading(ctx, dest);
}

// Extrai sombra aproximada do mockup (ajuda a “entrar nas dobras”)
function applyFabricShading(ctx, dest){
  // pega um pedaço do que já está no canvas e reaplica em multiply
  // isso dá aquele “acabamento” sem precisar de mapa separado.
  const imgData = ctx.getImageData(dest.x, dest.y, dest.w, dest.h);
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.globalAlpha = 0.35; // controla força
  ctx.putImageData(imgData, dest.x, dest.y);
  ctx.restore();
}

// ---------- Caneca (mockup real + warp seguindo área azul) ----------
function renderMug(ctx){
  const base = ASSETS.mug.crop;
  const blueMap = ASSETS.mug.blueMap;
  if (!base || !blueMap) {
    drawLoading(ctx, "Carregando caneca...");
    return;
  }

  // Base crop é “metade direita” do arquivo original
  // Fit contain no canvas
  const dest = containFitRect(base.w, base.h, 900, 900, 60);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Desenha base
  ctx.drawImage(base.source, base.sx, base.sy, base.sw, base.sh, dest.x, dest.y, dest.w, dest.h);

  // Sem arte? mostra dica rápida
  if (!state.artImg) {
    // desenha contorno leve da área azul detectada (opcional)
    drawMugBlueHint(ctx, dest, blueMap);
    return;
  }

  // Warp da arte:
  // 1) aplica rotação/scale/offset numa “arte normalizada”
  // 2) desenha por tiras com curvatura + limites top/bottom por coluna (blueMap)
  warpArtIntoMugBlue(ctx, state.artImg, dest, blueMap, {
    scale: state.scale,
    offsetX: state.offsetX,
    offsetY: state.offsetY,
    rotateDeg: state.rotateDeg
  });

  // Realce leve: pega o brilho/sombra do mockup por cima
  applyMugShading(ctx, dest);
}

function drawMugBlueHint(ctx, dest, blueMap){
  // marca a região média só pra guiar
  const midTop = blueMap.top[Math.floor(blueMap.top.length * 0.5)];
  const midBot = blueMap.bot[Math.floor(blueMap.bot.length * 0.5)];
  if (midTop == null || midBot == null) return;

  const y1 = dest.y + (midTop / blueMap.h) * dest.h;
  const y2 = dest.y + (midBot / blueMap.h) * dest.h;

  ctx.save();
  ctx.strokeStyle = "rgba(77,163,255,0.55)";
  ctx.setLineDash([10,8]);
  ctx.lineWidth = 3;
  roundRect(ctx, dest.x + dest.w*0.20, y1, dest.w*0.60, Math.max(40, y2-y1), 16);
  ctx.stroke();
  ctx.restore();
}

function applyMugShading(ctx, dest){
  const imgData = ctx.getImageData(dest.x, dest.y, dest.w, dest.h);
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.globalAlpha = 0.30;
  ctx.putImageData(imgData, dest.x, dest.y);
  ctx.restore();
}

// ---------- Desenho da arte (plano) ----------
function drawArtFlatInArea(ctx, img, area, t){
  ctx.save();
  roundRect(ctx, area.x, area.y, area.w, area.h, 18);
  ctx.clip();

  // fundo leve
  ctx.fillStyle = "rgba(0,0,0,0.05)";
  ctx.fillRect(area.x, area.y, area.w, area.h);

  const cx = area.x + area.w/2 + t.offsetX;
  const cy = area.y + area.h/2 + t.offsetY;

  const fit = containFit(img.width, img.height, area.w, area.h);
  const drawW = fit.w * t.scale;
  const drawH = fit.h * t.scale;

  ctx.translate(cx, cy);
  ctx.rotate((t.rotateDeg * Math.PI) / 180);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, -drawW/2, -drawH/2, drawW, drawH);

  ctx.restore();

  // borda sutil
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.10)";
  ctx.lineWidth = 2;
  roundRect(ctx, area.x, area.y, area.w, area.h, 18);
  ctx.stroke();
  ctx.restore();
}

// ---------- Warp da arte na caneca ----------
function warpArtIntoMugBlue(ctx, art, dest, blueMap, t){
  // Pré-renderiza a arte transformada num canvas auxiliar
  const tmp = document.createElement("canvas");
  const tmpCtx = tmp.getContext("2d");

  // define “canvas da arte” grande o suficiente
  tmp.width = 1200;
  tmp.height = 1200;

  // desenha arte centralizada com transform
  tmpCtx.clearRect(0,0,tmp.width,tmp.height);
  tmpCtx.save();
  tmpCtx.translate(tmp.width/2 + t.offsetX, tmp.height/2 + t.offsetY);
  tmpCtx.rotate((t.rotateDeg * Math.PI) / 180);

  const fit = containFit(art.width, art.height, 900, 900);
  const drawW = fit.w * t.scale;
  const drawH = fit.h * t.scale;

  tmpCtx.imageSmoothingEnabled = true;
  tmpCtx.imageSmoothingQuality = "high";
  tmpCtx.drawImage(art, -drawW/2, -drawH/2, drawW, drawH);
  tmpCtx.restore();

  // Agora “embrulha” por tiras
  // Curvatura por seno/cosseno (simula cilindro)
  const slices = 140; // mais = mais suave
  const cropW = blueMap.w;
  const cropH = blueMap.h;

  ctx.save();

  // recorte “onde existe azul” — usa top/bot por coluna
  // desenhamos apenas nas colunas válidas
  for (let i=0; i<slices; i++){
    const u0 = i / slices;
    const u1 = (i+1) / slices;

    // cilindro: theta [-a, a]
    const a = Math.PI * 0.90;
    const theta0 = (u0 - 0.5) * a;
    const theta1 = (u1 - 0.5) * a;

    const x0 = 0.5 + Math.sin(theta0) * 0.5;
    const x1 = 0.5 + Math.sin(theta1) * 0.5;

    // largura da tira “aperta” nas laterais
    const xCanvas0 = dest.x + x0 * dest.w;
    const xCanvas1 = dest.x + x1 * dest.w;

    const wCanvas = Math.max(1, xCanvas1 - xCanvas0);

    // coluna correspondente no crop da caneca (para top/bot)
    const col = Math.floor(((u0+u1)/2) * cropW);
    const top = blueMap.top[col];
    const bot = blueMap.bot[col];

    if (top == null || bot == null) continue;

    const yTop = dest.y + (top / cropH) * dest.h;
    const yBot = dest.y + (bot / cropH) * dest.h;
    const hCanvas = Math.max(2, yBot - yTop);

    // Fonte: pega uma tira vertical do tmp canvas
    // (usamos a área central do tmp como “janela”)
    const srcX = Math.floor(tmp.width * (0.5 + (u0 - 0.5) * 0.70));
    const srcW = Math.max(1, Math.floor(tmp.width * 0.70 / slices));
    const srcY = Math.floor(tmp.height * 0.20);
    const srcH = Math.floor(tmp.height * 0.60);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(tmp, srcX, srcY, srcW, srcH, xCanvas0, yTop, wCanvas, hCanvas);
  }

  ctx.restore();
}

// ---------- UI Helpers ----------
function drawPrintAreaHint(ctx, area){
  ctx.save();
  ctx.strokeStyle = "rgba(77,163,255,0.55)";
  ctx.setLineDash([10,8]);
  ctx.lineWidth = 3;
  roundRect(ctx, area.x, area.y, area.w, area.h, 16);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "rgba(77,163,255,0.08)";
  roundRect(ctx, area.x, area.y, area.w, area.h, 16);
  ctx.fill();

  ctx.fillStyle = "rgba(232,237,243,0.75)";
  ctx.font = "700 22px system-ui";
  ctx.fillText("Área de impressão", area.x + 18, area.y + 38);
  ctx.restore();
}

function drawFooterLabel(ctx){
  const txt = (state.product === "tshirt")
    ? `Camiseta — ${state.side === "front" ? "Frente" : "Verso"}`
    : "Caneca — Curvatura automática";

  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  roundRect(ctx, 22, 840, 856, 44, 14);
  ctx.fill();

  ctx.fillStyle = "rgba(232,237,243,0.85)";
  ctx.font = "700 18px system-ui";
  ctx.fillText(txt, 40, 869);
  ctx.restore();
}

function drawLoading(ctx, text){
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  roundRect(ctx, 120, 410, 660, 80, 16);
  ctx.fill();
  ctx.fillStyle = "rgba(232,237,243,0.85)";
  ctx.font = "800 22px system-ui";
  ctx.fillText(text, 160, 458);
  ctx.restore();
}

// ---------- Export ----------
function exportPNG(){
  const dataUrl = canvas.toDataURL("image/png");
  downloadLink.href = dataUrl;
  downloadLink.style.display = "inline-flex";
  downloadLink.textContent = "Baixar mockup.png";
  downloadLink.click();
}

// ---------- Image utils ----------
function loadImage(url){
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function containFit(srcW, srcH, dstW, dstH){
  const r = Math.min(dstW/srcW, dstH/srcH);
  return { w: Math.round(srcW*r), h: Math.round(srcH*r) };
}

function containFitRect(srcW, srcH, dstW, dstH, margin=0){
  const wMax = dstW - margin*2;
  const hMax = dstH - margin*2;
  const fit = containFit(srcW, srcH, wMax, hMax);
  return {
    x: Math.round((dstW - fit.w)/2),
    y: Math.round((dstH - fit.h)/2),
    w: fit.w,
    h: fit.h
  };
}

function roundRect(ctx, x, y, w, h, r){
  const radius = Math.min(r, w/2, h/2);
  ctx.beginPath();
  ctx.moveTo(x+radius, y);
  ctx.arcTo(x+w, y, x+w, y+h, radius);
  ctx.arcTo(x+w, y+h, x, y+h, radius);
  ctx.arcTo(x, y+h, x, y, radius);
  ctx.arcTo(x, y, x+w, y, radius);
  ctx.closePath();
}

// ---------- Mug: crop & blue detection ----------
function makeRightHalfCrop(img){
  const sx = Math.floor(img.width/2);
  const sy = 0;
  const sw = img.width - sx;
  const sh = img.height;
  return { source: img, sx, sy, sw, sh, w: sw, h: sh };
}

function buildBlueColumnMap(crop){
  // Desenha o crop num canvas auxiliar e lê pixels
  const c = document.createElement("canvas");
  c.width = crop.sw;
  c.height = crop.sh;
  const cctx = c.getContext("2d");
  cctx.drawImage(crop.source, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, crop.sw, crop.sh);

  const imgData = cctx.getImageData(0,0,crop.sw,crop.sh);
  const data = imgData.data;

  const top = new Array(crop.sw).fill(null);
  const bot = new Array(crop.sw).fill(null);

  // Threshold para “azul” (se precisar, ajustamos depois)
  // regra: B e G altos, R mais baixo
  const isBlue = (r,g,b,a) => {
    if (a < 10) return false;
    // azul bem forte:
    return (b > 120 && g > 90 && r < 120 && (b - r) > 40);
  };

  for (let x=0; x<crop.sw; x++){
    let t = null, btm = null;

    // varre de cima pra achar primeiro azul
    for (let y=0; y<crop.sh; y++){
      const idx = (y*crop.sw + x)*4;
      const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
      if (isBlue(r,g,b,a)) { t = y; break; }
    }

    // varre de baixo pra achar último azul
    for (let y=crop.sh-1; y>=0; y--){
      const idx = (y*crop.sw + x)*4;
      const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
      if (isBlue(r,g,b,a)) { btm = y; break; }
    }

    // valida altura mínima
    if (t != null && btm != null && (btm - t) > crop.sh*0.15){
      top[x] = t;
      bot[x] = btm;
    }
  }

  // “Suaviza” colunas vazias interpolando vizinhas
  fillGapsLinear(top);
  fillGapsLinear(bot);

  return { top, bot, w: crop.sw, h: crop.sh };
}

function fillGapsLinear(arr){
  // encontra segmentos nulos e interpola
  let i=0;
  while (i<arr.length){
    if (arr[i] != null){ i++; continue; }
    const start = i-1;
    let j = i;
    while (j<arr.length && arr[j]==null) j++;
    const end = j; // primeiro não-nulo após gap

    const v0 = (start>=0) ? arr[start] : null;
    const v1 = (end<arr.length) ? arr[end] : null;

    if (v0==null && v1==null){
      // tudo nulo, deixa
      for (let k=i; k<end; k++) arr[k]=null;
    } else if (v0==null){
      for (let k=i; k<end; k++) arr[k]=v1;
    } else if (v1==null){
      for (let k=i; k<end; k++) arr[k]=v0;
    } else {
      const len = end - start;
      for (let k=i; k<end; k++){
        const t = (k - start) / len;
        arr[k] = Math.round(v0 + (v1 - v0) * t);
      }
    }
    i = end;
  }
}
