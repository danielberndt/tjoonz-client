import React from 'react';
import constants from '../constants';

export const getFeaturedImage = wpFeaturedMedia => wpFeaturedMedia && wpFeaturedMedia.length ? wpFeaturedMedia[ 0 ] : null;

export const getArtworkSrc = ( featuredImage, size = 'full' ) => {
    if( featuredImage && featuredImage.media_details.sizes[ size ] ) {
        return featuredImage.media_details.sizes[ size ].source_url;
    } else {
        switch( size ) {
            case 'thumbnail':
                return 'http://placehold.it/54x54?text=NO+ARTWORK';
            case 'medium':
                return 'http://placehold.it/280x280?text=NO+ARTWORK';
            case 'full':
            default:
                return 'http://placehold.it/960x960?text=NO+ARTWORK';
        }
    }
};

export const getPublishDate = dateGmt => {
    const date = new Date( `${ dateGmt }Z` );
    return `${ date.getFullYear() }-${ `0${ date.getMonth() + 1 }`.slice( -2 ) }-${ `0${ date.getDate() }`.slice( -2 ) }`;
};

export const filterTerms = ( taxonomy, wpTerm ) => {
    const matchedTermGroup = wpTerm.filter( termGroup => termGroup.length ? termGroup[0].taxonomy === taxonomy : false );
    return matchedTermGroup.length ? matchedTermGroup[ 0 ] : [];
};

export const printTermNames = ( taxonomy, wpTerm, separator = ', ' ) => {
    const terms = filterTerms( taxonomy, wpTerm );
    const termNames = terms.map( term => term.name );
    return termNames.join( separator );
};

export const spanLabelsFor = terms => {
    return terms.map(( term, index ) => <span key={ index } className="label"><span dangerouslySetInnerHTML={{ __html : term.name }}></span></span> );
};

export const linkLabelsFor = ( terms, history ) => {
    // TEMPORARY FIX
    // @TODO: change taxonomy registration in WordPress so I can avoid this
    return terms.map(( term, index ) => <button key={ index } className="label" onClick={ () => history.push( `/search?${ term.taxonomy.replace( 'genre', 'genres' ).replace( 'artist', 'artists' ) }=${ term.id }` ) }><span dangerouslySetInnerHTML={{ __html : term.name }}></span></button> );
};

export const printNumber = number => {
    return number.toString().replace( /\B(?=(\d{3})+(?!\d))/g, ',' );
};

export const printDuration = seconds => {
    const hours = Math.floor( seconds / 3600 );
    seconds = seconds - ( hours * 3600 );
    const minutes = Math.floor( seconds / 60 );
    seconds = seconds - ( minutes * 60 );
    return `${ hours }:${ ( 100 + minutes ).toString().substr( 1 ) }:${ ( 100 + seconds ).toString().substr( 1 ) }`;
};

export const printBitRate = bitrate => {
    return `${ ( bitrate / 1000 ).toFixed( 0 ) }`;
};

export const printFileSize = bytes => {
    return `${ Math.ceil( bytes / 1048576 )}`;
};

/**
 * Retrieve mix data by its ID.
 * @param {Number} id - ID of post with mix data.
 */
export const getMixById = id => {
    const url = `${ process.env.REACT_APP_WPAPI_URL }/posts/${ id }?_embed`;
    return fetch( url ).then( response => response.json() );
};

/**
 * Retrieve mix data by its slug.
 * @param {String} slug - Slug of post with mix data.
 */
export const getMixBySlug = slug => {
    const url = `${ process.env.REACT_APP_WPAPI_URL }/posts?_embed&slug=${ slug }`;
    return fetch( url ).then( response => response.json() ).then( json => json[ 0 ]);
};

/**
 * Convert WordPress post response into Tjoonz mix data.
 * @param {Object} mix - Post JSON with mix data.
 */
export const extractMixData = mix => {
    return {
        id            : mix.id,
        slug          : mix.slug,
        content       : mix.content.rendered,
        description   : mix.meta._yoast_wpseo_metadesc,
        title         : mix.title.rendered,
        artists       : printTermNames( 'artist', mix._embedded[ 'wp:term' ]),
        genres        : filterTerms( 'genre', mix._embedded[ 'wp:term' ]),
        tags          : filterTerms( 'post_tag', mix._embedded[ 'wp:term' ]),
        publishDate   : getPublishDate( mix.date_gmt ),
        featuredImage : getFeaturedImage( mix._embedded[ 'wp:featuredmedia' ]),
        plays         : printNumber( mix.meta._tjnz_plays ),
        downloads     : printNumber( mix.meta._tjnz_downloads ),
        duration      : printDuration( mix.meta._tjnz_duration ),
        quality       : printBitRate( mix.meta._tjnz_bitrate ),
        fileSize      : printFileSize( mix.meta._tjnz_filesize )
    };
};

/**
 * Gets all comments of a mix.
 * @param {Number} id - Post ID to which comments belong.
 */
export const getCommentsById = ( id, page = 1 ) => {
    // @TODO: This function is now almost exactly like `fetchPage` in './filter.js'... Need to code this DRY.
    const url = `${ process.env.REACT_APP_WPAPI_URL }/comments?post=${ id }&page=${ page }&per_page=${ constants.search.resultsPerPage }`;
    return fetch( url )
        .then( async response => {
            const currentPage = await response.json();
            if( !currentPage.length ) {
                return currentPage;
            } else if( page >= Number( response.headers.get( 'X-WP-TotalPages' )) ) {
                return currentPage;
            } else {
                return getCommentsById( id, ++page )
                    .then( nextPage => [ ...currentPage, ...nextPage ] );
            }
        });
};
