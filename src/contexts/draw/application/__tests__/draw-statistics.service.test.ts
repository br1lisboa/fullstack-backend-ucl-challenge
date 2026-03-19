import { describe, it, expect, beforeEach, vi } from "vitest";
import { DrawStatisticsService } from "../draw-statistics.service";
import { DrawRepository } from "../../domain/draw.repository";
import { MatchRepository } from "../../../matches/domain/match.repository";
import { MatchEntity } from "../../../matches/domain/match.entity";

describe("DrawStatisticsService", () => {
  let service: DrawStatisticsService;
  let mockDrawRepository: DrawRepository;
  let mockMatchRepository: MatchRepository;

  beforeEach(() => {
    mockDrawRepository = {
      save: vi.fn(),
      searchCurrent: vi.fn(),
      findAllTeams: vi.fn(),
      deleteAll: vi.fn(),
    } as any;

    mockMatchRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
    } as any;

    service = new DrawStatisticsService(
      mockDrawRepository,
      mockMatchRepository
    );
  });

  it("should return null when no draw exists", async () => {
    vi.mocked(mockDrawRepository.searchCurrent).mockResolvedValue(null);

    const result = await service.run();

    expect(result).toBeNull();
    expect(mockMatchRepository.findAll).not.toHaveBeenCalled();
  });

  it("should return statistics when draw exists", async () => {
    vi.mocked(mockDrawRepository.searchCurrent).mockResolvedValue({} as any);

    const mockMatches = [
      MatchEntity.fromPrimitives({
        id: 1,
        drawId: 1,
        homeTeam: { id: 1, name: "Real Madrid", country: { id: 1, name: "Spain" } },
        awayTeam: { id: 3, name: "Bayern Munich", country: { id: 3, name: "Germany" } },
        matchDay: 1,
      }),
      MatchEntity.fromPrimitives({
        id: 2,
        drawId: 1,
        homeTeam: { id: 2, name: "Barcelona", country: { id: 1, name: "Spain" } },
        awayTeam: { id: 4, name: "Liverpool", country: { id: 2, name: "England" } },
        matchDay: 1,
      }),
      MatchEntity.fromPrimitives({
        id: 3,
        drawId: 1,
        homeTeam: { id: 3, name: "Bayern Munich", country: { id: 3, name: "Germany" } },
        awayTeam: { id: 1, name: "Real Madrid", country: { id: 1, name: "Spain" } },
        matchDay: 2,
      }),
    ];

    vi.mocked(mockMatchRepository.findAll).mockResolvedValue({
      matches: mockMatches,
      total: 3,
    });

    const result = await service.run();

    expect(result).not.toBeNull();
    expect(result!.totalMatches).toBe(3);
    expect(result!.totalTeams).toBe(36);
    expect(result!.matchDays).toBe(2);
    expect(result!.matchesPerMatchDay).toEqual({ 1: 2, 2: 1 });

    const spainEntry = result!.countriesDistribution.find(
      (c) => c.country === "Spain"
    );
    expect(spainEntry!.teamCount).toBe(2);

    const germanyEntry = result!.countriesDistribution.find(
      (c) => c.country === "Germany"
    );
    expect(germanyEntry!.teamCount).toBe(1);

    expect(result!.countriesDistribution[0].teamCount).toBeGreaterThanOrEqual(
      result!.countriesDistribution[result!.countriesDistribution.length - 1].teamCount
    );
  });

  it("should call matchRepository with correct pagination", async () => {
    vi.mocked(mockDrawRepository.searchCurrent).mockResolvedValue({} as any);
    vi.mocked(mockMatchRepository.findAll).mockResolvedValue({
      matches: [],
      total: 0,
    });

    await service.run();

    expect(mockMatchRepository.findAll).toHaveBeenCalledWith(
      {},
      { page: 1, limit: 200 }
    );
  });
});
