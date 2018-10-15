import { toQueryString } from './format';
import config from '../config';
import constants from '../constants';

/**
 * Fetch a page of the WP API resource.
 * @param {String} endpoint Name of the WP API resource.
 * @param {Number} page Page number to fetch.
 * @param {Object} options Sets options for fetching, such as sorting and results per page.
 * @param {Boolean} recursive Keep fetching pages until exhausted.
 */
export const fetchPage = ( endpoint, page = 1, options = {}, recursive = false ) => {
    const queryString = toQueryString( Object.assign( {}, _fetchPageOptions, options, { page }));
    return fetch( `${ config.apiBaseUrl }/${ endpoint }${ queryString }` ).then( async response => {
        const currentPage = await response.json();
        if( !recursive || !currentPage.length || page >= Number( response.headers.get( 'X-WP-TotalPages' )) ) {
            return currentPage;
        } else {
            return fetchPage( endpoint, ++page, options, recursive )
                .then( nextPage => [ ...currentPage, ...nextPage ] );
        }
    });
};

const _fetchPageOptions = {
    per_page : constants.pagination.resultsPerPage
};

/**
 * Retrieve mix data by its ID.
 * @param {Number} id - ID of post with mix data.
 */
export const fetchMixById = id => {
    const url = `${ config.apiBaseUrl }/posts/${ id }?_embed`;
    return fetch( url ).then( response => response.json() );
};

/**
 * Retrieve mix data by its slug.
 * @param {String} slug - Slug of post with mix data.
 */
export const fetchMixBySlug = slug => {
    const url = `${ config.apiBaseUrl }/posts?_embed&slug=${ slug }`;
    return fetch( url ).then( response => response.json() ).then( json => json[ 0 ]);
};

/**
 * Gets all comments of a mix.
 * @param {Number} id - Post ID to which comments belong.
 */
export const fetchCommentsById = ( id, page = 1, recursive = false ) => {
    const options = Object.assign( {}, _fetchCommentsOptions, {
        post   : id,
        offset : page > 1 ? constants.comments.offset : 0
    });
    return fetchPage( 'comments', page, options, recursive );
};

const _fetchCommentsOptions = {
    offset : constants.comments.offset
};
