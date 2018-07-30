import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './index.css';
import App from './components/App';
import layouts from './layouts';

const Root = () => (
    <BrowserRouter>
        <App>
            <Switch>
                <Route exact path="/" component={ layouts.Home } />
                <Route path="/mix/:slug" component={ layouts.Mix } />
                <Route path="/search" render={ props => (
                    <layouts.Search
                        { ...props }
                        recognisedKeys={[
                            'artists',
                            'genres',
                            'tags'
                        ]}
                    />
                )} />
                <Route path="/chart" component={ layouts.Double } />
                <Route path="/my" component={ layouts.Double } />
                <Route path="/about" component={ layouts.Single } />
            </Switch>
        </App>
    </BrowserRouter>
);

render( <Root />, document.getElementById( 'root' ) );
