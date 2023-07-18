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
  "flex-row": { attribute: "flexDir", value: "row" },
  "flex-row-reverse": { attribute: "flexDir", value: "row-reverse" },
  "flex-col": { attribute: "flexDir", value: "column" },
  "flex-col-reverse": { attribute: "flexDir", value: "column-reverse" },
  "flex-wrap": { attribute: "flexWrap", value: "wrap" },
  "flex-wrap-reverse": { attribute: "flexWrap", value: "wrap-reverse" },
  "flex-nowrap": { attribute: "flexWrap", value: "nowrap" },
  "flex-grow": { attribute: "flexGrow", value: 1 },
  "flex-grow-0": { attribute: "flexGrow", value: 0 },
  "flex-shrink": { attribute: "flexShrink", value: 1 },
  "flex-shrink-0": { attribute: "flexShrink", value: 0 },

  grid: { attribute: "display", value: "grid", keyFirst: true },
  "grid-cols-1": { attribute: "columns", value: 1, keyFirst: true },
  "grid-cols-2": { attribute: "columns", value: 2, keyFirst: true },
  "grid-cols-3": { attribute: "columns", value: 3, keyFirst: true },
  "grid-cols-4": { attribute: "columns", value: 4, keyFirst: true },
  "grid-cols-5": { attribute: "columns", value: 5, keyFirst: true },
  "grid-cols-6": { attribute: "columns", value: 6, keyFirst: true },
  "grid-cols-7": { attribute: "columns", value: 7, keyFirst: true },
  "grid-cols-8": { attribute: "columns", value: 8, keyFirst: true },
  "grid-cols-9": { attribute: "columns", value: 9, keyFirst: true },
  "grid-cols-10": { attribute: "columns", value: 10, keyFirst: true },
  "grid-cols-11": { attribute: "columns", value: 11, keyFirst: true },
  "grid-cols-12": { attribute: "columns", value: 12, keyFirst: true },

  "col-span-1": { attribute: "colSpan", value: 1, keyFirst: true },
  "col-span-2": { attribute: "colSpan", value: 2, keyFirst: true },
  "col-span-3": { attribute: "colSpan", value: 3, keyFirst: true },
  "col-span-4": { attribute: "colSpan", value: 4, keyFirst: true },
  "col-span-5": { attribute: "colSpan", value: 5, keyFirst: true },
  "col-span-6": { attribute: "colSpan", value: 6, keyFirst: true },
  "col-span-7": { attribute: "colSpan", value: 7, keyFirst: true },
  "col-span-8": { attribute: "colSpan", value: 8, keyFirst: true },
  "col-span-9": { attribute: "colSpan", value: 9, keyFirst: true },
  "col-span-10": { attribute: "colSpan", value: 10, keyFirst: true },
  "col-span-11": { attribute: "colSpan", value: 11, keyFirst: true },
  "col-span-12": { attribute: "colSpan", value: 12, keyFirst: true },

  "text-center": { attribute: "textAlign", value: "center" },
  "text-left": { attribute: "textAlign", value: "left" },
  "text-right": { attribute: "textAlign", value: "right" },
  "text-justify": { attribute: "textAlign", value: "justify" },

  "justify-center": { attribute: "justifyContent", value: "center" },
  "justify-start": { attribute: "justifyContent", value: "flex-start" },
  "justify-end": { attribute: "justifyContent", value: "flex-end" },
  "justify-between": { attribute: "justifyContent", value: "space-between" },
  "justify-around": { attribute: "justifyContent", value: "space-around" },
  "justify-evenly": { attribute: "justifyContent", value: "space-evenly" },

  "items-center": { attribute: "alignItems", value: "center" },
  "items-start": { attribute: "alignItems", value: "flex-start" },
  "items-end": { attribute: "alignItems", value: "flex-end" },
  "items-baseline": { attribute: "alignItems", value: "baseline" },
  "items-stretch": { attribute: "alignItems", value: "stretch" },

  "object-contain": { attribute: "objectFit", value: "contain" },
  "object-center": { attribute: "objectPosition", value: "center" },

  "overflow-hidden": { attribute: "overflow", value: "hidden" },
  "overflow-visible": { attribute: "overflow", value: "visible" },
  "overflow-scroll": { attribute: "overflow", value: "scroll" },
  "overflow-auto": { attribute: "overflow", value: "auto" },

  absolute: { attribute: "position", value: "absolute" },
  relative: { attribute: "position", value: "relative" },

  "pointer-events-none": { attribute: "pointerEvents", value: "none" },
  "pointer-events-auto": { attribute: "pointerEvents", value: "auto" },
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
      return { attribute: "outlineColor", value: rest.join("."), scope };
    }
  }
};

