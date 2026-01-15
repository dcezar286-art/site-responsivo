// === Estado do configurador ===
const state = {
  product: "tshirt", // tshirt | mug
  color: "white",    // white | black
  // Transform da arte
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  rotateDeg: 0,
  // Imagem do usuário (ImageBitmap / HTMLImageElement)
  artImg: null,
};

// === Produtos (PORTAS ABERTAS) ===
// Pra adicionar novos itens no futuro, você cria mais um objeto aqui com:
// - drawBase(ctx, opts)
// - printArea (x,y,w,h) onde a arte entra
const PRODUCTS = {
  tshirt: {
    name: "Camiseta",
    // Área de impressão (em coordenadas do canvas 900x900)
    printArea: { x: 260, y: 285, w: 380, h: 420 },
    drawBase: (ctx, opts) => drawTshirtBase(ctx, opts),
  },
  mug: {
    name: "Caneca",
    printArea: { x: 260, y: 330, w: 420, h: 260 },
    drawBase: (ctx, opts) => drawMugBase(ctx, opts),
  }
};

// === Canvas setup ===
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const statusMsg = document.getElementById("statusMsg");
const downloadLink = document.getElementById("downloadLink");

const elYear = document.getElementById("year");
elYear.textContent = new Date().getFullYear();

// Inputs
const fileInput = document.getElementById("fileInput");
const dropzone = document.getElementById("dropzone");
const scale = document.getElementById("scale");
const offsetX = document.getElementById("offsetX");
const offsetY = document.getElementById("offsetY");
const rotate = document.getElementById("rotate");

document.getElementById("btnExport").addEventListener("click", exportPNG);
document.getElementById("btnReset").addEventListener("click", resetAll);
document.getElementById("btnCenter").addEventListener("click", centerArt);
document.getElementById("btnClearArt").addEventListener("click", clearArt);

// Segmentados (produto/cor)
document.querySelectorAll('[data-product]').forEach(btn => {
  btn.addEventListener("click", () => setProduct(btn.getAttribute("data-product")));
});

document.querySelectorAll('[data-color]').forEach(btn => {
  btn.addEventListener("click", () => setColor(btn.getAttribute("data-color")));
});

// Cards produtos
document.querySelectorAll(".tile").forEach(tile => {
  tile.addEventListener("click", () => setProduct(tile.dataset.product));
});

// Range listeners
scale.addEventListener("input", () => { state.scale = parseFloat(scale.value); render(); });
offsetX.addEventListener("input", () => { state.offsetX = parseInt(offsetX.value, 10); render(); });
offsetY.addEventListener("input", () => { state.offsetY = parseInt(offsetY.value, 10); render(); });
rotate.addEventListener("input", () => { state.rotateDeg = parseFloat(rotate.value); render(); });

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

// Acessibilidade: Enter no dropzone abre o seletor
dropzone.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") fileInput.click();
});

// Inicializa
render();

// ======================== FUNÇÕES ========================
function setStatus(msg, ok=false){
  statusMsg.textContent = msg;
  statusMsg.classList.toggle("is-ok", ok);
}

function setProduct(productKey){
  if (!PRODUCTS[productKey]) return;
  state.product = productKey;
  setStatus(`Produto: ${PRODUCTS[productKey].name}`, true);
  syncUI();
  render();
}

function setColor(color){
  if (!["white","black"].includes(color)) return;
  state.color = color;
  setStatus(`Cor: ${color === "white" ? "Branco" : "Preto"}`, true);
  syncUI();
  render();
}

function syncUI(){
  // Produto
  document.querySelectorAll(".segmented__btn[data-product]").forEach(b => {
    b.classList.toggle("is-active", b.dataset.product === state.product);
  });
  // Cor
  document.querySelectorAll(".segmented__btn[data-color]").forEach(b => {
    b.classList.toggle("is-active", b.dataset.color === state.color);
  });
}

