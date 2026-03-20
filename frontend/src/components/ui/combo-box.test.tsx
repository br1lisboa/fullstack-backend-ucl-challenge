import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ComboBox } from "./combo-box";

const options = [
  { value: "1", label: "Barcelona" },
  { value: "2", label: "Real Madrid" },
  { value: "3", label: "Bayern München" },
];

describe("ComboBox", () => {
  it("renders the input with placeholder", () => {
    render(
      <ComboBox
        options={options}
        selected={[]}
        onChange={vi.fn()}
        placeholder="Search teams..."
      />,
    );
    expect(screen.getByPlaceholderText("Search teams...")).toBeInTheDocument();
  });

  it("shows dropdown when input is focused", () => {
    render(
      <ComboBox options={options} selected={[]} onChange={vi.fn()} />,
    );
    fireEvent.focus(screen.getByRole("textbox"));
    expect(screen.getByText("Barcelona")).toBeInTheDocument();
    expect(screen.getByText("Real Madrid")).toBeInTheDocument();
  });

  it("filters options by search term", () => {
    render(
      <ComboBox options={options} selected={[]} onChange={vi.fn()} />,
    );
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "bay" } });

    expect(screen.getByText("Bayern München")).toBeInTheDocument();
    expect(screen.queryByText("Barcelona")).not.toBeInTheDocument();
  });

  it("calls onChange when an option is selected", () => {
    const onChange = vi.fn();
    render(
      <ComboBox options={options} selected={[]} onChange={onChange} />,
    );
    fireEvent.focus(screen.getByRole("textbox"));
    fireEvent.click(screen.getByText("Barcelona"));

    expect(onChange).toHaveBeenCalledWith(["1"]);
  });

  it("renders chips for selected values", () => {
    render(
      <ComboBox
        options={options}
        selected={["1", "3"]}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByText("Barcelona")).toBeInTheDocument();
    expect(screen.getByText("Bayern München")).toBeInTheDocument();
  });

  it("excludes selected options from dropdown", () => {
    render(
      <ComboBox
        options={options}
        selected={["1"]}
        onChange={vi.fn()}
      />,
    );
    fireEvent.focus(screen.getByRole("textbox"));
    expect(screen.queryByText("Real Madrid")).toBeInTheDocument();
    // Barcelona appears as chip but not in dropdown
    const barcelonaElements = screen.getAllByText("Barcelona");
    expect(barcelonaElements).toHaveLength(1); // only the chip
  });

  it("calls onChange to remove a chip", () => {
    const onChange = vi.fn();
    render(
      <ComboBox
        options={options}
        selected={["1", "2"]}
        onChange={onChange}
      />,
    );
    // Click the remove button on first chip
    const removeButtons = screen.getAllByRole("button");
    fireEvent.click(removeButtons[0]);

    expect(onChange).toHaveBeenCalledWith(["2"]);
  });
});
