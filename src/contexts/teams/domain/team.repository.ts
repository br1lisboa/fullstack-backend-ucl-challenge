import { TeamEntity } from "./team.entity.js";

export interface TeamRepository {
  findAll(): Promise<TeamEntity[]>;
  findById(id: number): Promise<TeamEntity | null>;
}
