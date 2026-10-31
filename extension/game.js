/* The simulation belongs to the background page, independently of the sidebar. */
(function (root) {
  function createGame() {
    return { running: false, score: 0, hp: 3, x: 0.5, enemies: [], shots: [], enemyShots: [], time: 0, fire: 0, enemyFire: 0, wave: 0, respawn: 0 };
  }
  function step(g, dt) {
    if (!g.running) return;
    g.time += dt;
    if (g.respawn > 0) {
      g.respawn -= dt;
      if (g.respawn <= 0) { g.hp = 3; g.x = 0.5; g.enemyShots = []; }
    }
    if (!g.enemies.length) {
      g.wave++;
      g.enemies = Array.from({ length: 6 }, (_, i) => ({ base: 0.17 + i * 0.13, x: 0, y: 0.16 + (i % 2) * 0.09 }));
    }
    for (const e of g.enemies) e.x = e.base + Math.sin(g.time * 1.1) * 0.11;
    g.fire += dt; g.enemyFire += dt;
    if (g.fire >= 0.4) { g.fire %= 0.4; if (g.respawn <= 0) g.shots.push({ x: g.x, y: 0.84 }); }
    if (g.enemyFire >= 1.1) { g.enemyFire %= 1.1; const e = g.enemies[Math.floor(Math.random() * g.enemies.length)]; if (e) g.enemyShots.push({ x: e.x, y: e.y }); }
    for (const s of g.shots) s.y -= dt * 0.7;
    for (const s of g.enemyShots) s.y += dt * 0.32;
    for (const s of g.shots) {
      const i = g.enemies.findIndex(e => Math.abs(e.x - s.x) < 0.045 && Math.abs(e.y - s.y) < 0.035);
      if (i >= 0) { g.enemies.splice(i, 1); s.hit = true; g.score++; }
    }
    for (const s of g.enemyShots) {
      if (g.respawn <= 0 && Math.abs(s.x - g.x) < 0.045 && Math.abs(s.y - 0.88) < 0.04) {
        s.hit = true; g.hp--; if (g.hp <= 0) g.respawn = 2;
      }
    }
    g.shots = g.shots.filter(s => !s.hit && s.y > 0);
    g.enemyShots = g.enemyShots.filter(s => !s.hit && s.y < 1);
  }
  root.AutoShooter = { createGame, step };
})(globalThis);
