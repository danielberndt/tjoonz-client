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
import './style.css';

export default class extends Component {
    constructor( props ) {
        super( props );
        this.state = {
            blur : true
        };
        this.showLoading();
    }
    
    shouldComponentUpdate( nextProps, nextState ) {
        return ( !this.props.isLoading && nextProps.isLoading ) || ( this.props.isLoading && !nextProps.isLoading ) || ( this.state.blur  && !nextState.blur );
    }

    showLoading = () => {
        this.placeholderSrc = '';
        this.artworkSrc = '';
        this.publishDate = '';
        this.title = '';
        this.artists = [];
        this.genres = [];
        this.tags = [];
        this.setState({
            blur : true
        });
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

    revealArtwork = () => {
        this.setState({
            blur : false
        });
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
            <aside>
                <div className="mix-details">
                    <div className="artwork">
                        <div className={ this.state.blur ? 'blur' : 'clear' } style={{ backgroundImage : `url("${ this.placeholderSrc }")` }}>
                            <img width="280" height="280" alt="" src={ this.artworkSrc } onLoad={ this.revealArtwork } />
                        </div>
                    </div>
                    <div className="actions">
                        <button className="primary">
                            <FontAwesomeIcon icon={[ 'far', 'list-ol' ]} fixedWidth /> Tracklist
                        </button>
                        <button className="secondary">
                            <FontAwesomeIcon icon={[ 'far', 'play' ]} fixedWidth /> Play
                        </button>
                        <button className="secondary">
                            <FontAwesomeIcon icon={[ 'far', 'layer-plus' ]} fixedWidth /> Queue
                        </button>
                    </div>
                    <div className="meta">
                        <div className="published">
                            <div className="header">Published</div>
                            <div>{ this.publishDate }</div>
                        </div>
                        <div className="artists">
                            <div className="header">Artists</div>
                            <div dangerouslySetInnerHTML={{ __html: this.artists }}></div>
                        </div>
                        <div className="title">
                            <div className="header">Title</div>
                            <div dangerouslySetInnerHTML={{ __html: this.title }}></div>
                        </div>
                        <div className="genres">
                            <div className="header">Genres</div>
                            <div>{ spanLabelsFor( this.genres ) }</div>
                        </div>
                        <div className="tags">
                            <div className="header">Tags</div>
                            <div>{ spanLabelsFor( this.tags ) }</div>
                        </div>
                    </div>
                </div>
            </aside>
        );
    }
}
