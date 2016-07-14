# DOMTransform

A constructor of declarative JavaScript DOM-based templates.
DOMTransform uses [DON](//github.com/aristov/DON) to describe document transformations.

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
domTransform('cities', function({ content }) {
    return {
        element : 'select',
        attributes : { name : 'cities' },
        content : this.apply(content)
    }
})
domTransform('city', function({ attributes }) {
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
    <option value=new>Moscow</option>
</select>
```

## Installation
```
npm install https://github.com/aristov/DOMTransform.git --save
```

## Usage
```js
// import tools
import DOMTransform from 'DOMTransform';
import DON from 'DON';

// create templater instance
const domTransform = new DOMTransform;

// write transformations
domTransform.element('myapp', function({ attributes, content }) {
    /* transformations */
});

// apply transformations to input DON tree
const result = domTransform.apply({
    element : 'myapp',
    attributes : { /* ... */ },
    content : [/* ... */]
});

// convert resulting DON tree to DOM tree
const myapp = DON.toDOM(result);

// append generated DOM to document
document.body.appendChild(myapp);
```


## License

[MIT](LICENSE)
