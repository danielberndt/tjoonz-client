import React from 'react';
import { shallow } from 'enzyme';
import Item from './Item';
import { posts } from '../../mockdata.js';

describe( 'MixListItem', () => {
    let mixListItem;

    beforeEach( () => {
        mixListItem = shallow( <Item { ...posts[0] } /> );
    });

    it( 'renders correctly', () => {
        expect( mixListItem ).toMatchSnapshot();
    });
});
