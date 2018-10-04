import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './style.css';

export default class extends Component {
    render() {
        return (
            <aside>
                <div className="mix-details">
                    <div className="artwork">
                        Loading&hellip;
                    </div>
                    <div className="controls">
                        <button className="play" disabled>
                            <FontAwesomeIcon icon={[ 'far', 'play' ]} fixedWidth /> <span>Play</span>
                        </button>
                        <button className="queue" disabled>
                            <FontAwesomeIcon icon={[ 'far', 'layer-plus' ]} fixedWidth /> <span>Queue</span>
                        </button>
                        <button className="download" disabled>
                            <FontAwesomeIcon icon={[ 'far', 'download' ]} fixedWidth /> <span>Download</span>
                        </button>
                    </div>
                    <div className="controls">
                        <a className="tracklist">
                            <FontAwesomeIcon icon={[ 'far', 'list-ol' ]} fixedWidth /> <span>Tracklist and Comments</span>
                        </a>
                    </div>
                    <div className="meta">
                        <div className="published">
                            <div className="header">Published</div>
                        </div>
                        <div className="artists">
                            <div className="header">Artists</div>
                        </div>
                        <div className="title">
                            <div className="header">Title</div>
                        </div>
                        <div className="genres">
                            <div className="header">Genres</div>
                        </div>
                        <div className="tags">
                            <div className="header">Tags</div>
                        </div>
                        <div className="duration">
                            <div className="header">Duration</div>
                        </div>
                        <div className="description">Loading&hellip;</div>
                        <div className="stats">
                            <span><FontAwesomeIcon icon={[ 'far', 'play' ]} /> &hellip;</span>&nbsp;
                            <span><FontAwesomeIcon icon={[ 'far', 'download' ]} /> &hellip;</span>&nbsp;
                            <span><FontAwesomeIcon icon={[ 'far', 'headphones' ]} /> &hellip; <small>kbps</small></span>&nbsp;
                            <span><FontAwesomeIcon icon={[ 'far', 'hdd' ]} /> &hellip; <small>MB</small></span>
                        </div>
                    </div>
                </div>
            </aside>
        );
    }
};
