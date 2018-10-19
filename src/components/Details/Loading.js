import React, {Component} from "react";
import Backlink from "./Backlink";
import "./style.css";

export default class extends Component {
  render() {
    return (
      <aside>
        <div className="mix-details">
          <div className="artwork" />
          <div className="controls">
            <button className="play" disabled>
              <span>Play</span>
            </button>
            <button className="queue" disabled>
              <span>Queue</span>
            </button>
            <button className="download" disabled>
              <span>Download</span>
            </button>
          </div>
          <Backlink slug={this.props.match.params.slug} />
          <div className="meta">
            <div className="published">
              <div className="header">Published</div>
            </div>
            <div className="artists">
              <div className="header">Artists</div>
            </div>
            <div className="title">
              <div className="header">Title</div>
            </div>
            <div className="genres">
              <div className="header">Genres</div>
            </div>
            <div className="tags">
              <div className="header">Tags</div>
            </div>
            <div className="duration">
              <div className="header">Duration</div>
            </div>
            <div className="description">Loading&hellip;</div>
            <div className="stats">
              <span>&hellip;</span>
              &nbsp;
              <span>&hellip;</span>
              &nbsp;
              <span>
                &hellip; <small>kbps</small>
              </span>
              &nbsp;
              <span>
                &hellip; <small>MB</small>
              </span>
            </div>
          </div>
        </div>
      </aside>
    );
  }
}
