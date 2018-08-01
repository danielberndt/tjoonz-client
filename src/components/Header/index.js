import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Dropdown from './Dropdown';
import './style.css';

export default class extends Component {
    render() {
        return (
            <div id="navigation">
                <div className="wrap">
                    <div className="left">
                        <NavLink className="logo" exact to="/">Tjoonz.com</NavLink>
                        <NavLink to="/chart">Charts</NavLink>
                        <NavLink to="/search">Search Music</NavLink>
                    </div>
                    <div className="right">
                        <NavLink to="/my">My Account</NavLink>
                        <NavLink to="/upload">Upload</NavLink>
                        <Dropdown>
                            <NavLink to="/about">About Tjoonz</NavLink>
                            <NavLink to="/about/uploading">About Uploading</NavLink>
                            <NavLink to="/about/contributing">Become an Editor</NavLink>
                            <NavLink to="/thanks">Special Thanks</NavLink>
                            <NavLink to="/privacy-policy">Privacy Policy</NavLink>
                            <NavLink to="/about/feedback">Feedback</NavLink>
                        </Dropdown>
                    </div>
                </div>
            </div>
        );
    }
}
