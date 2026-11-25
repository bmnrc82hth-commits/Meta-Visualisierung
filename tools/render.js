// Erzeugt cmi/1.png (Hintergrund mit MTF-Logo) und vorschau.png (Vorschau mit Beispielwerten).
// Aufruf:  node tools/render.js
// Echtes Logo: als tools/mtf_logo.png ablegen.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const tools = path.join(root, 'tools');
const cmi = path.join(root, 'cmi');

const logoFile = ['mtf_logo.png', 'mtf_logo.jpg']
  .map(f => path.join(tools, f)).find(f => fs.existsSync(f));
const mime = { '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' }[path.extname(logoFile)];
const logoSrc = `data:${mime};base64,${fs.readFileSync(logoFile).toString('base64')}`;

// Beispielwerte für die Vorschau (Reihenfolge wie die "c o c"-Zeilen in 1.cgi)
const sample = {
  '10020502091': '14:35', '10120502091': '48,2 °C',
  '10927502091': '35,0 °C', '10A27502091': '30,5 °C',
  '10B27502091': '18,0 °C', '10C27502091': '22,0 °C',
  '10324142091': process.env.SW || 'EIN', '10424142091': 'AUS', '10624142091': '26,0 °C',
  '10524142091': 'EIN', '10724142091': '21,0 °C', '1012D012091': '21,8 °C',
};

function cgiToHtml(cgi) {
  return cgi.split(/\r?\n/).map(l => {
    if (l.startsWith('t ')) return l.slice(2);
    if (l.startsWith('c o c ')) { const k = l.slice(6).trim(); return sample[k] ?? k; }
    return '';
  }).join('\n');
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1024, height: 768 } });

  // 1) Hintergrund
  const bg = fs.readFileSync(path.join(tools, 'background.html'), 'utf8').replace('LOGO_SRC', logoSrc);
  await page.setContent(bg, { waitUntil: 'load' });
  await page.screenshot({ path: path.join(cmi, '1.png') });

  // 2) Vorschau (simuliert die C.M.I.-Seite)
  const html = fs.readFileSync(path.join(cmi, '1.html'), 'utf8');
  const style = html.match(/<style[\s\S]*<\/style>/)[0];
  const body = cgiToHtml(fs.readFileSync(path.join(cmi, '1.cgi'), 'utf8'));
  const png = fs.readFileSync(path.join(cmi, '1.png')).toString('base64');
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8">${style}
    <style>body{margin:0}#values{position:relative;background:url(data:image/png;base64,${png}) no-repeat}</style>
    </head><body><div id="values">${body}</div></body></html>`, { waitUntil: 'load' });
  const mtfJs = html.match(/\/\/ MTF-BETRIEBSART-START([\s\S]*?)\/\/ MTF-BETRIEBSART-END/);
  if (mtfJs) await page.evaluate(mtfJs[1] + '; mtfBetriebsart();');
  await page.screenshot({ path: path.join(root, process.env.OUT || 'vorschau.png') });

  await browser.close();
  console.log('OK: cmi/1.png und vorschau.png erzeugt (Logo: ' + path.basename(logoFile) + ')');
})();
