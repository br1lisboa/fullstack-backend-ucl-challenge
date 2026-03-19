export const TYPES = {
  // Matches Context
  MatchRepository: Symbol.for("MatchRepository"),
  SearchMatchesService: Symbol.for("SearchMatchesService"),

  // Draw Context
  DrawRepository: Symbol.for("DrawRepository"),
  CreateDrawService: Symbol.for("CreateDrawService"),
  SearchCurrentDrawService: Symbol.for("SearchCurrentDrawService"),
  DrawStatisticsService: Symbol.for("DrawStatisticsService"),

  // Teams Context
  TeamRepository: Symbol.for("TeamRepository"),
  SearchTeamsService: Symbol.for("SearchTeamsService"),
  SearchTeamByIdService: Symbol.for("SearchTeamByIdService"),

  // Infrastructure
  PrismaClient: Symbol.for("PrismaClient"),
};
