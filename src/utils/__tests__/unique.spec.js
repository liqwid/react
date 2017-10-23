import { unique } from '../';

const ARRAY_WITH_UNIQUE_ITEMS_FIXTURE     = [1, 2, 3, 4, 5];
const ARRAY_WITH_NON_UNIQUE_ITEMS_FIXTURE = [1, 2, 1, 3, 2];

describe('unique function', () => {
  it('should not modify array with unique items', () => {
    expect(unique(ARRAY_WITH_UNIQUE_ITEMS_FIXTURE))
    .toEqual(expect.arrayContaining(ARRAY_WITH_UNIQUE_ITEMS_FIXTURE));
  });

  it('should filter out non-unique items from array', () => {
    expect(unique(ARRAY_WITH_NON_UNIQUE_ITEMS_FIXTURE))
    .toEqual(expect.arrayContaining([1, 2, 3]));
  });
});
