const { personajes, getNextId } = require('../data/store');

function listar(req, res) {
  res.json(personajes);
}

function obtener(req, res) {
  const personaje = personajes.find(p => p.id === parseInt(req.params.id));
  if (!personaje) return res.status(404).json({ error: 'Personaje no encontrado' });
  res.json(personaje);
}

function crear(req, res) {
  const { nombre, colorPiel, raza, fuerza, agilidad, magia, conocimiento } = req.body;

  if (!nombre || !colorPiel || !raza) {
    return res.status(400).json({ error: 'nombre, colorPiel y raza son obligatorios' });
  }

  const nuevo = {
    id: getNextId(),
    nombre,
    colorPiel,
    raza,
    fuerza: fuerza ?? 10,
    agilidad: agilidad ?? 10,
    magia: magia ?? 10,
    conocimiento: conocimiento ?? 10,
  };

  personajes.push(nuevo);
  res.status(201).json(nuevo);
}

function actualizar(req, res) {
  const idx = personajes.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Personaje no encontrado' });

  const campos = ['nombre', 'colorPiel', 'raza', 'fuerza', 'agilidad', 'magia', 'conocimiento'];
  campos.forEach(c => {
    if (req.body[c] !== undefined) personajes[idx][c] = req.body[c];
  });

  res.json(personajes[idx]);
}

function eliminar(req, res) {
  const idx = personajes.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Personaje no encontrado' });

  const eliminado = personajes.splice(idx, 1)[0];
  res.json({ mensaje: 'Personaje eliminado', personaje: eliminado });
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
