import React, { Component } from 'react';
import './style.css';

export default class extends Component {
    render() {
        const { content } = this.props;
        if( content ) {
            return <div className="mix-body" dangerouslySetInnerHTML={{ __html : content }}></div>;
        } else {
            return null;
        }
        
    }
}
