import React, { Component } from 'react';
import Header from './Header';
import Item from './Item';

export default class extends Component {
    render() {
        return (
            <div className="mix-list">
                <Header />
                <div className="mix-list-items">
                    {
                        this.props.mixes.map(( mix, index ) => {
                            return <Item key={ mix.id } { ...mix } />
                        })
                    }
                </div>
            </div>
        );
    }
}
