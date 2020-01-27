export interface Item {
  readonly type: string;
  readonly name: string;
  readonly description: string;
  readonly modifier: string;
  readonly value: number;
  readonly price: number;
  readonly requirements: {
    [key: string]: number
  };
}