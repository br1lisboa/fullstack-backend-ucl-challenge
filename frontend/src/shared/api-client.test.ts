import { describe, it, expect } from "vitest";
import { apiFetch, ApiError } from "./api-client";
import { server } from "@/__mocks__/server";
import { http, HttpResponse } from "msw";

describe("apiFetch", () => {
  it("should return JSON data on success", async () => {
    const data = await apiFetch("/health");
    expect(data).toHaveProperty("status", "ok");
  });

  it("should throw ApiError on 404", async () => {
    server.use(
      http.get("/api/draw", () =>
        HttpResponse.json({ message: "No draw found" }, { status: 404 })
      )
    );

    await expect(apiFetch("/draw")).rejects.toThrow(ApiError);
    await expect(apiFetch("/draw")).rejects.toThrow("No draw found");
  });

  it("should throw ApiError with status code", async () => {
    server.use(
      http.post("/api/draw", () =>
        new HttpResponse("Draw already exists", { status: 409 })
      )
    );

    try {
      await apiFetch("/draw", { method: "POST" });
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).status).toBe(409);
    }
  });

  it("should handle plain text error responses", async () => {
    server.use(
      http.get("/api/test", () =>
        new HttpResponse("Something went wrong", { status: 500 })
      )
    );

    await expect(apiFetch("/test")).rejects.toThrow("Something went wrong");
  });
});
