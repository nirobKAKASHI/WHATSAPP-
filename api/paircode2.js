export default function handler(req, res) {
  res.status(200).send(`
    <html>
      <head><title>Pair Code 2</title></head>
      <body style="text-align:center;font-family:sans-serif;">
        <h2>🔐 Pair Code 2</h2>
        <p>This page will show the second pairing code soon.</p>
      </body>
    </html>
  `);
}
