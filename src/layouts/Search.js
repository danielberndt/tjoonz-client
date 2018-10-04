import React, { Component } from 'react';
import StickyBox from 'react-sticky-box';
import { parseRoute, createRoute } from '../utils/filter';
import Filter from '../components/Filter';
import MixList from '../components/MixList';
import Details from '../components/Details';
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
        this.getMixes();
    }

    filterChanged = ( key, changedId, checked, relation ) => {
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
        this.resetPagination( query );
    }

    relationChanged = ( key, and ) => {
        const query = parseRoute( this.props.location.search, this.props.recognisedKeys );
        if( query[ key ] ) {
            query[ key ].and = and;    
            this.resetPagination( query );
        }
    }

    resetPagination = query => {
        const routePath = createRoute( query );
        this.props.history.replace( routePath );
        this.setState({
            query,
            page : 1
        }).then( this.getMixes );
    }

    getMixes = () => {
        this.setState({
            loadingMixes : true
        }).then( () => {
            const { query, page } = this.state;
            const segments = Object.keys( query ).filter( key => query[ key ] && query[ key ].ids.length ).map( key => {
                // Must use ',' separator for now, until I fix WP API to accept better taxonomy filters.
                // Using ',' will result in a fixed "or" relationship from WP. So, yeah. Not great.
                return `${ key }=${ query[ key ].ids.join( ',' ) }`;
            });
            let url;
            if( segments.length ) {
                // TEMPORARY FIX
                // @TODO: change taxonomy registration in WordPress so I can avoid this
                // segments.join( '&' ).replace( 'genres', 'genre' ).replace( 'artists', 'artist' )
                url = `${ process.env.REACT_APP_WPAPI_URL }/posts?_embed&per_page=${ constants.search.resultsPerPage }&page=${ page }&${ segments.join( '&' ).replace( 'genres', 'genre' ).replace( 'artists', 'artist' ) }`;
            } else {
                url = `${ process.env.REACT_APP_WPAPI_URL }/posts?_embed&per_page=${ constants.search.resultsPerPage }&page=${ page }`;
            }
            fetch( url ).then( response => response.json() ).then( results => {
                if( results.code === 'rest_post_invalid_page_number' ) {
                    this.setState({
                        loadingMixes : false,
                        exhausted    : true
                    });
                } else {
                    if( page === 1 ) {
                        window.scrollTo( 0, 0 );
                        this.repositionFilter();
                        this.setState({
                            results,
                            loadingMixes : false,
                            exhausted    : false
                        });
                    } else {
                        this.setState( prevState => {
                            return Object.assign( {}, prevState, {
                                results      : [ ...prevState.results, ...results ],
                                loadingMixes : false
                            });
                        });
                    }
                }
            }).catch( error => console.log( error ));
        });
    }

    getNextPage = () => {
        this.setState( prevState => ({
            page : prevState.page + 1
        })).then( this.getMixes );
    }

    getDetails = slug => {
        if( this.state.showDetailsFor !== slug ) {
            this.setState({
                showDetailsFor : slug
            });
        }
    }

    playMix = ( id, event ) => {
        this.props.onPlayMix( id );
    }

    // Recalculate StickyBox position with custom trigger
    // https://github.com/codecks-io/react-sticky-box/issues/16
    filterBoxRef = n => this.filterBox = n;
    repositionFilter = () => {
        setTimeout( () => {
            this.filterBox.latestScrollY = 1;
            this.filterBox.handleScroll();
            this.filterBox.latestScrollY = -1;
            this.filterBox.handleScroll();
        }, 20 );
    }

    // Recalculate StickyBox position with custom trigger
    // https://github.com/codecks-io/react-sticky-box/issues/16
    detailsBoxRef = n => this.detailsBox = n;
    repositionDetails = () => {
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
                    ref={ this.filterBoxRef } // https://github.com/codecks-io/react-sticky-box/issues/16
                    className="sidebar small"
                    offsetTop={ constants.sidebar.offset.top }
                    offsetBottom={ constants.sidebar.offset.bottom }
                >
                    <Filter
                        filter={ this.state.query }
                        onFilterChange={ this.filterChanged }
                        onRelationChange={ this.relationChanged }
                        onCollapse={ this.repositionFilter }
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
                        onScrollToBottom={ this.getNextPage }
                        onItemClick={ this.getDetails }
                        onItemPlay={ this.playMix }
                        onMounted={ this.getDetails }
                    />
                </section>
                <StickyBox
                    ref={ this.detailsBoxRef } // https://github.com/codecks-io/react-sticky-box/issues/16
                    className="sidebar medium"
                    offsetTop={ constants.sidebar.offset.top }
                    offsetBottom={ constants.sidebar.offset.bottom }
                >
                    <Details slug={ this.state.showDetailsFor } />
                </StickyBox>
            </div>
        );
    }
}
