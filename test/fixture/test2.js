/*
 * This function is super cool and does all sorts of cool stuffs
 */
function some(cool, stuff){
    if(typeof cool === undefined || typeof stuff === undefined){
        throw new Error('must provide "cool" or "stuff" parameter');
    }

    if(cool > stuff){
        return stuff;
    } else if(stuff > cool){
        return cool;
    } else {
        return null;
    };
}
