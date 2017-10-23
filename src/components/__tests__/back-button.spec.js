import React from 'react';
import { shallow } from 'enzyme';
import { BackButton } from '../back-button';

let initialProps;
let wrapper;

describe('BackButton', () => {

  beforeEach(() => {
    initialProps = {
      handleBack: jest.fn()
    };
    wrapper = shallow(<BackButton {...initialProps} />);
  });

  it('should render back button', () => {
    expect(wrapper.contains(
      <div
        onClick={initialProps.handleBack}
        role="button"
        className="header-button"
        tabIndex={0}
      >Back</div>
    )).toBeTruthy();
  });

  it('should call handleBack on click', () => {
    wrapper.find('div').simulate('click');
    expect(initialProps.handleBack).toHaveBeenCalledTimes(1);
  });
});
