import React, { Component } from 'react';
import { getFeaturedImage, getPublishDate, filterTerms, printTermNames, spanLabelsFor } from '../../helpers/metadata';

export default class extends Component {
    render() {
        const featuredImage = getFeaturedImage( this.props._embedded['wp:featuredmedia'] );
        const artworkSrc = featuredImage ? featuredImage.media_details.sizes.thumbnail.source_url : 'http://placehold.it/54x54?text=NO+ARTWORK';
        const publishDate = getPublishDate( this.props.date_gmt );
        const artists = printTermNames( 'artist', this.props._embedded['wp:term'] );
        const genres = filterTerms( 'genre', this.props._embedded['wp:term'] );
        const tags = filterTerms( 'post_tag', this.props._embedded['wp:term'] );

        return (
            <div className="mix-list-item" onClick={ () => this.props.onClick( this.props.id ) }>
                <div className="artwork">
                    <img width="54" height="54" alt="" src={ artworkSrc } />
                    <button>Play</button>
                </div>
                <div className="meta">
                    <div className="published"><span>{ publishDate }</span></div>
                    <div className="title"><span dangerouslySetInnerHTML={{ __html: this.props.title.rendered }}></span></div>
                    <div className="artists"><span dangerouslySetInnerHTML={{ __html: artists }}></span></div>
                </div>
                <div className="tax">
                    <span className="genres">{ spanLabelsFor( genres ) }</span>
                    <span className="tags">{ spanLabelsFor( tags ) }</span>
                </div>
            </div>
        );
    }
}
