function CustomError(message) {
    this.message = (message || '');
}
CustomError.prototype = new Error();

/*
 * This function will raise some exceptions
 */
function raises(){
    if(true){
        throw new Error('message');
    } else if(false){
        throw 'string';
    } else {
        var e = new Error('message');
        throw e;
    }
    var i = 0;
    while(i < 1){
        throw true;
        ++i;
    }

    try{
        raisesExceptions(true);
    }catch(e){
        throw new CustomError('message');
    }
    throw new CustomError('message');
}
