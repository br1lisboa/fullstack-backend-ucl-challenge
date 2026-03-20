import { injectable } from "inversify";
import { PrismaRepository } from "../../../shared/infrastructure/prisma.repository.js";
import { MatchEntity } from "../domain/match.entity.js";
import {
  MatchRepository,
  MatchFilters,
  PaginationParams,
  PaginatedMatches,
  SortParams,
} from "../domain/match.repository.js";

@injectable()
export class PrismaMatchRepository
  extends PrismaRepository<"Match">
  implements MatchRepository
{
  protected modelName = "Match" as const;

  async findAll(
    filters: MatchFilters,
    pagination: PaginationParams,
    sort?: SortParams
  ): Promise<PaginatedMatches> {
    const { teamId, matchDay, matchDayFrom, matchDayTo, countryId } = filters;
    const { page, limit } = pagination;

    const where: any = {};
    const andConditions: any[] = [];

    if (teamId) {
      andConditions.push({
        OR: [
          { homeTeamId: { in: teamId } },
          { awayTeamId: { in: teamId } },
        ],
      });
    }

    if (matchDay) {
      where.matchDay = matchDay;
    } else if (matchDayFrom || matchDayTo) {
      where.matchDay = {};
      if (matchDayFrom) where.matchDay.gte = matchDayFrom;
      if (matchDayTo) where.matchDay.lte = matchDayTo;
    }

    if (countryId) {
      andConditions.push({
        OR: [
          { homeTeam: { countryId: { in: countryId } } },
          { awayTeam: { countryId: { in: countryId } } },
        ],
      });
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    const sortBy = sort?.sortBy || "matchDay";
    const sortOrder = sort?.sortOrder || "asc";

    const orderByMap: Record<string, any[]> = {
      matchDay: [{ matchDay: sortOrder }, { id: "asc" }],
      homeTeam: [{ homeTeam: { name: sortOrder } }, { id: "asc" }],
      awayTeam: [{ awayTeam: { name: sortOrder } }, { id: "asc" }],
      id: [{ id: sortOrder }],
    };

    const skip = (page - 1) * limit;

    const [matches, total] = await Promise.all([
      this.prisma.match.findMany({
        where,
        skip,
        take: limit,
        include: {
          homeTeam: {
            include: {
              country: true,
            },
          },
          awayTeam: {
            include: {
              country: true,
            },
          },
        },
        orderBy: orderByMap[sortBy],
      }),
      this.prisma.match.count({ where }),
    ]);

    const matchEntities = matches.map((match) => {
      if (!match.homeTeam.country || !match.awayTeam.country) {
        throw new Error(
          `Match ${match.id} has teams without country information`
        );
      }

      return MatchEntity.fromPrimitives({
        id: match.id,
        drawId: match.drawId,
        homeTeam: {
          id: match.homeTeam.id,
          name: match.homeTeam.name,
          country: {
            id: match.homeTeam.country.id,
            name: match.homeTeam.country.name,
          },
        },
        awayTeam: {
          id: match.awayTeam.id,
          name: match.awayTeam.name,
          country: {
            id: match.awayTeam.country.id,
            name: match.awayTeam.country.name,
          },
        },
        matchDay: match.matchDay,
      });
    });

    return {
      matches: matchEntities,
      total,
    };
  }

  async findById(id: number): Promise<MatchEntity | null> {
    const match = await this.prisma.match.findUnique({
      where: { id },
      include: {
        homeTeam: { include: { country: true } },
        awayTeam: { include: { country: true } },
      },
    });

    if (!match || !match.homeTeam.country || !match.awayTeam.country) return null;

    return MatchEntity.fromPrimitives({
      id: match.id,
      drawId: match.drawId,
      homeTeam: {
        id: match.homeTeam.id,
        name: match.homeTeam.name,
        country: { id: match.homeTeam.country.id, name: match.homeTeam.country.name },
      },
      awayTeam: {
        id: match.awayTeam.id,
        name: match.awayTeam.name,
        country: { id: match.awayTeam.country.id, name: match.awayTeam.country.name },
      },
      matchDay: match.matchDay,
    });
  }
}
