export interface TeamPrimitives {
  id: number;
  name: string;
  country: {
    id: number;
    name: string;
  };
}

export class TeamEntity {
  private constructor(
    readonly id: number,
    readonly name: string,
    readonly country: { id: number; name: string }
  ) {}

  public static fromPrimitives(primitives: TeamPrimitives): TeamEntity {
    return new TeamEntity(primitives.id, primitives.name, primitives.country);
  }

  public toPrimitives(): TeamPrimitives {
    return {
      id: this.id,
      name: this.name,
      country: this.country,
    };
  }
}
