import React, { Component } from 'react';
import ScrollPanel from '../components/ScrollPanel';
import Filter from '../components/Filter';

export default class extends Component {
    render() {
        return (
            <div className="layout layout-triple">
                <div className="wrap">
                    <div className="panel">
                        <ScrollPanel>
                            <Filter />
                        </ScrollPanel>
                    </div>
                    <div className="panel">
                    
                    </div>
                    <div className="panel">
                        
                    </div>
                </div>
            </div>
        );
    }
}
