import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Chip, ChipGroup } from "./chip";

describe("Chip", () => {
  it("renders children text", () => {
    render(<Chip>Manchester City</Chip>);
    expect(screen.getByText("Manchester City")).toBeInTheDocument();
  });

  it("renders remove button when onRemove is provided", () => {
    const onRemove = vi.fn();
    render(<Chip onRemove={onRemove}>Barcelona</Chip>);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("does not render remove button when onRemove is omitted", () => {
    render(<Chip>Read-only chip</Chip>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("calls onRemove when remove button is clicked", () => {
    const onRemove = vi.fn();
    render(<Chip onRemove={onRemove}>Liverpool</Chip>);

    fireEvent.click(screen.getByRole("button"));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("applies default variant classes", () => {
    const { container } = render(<Chip>Default</Chip>);
    const chip = container.firstChild as HTMLElement;

    expect(chip.className).toContain("bg-primary/15");
    expect(chip.className).toContain("text-primary");
  });

  it("applies secondary variant classes", () => {
    const { container } = render(<Chip variant="secondary">Secondary</Chip>);
    const chip = container.firstChild as HTMLElement;

    expect(chip.className).toContain("bg-secondary");
  });

  it("applies outline variant classes", () => {
    const { container } = render(<Chip variant="outline">Outline</Chip>);
    const chip = container.firstChild as HTMLElement;

    expect(chip.className).toContain("border");
  });

  it("merges custom className", () => {
    const { container } = render(<Chip className="mt-4">Custom</Chip>);
    const chip = container.firstChild as HTMLElement;

    expect(chip.className).toContain("mt-4");
  });
});

describe("ChipGroup", () => {
  it("renders multiple chips", () => {
    render(
      <ChipGroup>
        <Chip>One</Chip>
        <Chip>Two</Chip>
        <Chip>Three</Chip>
      </ChipGroup>,
    );

    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.getByText("Two")).toBeInTheDocument();
    expect(screen.getByText("Three")).toBeInTheDocument();
  });

  it("applies flex-wrap layout", () => {
    const { container } = render(
      <ChipGroup>
        <Chip>Item</Chip>
      </ChipGroup>,
    );
    const group = container.firstChild as HTMLElement;

    expect(group.className).toContain("flex");
    expect(group.className).toContain("flex-wrap");
    expect(group.className).toContain("gap-1");
  });

  it("merges custom className", () => {
    const { container } = render(
      <ChipGroup className="mt-2">
        <Chip>Item</Chip>
      </ChipGroup>,
    );
    const group = container.firstChild as HTMLElement;

    expect(group.className).toContain("mt-2");
  });
});
