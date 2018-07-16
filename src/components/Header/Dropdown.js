import React, { Component } from 'react';

export default class extends Component {
    render() {
        return (
            <div className="dropdown">
                <button>&hellip;</button>
                <ul>
                    {
                        this.props.children.map( ( child, index ) => <li key={ index }>{ child }</li> )
                    }
                </ul>
            </div>
        );
    }
}
