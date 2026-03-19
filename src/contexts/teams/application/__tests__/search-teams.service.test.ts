import { describe, it, expect, beforeEach, vi } from "vitest";
import { SearchTeamsService } from "../search-teams.service";
import { TeamRepository } from "../../domain/team.repository";
import { TeamEntity } from "../../domain/team.entity";

describe("SearchTeamsService", () => {
  let service: SearchTeamsService;
  let mockRepository: TeamRepository;

  beforeEach(() => {
    mockRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
    } as any;

    service = new SearchTeamsService(mockRepository);
  });

  it("should return all teams as primitives", async () => {
    const mockTeams = [
      TeamEntity.fromPrimitives({
        id: 1,
        name: "Real Madrid",
        country: { id: 1, name: "Spain" },
      }),
      TeamEntity.fromPrimitives({
        id: 2,
        name: "Manchester City",
        country: { id: 2, name: "England" },
      }),
    ];

    vi.mocked(mockRepository.findAll).mockResolvedValue(mockTeams);

    const result = await service.run();

    expect(mockRepository.findAll).toHaveBeenCalledOnce();
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: 1,
      name: "Real Madrid",
      country: { id: 1, name: "Spain" },
    });
    expect(result[1]).toEqual({
      id: 2,
      name: "Manchester City",
      country: { id: 2, name: "England" },
    });
  });

  it("should return empty array when no teams exist", async () => {
    vi.mocked(mockRepository.findAll).mockResolvedValue([]);

    const result = await service.run();

    expect(result).toEqual([]);
  });
});
