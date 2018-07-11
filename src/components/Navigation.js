import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export default class extends Component {
    render() {
        return (
            <div id="navigation">
                <ul>
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/mix/test-slug-2018/">Some Test Mix</NavLink></li>
                    <li><NavLink to="/search">Search</NavLink></li>
                    <li><NavLink to="/chart">Chart Page</NavLink></li>
                    <li><NavLink to="/my">My Account</NavLink></li>
                    <li><NavLink to="/about">About</NavLink></li>
                </ul>
            </div>
        );
    }
}
