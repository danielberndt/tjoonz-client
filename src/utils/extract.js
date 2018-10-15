/**
 * Extracts first element of array, but handles empty arrays gracefully.
 * @param {Array} container Array of objects.
 * @returns {Object} The first element or `undefined`.
 */
export const extractFirstElement = container => ( container || [])[ 0 ];

/**
 * Extracts WP Terms based on taxonomy name.
 * @param {Array} container Array with arrays of objects, which *might* contain taxonomy.
 * @param {String} taxonomy The taxonomy to find and extract.
 * @returns {Array} Array of terms matching the taxonomy.
 */
export const extractTermsByTaxonomy = ( container, taxonomy ) => {
    // Filters the container array to only contain the child array where its elements are objects with the needed taxonomy.
    // The filter function handles empty arrays as well as objects without a `taxonomy` property.
    const terms = container.filter( terms => (( terms || [])[ 0 ] || {}).taxonomy === taxonomy );
    // Flatten Array.Array -> Array
    return [ ...( terms[ 0 ] || []) ];
};

/**
 * Extract the URL of the media.
 * @param {Object} media The WP Featured Media object from which to extract the URL.
 * @param {String} size The size of the image to return.
 * @returns {String} The URL of the matched media.
 */
export const extractArtworkSrc = ( media, size = 'full' ) => {
    const url = (((( media || {}).media_details || {}).sizes || {})[ size ] || {}).source_url;
    return url || _fallbackArtworkSrc( size );
};

/**
 * Returns a URL of a blank placeholder image.
 * @param {String} size The size of the image to return.
 * @returns {String} The URL of the matched media.
 */
const _fallbackArtworkSrc = size => {
    switch( size ) {
        case 'thumbnail':
            return 'https://via.placeholder.com/54x54?text=NO+ARTWORK';
        case 'medium':
            return 'https://via.placeholder.com/280x280?text=NO+ARTWORK';
        case 'full':
        default:
            return 'https://via.placeholder.com/960x960?text=NO+ARTWORK';
    }
};
