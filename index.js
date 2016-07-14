/**
 * DOMTransform
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
     * Registers node transform function
     * @param {String} name — transform name
     * @param {Function} transform — transform function
     */
    node(name, transform) {
        this.nodes[name] = transform;
    }

    /**
     * Registers element transform function
     * @param {String} name — transform name
     * @param {Function} transform — transform function
     */
    element(name, transform) {
        this.elements[name] = transform;
    }

    /**
     * Applies registered transformations to DON-tree
     * @param {Object|Array} object — root input DON-tree object
     * @param {Object} params — additional parameters
     * @returns {Object|Array} don — root resulting DON-tree object
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
}
