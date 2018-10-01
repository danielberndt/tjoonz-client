import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchPage } from '../../utils/filter';
import Autocomplete from './Autocomplete';
import Item from './Item';
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
                genres     : [],
                artists    : [],
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
        const g = this.loadAvailableFilters( 'genres', 'genre', 10 );
        const a = this.loadAvailableFilters( 'artists', 'artist', 10 );
        const t = this.loadAvailableFilters( 'tags', 'tags', 10 );
        Promise.all([ g, a, t ]).then( () => this.setState({ loading : false }));
    }

    loadAvailableFilters = ( key, endpoint, top = 10 ) => {
        return fetch( `${ process.env.REACT_APP_WPAPI_URL }/${ endpoint }?per_page=${ top }&page=1&orderby=count&order=desc` )
            .then( response => response.json() )
            .then( exclude => fetchPage( endpoint, 1, 100, true, exclude.map( term => term.id ) ).then( list => {
                this.setState({
                    filters : Object.assign( {}, this.state.filters, {[ key ] : [ ...exclude, ...list ] })
                })
            }))
        ;
    }

    relationChanged = key => {
        const relation = !this.state.andRelation[ key ];
        this.setState({
            andRelation : Object.assign( {}, this.state.andRelation, {[ key ] : relation })
        }, () => this.props.onRelationChange( key, relation ) );
    }
    
    filterChanged = ( key, changedId, checked ) => {
        this.props.onFilterChange( key, changedId, checked, this.state.andRelation[ key ] )
    }

    renderActiveFilters = ( key, activeIds ) => {
        if( !this.state.loading ) {
            return this.state.filters[ key ]
                .filter( item => activeIds.includes( item.id ) )
                .map( item => <Item
                    key={ `${ key }-${ item.id }` }
                    filterKey={ key }
                    id={ item.id }
                    name={ item.name }
                    count={ item.count }
                    active={ true }
                    onToggle={ this.filterChanged } /> )
        } else {
            return activeIds.map( item => <div key={ `${ key }-${ item }` } className="filter-item loading">&hellip;</div> );
        }
    }

    expandButton = () => {
        if( this.state.loading ) {
            return null;
        } else {
            if( this.state.genresHidden ) {
                return (
                    <button
                        className="expand"
                        onClick={ () => this.setState({ genresHidden : false }, () => {
                            if( this.state.genresHidden ) {
                                this.props.onCollapse();
                            }
                        }) }
                    >
                        <FontAwesomeIcon icon={[ 'far', 'caret-square-down' ]} fixedWidth /> <span>Show all genres</span>
                    </button>
                );
            } else {
                return (
                    <button
                        className="expand"
                        onClick={ () => this.setState({ genresHidden : true }, () => this.props.onCollapse() ) }
                    >
                        <FontAwesomeIcon icon={[ 'far', 'caret-square-up' ]} fixedWidth /> <span>Show less genres</span>
                    </button>
                );
            }
        }
    }

    render() {
        const activeArtists = this.props.filter.artists ? this.props.filter.artists.ids : [];
        const activeTags    = this.props.filter.tags    ? this.props.filter.tags.ids    : [];
        return (
            <aside>
                <div className="filters">
                    <div className="header">
                        <span>Artists</span>
                        <span className="toggle" onClick={ () => this.relationChanged( 'artists' ) }>
                            ANY
                            <FontAwesomeIcon
                                icon={[ 'fal', 'toggle-on' ]}
                                { ...( this.state.andRelation.artists ? {} : { flip : 'horizontal' } ) }
                            />
                            ALL
                        </span>
                    </div>
                    <Autocomplete
                        loading={ this.state.loading }
                        filterKey="artists"
                        available={ this.state.filters.artists }
                        active={ activeArtists }
                        onFilterChange={ this.filterChanged }
                    />
                    {
                        this.renderActiveFilters( 'artists', activeArtists )
                    }
                </div>
                <div className="filters">
                    <div className="header">
                        <span>Tags</span>
                        <span className="toggle" onClick={ () => this.relationChanged( 'tags' ) }>
                            ANY
                            <FontAwesomeIcon
                                icon={[ 'fal', 'toggle-on' ]}
                                { ...( this.state.andRelation.tags ? {} : { flip : 'horizontal' } ) }
                            />
                            ALL
                        </span>
                    </div>
                    <Autocomplete
                        loading={ this.state.loading }
                        filterKey="tags"
                        available={ this.state.filters.tags }
                        active={ activeTags }
                        onFilterChange={ this.filterChanged }
                    />
                    {
                        this.renderActiveFilters( 'tags', activeTags )
                    }
                </div>
                <div className="filters">
                    <div className="header">
                        <span>Genres</span>
                        <span className="toggle" onClick={ () => this.relationChanged( 'genres' ) }>
                            ANY
                            <FontAwesomeIcon
                                icon={[ 'fal', 'toggle-on' ]}
                                { ...( this.state.andRelation.genres ? {} : { flip : 'horizontal' } ) }
                            />
                            ALL
                        </span>
                    </div>
                    {
                        this.state.loading ? null : this.state.filters.genres
                            .slice( 0, 10 )
                            .map( genre => (
                                <Item
                                    key={ `genres-${ genre.id }` }
                                    filterKey="genres"
                                    id={ genre.id }
                                    name={ genre.name }
                                    count={ genre.count }
                                    active={ Boolean( this.props.filter.genres ) && Boolean( this.props.filter.genres.ids.indexOf( genre.id ) !== -1 )}
                                    onToggle={ this.filterChanged }
                                /> ))
                    }
                    <div className={ this.state.genresHidden ? 'hidden' : '' }>
                        {
                            this.state.loading ? null : this.state.filters.genres
                                .slice( 10 )
                                .map( genre => (
                                    <Item
                                        key={ `genres-${ genre.id }` }
                                        filterKey="genres"
                                        id={ genre.id }
                                        name={ genre.name }
                                        count={ genre.count }
                                        active={ Boolean( this.props.filter.genres ) && Boolean( this.props.filter.genres.ids.indexOf( genre.id ) !== -1 )}
                                        onToggle={ this.filterChanged }
                                    /> ))
                        }
                    </div>
                    { this.expandButton() }
                </div>
            </aside>
        );
    }
}
