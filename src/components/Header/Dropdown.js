import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class extends Component {
    constructor( props ) {
        super( props );
        this.state = {
            expanded : this.props.initOpen || false
        };
    }

    render() {
        return (
            <div className={ `dropdown ${ this.state.expanded ? 'expanded' : '' }` }>
                <button onClick={ () => this.setState({ expanded : !this.state.expanded }) }><FontAwesomeIcon icon={[ 'far', 'bars' ]} fixedWidth /></button>
                <ul>
                    {
                        this.props.children.map( ( child, index ) => <li key={ index }>{ child }</li> )
                    }
                </ul>
            </div>
        );
    }
}
