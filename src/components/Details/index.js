import React, { Component } from 'react';
import Details from './Details';
import { getMixBySlug, extractMixData } from '../../utils/metadata';
import './style.css';

export default class extends Component {
    _request = null;
    _slug = null;
    state = {
        prevSlug : 0,
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
        this._getMixData( this.props.slug );
    }

    componentDidUpdate( prevProps, prevState ) {
        if( this.state.data === null && !this._currentId ) {
            this._getMixData( this.props.slug );
        }
    }

    componentWillUnmount() {
        this._request = null;
    }

    render() {
        if( this.state.data === null ) {
            return <div>Loading...</div>;
        } else {
            return <Details { ...this.state.data } />;
        }
    }

    _getMixData( slug ) {
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
};
