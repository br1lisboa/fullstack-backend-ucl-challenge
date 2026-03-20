import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/__tests__/test-utils";
import { DrawStats } from "./draw-stats";

describe("DrawStats", () => {
  it("should render statistics after loading", async () => {
    renderWithProviders(<DrawStats />);

    await waitFor(() => {
      expect(screen.getByText("Total Matches")).toBeInTheDocument();
    });

    expect(screen.getByText("144")).toBeInTheDocument();
    expect(screen.getByText("36")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
  });

  it("should show empty state when no draw exists", async () => {
    const { server } = await import("@/__mocks__/server");
    const { http, HttpResponse } = await import("msw");

    server.use(
      http.get("/api/draw/statistics", () =>
        HttpResponse.json({ message: "No draw found" }, { status: 404 })
      )
    );

    renderWithProviders(<DrawStats />);

    await waitFor(() => {
      expect(screen.getByText(/No draw exists yet/)).toBeInTheDocument();
    });
  });
});
