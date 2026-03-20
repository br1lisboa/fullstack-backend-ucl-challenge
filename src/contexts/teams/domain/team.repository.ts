import { TeamEntity } from "./team.entity.js";

export interface TeamFilters {
  name?: string;
}

export interface TeamRepository {
  findAll(filters?: TeamFilters): Promise<TeamEntity[]>;
  findById(id: number): Promise<TeamEntity | null>;
}
