import { injectable, inject } from "inversify";
import { TYPES } from "../../../shared/container/types.js";
import { TeamRepository } from "../domain/team.repository.js";
import { TeamPrimitives } from "../domain/team.entity.js";
import {
  MatchRepository,
  MatchFilters,
  PaginationParams,
} from "../../matches/domain/match.repository.js";

export interface TeamDetailResult {
  team: TeamPrimitives;
  matches: Array<{
    id: string;
    homeTeam: { id: number; name: string; country: { id: number; name: string } };
    awayTeam: { id: number; name: string; country: { id: number; name: string } };
    matchDay: number;
  }>;
}

@injectable()
export class SearchTeamByIdService {
  constructor(
    @inject(TYPES.TeamRepository)
    private readonly teamRepository: TeamRepository,
    @inject(TYPES.MatchRepository)
    private readonly matchRepository: MatchRepository
  ) {}

  async run(id: number): Promise<TeamDetailResult | null> {
    const team = await this.teamRepository.findById(id);
    if (!team) return null;

    const { matches } = await this.matchRepository.findAll(
      { teamId: id } as MatchFilters,
      { page: 1, limit: 100 } as PaginationParams
    );

    return {
      team: team.toPrimitives(),
      matches: matches.map((m) => m.toPrimitives()),
    };
  }
}
