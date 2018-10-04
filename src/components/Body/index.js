import React, { Component } from 'react';

export default class extends Component {
    render() {
        const { content } = this.props;
        if( content ) {
            return (
                <aside>
                    <div className="mix-body" dangerouslySetInnerHTML={{ __html : content }}></div>
                </aside>
            );
        } else {
            return null;
        }
        
    }
}
