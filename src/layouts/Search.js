import React, { Component } from 'react';
import queryString from 'query-string';
import { parseFilterSegment } from '../helpers/filter';
import Filter from '../components/Filter';

export default class extends Component {
    constructor( props ) {
        super( props );
        const filter = this._parseFilter();
        this.state = { filter };
        const cleanRoute = this._filterRoute( filter );
        if( `${ this.props.location.pathname }${ this.props.location.search }` !== cleanRoute ) {
            this.props.history.replace( cleanRoute );
        }
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
        this.setState({ filter });
    }

    relationChanged = ( key, and ) => {
        const filter = this._parseFilter();
        if( filter[ key ] ) {
            filter[ key ].and = and;    
            this.props.history.replace( this._filterRoute( filter ));
            this.setState({ filter });
        }
    }

    _filterRoute = filter => {
        const filters = Object.keys( filter ).filter( key => filter[ key ] && filter[ key ].ids.length ).map( key => {
            const separator = filter[ key ].and ? ',' : '|';
            return `${ key }=${ filter[ key ].ids.join( separator ) }`;
        });
        return `/search${ filters.length ? '?' : '' }${ filters.join( '&' ) }`;
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
                    
                    </div>
                    <div className="panel">
                        
                    </div>
                </div>
            </div>
        );
    }
}
