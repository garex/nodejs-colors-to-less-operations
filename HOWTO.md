# HOWTO

## Browserify

    # one time
    sudo npm install browserify -g
    npm install colors-to-less-operations --force 
    
    # everytime
    npm update
    browserify -r colors-to-less-operations > javascripts/lib.js
