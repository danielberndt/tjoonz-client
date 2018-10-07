import React, { Component } from 'react';
import { getPublishDate } from '../../utils/metadata';
import './style.css';

export default class extends Component {
    render() {
        console.log( this.props );
        const publishDate = getPublishDate( this.props.date_gmt );

        return (
            <div className="comment-item">
                <div className="avatar">
                    <img src={ this.props.author_avatar_urls[ '48' ] } alt={ this.props.author_name } />
                </div>
                <div className="comment-body">
                    <div className="meta">
                        <span className="published">{ publishDate }</span>
                        <span className="author">{ this.props.author_name }</span>
                    </div>
                    <div className="content" dangerouslySetInnerHTML={{ __html : this.props.content.rendered }}></div>
                </div>
            </div>
        );
    }
};
