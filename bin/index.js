#!/usr/bin/env node
const { program } = require("commander");
const readline = require("node:readline");
const { prettyPrint } = require("@base2/pretty-print-object");
const { parse, getContext } = require("../src/rules");

program.option("--explain");

program.parse();

const rl = readline.createInterface({
  input: process.stdin,
});

rl.on("line", (line) => {
  if (line.match(/(className|class)=/)) {
    const className = line.match(/(className|class)=["']([^"']+)["']/)[2];
    const { panda, explanation } = parse(className);
    const { context, explanation: contextExplanation } = getContext(panda);
    line = line.replace(
      new RegExp(`('${className}'|"${className}")`),
      `{${context}(${prettyPrint(panda)
        .replace(/\s+/g, " ")
        .replaceAll("\n", " ")})}`
    );
    if (program.getOptionValue("explain")) {
      console.log("/*");
      if (contextExplanation) {
        console.log(contextExplanation);
        console.log("");
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
});
