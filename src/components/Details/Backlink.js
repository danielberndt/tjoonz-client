import React, {Component} from "react";
import {NavLink} from "react-router-dom";
import "./style.css";

export default class extends Component {
  render() {
    const {slug} = this.props;
    if (window.location.pathname === `/mix/${slug}`) {
      return null;
    } else {
      return (
        <div className="controls">
          <NavLink className="tracklist" to={`/mix/${slug}`}>
            <span>Tracklist and Comments</span>
          </NavLink>
        </div>
      );
    }
  }
}
