# Tailwind to Panda CSS converter (for command line)

This command line utility is designed to be used in the context of an editor where you use an extension like [Edit With Shell](https://marketplace.visualstudio.com/items?itemName=ryu1kn.edit-with-shell) to convert Tailwind CSS to [Panda CSS](https://panda-css.com/docs/concepts/recipes).

# Installation

```sh
npm install -g tw2panda-cli
```

# Usage

To accept React or HTML code using Tailwind as STDIN and create Panda-CSS code as STDOUT:

```sh
tw2panda
```

To explain the conversion in a comment add `--explain`:

```sh
tw2panda --explain
```

To convert a line of Tailwind CSS into a [cva](https://panda-css.com/docs/concepts/recipes):

```sh
tw2panda --cva
```

## Alternatives

There is a [tw2panda](https://tw2panda-astahmer.vercel.app/) web app where you can paste React code into the page and get the equivalent Panda code. It's another great way to learn how to write Panda code.

The code in this utility is **NOT** based on this `tw2panda`. The web app supports more features, but this utility has the `explain` feature as well as the `cva` feature to create recipes.
