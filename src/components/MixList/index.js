import React, { Component } from 'react';
import Item from './Item';

export default class extends Component {
    render() {
        return(
            <div className="mix-list">
            {
                this.props.mixes.map(( mix, index ) => {
                    return <Item key={ mix.id } { ...mix } />
                })
            }
            </div>
        );
    }
}
