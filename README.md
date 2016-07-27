# DOMTransform

A constructor of declarative JavaScript DOM-based templates.
DOMTransform uses [DON](//github.com/aristov/DON) to describe document transformations.

## Installation
```
npm install https://github.com/aristov/DOMTransform.git --save
```

## Simple transform example

Consider this XML murkup:
```xml
<cities>
    <city name="Moscow"/>
    <city name="Amsterdam"/>
    <city name="New York"/>
</cities>
```

Let's write transforming templates:
```js
domTransform.element('cities', function({ content }) {
    return {
        element : 'select',
        attributes : { name : 'cities' },
        content : this.apply(content)
    }
})
domTransform.element('city', function({ attributes }) {
    const name = attributes.name;
    return {
        element : 'option',
        attributes : { value : name.substr(0, 3).toLowerCase() },
        content : name
    }
})
```

With these two transforms we get the following HTML murkup:
```html
<select name=cities>
    <option value=mos>Moscow</option>
    <option value=ams>Amsterdam</option>
    <option value=new>New York</option>
</select>
```

## Usage
```js
// import tool
import DOMTransform from 'DOMTransform';

// define input DON tree
const input = {
    element : 'button',
    attributes : { id : 'mybutton' },
    content : 'Push button'
}

// write templates
const templates = [
    domTransform => domTransform.element('button', function({ attributes, content }) {
        return {
            element : 'span',
            attributes : { role : 'button', id : attributes.id },
            content : this.apply(content)
        };
    })
];

// apply templates to input DON tree
const result = DOMTransform.transform(input, templates);

// append resulting DOM to document body
document.body.appendChild(result);
```

The appended result is DOM representation of the following HTML:
```html
<span role=button id=mybutton>Push button</span>
```

## License

[MIT](LICENSE)
