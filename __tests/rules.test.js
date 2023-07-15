const {
  basics,
  colors,
  text,
  rounded,
  outline,
  shadow,
  parse,
  simple,
  getContext,
} = require("../src/rules");

describe("getContext", () => {
  test("flex", () => {
    expect(getContext({ flex: { value: 1 } })).toEqual({
      context: "hstack",
      explanation:
        "Used the hstack pattern for a flex box in the horizontal direction",
    });
  });
  test("flex column", () => {
    expect(getContext({ flex: { value: 1 }, flexDirection: "column" })).toEqual(
      {
        context: "vstack",
        explanation:
          "Used the vstack pattern for a flex box in the vertical direction",
      }
    );
  });
  test("grid", () => {
    expect(getContext({ display: "grid" })).toEqual({
      context: "grid",
      explanation: "Used the grid pattern for a grid",
    });
  });
  test("gridItem", () => {
    expect(getContext({ colSpan: 1 })).toEqual({
      context: "gridItem",
      explanation: "Used the gridItem pattern for an item within a grid",
    });
  });
  test("p-2", () => {
    expect(getContext({ p: 2 })).toEqual({
      context: "css",
      explanation: null,
    });
  });
});

describe("parse", () => {
  test("outline-2", () => {
    expect(parse("outline-2").panda).toEqual({
      outlineStyle: "solid",
      outlineWidth: 2,
    });
  });
  test("rounded bg-indigo-600 px-2 py-1 text-xs font-semibold", () => {
    expect(
      parse("rounded bg-indigo-600 px-2 py-1 text-xs font-semibold").panda
    ).toEqual({
      bg: "indigo:600",
      fontSize: "xs",
      fontWeight: "semibold",
      px: 2,
      py: 1,
      rounded: "0.25rem",
    });
  });
  test("md:bg-indigo-600 sm:bg-indigo-100", () => {
    expect(parse("md:bg-indigo-600 sm:bg-indigo-100").panda).toEqual({
      md: {
        bg: "indigo:600",
      },
      sm: {
        bg: "indigo:100",
      },
    });
  });
  test("flex", () => {
    expect(parse("flex").explanation).toEqual([
      { className: "flex", explanation: "{ flex: 1 }" },
    ]);
  });
  test("sm:flex", () => {
    expect(parse("sm:flex").explanation).toEqual([
      { className: "sm:flex", explanation: "{ sm: { flex: 1 } }" },
    ]);
  });
});

describe("simple", () => {
  test("flex", () => {
    expect(simple("flex")).toEqual({
      attribute: "flex",
      value: 1,
      scope: null,
    });
  });
});

describe("shadow", () => {
  test("shadow", () => {
    expect(shadow("shadow-sm")).toEqual({
      attribute: "shadow",
      value: "sm",
      scope: null,
    });
  });
});

describe("outline", () => {
  test("outline-offset-2", () => {
    expect(outline("outline-offset-2")).toEqual({
      attribute: "outlineOffset",
      value: 2,
      scope: null,
    });
  });
  test("outline-2", () => {
    expect(outline("outline-2")).toEqual([
      { attribute: "outlineStyle", scope: null, value: "solid" },
      { attribute: "outlineWidth", scope: null, value: 2 },
    ]);
  });
  test("outline-indigo-600", () => {
    expect(outline("outline-indigo-600")).toEqual({
      attribute: "outlineColor",
      value: "indigo:600",
      scope: null,
    });
  });
});

describe("rounded", () => {
  test("rounded", () => {
    expect(rounded("rounded")).toEqual({
      attribute: "rounded",
      value: "0.25rem",
      scope: null,
    });
  });
  test("rounded-md", () => {
    expect(rounded("rounded-md")).toEqual({
      attribute: "rounded",
      value: "md",
      scope: null,
    });
  });
  test("rounded-top-sm", () => {
    expect(rounded("rounded-top-sm")).toEqual({
      attribute: "roundedTop",
      value: "sm",
      scope: null,
    });
  });
});

describe("text", () => {
  test("font-semibold", () => {
    expect(text("font-semibold")).toEqual({
      attribute: "fontWeight",
      value: "semibold",
      scope: null,
    });
  });
  test("text-white", () => {
    expect(text("text-white")).toEqual({
      attribute: "color",
      value: "white",
      scope: null,
    });
  });
  test("text-indigo-500", () => {
    expect(text("text-indigo-500")).toEqual({
      attribute: "color",
      value: "indigo:500",
      scope: null,
    });
  });
  test("text-xs", () => {
    expect(text("text-xs")).toEqual({
      attribute: "fontSize",
      value: "xs",
      scope: null,
    });
  });
});

describe("colors", () => {
  test("bg-indigo-500", () => {
    expect(colors("bg-indigo-500")).toEqual({
      attribute: "bg",
      value: "indigo:500",
      scope: null,
    });
  });
});

describe("basics", () => {
  test("px-3", () => {
    expect(basics("px-3")).toEqual({ attribute: "px", value: 3, scope: null });
  });
  test("p-2.5", () => {
    expect(basics("p-2.5")).toEqual({
      attribute: "p",
      value: 2.5,
      scope: null,
    });
  });
  test("sm:my-5", () => {
    expect(basics("sm:my-5")).toEqual({
      attribute: "my",
      value: 5,
      scope: "sm",
    });
  });
  test("sm:mx-auto", () => {
    expect(basics("sm:mx-auto")).toEqual({
      attribute: "mx",
      value: "auto",
      scope: "sm",
    });
  });
  test("hover:pt-5", () => {
    expect(basics("hover:pt-5")).toEqual({
      attribute: "pt",
      value: 5,
      scope: "_hover",
    });
  });
});
