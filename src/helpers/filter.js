

export const parseFilterSegment = segment => {
    const separated = /[,|]/.exec( segment );
    const separator = separated ? separated[ 0 ] : '';
    const replace   = separated ? new RegExp( separator === ',' ? '[|]' : '[,]', 'g' ) : '';
    return {
        and : separator === ',',
        ids : separated ? segment.replace( replace, separator ).split( separator ).map( Number ) : [ parseInt( segment, 10 ) ]
    };
};
