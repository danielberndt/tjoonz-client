import React from 'react';

/**
 * Formats a given timestamp into the publish date format.
 * @param {String} dateGmt The timestamp in GMT timezone.
 * @returns {String} The timestamp in YYYY-MM-DD format.
 */
export const toPublishDate = dateGmt => {
    const date = new Date( `${ dateGmt }Z` );
    return `${ date.getFullYear() }-${ `0${ date.getMonth() + 1 }`.slice( -2 ) }-${ `0${ date.getDate() }`.slice( -2 ) }`;
};

/**
 * Converts array of terms to string of term names.
 * @param {Array} terms The terms to format.
 * @param {String} separator How to separate the terms.
 * @returns {String} All term names.
 */
export const toTermNames = ( terms, separator = ', ' ) => {
    const names = terms.map( term => term.name );
    return names.join( separator );
};

/**
 * Converts array of terms to span labels.
 * @param {Array} terms The terms to format.
 * @returns {String} All term names.
 */
export const toTermSpanLabels = terms => {
    return terms.map(( term, index ) => <span key={ index } className="label"><span dangerouslySetInnerHTML={{ __html : term.name }}></span></span> );
};

/**
 * Converts array of terms to linked labels.
 * @param {Array} terms The terms to format.
 * @returns {String} All term names.
 */
export const toTermlinkLabels = ( terms, history ) => {
    return terms.map(( term, index ) => <button key={ index } className="label" onClick={ () => history.push( `/search?${ term.taxonomy }=${ term.id }` ) }><span dangerouslySetInnerHTML={{ __html : term.name }}></span></button> );
};

/**
 * Adds comma as thousands-separator.
 * @param {Number} number 
 * @returns {String}
 */
export const toNumber = number => {
    return number.toString().replace( /\B(?=(\d{3})+(?!\d))/g, ',' );
};

/**
 * Formats a duration.
 * @param {Number} seconds The duration in seconds.
 * @returns {String} The duration in hh:mm:ss format.
 */
export const toDuration = seconds => {
    const hours = Math.floor( seconds / 3600 );
    seconds = seconds - ( hours * 3600 );
    const minutes = Math.floor( seconds / 60 );
    seconds = seconds - ( minutes * 60 );
    return `${ hours }:${ ( 100 + minutes ).toString().substr( 1 ) }:${ ( 100 + seconds ).toString().substr( 1 ) }`;
};

/**
 * Formats a bit rate.
 * @param {Number} bps Rate in bits per second.
 * @returns {Number} Rate in kilobits per second.
 */
export const toKbps = bps => {
    return ( bps / 1000 ).toFixed( 0 );
};

/**
 * Formats a file size.
 * @param {Number} bytes File size in bytes.
 * @returns {Number} File size in megabytes.
 */
export const toMegabytes = bytes => {
    return Math.ceil( bytes / 1048576 );
};

/**
 * Formats an object's key-value pairs like a URL query string.
 * @param {Object} object 
 */
export const toQueryString = object => {
    const segments = Object.keys( object ).map( key => {
        const value = object[ key ];
        return `${ key }=${ Array.isArray( value ) ? value.join( ',' ) : value }`;
    });
    return segments.length ? `?${ segments.join( '&' ) }` : '';
};
