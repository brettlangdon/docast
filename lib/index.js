var esprima = require('esprima');
var fs = require('fs');

var skip = /^\s+\*/gm;

var mapName = function(elm){
    return elm.name;
};

var traverseForType = function(type, expr, callback){
    if(!expr || !expr.type){
        return;
    }

    if(expr.type === 'BlockStatement'){
        expr.body.forEach(function(expr){
            if(expr.type === type){
                // probably a blank return or throw statement
                if(!expr.argument){
                    return;
                }
                if(expr.argument.type === 'NewExpression'){
                    callback(expr.argument.callee.name);
                } else if(expr.argument.type === 'Literal'){
                    callback(expr.argument.raw);
                } else if(expr.argument.type === 'Identifier'){
                    callback(expr.argument.name);
                } else if(expr.argument.type === 'ObjectExpression'){
                    returns.push('[Object]');
                } else if(expr.argument.type === 'ArrayExpression'){
                    returns.push('[Array]');
                } else if(expr.argument.type === 'FunctionExpression'){
                    returns.push('[Function]');
                }
            } else {
                traverseForType(type, expr, callback);
            }
        });
    } else if(expr.type === 'IfStatement'){
        traverseForType(type, expr.consequent, callback)
        if(expr.alternate){
            traverseForType(type, expr.alternate, callback);
        }
    } else if(expr.type === 'TryStatement'){
        traverseForType(type, expr.block, callback);
        expr.handlers.forEach(function(expr){
            traverseForType(type, expr.body, callback);
        });
    } else if(expr.type === 'WhileStatement'){
        traverseForType(type, expr.body, callback);
    }
}

var findReturns = function(expr){
    var returns = []
    traverseForType('ReturnStatement', expr, function(name){
        returns.push(name);
    });
    return returns;
};

var findRaises = function(expr){
    var raises = []
    traverseForType('ThrowStatement', expr, function(name){
        raises.push(name);
    });
    return raises;
};

var parseExpressions = function(expr){
    var expressions = {};
    var _parse = function(expr){
        if(!expr){
            return;
        } else if(expr.length && typeof expr.forEach === 'function'){
            return expr.forEach(_parse);
        }

        if(expr.type === 'FunctionExpression'){
            expressions[expr.loc.start.line] = {
                name: expr.id,
                params: expr.params.map(mapName),
                returns: findReturns(expr.body),
                raises: findRaises(expr.body),
            };

            _parse(expr.body);
        } else if(expr.type === 'FunctionDeclaration'){
            expressions[expr.loc.start.line] = {
                name: expr.id.name,
                params: expr.params.map(mapName),
                returns: findReturns(expr.body),
                raises: findRaises(expr.body),
            };

            _parse(expr.body);
        } else if(expr.type === 'AssignmentExpression' && expr.right.type === 'FunctionExpression'){
            var data = {};
            if(expr.left.type === 'MemberExpression'){
                data.name = expr.left.property.name;
                if(expr.left.object.type === 'MemberExpression'){
                    if(expr.left.object.property.name === 'prototype'){
                        data.class = expr.left.object.object.name;
                    }
                }
            }
            if(expr.right.type === 'FunctionExpression'){
                data.params = expr.right.params.map(mapName);
                data.returns = findReturns(expr.right.body);
                data.raises = findRaises(expr.right.body);
            }
            expressions[expr.loc.start.line] = data;
        } else if(expr.type === 'VariableDeclarator' && expr.init.type === 'FunctionExpression'){
            expressions[expr.loc.start.line] = {
                name: expr.id.name,
                params: expr.init.params.map(mapName),
                returns: findReturns(expr.init.body),
                raises: findRaises(expr.init.body),
            };
        } else if(expr.type === 'IfStatement'){
            _parse(expr.consequent);
            _parse(expr.alternate);
        } else {
            _parse(expr.expression || expr.callee || expr.body || expr.declarations);
        }
    };
    _parse(expr);
    return expressions;
};

/*
 * comment: |
 *  Parse documentation information from the provided filename argument
 * params:
 *  - name: filename
 *    type: String
 *    comment: filename of the script you wish to parse
 *  - name: options
 *    type: Object
 *    comment: |
 *      Available options:
 *      - tolerant: try to keep parsing the file even if errors are encountered [default: true]
 * returns:
 *  type: Array
 *  comment: a list of doc comments parsed from the source filename
 */
module.exports.parseFile = function(filename, options){
    return module.exports.parseContents(fs.readFileSync(filename, 'utf-8'), options);
};

/*
 * comment: |
 *  Parse documentation information from the provided string content
 *
 *  This function is also available under `docast.parse(contents, options)`
 * params:
 *  - name: contents
 *    type: String
 *    comment: string content to parse docs from
 *  - name: options
 *    type: Object
 *    comment: |
 *      Available options:
 *      - tolerant: try to keep parsing the file even if errors are encountered [default: true]
 * returns:
 *  type: Array
 *  comment: a list of doc comments parsed from the source string contents
 */
module.exports.parseContents = function(contents, options){
    options = options || {};
    var tolerant = (options.tolerant === undefined)? true: options.tolerant;
    var parsed = esprima.parse(contents, {comment: true, loc: true, tolerant: tolerant});
    var expressions = parseExpressions(parsed);

    var results = [];
    parsed.comments.forEach(function(comment){
        if(comment.type === 'Block'){
            var body = comment.value;
            body = body.replace(skip, '');
            data = expressions[comment.loc.end.line + 1] || {};
            data.doc = body;
            results.push(data);
        }
    });

    return results;
};

module.exports.parse = module.exports.parseFile;
module.exports.formatter = require('./formatter');
