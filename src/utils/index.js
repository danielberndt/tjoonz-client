/**
 * Copies an object without any internal references.
 * @param {Object} original - Object to clone.
 * @param {Object|Array} base - Object or Array to initialise the reduce() with.
 * @returns {Object} Deep clone of the original.
 */
const deepClone = ( original, base = {} ) => {
    return Object.keys( original ).reduce(( clone, key ) => Object.assign( clone, {[ key ] : typeof original[ key ] === 'object' ? deepClone( original[ key ]) : original[ key ]} ), base );
};

/**
 * Traverses `object` using dot-separated keys.
 * @param {*} object 
 * @param {*} path 
 * @param {*} defaultValue 
 * @example
 * // Returns "Hello World" in data = { foo : { bar : { baz : "Hello World" } } }
 * traverse( data, 'foo.bar.baz' )
 * @returns {*} Value at the key's location, or `defaultValue`
 */
const traverse = ( object, path, defaultValue = undefined ) => {
    let keys = path.split( '.' );
    let value = deepClone( object );
    while( keys.length && typeof value === 'object' ) {
        const key = keys.shift();
        value = value[ key ];
    }
    return value === undefined ? defaultValue : value;
};
