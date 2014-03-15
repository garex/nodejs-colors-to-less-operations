module.exports = (function() { return transformToLessOperations; })();

eval('var HexRgb = require("color-model").HexRgb');
var sprintf = require('sprintf-js').sprintf;

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

  var lightnessDelta = desiredRgb.toHsl().lightness() - baseRgb.toHsl().lightness();
  if (lightnessDelta > 0) {
    lightnessDelta = Math.round(lightnessDelta * 100);
    return _formatResult(format, 'lighten(', baseRgb + ', ' + lightnessDelta, '%)', desiredRgb);
  } else if (lightnessDelta < 0) {
    lightnessDelta = Math.round(-lightnessDelta * 100);
    return _formatResult(format, 'darken(', baseRgb + ', ' + lightnessDelta, '%)', desiredRgb);
  }

  var saturationDelta = desiredRgb.toHsl().saturation() - baseRgb.toHsl().saturation();
  if (saturationDelta > 0) {
    saturationDelta = Math.round(saturationDelta * 100);
    return _formatResult(format, 'saturate(', baseRgb + ', ' + saturationDelta, '%)', desiredRgb);
  } else if (saturationDelta < 0) {
    saturationDelta = Math.round(-saturationDelta * 100);
    return _formatResult(format, 'desaturate(', baseRgb + ', ' + saturationDelta, '%)', desiredRgb);
  }

  var hueDelta = desiredRgb.toHsl().hue() - baseRgb.toHsl().hue();
  if (hueDelta != 0) {
    return _formatResult(format, 'spin(', baseRgb + ', ' + hueDelta, ')', desiredRgb);
  }

  return _formatResult(format, 'void(', baseRgb, ')', desiredRgb);
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
