import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  it("renders the message", () => {
    render(<EmptyState message="No data found." />);
    expect(screen.getByText("No data found.")).toBeInTheDocument();
  });

  it("renders with dashed border container", () => {
    const { container } = render(<EmptyState message="Empty" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("border-dashed");
  });
});
