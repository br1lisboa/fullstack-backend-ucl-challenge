import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithI18n } from "@/__tests__/test-utils";
import { TeamCard } from "./team-card";
import type { Team } from "@/shared/types";

const team: Team = {
  id: 1,
  name: "Barcelona",
  country: { id: 1, name: "Spain" },
};

describe("TeamCard", () => {
  it("renders team name", () => {
    renderWithI18n(<TeamCard team={team} />);
    expect(screen.getByText("Barcelona")).toBeInTheDocument();
  });

  it("renders country badge", () => {
    renderWithI18n(<TeamCard team={team} />);
    expect(screen.getByText("Spain")).toBeInTheDocument();
  });

  it("links to team detail page", () => {
    renderWithI18n(<TeamCard team={team} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/en/teams/1");
  });
});
