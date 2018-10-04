import React, { Component } from 'react';
import { getArtworkSrc } from '../../utils/metadata';

export default class extends Component {
    state = {
        artworkLoaded : false
    }

    render() {
        const { featuredImage } = this.props;
        const placeholderSrc = getArtworkSrc( featuredImage, 'thumbnail' );
        const artworkSrc = getArtworkSrc( featuredImage, 'medium' );

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
