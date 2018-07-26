import React, { Component } from 'react';
import Autocomplete from './Autocomplete';
import Item from './Item';
import ScrollPanel from '../ScrollPanel';
import './style.css';

export default class extends Component {
    constructor( props ) {
        super( props );
        this.state = {
            loading : true,
            genresHidden : true,
            autocomplete : {
                artists : '',
                tags    : ''
            },
            andRelation : {
                genres  : this.props.filter.genres ? this.props.filter.genres.and : true,
                artists : this.props.filter.artists ? this.props.filter.artists.and : true,
                tags    : this.props.filter.tags ? this.props.filter.tags.and : false
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
        const tags = this.loadAvailableFilters( 'tags', 10 );
        Promise.all([ genres, artists, tags ])
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
        this.props.onFilterChange( taxonomy, changedId, checked, this.state.andRelation[ taxonomy ] )
    }

    renderActiveFilters = ( taxonomy, activeIds ) => {
        if( !this.state.loading ) {
            return this.state.filters[ taxonomy ]
                .filter( item => activeIds.includes( item.id ) )
                .map( item => <Item taxonomy={ taxonomy }
                    key={ `${ taxonomy }-${ item.id }` }
                    id={ item.id }
                    name={ item.name }
                    count={ item.count }
                    active={ true }
                    onToggle={ this.filterChanged } /> )
        } else {
            return activeIds.map( item => <div key={ `${ taxonomy }-${ item }` } className="filter-item loading">&hellip;</div> );
        }
    }

    render() {
        const activeArtists = this.props.filter.artists ? this.props.filter.artists.ids : [];
        const activeTags = this.props.filter.tags ? this.props.filter.tags.ids : [];
        return (
            <ScrollPanel>
                <div className="filters">
                    <big>Artists</big>
                    <label><input type="checkbox" checked={ this.state.andRelation.artists } onChange={ () => this.relationChanged( 'artists' ) } /> ALL / ANY</label>
                    <Autocomplete
                        loading={ this.state.loading }
                        taxonomy="artists"
                        available={ this.state.filters.artist }
                        active={ activeArtists }
                        onFilterChange={ this.filterChanged }
                    />
                    {
                        this.renderActiveFilters( 'artist', activeArtists )
                    }
                </div>
                <div className="filters">
                    <big>Tags</big>
                    <label><input type="checkbox" checked={ this.state.andRelation.tags } onChange={ () => this.relationChanged( 'tags' ) } /> ALL / ANY</label>
                    <Autocomplete
                        loading={ this.state.loading }
                        taxonomy="tags"
                        available={ this.state.filters.tags }
                        active={ this.props.filter.tags ? this.props.filter.tags.ids : [] }
                        onFilterChange={ this.filterChanged }
                    />
                    {
                        this.renderActiveFilters( 'tags', activeTags )
                    }
                </div>
                <div className="filters">
                    <big>Genres</big>
                    <label><input type="checkbox" checked={ this.state.andRelation.genres } onChange={ () => this.relationChanged( 'genres' ) } /> ALL / ANY</label>
                    {
                        this.state.loading ? null : this.state.filters.genre
                            .slice( 0, 10 )
                            .map( genre => <Item taxonomy="genres"
                                                 key={ `genre-${ genre.id }` }
                                                 id={ genre.id }
                                                 name={ genre.name }
                                                 count={ genre.count }
                                                 active={ Boolean( this.props.filter.genres ) && Boolean( this.props.filter.genres.ids.indexOf( genre.id ) !== -1 )}
                                                 onToggle={ this.filterChanged } /> )
                    }
                    <div className={ this.state.genresHidden ? 'hidden' : '' }>
                        {
                            this.state.loading ? null : this.state.filters.genre
                                .slice( 10 )
                                .map( genre => <Item taxonomy="genres"
                                                     key={ `genre-${ genre.id }` }
                                                     id={ genre.id }
                                                     name={ genre.name }
                                                     count={ genre.count }
                                                     active={ Boolean( this.props.filter.genres ) && Boolean( this.props.filter.genres.ids.indexOf( genre.id ) !== -1 )}
                                                     onToggle={ this.filterChanged } /> )
                        }
                    </div>
                    {
                        this.state.loading ? null : <button className="expand" onClick={ () => this.setState({ genresHidden : !this.state.genresHidden }) }>Show { this.state.genresHidden ? 'all' : 'less' } genres</button>
                    }
                </div>
            </ScrollPanel>
        );
    }
}
