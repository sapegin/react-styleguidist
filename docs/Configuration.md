# Configuration

By default, Styleguidist will look for `styleguide.config.js` file in your project’s root folder. You can change the location of the config file using `--config` [CLI](CLI.md) option.

## `assetsDir`

Type: `String` or `Array`, optional

Your application static assets folder will be accessible as `/` in the style guide dev server.

## `compilerConfig`

Type: `Object`, default:

```javascript
{
  // Don't include an Object.assign ponyfill, we have our own
  objectAssign: 'Object.assign',
  // Transpile only features needed for IE11
  target: { ie: 11 },
  transforms: {
    // Don't throw on ESM imports, we transpile them ourselves
    modules: false,
    // Enable tagged template literals for styled-components
    dangerousTaggedTemplateString: true,
    // to make async/await work by default (no transformation)
    asyncAwait: false,
  },
}
```

Styleguidist uses [Bublé](https://buble.surge.sh/guide/) to run ES6 code on the frontend. This config object will be added as the second argument for `buble.transform`.

## `components`

Type: `String`, `Function` or `Array`, default: `src/components/**/*.{js,jsx,ts,tsx}`

- when `String`: a [glob pattern](https://github.com/isaacs/node-glob#glob-primer) that matches all your component modules.
- when `Function`: a function that returns an array of module paths.
- when `Array`: an array of module paths.

All paths are relative to config folder.

See examples in the [Components section](Components.md).

## `context`

Type: `Object`, optional

Modules that will be available for examples. You can use it for utility functions like Lodash or for data fixtures.

```javascript
module.exports = {
  context: {
    map: 'lodash/map',
    users: path.resolve(__dirname, 'fixtures/users')
  }
}
```

Then you can use them in any example:

```jsx
<Message>{map(users, 'name').join(', ')}</Message>
```

## `contextDependencies`

Type: `String[]`, optional

Array of absolute paths that allow you to specify absolute paths of directories to watch for additions or removals of components.

By default Styleguidist uses common parent directory of your components.

```javascript
module.exports = {
  contextDependencies: [path.resolve(__dirname, 'lib/components')]
}
```

## `highlightCodeLanguages`

Type: `String[]`, default: `[]`

Array of languages that allow you to decide which syntax highlighter to add.

By default the following languages are supported.

> atom, bash, clike, css, diff, flow, graphql, html, javascript, js, json, jsx, less, markdown, markup, mathml, md, rss, scss, shell, ssml, svg, ts, tsx, typescript, webmanifest, xml

```javascript
module.exports = {
  highlightCodeLanguages: ['java', 'ruby']
}
```

## `configureServer`

Type: `Function`, optional

Function that allows you to add endpoints to the underlying Express server:

```javascript
module.exports = {
  configureServer(app) {
    // `app` is the instance of the express server running Styleguidist
    app.get('/custom-endpoint', (req, res) => {
      res.status(200).send({ response: 'Server invoked' })
    })
  }
}
```

Your components will be able to invoke the URL `http://localhost:6060/custom-endpoint` from their examples.

## `dangerouslyUpdateWebpackConfig`

Type: `Function`, optional

> **Danger:** You may break Styleguidist by using this option, try to use [webpackConfig](#webpackconfig) option instead.

Allows you to modify webpack config without any restrictions.

```javascript
module.exports = {
  dangerouslyUpdateWebpackConfig(webpackConfig, env) {
    // WARNING: inspect Styleguidist Webpack config before modifying it, otherwise you may break Styleguidist
    console.log(webpackConfig)
    webpackConfig.externals = {
      jquery: 'jQuery'
    }
    return webpackConfig
  }
}
```

## `defaultExample`

Type: `Boolean` or `String`, default: `false`

For components that do not have an example, a default one can be used. When set to `true`, the [DefaultExample.md](https://raw.githubusercontent.com/styleguidist/react-styleguidist/master/templates/DefaultExample.md) is used, or you can provide the path to your own example Markdown file.

When writing your own default example file, `__COMPONENT__` will be replaced by the actual component name at compile time.

## `exampleMode`

Type: `String`, default: `collapse`

Defines the initial state of the example code tab:

- `collapse`: collapses the tab by default.
- `hide`: hide the tab and it can´t be toggled in the UI.
- `expand`: expand the tab by default.

## `getComponentPathLine`

Type: `Function`, default: component filename

Function that returns a component path line (displayed under the component name).

For example, instead of `components/Button/Button.js` you can print `import Button from 'components/Button';`:

```javascript
const path = require('path')
module.exports = {
  getComponentPathLine(componentPath) {
    const name = path.basename(componentPath, '.js')
    const dir = path.dirname(componentPath)
    return `import ${name} from '${dir}';`
  }
}
```

## `getExampleFilename`

Type: `Function`, default: finds `Readme.md` or `ComponentName.md` in the component folder

Function that returns examples file path for a given component path.

For example, instead of `Readme.md` you can use `ComponentName.examples.md`:

```javascript
module.exports = {
  getExampleFilename(componentPath) {
    return componentPath.replace(/\.jsx?$/, '.examples.md')
  }
}
```

## `handlers`

Type: `Function`, optional, default: [[react-docgen-displayname-handler](https://github.com/nerdlabs/react-docgen-displayname-handler)]

Function that returns functions used to process the discovered components and generate documentation objects. Default behaviors include discovering component documentation blocks, prop types, and defaults. If setting this property, it is best to build from the default [react-docgen](https://github.com/reactjs/react-docgen) handler list, such as in the example below. See the [react-docgen handler documentation](https://github.com/reactjs/react-docgen#handlers) for more information about handlers.

> **Note:** `react-docgen-displayname-handler` should be included.

```javascript
module.exports = {
  handlers: componentPath =>
    require('react-docgen').defaultHandlers.concat(
      (documentation, path) => {
        // Calculate a display name for components based upon the declared class name.
        if (
          path.value.type === 'ClassDeclaration' &&
          path.value.id.type === 'Identifier'
        ) {
          documentation.set('displayName', path.value.id.name)

          // Calculate the key required to find the component in the module exports
          if (
            path.parentPath.value.type === 'ExportNamedDeclaration'
          ) {
            documentation.set('path', path.value.id.name)
          }
        }

        // The component is the default export
        if (
          path.parentPath.value.type === 'ExportDefaultDeclaration'
        ) {
          documentation.set('path', 'default')
        }
      },

      require('react-docgen-displayname-handler').createDisplayNameHandler(
        componentPath
      )
    )
}
```

## `ignore`

Type: `String[]`, default: `['**/__tests__/**', '**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}', '**/*.d.ts']`

Array of [glob pattern](https://github.com/isaacs/node-glob#glob-primer) that should not be included in the style guide.

> **Caution:** You should pass glob patterns, for example, use `**/components/Button.js` instead of `components/Button.js`.

## `logger`

Type: `Object`, by default will use `console.*` in CLI or nothing in Node.js API

Custom logger functions:

```javascript
module.exports = {
  logger: {
    // One of: info, debug, warn
    // Suppress messages
    info: () => {},
    // Override display function
    warn: message => console.warn(`NOOOOOO: ${message}`)
  }
}
```

## `minimize`

Type: `Boolean`, default: `true`

If `false`, the production build will not be minimized.

## `moduleAliases`

Type: `object`, optional

Define aliases for modules, that you can import in your examples, to make example code more realistic and copypastable:

```javascript
const path = require('path')
module.exports = {
  moduleAliases: {
    'rsg-example': path.resolve(__dirname, 'src')
  }
}
```

````jsx
// ```jsx inside Markdown
import React from 'react'
import Button from 'rsg-example/components/Button'
import Placeholder from 'rsg-example/components/Placeholder'
````

Check out the [webpack resolve.alias documentation](https://webpack.js.org/configuration/resolve/#resolve-alias) for available syntax.

## `mountPointId`

Type: `string`, default: `rsg-root`

The ID of a DOM element where Styleguidist mounts.

## `pagePerSection`

Type: `Boolean`, default: `false`

Render one section or component per page.

If `true`, each section will be a single page.

The value may depend on a current environment:

```javascript
module.exports = {
  pagePerSection: process.env.NODE_ENV !== 'production'
}
```

To isolate section’s children as single pages (subroutes), add `sectionDepth` into each section with the number of subroutes (depth) to render as single pages.

For example:

```javascript
module.exports = {
  pagePerSection: true,
  sections: [
    {
      name: 'Documentation',
      sections: [
        {
          name: 'Files',
          sections: [
            {
              name: 'First File'
            },
            {
              name: 'Second File'
            }
          ]
        }
      ],
      // Will show "Documentation" and "Files" as single pages, filtering its children
      sectionDepth: 2
    },
    {
      name: 'Components',
      sections: [
        {
          name: 'Buttons',
          sections: [
            {
              name: 'WrapperButton'
            }
          ]
        }
      ],
      // Will show "Components" as single page, filtering its children
      sectionDepth: 1
    },
    {
      name: 'Examples',
      sections: [
        {
          name: 'Case 1',
          sections: [
            {
              name: 'Buttons'
            }
          ]
        }
      ],
      // There is no subroutes, "Examples" will show all its children on a page
      sectionDepth: 0
    }
  ]
}
```

## `printBuildInstructions`

Type: `Function`, optional

Function that allows you to override the printing of build messages to console.log.

```javascript
module.exports = {
  printBuildInstructions(config) {
    console.log(
      `Style guide published to ${config.styleguideDir}. Something else interesting.`
    )
  }
}
```

## `printServerInstructions`

Type: `Function`, optional

Function that allows you to override the printing of local dev server messages to console.log.

```javascript
module.exports = {
  serverHost: 'your-domain',
  printServerInstructions(config, { isHttps }) {
    console.log(`Local style guide: http://${config.serverHost}`)
  }
}
```

## `previewDelay`

Type: `Number`, default: 500

Debounce time in milliseconds used before rendering the changes from the editor. While typing code the preview will not be updated.

## `propsParser`

Type: `Function`, optional

Function that allows you to override the mechanism used to parse props from a source file. The default mechanism is using [react-docgen](https://github.com/reactjs/react-docgen) to parse props.

```javascript
module.exports = {
  propsParser(filePath, source, resolver, handlers) {
    return require('react-docgen').parse(source, resolver, handlers)
  }
}
```

## `require`

Type: `String[]`, optional

Modules that are required for your style guide. Useful for third-party styles or polyfills.

```javascript
module.exports = {
  require: [
    'babel-polyfill',
    path.join(__dirname, 'styleguide/styles.css')
  ]
}
```

> **Note:** This will add a separate webpack entry for each array item.

Don’t forget to add webpack loaders for each file you add here. For example, to require a CSS file you’ll need:

```javascript
module.exports = {
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    }
  }
}
```

See [Configuring webpack](Webpack.md) for mode details.

## `resolver`

Type: `Function`, optional

Function that allows you to override the mechanism used to identify classes/components to analyze. Default behavior is to find all exported components in each file. You can configure it to find all components or use a custom detection method. See the [react-docgen resolver documentation](https://github.com/reactjs/react-docgen#resolver) for more information about resolvers.

```javascript
module.exports = {
  resolver: require('react-docgen').resolver
    .findAllComponentDefinitions
}
```

## `ribbon`

Type: `Object`, optional

Show “Fork Me” ribbon in the top right corner.

```javascript
module.exports = {
  ribbon: {
    // Link to open on the ribbon click (required)
    url: 'http://example.com/',
    // Text to show on the ribbon (optional)
    text: 'Fork me on GitHub'
  }
}
```

Use the [theme](#theme) config option to change ribbon style.

## `sections`

Type: `Array`, optional

Allows components to be grouped into sections with a title and overview content. Sections can also be content only, with no associated components (for example, a textual introduction). Sections can be nested.

See examples of [sections configuration](Components.md#sections).

## `serverHost`

Type: `String`, default: `0.0.0.0`

Dev server hostname.

## `serverPort`

Type: `Number`, default: `process.env.NODE_PORT` or `6060`

Dev server port. Can also be set via command line `--port=6060`.

## `showSidebar`

Type: `Boolean`, default: `true`

Toggle sidebar visibility. The sidebar will be hidden when opening components or examples in isolation mode even if this value is set to `true`. When set to `false`, the sidebar will always be hidden.

## `skipComponentsWithoutExample`

Type: `Boolean`, default: `false`

Ignore components that don’t have an example file (as determined by [getExampleFilename](#getexamplefilename)). These components won’t be accessible from other examples unless you [manually `require` them](Cookbook.md#how-to-hide-some-components-in-style-guide-but-make-them-available-in-examples).

## `sortProps`

Type: `Function`, optional

Function that sorts component props. By default props are sorted such that required props come first, optional props come second. Props in both groups are sorted by their property names.

To disable sorting, use the identity function:

```javascript
module.exports = {
  sortProps: props => props
}
```

## `styleguideComponents`

Type: `Object`, optional

Override React components used to render the style guide:

```javascript
module.exports = {
  styleguideComponents: {
    Wrapper: path.join(__dirname, 'styleguide/components/Wrapper'),
    StyleGuideRenderer: path.join(
      __dirname,
      'styleguide/components/StyleGuide'
    )
  }
}
```

See an example of [customized style guide](https://github.com/styleguidist/react-styleguidist/tree/master/examples/customised).

To wrap, rather than replace a component, make sure to import the default implementation using the full path to `react-styleguidist`. See an example of [wrapping a Styleguidist component](https://github.com/styleguidist/react-styleguidist/blob/master/examples/customised/styleguide/components/SectionsRenderer.js).

**Note**: these components are not guaranteed to be safe from breaking changes in React Styleguidist updates.

## `styleguideDir`

Type: `String`, default: `styleguide`

Folder for static HTML style guide generated with `styleguidist build` command.

## `styles`

Type: `Object`, `String` or `Function`, optional

Customize styles of any Styleguidist’s component using an object, a function returning said object or a file path to a file exporting said styles.

See examples in the [cookbook](Cookbook.md#how-to-change-styles-of-a-style-guide).

> **Tip:** Using a function allows access to theme variables like in the example below. See available [theme variables](https://github.com/styleguidist/react-styleguidist/blob/master/src/client/styles/theme.ts). The returned object folows the same format as when configured as a litteral.

```javascript
module.exports = {
  styles: function (theme) {
    return {
      Logo: {
        logo: {
          // we can now change the color used in the logo item to use the theme's `link` color
          color: theme.color.link
        }
      }
    }
  }
}
```

**Note:** If using a file path, it has to be absolute or relative to the config file.

## `template`

Type: `Object` or `Function`, optional.

Change HTML for the style guide app.

An object with options to add a favicon, meta tags, inline JavaScript or CSS, etc. See [@vxna/mini-html-webpack-template docs](https://www.npmjs.com/package/@vxna/mini-html-webpack-template).

```javascript
module.exports = {
  template: {
    favicon: 'https://assets-cdn.github.com/favicon.ico'
  }
}
```

A function that returns an HTML string, see [mini-html-webpack-plugin docs](https://github.com/styleguidist/mini-html-webpack-plugin#custom-templates).

## `theme`

Type: `Object` or `String`, optional

Customize style guide UI fonts, colors, etc. using a theme object or the path to a file exporting such object.

The path is relative to the config file or absolute.

See examples in the [cookbook](Cookbook.md#how-to-change-styles-of-a-style-guide).

> **Info:** See available [theme variables](https://github.com/styleguidist/react-styleguidist/blob/master/src/client/styles/theme.ts).

> **Info:** Styles use [JSS](https://github.com/cssinjs/jss/blob/master/docs/jss-syntax.md) with these plugins: [jss-plugin-isolate](https://github.com/cssinjs/jss/tree/master/packages/jss-plugin-isolate), [jss-plugin-nested](https://github.com/cssinjs/jss/tree/master/packages/jss-plugin-nested), [jss-plugin-camel-case](https://github.com/cssinjs/jss/tree/master/packages/jss-plugin-camel-case), [jss-plugin-default-unit](https://github.com/cssinjs/jss/tree/master/packages/jss-plugin-default-unit), [jss-plugin-compose](https://github.com/cssinjs/jss/tree/master/packages/jss-plugin-compose) and [jss-plugin-global](https://github.com/cssinjs/jss/tree/master/packages/jss-plugin-global).

> **Tip:** Use [React Developer Tools](https://github.com/facebook/react) to find component and style names. For example a component `<LogoRenderer><h1 className="rsg--logo-53">` corresponds to an example above.

## `title`

Type: `String`, default: `<app name from package.json> Style Guide`

Style guide title.

## `tocMode`

Type: `String` default: `expand`

Defines if the table of contents sections will behave like an accordion:

- `collapse`: All sections are collapsed by default
- `expand`: Sections cannot be collapsed in the Table Of Contents

Collapse the sections created in the sidebar to reduce the height of the sidebar. This can be useful in large codebases with lots of components to avoid having to scroll too far.

## `updateDocs`

Type: `Function`, optional

Function that modifies props, methods, and metadata after parsing a source file. For example, load a component version from a JSON file:

```javascript
module.exports = {
  updateDocs(docs, file) {
    if (docs.doclets.version) {
      const versionFilePath = path.resolve(
        path.dirname(file),
        docs.doclets.version
      )
      const version = require(versionFilePath).version

      docs.doclets.version = version
      docs.tags.version[0].description = version
    }

    return docs
  }
}
```

With this component JSDoc comment block:

```javascript
/**
 * Component is described here.
 *
 * @version ./package.json
 */
export default class Button extends React.Component {
  // ...
}
export default
```

## `updateExample`

Type: `Function`, optional

Function that modifies code example (Markdown fenced code block). For example, you can use it to load examples from files:

```javascript
module.exports = {
  updateExample(props, exampleFilePath) {
    const { settings, lang } = props
    if (typeof settings.file === 'string') {
      const filepath = path.resolve(
        path.dirname(exampleFilePath),
        settings.file
      )
      const { file, ...restSettings } = settings
      return {
        content: fs.readFileSync(filepath, 'utf8'),
        settings: restSettings,
        lang
      }
    }
    return props
  }
}
```

Use it like this in your Markdown files:

    ```js { "file": "./some/file.js" }
    ```

You can also use this function to dynamically update some of your fenced code blocks that you do not want to be interpreted as React components by using the [static modifier](Documenting.md#usage-examples-and-readme-files).

```javascript
module.exports = {
  updateExample(props) {
    const { settings, lang } = props
    if (lang === 'javascript' || lang === 'js' || lang === 'jsx') {
      settings.static = true
    }
    return props
  }
}
```

## `usageMode`

Type: `String`, default: `collapse`

Defines the initial state of the props and methods tab:

- `collapse`: collapses the tab by default.
- `hide`: hide the tab and it can´t be toggled in the UI.
- `expand`: expand the tab by default.

## `verbose`

Type: `Boolean`, default: `false`

Print debug information. Same as `--verbose` command line switch.

## `version`

Type: `String`, optional

Style guide version, displayed under the title in the sidebar.

## `webpackConfig`

Type: `Object` or `Function`, optional

Custom webpack config options: loaders, extensions, plugins, etc. required for your project.

Can be an object:

```javascript
module.exports = {
  webpackConfig: {
    module: {
      resolve: {
        extensions: ['.es6']
      },
      rules: [
        {
          test: /\.scss$/,
          loaders: [
            'style-loader',
            'css-loader',
            'sass-loader?precision=10'
          ]
        }
      ]
    }
  }
}
```

Or a function:

```javascript
module.exports = {
  webpackConfig(env) {
    if (env === 'development') {
      return {
        // custom options
      }
    }
    return {}
  }
}
```

> **Caution:** This option disables config load from `webpack.config.js`, load your config [manually](Webpack.md#reusing-your-projects-webpack-config).

> **Danger:** `entry`, `externals`, `output`, `watch`, and `stats` options will be ignored. For production builds, `devtool` will also be ignored.

> **Danger:** `CommonsChunkPlugins`, `HtmlWebpackPlugin`, `MiniHtmlWebpackPlugin`, `UglifyJsPlugin`, `TerserPlugin`, `HotModuleReplacementPlugin` plugins will be ignored because Styleguidist already includes them or they may break Styleguidist.

> **Tip:** Run style guide in verbose mode to see the actual webpack config used by Styleguidist: `npx styleguidist server --verbose`.

See [Configuring webpack](Webpack.md) for examples.
