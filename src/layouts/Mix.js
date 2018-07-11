import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class extends Component {
    render() {
        if( this.props.location.pathname.substr( -1 ) !== '/' ) {
            return <Redirect to={ `${ this.props.location.pathname }/` } />
        } else {
            return (
                <div className="layout">
                    <h1>Mix Page</h1>
                </div>
            );
        }
    }
}
