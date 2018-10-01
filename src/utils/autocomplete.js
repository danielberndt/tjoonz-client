import React from 'react';

export const filterItems = ( available, active ) => available.filter( item => !active.includes( item.id ) );

export const shouldItemRender = ( item, input ) => {
    const enoughInput = input.trim().length > 0;
    // Sanitise user input and construct a regular expression to match
    const pattern = !enoughInput ? '' : input.replace( /[.*+?^${}()|[\]\\]/g, '\\$&' )
                                             .trim()
                                             .split(' ')
                                             .filter( value => value.length )
                                             .map( value => `(?=.*?\\b${ value })` )
                                             .join('');
    const regex = new RegExp( pattern, 'gi' );
    return enoughInput && regex.test( item.name );
};

export const renderMenu = ( items, value, style ) => value.length ? <div style={ style } children={ items }/> : <div />;

export const renderInput = ( props, filterKey, loading ) => <input className="filter-autocomplete-input" {...props} placeholder={ loading ? 'Loading...' : `Search ${ filterKey }` } />;

export const renderItem = ( item, highlighted ) => (
    <div
        className="filter-item"
        key={ item.id }
        style={{
            paddingLeft: '5px',
            backgroundColor : highlighted ? '#242a32' : 'transparent'
        }}
    >
        <span className="filter-item-count" dangerouslySetInnerHTML={{ __html : item.count }}></span>
        <span className="filter-item-name" dangerouslySetInnerHTML={{ __html : item.name }}></span>
    </div>
);

export const sortItems = ( itemA, itemB, value ) => itemB.count - itemA.count;
