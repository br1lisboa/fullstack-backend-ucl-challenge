import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Navbar } from "./navbar";

let mockPathname = "/";

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme: vi.fn() }),
}));

describe("Navbar", () => {
  beforeEach(() => {
    mockPathname = "/";
  });

  it("renders the logo", () => {
    render(<Navbar />);
    expect(screen.getByText("UCL Draw")).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    render(<Navbar />);
    expect(screen.getAllByText("Home")).toHaveLength(2); // desktop + mobile
    expect(screen.getAllByText("Matches")).toHaveLength(2);
    expect(screen.getAllByText("Teams")).toHaveLength(2);
    expect(screen.getAllByText("Draw")).toHaveLength(2);
  });

  it("highlights active link based on pathname", () => {
    mockPathname = "/matches";
    render(<Navbar />);
    const matchesLinks = screen.getAllByText("Matches");
    // Desktop link should have primary color
    expect(matchesLinks[0].className).toContain("text-primary");
  });

  it("toggles mobile menu on hamburger click", () => {
    render(<Navbar />);
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
