import React from 'react';
import { shallow } from 'enzyme';
import MixList from '.';
import { posts } from '../../mockdata.js';

describe( 'MixList', () => {
    let mixList;

    beforeEach( () => {
        mixList = shallow( <MixList mixes={ posts } /> );
    });

    it( 'renders correctly', () => {
        expect( mixList ).toMatchSnapshot();
    });

    it( 'displays 10 mixListItems', () => {
        expect( mixList.find( '.mix-list-items' ).children().length ).toEqual( 10 );
    });
});
