import fromDOM from 'DON/lib/fromDOM';
import toDOM from 'DON/lib/toDOM';

/**
 * Transformer instance registers new transform functions and applies them to given input.
 * @class DOMTransform
 */
export default class DOMTransform {
    constructor() {
        this.nodes = {
            element : (element, params) => {
                const transform = this.elements[element.element] || this.elements[''];
                if(!element.attributes) element.attributes = {};
                return transform.call(this, element, params);
            },
            text : text => text,
            comment : comment => comment,
            document : document => document,
            doctype : doctype => doctype
        };
        this.elements = {
            '' : ({ element, attributes, content }, params) => ({
                element,
                attributes,
                content : this.apply(content, params)
            })
        };
    }

    /**
     * Registers node template
     * @param {String} name Transform name
     * @param {Function} transform Transform function
     */
    node(name, transform) {
        this.nodes[name] = transform;
    }

    /**
     * Registers element template
     * @param {String} name Template name
     * @param {Function} transform Transform function
     */
    element(name, transform) {
        this.elements[name] = transform;
    }

    /**
     * Applies registered templates to DON-tree
     * @param {Object|Array} object Root input DON-tree object
     * @param {Object} [params] Additional parameters
     * @returns {Object|Array} don Root resulting DON-tree object
     */
    apply(object, params) {
        if(!object) {
            return null;
        } else if(Array.isArray(object)) {
            const result = [];
            for(let i = 0; i < object.length; i++) {
                let item;
                if(item = this.apply(object[i], params)) result.push(item);
            }
            return result;
        } else {
            const name = typeof object === 'string'?
                    'text' :
                    object.element? 'element' : object.node,
                transform = this.nodes[name];
            if(transform) return transform.call(this, object, params);
        }
        throw Error('Match failed');
    }

    /**
     * Applies registered templates to given DOM/DON-tree and builds a new DOM-tree
     * @param {Node|Object} input Root input DOM/DON-tree node/object
     * @returns {Node} Resulting DOM-tree root node
     */
    transform(input) {
        return toDOM(this.apply(input instanceof Node? fromDOM(input) : input));
    }

    /**
     * Registers all given templates
     * @param {Array} templates The array of template registering functions
     */
    templates(...templates) {
        templates.forEach(template => template(this));
    }

    /**
     * Applies given templates to given DOM/DON-tree and builds a new DOM-tree
     * @param {Node|Object} input Root input DOM/DON-tree node/object
     * @param {Array} templates The array of template registering functions
     * @returns {Node} Resulting DOM-tree root node
     */
    static transform(input, templates) {
        const domTransform = new DOMTransform;
        domTransform.templates(...templates);
        return domTransform.transform(input);
    }
}
