import React from 'react';
import { shallow } from 'enzyme';
import Header from './Header';

describe( 'MixListHeader', () => {
    let mixListHeader;

    beforeEach( () => {
        mixListHeader = shallow( <Header /> );
    });

    it( 'renders correctly', () => {
        expect( mixListHeader ).toMatchSnapshot();
    });
});
