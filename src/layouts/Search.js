import React, { Component } from 'react';
import { parseRoute, createRoute } from '../helpers/filter';
import Filter from '../components/Filter';
import MixList from '../components/MixList';
import Details from '../components/Details';

export default class extends Component {
    constructor( props ) {
        super( props );
        const query = parseRoute( this.props.location.search, this.props.recognisedKeys );
        this.state = {
            query,
            page           : 1,
            results        : [],
            details        : {
                id : 0
            },
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
                // todo: change taxonomy registration in WordPress so I can avoid this
                // segments.join( '&' ).replace( 'genres', 'genre' ).replace( 'artists', 'artist' )
                url = `http://beta.tjoonz.com/wp-json/wp/v2/posts?_embed&per_page=10&page=${ page }&${ segments.join( '&' ).replace( 'genres', 'genre' ).replace( 'artists', 'artist' ) }`;
            } else {
                url = `http://beta.tjoonz.com/wp-json/wp/v2/posts?_embed&per_page=10&page=${ page }`;
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

    getDetails = id => {
        this.setState({
            loadingDetails : true
        }).then( () => {
            fetch( `http://beta.tjoonz.com/wp-json/wp/v2/posts/${ id }?_embed` )
                .then( response => response.json() )
                .then( details => this.setState({
                    details,
                    loadingDetails : false
                }));
        });
    }

    playMix = ( id, event ) => {
        if( this.state.details.id === id ) {
            event.stopPropagation(); // prevents triggering getDetails
        }
    }

    render() {
        return (
            <div className="layout layout-triple">
                <div className="wrap">
                    <div className="panel">
                        <Filter
                            filter={ this.state.query }
                            onFilterChange={ this.filterChanged }
                            onRelationChange={ this.relationChanged }
                            { ...this.props }
                        />
                    </div>
                    <div className="panel">
                        { this.state.results.length ? <MixList mixes={ this.state.results } onScrollToBottom={ this.getNextPage } isLoading={ this.state.loadingMixes } isExhausted={ this.state.exhausted } page={ this.state.page } onItemClick={ this.getDetails } onItemPlay={ this.playMix } /> : null }
                    </div>
                    <div className="panel">
                        <Details { ...this.state.details } isLoading={ this.state.loadingDetails } />
                    </div>
                </div>
            </div>
        );
    }
}
