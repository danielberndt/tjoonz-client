import React, { Component } from 'react';
import MixList from './MixList';

export default class extends Component {
    constructor( props ) {
        super( props );
        this.state = {
            mixes : []
        };
    }

    componentDidMount() {
        let dataURL = "http://beta.tjoonz.com/wp-json/wp/v2/posts?_embed";
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
                <p>Hello, world!</p>
                {
                    <MixList mixes={ this.state.mixes } />
                }
            </div>
        );
    }
}
