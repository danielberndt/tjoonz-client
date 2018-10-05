import React, { Component } from 'react';
import Details from './Details';
import Loading from './Loading';
import { getMixBySlug, extractMixData } from '../../utils/metadata';
import './style.css';

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
        const { data } = this.props;
        if( data === null ) {
            this._getMixData( this.props.slug );
        } else {
            this.setState({ data });
        }
    }

    componentDidUpdate( prevProps, prevState ) {
        if( this.state.data === null ) {
            console.log( "getting after updating" );
            this._getMixData( this.props.slug );
        }
    }

    componentWillUnmount() {
        this._request = null;
    }

    render() {
        if( this.state.data === null ) {
            return <Loading match={ this.props.match } />;
        } else {
            return <Details { ...this.state.data } />;
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
                this._publishMixData( data );
            }
        });
    }

    _publishMixData = data => {
        if( this.props.onPublish ) {
            this.props.onPublish( data );
        }
    }
};
