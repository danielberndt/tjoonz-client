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
