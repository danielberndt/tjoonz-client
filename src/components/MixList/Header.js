import React, { Component } from 'react';

export default class extends Component {
    render() {
        return(
            <div className="mix-list-header">
                <div><span className="mix-artwork"></span></div>
                <div><span className="mix-title">Title</span></div>
                <div><span className="mix-artists">Artist(s)</span></div>
                <div><span className="mix-genres">Genre(s)</span></div>
                <div><span className="mix-tags">Tag(s)</span></div>
            </div>
        );
    }
}
