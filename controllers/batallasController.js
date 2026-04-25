const { personajes } = require('../data/store');

const HP_BASE = 100;
const MAX_RONDAS = 20;

function simularBatalla(req, res) {
  const { id1, id2 } = req.body;

  if (id1 == null || id2 == null) {
    return res.status(400).json({ error: 'Se requieren id1 e id2' });
  }

  const numId1 = parseInt(id1);
  const numId2 = parseInt(id2);

  if (numId1 === numId2) {
    return res.status(400).json({ error: 'Los dos personajes deben ser distintos' });
  }

  const p1 = personajes.find(p => p.id === numId1);
  const p2 = personajes.find(p => p.id === numId2);

  if (!p1) return res.status(404).json({ error: `Personaje con id ${id1} no encontrado` });
  if (!p2) return res.status(404).json({ error: `Personaje con id ${id2} no encontrado` });

  res.json(combatir(p1, p2));
}

function combatir(p1, p2) {
  const estado1 = { personaje: p1, hp: HP_BASE + p1.conocimiento * 2 };
  const estado2 = { personaje: p2, hp: HP_BASE + p2.conocimiento * 2 };

  // Mayor agilidad ataca primero en cada ronda
  const [atacante, defensor] = p1.agilidad >= p2.agilidad
    ? [estado1, estado2]
    : [estado2, estado1];

  const rondas = [];

  for (let ronda = 1; ronda <= MAX_RONDAS && atacante.hp > 0 && defensor.hp > 0; ronda++) {
    rondas.push(ejecutarRonda(ronda, atacante, defensor));
  }

  const ganador = estado1.hp > estado2.hp ? p1 : estado2.hp > estado1.hp ? p2 : null;

  return {
    resultado: ganador ? `${ganador.nombre} gana la batalla` : 'Empate',
    ganador: ganador ? ganador.nombre : 'Empate',
    puntajes: {
      [p1.nombre]: { hpFinal: Math.max(0, estado1.hp), poderTotal: calcularPoderTotal(p1) },
      [p2.nombre]: { hpFinal: Math.max(0, estado2.hp), poderTotal: calcularPoderTotal(p2) },
    },
    resumen: rondas,
  };
}

function ejecutarRonda(numero, atacante, defensor) {
  const eventos = [];

  const danoAtacante = calcularDano(atacante.personaje, defensor.personaje);
  const defensorEsquiva = intentaEsquivar(defensor.personaje, atacante.personaje);

  if (!defensorEsquiva) defensor.hp -= danoAtacante;
  eventos.push(formatearAtaque(atacante.personaje.nombre, defensor.personaje.nombre, danoAtacante, defensorEsquiva));

  if (defensor.hp > 0) {
    const danoDefensor = calcularDano(defensor.personaje, atacante.personaje);
    const atacanteEsquiva = intentaEsquivar(atacante.personaje, defensor.personaje);

    if (!atacanteEsquiva) atacante.hp -= danoDefensor;
    eventos.push(formatearAtaque(defensor.personaje.nombre, atacante.personaje.nombre, danoDefensor, atacanteEsquiva));
  }

  return {
    ronda: numero,
    eventos,
    hpAtacante: Math.max(0, atacante.hp),
    hpDefensor: Math.max(0, defensor.hp),
  };
}

function formatearAtaque(nombreAtacante, nombreDefensor, dano, esquivado) {
  return esquivado
    ? `${nombreAtacante} ataca a ${nombreDefensor} (esquivado!)`
    : `${nombreAtacante} ataca a ${nombreDefensor} causando ${dano} de daño`;
}

function calcularDano(atacante, defensor) {
  const danoFisico = Math.max(1, atacante.fuerza * 1.5 - defensor.agilidad * 0.3);
  const danoMagico = Math.max(1, atacante.magia * 1.2 - defensor.conocimiento * 0.2);
  const bonusEstrategia = 1 + atacante.conocimiento * 0.01;
  return Math.round((danoFisico + danoMagico) * bonusEstrategia);
}

function intentaEsquivar(defensor, atacante) {
  const prob = Math.min(0.30, (defensor.agilidad / (defensor.agilidad + atacante.agilidad)) * 0.6);
  return Math.random() < prob;
}

function calcularPoderTotal(personaje) {
  return Math.round(personaje.fuerza * 1.5 + personaje.agilidad * 1.2 + personaje.magia * 1.3 + personaje.conocimiento * 1.0);
}

module.exports = { simularBatalla };
