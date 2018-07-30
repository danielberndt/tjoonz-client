import React, { Component } from 'react';
import queryString from 'query-string';
import { parseFilterSegment } from '../helpers/filter';
import Filter from '../components/Filter';
import MixList from '../components/MixList';

export default class extends Component {
    constructor( props ) {
        super( props );
        const filter = this._parseFilter();
        this.state = {
            filter,
            results : []
        };
        const cleanRoute = this._filterRoute( filter );
        if( `${ this.props.location.pathname }${ this.props.location.search }` !== cleanRoute ) {
            this.props.history.replace( cleanRoute );
        }
    }

    componentDidMount() {
        this.getMixes( this._parseFilter() );
    }

    _parseFilter = () => {
        const filter = queryString.parse( this.props.location.search );
        Object.keys( filter ).forEach( key => {
            filter[ key ] = this.props.recognisedKeys.indexOf( key ) === -1 ? null : parseFilterSegment( filter[ key ] );
        });
        return filter;
    }

    filterChanged = ( key, changedId, checked, relation ) => {
        const filter = this._parseFilter();
        if( filter[ key ] ) {
            filter[ key ].and = relation;
            const ids = filter[ key ].ids;
            filter[ key ].ids = checked ? ids.concat( changedId ) : ids.filter( id => id !== changedId );    
        } else {
            filter[ key ] = {
                and : relation,
                ids : [ changedId ]
            };
        }
        this.props.history.replace( this._filterRoute( filter ));
        this.setState({ filter }, () => this.getMixes( this.state.filter ));
    }

    relationChanged = ( key, and ) => {
        const filter = this._parseFilter();
        if( filter[ key ] ) {
            filter[ key ].and = and;    
            this.props.history.replace( this._filterRoute( filter ));
            this.setState({ filter }, () => this.getMixes( this.state.filter ));
        }
    }

    _filterRoute = filter => {
        const filters = Object.keys( filter ).filter( key => filter[ key ] && filter[ key ].ids.length ).map( key => {
            const separator = filter[ key ].and ? ',' : '|';
            return `${ key }=${ filter[ key ].ids.join( separator ) }`;
        });
        return `/search${ filters.length ? '?' : '' }${ filters.join( '&' ) }`;
    }

    getMixes = filter => {
        const filters = Object.keys( filter ).filter( key => filter[ key ] && filter[ key ].ids.length ).map( key => {
            // Must use ',' separator for now, until I fix WP API to accept better taxonomy filters.
            // Using ',' will result in a fixed "or" relationship from WP. So, yeah. Not great.
            return `${ key }=${ filter[ key ].ids.join( ',' ) }`;
        });
        if( filters.length ) {
            // TEMPORARY FIX
            // todo: change taxonomy registration in WordPress so I can avoid this
            // filters.join( '&' ).replace( 'genres', 'genre' ).replace( 'artists', 'artist' )
            const url = `http://beta.tjoonz.com/wp-json/wp/v2/posts?_embed&per_page=10&page=1&${ filters.join( '&' ).replace( 'genres', 'genre' ).replace( 'artists', 'artist' ) }`;
            fetch( url ).then( response => response.json() ).then( results => this.setState({ results }));
        }
    }

    render() {
        return (
            <div className="layout layout-triple">
                <div className="wrap">
                    <div className="panel">
                        <Filter
                            filter={ this.state.filter }
                            onFilterChange={ this.filterChanged }
                            onRelationChange={ this.relationChanged }
                            { ...this.props }
                        />
                    </div>
                    <div className="panel">
                        { this.state.results.length ? <MixList mixes={ this.state.results } /> : null }
                    </div>
                    <div className="panel">
                        
                    </div>
                </div>
            </div>
        );
    }
}
