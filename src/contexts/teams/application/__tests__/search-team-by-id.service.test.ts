import { describe, it, expect, beforeEach, vi } from "vitest";
import { SearchTeamByIdService } from "../search-team-by-id.service";
import { TeamRepository } from "../../domain/team.repository";
import { TeamEntity } from "../../domain/team.entity";
import { MatchRepository } from "../../../matches/domain/match.repository";
import { MatchEntity } from "../../../matches/domain/match.entity";

describe("SearchTeamByIdService", () => {
  let service: SearchTeamByIdService;
  let mockTeamRepository: TeamRepository;
  let mockMatchRepository: MatchRepository;

  beforeEach(() => {
    mockTeamRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
    } as any;

    mockMatchRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
    } as any;

    service = new SearchTeamByIdService(
      mockTeamRepository,
      mockMatchRepository
    );
  });

  it("should return team with its matches", async () => {
    const team = TeamEntity.fromPrimitives({
      id: 1,
      name: "Real Madrid",
      country: { id: 1, name: "Spain" },
    });

    const matches = [
      MatchEntity.fromPrimitives({
        id: 1,
        drawId: 1,
        homeTeam: {
          id: 1,
          name: "Real Madrid",
          country: { id: 1, name: "Spain" },
        },
        awayTeam: {
          id: 3,
          name: "Bayern Munich",
          country: { id: 3, name: "Germany" },
        },
        matchDay: 1,
      }),
    ];

    vi.mocked(mockTeamRepository.findById).mockResolvedValue(team);
    vi.mocked(mockMatchRepository.findAll).mockResolvedValue({
      matches,
      total: 1,
    });

    const result = await service.run(1);

    expect(mockTeamRepository.findById).toHaveBeenCalledWith(1);
    expect(mockMatchRepository.findAll).toHaveBeenCalledWith(
      { teamId: 1 },
      { page: 1, limit: 100 }
    );
    expect(result).not.toBeNull();
    expect(result!.team.name).toBe("Real Madrid");
    expect(result!.matches).toHaveLength(1);
    expect(result!.matches[0].matchDay).toBe(1);
  });

  it("should return null when team does not exist", async () => {
    vi.mocked(mockTeamRepository.findById).mockResolvedValue(null);

    const result = await service.run(999);

    expect(result).toBeNull();
    expect(mockMatchRepository.findAll).not.toHaveBeenCalled();
  });

  it("should return team with empty matches when no draw exists", async () => {
    const team = TeamEntity.fromPrimitives({
      id: 5,
      name: "Liverpool",
      country: { id: 2, name: "England" },
    });

    vi.mocked(mockTeamRepository.findById).mockResolvedValue(team);
    vi.mocked(mockMatchRepository.findAll).mockResolvedValue({
      matches: [],
      total: 0,
    });

    const result = await service.run(5);

    expect(result).not.toBeNull();
    expect(result!.team.name).toBe("Liverpool");
    expect(result!.matches).toEqual([]);
  });
});
