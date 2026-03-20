import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithI18n } from "@/__tests__/test-utils";
import { Navbar } from "./navbar";

let mockPathname = "/en";

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme: vi.fn() }),
}));

describe("Navbar", () => {
  beforeEach(() => {
    mockPathname = "/en";
  });

  it("renders the logo", () => {
    renderWithI18n(<Navbar />);
    expect(screen.getByText("UCL Draw")).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    renderWithI18n(<Navbar />);
    expect(screen.getAllByText("Home")).toHaveLength(2); // desktop + mobile
    expect(screen.getAllByText("Matches")).toHaveLength(2);
    expect(screen.getAllByText("Teams")).toHaveLength(2);
    expect(screen.getAllByText("Draw")).toHaveLength(2);
  });

  it("highlights active link based on pathname", () => {
    mockPathname = "/en/matches";
    renderWithI18n(<Navbar />);
    const matchesLinks = screen.getAllByText("Matches");
    // Desktop link should have primary color
    expect(matchesLinks[0].className).toContain("text-primary");
  });

  it("toggles mobile menu on hamburger click", () => {
    renderWithI18n(<Navbar />);
    const menuButton = screen.getByRole("button", { name: "Menu" });

    // Mobile menu starts collapsed (grid-rows-[0fr])
    const mobileMenu = menuButton
      .closest("nav")!
      .querySelector("[class*='grid']") as HTMLElement;
    expect(mobileMenu.className).toContain("grid-rows-[0fr]");

    fireEvent.click(menuButton);
    expect(mobileMenu.className).toContain("grid-rows-[1fr]");
  });
});
