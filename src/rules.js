const scopeMap = {
  "focus-visible": "_focus-visible",
  hover: "_hover",
  active: "_active",
  focus: "_focus",
  "focus-within": "_focus-within",
  disabled: "_disabled",
};

const simpleMap = {
  flex: { attribute: "flex", value: 1 },
  "flex-1": { attribute: "flex", value: 1 },
  "flex-auto": { attribute: "flex", value: "auto" },
  "flex-initial": { attribute: "flex", value: "initial" },
  "flex-none": { attribute: "flex", value: "none" },
  "flex-row": { attribute: "flexDirection", value: "row" },
  "flex-row-reverse": { attribute: "flexDirection", value: "row-reverse" },
  "flex-col": { attribute: "flexDirection", value: "column" },
  "flex-col-reverse": { attribute: "flexDirection", value: "column-reverse" },
  "flex-wrap": { attribute: "flexWrap", value: "wrap" },
  "flex-wrap-reverse": { attribute: "flexWrap", value: "wrap-reverse" },
  "flex-nowrap": { attribute: "flexWrap", value: "nowrap" },
  "flex-grow": { attribute: "flexGrow", value: 1 },
  "flex-grow-0": { attribute: "flexGrow", value: 0 },
  "flex-shrink": { attribute: "flexShrink", value: 1 },
  "flex-shrink-0": { attribute: "flexShrink", value: 0 },

  grid: { attribute: "display", value: "grid" },
  "grid-cols-1": { attribute: "colSpan", value: 1 },
  "grid-cols-2": { attribute: "colSpan", value: 2 },
  "grid-cols-3": { attribute: "colSpan", value: 3 },
  "grid-cols-4": { attribute: "colSpan", value: 4 },
  "grid-cols-5": { attribute: "colSpan", value: 5 },
  "grid-cols-6": { attribute: "colSpan", value: 6 },
  "grid-cols-7": { attribute: "colSpan", value: 7 },
  "grid-cols-8": { attribute: "colSpan", value: 8 },
  "grid-cols-9": { attribute: "colSpan", value: 9 },
  "grid-cols-10": { attribute: "colSpan", value: 10 },
  "grid-cols-11": { attribute: "colSpan", value: 11 },
  "grid-cols-12": { attribute: "colSpan", value: 12 },

  "text-center": { attribute: "textAlign", value: "center" },
  "text-left": { attribute: "textAlign", value: "left" },
  "text-right": { attribute: "textAlign", value: "right" },
  "text-justify": { attribute: "textAlign", value: "justify" },
};

const simple = (css) => {
  const [scope, rule] = getScopeAndRule(css);
  if (simpleMap[rule]) {
    return { ...simpleMap[rule], scope };
  }
};

const shadow = (css) => {
  const [scope, rule] = getScopeAndRule(css);
  if (rule.startsWith("shadow-")) {
    const value = rule.replace("shadow-", "");
    return { attribute: "shadow", value, scope };
  }
};

const outline = (css) => {
  const [scope, rule] = getScopeAndRule(css);
  if (rule.startsWith("outline-offset-")) {
    const value = rule.replace("outline-offset-", "");
    return { attribute: "outlineOffset", value: +value, scope };
  }
  if (rule.startsWith("outline-")) {
    const [outline, ...rest] = rule.split("-");
    if (rest.length === 1) {
      const value = rule.replace("outline-", "");
      return [
        { attribute: "outlineStyle", value: "solid", scope },
        { attribute: "outlineWidth", value: +value, scope },
      ];
    } else {
      return { attribute: "outlineColor", value: rest.join(":"), scope };
    }
  }
};

const roundedMap = {
  "rounded-top": "roundedTop",
  "rounded-top-": "roundedTop",
  "rounded-left": "roundedLeft",
  "rounded-left-": "roundedLeft",
  "rounded-bottom": "roundedBottom",
  "rounded-bottom-": "roundedBottom",
  "rounded-right": "roundedRight",
  "rounded-right-": "roundedRight",
  rounded: "rounded",
  "rounded-": "rounded",
};

