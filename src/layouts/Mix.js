import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import StickyBox from 'react-sticky-box';
import Details from '../components/Details';
import Body from '../components/Body';
import Comments from '../components/Comments';
import constants from '../constants';

export default class extends Component {
    state = {
        data : null
    }

    render() {
        if( this.props.location.pathname.substr( -1 ) === '/' ) {
            return <Redirect to={ `${ this.props.location.pathname.substr( 0, this.props.location.pathname.length - 1 ) }` } />
        } else {
            return (
                <div className="wrap layout">
                    <StickyBox
                        className="sidebar medium"
                        offsetTop={ constants.sidebar.offset.top }
                        offsetBottom={ constants.sidebar.offset.bottom }
                    >
                        <Details
                            slug={ this.props.match.params.slug }
                            match={ this.props.match }
                            onPublish={ this._captureData }
                        />
                    </StickyBox>
                    <section className="main">
                        <Comments { ...this.state.data } />
                    </section>
                    <StickyBox
                        className="sidebar large"
                        offsetTop={ constants.sidebar.offset.top }
                        offsetBottom={ constants.sidebar.offset.bottom }
                    >
                        <Body { ...this.state.data } />
                    </StickyBox>
                </div>
            );
        }
    }

    _captureData = data => {
        this.setState({ data });
    }
}
