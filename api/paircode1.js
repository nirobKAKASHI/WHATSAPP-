export default function handler(req, res) {
  res.status(200).send(`
    <html>
      <head><title>BeltahBot - Pair Code 1</title></head>
      <body style="font-family:sans-serif;text-align:center;padding-top:50px;">
        <h2>🔐 Pair Code 1</h2>
        <p>Your WhatsApp pairing code will appear here when the bot is connected.</p>
      </body>
    </html>
  `);
}
