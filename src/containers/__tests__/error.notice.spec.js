import React from 'react';
import { shallow } from 'enzyme';
import NoticeBar from 'antd-mobile/lib/notice-bar';
import { ErrorNoticeContainer, getRatesErrorText, mapStateToProps } from '../error-notice';

let wrapper;
let initialProps;
let state;

describe('ErrorNoticeContainer', () => {
  beforeEach(() => {
    initialProps = {
      showError : true,
      errorText : 'text'
    };
    wrapper = shallow(<ErrorNoticeContainer {...initialProps} />);
  });

  it('should render NoticeBar', () => {
    expect(wrapper.contains(<NoticeBar
      icon={null}
      className="error-notice"
      marqueeProps={{ loop: true }}
    >{initialProps.errorText}
    </NoticeBar>)).toBeTruthy();
  });


  it('should hide contents if showError is false', () => {
    wrapper.setProps({ showError: false });

    expect(wrapper.find('[hidden]')).toHaveLength(1);
  });
});

describe('ErrorNoticeContainer mapStateToProps', () => {
  beforeEach(() => {
    state = {
      currenciesById: {
        USD: {
          showRatesError: true
        },
        EUR: {
          showRatesError: true
        },
        GBP: {
          showRatesError: false
        }
      }
    };
  });

  it('should set showError to true if errors are present', () => {
    expect(mapStateToProps(state).showError).toBe(true);

    const stateWithoutErrors = {
      currenciesById: {
        USD: {
          showRatesError: false
        },
        EUR: {
          showRatesError: false
        },
        GBP: {
          showRatesError: false
        }
      }
    };
    expect(mapStateToProps(stateWithoutErrors).showError).toBe(false);
  });

  it('should set error text', () => {
    const currenciesWithErrors = ['USD', 'EUR'];
    expect(mapStateToProps(state).errorText).toEqual(getRatesErrorText(currenciesWithErrors));
  });
});
