/**
 * @file Provides the [humanJoin]{@link module:humanJoin} module.
 * @version 0.0.1
 * @author Bart Busschots bart.busschots@mu.ie
 * @license MIT
 * @see https://github.com/bbusschots-mu/humanJoin.js
 */

/**
 * A module for converting JavaScript lists into human-friendly strings, e.g.
 * `['apples', 'oranges', 'pears']` to `'apples, oranges & pears'` or
 * `'apples, oranges and pears'`, or even `'apples, oranges, and pears'` if
 * you're a fan of the so-called
 * [Oxford Comma]{@link https://en.wikipedia.org/wiki/Serial_comma}.
 *
 * This module exports its functionality as a single function which contains
 * further helper functions as properties.
 * 
 * @module humanJoin
 */

//
//=== Define the Main Function =================================================
//

/**
 * A function for validating the parameters to a function.
 *
 * This is a wrapper around the [validate()]{@link external:validate} function
 * from [validate.js]{@link https://validatejs.org/#validate}. Both the values
 * to be tested and the constraints they should be tested against are specified
 * using arrays (or array-like objects) rather than associative arrays as
 * expected by [validate()]{@link external:validate}. The function assembles the
 * specified values and constraints into associative arrays using the names
 * `param1`, `param2` etc..
 *
 * @alias humanJoin
 * @param {Arguments|string[]} list - a list of strings to join, can be an
 * `Arguments` object, but would normally be an array.
 * @param {Object} [options] - an associative array of options.
 * @param {string} [options.separator=', '] - the separator to use between
 * elements in the list.
 * @param {string} [options.conjunction=' & '] - the special separator to use
 * between the last two elements in the list.
 * @param {boolean} [options.noConjunction=false] - a truthy value to suppress
 * use of the conjunction between the last two elements in the list, the regular
 * separator will be used instead.
 * @param {boolean|string} [options.quoteWith=false] - an optional string to
 * quote each element of the list with before joining, or `false` to indicate
 * no quoting should occour.
 * @param {boolean} [options.mirrorQuote=true] - whether or not to mirror the
 * string used to quote each element of the list before joining. Multi-character
 * strings will have their character order reversed to the right of the item
 * being quoted, and characters that have an obvious mirror will
 * be replaced with their mirrored version, e.g. `(<` becomes `>)`. This setting
 * has no effect if `options.mirrorQuote` is `false`;
 * @returns {string} a string is always returned, though it may be empty or the
 * result of converting a non-string object to a string.
 * @example
 * TO DO
 */
var humanJoin = function(list, options){
    // short-circuit non-arrays
    if(!Array.isArray(list) || list instanceof Arguments){
        return String(list);
    }
    
    // short-circuit empty lists
    if(list.length === 0){
        return '';
    }
    
    // make sure we have a sane options object
    if(typeof options !== 'object'){
        options = {};
    }
    
    // set up configuration
    var separator = typeof options.separator === 'string' ? options.separator : ', ';
    var conjunction = typeof options.conjunction === 'string' ? options.conjunction : ' & ';
    if(options.noConjunction){
        conjunction = false;
    }
    var quoteWith = typeof options.quoteWith === 'string' ? options.quoteWith : false;
    var mirrorQuote = true;
    if(typeof options.mirrorQuote !== 'undefined'){
        mirrorQuote = options.mirrorQuote ? true : false;
    }
    
    // process the array to quote and stringify as needed
    var stringList = [];
    for(var i = 0; i < list.length; i++){ // for loop rather than forEach to support Arguments objects
        // convert to a string if needed
        if(typeof list[i] === 'string'){
            stringList[i] = list[i];
        }else{
            stringList[i] = String(list[i]);
        }
        
        // quote if needed
        if(quoteWith){
            if(mirrorQuote){
                stringList[i] = quoteWith + stringList[i] + humanJoin.mirrorString(quoteWith);
            }else{
                stringList[i] = quoteWith + stringList[i] + quoteWith;
            }
        }
    }
    
    // generate the human-friendly string
    var ans = stringList.shift();
    while(stringList.length){
        if(stringList.length === 1 && conjunction){
            ans += conjunction;
        }else{
            ans += separator;
        }
        ans += stringList.shift();
    }
    
    // return the generated string
    return ans;
};

//
//=== Helper Data Structures ===================================================
//

humanJoin.mirrorMap = {
    '!' : 'Á',
    '?' : 'À',
    '(' : ')',
    ')' : '(',
    '{' : '}',
    '}' : '{',
    '[' : ']',
    ']' : '[',
    '<' : '>',
    '>' : '<'
};

//
//=== Helper Functions =========================================================
//

humanJoin.mirrorCharacter = function(c){
    // short-circuit non-strings
    if(typeof c !== 'string'){
        return '';
    }
    
    // short-circuit empty strings
    if(c.length < 1){
        return '';
    }
    
    // shorten long strings to single characters
    if(c.length > 1){
        c = c.substring(0, 1);
    }
    
    // if there is a mirror mapping, return that, otherwise, return the character itself
    return typeof humanJoin.mirrorMap[c] === 'string' ? humanJoin.mirrorMap[c] : c;
}

humanJoin.mirrorString = function(str){
    // short-circuit non-strings
    if(typeof str !== 'string'){
        return '';
    }
    
    // build up the mirror
    var ans = '';
    str.split('').reverse().forEach(function(c){
        ans += humanJoin.mirrorCharacter(c);
    });
    
    //return the mirrored string
    return ans;
};

//
//=== Export the Module ========================================================
//

// If we're in a Node environment, export the function
if(module){
    module.exports = humanJoin;
}