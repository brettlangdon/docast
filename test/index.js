var docast = require('../');
var assert = require('assert');

describe('docast', function(){
    describe('#parse(filename)', function(){
        it('should properly parse ./fixture/test1.js', function(){
            var comments = docast.parse(__dirname + '/fixture/test1.js');

            assert.equal(comments.length, 7);

            var wrapper = comments[0];
            assert.ok(~wrapper.doc.indexOf('wrapper'));
            assert.equal(wrapper.name, null);
            assert.deepEqual(wrapper.params, ['global']);
            assert.deepEqual(wrapper.returns, []);
            assert.deepEqual(wrapper.raises, []);

            var func1 = comments[1];
            assert.ok(~func1.doc.indexOf('func1'));
            assert.equal(func1.name, 'func1');
            assert.deepEqual(func1.params, ['arg1', 'arg2']);
            assert.deepEqual(func1.returns, ['string']);
            assert.deepEqual(func1.raises, ['Exception']);

            var func2 = comments[2];
            assert.ok(~func2.doc.indexOf('func2'));
            assert.equal(func2.name, 'func2');
            assert.deepEqual(func2.params, ['arg1', 'arg2']);
            assert.deepEqual(func2.returns, [5]);
            assert.deepEqual(func2.raises, []);

            var class1 = comments[3];
            assert.ok(~class1.doc.indexOf('class1'));
            assert.equal(class1.name, 'class1');
            assert.deepEqual(class1.params, ['options']);
            assert.deepEqual(class1.returns, []);
            assert.deepEqual(class1.raises, []);

            var class1_method1 = comments[4];
            assert.ok(~class1_method1.doc.indexOf('class1.method1'));
            assert.equal(class1_method1.name, 'method1');
            assert.equal(class1_method1.class, 'class1');
            assert.deepEqual(class1_method1.params, ['arg1']);
            assert.deepEqual(class1_method1.returns, []);
            assert.deepEqual(class1_method1.raises, []);

            var class2 = comments[5];
            assert.ok(~class2.doc.indexOf('class2'));
            assert.equal(class2.name, 'class2');
            assert.deepEqual(class2.params, ['options']);
            assert.deepEqual(class2.returns, []);
            assert.deepEqual(class2.raises, []);

            var class2_method1 = comments[6];
            assert.ok(~class2_method1.doc.indexOf('class2.method1'));
            assert.equal(class2_method1.name, 'method1');
            assert.equal(class2_method1.class, 'class2');
            assert.deepEqual(class2_method1.params, ['arg1']);
            assert.deepEqual(class2_method1.returns, []);
            assert.deepEqual(class2_method1.raises, []);
        });
    });
});
