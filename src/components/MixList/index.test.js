import React from 'react';
import { shallow } from 'enzyme';
import MixList from '.';
import mockdata from '../../mockdata.json';

describe( 'MixList', () => {
    let mixList;

    beforeEach( () => {
        mixList = shallow( <MixList mixes={ mockdata } /> );
    });

    it( 'renders correctly', () => {
        expect( mixList ).toMatchSnapshot();
    });

    it( 'displays 3 mixListItems', () => {
        expect( mixList.find( '.mix-list' ).children().length ).toEqual( 3 );
    });
});
