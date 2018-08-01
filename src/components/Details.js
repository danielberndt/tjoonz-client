import React, { Component } from 'react';
import { getFeaturedImage, getArtworkSrc, getPublishDate, filterTerms, printTermNames, spanLabelsFor } from '../helpers/metadata';
import ScrollPanel from './ScrollPanel';

export default class extends Component {
    render() {
        if( !this.props.id ) {
            return null;
        }
        const featuredImage = getFeaturedImage( this.props._embedded['wp:featuredmedia'] );
        const publishDate = getPublishDate( this.props.date_gmt );
        const artworkSrc = getArtworkSrc( featuredImage, 'medium' );
        const artists = printTermNames( 'artist', this.props._embedded['wp:term'] );
        const genres = filterTerms( 'genre', this.props._embedded['wp:term'] );
        const tags = filterTerms( 'post_tag', this.props._embedded['wp:term'] );

        return (
            <ScrollPanel>
                <div className="mix-details">
                    <div className="artwork">
                        <img width="265" height="265" alt="" src={ this.props.isLoading ? '' : artworkSrc } />
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
            </ScrollPanel>
        );
    }
}
