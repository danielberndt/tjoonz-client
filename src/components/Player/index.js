import React, {Component} from "react";
import ReactAudioPlayer from "react-audio-player";
import "./style.css";

export default class extends Component {
  state = {
    isPlaying: false,
  };

  handlePlay = () => {
    if (this.state.isPlaying) {
      this.htmlMediaElement.pause();
    } else {
      this.htmlMediaElement.play();
    }
  };

  render() {
    return (
      <div id="player">
        <ReactAudioPlayer
          ref={reactAudioPlayer =>
            reactAudioPlayer ? (this.htmlMediaElement = reactAudioPlayer.audioEl) : null
          }
          src="/test.mp3"
          onPlay={() => this.setState({isPlaying: true})}
          onPause={() => this.setState({isPlaying: false})}
        />
        <button className="prev">back</button>
        <button className="play" onClick={this.handlePlay}>
          pause/play
        </button>
        <button className="next">for</button>
        <button className="volume">vol</button>
        <button className="tracklist">track</button>
      </div>
    );
  }
}
