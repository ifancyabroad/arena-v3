export default class Utils {
  static roll = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1) + min);
}