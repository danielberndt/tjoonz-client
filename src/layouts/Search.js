import React, { Component } from 'react';

export default class extends Component {
    constructor( props ) {
        super( props );
        this.state = {
            loading : true,
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
            },
            filtering : {
                genres    : [],
                artists   : [],
                tags      : [],
                dateRange : {
                    start : '',
                    end   : ''
                },
                order     : {
                    by    : 'post_date',
                    asc   : false
                }
            }
        };
    }

    componentDidMount() {
        const genres = this.loadFilters( 'genre' );
        const artists = this.loadFilters( 'artist' );
        const tags = this.loadFilters( 'tags' );
        Promise.all([ genres, artists, tags ])
            .then( () => this.setState({ loading : false }, () => console.log('all done', this.state.filters)));
    }

    loadFilters = filter => {
        return this._fetchPage( filter, 1 ).then( list => {
            this.setState({
                filters : Object.assign( {}, this.state.filters, {[ filter ] : list })
            })
        });
    }

    _fetchPage = ( filter, page ) => {
        return fetch( `http://beta.tjoonz.com/wp-json/wp/v2/${ filter }?per_page=100&page=${ page++ }` )
            .then( response => response.json() )
            .then( currentPage => currentPage.length === 0 ? currentPage : this._fetchPage( filter, page ).then( nextPage => [ ...currentPage, ...nextPage ] ));
    }

    render() {
        return (
            <div className="layout layout-triple">
                <div className="wrap">
                    <div className="panel">
                        <div className="filters">
                            <big>Genres</big>
                            { this.state.filters.genre.map( ( filter, index ) => <div key={ index } dangerouslySetInnerHTML={{ __html: filter.name }}></div> ) }
                        </div>
                        <div className="filters">
                            <big>Artists</big>
                            { this.state.filters.artist.map( ( filter, index ) => <div key={ index } dangerouslySetInnerHTML={{ __html: filter.name }}></div> ) }
                        </div>
                        <div className="filters">
                            <big>Tags</big>
                            { this.state.filters.tags.map( ( filter, index ) => <div key={ index } dangerouslySetInnerHTML={{ __html: filter.name }}></div> ) }
                        </div>
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
