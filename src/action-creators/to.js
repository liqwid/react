import { CHANGE_TO } from 'action-types';

export function changeTo(currencyId) {
  return {
    type    : CHANGE_TO,
    payload : { currencyId }
  };
}
