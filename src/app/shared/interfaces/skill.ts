export interface Skill {
  readonly class: string;
  readonly name: string;
  readonly description: string;
  readonly plane: string;
  readonly effects: SkillEffect[];
  readonly price: number;
  readonly level: number;
  readonly maxUses: number;
  uses?: number;
}

export interface SkillEffect {
  readonly type: string;
  readonly modifier?: string;
  readonly multiplier?: number;
  readonly min?: number;
  readonly max?: number;
  readonly modifiers?: { [key: string]: number };
  readonly accuracy?: number;
  readonly value?: number;
  readonly duration?: number;
  remaining?: number
}
