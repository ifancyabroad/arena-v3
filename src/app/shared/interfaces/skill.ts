export interface Skill {
  readonly class: string;
  readonly name: string;
  readonly description: string;
  readonly plane: string;
  readonly effects: SkillEffect[];
  readonly price: number;
  readonly maxUses: number;
  readonly level: number;
}

export interface SkillEffect {
  readonly type: string;
  readonly modifier?: string;
  readonly multiplier?: string;
  readonly min?: string;
  readonly max?: string;
  readonly modifiers?: { [key: string]: number };
  readonly accuracy?: number;
  readonly duration?: number;
}
