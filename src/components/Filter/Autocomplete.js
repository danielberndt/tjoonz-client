import React, { Component } from 'react';
import ReactAutocomplete from 'react-autocomplete';

export default class extends Component {
    constructor( props ) {
        super( props );
        this.state = {
            value : ''
        };
    }

    render() {
        return (
            <ReactAutocomplete
                items={ this.props.available.filter( item => !this.props.active.includes( item.id ) ) }
                shouldItemRender={ ( item, value ) => value.length > 0 && item.name.toLowerCase().indexOf( value.toLowerCase() ) > -1 }
                getItemValue={ item => item.name }
                menuStyle={{
                    borderRadius: '3px',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, .8)',
                    background: '#0e1013',
                    position: 'fixed',
                    overflowY: 'auto',
                    maxHeight: '110px',
                    width: '205px',
                    cursor: 'pointer'
                }}
                renderMenu={ function( items, value, style ) {
                    return value.length ? <div style={{ ...style, ...this.menuStyle }} children={ items }/> : <div />;
                }}
                renderInput={ props => <input {...props} placeholder={ this.props.loading ? 'Loading...' : `Search ${ this.props.taxonomy }` } /> }
                renderItem={ ( item, highlighted ) => (
                    <div
                        className="filter-item"
                        key={ item.id }
                        style={{
                            paddingLeft: '5px',
                            backgroundColor : highlighted ? '#1b2c42' : 'transparent' //#1b2c42
                        }}
                    >
                        <span className="filter-item-count" dangerouslySetInnerHTML={{ __html : item.count }}></span>
                        <span className="filter-item-name" dangerouslySetInnerHTML={{ __html : item.name }}></span>
                    </div>
                )}
                value={ this.state.value }
                onChange={ event => {
                    const { value } = event.target;
                    this.setState({ value });
                }}
                onSelect={ ( value, item ) => {
                    value = '';
                    this.setState({ value }, () => {
                        this.props.onFilterChange( this.props.taxonomy, item.id, true );
                    });
                }}
            />
        );
    }
}
