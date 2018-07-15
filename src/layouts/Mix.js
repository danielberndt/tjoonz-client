import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class extends Component {
    render() {
        if( this.props.location.pathname.substr( -1 ) === '/' ) {
            return <Redirect to={ `${ this.props.location.pathname.substr( 0, this.props.location.pathname.length - 1 ) }` } />
        } else {
            return (
                <div className="layout layout-mix">
                    <div className="wrap">
                        <span>Mix Page</span>
                    </div>
                </div>
            );
        }
    }
}
