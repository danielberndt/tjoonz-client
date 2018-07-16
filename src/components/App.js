import React, { Component } from 'react';
import Header from './Header';

const Player = () => (
    <div id="player">Player</div>
);

export default class extends Component {
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
            <div className="app">
                { this.props.children }
                <Player />
                <Header />
            </div>
        );
    }
}