async function loadArtFile(file){
  // Validações básicas
  if (!file.type.startsWith("image/")) {
    setStatus("Arquivo inválido. Envie uma imagem.", false);
    return;
  }
  setStatus("Carregando arte...", false);

  // Lê como blob URL e cria ImageBitmap (melhor performance)
  const url = URL.createObjectURL(file);
  try{
    const img = await loadImage(url);

    // Se for gigantesca, ok: a gente desenha com scale dentro da área
    state.artImg = img;

    // Auto centralizar e resetar ajustes
    centerArt();
    state.scale = 1;
    state.rotateDeg = 0;
    scale.value = "1";
    rotate.value = "0";

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
  offsetX.value = "0";
  offsetY.value = "0";
  render();
}

function clearArt(){
  state.artImg = null;
  setStatus("Arte removida.", true);
  render();
}

function resetAll(){
  state.product = "tshirt";
  state.color = "white";
  state.artImg = null;
  state.scale = 1;
  state.offsetX = 0;
  state.offsetY = 0;
  state.rotateDeg = 0;

  scale.value = "1";
  offsetX.value = "0";
  offsetY.value = "0";
  rotate.value = "0";

  syncUI();
  setStatus("Resetado.", true);
  render();
}

function render(){
  // Limpa
  ctx.clearRect(0,0,canvas.width, canvas.height);

  // Fundo leve
  drawBackground(ctx);

  const product = PRODUCTS[state.product];

  // Desenha base do produto
  product.drawBase(ctx, { color: state.color });

  // Desenha a arte dentro da área de impressão
  if (state.artImg){
    drawArtInPrintArea(ctx, state.artImg, product.printArea, {
      scale: state.scale,
      offsetX: state.offsetX,
      offsetY: state.offsetY,
      rotateDeg: state.rotateDeg
    });
  } else {
    // Marca área de impressão (só pra orientar quando não tem arte)
    drawPrintAreaHint(ctx, product.printArea);
  }

  // Legenda
  drawFooterLabel(ctx, `${product.name} — ${state.color === "white" ? "Branco" : "Preto"}`);
}

function exportPNG(){
  const dataUrl = canvas.toDataURL("image/png");
  downloadLink.href = dataUrl;
  downloadLink.style.display = "inline-flex";
  downloadLink.textContent = "Baixar mockup.png";
  downloadLink.click();
}

// ======================== DESENHOS ========================
function drawBackground(ctx){
  // Gradiente simples
  const g = ctx.createLinearGradient(0,0,900,900);
  g.addColorStop(0, "rgba(255,255,255,0.04)");
  g.addColorStop(1, "rgba(255,255,255,0.00)");
  ctx.fillStyle = g;
  ctx.fillRect(0,0,900,900);
}

function drawPrintAreaHint(ctx, area){
  ctx.save();
  ctx.strokeStyle = "rgba(77,163,255,0.45)";
  ctx.setLineDash([10,8]);
  ctx.lineWidth = 3;
  roundRect(ctx, area.x, area.y, area.w, area.h, 16);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "rgba(77,163,255,0.10)";
  roundRect(ctx, area.x, area.y, area.w, area.h, 16);
  ctx.fill();

  ctx.fillStyle = "rgba(232,237,243,0.7)";
  ctx.font = "700 22px system-ui";
  ctx.fillText("Área de impressão", area.x + 18, area.y + 38);
  ctx.restore();
}

function drawFooterLabel(ctx, text){
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  roundRect(ctx, 22, 840, 856, 44, 14);
  ctx.fill();

  ctx.fillStyle = "rgba(232,237,243,0.85)";
  ctx.font = "600 18px system-ui";
  ctx.fillText(text, 40, 869);
  ctx.restore();
}

function drawTshirtBase(ctx, opts){
  const isBlack = opts.color === "black";
  ctx.save();

  // Sombra
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  roundRect(ctx, 180, 120, 540, 680, 38);
  ctx.fill();

  // Corpo (forma simples)
  ctx.fillStyle = isBlack ? "#121416" : "#f2f4f7";
  ctx.strokeStyle = isBlack ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)";
  ctx.lineWidth = 3;

  // Desenho “camiseta” com path
  ctx.beginPath();
  // gola/topo
  ctx.moveTo(320, 190);
  ctx.quadraticCurveTo(450, 120, 580, 190);
  // ombro direito
  ctx.lineTo(680, 220);
  // manga direita
  ctx.quadraticCurveTo(760, 270, 730, 360);
  ctx.lineTo(670, 340);
  // lateral direita
  ctx.lineTo(640, 760);
  // barra
  ctx.quadraticCurveTo(450, 820, 260, 760);
  // lateral esquerda
  ctx.lineTo(230, 340);
  // manga esquerda
  ctx.lineTo(170, 360);
  ctx.quadraticCurveTo(140, 270, 220, 220);
  // ombro esquerdo
  ctx.closePath();

  ctx.fill();
  ctx.stroke();

  // gola
  ctx.strokeStyle = isBlack ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.14)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(450, 210, 80, Math.PI*1.05, Math.PI*1.95);
  ctx.stroke();

  // “luz” no tecido
  const gloss = ctx.createRadialGradient(450, 320, 40, 450, 320, 380);
  gloss.addColorStop(0, "rgba(255,255,255,0.10)");
  gloss.addColorStop(1, "rgba(255,255,255,0.00)");
  ctx.fillStyle = gloss;
  ctx.beginPath();
  ctx.ellipse(450, 420, 260, 320, 0, 0, Math.PI*2);
  ctx.fill();

  ctx.restore();
}

