import React, { Component } from 'react';

export default class extends Component {
    constructor( props ) {
        super( props );
        this.state = {
            checked : this.props.active
        };
    }
    
    toggle = () => {
        this.setState({
            checked : !this.state.checked
        }, () => this.props.onToggle( this.props.filterKey, this.props.id, this.state.checked ) );
    }

    render() {
        return (
            <div className={ `filter-item ${ this.props.active ? 'active' : '' }` } id={ `filter-${ this.props.filterKey }-${ this.props.id }` }>
                <label>
                    <input type="checkbox" checked={ this.state.checked } onChange={ this.toggle } />
                    <span className="filter-item-count" dangerouslySetInnerHTML={{ __html : this.props.active ? `&times;` : this.props.count }}></span>
                    <span className="filter-item-name" dangerouslySetInnerHTML={{ __html : this.props.name }}></span>
                </label>
            </div>
        );
    }
}
