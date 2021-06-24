import _ from 'lodash';

function testPropsGenerator(prefix: string, id: string) {
  const testId: string = `${(prefix || '')}${prefix ? '__' : ''}${id}`;
  return {
    testID: testId,
    accessibilityLabel: testId
  };
}
// -------------------------------

export const testPropsOf = _.memoize(testPropsGenerator, (...args) => JSON.stringify(args));
// ------------------------------------------------------------------------------
