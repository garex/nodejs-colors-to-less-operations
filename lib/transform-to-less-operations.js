module.exports = (function() { return transformToLessOperations; })();

/**
 * Transforms colors to less operations that needs to be applied to the base color
 * to get the desired color
 *
 * @see http://lesscss.org/functions/#color-operations
 * @param {String} baseColor In HEX format, for example: #ff8000
 * @param {String} desiredColor In HEX format, for example: #bf8040
 * @returns {String} For example: saturate(#ff8000, 20%); // #bf8040
 */
function transformToLessOperations(baseColor, desiredColor) {
  return '';
};
