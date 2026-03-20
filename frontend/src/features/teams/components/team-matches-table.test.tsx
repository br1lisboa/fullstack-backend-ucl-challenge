import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TeamMatchesTable } from "./team-matches-table";
import type { Match } from "@/shared/types";

const matches: Match[] = [
  {
    id: "1",
    homeTeam: { id: 1, name: "Real Madrid", country: { id: 1, name: "Spain" } },
    awayTeam: { id: 3, name: "Bayern Munich", country: { id: 3, name: "Germany" } },
    matchDay: 2,
  },
  {
    id: "2",
    homeTeam: { id: 5, name: "Liverpool", country: { id: 2, name: "England" } },
    awayTeam: { id: 1, name: "Real Madrid", country: { id: 1, name: "Spain" } },
    matchDay: 1,
  },
];

describe("TeamMatchesTable", () => {
  it("should render opponents relative to teamId", () => {
    render(<TeamMatchesTable matches={matches} teamId={1} />);

    expect(screen.getByText("Bayern Munich")).toBeInTheDocument();
    expect(screen.getByText("Liverpool")).toBeInTheDocument();
  });

  it("should show Home/Away badges", () => {
    render(<TeamMatchesTable matches={matches} teamId={1} />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Away")).toBeInTheDocument();
  });

  it("should sort by matchDay ascending", () => {
    render(<TeamMatchesTable matches={matches} teamId={1} />);

    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("1");
    expect(rows[2]).toHaveTextContent("2");
  });

  it("should show empty state when no matches", () => {
    render(<TeamMatchesTable matches={[]} teamId={1} />);

    expect(screen.getByText(/No matches yet/)).toBeInTheDocument();
  });
});
