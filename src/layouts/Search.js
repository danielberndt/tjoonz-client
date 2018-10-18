import React, { Component } from 'react';
import StickyBox from 'react-sticky-box';
import Filter from '../components/Filter';
import MixList from '../components/MixList';
import Details from '../components/Details';
import { parseRoute, createRoute } from '../utils/Search';
import { fetchMixesByQuery } from '../utils/fetch';
import constants from '../constants';

export default class extends Component {
    constructor( props ) {
        super( props );
        const query = parseRoute( this.props.location.search, this.props.recognisedKeys );
        this.state = {
            query,
            page           : 1,
            results        : [],
            showDetailsFor : null,
            loadingMixes   : true,
            loadingDetails : false,
            exhausted      : false
        };
        const cleanRoute = createRoute( query );
        if( `${ this.props.location.pathname }${ this.props.location.search }` !== cleanRoute ) {
            this.props.history.replace( cleanRoute );
        }
    }

    /**
     * Makes setState thenable, which might be considered anti-pattern.
     * See: https://github.com/facebook/react/issues/2642
     */
    setState( state, callback = () => {} ) {
        return new Promise(( resolve, reject ) => {
            super.setState( state, () => {
                if( typeof callback !== 'function' ) {
                    reject( `${ callback } is not a function` );
                } else {
                    resolve( callback() );
                }
            });
        });
    }

    componentDidMount() {
        this._getMixes();
    }

    _filterChanged = ( key, changedId, checked, relation ) => {
        const query = parseRoute( this.props.location.search, this.props.recognisedKeys );
        if( query[ key ] ) {
            query[ key ].and = relation;
            const ids = query[ key ].ids;
            query[ key ].ids = checked ? ids.concat( changedId ) : ids.filter( id => id !== changedId );    
        } else {
            query[ key ] = {
                and : relation,
                ids : [ changedId ]
            };
        }
        this._resetPagination( query );
    }

    _relationChanged = ( key, and ) => {
        const query = parseRoute( this.props.location.search, this.props.recognisedKeys );
        if( query[ key ] ) {
            query[ key ].and = and;    
            this._resetPagination( query );
        }
    }

    _resetPagination = query => {
        const routePath = createRoute( query );
        this.props.history.replace( routePath );
        this.setState({
            query,
            page : 1
        }).then( this._getMixes );
    }

    _getMixes = () => {
        this.setState({
            loadingMixes : true
        }).then( async () => {
            const { page, query } = this.state;
            const options = Object.keys( query ).filter( key => query[ key ] && query[ key ].ids.length ).reduce(( prev, key ) => {
                // @TODO
                // Must use ',' separator for now, until I fix WP API to accept better taxonomy filters.
                // Using ',' will result in a fixed "or" relationship from WP. So, yeah. Not great.
                return Object.assign( prev, { [ key ] : query[ key ].ids.join( ',' ) } )
            }, {});
            const results = await fetchMixesByQuery( page, options );
            if( page === 1 ) {
                window.scrollTo( 0, 0 );
                this._repositionFilter();
                this._repositionDetails();
                this.setState({
                    results,
                    loadingMixes : false,
                    exhausted    : false
                });
            } else {
                this.setState( prevState => Object.assign( {}, prevState, {
                    results      : [ ...prevState.results, ...results ],
                    loadingMixes : false
                }));
            }
        });
    }

    _getNextPage = () => {
        this.setState( prevState => ({
            page : prevState.page + 1
        })).then( this._getMixes );
    }

    _getDetails = slug => {
        if( this.state.showDetailsFor !== slug ) {
            this._repositionDetails();
            this.setState({
                showDetailsFor : slug
            });
        }
    }

    _playMix = ( id, event ) => {
        this.props.onPlayMix( id );
    }

    // Recalculate StickyBox position with custom trigger
    // https://github.com/codecks-io/react-sticky-box/issues/16
    _filterBoxRef = n => this.filterBox = n;
    _repositionFilter = () => {
        setTimeout( () => {
            this.filterBox.latestScrollY = 1;
            this.filterBox.handleScroll();
            this.filterBox.latestScrollY = -1;
            this.filterBox.handleScroll();
        }, 20 );
    }

    // Recalculate StickyBox position with custom trigger
    // https://github.com/codecks-io/react-sticky-box/issues/16
    _detailsBoxRef = n => this.detailsBox = n;
    _repositionDetails = () => {
        setTimeout( () => {
            this.detailsBox.latestScrollY = 1;
            this.detailsBox.handleScroll();
            this.detailsBox.latestScrollY = -1;
            this.detailsBox.handleScroll();
        }, 20 );
    }

    render() {
        return (
            <div className="wrap layout">
                <StickyBox
                    ref={ this._filterBoxRef } // https://github.com/codecks-io/react-sticky-box/issues/16
                    className="sidebar small"
                    offsetTop={ constants.sidebar.offset.top }
                    offsetBottom={ constants.sidebar.offset.bottom }
                >
                    <Filter
                        filter={ this.state.query }
                        onFilterChange={ this._filterChanged }
                        onRelationChange={ this._relationChanged }
                        onCollapse={ this._repositionFilter }
                        { ...this.props }
                    />
                </StickyBox>
                <section className="main">
                    <MixList
                        mixes={ this.state.results }
                        page={ this.state.page }
                        history={ this.props.history }
                        isLoading={ this.state.loadingMixes }
                        isExhausted={ this.state.exhausted }
                        onScrollToBottom={ this._getNextPage }
                        onItemClick={ this._getDetails }
                        onItemPlay={ this._playMix }
                        onMounted={ this._getDetails }
                    />
                </section>
                <StickyBox
                    ref={ this._detailsBoxRef } // https://github.com/codecks-io/react-sticky-box/issues/16
                    className="sidebar medium"
                    offsetTop={ constants.sidebar.offset.top }
                    offsetBottom={ constants.sidebar.offset.bottom }
                >
                    <Details
                        slug={ this.state.showDetailsFor }
                        match={ this.props.match }
                    />
                </StickyBox>
            </div>
        );
    }
}
