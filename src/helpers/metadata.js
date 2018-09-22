import React from 'react';

export const getFeaturedImage = wpFeaturedMedia => wpFeaturedMedia && wpFeaturedMedia.length ? wpFeaturedMedia[ 0 ] : null;

export const getArtworkSrc = ( featuredImage, size = 'full' ) => {
    if( featuredImage && featuredImage.media_details.sizes[ size ] ) {
        return featuredImage.media_details.sizes[ size ].source_url;
    } else {
        switch( size ) {
            case 'thumbnail':
                return 'http://placehold.it/54x54?text=NO+ARTWORK';
            case 'medium':
                return 'http://placehold.it/265x265?text=NO+ARTWORK';
            case 'full':
            default:
                return 'http://placehold.it/960x960?text=NO+ARTWORK';
        }
    }
}

export const getPublishDate = dateGmt => {
    const date = new Date( `${ dateGmt }Z` );
    return `${ date.getFullYear() }-${ `0${ date.getMonth() + 1 }`.slice( -2 ) }-${ `0${ date.getDate() }`.slice( -2 ) }`;
}

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
    // todo: change taxonomy registration in WordPress so I can avoid this
    return terms.map(( term, index ) => <button key={ index } className="label" onClick={ () => history.push( `/search?${ term.taxonomy.replace( 'genre', 'genres' ).replace( 'artist', 'artists' ) }=${ term.id }` ) }><span dangerouslySetInnerHTML={{ __html : term.name }}></span></button> );
}
