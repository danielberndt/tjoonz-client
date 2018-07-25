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
                shouldItemRender={ ( item, value ) => item.name.toLowerCase().indexOf( value.toLowerCase() ) > -1 }
                getItemValue={ item => item.name }
                renderItem={ ( item, highlighted ) => (
                    <div
                        key={ item.id }
                        style={{ backgroundColor : highlighted ? '#eee' : 'transparent' }}
                        dangerouslySetInnerHTML={{ __html : item.name }}
                    ></div>
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
