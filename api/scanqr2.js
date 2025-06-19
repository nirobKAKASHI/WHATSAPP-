export default function handler(req, res) {
  res.status(200).send(`
    <html>
      <head><title>Scan QR 2</title></head>
      <body style="text-align:center;font-family:sans-serif;">
        <h2>📸 Scan QR 2</h2>
        <p>Another QR page. Coming soon with full WhatsApp pairing!</p>
      </body>
    </html>
  `);
}
