import React, { Component } from 'react';

export default class extends Component {
    render() {
        return (
            <div className="mix-list-header">
                <div className="published"><span>Published</span></div>
                <div className="title"><span>Title</span></div>
                <div className="artists"><span>Artist(s)</span></div>
            </div>
        );
    }
}
