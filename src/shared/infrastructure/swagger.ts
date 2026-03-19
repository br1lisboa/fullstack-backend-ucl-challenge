import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Champions League Draw API",
      version: "1.0.0",
      description:
        "API for managing the Champions League Swiss Round draw — 36 teams, 8 match days, 144 matches.",
    },
    servers: [{ url: "http://localhost:8000" }],
    components: {
      schemas: {
        Country: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
          },
        },
        Team: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            country: { $ref: "#/components/schemas/Country" },
          },
        },
        Match: {
          type: "object",
          properties: {
            id: { type: "string" },
            homeTeam: { $ref: "#/components/schemas/Team" },
            awayTeam: { $ref: "#/components/schemas/Team" },
            matchDay: { type: "integer", minimum: 1, maximum: 8 },
          },
        },
        Pagination: {
          type: "object",
          properties: {
            page: { type: "integer" },
            limit: { type: "integer" },
            total: { type: "integer" },
            totalPages: { type: "integer" },
          },
        },
        MatchesResponse: {
          type: "object",
          properties: {
            matches: {
              type: "array",
              items: { $ref: "#/components/schemas/Match" },
            },
            pagination: { $ref: "#/components/schemas/Pagination" },
          },
        },
        DrawStatistics: {
          type: "object",
          properties: {
            totalMatches: { type: "integer" },
            totalTeams: { type: "integer" },
            matchDays: { type: "integer" },
            matchesPerMatchDay: { type: "object" },
            countriesDistribution: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  country: { type: "string" },
                  teamCount: { type: "integer" },
                },
              },
            },
          },
        },
        HealthResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "ok" },
            service: {
              type: "string",
              example: "champions-league-draw-api",
            },
            timestamp: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    paths: {
      "/health": {
        get: {
          tags: ["Health"],
          summary: "Health check",
          responses: {
            200: {
              description: "Service is healthy",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/HealthResponse" },
                },
              },
            },
          },
        },
      },
      "/draw": {
        post: {
          tags: ["Draw"],
          summary: "Execute the Champions League draw",
          responses: {
            201: { description: "Draw created successfully" },
            409: { description: "Draw already exists" },
          },
        },
        get: {
          tags: ["Draw"],
          summary: "Get the current draw",
          responses: {
            200: { description: "Draw details" },
            404: { description: "No draw found" },
          },
        },
        delete: {
          tags: ["Draw"],
          summary: "Delete the current draw",
          responses: {
            200: { description: "Draw deleted successfully" },
            404: { description: "No draw found" },
          },
        },
      },
      "/draw/statistics": {
        get: {
          tags: ["Draw"],
          summary: "Get draw statistics",
          responses: {
            200: {
              description: "Draw statistics",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/DrawStatistics" },
                },
              },
            },
            404: { description: "No draw found" },
          },
        },
      },
      "/matches": {
        get: {
          tags: ["Matches"],
          summary: "Search matches with filters and pagination",
          parameters: [
            {
              name: "teamId",
              in: "query",
              schema: { type: "integer" },
              description: "Filter by team ID",
            },
            {
              name: "matchDay",
              in: "query",
              schema: { type: "integer", minimum: 1, maximum: 8 },
              description: "Filter by match day (1-8)",
            },
            {
              name: "page",
              in: "query",
              schema: { type: "integer", minimum: 1, default: 1 },
            },
            {
              name: "limit",
              in: "query",
              schema: { type: "integer", minimum: 1, maximum: 100, default: 10 },
            },
          ],
          responses: {
            200: {
              description: "Paginated matches",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/MatchesResponse" },
                },
              },
            },
            400: { description: "Invalid query parameters" },
          },
        },
      },
      "/matches/{id}": {
        get: {
          tags: ["Matches"],
          summary: "Get a match by ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: {
              description: "Match details",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Match" },
                },
              },
            },
            404: { description: "Match not found" },
          },
        },
      },
      "/teams": {
        get: {
          tags: ["Teams"],
          summary: "List all 36 teams",
          responses: {
            200: {
              description: "All teams",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Team" },
                  },
                },
              },
            },
          },
        },
      },
      "/teams/{id}": {
        get: {
          tags: ["Teams"],
          summary: "Get team detail with matches",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Team with matches" },
            404: { description: "Team not found" },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

export function registerSwagger(app: Express): void {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
