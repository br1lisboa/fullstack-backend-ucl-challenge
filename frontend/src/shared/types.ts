export interface Country {
  id: number;
  name: string;
}

export interface Team {
  id: number;
  name: string;
  country: Country;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  matchDay: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  matches: T[];
  pagination: Pagination;
}

export interface DrawStatistics {
  totalMatches: number;
  totalTeams: number;
  matchDays: number;
  matchesPerMatchDay: Record<number, number>;
  countriesDistribution: Array<{ country: string; teamCount: number }>;
}

export interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
}
