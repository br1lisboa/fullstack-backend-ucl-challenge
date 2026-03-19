import { injectable } from "inversify";
import { PrismaRepository } from "../../../shared/infrastructure/prisma.repository.js";
import { TeamEntity } from "../domain/team.entity.js";
import { TeamRepository } from "../domain/team.repository.js";

@injectable()
export class PrismaTeamRepository
  extends PrismaRepository<"Team">
  implements TeamRepository
{
  protected modelName = "Team" as const;

  async findAll(): Promise<TeamEntity[]> {
    const teams = await this.prisma.team.findMany({
      include: { country: true },
      orderBy: { id: "asc" },
    });

    return teams.map((team) => {
      if (!team.country) {
        throw new Error(`Team ${team.id} has no country`);
      }
      return TeamEntity.fromPrimitives({
        id: team.id,
        name: team.name,
        country: { id: team.country.id, name: team.country.name },
      });
    });
  }

  async findById(id: number): Promise<TeamEntity | null> {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: { country: true },
    });

    if (!team || !team.country) return null;

    return TeamEntity.fromPrimitives({
      id: team.id,
      name: team.name,
      country: { id: team.country.id, name: team.country.name },
    });
  }
}
