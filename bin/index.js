#!/usr/bin/env node
const { program } = require("commander");
const readline = require("node:readline");
const { prettyPrint } = require("@base2/pretty-print-object");
const { parse, getContext } = require("../src/rules");

program.option("--explain");
program.option("--cva");

program.parse();

const explain = program.getOptionValue("explain");
const cva = program.getOptionValue("cva");

const rl = readline.createInterface({
  input: process.stdin,
});

rl.on("line", (line) => {
  if (cva) {
    const { panda } = parse(line);
    console.log(
      `cva(${prettyPrint(
        { base: panda, variants: {}, defaultVariants: {} },
        { singleQuotes: false, indent: "  " }
      )})`
    );
  } else if (line.match(/(className|class)=/)) {
    const className = line.match(/(className|class)=["']([^"']+)["']/)?.[2];
    if (className) {
      const { panda, explanation } = parse(className);

      const contexts = getContext(panda);

      // deal with multiple contexts (e.g. gridItem and hstack)
      if (contexts.length > 1) {
        const reservedKeys = contexts.map((c) => c.keys).flat();

        const rest = Object.keys(panda).filter(
          (k) => !reservedKeys.includes(k)
        );

        const contextStrings = [];
        for (const ci in contexts) {
          const c = contexts[ci];
          let pandaKeys = {};
          if (ci === 0) {
            pandaKeys = {
              ...rest,
            };
          }
          for (const k of c.keys) {
            if (panda[k]) {
              pandaKeys[k] = panda[k];
            }
          }
          contextStrings.push(
            `${c.context}(${prettyPrint(pandaKeys, {
              singleQuotes: false,
            })
              .replace(/\s+/g, " ")
              .replaceAll("\n", " ")})`
          );
        }
        const cx = contextStrings.join(", ");
        line = line.replace(
          new RegExp(`('${className}'|"${className}")`),
          `{cx(${cx})}`
        );
      } else {
        line = line.replace(
          new RegExp(`('${className}'|"${className}")`),
          `{${contexts[0].context}(${prettyPrint(panda, {
            singleQuotes: false,
          })
            .replace(/\s+/g, " ")
            .replaceAll("\n", " ")})}`
        );
      }

      if (explain) {
        console.log("/*");
        for (const { explanation: contextExplanation } of contexts) {
          if (contextExplanation && contextExplanation.length) {
            console.log(contextExplanation);
            console.log("");
          }
        }
        for (const e of explanation) {
          console.log(`${e.className} => ${e.explanation}`);
        }
        console.log(" */");
      }

      console.log(line);
    } else {
      console.log(line);
    }
  } else {
    console.log(line);
  }
});
