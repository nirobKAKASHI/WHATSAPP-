// keepalive.js
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("✅ BeltahBot is online and chillin' 😎");
});

app.listen(3000, () => {
  console.log("🌐 Keepalive server started on port 3000");
});
