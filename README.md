DocAST
======

[![Build Status](https://travis-ci.org/brettlangdon/docast.svg?branch=master)](https://travis-ci.org/brettlangdon/docast)

DocAST is tool to help parse docs strings + additional properties from your
javascript source code.

## Install
### NPM
```bash
npm install docast
```

### git
```bash
git clone git://github.com/brettlangdon/docast.git
cd ./docast
npm install
```

## Basic Usage
The below example shows how you can use DocAST to parse documentation data from
your javascript source code.

### example.js
```javascript
/*
 * This function is super cool and does all sorts of cool stuffs
 */
function some(cool, stuff){
    if(typeof cool === undefined || typeof stuff === undefined){
        throw new Exception('must provide "cool" or "stuff" parameter');
    }

    if(cool > stuff){
        return stuff;
    } else if(stuff > cool){
        return cool;
    } else {
        return null;
    };
}
```

### Usage
```javascript
var docast = require('docast');
var comments = docast.parse('./example.js');
// this is the result
comments = [ { name: 'some',
               params: [ 'cool', 'stuff' ],
               returns: [ 'stuff', 'cool', null ],
               raises: [ 'Exception' ],
               doc: ' This function is super cool and does all sorts of cool stuffs\n ' } ]
```
