import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DataTable } from "./data-table";

interface Item {
  id: number;
  name: string;
}

const items: Item[] = [
  { id: 1, name: "Alpha" },
  { id: 2, name: "Beta" },
];

describe("DataTable", () => {
  it("should render headers and rows", () => {
    render(
      <DataTable<Item> data={items} keyExtractor={(i) => i.id}>
        <DataTable.Column<Item> header="ID" render={(i) => i.id} />
        <DataTable.Column<Item> header="Name" render={(i) => i.name} />
      </DataTable>
    );

    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("should show loading skeleton", () => {
    const { container } = render(
      <DataTable<Item> data={undefined} loading keyExtractor={(i) => i.id}>
        <DataTable.Column<Item> header="Name" render={(i) => i.name} />
      </DataTable>
    );

    expect(container.querySelectorAll("[data-slot='skeleton']").length).toBeGreaterThan(0);
  });

  it("should show empty state message", () => {
    render(
      <DataTable<Item> data={[]} empty="No items" keyExtractor={(i) => i.id}>
        <DataTable.Column<Item> header="Name" render={(i) => i.name} />
      </DataTable>
    );

    expect(screen.getByText("No items")).toBeInTheDocument();
  });

  it("should show error state", () => {
    render(
      <DataTable<Item> data={undefined} error="Fetch failed" keyExtractor={(i) => i.id}>
        <DataTable.Column<Item> header="Name" render={(i) => i.name} />
      </DataTable>
    );

    expect(screen.getByText("Fetch failed")).toBeInTheDocument();
  });
});
