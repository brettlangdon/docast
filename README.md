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

## CLI Usage
From the command line you can use `docast` to pull comments out from javascript
files and store into a json file or you can provide a javascript file to use to
format the comments into some other form.

### Help Text
```
$ docast --help
Usage:
  docast (-h | --help)
  docast (-v | --version)
  docast extract [-o <output>] <input_files>...
  docast generate <formatter> <input_files>...

Options:
  -h --help               Show this help text
  -v --version            Show docast version information
Extract:
  Parse docs from javascript files and output as json to a file
  -o --output <output>    File to output to [default: out.json]
  <input_files>           List of javascript files to fetch docs from
Generate:
  Provide a script used to generate documentation from the parsed docs
  <formatter>             Script which exports a `function(comments)` used to generate docs from comments
  <input_files>           List of javascript files to fetch docs from
```

### Extract
```
$ docast extract -o out.json ./lib/*.js
$ cat out.json
[{"name":"func1","params":[],"returns":[],"raises":[],"doc":"this is func1"}, ...]
```

### Generate
#### formatter.js
```javascript
// simply print the name of each function we have documentation for
module.exports = function(comments){
    comments.forEach(function(comment){
        console.log(comment.name);
    });
};
```

#### Usage
```
$ docast generate ./formatter.js ./lib/*.js
func1
func2
```

## Basic API Usage
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
