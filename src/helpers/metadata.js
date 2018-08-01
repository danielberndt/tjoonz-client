import React from 'react';

export const getFeaturedImage = wpFeaturedMedia => wpFeaturedMedia && wpFeaturedMedia.length ? wpFeaturedMedia[ 0 ] : null;

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

export const linkLabelsFor = terms => {
    return terms.map(( term, index ) => <a key={ index } className="label" href={ term.link }><span dangerouslySetInnerHTML={{ __html : term.name }}></span></a> );
}
