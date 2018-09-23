import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
      getFeaturedImage
    , getArtworkSrc
    , getPublishDate
    , filterTerms
    , printTermNames
    , spanLabelsFor
} from '../../utils/metadata';

export default class extends Component {
    render() {
        const featuredImage = getFeaturedImage( this.props._embedded['wp:featuredmedia'] );
        const artworkSrc = getArtworkSrc( featuredImage, 'thumbnail' );
        const publishDate = getPublishDate( this.props.date_gmt );
        const artists = printTermNames( 'artist', this.props._embedded['wp:term'] );
        const genres = filterTerms( 'genre', this.props._embedded['wp:term'] );
        const tags = filterTerms( 'post_tag', this.props._embedded['wp:term'] );

        return (
            <div className="mix-list-item" onClick={ () => this.props.onClick( this.props.id ) }>
                <div className="artwork">
                    <img width="34" height="34" alt="" src={ artworkSrc } />
                </div>
                <div className="controls">
                    <button onClick={ () => this.props.onPlay( this.props.id ) }><FontAwesomeIcon icon={[ 'far', 'play' ]} fixedWidth /></button>
                    <button><FontAwesomeIcon icon={[ 'far', 'layer-plus' ]} fixedWidth /></button>
                </div>
                <div className="artists">
                    <span dangerouslySetInnerHTML={{ __html: artists }}></span>
                </div>
                <div className="title">
                    <span dangerouslySetInnerHTML={{ __html: this.props.title.rendered }}></span>
                </div>
                <div className="labels">
                    <span className="genres">{ spanLabelsFor( genres ) }</span>
                    <span className="tags">{ spanLabelsFor( tags ) }</span>
                </div>
                <div className="published">
                    <span>{ publishDate }</span>
                </div>
            </div>
        );
    }
}
