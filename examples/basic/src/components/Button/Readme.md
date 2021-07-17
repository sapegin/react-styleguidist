import Button from './Button'; import Story from 'rsg-components/mdx/public/Story'

Basic button:

```jsx
<Button>Push Me</Button>
```

Big pink button:

```jsx
<Button size="large" color="deeppink">
  Click Me
</Button>
```

And you _can_ **use** `any` [Markdown](http://daringfireball.net/projects/markdown/) here.

Fenced code blocks with `js`, `jsx` or `javascript` languages are rendered as a interactive playgrounds:

```jsx
<Button>Push Me</Button>
```

Add padding between examples in a block by passing a `padded` modifier (` ```jsx padded `):

```jsx padded
<Button>Push Me</Button>
<Button>Click Me</Button>
<Button>Tap Me</Button>
```

You can add a custom class name to an example preview wrapper (` ```js preview-class=checks `):

```js preview-class=checks
<Button>I’m transparent!</Button>
```

Or disable an editor by passing a `noeditor` modifier (` ```js noeditor `):

```jsx noeditor
<Button>Push Me</Button>
```

To render an example as highlighted source code add a `static` modifier: (` ```js static `):

```js static
import React from 'react'
```

Fenced blocks with other languages are rendered as highlighted code:

```html
<button size="large" color="deeppink">Click Me</button>
```

Current component (like `Button` in this example) is always accessible by its name in the example code. If you want to use other components, you need to explicitly import them:

```jsx
import Placeholder from '../Placeholder'
;<Button>
  <Placeholder />
</Button>
```

Or you can explicitly import everything, to make examples easier to copy into your app code:

```jsx
import React from 'react'
import Button from 'rsg-example/components/Button'
import Placeholder from 'rsg-example/components/Placeholder'
;<Button>
  <Placeholder />
</Button>
```

_Note: `rsg-example` module is an alias defined by the [moduleAliases](https://react-styleguidist.js.org/docs/configuration#modulealiases) config option._

Each example's state can be accessed by React hook `useState`:

```jsx
const [isOpen, setisOpen] = React.useState(false)
;<div>
  <Button
    size="small"
    onClick={() => setisOpen(true)}
    disabled={isOpen}
  >
    Show Me
  </Button>
  {isOpen && (
    <Button size="small" onClick={() => setisOpen(false)}>
      Hide Me
    </Button>
  )}
</div>
```

You can change the default state:

```jsx
const [count, setCount] = React.useState(42)
;<Button onClick={() => setCount(count + 1)}>{count}</Button>
```

You could import examples from CSF story files:

<Story id="this-part-we-actually-ignore--pink" />
