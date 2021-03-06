import React, { Component } from 'react';
import Comment from './Comment';
import { fetchCommentsById } from '../../utils/fetch';

export default class extends Component {
    _request = null;
    _id = null;
    state = {
        prevId : null,
        data   : null
    }

    static getDerivedStateFromProps( nextProps, prevState ) {
        if( nextProps.id !== prevState.prevId ) {
            return {
                prevId : nextProps.id,
                data   : null
            };
        }

        return null;
    }

    componentDidMount() {
        if( this.props.id ) {
            this._getCommentData( this.props.id );
        }
    }

    componentDidUpdate( prevProps, prevState ) {
        if( this.state.data === null ) {
            this._getCommentData( this.props.id );
        }
    }

    componentWillUnmount() {
        this._request = null;
    }

    render() {
        if( this.state.data === null ) {
            return <div>Loading&hellip;</div>
        } else {
            return (
                <aside>
                    <div className="comment-list">
                        { this.state.data.map( comment => <Comment key={ comment.id } { ...comment } /> ) }
                    </div>
                </aside>
            );
        }
    }

    _getCommentData = id => {
        if( id === this._id ) return;

        this._id = id;
        this._request = fetchCommentsById( id ).then( comments => {
            if( this._id === id ) {
                this._request = null;
                this.setState({ data : comments });
            }
        });
    }
};
