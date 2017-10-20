import { omit } from '../';

const INITIAL_OBJECT = {
  key1 : {},
  key2 : true,
  key3 : 1,
  key4 : 'string'
};
const OBJECT_WITHOUT_EXISTING_KEYS = {
  key3 : 1,
  key4 : 'string'
};
const EXISTING_KEYS = ['key1', 'key2'];
const NON_EXISTING_KEYS = ['key0', 'somekey'];

describe('omit function', () => {
  it('should not object without specified keys', () => {
    const newObject = omit(INITIAL_OBJECT, ...NON_EXISTING_KEYS);

    expect(newObject).toEqual(INITIAL_OBJECT);
  });

  it('should remove all of the specified keys from object', () => {
    const newObject = omit(INITIAL_OBJECT, ...EXISTING_KEYS);

    expect(newObject).toEqual(OBJECT_WITHOUT_EXISTING_KEYS);
  });
});
