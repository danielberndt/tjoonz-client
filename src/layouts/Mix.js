import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import StickyBox from 'react-sticky-box';
import Details from '../components/Details';
import Body from '../components/Body';
import Comments from '../components/Comments';
import { getMixBySlug, extractMixData } from '../utils/metadata';
import constants from '../constants';

export default class extends Component {
    _request = null;
    _slug = null;
    state = {
        prevSlug : null,
        data     : null
    }

    static getDerivedStateFromProps( nextProps, prevState ) {
        if( nextProps.slug !== prevState.prevSlug ) {
            return {
                prevSlug : nextProps.slug,
                data     : null
            };
        }

        return null;
    }

    componentDidMount() {
        this._getMixData( this.props.match.params.slug );
    }

    componentDidUpdate( prevProps, prevState ) {
        if( this.state.data === null ) {
            this._getMixData( this.props.match.params.slug );
        }
    }

    componentWillUnmount() {
        this._request = null;
    }

    render() {
        if( this.props.location.pathname.substr( -1 ) === '/' ) {
            return <Redirect to={ `${ this.props.location.pathname.substr( 0, this.props.location.pathname.length - 1 ) }` } />
        } else {
            if( !this.state.data ) {
                return <div>Loading&hellip;</div>;
            } else {
                return (
                    <div className="wrap layout">
                        <StickyBox
                            className="sidebar medium"
                            offsetTop={ constants.sidebar.offset.top }
                            offsetBottom={ constants.sidebar.offset.bottom }
                        >
                            <Details
                                data={ this.state.data }
                                slug={ this.props.match.params.slug }
                                match={ this.props.match }
                                onPublish={ this._captureData }
                            />
                        </StickyBox>
                        <section className="main">
                            <Body { ...this.state.data } />
                        </section>
                        <StickyBox
                            className="sidebar large"
                            offsetTop={ constants.sidebar.offset.top }
                            offsetBottom={ constants.sidebar.offset.bottom }
                        >
                            <Comments { ...this.state.data } />
                        </StickyBox>
                    </div>
                );
            }
        }
    }

    _getMixData = slug => {
        if( slug === this._slug ) return;

        this._slug = slug;
        this._request = getMixBySlug( slug ).then( mix => {
            if( this._slug === slug ) {
                const data = extractMixData( mix );
                this._request = null;
                this.setState({ data });
            }
        });
    }
}
