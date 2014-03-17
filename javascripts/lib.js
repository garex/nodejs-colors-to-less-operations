require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process){
if (process.env.COLOR_MODEL_COVERAGE) {
  eval('module.exports = require("./.coverage/lib");');
} else {
  module.exports = require('./lib');
}

}).call(this,require("/usr/local/lib/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))
},{"./lib":6,"/usr/local/lib/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":16}],2:[function(require,module,exports){
module.exports = (function() { return AbstractModel; })();

var _r = require('./component'); eval('var Component = _r');

/**
 * Abstract color model
 */
function AbstractModel() {
  this._name       = null;
  this._components = [];
};

/**
 * @returns {String}
 */
AbstractModel.prototype.toString = function () {
  var v = [];
  for (var i = 0, iMax = this._components.length; i < iMax; i++) {
    v.push(this['_' + this._components[i]].get());
  }
  return this._name + '(' + v.join(', ') + ')';
};

/**
 * @param {AbstractModel} that
 * @returns {Boolean}
 */
AbstractModel.prototype.equals = function (that) {
  if (!(that instanceof AbstractModel) || this._name !== that._name) {
    return false;
  }
  for (var i = 0, cs = this._components, iMax = cs.length; i < iMax; i++) {
    var key = '_' + cs[i];
    if (!this[key].equals(that[key])) {
      return false;
    }
  }
  return true;
};

/**
 * @abstract
 * @returns {Xyz}
 */
AbstractModel.prototype.toXyz = function () {
  throw new Error('Model ' + this._name + ' has not implemented Xyz conversion!');
};

/**
 * @returns {Lab}
 */
AbstractModel.prototype.toLab = function () {
  return this.toXyz().toLab();
};

/**
 * Getter/chainable setter in one place
 *
 * @param {String} name
 * @param {Number} value
 * @returns {AbstractModel}
 */
AbstractModel.prototype.component = function (name, value) {
  var component = this['_' + name];
  if (undefined === component || !(component instanceof Component)) {
    throw new Error('Component "' + name + '" is not exists');
  }

  if (1 == arguments.length) {
    return component.get();
  }

  component.set(value);
  return this;
};

/**
 * @param {String} name
 * @param {Array} args
 * @returns {AbstractModel}
 */
AbstractModel.prototype._component = function (name, args) {
  /** @type Component */
  var component = this['_' + name];

  if (0 == args.length) {
    return component.get();
  }

  component.set(args[0]);
  return this;
};

},{"./component":3}],3:[function(require,module,exports){
module.exports = (function() { return Component; })();

/**
 * Color model Component
 * @param {String} name
 * @param {Number} from
 * @param {Number} to
 */
function Component(name, from, to) {
  if (!name) {
    throw new Error('Name not set');
  }
  this._name = name;

  from = parseFloat(from);
  to   = parseFloat(to);
  if (!(from < to)) {
    throw new Error('From must be less than to');
  }
  this._from = from;
  this._to   = to;

  this._value = null;
};

/**
 * @param {Number} value
 * @returns {Component}
 */
Component.prototype.set = function (value) {
  value = value ? parseFloat(value) : 0;
  if (isNaN(value)) {
    throw new Error('Value for ' + this._name + ' must be numeric');
  }

  if (value < this._from || value > this._to) {
    throw new Error('Value for ' + this._name + ' (' + value + ') must be between ' + this._from + ' and ' + this._to);
  }

  this._value = value;
  return this;
};

/**
 * @returns {Number}
 */
Component.prototype.get = function () {
  return this._value;
};

/**
 * @param {Component} that
 * @returns {Boolean}
 */
Component.prototype.equals = function (that) {
  return (that instanceof Component)
    && this._name  === that._name
    && this._value === that._value;
};

},{}],4:[function(require,module,exports){
module.exports = (function() { return HexRgb; })();

var _r = require('./rgb'); eval('var Rgb = _r');

/**
 * Rgb color model, that created from HEX string and formatted as HEX
 * @extends Rgb
 * @param {String} hex
 */
function HexRgb(hex) {
  if (undefined === hex) {
    return HexRgb.super_.apply(this, args);
  }

  var c  = '([a-f0-9]{1,2})',
      re = new RegExp('^#?' + c + c + c + '$', 'i'),
      m  = hex.match(re);

  if (null === m) {
    throw new Error('Value "' + hex + '" is unknown hex color');
  }

  var args = [
    this._parseIntFromHex(m[1]),
    this._parseIntFromHex(m[2]),
    this._parseIntFromHex(m[3])
  ];
  HexRgb.super_.apply(this, args);
};

require('util').inherits(HexRgb, require('./rgb')); 'code' ? 'completion' : HexRgb.prototype = new Rgb;

/**
 * @param {String} hex
 * @returns {Number}
 */
HexRgb.prototype._parseIntFromHex = function(hex) {
  if (1 == hex.length) {
    hex = hex + hex;
  }
  return parseInt(hex, 16);
};

/**
 * @returns {String}
 */
HexRgb.prototype.toString = function() {
  return '#' + this._formatIntAsHex(this.red()) + this._formatIntAsHex(this.green()) + this._formatIntAsHex(this.blue());
};

/**
 * @param {Number} intValue
 * @returns {String}
 */
HexRgb.prototype._formatIntAsHex = function(intValue) {
  intValue = Math.round(intValue);
  strValue = '' + intValue;
  if (1 == strValue.length) {
    strValue = strValue + strValue;
  }
  return (intValue < 16 ? '0' : '') + intValue.toString(16);
};

/**
 * @returns {Rgb}
 */
HexRgb.prototype.toRgb = function () {
  return new Rgb(this._red.get(), this._green.get(), this._blue.get());
};

},{"./rgb":8,"util":18}],5:[function(require,module,exports){
module.exports = (function() { return Hsl; })();

var _r = require('./component'); eval('var Component = _r');
var _r = require('./rgb');       eval('var Rgb       = _r');

/**
 * Hue, saturation, lightness color space
 * @extends AbstractModel
 * @param {Number} h
 * @param {Number} s
 * @param {Number} l
 */
function Hsl(h, s, l) {
  this._name       = 'hsl';
  this._components = ['hue', 'saturation', 'lightness'];
  this._hue        = new Component('hue',        0, 360); this._hue.set(h);
  this._saturation = new Component('saturation', 0, 1  ); this._saturation.set(s);
  this._lightness  = new Component('lightness',  0, 1  ); this._lightness.set(l);
};

require('util').inherits(Hsl, require('./abstract-model')); 'code' ? 'completion' : Hsl.prototype = new AbstractModel;

/**
 * @param {Number} value from 0 to 360
 * @returns {Hsl}
 */
Hsl.prototype.hue = function (value) {
  return this._component('hue', arguments);
};

/**
 * @param {Number} value from 0 to 1
 * @returns {Hsl}
 */
Hsl.prototype.saturation = function (value) {
  return this._component('saturation', arguments);
};

/**
 * @param {Number} value from 0 to 1
 * @returns {Hsl}
 */
Hsl.prototype.lightness = function (value) {
  return this._component('lightness', arguments);
};

/**
 * @returns {Xyz}
 */
Hsl.prototype.toXyz = function () {
  return this.toRgb().toXyz();
};

/**
 * @returns {Rgb}
 */
Hsl.prototype.toRgb = function () {
  var lightness  = this._lightness.get(),
      saturation = this._saturation.get();
  if (saturation == 0) {
    var light = 0;
    if (lightness < 0) {
      light = 0;
    } else if (lightness >= 1) {
      light = 255;
    } else {
      light = (lightness * (1 << 16)) >> 8;
    }
    return new Rgb(light, light, light);
  }

  var hue   = this._hue.get() / this._hue._to,
      temp2 = (lightness < 0.5) ?
                (lightness * (saturation + 1)) :
                (lightness + saturation) - (lightness * saturation),
      temp1 = 2 * lightness - temp2;

  return new Rgb(
    this._calcHue(temp1, temp2, hue + 1 / 3),
    this._calcHue(temp1, temp2, hue),
    this._calcHue(temp1, temp2, hue - 1 / 3)
  );
};

/**
 * @param {Number} temp1
 * @param {Number} temp2
 * @param {Number} hue
 * @returns {Number}
 */
Hsl.prototype._calcHue = function (temp1, temp2, hue) {
  if (hue < 0) {
    ++hue;
  } else if (hue > 1) {
    --hue;
  }

  result = temp1;
  if (hue * 6 < 1) {
    result = temp1 + (temp2 - temp1) * hue * 6;
  } else if (hue * 2 < 1) {
    result = temp2;
  } else if (hue * 3 < 2) {
    result = temp1 + (temp2 - temp1) * (2/3 - hue) * 6;
  }

  return (result * 255.99999999999997) >> 0;
};

},{"./abstract-model":2,"./component":3,"./rgb":8,"util":18}],6:[function(require,module,exports){
module.exports = {
    Component     : require('./component')
  , AbstractModel : require('./abstract-model')
  , Xyz           : require('./xyz')
  , Rgb           : require('./rgb')
  , HexRgb        : require('./hex-rgb')
  , Lab           : require('./lab')
  , Hsl           : require('./hsl')
};

},{"./abstract-model":2,"./component":3,"./hex-rgb":4,"./hsl":5,"./lab":7,"./rgb":8,"./xyz":9}],7:[function(require,module,exports){
module.exports = (function() { return Lab; })();

var _r = require('./component'); eval('var Component = _r');

/**
 * Lab color space
 *
 * CIE 1976 (L*, a*, b*) color space
 * @extends AbstractModel
 * @param {Number} l
 * @param {Number} a
 * @param {Number} b
 */
function Lab(l, a, b) {
  this._name       = 'lab';
  this._components = ['lightness', 'a', 'b'];
  this._lightness  = new Component('lightness', 0,    100); this._lightness.set(l);
  this._a          = new Component('a',         -52,  100); this._a.set(a);
  this._b          = new Component('b',         -108, 100); this._b.set(b);
};

require('util').inherits(Lab, require('./abstract-model')); 'code' ? 'completion' : Lab.prototype = new AbstractModel;

/**
 * @param {Number} value
 * @returns {Lab}
 */
Lab.prototype.lightness = function (value) {
  return this._component('lightness', arguments);
};

/**
 * @param {Number} value
 * @returns {Lab}
 */
Lab.prototype.a = function (value) {
  return this._component('a', arguments);
};

/**
 * @param {Number} value
 * @returns {Lab}
 */
Lab.prototype.b = function (value) {
  return this._component('b', arguments);
};

},{"./abstract-model":2,"./component":3,"util":18}],8:[function(require,module,exports){
module.exports = (function() { return Rgb; })();

var _r = require('./component'); eval('var Component = _r');
var _r = require('./xyz');       eval('var Xyz       = _r');
var _r = require('./hsl');       eval('var Hsl       = _r');

/**
 * Rgb color model
 * @extends AbstractModel
 * @param {Number} r
 * @param {Number} g
 * @param {Number} b
 */
function Rgb(r, g, b) {
  this._name       = 'rgb';
  this._components = ['red', 'green', 'blue'];
  this._red        = new Component('red',   0, 255); this._red.set(r);
  this._green      = new Component('green', 0, 255); this._green.set(g);
  this._blue       = new Component('blue',  0, 255); this._blue.set(b);
};

require('util').inherits(Rgb, require('./abstract-model')); 'code' ? 'completion' : Rgb.prototype = new AbstractModel;

/**
 * @param {Number} value
 * @returns {Rgb}
 */
Rgb.prototype.red = function (value) {
  return this._component('red', arguments);
};

/**
 * @param {Number} value
 * @returns {Rgb}
 */
Rgb.prototype.green = function (value) {
  return this._component('green', arguments);
};

/**
 * @param {Number} value
 * @returns {Rgb}
 */
Rgb.prototype.blue = function (value) {
  return this._component('blue', arguments);
};

/**
 * @returns {HexRgb}
 */
Rgb.prototype.toHex = function () {
  var HexRgb = require('./hex-rgb');
  return new HexRgb()
    .red  (this._red  .get())
    .green(this._green.get())
    .blue (this._blue .get());
};

/**
 * @returns {String}
 */
Rgb.prototype.toHexString = function () {
  return this.toHex().toString();
};

/**
 * @param {Number} value
 * @returns {Number}
 */
Rgb.prototype._preparePreXyzValue = function(value) {
  value = value / 255;
  if (value > 0.04045) {
    value = (value + 0.055) / 1.055;
    value = Math.pow(value, 2.4);
  } else {
    value = value / 12.92;
  }
  return value * 100;
};

/**
 * @returns {Xyz}
 */
Rgb.prototype.toXyz = function () {
  var r = this._preparePreXyzValue(this._red  .get()),
      g = this._preparePreXyzValue(this._green.get()),
      b = this._preparePreXyzValue(this._blue .get());

  return new Xyz(
    this._finalizeXyzValue(r * 0.4124 + g * 0.3576 + b * 0.1805),
    this._finalizeXyzValue(r * 0.2126 + g * 0.7152 + b * 0.0722),
    this._finalizeXyzValue(r * 0.0193 + g * 0.1192 + b * 0.9505)
  );
};

/**
 * @param {Number} preXyzValue
 * @returns {Number}
 */
Rgb.prototype._finalizeXyzValue = function (preXyzValue) {
  return Math.round(preXyzValue * 10000) / 10000;
};

/**
 * @returns {Hsl}
 */
Rgb.prototype.toHsl = function () {
  var r = this._red  .get() / 255,
      g = this._green.get() / 255,
      b = this._blue .get() / 255,
      min   = Math.min(r, g, b),
      max   = Math.max(r, g, b),
      delta = max - min,
      lightness = (min + max) / 2;

  lightness = Math.round(lightness * 100) / 100;

  if (delta == 0) {
    return new Hsl(0, 0, lightness);
  }

  var saturation = 0;
  if (lightness < 0.5) {
    saturation = delta / (max + min);
  } else {
    saturation = delta / (2 - max - min);
  }
  saturation = Math.round(saturation * 100) / 100;

  var hue  = 0,
    deltaR = (((max - r) / 6 ) + (delta / 2)) / delta,
    deltaG = (((max - g) / 6 ) + (delta / 2)) / delta,
    deltaB = (((max - b) / 6 ) + (delta / 2)) / delta;

  if (r == max) {
    hue = deltaB - deltaG;
  } else if (g == max) {
    hue = ( 1 / 3 ) + deltaR - deltaB;
  } else {
    hue = ( 2 / 3 ) + deltaG - deltaR;
  }

  if (hue < 0) {
    ++hue;
  } else if (hue > 1) {
    --hue;
  }
  hue = (hue * 360.99999999999997) >> 0;
  if (360 == hue) {
    hue = 0;
  }

  return new Hsl(hue, saturation, lightness);
};

},{"./abstract-model":2,"./component":3,"./hex-rgb":4,"./hsl":5,"./xyz":9,"util":18}],9:[function(require,module,exports){
module.exports = (function() { return Xyz; })();

var _r = require('./component'); eval('var Component = _r');
var _r = require('./rgb');       eval('var Rgb       = _r');
var _r = require('./lab');       eval('var Lab       = _r');

/**
 * XYZ color model - base color model for others
 *
 * CIE 1931 color space
 * @extends AbstractModel
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 */
function Xyz(x, y, z) {
  this._name       = 'xyz';
  this._components = ['x', 'y', 'z'];
  this._x          = new Component('x', 0, 95.05); this._x.set(x);
  this._y          = new Component('y', 0, 100  ); this._y.set(y);
  this._z          = new Component('z', 0, 108.9); this._z.set(z);
};

require('util').inherits(Xyz, require('./abstract-model')); 'code' ? 'completion' : Xyz.prototype = new AbstractModel;

/**
 * @param {Number} value
 * @returns {Xyz}
 */
Xyz.prototype.x = function (value) {
  return this._component('x', arguments);
};

/**
 * @param {Number} value
 * @returns {Xyz}
 */
Xyz.prototype.y = function (value) {
  return this._component('y', arguments);
};

/**
 * @param {Number} value
 * @returns {Xyz}
 */
Xyz.prototype.z = function (value) {
  return this._component('z', arguments);
};

/**
 * @returns {Xyz}
 */
Xyz.prototype.toXyz = function () {
  return new Xyz(this._x.get(), this._y.get(), this._z.get());
};

/**
 * @returns {Lab}
 */
Xyz.prototype.toLab = function () {
  var x = this._preparePreLabValue(this._x.get() /  95.047),
      y = this._preparePreLabValue(this._y.get() / 100.000),
      z = this._preparePreLabValue(this._z.get() / 108.883);

  return new Lab(
    this._finalizeLabValue((116 * y) - 16),
    this._finalizeLabValue(500 * (x - y)),
    this._finalizeLabValue(200 * (y - z))
  );
};

/**
 * @param {Number} preLabValue
 * @returns {Number}
 */
Xyz.prototype._preparePreLabValue = function (preLabValue) {
  if (preLabValue > 0.008856) {
    return Math.pow(preLabValue, 1/3);
  }
  return (7.787 * preLabValue) + (16 / 116);
};

/**
 * @param {Number} preLabValue
 * @returns {Number}
 */
Xyz.prototype._finalizeLabValue = function (preLabValue) {
  return Math.round(preLabValue * 10000) / 10000;
};

/**
 * @returns {Rgb}
 */
Xyz.prototype.toRgb = function () {
  var x = this._x.get() / 100,
      y = this._y.get() / 100,
      z = this._z.get() / 100,
      r = x *  3.2406 + y * -1.5372 + z * -0.4986,
      g = x * -0.9689 + y *  1.8758 + z *  0.0415,
      b = x *  0.0557 + y * -0.2040 + z *  1.0570;

  return new Rgb(this._finalizeRgbValue(r), this._finalizeRgbValue(g), this._finalizeRgbValue(b));
};

/**
 * @param {Number} preRgbValue
 * @returns {Number}
 */
Xyz.prototype._finalizeRgbValue = function (preRgbValue) {
  if (preRgbValue > 0.0031308 ) {
    preRgbValue = 1.055 * Math.pow(preRgbValue,  1/2.4) - 0.055;
  } else {
    preRgbValue = 12.92 * preRgbValue;
  }

  return Math.round(255 * preRgbValue);
};

},{"./abstract-model":2,"./component":3,"./lab":7,"./rgb":8,"util":18}],"colors-to-less-operations":[function(require,module,exports){
module.exports=require('pFlgcY');
},{}],"pFlgcY":[function(require,module,exports){
(function (process){
if (process.env.COLORS_TO_LESS_OPERATIONS_COVERAGE) {
  eval('module.exports = require("./.coverage/lib");');
} else {
  module.exports = require('./lib');
}

}).call(this,require("/usr/local/lib/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))
},{"./lib":12,"/usr/local/lib/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":16}],12:[function(require,module,exports){
module.exports = {
  transformToLessOperations: require('./transform-to-less-operations')
};

},{"./transform-to-less-operations":13}],13:[function(require,module,exports){
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

},{"color-model":1,"sprintf-js":14}],14:[function(require,module,exports){
/*! sprintf.js | Copyright (c) 2007-2013 Alexandru Marasteanu <hello at alexei dot ro> | 3 clause BSD license */

(function(ctx) {
	var sprintf = function() {
		if (!sprintf.cache.hasOwnProperty(arguments[0])) {
			sprintf.cache[arguments[0]] = sprintf.parse(arguments[0]);
		}
		return sprintf.format.call(null, sprintf.cache[arguments[0]], arguments);
	};

	sprintf.format = function(parse_tree, argv) {
		var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
		for (i = 0; i < tree_length; i++) {
			node_type = get_type(parse_tree[i]);
			if (node_type === 'string') {
				output.push(parse_tree[i]);
			}
			else if (node_type === 'array') {
				match = parse_tree[i]; // convenience purposes only
				if (match[2]) { // keyword argument
					arg = argv[cursor];
					for (k = 0; k < match[2].length; k++) {
						if (!arg.hasOwnProperty(match[2][k])) {
							throw(sprintf('[sprintf] property "%s" does not exist', match[2][k]));
						}
						arg = arg[match[2][k]];
					}
				}
				else if (match[1]) { // positional argument (explicit)
					arg = argv[match[1]];
				}
				else { // positional argument (implicit)
					arg = argv[cursor++];
				}

				if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
					throw(sprintf('[sprintf] expecting number but found %s', get_type(arg)));
				}
				switch (match[8]) {
					case 'b': arg = arg.toString(2); break;
					case 'c': arg = String.fromCharCode(arg); break;
					case 'd': arg = parseInt(arg, 10); break;
					case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
					case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
					case 'o': arg = arg.toString(8); break;
					case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
					case 'u': arg = arg >>> 0; break;
					case 'x': arg = arg.toString(16); break;
					case 'X': arg = arg.toString(16).toUpperCase(); break;
				}
				arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
				pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
				pad_length = match[6] - String(arg).length;
				pad = match[6] ? str_repeat(pad_character, pad_length) : '';
				output.push(match[5] ? arg + pad : pad + arg);
			}
		}
		return output.join('');
	};

	sprintf.cache = {};

	sprintf.parse = function(fmt) {
		var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
		while (_fmt) {
			if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
				parse_tree.push(match[0]);
			}
			else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
				parse_tree.push('%');
			}
			else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
				if (match[2]) {
					arg_names |= 1;
					var field_list = [], replacement_field = match[2], field_match = [];
					if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
						field_list.push(field_match[1]);
						while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
							if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
								field_list.push(field_match[1]);
							}
							else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
								field_list.push(field_match[1]);
							}
							else {
								throw('[sprintf] huh?');
							}
						}
					}
					else {
						throw('[sprintf] huh?');
					}
					match[2] = field_list;
				}
				else {
					arg_names |= 2;
				}
				if (arg_names === 3) {
					throw('[sprintf] mixing positional and named placeholders is not (yet) supported');
				}
				parse_tree.push(match);
			}
			else {
				throw('[sprintf] huh?');
			}
			_fmt = _fmt.substring(match[0].length);
		}
		return parse_tree;
	};

	var vsprintf = function(fmt, argv, _argv) {
		_argv = argv.slice(0);
		_argv.splice(0, 0, fmt);
		return sprintf.apply(null, _argv);
	};

	/**
	 * helpers
	 */
	function get_type(variable) {
		return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
	}

	function str_repeat(input, multiplier) {
		for (var output = []; multiplier > 0; output[--multiplier] = input) {/* do nothing */}
		return output.join('');
	}

	/**
	 * export to either browser or node.js
	 */
	ctx.sprintf = sprintf;
	ctx.vsprintf = vsprintf;
})(typeof exports != "undefined" ? exports : window);

},{}],15:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],16:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],17:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],18:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require("/usr/local/lib/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":17,"/usr/local/lib/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":16,"inherits":15}]},{},[])