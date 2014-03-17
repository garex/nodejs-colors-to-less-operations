var transformToLessOperations = require('colors-to-less-operations').transformToLessOperations;

jQuery(document).ready(function($) {
  var src = $('#sourceColors'),
      dst = $('#desiredColors'),
      res = $('#result'),
      reSplit = /[\s,\n]+/g;

  $('#transformation').submit(function() {
    
    if (!src.val() || !dst.val()) {
      alert('Provide both source and desired colors');
      return false;
    }
    
    var srcValues = src.val().split(reSplit),
        dstValues = dst.val().split(reSplit),
        iMax      = Math.max(srcValues.length, dstValues.length),
        srcValue  = null,
        dstValue  = null,
        result    = [],
        errors    = [];
    
    
    for (var i = 0; i < iMax; i++) {
      if (srcValues[i] !== undefined) {
        srcValue = srcValues[i];
      }
      if (dstValues[i] !== undefined) {
        dstValue = dstValues[i];
      }
      try {
        result.push(transformToLessOperations(srcValue, dstValue));
      } catch (e) {
        errors.push(e.message);
      }
    }
    
    res.val(result.join('\n'));
    if (errors.length > 0) {
      errors.unshift('');
      alert('Problems:' + errors.join('\n * '));
    }

    return false;
  });

  
  $('#for-example').click(function() {
    src.val('#ffccee');
    dst.val(['#ffccbb', '#ffccee', '#abc'].join('\n'));
    return false;
  });
  
});
