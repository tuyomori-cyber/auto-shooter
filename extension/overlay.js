const host = document.createElement('div');
const shadow = host.attachShadow({ mode: 'closed' });
const frame = document.createElement('iframe');
frame.src = browser.runtime.getURL('sidebar.html');
frame.title = 'Auto Shooter';
frame.style.cssText = 'width:100%;height:100%;border:0;display:block;color-scheme:normal';
shadow.appendChild(frame);
host.style.cssText = 'all:initial;position:fixed;right:0;bottom:0;width:25vw;height:50vh;z-index:2147483647;display:none;';
document.documentElement.appendChild(host);

async function refreshOverlay() {
  try {
    const game = await browser.runtime.sendMessage({ type: 'state' });
    host.style.display = game.running ? 'block' : 'none';
    host.style.width = game.minimized ? '160px' : '25vw';
    host.style.height = game.minimized ? '60px' : '50vh';
  } catch (error) {
    host.remove();
    return;
  }
  setTimeout(refreshOverlay, 250);
}
refreshOverlay();