const roundedMap = {
  "rounded-t": "roundedTop",
  "rounded-t-": "roundedTop",
  "rounded-l": "roundedLeft",
  "rounded-l-": "roundedLeft",
  "rounded-b": "roundedBottom",
  "rounded-b-": "roundedBottom",
  "rounded-r": "roundedRight",
  "rounded-r-": "roundedRight",
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
    return { attribute: "color", value: rest.join("."), scope };
  }
};

const colors = (css) => {
  const [scope, rule] = getScopeAndRule(css);
  const [attribute, ...rest] = rule.split("-");
  if (["bg"].includes(attribute) && rest) {
    return { attribute, value: rest.join("."), scope };
  }
};

const parseStringOrNumberValue = (value) => {
  if (value.match(/^\d+[.]\d+$|^\d+$/)) {
    return +value;
  }
  return value;
};

const shorthandMap = {
  "aspect-h": "aspectRatioH",
  "aspect-w": "aspectRatioW",
  aspect: "aspectRatio",
  "min-w": "minWidth",
  "min-h": "minHeight",
  "max-w": "maxWidth",
  "max-h": "maxHeight",
};

const basics = (css) => {
  const [scope, rule] = getScopeAndRule(css);
  const match = rule.match(
    /(aspect-h|aspect-w|aspect|max-w|min-w|min-w|min-h|h|w|m|mt|mb|mx|my|mr|ml|p|py|px|pb|pt|pr|pl)-(none|auto|full|sm|md|lg|\dxl|\d+[.]\d+|\d+|)/
  );
  if (match && match.length > 2) {
    return {
      attribute: shorthandMap[match[1]] ?? match[1],
      value: parseStringOrNumberValue(match[2]),
      scope,
    };
  }
};

const rules = [simple, outline, shadow, rounded, text, colors, basics];

const getContext = (panda) => {
  const contexts = [];
  if (panda.flex && panda.flex === 1) {
    delete panda.flex;
    if (panda.flexDir === "column" || panda.flexDir === "column-reverse") {
      contexts.push({
        context: "vstack",
        explanation:
          "Used the vstack pattern for a flex box in the vertical direction",
        keys: ["justifyContent", "flexDir", "alignItems"],
      });
    } else {
      contexts.push({
        context: "hstack",
        explanation:
          "Used the hstack pattern for a flex box in the horizontal direction",
        keys: ["justifyContent", "flexDir", "alignItems"],
      });
    }
  }
  if (panda.display) {
    delete panda.display;
    contexts.push({
      context: "grid",
      explanation: "Used the grid pattern for a grid",
      keys: ["gridCols", "colSpan"],
    });
  }
  if (panda.colSpan) {
    contexts.push({
      context: "gridItem",
      explanation: "Used the gridItem pattern for an item within a grid",
      keys: ["gridCols", "colSpan"],
    });
  }
  if (contexts.length === 0) {
    contexts.push({ context: "css", explanation: null, keys: [] });
  }
  return contexts;
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
            if (parsed.keyFirst) {
              if (!panda[parsed.attribute]) {
                panda[parsed.attribute] = {};
              }
              panda[parsed.attribute][parsed.scope] = parsed.value;
              explanation.push({
                className,
                explanation: `{ ${parsed.attribute}: { ${
                  parsed.scope
                }: ${formatString(parsed.value)} } }`,
              });
            } else {
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
            }
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
        break;
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
