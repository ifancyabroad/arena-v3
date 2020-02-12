export interface Item {
  readonly type: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly modifiers: {
    [key: string]: number
  };
  readonly requirements: {
    [key: string]: number
  };
}