export default function handler(req, res) {
  res.status(200).send(`
    <html>
      <head><title>BeltahBot - Scan QR 2</title></head>
      <body style="font-family:sans-serif;text-align:center;padding-top:50px;">
        <h2>📸 Scan QR Code 2</h2>
        <p>Standby… This is the second QR pairing display for WhatsApp login.</p>
      </body>
    </html>
  `);
}
