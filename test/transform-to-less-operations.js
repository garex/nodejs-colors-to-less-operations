describe('transformToLessOperations', () => {
  eval('var transformToLessOperations = require("..").transformToLessOperations');

  describe('extreme cases', () => {

    it('should get base color when both colors are same', () => {
      transformToLessOperations('#fe23ca', '#fe23ca').should.be.equal('#fe23ca; // #fe23ca');
      transformToLessOperations('fff',     '#ffffff').should.be.equal('#ffffff; // #ffffff');
    });

    it('should throw error when bad color values provided', () => {
      ((() => {
        transformToLessOperations('ggg', 'ffffff');
      })).should.throwError(/unknown/);
      ((() => {
        transformToLessOperations('', '');
      })).should.throwError(/unknown/);
    });

  });

  describe('default cases', () => {

    it('should get only positive spin when positive hue difference', () => {
      transformToLessOperations('#fe23ca', '#fe23a5').should.be.equal('spin(#fe23ca, 10); // #fe23a5');
      transformToLessOperations('#abc',    '#aab0cc').should.be.equal('spin(#aabbcc, 20); // #aab0cc');
    });

    it('should get only negative spin when negative hue difference', () => {
      transformToLessOperations('#fe23ca', '#fb23fe').should.be.equal('spin(#fe23ca, -15); // #fb23fe');
      transformToLessOperations('#abc',    '#aac6cc').should.be.equal('spin(#aabbcc, -19); // #aac6cc');
    });

    it('should get only saturate when positive saturation difference', () => {
      transformToLessOperations('#c85bb0', '#d350b6').should.be.equal('saturate(#c85bb0, 10%); // #d350b6');
      transformToLessOperations('#abc',    '#9cbbda').should.be.equal('saturate(#aabbcc, 21%); // #9cbbda');
      transformToLessOperations('#ddd',    '#e7d3d3').should.be.equal('saturate(#dddddd, 29%); // #e7d3d3');
    });

    it('should get only desaturate when negative saturation difference', () => {
      transformToLessOperations('#fe23ca', '#f32ec4').should.be.equal('desaturate(#fe23ca, 10%); // #f32ec4');
      transformToLessOperations('#abc',    '#b8bbbe').should.be.equal('desaturate(#aabbcc, 21%); // #b8bbbe');
    });

    it('should get only lighten when positive lightness difference', () => {
      transformToLessOperations('#fe23ca', '#fe56d6').should.be.equal('lighten(#fe23ca, 10%); // #fe56d6');
      transformToLessOperations('#abc',    '#b0c0d0').should.be.equal('lighten(#aabbcc, 2%); // #b0c0d0');
      transformToLessOperations('#ddd',    '#fcfcfc').should.be.equal('lighten(#dddddd, 12%); // #fcfcfc');
    });

    it('should get only darken when negative lightness difference', () => {
      transformToLessOperations('#fe23ca', '#ed01b5').should.be.equal('darken(#fe23ca, 10%); // #ed01b5');
      transformToLessOperations('#abc',    '#6a88a6').should.be.equal('darken(#aabbcc, 20%); // #6a88a6');
      transformToLessOperations('#ddd',    '#919191').should.be.equal('darken(#dddddd, 30%); // #919191');
    });

    it('should get all needed operations when all 3 components differs', () => {
      transformToLessOperations('#fe23ca', '#ff55ba').should.be.equal('spin(saturate(lighten(#fe23ca, 10%), 1%), 10); // #ff55ba');
      transformToLessOperations('#abc',    '#828c8e').should.be.equal('spin(desaturate(darken(#aabbcc, 20%), 20%), -20); // #828c8e');
      transformToLessOperations('#ddd',    '#ebe9e9').should.be.equal('saturate(lighten(#dddddd, 5%), 5%); // #ebe9e9');
    });

  });

});
