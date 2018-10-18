# Getting Started with React Styleguidist

## 1. Install Styleguidist

Install webpack if you don’t have it already and aren’t using Create React App:

```bash
npm install --save-dev webpack
```

Install Styleguidist:

```bash
npm install --save-dev react-styleguidist
```

## 2. Configure your style guide

**If you’re using [Create React App](https://github.com/facebook/create-react-app) you can skip this step.**

- [Point Styleguidist to your React components](Components.md)
- [Tell Styleguidist how to load your app’s code](Webpack.md)

## 3. Start your style guide

- Run **`npx styleguidist server`** to start a style guide dev server.
- Run **`npx styleguidist build`** to build a production HTML version.

**Note:** We recommend [adding these commands to your `package.json`](CLI.md).

## 4. Start documenting your components

See how to [document your components](Documenting.md).

## Have questions?

- [Read the cookbook](Cookbook.md)
- [Join our Gitter chat](https://gitter.im/styleguidist/styleguidist)
