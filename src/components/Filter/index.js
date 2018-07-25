import React, { Component } from 'react';
import ReactAutocomplete from 'react-autocomplete';
import Item from './Item';
import ScrollPanel from '../ScrollPanel';
import './style.css';

export default class extends Component {
    constructor( props ) {
        super( props );
        this.state = {
            loading : true,
            andRelation : {
                genres : true,
                artists : true,
                tags : false
            },
            filters : {
                genre      : [], // `genre` is singular because of WordPress taxonomy registration
                artist     : [], // `artist` is singular because of WordPress taxonomy registration
                tags       : [],
                dateRanges : [],
                orderBy    : {
                    'post_date'       : 'Publish date',
                    'title'           : 'Mix title',
                    '_tjnz_score'     : 'Score',
                    '_tjnz_plays'     : 'Plays',
                    '_tjnz_downloads' : 'Downloads',
                    '_tjnz_comments'  : 'Comments',
                    '_tjnz_duration'  : 'Duration',
                    '_tjnz_bitrate'   : 'Audio quality',
                    '_tjnz_filesize'  : 'File size'
                }
            }
        };
    }

    componentDidMount() {
        const genres = this.loadAvailableFilters( 'genre', 10 );
        const artists = this.loadAvailableFilters( 'artist', 10 );
        //const tags = this.loadFilters( 'tags', 10 );
        Promise.all([ genres], artists)//, tags ])
            .then( () => this.setState({ loading : false }));
    }

    loadAvailableFilters = ( filter, top = 10 ) => {
        return fetch( `http://beta.tjoonz.com/wp-json/wp/v2/${ filter }?per_page=${ top }&page=1&orderby=count&order=desc` )
            .then( response => response.json() )
            .then( exclude => this._fetchPage( filter, 1, exclude.map( term => term.id ) ).then( list => {
                this.setState({
                    filters : Object.assign( {}, this.state.filters, {[ filter ] : [ ...exclude, ...list ] })
                })
            }))
        ;
    }

    _fetchPage = ( filter, page, exclude = [] ) => {
        return fetch( `http://beta.tjoonz.com/wp-json/wp/v2/${ filter }?per_page=100&page=${ page++ }&orderby=name&order=asc${ exclude.length > 0 ? `&exclude=${ exclude.join( ',' ) }` : '' }` )
            .then( response => response.json() )
            .then( currentPage => currentPage.length === 0 ? currentPage : this._fetchPage( filter, page, exclude ).then( nextPage => [ ...currentPage, ...nextPage ] ));
    }

    relationChanged = taxonomy => {
        const relation = !this.state.andRelation[ taxonomy ];
        this.setState({
            andRelation : Object.assign( {}, this.state.andRelation, {[ taxonomy ] : relation })
        }, () => this.props.onRelationChange( taxonomy, relation ) );
    }
    
    filterChanged = ( taxonomy, changedId, checked ) => {
        this.props.onFilterChange( taxonomy, changedId, checked, this.state.andRelation )
    }

    render() {
        return (
            <ScrollPanel>
                <div className="filters">
                    <big>Artists</big>
                </div>
                <div className="filters">
                    <big>Genres</big>
                    <label><input type="checkbox" checked={ this.state.andRelation.genres } onChange={ () => this.relationChanged( 'genres' ) } /> AND</label>
                    {
                        this.state.filters.genre.map( ( filter, index ) => <Item key={ index }
                                                                                 id={ filter.id }
                                                                                 name={ filter.name }
                                                                                 count={ filter.count }
                                                                                 active={ Boolean( this.props.filter.genres ) && Boolean( this.props.filter.genres.ids.indexOf( filter.id ) !== -1 )}
                                                                                 onToggle={ this.filterChanged } /> )
                    }
                </div>
                <div className="filters">
                    <big>Tags</big>
                </div>
            </ScrollPanel>
        );
    }
}
