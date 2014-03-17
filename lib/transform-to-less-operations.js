module.exports = (function() { return transformToLessOperations; })();

var _r = require('color-model').HexRgb; eval('var HexRgb  = _r');
var _r = require('sprintf-js').sprintf; eval('var sprintf = _r');

/**
 * Transforms colors to less operations that needs to be applied to the base color
 * to get the desired color
 *
 * @see http://lesscss.org/functions/#color-operations
 * @param {String} baseColor In HEX format, for example: #ff8000
 * @param {String} desiredColor In HEX format, for example: #bf8040
 * @returns {String} For example: saturate(#ff8000, 20%); // #bf8040
 */
function transformToLessOperations(baseColor, desiredColor, format) {
  format = format ? format : '%(operationsStart)s%(operationsBaseColor)s%(operationsEnd)s; // %(desiredColor)s';

  var baseRgb    = new HexRgb(baseColor.toString()),
      desiredRgb = new HexRgb(desiredColor.toString());

  if (baseRgb.equals(desiredRgb)) {
    return _formatResult(format, '', baseRgb, '', desiredRgb);
  }

  var operationsStart = '',
      operationsEnd   = '';

  var lightnessDelta = desiredRgb.toHsl().lightness() - baseRgb.toHsl().lightness();
  if (lightnessDelta > 0) {
    lightnessDelta  = Math.round(lightnessDelta * 100);
    operationsStart = 'lighten(' + operationsStart;
    operationsEnd   = operationsEnd + ', ' + lightnessDelta + '%)';
  } else if (lightnessDelta < 0) {
    lightnessDelta = Math.round(-lightnessDelta * 100);
    operationsStart = 'darken(' + operationsStart;
    operationsEnd   = operationsEnd + ', ' + lightnessDelta + '%)';
  }

  var saturationDelta = desiredRgb.toHsl().saturation() - baseRgb.toHsl().saturation();
  if (saturationDelta > 0) {
    saturationDelta = Math.round(saturationDelta * 100);
    operationsStart = 'saturate(' + operationsStart;
    operationsEnd   = operationsEnd + ', ' + saturationDelta + '%)';
  } else if (saturationDelta < 0) {
    saturationDelta = Math.round(-saturationDelta * 100);
    operationsStart = 'desaturate(' + operationsStart;
    operationsEnd   = operationsEnd + ', ' + saturationDelta + '%)';
  }

  var hueDelta = desiredRgb.toHsl().hue() - baseRgb.toHsl().hue();
  if (hueDelta != 0) {
    operationsStart = 'spin(' + operationsStart;
    operationsEnd   = operationsEnd + ', ' + hueDelta + ')';
  }

  return _formatResult(format, operationsStart, baseRgb, operationsEnd, desiredRgb);
};

/**
 * Formats result
 *
 * @param {String} format
 * @param {String} operationsStart
 * @param {String} operationsBaseColor
 * @param {String} operationsEnd
 * @param {String} desiredColor
 * @returns {String}
 */
function _formatResult(format, operationsStart, operationsBaseColor, operationsEnd, desiredColor) {
  return sprintf(format, {
    operationsStart     : operationsStart,
    operationsBaseColor : operationsBaseColor,
    operationsEnd       : operationsEnd,
    desiredColor        : desiredColor
  });
};
