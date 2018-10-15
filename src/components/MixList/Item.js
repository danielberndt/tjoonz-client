import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
      extractFirstElement
    , extractArtworkSrc
    , extractTermsByTaxonomy
} from '../../utils/extract';
import {
    toPublishDate
  , toTermNames
  , toTermSpanLabels
} from '../../utils/format';

export default class extends Component {
    render() {
        const featuredImage = extractFirstElement( this.props._embedded['wp:featuredmedia'] );
        const artworkSrc = extractArtworkSrc( featuredImage, 'thumbnail' );
        const publishDate = toPublishDate( this.props.date_gmt );
        const artists = extractTermsByTaxonomy( this.props._embedded['wp:term'], 'artist' );
        const genres = extractTermsByTaxonomy( this.props._embedded['wp:term'], 'genre' );
        const tags = extractTermsByTaxonomy( this.props._embedded['wp:term'], 'post_tag' );

        return (
            <div className="mix-list-item" onClick={ () => this.props.onClick( this.props.slug ) }>
                <div className="artwork">
                    <img width="34" height="34" alt="" src={ artworkSrc } />
                </div>
                <div className="controls">
                    <button onClick={ () => this.props.onPlay( this.props.id ) }><FontAwesomeIcon icon={[ 'far', 'play' ]} fixedWidth /></button>
                    <button><FontAwesomeIcon icon={[ 'far', 'layer-plus' ]} fixedWidth /></button>
                </div>
                <div className="artists">
                    <span dangerouslySetInnerHTML={{ __html: toTermNames( artists ) }}></span>
                </div>
                <div className="title">
                    <span dangerouslySetInnerHTML={{ __html: this.props.title.rendered }}></span>
                </div>
                <div className="labels">
                    { toTermSpanLabels( genres ) }
                    { toTermSpanLabels( tags ) }
                </div>
                <div className="published">
                    <span>{ publishDate }</span>
                </div>
            </div>
        );
    }
}
