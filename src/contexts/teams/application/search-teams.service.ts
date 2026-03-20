import { injectable, inject } from "inversify";
import { TYPES } from "../../../shared/container/types.js";
import { TeamRepository } from "../domain/team.repository.js";
import { TeamPrimitives } from "../domain/team.entity.js";

@injectable()
export class SearchTeamsService {
  constructor(
    @inject(TYPES.TeamRepository)
    private readonly teamRepository: TeamRepository
  ) {}

  async run(params?: { name?: string }): Promise<TeamPrimitives[]> {
    const teams = await this.teamRepository.findAll(
      params?.name ? { name: params.name } : undefined
    );
    return teams.map((team) => team.toPrimitives());
  }
}
