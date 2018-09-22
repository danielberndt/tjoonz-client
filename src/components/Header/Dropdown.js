import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class extends Component {
    render() {
        return (
            <div className="dropdown">
                <button><FontAwesomeIcon icon={[ 'fas', 'ellipsis-h' ]} fixedWidth /></button>
                <ul>
                    {
                        this.props.children.map( ( child, index ) => <li key={ index }>{ child }</li> )
                    }
                </ul>
            </div>
        );
    }
}
