import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { I18nProvider, useDictionary, useLocale } from "./context";
import en from "../../messages/en.json";
import es from "../../messages/es.json";

function DictionaryConsumer() {
  const t = useDictionary();
  return <span>{t.nav.home}</span>;
}

function LocaleConsumer() {
  const locale = useLocale();
  return <span>{locale}</span>;
}

describe("I18nProvider", () => {
  it("provides dictionary to consumers", () => {
    render(
      <I18nProvider locale="en" dictionary={en}>
        <DictionaryConsumer />
      </I18nProvider>
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("provides locale to consumers", () => {
    render(
      <I18nProvider locale="es" dictionary={es}>
        <LocaleConsumer />
      </I18nProvider>
    );
    expect(screen.getByText("es")).toBeInTheDocument();
  });

  it("switches translations when locale changes", () => {
    const { rerender } = render(
      <I18nProvider locale="en" dictionary={en}>
        <DictionaryConsumer />
      </I18nProvider>
    );
    expect(screen.getByText("Home")).toBeInTheDocument();

    rerender(
      <I18nProvider locale="es" dictionary={es}>
        <DictionaryConsumer />
      </I18nProvider>
    );
    expect(screen.getByText("Inicio")).toBeInTheDocument();
  });

  it("throws when useDictionary is used outside provider", () => {
    expect(() => render(<DictionaryConsumer />)).toThrow(
      "useDictionary must be used within I18nProvider"
    );
  });

  it("throws when useLocale is used outside provider", () => {
    expect(() => render(<LocaleConsumer />)).toThrow(
      "useLocale must be used within I18nProvider"
    );
  });
});
