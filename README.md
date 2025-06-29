# What is UX.js

UX.js is a minimal js framework for building minimal web apps.

# Installation

```bash
npm i ux.js
```

# Example

```javascript
import { Data, createElement, displayElement, Button, css, srcCss } from 'ux.js'

// create a css class
const appCss = css('.app { display: flex; flex-direction: column; align-items: center; }')

// or just source an file
srcCss('style.css')

// An hello world Data obj
let helloWorld = new Data('Hello World')

// the title h1 element
const title = createElement(
    'h1',
    {
        className: 'title',
    },
    helloWorld.get(),
)

// use Data listen api to update the title when the Data changes
helloWorld.listen((v) => {
    console.log('Data changed:', v)
    title.textContent = v
})

// create a Button
displayElement(
    title,
    Button(
        'Click me',
        () => {
            helloWorld.set(helloWorld.get() + '!')
        },
        {},
    ),
)
```

this will create a simple web app that displays "Hello World" and a button that adds an exclamation mark to the text when clicked.

# About TypeScript

I don't recommend using typescript with ux.js, because if you use it with ux.js,
it will become emmm..... Anyscript (bruh)
just don't try it, beacause we didn't use vdom, so when you try to use typescript, it will be weird.......

such as.....

```typescript
import { Data, createElement, displayElement, Button, css } from 'ux.js'

const helloWorld = new Data('Hello World')

const title = createElement(
    'h1',
    {
        className: 'title',
    },
    helloWorld.get(),
)

helloWorld.listen((v) => {
    console.log('Data changed:', v)
    title.textContent = v
})

displayElement(
    title,
    Button(
        'Click me',
        () => {
            helloWorld.set(helloWorld.get() + '!')
        },
        {},
    ),
)
```

and you will found that everything returns `any` ......
