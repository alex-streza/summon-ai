declare module "circletype" {
  export default class CircleType {
    constructor(element?: HTMLElement);
    radius(value: number): CircleType;
    destroy(): void;
  }
}
