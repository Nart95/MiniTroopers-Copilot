export type UUID = string;

export type StatBlock = {
  hp: number; // current HP
  maxHp: number;
  speed: number; // affects action frequency / initiative
  aim: number; // 0-100
  dodge: number; // 0-100
};

export type Weapon = {
  id: string;
  name: string;
  damage: number;
  range: number;
  aoe?: number; // AoE radius (tiles) or 0
  ammo?: number | null; // null = infinite
};

export type Equipment = {
  id: string;
  name: string;
  description?: string;
};

export type Trooper = {
  id: UUID;
  name: string;
  level: number;
  stats: StatBlock;
  weapon: Weapon;
  equipments: Equipment[]; // up to 3
};

export type Team = {
  id: string;
  name?: string;
  troopers: Trooper[];
};

export type ReplayEvent =
  | {
      tick: number;
      type: 'action';
      actorId: UUID;
      action: 'shoot' | 'grenade';
      targetId?: UUID;
      damage?: number;
    }
  | {
      tick: number;
      type: 'death';
      trooperId: UUID;
    };

export type Replay = {
  id: string;
  seed: number;
  meta: {
    createdAt: string;
    teams: { id: string; name?: string }[];
  };
  initialState: Team[];
  events: ReplayEvent[];
  summary: {
    winnerTeamId: string | null;
  };
};
