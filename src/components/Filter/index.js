import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchPage } from '../../utils/fetch';
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
                artist : '',
                tags   : ''
            },
            andRelation : {
                genre  : this.props.filter.genre ? this.props.filter.genre.and : true,
                artist : this.props.filter.artist ? this.props.filter.artist.and : true,
                tags   : this.props.filter.tags ? this.props.filter.tags.and : false
            },
            filters : {
                genre      : [],
                artist     : [],
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
        const g = this.loadAvailableFilters( 'genre', 10 );
        const a = this.loadAvailableFilters( 'artist', 10 );
        const t = this.loadAvailableFilters( 'tags', 10 );
        Promise.all([ g, a, t ]).then( () => this.setState({ loading : false }));
    }

    loadAvailableFilters = async ( endpoint, top = 10 ) => {
        const topOptions = {
            per_page : top,
            orderby  : 'count',
            order    : 'desc'
        };
        const topResults = await fetchPage( endpoint, 1, topOptions, false );
        const otherOptions = {
            per_page : 100,
            exclude : topResults.map( term => term.id ).join( ',' )
        };
        return fetchPage( endpoint, 1, otherOptions, true ).then( otherResults => this.setState({
            filters : Object.assign( {}, this.state.filters, {[ endpoint ] : [ ...topResults, ...otherResults ] })
        }));
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
                        onClick={ () => this.setState({ genresHidden : false }) }
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
        const activeArtists = this.props.filter.artist ? this.props.filter.artist.ids : [];
        const activeTags    = this.props.filter.tags   ? this.props.filter.tags.ids   : [];
        return (
            <aside>
                <div className="filters">
                    <div className="header">
                        <span>Artists</span>
                        <span className="toggle" onClick={ () => this.relationChanged( 'artist' ) }>
                            ANY
                            <FontAwesomeIcon
                                icon={[ 'fal', 'toggle-on' ]}
                                { ...( this.state.andRelation.artist ? {} : { flip : 'horizontal' } ) }
                            />
                            ALL
                        </span>
                    </div>
                    <Autocomplete
                        loading={ this.state.loading }
                        filterKey="artist"
                        available={ this.state.filters.artist }
                        active={ activeArtists }
                        onFilterChange={ this.filterChanged }
                    />
                    {
                        this.renderActiveFilters( 'artist', activeArtists )
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
                        <span className="toggle" onClick={ () => this.relationChanged( 'genre' ) }>
                            ANY
                            <FontAwesomeIcon
                                icon={[ 'fal', 'toggle-on' ]}
                                { ...( this.state.andRelation.genre ? {} : { flip : 'horizontal' } ) }
                            />
                            ALL
                        </span>
                    </div>
                    {
                        this.state.loading ? null : this.state.filters.genre
                            .slice( 0, 10 )
                            .map( genre => (
                                <Item
                                    key={ `genre-${ genre.id }` }
                                    filterKey="genre"
                                    id={ genre.id }
                                    name={ genre.name }
                                    count={ genre.count }
                                    active={ Boolean( this.props.filter.genre ) && Boolean( this.props.filter.genre.ids.indexOf( genre.id ) !== -1 )}
                                    onToggle={ this.filterChanged }
                                /> ))
                    }
                    <div className={ this.state.genresHidden ? 'hidden' : '' }>
                        {
                            this.state.loading ? null : this.state.filters.genre
                                .slice( 10 )
                                .map( genre => (
                                    <Item
                                        key={ `genre-${ genre.id }` }
                                        filterKey="genre"
                                        id={ genre.id }
                                        name={ genre.name }
                                        count={ genre.count }
                                        active={ Boolean( this.props.filter.genre ) && Boolean( this.props.filter.genre.ids.indexOf( genre.id ) !== -1 )}
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
