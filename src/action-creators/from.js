import { CHANGE_FROM } from 'action-types';

export function changeFrom(currencyId) {
  return {
    type    : CHANGE_FROM,
    payload : { currencyId }
  };
}
