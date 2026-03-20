export interface CountryPrimitives {
  id: number;
  name: string;
}

export class CountryEntity {
  private constructor(
    readonly id: number,
    readonly name: string
  ) {}

  public static fromPrimitives(primitives: CountryPrimitives): CountryEntity {
    return new CountryEntity(primitives.id, primitives.name);
  }

  public toPrimitives(): CountryPrimitives {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
