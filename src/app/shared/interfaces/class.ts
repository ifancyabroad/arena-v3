export interface Class {
  readonly name: string;
  readonly description: string;
  readonly image: string;
  readonly trainer: string;
  readonly skills: string[];
  readonly minStats: BaseStats;
  readonly maxStats: BaseStats;
}

export interface BaseStats {
  readonly strength: number;
  readonly dexterity: number;
  readonly constitution: number;
  readonly intelligence: number;
  readonly initiative: number;
}

export interface DefenseStats {
  readonly armour: number;
  readonly magicResistance: number;
}
