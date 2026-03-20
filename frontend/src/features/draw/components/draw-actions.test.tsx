import { describe, it, expect } from "vitest";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/__tests__/test-utils";
import { DrawActions } from "./draw-actions";

describe("DrawActions", () => {
  it("should show Delete button when draw exists", async () => {
    renderWithProviders(<DrawActions />);

    await waitFor(() => {
      expect(screen.getByText("Delete Draw")).toBeInTheDocument();
    });
  });

  it("should show Execute button when no draw exists", async () => {
    const { server } = await import("@/__mocks__/server");
    const { http, HttpResponse } = await import("msw");

    server.use(
      http.get("/api/draw", () =>
        HttpResponse.json({ message: "No draw found" }, { status: 404 })
      )
    );

    renderWithProviders(<DrawActions />);

    await waitFor(() => {
      expect(screen.getByText("Execute Draw")).toBeInTheDocument();
    });
  });

  it("should show confirmation dialog on Delete click", async () => {
    renderWithProviders(<DrawActions />);

    await waitFor(() => {
      expect(screen.getByText("Delete Draw")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Delete Draw"));

    await waitFor(() => {
      expect(screen.getByText("Delete draw?")).toBeInTheDocument();
      expect(screen.getByText(/cannot be undone/)).toBeInTheDocument();
    });
  });
});
