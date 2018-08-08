import React, { Component } from 'react';
import { getFeaturedImage, getArtworkSrc, getPublishDate, filterTerms, printTermNames, spanLabelsFor } from '../helpers/metadata';
import ScrollPanel from './ScrollPanel';

export default class extends Component {
    constructor( props ) {
        super( props );
        this.showLoading();
    }
    
    shouldComponentUpdate( nextProps ) {
        return ( !this.props.isLoading && nextProps.isLoading ) || ( this.props.isLoading && !nextProps.isLoading );
    }

    showLoading = () => {
        this.placeholderSrc = '';
        this.artworkSrc = '';
        this.publishDate = 'Loading';
        this.title = '';
        this.artists = [];
        this.genres = [];
        this.tags = [];
    }

    showDetails = () => {
        const featuredImage = getFeaturedImage( this.props._embedded['wp:featuredmedia'] );
        this.placeholderSrc = getArtworkSrc( featuredImage, 'thumbnail' );
        this.artworkSrc = getArtworkSrc( featuredImage, 'medium' );
        this.publishDate = getPublishDate( this.props.date_gmt );
        this.title = this.props.title.rendered;
        this.artists = printTermNames( 'artist', this.props._embedded['wp:term'] );
        this.genres = filterTerms( 'genre', this.props._embedded['wp:term'] );
        this.tags = filterTerms( 'post_tag', this.props._embedded['wp:term'] );
    }
    
    render() {
        if( !this.props.id && !this.props.isLoading ) {
            return null;
        }
        if( this.props.isLoading ) {
            this.showLoading();
        } else {
            this.showDetails();
        }

        return (
            <ScrollPanel>
                <div className="mix-details">
                    <div className="artwork" style={{ backgroundImage : `url("${ this.placeholderSrc }")`, backgroundSize : 'cover' }}>
                        <img width="265" height="265" alt="" src={ this.artworkSrc } />
                    </div>
                    <div className="meta">
                        <div className="published"><span>{ this.publishDate }</span></div>
                        <div className="title"><span dangerouslySetInnerHTML={{ __html: this.title }}></span></div>
                        <div className="artists"><span dangerouslySetInnerHTML={{ __html: this.artists }}></span></div>
                    </div>
                    <div className="tax">
                        <span className="genres">{ spanLabelsFor( this.genres ) }</span>
                        <span className="tags">{ spanLabelsFor( this.tags ) }</span>
                    </div>
                </div>
            </ScrollPanel>
        );
    }
}
