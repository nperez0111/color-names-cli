#!/usr/bin/env node
"use strict";
const meow = require("meow");
const importJsx = require("import-jsx");
const React = require('react');
const { render } = require("ink");
const clipboardy = require("clipboardy");
const color = require(".");

const ui = importJsx("./ui");

const cli = meow(
  `
    Usage
    $ color [text]

    Example
    $ color '#2C88D8'
     $curious-blue

	Options
      --copy -c       Copy the color to the keyboard
      --help -h       This help text

	Run it without arguments to enter the live repl
`,
  {
    flags: {
        copy: {
            type: 'boolean',
            alias: 'c'
        },
        help: {
            type: 'boolean',
            alias: 'h'
        }
    }
  }
);

const main = () => {
  const onSelectColor = color => {
    clipboardy.writeSync(color);
    console.log(`Color ${color} copied to clipboard`);
    process.exit();
  };

  const onError = () => {
    process.exit(1);
  };

  const onExit = () => {
    process.exit();
  };

  // Uses `h` instead of JSX to avoid transpiling this file
  render(React.createElement(ui, { onSelectColor, onError, onExit }));
};

if (cli.input.length > 0) {
  const [, colorVariable] = color.name(cli.input[0]);

  console.log(colorVariable);

  if (cli.flags.copy) {
    clipboardy.writeSync(colorVariable);
  }
}else if (cli.flags.help) {
    cli.showHelp()
} else {
  main();
}
