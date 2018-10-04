import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Header from './Header';
import Item from './Item';
import './style.css';

const endlessScrollTrigger = 500;

export default class extends Component {
    constructor( props ) {
        super( props );
        this.ready = false;
    }

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
        if( prevProps.mixes.length === 0 && this.props.mixes.length > 0 ) {
            this.props.onMounted( this.props.mixes[ 0 ].slug );
            this.ready = true;
        }
        if( this.props.page === 1 && prevProps.isLoading === true && this.props.isLoading === false ) {
            this.scrolled();
        }
    }

    shouldComponentUpdate = ( nextProps, nextState ) => {
        return nextProps.isLoading === false;
    }

    scrolled = () => {
        const trigger = document.body.scrollHeight - window.innerHeight - endlessScrollTrigger;
        if( window.scrollY >= trigger && this.props.mixes.length && !this.props.isLoading && !this.props.isExhausted ) {
            this.props.onScrollToBottom();
        }
    }

    footer = () => {
        if( this.props.isExhausted ) {
            return <div className="mix-list-footer">Still need more? Try relaxing the filter criteria.</div>;
        } else {
            return (
                <button className="mix-list-footer" onClick={ this.props.onScrollToBottom }>
                    <FontAwesomeIcon icon={[ 'far', 'arrow-down' ]} fixedWidth /> <span>Load more mixes</span>
                </button>
            );
        }
    }

    render() {
        if( this.ready ) {
            const footer = this.footer();
            return (
                <div className="mix-list">
                    <Header />
                    <div className="mix-list-items">
                        {
                            this.props.mixes.map(( mix, index ) => {
                                return <Item key={ mix.id } onClick={ this.props.onItemClick } onPlay={ this.props.onItemPlay } history={ this.props.history } { ...mix } />
                            })
                        }
                    </div>
                    { footer }
                </div>
            );
        } else {
            return null;
        }
    }
}
