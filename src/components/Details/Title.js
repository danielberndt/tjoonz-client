import React, { Component } from 'react';
import './style.css';

export default class extends Component {
    render() {
        const { title, slug } = this.props;
        if( window.location.pathname === `/mix/${ slug }` ) {
            return null;
        } else {
            return (
                <div className="title">
                    <div className="header">Title</div>
                    <div dangerouslySetInnerHTML={{ __html: title }}></div>
                </div>
            );
        }
    }
};
