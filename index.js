// --- UX.js - Base ---
export function createElement(type, props = {}, ...children) {
    const el = document.createElement(type)
    for (let key in props) {
        const value = props[key]
        if (value instanceof Data) {
            el.setAttribute(key, value.get())
            value.listen((v) => {
                el.setAttribute(key, v)
            })
        } else if (typeof value === 'function' && key.startsWith('on')) {
            el.addEventListener(key.slice(2).toLowerCase(), value)
        } else {
            el.setAttribute(key, value)
        }
    }

    children.forEach((child) => {
        el.append(child instanceof Node ? child : document.createTextNode(child))
    })

    return el
}

export function displayElement(...htmls) {
    htmls.forEach((html) => {
        document.body.append(html)
    })
}

export function css(code) {
    displayElement(createElement('style', {}, code))
}

export function srcCss(url) {
    displayElement(createElement('link', { rel: 'stylesheet', href: url }))
}

export class Data {
    constructor(v) {
        this.v = v
        this._listeners = []
    }

    listen(fn) {
        this._listeners.push(fn)
    }

    set(v) {
        this.v = v
        this._listeners.forEach((fn) => fn(v))
    }

    get() {
        return this.v
    }
}

// --- UX.js - UI Pack ---
export function Button(
    text,
    onClick,
    opts = {},
    style = 'padding: 0.5em 1em;  background: #333; color: white; border: none; border-radius: 4px; cursor: pointer;',
    ...children
) {
    let el = createElement(
        'button',
        {
            onclick: onClick,
            style: style,
        },
        text,
        ...children,
    )

    for (let key in opts) {
        el.setAttribute(key, opts[key])
    }

    return el
}

export function Input(
    type = 'text',
    value = '',
    onInput = () => {},
    opts = {},
    style = 'padding: 0.5em; border: 1px solid #ccc; border-radius: 4px; width: 100%;',
) {
    let el = createElement(
        'input',
        {
            type,
            value,
            oninput: (e) => onInput(e.target.value),
            style,
        },
        '',
    )

    for (let key in opts) {
        el.setAttribute(key, opts[key])
    }

    return el
}

export function Link(href, text, opts = {}, style = 'color: blue; text-decoration: none;') {
    let el = createElement(
        'a',
        {
            href,
            style,
            ...opts,
        },
        text,
    )

    return el
}

export function Image(src, alt = '', opts = {}, style = 'max-width: 100%; height: auto;') {
    let el = createElement('img', {
        src,
        alt,
        style,
        ...opts,
    })

    return el
}

export function Div(opts = {}, style = 'margin: 1em 0;') {
    let el = createElement('div', {
        style,
        ...opts,
    })

    return el
}

export function A(href, text, opts = {}, style = 'color: blue; text-decoration: none;') {
    let el = createElement(
        'a',
        {
            href,
            style,
            ...opts,
        },
        text,
    )

    return el
}

export function H(level = 1, text = '', opts = {}, style = 'margin: 0.5em 0;') {
    if (level < 1 || level > 6) {
        console.warn('Heading level must be between 1 and 6. Defaulting to level 1.')
        level = 1
    }
    let el = createElement(
        `h${level}`,
        {
            style,
            ...opts,
        },
        text,
    )

    return el
}

// --- setters ---
export function setTitle(title) {
    document.title = title
}

export function setMeta(name, content) {
    let meta = document.querySelector(`meta[name="${name}"]`)
    if (!meta) {
        meta = createElement('meta', { name, content })
        document.head.appendChild(meta)
    } else {
        meta.setAttribute('content', content)
    }
}

export function setFavicon(url) {
    let link = document.querySelector('link[rel="icon"]')
    if (!link) {
        link = createElement('link', { rel: 'icon', href: url })
        document.head.appendChild(link)
    } else {
        link.setAttribute('href', url)
    }
}

// --- getters ---
export function getTitle() {
    return document.title
}

export function getMeta(name) {
    let meta = document.querySelector(`meta[name="${name}"]`)
    return meta ? meta.getAttribute('content') : null
}

export function getFavicon() {
    let link = document.querySelector('link[rel="icon"]')
    return link ? link.getAttribute('href') : null
}

// --- Control Flow html ---
class If extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        this.container = document.createElement('div')
        this.shadowRoot.appendChild(this.container)
    }

    set condition(v) {
        this.container.innerHTML = ''
        if (this.condition) {
            this.container.appendChild(document.createTextNode(this.getAttribute('then') || ''))
        } else {
            this.container.appendChild(document.createTextNode(this.getAttribute('else') || ''))
        }
    }
}

customElements.define('ux-if', If)

export function UXIf(condition, thenText = '', elseText = '') {
    const el = createElement('ux-if')
    el.condition = condition
    el.setAttribute('then', thenText)
    el.setAttribute('else', elseText)
    return el
}

class For extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        this.container = document.createElement('div')
        this.shadowRoot.appendChild(this.container)
        this.data = null
        this.renderFn = null
    }

    setData(
        data,
        renderFn = (i) => {
            const el = document.createElement('p')
            el.textContent = i
            return el
        },
    ) {
        this.data = data
        this.renderFn = renderFn
        data.listen(() => this.render())
        this.render()
    }

    render() {
        if (!this.data || !this.renderFn) {
            console.error('Data or render function not set for <ux-for>')
            return
        }
        const items = this.data.get()
        this.container.innerHTML = '' // Clear previous content

        items.forEach((item, index) => {
            const el = this.renderFn(item, index)
            this.container.appendChild(el)
        })
    }
}

customElements.define('ux-for', For)

export function UXFor(data, renderFn) {
    const el = createElement('ux-for')
    el.setData(data, renderFn)
    return el
}
