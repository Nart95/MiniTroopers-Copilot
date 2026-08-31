// Simple, editable combat configuration and assumptions.
// All values here are provisional and intended to be tuned later.

export const COMBAT_CONFIG = {
  TICK_MS: 200, // logical tick duration for replay timing (ms)
  BASE_HP: 100,
  // Hit calculation: base chance is attacker.aim - target.dodge + random(-RNG_VARIANCE..RNG_VARIANCE)
  RNG_VARIANCE: 15,
  MIN_HIT_CHANCE: 5,
  MAX_HIT_CHANCE: 95,
  // Damage multipliers
  MELEE_DAMAGE: 8,
  RANGED_DAMAGE_MIN: 6,
  RANGED_DAMAGE_MAX: 24,
};
