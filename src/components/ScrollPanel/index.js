import React, { Component } from 'react';
import CustomScroll from 'react-custom-scroll';
import '../../../node_modules/react-custom-scroll/dist/customScroll.css';
import './style.css';

export default class extends Component {
    render() {
        return (
            <div className="panel-scroll">
                <CustomScroll heightRelativeToParent="100%">
                    <div className="panel-scroll-content">
                        { this.props.children }
                    </div>
                </CustomScroll>
            </div>
        );
    }
}
