import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Pagination } from "./pagination";

describe("Pagination", () => {
  it("should display page info", () => {
    render(
      <Pagination page={2} totalPages={5} total={100} onPageChange={() => {}} />
    );

    expect(screen.getByText(/100 results/)).toBeInTheDocument();
    expect(screen.getByText(/Page 2 of 5/)).toBeInTheDocument();
  });

  it("should call onPageChange with previous page", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination page={3} totalPages={5} total={100} onPageChange={onPageChange} />
    );

    fireEvent.click(screen.getByText("Previous"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("should call onPageChange with next page", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination page={3} totalPages={5} total={100} onPageChange={onPageChange} />
    );

    fireEvent.click(screen.getByText("Next"));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("should disable Previous on first page", () => {
    render(
      <Pagination page={1} totalPages={5} total={100} onPageChange={() => {}} />
    );

    expect(screen.getByText("Previous")).toBeDisabled();
  });

  it("should disable Next on last page", () => {
    render(
      <Pagination page={5} totalPages={5} total={100} onPageChange={() => {}} />
    );

    expect(screen.getByText("Next")).toBeDisabled();
  });
});
