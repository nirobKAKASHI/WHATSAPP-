export default function handler(req, res) {
  res.status(200).send(`
    <html>
      <head><title>Scan QR 1</title></head>
      <body style="text-align:center;font-family:sans-serif;">
        <h2>📸 Scan QR 1</h2>
        <p>This QR will be generated and shown here once setup is complete.</p>
      </body>
    </html>
  `);
}
