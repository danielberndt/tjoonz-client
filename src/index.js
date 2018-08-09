import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './index.css';
import Header from './components/Header';
import layouts from './layouts';

const Player = () => (
    <div id="player">Player</div>
);

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

    render() {
        return (
            <BrowserRouter>
                <div className="app">
                    <Switch>
                        <Route exact path="/" component={ layouts.Home } />
                        <Route path="/mix/:slug" component={ layouts.Mix } />
                        <Route path="/search" render={ props => (
                            <layouts.Search
                            { ...props }
                            recognisedKeys={[
                                'artists',
                                'genres',
                                'tags'
                            ]}
                            />
                        )} />
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
