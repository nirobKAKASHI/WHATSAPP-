const fs = require('fs');
const path = require('path');

(async () => {
	const lt = require('localtunnel');
	const tunnel = await lt({ port: 5173 });
	const out = path.join(process.cwd(), 'tunnel-url.txt');
	fs.writeFileSync(out, tunnel.url, 'utf8');
	console.log('Tunnel URL:', tunnel.url);
	tunnel.on('close', () => process.exit(0));
})();
