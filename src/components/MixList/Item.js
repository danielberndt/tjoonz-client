import React, { Component } from 'react';

export default class extends Component {
    render() {
        return(
            <div className="mix-list-item">
                <div><span className="mix-title" dangerouslySetInnerHTML={{ __html: this.props.title.rendered }}></span></div>
            </div>
        );
    }
}
