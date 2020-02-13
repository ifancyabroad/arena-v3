import { Class } from './interfaces/class';

export interface LevelTier {
  readonly level: number;
  readonly exp: number;
}

export interface RankTier {
  readonly rank: number;
  readonly kills: number;
  readonly name: string;
  readonly img: string;
}

export interface StatData {
  readonly key: string;
  readonly name: string;
  readonly description: string;
  readonly type: string;
}

export class Config {
  readonly healthMultiplier = 10; // Multiply by constitution to get health
  readonly hitMultiplier = 5; // Multiply by dexterity to get hit chance
  readonly critMultiplier = 0.75; // Multiply by dexterity to get crit chance

  readonly skillPoints = 0; // Skill points to start with
  readonly gold = 9999; // Gold the player starts with
  readonly rerolls = 10; // Number of rerolls allowed
  readonly maxSkills = 6; // Number of abilities allowed

  // Experience required for each level
  readonly levelTier: LevelTier[] = [
    { level: 1, exp: 0 },
    { level: 2, exp: 100 },
    { level: 3, exp: 300 },
    { level: 4, exp: 600 },
    { level: 5, exp: 1000 },
    { level: 6, exp: 1500 },
    { level: 7, exp: 2100 },
    { level: 8, exp: 2800 },
    { level: 9, exp: 3600 },
    { level: 10, exp: 4500 },
    { level: 11, exp: 5500 },
    { level: 12, exp: 6600 },
    { level: 13, exp: 7800 },
    { level: 14, exp: 9100 },
    { level: 15, exp: 10500 },
    { level: 16, exp: 12000 },
    { level: 17, exp: 13600 },
    { level: 18, exp: 15300 },
    { level: 19, exp: 17100 },
    { level: 20, exp: 19000 }
  ];

  // Kills needed for each rank
  readonly rankTier: RankTier[] = [
    { rank: 1, kills: 60, name: 'God', img: '' },
    { rank: 2, kills: 50, name: 'Demi-God', img: '' },
    { rank: 3, kills: 45, name: 'Mythical', img: '' },
    { rank: 4, kills: 40, name: 'Legend', img: '' },
    { rank: 5, kills: 36, name: 'Conqueror', img: '' },
    { rank: 6, kills: 32, name: 'Warlord', img: '' },
    { rank: 7, kills: 28, name: 'Grand Champion', img: '' },
    { rank: 8, kills: 24, name: 'Champion', img: '' },
    { rank: 9, kills: 21, name: 'Hero', img: '' },
    { rank: 10, kills: 18, name: 'Vanquisher', img: '' },
    { rank: 11, kills: 15, name: 'Gladiator', img: '' },
    { rank: 12, kills: 12, name: 'Challenger', img: '' },
    { rank: 13, kills: 10, name: 'Fighter', img: '' },
    { rank: 14, kills: 8, name: 'Brawler', img: '' },
    { rank: 15, kills: 6, name: 'Mercenary', img: '' },
    { rank: 16, kills: 4, name: 'Wanderer', img: '' },
    { rank: 17, kills: 3, name: 'Fledgling', img: '' },
    { rank: 18, kills: 2, name: 'Recruit', img: '' },
    { rank: 19, kills: 1, name: 'Maggot', img: '' },
    { rank: 20, kills: 0, name: 'Goblin Fodder', img: '' }
  ];

  // Classes
  readonly classes: Class[] = [
    {
      name: 'Warrior',
      description: 'Proud and honorable, specialising in brute strength. Primary stats are strength and constitution.',
      image: 'warrior.png',
      trainer: 'High Warlord',
      skills: [
        'Cleave'
      ],
      minStats: {
        strength: 10,
        dexterity: 8,
        constitution: 10,
        intelligence: 1,
        initiative: 7
      },
      maxStats: {
        strength: 15,
        dexterity: 12,
        constitution: 13,
        intelligence: 6,
        initiative: 10
      }
    },
    {
      name: 'Mage',
      description: 'Trained in the arcane arts and proficient with all forms of magic. Primary stat is intelligence.',
      image: 'mage.jpg',
      trainer: 'Arch Mage',
      skills: [
        'Magic Arrow'
      ],
      minStats: {
        strength: 1,
        dexterity: 3,
        constitution: 5,
        intelligence: 12,
        initiative: 7
      },
      maxStats: {
        strength: 6,
        dexterity: 9,
        constitution: 8,
        intelligence: 15,
        initiative: 10
      }
    },
    {
      name: 'Rogue',
      description: 'Unscrupulous and underhanded, strikes from the shadows. Primary stats are dexterity and initiative.',
      image: 'rogue.jpg',
      trainer: 'Master Assassin',
      skills: [
        'Jab'
      ],
      minStats: {
        strength: 7,
        dexterity: 11,
        constitution: 7,
        intelligence: 4,
        initiative: 10
      },
      maxStats: {
        strength: 10,
        dexterity: 15,
        constitution: 11,
        intelligence: 8,
        initiative: 14
      }
    }
  ];

  // Portraits
  readonly portraits: string[] = [
    'female-warrior.jpg',
    'male-mage.jpg',
    'female-mage.jpg',
    'male-knight.jpg',
    'female-knight.jpg',
    'male-thief.png',
    'female-thief.jpg',
    'male-warrior.jpg'
  ];

  // Stats
  readonly stats: StatData[] = [
    {
      key: 'strength',
      name: 'Strength',
      description: 'How much damage your physical attacks do.',
      type: 'main'
    },
    {
      key: 'dexterity',
      name: 'Dexterity',
      description: 'The chance your physical attacks hit and critical hit.',
      type: 'main'
    },
    {
      key: 'constitution',
      name: 'Constitution',
      description: 'Determines your maximum health.',
      type: 'main'
    },
    {
      key: 'intelligence',
      name: 'Intelligence',
      description: 'How much damage your magical attacks do.',
      type: 'main'
    },
    {
      key: 'initiative',
      name: 'Initiative',
      description: 'Determines who strikes first.',
      type: 'main'
    },
    {
      key: 'armour',
      name: 'Armour',
      description: 'Offers protection from physical attacks',
      type: 'defense'
    },
    {
      key: 'magicResistance',
      name: 'Magic Resistance',
      description: 'Offers protection from magical attacks',
      type: 'defense'
    }
  ];
}
