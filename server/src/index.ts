import Fastify from 'fastify';
import { mulberry32 } from './utils/rng';
import type { Replay, Team, Trooper } from '../../shared/src/types';

const server = Fastify({ logger: true });

function makeId(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

function sampleTeams(): Team[] {
  const t1: Trooper = {
    id: makeId('troop'),
    name: 'Alpha',
    level: 1,
    stats: { hp: 100, maxHp: 100, speed: 50, aim: 60, dodge: 10 },
    weapon: { id: 'w_rifle', name: 'Rifle', damage: 12, range: 5 },
    equipments: []
  };
  const t2: Trooper = {
    id: makeId('troop'),
    name: 'Bravo',
    level: 1,
    stats: { hp: 100, maxHp: 100, speed: 45, aim: 55, dodge: 8 },
    weapon: { id: 'w_rifle', name: 'Rifle', damage: 10, range: 5 },
    equipments: []
  };

  return [
    { id: makeId('team'), name: 'Team A', troopers: [t1] },
    { id: makeId('team'), name: 'Team B', troopers: [t2] }
  ];
}

server.post('/api/simulate', async (request, reply) => {
  try {
    const payload = request.body as any;
    const teams: Team[] = Array.isArray(payload?.teams) ? payload.teams : sampleTeams();

    // seed generation (deterministic per-request timestamp + random)
    const seed = Date.now() & 0xffffffff;
    const rng = mulberry32(seed);

    // Minimal replay: one action event using RNG for damage
    const actor = teams[0]?.troopers?.[0];
    const target = teams[1]?.troopers?.[0];

    const damage = Math.floor((rng() * 8) + 6); // 6..13

    const events = [] as Replay['events'];
    if (actor && target) {
      events.push({
        tick: 0,
        type: 'action',
        actorId: actor.id,
        action: 'shoot',
        targetId: target.id,
        damage
      } as any);

      // If damage >= target hp, add death event
      if (damage >= target.stats.hp) {
        events.push({ tick: 1, type: 'death', trooperId: target.id } as any);
      }
    }

    const replay: Replay = {
      id: makeId('replay'),
      seed,
      meta: {
        createdAt: new Date().toISOString(),
        teams: teams.map((t) => ({ id: t.id, name: t.name }))
      },
      initialState: teams,
      events,
      summary: {
        winnerTeamId: null
      }
    };

    return reply.code(200).send(replay);
  } catch (err) {
    server.log.error(err);
    return reply.code(500).send({ error: 'internal_error' });
  }
});

const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    server.log.info('Server listening');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

// Only start if this file is run directly (keeps import-friendly)
if (require.main === module) {
  start();
}

export default server;
