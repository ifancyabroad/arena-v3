export interface Class {
  readonly name: string;
  readonly description: string;
  readonly image: string;
  readonly trainer: string;
  readonly skills: string[];
  readonly minStats: Stats;
  readonly maxStats: Stats;
}

export interface Stats {
  readonly strength: number;
  readonly dexterity: number;
  readonly constitution: number;
  readonly intelligence: number;
  readonly initiative: number;
}
