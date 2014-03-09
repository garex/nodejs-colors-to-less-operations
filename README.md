# Colors to less operations

Transforms colors to [less operations](http://lesscss.org/functions/#color-operations) that needs to be applied
to the base color to get the desired color.

Currently colors parsed only as HEX: #fff, ccc, #ceceff.


## Usage

    c2o = require("colors-to-less-operations");
    
    base      = "#ff8000";
    dependent = "#bf8040";
    
    // will become "saturate(#ff8000, 20%); // #bf8040"
    dependentAsOperations = c2o.transformToLessOperations(base, dependent);

## Tests

Run `make test`.


## License & copyright

 * MIT
 * (c) 2014 github.com/garex, a@ustimen.co
