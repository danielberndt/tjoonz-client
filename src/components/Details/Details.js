import React, {Component} from "react";
import Artwork from "./Artwork";
import Backlink from "./Backlink";
import Title from "./Title";
import Description from "./Description";
import {toTermSpanLabels} from "../../utils/format";
import "./style.css";

export default class extends Component {
  render() {
    const {
      slug,
      description,
      title,
      artists,
      genres,
      tags,
      publishDate,
      featuredImage,
      plays,
      downloads,
      duration,
      quality,
      fileSize,
    } = this.props;

    return (
      <aside>
        <div
          className={`mix-details ${window.location.pathname === `/mix/${slug}` ? "" : "nowrap"}`}
        >
          <Artwork featuredImage={featuredImage} />
          <div className="controls">
            <button className="play">
              <span>Play</span>
            </button>
            <button className="queue">
              <span>Queue</span>
            </button>
            <button className="download">
              <span>Download</span>
            </button>
          </div>
          <Backlink slug={slug} />
          <div className="meta">
            <div className="published">
              <div className="header">Published</div>
              <div>{publishDate}</div>
            </div>
            <div className="artists">
              <div className="header">Artists</div>
              <div dangerouslySetInnerHTML={{__html: artists}} />
            </div>
            <Title {...{title, slug}} />
            <div className="genres">
              <div className="header">Genres</div>
              <div>{toTermSpanLabels(genres)}</div>
            </div>
            <div className="tags">
              <div className="header">Tags</div>
              <div>{toTermSpanLabels(tags)}</div>
            </div>
            <div className="duration">
              <div className="header">Duration</div>
              <div>{duration}</div>
            </div>
            <Description {...{description, slug}} />
            <div className="stats">
              <span> {plays}</span>
              &nbsp;
              <span> {downloads}</span>
              &nbsp;
              <span>
                {" "}
                {quality} <small>kbps</small>
              </span>
              &nbsp;
              <span>
                {" "}
                {fileSize} <small>MB</small>
              </span>
            </div>
          </div>
        </div>
      </aside>
    );
  }
}
