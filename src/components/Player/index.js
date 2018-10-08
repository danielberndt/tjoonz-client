import React, { Component } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './style.css';

export default class extends Component {
    state = {
        isPlaying : false
    }

    handlePlay = () => {
        if( this.state.isPlaying ) {
            this.htmlMediaElement.pause();
        } else {
            this.htmlMediaElement.play();
        }
    }

    render() {
        return (
            <div id="player">
                <ReactAudioPlayer
                    ref={ reactAudioPlayer => reactAudioPlayer ? this.htmlMediaElement = reactAudioPlayer.audioEl : null }
                    src="/test.mp3"
                    onPlay={ () => this.setState({ isPlaying : true }) }
                    onPause={ () => this.setState({ isPlaying : false }) }
                />
                <button className="prev">
                    <FontAwesomeIcon icon={[ 'fal', 'step-backward' ]} fixedWidth />
                </button>
                <button className="play" onClick={ this.handlePlay }>
                    <FontAwesomeIcon icon={[ 'fal', this.state.isPlaying ? 'pause' : 'play' ]} fixedWidth />
                </button>
                <button className="next">
                    <FontAwesomeIcon icon={[ 'fal', 'step-forward' ]} fixedWidth />
                </button>
                <button className="volume">
                    <FontAwesomeIcon icon={[ 'fal', 'volume' ]} fixedWidth />
                </button>
                <button className="tracklist">
                    <FontAwesomeIcon icon={[ 'fal', 'list-ol' ]} fixedWidth />
                </button>
            </div>
        );
    }
}
