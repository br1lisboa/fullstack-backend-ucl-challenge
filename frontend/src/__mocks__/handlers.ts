import { http, HttpResponse } from "msw";

const BASE = "/api";

const mockTeams = [
  { id: 1, name: "Real Madrid", country: { id: 1, name: "Spain" } },
  { id: 2, name: "Manchester City", country: { id: 2, name: "England" } },
  { id: 3, name: "Bayern Munich", country: { id: 3, name: "Germany" } },
];

const mockMatches = [
  {
    id: "1",
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    matchDay: 1,
  },
  {
    id: "2",
    homeTeam: mockTeams[2],
    awayTeam: mockTeams[0],
    matchDay: 2,
  },
];

const mockDraw = {
  id: 1,
  createdAt: "2026-03-20T00:00:00.000Z",
  pots: [],
  matches: [],
};

const mockStats = {
  totalMatches: 144,
  totalTeams: 36,
  matchDays: 8,
  matchesPerMatchDay: { 1: 18, 2: 18, 3: 18, 4: 18, 5: 18, 6: 18, 7: 18, 8: 18 },
  countriesDistribution: [
    { country: "Spain", teamCount: 5 },
    { country: "England", teamCount: 6 },
  ],
};

export const handlers = [
  http.get(`${BASE}/health`, () =>
    HttpResponse.json({
      status: "ok",
      service: "champions-league-draw-api",
      timestamp: new Date().toISOString(),
    })
  ),

  http.get(`${BASE}/draw`, () => HttpResponse.json(mockDraw)),

  http.post(`${BASE}/draw`, () =>
    HttpResponse.json({ message: "Draw created successfully" }, { status: 201 })
  ),

  http.delete(`${BASE}/draw`, () =>
    HttpResponse.json({ message: "Draw deleted successfully" })
  ),

  http.get(`${BASE}/draw/statistics`, () => HttpResponse.json(mockStats)),

  http.get(`${BASE}/matches`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || 1);
    const limit = Number(url.searchParams.get("limit") || 20);

    return HttpResponse.json({
      matches: mockMatches,
      pagination: {
        page,
        limit,
        total: mockMatches.length,
        totalPages: Math.ceil(mockMatches.length / limit),
      },
    });
  }),

  http.get(`${BASE}/matches/:id`, ({ params }) => {
    const match = mockMatches.find((m) => m.id === params.id);
    if (!match) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json(match);
  }),

  http.get(`${BASE}/teams`, () => HttpResponse.json(mockTeams)),

  http.get(`${BASE}/teams/:id`, ({ params }) => {
    const team = mockTeams.find((t) => t.id === Number(params.id));
    if (!team) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json({
      team,
      matches: mockMatches.filter(
        (m) => m.homeTeam.id === team.id || m.awayTeam.id === team.id
      ),
    });
  }),
];

export { mockTeams, mockMatches, mockDraw, mockStats };
