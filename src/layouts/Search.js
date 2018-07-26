import React, { Component } from 'react';
import queryString from 'query-string';
import { parseFilterSegment } from '../helpers/filter';
import Filter from '../components/Filter';

export default class extends Component {
    constructor( props ) {
        super( props );
        this.state = {
            filter : this._parseFilter()
        };
    }

    _parseFilter = () => {
        const filter = queryString.parse( this.props.location.search );
        Object.keys( filter ).forEach( key => {
            filter[ key ] = parseFilterSegment( filter[ key ] );
        });
        return filter;
    }

    filterChanged = ( taxonomy, changedId, checked, relation ) => {
        const filter = this._parseFilter();
        if( filter[ taxonomy ] ) {
            filter[ taxonomy ].and = relation;
            const ids = filter[ taxonomy ].ids;
            filter[ taxonomy ].ids = checked ? ids.concat( changedId ) : ids.filter( id => id !== changedId );    
        } else {
            filter[ taxonomy ] = {
                and : relation,
                ids : [ changedId ]
            };
        }
        this.props.history.push( this._filterRoute( filter ));
        this.setState({ filter });
    }

    relationChanged = ( taxonomy, and ) => {
        const filter = this._parseFilter();
        if( filter[ taxonomy ] ) {
            filter[ taxonomy ].and = and;    
            this.props.history.push( this._filterRoute( filter ));
            this.setState({ filter });
        }
    }

    _filterRoute = filter => {
        const filters = Object.keys( filter ).filter( key => filter[ key ].ids.length ).map( key => {
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
