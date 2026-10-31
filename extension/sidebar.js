const canvas = document.querySelector('#field');
const ctx = canvas.getContext('2d');
const gameView = document.querySelector('#game');
const restore = document.querySelector('#restore');
const start = document.querySelector('#start');
function send(type, extra = {}) { return browser.runtime.sendMessage({ type, ...extra }); }
document.querySelector('#minimize').addEventListener('click', () => send('minimize'));
restore.addEventListener('click', () => send('restore'));
function move(event) {
  const rect = canvas.getBoundingClientRect();
  send('move', { x: (event.clientX - rect.left) / rect.width });
}
canvas.addEventListener('pointerdown', event => { canvas.setPointerCapture(event.pointerId); move(event); });
canvas.addEventListener('pointermove', event => { if (canvas.hasPointerCapture(event.pointerId)) move(event); });
function draw(g) {
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#71e4ff';
  if (g.respawn <= 0) {
    ctx.beginPath(); ctx.moveTo(g.x*w, .84*h); ctx.lineTo((g.x-.04)*w, .92*h); ctx.lineTo((g.x+.04)*w, .92*h); ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle = '#ff7891';
  for (const e of g.enemies) { ctx.beginPath(); ctx.arc(e.x*w, e.y*h, 10, 0, Math.PI*2); ctx.fill(); }
  ctx.fillStyle = '#a9f8ff';
  for (const s of g.shots) ctx.fillRect(s.x*w-2, s.y*h-6, 4, 12);
  ctx.fillStyle = '#ffc36a';
  for (const s of g.enemyShots) { ctx.beginPath(); ctx.arc(s.x*w, s.y*h, 4, 0, Math.PI*2); ctx.fill(); }
}
async function refresh() {
  try {
    const g = await send('state');
    gameView.hidden = !g.running || g.minimized;
    restore.hidden = !g.running || !g.minimized;
    start.hidden = g.running;
    if (g.running && !g.minimized) {
      document.querySelector('#score').textContent = `撃破 ${g.score}　WAVE ${g.wave}`;
      document.querySelector('#hp').textContent = g.respawn > 0 ? '復帰中…' : `HP ${g.hp}`;
      draw(g);
    }
  } catch (error) { console.error(error); }
  setTimeout(refresh, 100);
}
refresh();
