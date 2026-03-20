import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithI18n } from "@/__tests__/test-utils";
import { TeamGrid } from "./team-grid";
import type { Team } from "@/shared/types";

const teams: Team[] = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  name: `Team ${i + 1}`,
  country: { id: 1, name: "Spain" },
}));

describe("TeamGrid", () => {
  it("should group teams by pot (9 per pot)", () => {
    renderWithI18n(<TeamGrid teams={teams} />);

    expect(screen.getByText("Pot 1")).toBeInTheDocument();
    expect(screen.getByText("Pot 2")).toBeInTheDocument();
  });

  it("should render team names", () => {
    renderWithI18n(<TeamGrid teams={teams} />);

    expect(screen.getByText("Team 1")).toBeInTheDocument();
    expect(screen.getByText("Team 18")).toBeInTheDocument();
  });

  it("should render country badges", () => {
    renderWithI18n(<TeamGrid teams={teams} />);

    const badges = screen.getAllByText("Spain");
    expect(badges.length).toBe(18);
  });
});
