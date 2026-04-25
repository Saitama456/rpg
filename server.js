const express = require('express');
const cors = require('cors');

const personajesRouter = require('./routes/personajes');
const batallasRouter = require('./routes/batallas');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/personajes', personajesRouter);
app.use('/api/batallas', batallasRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
