import React, { Component } from 'react';

// @TODO: Make the column headers clickable and let them sort the results ASC / DESC.
export default class extends Component {
    render() {
        return (
            <div className="mix-list-header">
                <div className="artists"><span>Artists</span></div>
                <div className="title"><span>Title</span></div>
                <div className="labels"><span>Labels</span></div>
                <div className="published"><span>Published</span></div>
            </div>
        );
    }
}
