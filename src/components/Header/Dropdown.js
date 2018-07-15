import React, { Component } from 'react';

export default class extends Component {
    render() {
        return (
            <div className="dropdown">
                <button>&hellip;</button>
                <ul>
                    {
                        this.props.children.map( child => <li>{ child }</li> )
                    }
                </ul>
            </div>
        );
    }
}
