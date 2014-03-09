describe('transformToLessOperations', function() {
  eval('var transformToLessOperations = require("..").transformToLessOperations');

  describe('extreme cases', function() {

    it('should get base color when both colors are same', function() {
      transformToLessOperations('#fe23ca', '#fe23ca').should.be.equal('#fe23ca; // #fe23ca');
      transformToLessOperations('fff',     '#ffffff').should.be.equal('#ffffff; // #ffffff');
    });

    it('should throw error when bad color values provided', function() {
      (function(){
        transformToLessOperations('ggg', 'ffffff');
      }).should.throwError(/unknown/);
      (function(){
        transformToLessOperations('', '');
      }).should.throwError(/unknown/);
    });

  });

  describe('default cases', function() {

    it('should get only positive spin when positive hue difference');

    it('should get only negative spin when negative hue difference');

    it('should get only saturate when positive saturation difference');

    it('should get only desaturate when negative saturation difference');

    it('should get only lighten when positive lightness difference');

    it('should get only darken when negative lightness difference');

    it('should get all needed operations when all 3 components differs');

  });

});