function drawMugBase(ctx, opts){
  const isBlack = opts.color === "black";
  ctx.save();

  // sombra
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  roundRect(ctx, 210, 250, 480, 430, 34);
  ctx.fill();

  // corpo
  ctx.fillStyle = isBlack ? "#171a1d" : "#f3f5f8";
  ctx.strokeStyle = isBlack ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)";
  ctx.lineWidth = 3;
  roundRect(ctx, 230, 270, 440, 390, 34);
  ctx.fill();
  ctx.stroke();

  // borda superior
  ctx.strokeStyle = isBlack ? "rgba(255,255,255,0.20)" : "rgba(0,0,0,0.16)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.ellipse(450, 280, 190, 36, 0, 0, Math.PI*2);
  ctx.stroke();

  // alça
  ctx.strokeStyle = isBlack ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.14)";
  ctx.lineWidth = 18;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(675, 455, 95, -Math.PI/2.8, Math.PI/2.8);
  ctx.stroke();

  // “luz”
  const gloss = ctx.createLinearGradient(260, 300, 640, 640);
  gloss.addColorStop(0, "rgba(255,255,255,0.13)");
  gloss.addColorStop(0.4, "rgba(255,255,255,0.02)");
  gloss.addColorStop(1, "rgba(255,255,255,0.00)");
  ctx.fillStyle = gloss;
  roundRect(ctx, 250, 290, 120, 350, 26);
  ctx.fill();

  ctx.restore();
}

function drawArtInPrintArea(ctx, img, area, t){
  // Clipa na área de impressão e desenha a arte com transform
  ctx.save();

  // Clip arredondado
  roundRect(ctx, area.x, area.y, area.w, area.h, 18);
  ctx.clip();

  // Fundo da área (um pouco “sombra” pra destacar)
  ctx.fillStyle = "rgba(0,0,0,0.08)";
  ctx.fillRect(area.x, area.y, area.w, area.h);

  // Centro da área
  const cx = area.x + area.w/2 + t.offsetX;
  const cy = area.y + area.h/2 + t.offsetY;

  // Fit “contain” automático dentro da área
  const fit = containFit(img.width, img.height, area.w, area.h);

  const drawW = fit.w * t.scale;
  const drawH = fit.h * t.scale;

  ctx.translate(cx, cy);
  ctx.rotate((t.rotateDeg * Math.PI) / 180);

  // Desenha centralizado
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, -drawW/2, -drawH/2, drawW, drawH);

  ctx.restore();

  // Borda sutil
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.10)";
  ctx.lineWidth = 2;
  roundRect(ctx, area.x, area.y, area.w, area.h, 18);
  ctx.stroke();
  ctx.restore();
}

// Helpers
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

function containFit(srcW, srcH, dstW, dstH){
  const r = Math.min(dstW/srcW, dstH/srcH);
  return { w: Math.round(srcW*r), h: Math.round(srcH*r) };
}

function loadImage(url){
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}
