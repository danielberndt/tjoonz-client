import React, { Component } from 'react';
import Header from './Header';
import Item from './Item';
import './style.css';

export default class extends Component {
    componentDidMount() {
        this.scrolled();
        window.addEventListener( 'scroll', this.scrolled, false );
        window.addEventListener( 'resize', this.scrolled, false );
    }

    componentWillUnmount() {
        window.removeEventListener( 'scroll', this.scrolled, false );
        window.removeEventListener( 'resize', this.scrolled, false );
    }

    componentDidUpdate( prevProps ) {
        if( this.props.page === 1 && prevProps.isLoading === true && this.props.isLoading === false ) { //prevProps.mixes.length > this.props.mixes.length
            this.scrolled();
        }
    }

    shouldComponentUpdate = ( nextProps, nextState ) => {
        return nextProps.isLoading === false;
    }

    scrolled = () => {
        const trigger = document.body.scrollHeight - window.innerHeight - 500;
        if( window.scrollY >= trigger && this.props.mixes.length && !this.props.isLoading && !this.props.isExhausted ) {
            this.props.onScrollToBottom();
        }
    }

    footer = () => {
        if( this.props.isLoading ) {
            return <div>Loading mixes&hellip;</div>;
        } else if( this.props.isExhausted ) {
            return <div>No more mixes&hellip;</div>;
        } else {
            return null;
        }
    }

    render() {
        const footer = this.footer();
        return (
            <div className="mix-list">
                <Header />
                <div className="mix-list-items">
                    {
                        this.props.mixes.map(( mix, index ) => {
                            return <Item key={ mix.id } onClick={ this.props.onItemClick } { ...mix } />
                        })
                    }
                </div>
                { footer }
            </div>
        );
    }
}
