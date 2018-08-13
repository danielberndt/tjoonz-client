import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './index.css';
import Header from './components/Header';
import Player from './components/Player';
import layouts from './layouts/';

const { Home, Mix, Search } = layouts;

class Root extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            audioPlayer : {
                playing : {
                    src      : '',
                    title    : '',
                    artists  : [],
                    genres   : [],
                    tags     : [],
                    duration : 0,
                    bitrate  : 0,
                    size     : 0
                },
                playlist : []
            },
            mixes : []
        };
    }

    componentDidMount() {
        const dataURL = "http://beta.tjoonz.com/wp-json/wp/v2/posts?_embed";
        fetch( dataURL )
            .then( response => response.json() )
            .then( mixes => {
                this.setState({ mixes });
            })
        ;
    }

    renderRouteComponent = ( Component, ...rest ) => {
        return <Component
            onPlayMix={ this.playMix }
            { ...Object.assign( {}, ...rest ) }
        />;
    }

    playMix = id => {
        console.log( `Something requested to play mix with ID ${ id }` );
    }

    render() {
        return (
            <BrowserRouter>
                <div className="app">
                    <Switch>
                        <Route exact path="/" component={ Home } />
                        <Route path="/mix/:slug" component={ Mix } />
                        <Route path="/search" render={ props => this.renderRouteComponent( Search, props, { recognisedKeys : [ 'artists', 'genres', 'tags' ] } ) } />
                        <Route path="/chart" component={ layouts.Double } />
                        <Route path="/my" component={ layouts.Double } />
                        <Route path="/about" component={ layouts.Single } />
                    </Switch>
                    <Player />
                    <Header />
                </div>
            </BrowserRouter>
        );
    }
};

render( <Root />, document.getElementById( 'root' ) );
