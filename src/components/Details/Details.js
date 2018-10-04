import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Artwork from './Artwork';
import { spanLabelsFor } from '../../utils/metadata';
import './style.css';

export default class extends Component {
    render() {
        const {
              slug
            , description
            , title
            , artists
            , genres
            , tags
            , publishDate
            , featuredImage
            , plays
            , downloads
            , duration
            , quality
            , fileSize
        } = this.props;

        return (
            <aside>
                <div className="mix-details">
                    <Artwork featuredImage={ featuredImage } />
                    <div className="controls">
                        <button className="play">
                            <FontAwesomeIcon icon={[ 'far', 'play' ]} fixedWidth /> <span>Play</span>
                        </button>
                        <button className="queue">
                            <FontAwesomeIcon icon={[ 'far', 'layer-plus' ]} fixedWidth /> <span>Queue</span>
                        </button>
                        <button className="download">
                            <FontAwesomeIcon icon={[ 'far', 'download' ]} fixedWidth /> <span>Download</span>
                        </button>
                    </div>
                    <div className="controls">
                        <NavLink className="tracklist" to={ `/mix/${ slug }` }>
                            <FontAwesomeIcon icon={[ 'far', 'list-ol' ]} fixedWidth /> <span>Tracklist and Comments</span>
                        </NavLink>
                    </div>
                    <div className="meta">
                        <div className="published">
                            <div className="header">Published</div>
                            <div>{ publishDate }</div>
                        </div>
                        <div className="artists">
                            <div className="header">Artists</div>
                            <div dangerouslySetInnerHTML={{ __html: artists }}></div>
                        </div>
                        <div className="title">
                            <div className="header">Title</div>
                            <div dangerouslySetInnerHTML={{ __html: title }}></div>
                        </div>
                        <div className="genres">
                            <div className="header">Genres</div>
                            <div>{ spanLabelsFor( genres ) }</div>
                        </div>
                        <div className="tags">
                            <div className="header">Tags</div>
                            <div>{ spanLabelsFor( tags ) }</div>
                        </div>
                        <div className="duration">
                            <div className="header">Duration</div>
                            <div>{ duration }</div>
                        </div>
                        <div className="description" dangerouslySetInnerHTML={{ __html: description }}></div>
                        <div className="stats">
                            <span><FontAwesomeIcon icon={[ 'far', 'play' ]} /> { plays }</span>&nbsp;
                            <span><FontAwesomeIcon icon={[ 'far', 'download' ]} /> { downloads }</span>&nbsp;
                            <span><FontAwesomeIcon icon={[ 'far', 'headphones' ]} /> { quality } <small>kbps</small></span>&nbsp;
                            <span><FontAwesomeIcon icon={[ 'far', 'hdd' ]} /> { fileSize } <small>MB</small></span>
                        </div>
                    </div>
                </div>
            </aside>
        );
    }
};
