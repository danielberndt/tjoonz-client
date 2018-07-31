import React, { Component } from 'react';
import Header from './Header';
import Item from './Item';

export default class extends Component {
    constructor( props ) {
        super( props );
        this.state = {
            page : this.props.initPage || 1
        }
    }

    componentDidMount() {
        window.addEventListener( 'scroll', this.scrolled, false );
    }

    componentWillUnmount() {
        window.removeEventListener( 'scroll', this.scrolled, false );
    }

    scrolled = () => {
        const trigger = document.body.scrollHeight - window.innerHeight - 500;
        if( window.scrollY >= trigger && this.props.mixes.length && !this.props.isLoading && !this.props.isExhausted ) {
            this.setState( prevState => ({
                page : prevState.page + 1
            }), () => this.props.onScrollToBottom( this.state.page ) );
        }
    }

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
                {
                    this.props.isLoading ? <div>Loading mixes&hellip;</div> : null
                }
            </div>
        );
    }
}
