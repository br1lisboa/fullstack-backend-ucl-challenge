import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithI18n } from "@/__tests__/test-utils";
import { LanguageSelector } from "./language-selector";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/en/matches",
  useRouter: () => ({ push: mockPush }),
}));

describe("LanguageSelector", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("renders globe button", () => {
    renderWithI18n(<LanguageSelector />);
    expect(screen.getByRole("button", { name: "Change language" })).toBeInTheDocument();
  });

  it("shows dropdown with all languages on click", () => {
    renderWithI18n(<LanguageSelector />);
    fireEvent.click(screen.getByRole("button", { name: "Change language" }));

    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Español")).toBeInTheDocument();
    expect(screen.getByText("Português")).toBeInTheDocument();
  });

  it("navigates to new locale on selection", () => {
    renderWithI18n(<LanguageSelector />);
    fireEvent.click(screen.getByRole("button", { name: "Change language" }));
    fireEvent.click(screen.getByText("Español"));

    expect(mockPush).toHaveBeenCalledWith("/es/matches");
  });

  it("closes dropdown after selection", () => {
    renderWithI18n(<LanguageSelector />);
    fireEvent.click(screen.getByRole("button", { name: "Change language" }));
    expect(screen.getByText("Português")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Español"));
    expect(screen.queryByText("Português")).not.toBeInTheDocument();
  });

  it("closes dropdown on outside click", () => {
    renderWithI18n(<LanguageSelector />);
    fireEvent.click(screen.getByRole("button", { name: "Change language" }));
    expect(screen.getByText("English")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByText("English")).not.toBeInTheDocument();
  });
});
