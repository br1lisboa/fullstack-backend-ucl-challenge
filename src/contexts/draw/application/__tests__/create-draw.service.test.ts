import { describe, it, expect, beforeEach, vi } from "vitest";
import { CreateDrawService } from "../create-draw.service";
import { DrawRepository } from "../../domain/draw.repository";
import { DrawAlreadyExistsError } from "../../domain/exceptions/draw-already-exists.error";

vi.mock("../../domain/draw.js", () => ({
  Draw: {
    create: vi.fn().mockReturnValue({
      toPrimitives: () => ({
        id: 1,
        createdAt: new Date(),
        pots: [],
        matches: [],
      }),
    }),
  },
}));

vi.mock("../../domain/application/pot-assigner.service.js", () => ({
  PotAssigner: {
    fromTeamList: vi.fn().mockReturnValue(new Map()),
  },
}));

describe("CreateDrawService", () => {
  let service: CreateDrawService;
  let mockRepository: DrawRepository;

  beforeEach(() => {
    mockRepository = {
      save: vi.fn(),
      searchCurrent: vi.fn(),
      findAllTeams: vi.fn().mockResolvedValue([]),
      deleteAll: vi.fn(),
    } as any;

    service = new CreateDrawService(mockRepository);
  });

  it("should throw DrawAlreadyExistsError when a draw already exists", async () => {
    vi.mocked(mockRepository.searchCurrent).mockResolvedValue({} as any);

    await expect(service.run()).rejects.toThrow(DrawAlreadyExistsError);
    await expect(service.run()).rejects.toThrow("A draw already exists");
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it("should create a draw when no draw exists", async () => {
    vi.mocked(mockRepository.searchCurrent).mockResolvedValue(null);

    await service.run();

    expect(mockRepository.searchCurrent).toHaveBeenCalledOnce();
    expect(mockRepository.findAllTeams).toHaveBeenCalledOnce();
    expect(mockRepository.save).toHaveBeenCalledOnce();
  });

  it("should check for existing draw before creating", async () => {
    vi.mocked(mockRepository.searchCurrent).mockResolvedValue(null);

    await service.run();

    const searchOrder = vi.mocked(mockRepository.searchCurrent).mock
      .invocationCallOrder[0];
    const findTeamsOrder = vi.mocked(mockRepository.findAllTeams).mock
      .invocationCallOrder[0];

    expect(searchOrder).toBeLessThan(findTeamsOrder);
  });
});
