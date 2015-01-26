/*
 * wrapper
 */
(function(global){
    /*
     * func1
     */
    function func1(arg1, arg2){
        throw new Error('hello');
        return 'string';
    }

    /*
     * func2
     */
    var func2 = function(arg1, arg2){
        // return 5
        return 5;
    }

    /*
     * class1
     */
    function class1(options){
    }
    /*
     * class1.method1
     */
    class1.prototype.method1 = function(arg1){
    };

    /*
     * class2
     */
    var class2 = function(options){
    };
    /*
     *  class2.method1
     */
    class2.prototype.method1 = function(arg1){
    };
})(this);