const rounded = (css) => {
  const [scope, rule] = getScopeAndRule(css);
  for (const key of Object.keys(roundedMap)) {
    if (rule.startsWith(key)) {
      const value = rule.replace(key, "").replace("-", "");
      return {
        attribute: roundedMap[key],
        value: value.length ? value : "0.25rem",
        scope,
      };
    }
  }
};

const getScopeAndRule = (css) => {
  if (css.match(":")) {
    const [scope, rule] = css.split(":");
    return [scopeMap[scope] ?? scope, rule];
  }
  return [null, css];
};

const text = (css) => {
  const [scope, rule] = getScopeAndRule(css);
  const [attribute, ...rest] = rule.split("-");
  if (attribute === "font" && rest.length === 1) {
    if (
      [
        "thin",
        "extralight",
        "light",
        "normal",
        "medium",
        "semibold",
        "bold",
        "extrabold",
        "black",
      ].includes(rest[0])
    ) {
      return { attribute: "fontWeight", value: rest[0], scope };
    }
  }
  if (attribute === "text" && rest.length) {
    if (
      [
        "2xs",
        "xs",
        "sm",
        "md",
        "lg",
        "xl",
        "2xl",
        "3xl",
        "4xl",
        "5xl",
        "6xl",
        "7xl",
        "8xl",
        "9xl",
      ].includes(rest[0])
    ) {
      return { attribute: "fontSize", value: rest[0], scope };
    }
    return { attribute: "color", value: rest.join(":"), scope };
  }
};

const colors = (css) => {
  const [scope, rule] = getScopeAndRule(css);
  const [attribute, ...rest] = rule.split("-");
  if (["bg"].includes(attribute) && rest) {
    return { attribute, value: rest.join(":"), scope };
  }
};

const parseStringOrNumberValue = (value) => {
  if (value.match(/^\d+[.]\d+$|^\d+$/)) {
    return +value;
  }
  return value;
};

const basics = (css) => {
  const [scope, rule] = getScopeAndRule(css);
  const match = rule.match(
    /(m|mt|mb|mx|my|mr|ml|p|py|px|pb|pt|pr|pl)-(\d+[.]\d+|\d+|auto)/
  );
  if (match && match.length > 2) {
    return {
      attribute: match[1],
      value: parseStringOrNumberValue(match[2]),
      scope,
    };
  }
};

const rules = [simple, outline, shadow, rounded, text, colors, basics];

const getContext = (panda) => {
  if (panda.flex && panda.flex?.value === 1) {
    if (
      panda.flexDirection === "column" ||
      panda.flexDirection === "column-reverse"
    ) {
      return {
        context: "vstack",
        explanation:
          "Used the vstack pattern for a flex box in the vertical direction",
      };
    }
    delete panda.flex;
    return {
      context: "hstack",
      explanation:
        "Used the hstack pattern for a flex box in the horizontal direction",
    };
  }
  if (panda.display === "grid") {
    delete panda.display;
    return {
      context: "grid",
      explanation: "Used the grid pattern for a grid",
    };
  }
  if (panda.colSpan) {
    return {
      context: "gridItem",
      explanation: "Used the gridItem pattern for an item within a grid",
    };
  }
  return { context: "css", explanation: null };
};

const formatString = (value) =>
  typeof value === "string" ? `"${value}"` : value;

const parse = (css) => {
  const panda = {};
  const explanation = [];
  css.split(" ").map((className) => {
    for (const rule of rules) {
      const parsed = rule(className);
      if (parsed) {
        const parsedValues = Array.isArray(parsed) ? parsed : [parsed];
        for (const parsed of parsedValues) {
          if (parsed.scope) {
            if (!panda[parsed.scope]) {
              panda[parsed.scope] = {};
            }
            panda[parsed.scope][parsed.attribute] = parsed.value;
            explanation.push({
              className,
              explanation: `{ ${parsed.scope}: { ${
                parsed.attribute
              }: ${formatString(parsed.value)} } }`,
            });
          } else {
            panda[parsed.attribute] = parsed.value;
            explanation.push({
              className,
              explanation: `{ ${parsed.attribute}: ${formatString(
                parsed.value
              )} }`,
            });
          }
        }
      }
    }
  });
  return { panda, explanation };
};

module.exports = {
  simple,
  shadow,
  outline,
  basics,
  colors,
  text,
  rounded,
  parse,
  rules,
  getContext,
};
