import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
            <div className={ `filter-item ${ this.props.active ? 'active' : '' }` } id={ `filter-${ this.props.filterKey }-${ this.props.id }` } onClick={ this.toggle }>
                <label>
                    <FontAwesomeIcon icon={[ 'far', this.state.checked ? 'check-square' : 'square' ]} fixedWidth />
                    <span className="filter-item-count">
                        <span>{ this.props.count }</span>
                        <FontAwesomeIcon icon={[ 'far', 'times' ]} />
                    </span>
                    <span className="filter-item-name" dangerouslySetInnerHTML={{ __html : this.props.name }}></span>
                </label>
            </div>
        );
    }
}
