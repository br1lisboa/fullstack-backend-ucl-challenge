import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TeamCard } from "./team-card";
import type { Team } from "@/shared/types";

const team: Team = {
  id: 1,
  name: "Barcelona",
  country: { id: 1, name: "Spain" },
};

describe("TeamCard", () => {
  it("renders team name", () => {
    render(<TeamCard team={team} />);
    expect(screen.getByText("Barcelona")).toBeInTheDocument();
  });

  it("renders country badge", () => {
    render(<TeamCard team={team} />);
    expect(screen.getByText("Spain")).toBeInTheDocument();
  });

  it("links to team detail page", () => {
    render(<TeamCard team={team} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/teams/1");
  });
});
