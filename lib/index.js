var esprima = require('esprima');
var fs = require('fs');

var skip = /^\s+\*/gm;

var mapName = function(elm){
    return elm.name;
};

var findReturns = function(expr){
    var returns = []
    expr.body.forEach(function(expr){
        if(expr.type === 'ReturnStatement'){
            if(expr.argument.type === 'Literal'){
                returns.push(expr.argument.value);
            } else if(expr.argument.type === 'ObjectExpression'){
                returns.push('Object');
            } else if(expr.argument.type === 'ArrayExpression'){
                returns.push('Array');
            } else if(expr.argument.type === 'FunctionExpression'){
                returns.push('Function');
            }
        }
    });
    return returns;
};

var findRaises = function(expr){
    var raises = []
    expr.body.forEach(function(expr){
        if(expr.type === 'ThrowStatement'){
            if(expr.argument.type === 'NewExpression'){
                raises.push(expr.argument.callee.name);
            }
        }
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
        } else {
            _parse(expr.expression || expr.callee || expr.body || expr.declarations);
        }
    };
    _parse(expr);
    return expressions;
};

module.exports.parseFile = function(filename, options){
    return module.exports.parseContents(fs.readFileSync(filename, 'utf-8'), options);
};

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
