var jade = require('jade');
var yaml = require('js-yaml');

module.exports = function(comments){
    for(var i in comments){
        comments[i].doc = yaml.safeLoad(comments[i].doc);
    }

    var render = jade.compileFile('./template.jade');
    console.log(render({comments: comments}));
};
