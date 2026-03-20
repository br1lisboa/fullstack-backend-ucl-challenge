import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatCards } from "./stat-cards";

describe("StatCards", () => {
  it("should render items with title and value", () => {
    render(
      <StatCards>
        <StatCards.Item title="Total" value={144} />
        <StatCards.Item title="Teams" value={36} />
      </StatCards>
    );

    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("144")).toBeInTheDocument();
    expect(screen.getByText("Teams")).toBeInTheDocument();
    expect(screen.getByText("36")).toBeInTheDocument();
  });

  it("should render skeletons when loading", () => {
    const { container } = render(
      <StatCards loading>
        <StatCards.Item title="Total" value={0} />
        <StatCards.Item title="Teams" value={0} />
      </StatCards>
    );

    expect(container.querySelectorAll("[data-slot='skeleton']").length).toBeGreaterThan(0);
    expect(screen.queryByText("Total")).not.toBeInTheDocument();
  });
});
