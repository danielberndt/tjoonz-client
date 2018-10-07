import React, { Component } from 'react';
import './style.css';

export default class extends Component {
    render() {
        const { title, description, content } = this.props;
        if( content ) {
            return (
                <div className="mix-body">
                    <h1 dangerouslySetInnerHTML={{ __html: title }}></h1>
                    <p dangerouslySetInnerHTML={{ __html : description }}></p>
                    <div dangerouslySetInnerHTML={{ __html : content }}></div>
                </div>
            );
        } else {
            return null;
        }
        
    }
}
