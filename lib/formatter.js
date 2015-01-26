var fs = require('fs');
var jade = require('jade');
var mkdirp = require('mkdirp');
var path = require('path');
var yaml = require('js-yaml');

var Formatter = function(options){
    this.options = options || {};
    this.build = options.build || 'build';
    this.yaml = (options.yaml === undefined)? true : options.yaml;

    var defaultTemplate = path.join(__dirname, 'template.jade');
    this.template = (options.template === undefined)? defaultTemplate : options.template;
    this.renderer = JSON.stringify;
    if(this.template){
        this.renderer = jade.compileFile(this.template);
    }

    var defaultIndexTemplate = path.join(__dirname, 'index.jade');
    this.indexTemplate = (options.indexTemplate === undefined)? defaultIndexTemplate : options.indexTemplate;
    this.indexRenderer = JSON.stringify;
    if(this.indexTemplate){
        this.indexRenderer = jade.compileFile(this.indexTemplate);
    }

    this.output = path.join(process.cwd(), this.build);
    mkdirp.sync(this.output);
};

Formatter.prototype.format = function(data){
    for(var filename in data){
        this.formatFile(filename, data[filename]);
    }
    var data = {
        index: this.buildIndex(this.output),
    };
    fs.writeFileSync(path.join(this.output, 'index.html'), this.indexRenderer(data));
};

Formatter.prototype.buildIndex = function(dir){
    var files = fs.readdirSync(dir);
    var index = [];
    files.forEach(function(filename){
        absFilename = path.join(dir, filename);
        var stats = fs.statSync(absFilename);
        if(stats.isDirectory()){
            index = index.concat(this.buildIndex(absFilename));
        } else {
            index.push(absFilename.replace(this.output + '/', ''));
        }
    }.bind(this));
    return index;
};

Formatter.prototype.formatFile = function(filename, comments){
    var out = path.join(this.output, filename);
    var dir = path.dirname(out);
    var base = path.basename(out, '.js');
    out = path.join(dir, base + '.html');
    mkdirp.sync(path.dirname(out));

    if(this.yaml){
        for(var i in comments){
            comments[i].doc = yaml.safeLoad(comments[i].doc);
        }
    }

    var data = {
        filename: filename,
        comments: comments,
    };
    var rendered = this.renderer(data);
    fs.writeFileSync(out, rendered);
};

module.exports = Formatter;
