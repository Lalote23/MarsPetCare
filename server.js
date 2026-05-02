const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Servir la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`🚀 Presentación lista en http://localhost:${port}`);
});
