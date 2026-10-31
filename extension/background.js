const game = AutoShooter.createGame();
let last = performance.now();
setInterval(() => {
  const now = performance.now();
  let elapsed = (now - last) / 1000;
  last = now;
  // Small steps keep collision detection reliable when a background timer is delayed.
  while (elapsed > 0) {
    const dt = Math.min(elapsed, 0.05);
    AutoShooter.step(game, dt);
    elapsed -= dt;
  }
}, 50);

browser.browserAction.onClicked.addListener(() => {
  game.running = true;
  game.minimized = false;
  browser.sidebarAction.open().catch(console.error);
});
browser.runtime.onMessage.addListener(message => {
  if (message.type === "state") return Promise.resolve(game);
  if (message.type === "move" && Number.isFinite(message.x)) game.x = Math.max(0.04, Math.min(0.96, message.x));
  if (message.type === "minimize") game.minimized = true;
  if (message.type === "restore") { game.running = true; game.minimized = false; }
  return Promise.resolve();
});
