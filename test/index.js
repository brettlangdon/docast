var docast = require('../');
var assert = require('assert');

describe('docast', function(){
    describe('#parse(filename)', function(){
        it('should properly parse ./fixture/test1.js', function(){
            var comments = docast.parse(__dirname + '/fixture/test1.js');

            assert.equal(comments.length, 7);

            var wrapper = comments[0];
            assert.ok(~wrapper.doc.indexOf('wrapper'));
            assert.equal(wrapper.data.name, null);
            assert.deepEqual(wrapper.data.params, ['global']);
            assert.deepEqual(wrapper.data.returns, []);
            assert.deepEqual(wrapper.data.raises, []);

            var func1 = comments[1];
            assert.ok(~func1.doc.indexOf('func1'));
            assert.equal(func1.data.name, 'func1');
            assert.deepEqual(func1.data.params, ['arg1', 'arg2']);
            assert.deepEqual(func1.data.returns, ['string']);
            assert.deepEqual(func1.data.raises, ['Exception']);

            var func2 = comments[2];
            assert.ok(~func2.doc.indexOf('func2'));
            assert.equal(func2.data.name, 'func2');
            assert.deepEqual(func2.data.params, ['arg1', 'arg2']);
            assert.deepEqual(func2.data.returns, [5]);
            assert.deepEqual(func2.data.raises, []);

            var class1 = comments[3];
            assert.ok(~class1.doc.indexOf('class1'));
            assert.equal(class1.data.name, 'class1');
            assert.deepEqual(class1.data.params, ['options']);
            assert.deepEqual(class1.data.returns, []);
            assert.deepEqual(class1.data.raises, []);

            var class1_method1 = comments[4];
            assert.ok(~class1_method1.doc.indexOf('class1.method1'));
            assert.equal(class1_method1.data.name, 'method1');
            assert.equal(class1_method1.data.class, 'class1');
            assert.deepEqual(class1_method1.data.params, ['arg1']);
            assert.deepEqual(class1_method1.data.returns, []);
            assert.deepEqual(class1_method1.data.raises, []);

            var class2 = comments[5];
            assert.ok(~class2.doc.indexOf('class2'));
            assert.equal(class2.data.name, 'class2');
            assert.deepEqual(class2.data.params, ['options']);
            assert.deepEqual(class2.data.returns, []);
            assert.deepEqual(class2.data.raises, []);

            var class2_method1 = comments[6];
            assert.ok(~class2_method1.doc.indexOf('class2.method1'));
            assert.equal(class2_method1.data.name, 'method1');
            assert.equal(class2_method1.data.class, 'class2');
            assert.deepEqual(class2_method1.data.params, ['arg1']);
            assert.deepEqual(class2_method1.data.returns, []);
            assert.deepEqual(class2_method1.data.raises, []);
        });
    });
});
