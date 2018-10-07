import React, { Component } from 'react';
import './style.css';

export default class extends Component {
    render() {
        const { description, slug } = this.props;
        if( window.location.pathname === `/mix/${ slug }` ) {
            return null;
        } else {
            return <div className="description" dangerouslySetInnerHTML={{ __html: description }}></div>;
        }
    }
};
