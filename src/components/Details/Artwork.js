import React, { Component } from 'react';
import { extractArtworkSrc } from '../../utils/extract';

export default class extends Component {
    state = {
        artworkLoaded : false
    }

    render() {
        const { featuredImage } = this.props;
        const placeholderSrc = extractArtworkSrc( featuredImage, 'thumbnail' );
        const artworkSrc = extractArtworkSrc( featuredImage, 'medium' );

        return (
            <div className="artwork">
                <div className={ `placeholder ${ !this.state.artworkLoaded ? 'blur' : '' }`} style={{ backgroundImage : `url("${ placeholderSrc }")` }}>
                    <img width="280" height="280" alt="" src={ artworkSrc } onLoad={ this._artworkLoaded } />
                </div>
            </div>
        );
    }

    _artworkLoaded = () => {
        this.setState({
            artworkLoaded : true
        });
    }
};
