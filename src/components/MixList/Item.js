import React, { Component } from 'react';
import { getFeaturedImage, printTermNames } from '../../helpers/metadata';

export default class extends Component {
    render() {
        const featuredImage = getFeaturedImage( this.props._embedded['wp:featuredmedia'] );
        const mixArtists = printTermNames( 'artist', this.props._embedded['wp:term'] );
        const mixGenres = printTermNames( 'genre', this.props._embedded['wp:term'] );
        const mixTags = printTermNames( 'post_tag', this.props._embedded['wp:term'] );
        
        return (
            <div className="mix-list-item">
                <div><img className="mix-artwork" width="54" height="54" alt="" src={ featuredImage ? featuredImage.media_details.sizes.thumbnail.source_url : 'http://placehold.it/54x54' } /></div>
                <div><span className="mix-title" dangerouslySetInnerHTML={{ __html: this.props.title.rendered }}></span></div>
                <div><span className="mix-artists" dangerouslySetInnerHTML={{ __html: mixArtists }}></span></div>
                <div><span className="mix-genres" dangerouslySetInnerHTML={{ __html: mixGenres }}></span></div>
                <div><span className="mix-tags" dangerouslySetInnerHTML={{ __html: mixTags }}></span></div>
            </div>
        );
    }
}
