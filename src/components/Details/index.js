import React, { Component } from 'react';
import Details from './Details';
import Loading from './Loading';
import { fetchMixBySlug } from '../../utils/fetch';
import { extractMixData } from '../../utils/Mix';
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
        if( !data ) {
            this._getMixData( this.props.slug );
        } else {
            this.setState({ data });
        }
    }

    componentDidUpdate( prevProps, prevState ) {
        if( this.state.data === null ) {
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
        this._request = fetchMixBySlug( slug ).then( mix => {
            if( this._slug === slug ) {
                const data = extractMixData( mix );
                this._request = null;
                this.setState({ data });
            }
        });
    }
};
