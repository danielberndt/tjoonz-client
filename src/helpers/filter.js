import queryString from 'query-string';

export const parseRoute = ( route, recognisedKeys = [] ) => {
    const query = queryString.parse( route );
    Object.keys( query ).forEach( key => {
        query[ key ] = recognisedKeys.indexOf( key ) === -1 ? null : parseRouteSegment( query[ key ] );
    });
    return query;
};

export const parseRouteSegment = segment => {
    const separated = /[,|]/.exec( segment );
    const separator = separated ? separated[ 0 ] : '';
    const replace   = separated ? new RegExp( separator === ',' ? '[|]' : '[,]', 'g' ) : '';
    return {
        and : separator === ',',
        ids : separated ? segment.replace( replace, separator ).split( separator ).map( Number ) : [ parseInt( segment, 10 ) ]
    };
};

export const createRoute = query => {
    const segments = Object.keys( query ).filter( key => query[ key ] && query[ key ].ids.length ).map( key => {
        const separator = query[ key ].and ? ',' : '|';
        return `${ key }=${ query[ key ].ids.join( separator ) }`;
    });
    return `/search${ segments.length ? '?' : '' }${ segments.join( '&' ) }`;
};

export const fetchPage = ( endpoint, page, perPage = 10, recursive = false, exclude = [], orderBy = 'name', descending = false  ) => {
    const segments = [];
    segments.push( endpoint );
    segments.push( `?per_page=${ perPage }` );
    segments.push( `&page=${ page++ }` );
    segments.push( `&orderby=${ orderBy }` );
    segments.push( `&order=${ descending ? 'desc' : 'asc' }` );
    if( exclude.length ) {
        segments.push( `&exclude=${ exclude.join( ',' ) }` );
    }
    return fetch( `${ process.env.REACT_APP_WPAPI_URL }/${ segments.join( '' ) }` )
        .then( response => response.json() )
        .then( currentPage => {
            if( !currentPage.length ) {
                return currentPage;
            } else if ( !recursive ) {
                return currentPage;
            } else {
                return fetchPage( endpoint, page, perPage, recursive, exclude, orderBy, descending )
                    .then( nextPage => [ ...currentPage, ...nextPage ] );
            }
        });
}
