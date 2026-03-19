import { injectable, inject } from "inversify";
import { TYPES } from "../../../shared/container/types.js";
import { DrawRepository } from "../domain/draw.repository.js";
import {
  MatchRepository,
  PaginationParams,
} from "../../matches/domain/match.repository.js";

export interface DrawStatistics {
  totalMatches: number;
  totalTeams: number;
  matchDays: number;
  matchesPerMatchDay: Record<number, number>;
  countriesDistribution: Array<{ country: string; teamCount: number }>;
}

@injectable()
export class DrawStatisticsService {
  constructor(
    @inject(TYPES.DrawRepository)
    private readonly drawRepository: DrawRepository,
    @inject(TYPES.MatchRepository)
    private readonly matchRepository: MatchRepository
  ) {}

  async run(): Promise<DrawStatistics | null> {
    const draw = await this.drawRepository.searchCurrent();
    if (!draw) return null;

    const { matches, total } = await this.matchRepository.findAll(
      {},
      { page: 1, limit: 200 } as PaginationParams
    );

    const matchesPerMatchDay: Record<number, number> = {};
    for (const match of matches) {
      const day = match.toPrimitives().matchDay;
      matchesPerMatchDay[day] = (matchesPerMatchDay[day] || 0) + 1;
    }

    const countryTeamCount = new Map<string, Set<number>>();
    for (const match of matches) {
      const p = match.toPrimitives();
      const home = p.homeTeam;
      const away = p.awayTeam;
      if (!countryTeamCount.has(home.country.name)) {
        countryTeamCount.set(home.country.name, new Set());
      }
      countryTeamCount.get(home.country.name)!.add(home.id);
      if (!countryTeamCount.has(away.country.name)) {
        countryTeamCount.set(away.country.name, new Set());
      }
      countryTeamCount.get(away.country.name)!.add(away.id);
    }

    const countriesDistribution = Array.from(countryTeamCount.entries())
      .map(([country, teams]) => ({ country, teamCount: teams.size }))
      .sort((a, b) => b.teamCount - a.teamCount);

    return {
      totalMatches: total,
      totalTeams: 36,
      matchDays: Object.keys(matchesPerMatchDay).length,
      matchesPerMatchDay,
      countriesDistribution,
    };
  }
}
