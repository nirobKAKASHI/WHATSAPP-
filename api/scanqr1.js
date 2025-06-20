export default function handler(req, res) {
  res.status(200).send(`
    <html>
      <head><title>BeltahBot - Scan QR 1</title></head>
      <body style="font-family:sans-serif;text-align:center;padding-top:50px;">
        <h2>📸 Scan QR Code 1</h2>
        <p>Your QR code for session pairing will appear here when ready.</p>
      </body>
    </html>
  `);
}
