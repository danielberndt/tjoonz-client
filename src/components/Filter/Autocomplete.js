import React, { Component } from 'react';
import ReactAutocomplete from 'react-autocomplete';
import {
      filterItems
    , shouldItemRender
    , renderMenu
    , renderInput
    , renderItem
    , sortItems
} from '../../utils/Autocomplete';

export default class extends Component {
    constructor( props ) {
        super( props );
        this.state = {
            value : ''
        };
        this.style = {
            borderRadius: '3px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, .8)',
            background: '#0e1013',
            position: 'fixed',
            overflowY: 'auto',
            maxHeight: '112px',
            width: '205px',
            cursor: 'pointer'
        };
    }

    render() {
        return (
            <ReactAutocomplete
                items={ filterItems( this.props.available, this.props.active ) }
                shouldItemRender={ shouldItemRender }
                getItemValue={ item => item.name }
                renderMenu={ ( items, value, style ) => renderMenu( items, value, { ...style, ...this.style } ) }
                renderInput={ props => renderInput( props, this.props.filterKey, this.props.loading ) }
                renderItem={ renderItem }
                sortItems={ sortItems }
                value={ this.state.value }
                onChange={ event => {
                    const { value } = event.target;
                    this.setState({ value });
                }}
                onSelect={ ( value, item ) => {
                    value = '';
                    this.setState({ value }, () => {
                        this.props.onFilterChange( this.props.filterKey, item.id, true );
                    });
                }}
            />
        );
    }
}
