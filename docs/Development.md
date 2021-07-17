<!-- Developer guide #development -->

# Developer guide

_For basics see [How to contribute](https://github.com/styleguidist/react-styleguidist/blob/master/.github/Contributing.md)._

Styleguidist isn’t an ordinary single-page app and some design decisions may look confusing to an outsider. In this guide, we’ll explain these decisions to un-confuse potential contributors.

The main thing is that we’re running two apps at the same time: user’s components and Styleguidist UI. They share a webpack configuration and have styles in the same scope (there’s only one scope in CSS). And we can control only one of these two apps: Styleguidist UI. That puts us under some restrictions:

- Our styles should not affect user component styles.
- User styles (especially global like Bootstrap) should not affect Styleguidist UI.
- `body` styles (like `font-family`) should affect user components as the user expects but not Styleguidist UI.

## How it works

Styleguidist uses [react-docgen](https://github.com/reactjs/react-docgen) to parse _source_ files (not transpiled). react-docgen finds exported React components and generates documentation based on PropTypes or Flow annotations.

Styleguidist uses Markdown for documentation: each JavaScript code block is rendered as an interactive playground with [react-simple-code-editor](https://github.com/satya164/react-simple-code-editor). To do that we extract all these code blocks using [Remark](http://remark.js.org/).

Webpack loaders (see below) generate JavaScript modules with all user components, their documentation and examples and pass that to a React app which renders a style guide.

## Webpack loaders and webpack configuration

We use webpack loaders to hot reload the style guide on changes in user components, styles and Markdown documentation. We have four loaders ([`loaders`](https://github.com/styleguidist/react-styleguidist/tree/master/src/loaders) folder):

- `styleguide-loader`: loads components and sections;
- `props-loader`: loads props documentation using react-docgen;
- `mdx-loader`: loads examples from Markdown and Mdx files;
- `stories-loader`: loads examples from CSF files and provide them to mdx-loader;

Styleguidist tries to load and reuse the user’s webpack config (`webpack.config.js` in project root folder). It works most of the time but has some restrictions: Styleguidist [ignores](https://github.com/styleguidist/react-styleguidist/blob/master/src/scripts/utils/mergeWebpackConfig.js) some fields and plugins because they are already included (like `webpack.HotModuleReplacementPlugin`), don’t make sense for a style guide (like `output`) or may break Styleguidist (like `entry`).

We’re trying to keep Styleguidist’s [webpack config](https://github.com/styleguidist/react-styleguidist/blob/master/src/scripts/make-webpack-config.js) minimal to reduce clashes with the user’s configuration.

## React components

Most of StyleGuidist UI components consist of two parts: `Foo/Foo.js` that contains all logic and `Foo/FooRenderer.js` that contains all markup and styles. This allows users to customize rendering by overriding `*Renderer` component using webpack aliases (or [styleguideComponents](Configuration.md#styleguidecomponents) config option):

```js
// styleguide.config.js
const path = require('path')
module.exports = {
  webpackConfig: {
    resolve: {
      alias: {
        'rsg-components/Wrapper': path.join(
          __dirname,
          'lib/styleguide/Wrapper'
        )
      }
    }
  }
}
```

All Styleguidist components should be imported like this: `import Foo from 'rsg-components/Foo'` to make aliases work.

Each component folder usually has several files:

- `Foo/Foo.js` (optional for basic components);
- `Foo/FooRenderer.js`;
- `Foo/Foo.spec.js` — tests;
- `Foo/index.js` — reexport of `Foo.js` or `FooRenderer.js`.

## Styles

For styles we use [JSS](http://cssinjs.org/), it allows users to customize their style guide and allows us to ensure style isolation (thanks to [jss-isolate](http://cssinjs.org/jss-isolate/)). No user styles should affect Styleguidist UI and no Styleguidist styles should affect user components.

Use [clsx](https://github.com/lukeed/clsx) to merge several class names or for conditional class names, import it as `cx` (`import cx from 'clsx'`).

We use `Styled` higher-order component to allow theming (see [theme](Configuration.md#theme) and [style](Configuration.md#style) style guide config options). Use it like this:

```jsx
import React from 'react'
import Styled from 'rsg-components/Styled'

export const styles = ({ fontFamily, fontSize, color }) => ({
  button: {
    fontSize: fontSize.base,
    fontFamily: fontFamily.base,
    color: color.light,
    '&:hover, &:active': {
      isolate: false,
      color: color.lightest
    }
  }
})

function ExamplePlaceholderRenderer({ classes }) {
  return (
    <button className={classes.button}>I am a styled button</button>
  )
}

export default Styled(styles)(ExamplePlaceholderRenderer)
```

Check available theme variables in [src/client/styles/theme.js](https://github.com/styleguidist/react-styleguidist/blob/master/src/client/styles/theme.js).

Because of isolation and theming you need to explicitly declare `fontFamily`, `fontSize` and `color`. Add `isolate: false` to your hover styles, otherwise you’ll have to repeat base non-hover styles.

## Testing

We’re using [Jest with Enzyme](http://blog.sapegin.me/all/react-jest) for testing. Put your component tests into `Component.spec.js` file in the same folder and all other tests into `__tests__/filename.spec.js`.

To test particular class names use `classes` function (available in the global namespace in tests):

```js
import { TabButtonRenderer, styles } from './TabButtonRenderer'

const props = {
  classes: classes(styles)
}

it('should render active styles', () => {
  const actual = shallow(
    <TabButtonRenderer {...props} active>
      pizza
    </TabButtonRenderer>
  )
  expect(actual).toMatchSnapshot()
})
```
