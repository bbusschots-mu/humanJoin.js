/**
 * @file Provides the [humanJoin]{@link module:humanJoin} module.
 * @version 0.0.1
 * @author Bart Busschots <bart.busschots@mu.ie>
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
 * @param {string|Object} [options] - an associative array of options, or, the
 * name of one of the short-cut options as a string.
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
 * @param {boolean} [options.and=undefined] - any truthy value acts as a
 * shortcut for `options.conjunction=' and '`
 * @param {boolean} [options.or=undefined] - any truthy value acts as a shortcut
 * for `options.conjunction=' or '`
 * @param {boolean} [options.oxford=undefined] - any truthy value acts as a
 * shortcut for `options.conjunction=', and '`
 * @param {boolean} [options.oxfordAnd=undefined] - any truthy value acts as a
 * shortcut for `options.conjunction=', and '`
 * @param {boolean} [options.oxfordOr=undefined] - any truthy value acts as a
 * shortcut for `options.conjunction=', or '`
 * @returns {string} a string is always returned, though it may be empty or the
 * result of converting a non-string object to a string.
 * @example
 * var list = ['apples', 'oranges', 'pears'];
 *
 * var human = humanJoin(list); // apples, oranges & pears
 *
 * var h2a = humanJoin(list, {and: true}); // apples, oranges and pears
 * var h2b = humanJoin(list, 'and'); // apples, oranges and pears
 *
 * var h3 = humanJoin(list, 'or'); // apples, oranges or pears
 *
 * var h4 = humanJoin(list, 'oxford'); // apples, oranges, and pears
 *
 * var h5 = humanJoin(list, 'oxfordOr'); // apples, oranges, or pears
 *
 * var quoted1 = humanJoin(list, {quoteWith: '"'});
 * // "apples", "oranges" & "pears"
 *
 * var quoted2 = humanJoin(list, {quoteWith: '<<'});
 * // <<apples>>, <<oranges>> & <<pears>>
 *
 * var humanComplex1 = humanJoin(
 *     list,
 *     {
 *         separator: ' or ',
 *         conjunction: ' or even '
 *     }
 * );
 * // apples or oranges or even pears
 *
 * var humanComplex2 = humanJoin(
 *     list,
 *     {
 *         separator: ' or ',
 *         conjunction: false
 *     }
 * );
 * // apples or oranges or pears
 *
 * var humanComplex3 = humanJoin(
 *     list,
 *     {
 *         quoteWith: "'",
 *         oxford: true
 *     }
 * );
 * // 'apples', 'oranges', and 'pears'
 */
var humanJoin = function(list, options){
    // short-circuit non-arrays
    if(!Array.isArray(list) || Object.prototype.toString.call(list) === '[object Arguments]'){
        return String(list);
    }
    
    // short-circuit empty lists
    if(list.length === 0){
        return '';
    }
    
    // make sure we have a sane options object
    if(typeof options === 'string'){
        var newOptions = {};
        newOptions[options] = true;
        options = newOptions;
    }
    if(typeof options !== 'object'){
        options = {};
    }
    
    // set up configuration
    var separator = ', ';
    if(typeof options.separator === 'string' || typeof options.separator === 'number'){
        separator = '' + options.separator; // force to string
    }
    var conjunction = ' & ';
    if(typeof options.conjunction === 'string' || typeof options.conjunction === 'number'){
        conjunction = '' + options.conjunction; // force to string
    }
    if(options.noConjunction){
        conjunction = false;
    }
    var quoteWith = false;
    if(typeof options.quoteWith === 'string' || typeof options.quoteWith === 'number'){
        quoteWith = '' + options.quoteWith; // force to string
    }
    var mirrorQuote = true;
    if(typeof options.mirrorQuote !== 'undefined'){
        mirrorQuote = options.mirrorQuote ? true : false;
    }
    
    // apply any shortcuts specified
    if(options.and){
        conjunction = ' and ';
    }
    if(options.or){
        conjunction = ' or ';
    }
    if(options.oxford || options.oxfordAnd){
        conjunction = ', and ';
    }
    if(options.oxfordOr){
        conjunction = ', or ';
    }
    
    // process the array to quote and stringify as needed
    var stringList = [];
    for(var i = 0; i < list.length; i++){ // for loop rather than forEach to support Arguments objects
        // force to string
        stringList[i] = '' + list[i];
        
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
        if(stringList.length === 1 && conjunction !== false){
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

/**
 * An associative array that maps right-hand characters to their left-hand
 * mirror image:
 *
 * * `!` -> `¡`
 * * `?` -> `¿`
 * * `(` -> `)`
 * * `)` -> `(`
 * * `{` -> `}`
 * * `}` -> `{`
 * * `[` -> `]`
 * * `]` -> `[`
 * * `<` -> `>`
 * * `>` -> `<`
 * 
 * @alias module:humanJoin.mirrorMap
 * @const
 * @type {Object.<string, string>}
 */
humanJoin.mirrorMap = {
    '!' : '¡',
    '?' : '¿',
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

/**
 * Mirrors a single character if possible.
 *
 * If `c` has a mapping defined in
 * [humanJoin.mirrorMap]{@link module:humanJoin.mirrorMap}, then the mirrored
 * character is returned, otherwise, the original character is returned.
 *
 * Note that mirroring a value that is not a string or a number will result in
 * an empty string being returned, and that strings containing more than one
 * letter will be truncated to their first letter before being mirrored.
 *
 * @alias module:humanJoin.mirrorCharacter
 * @param {string} c - the character to be mirrored
 * @returns {string}
 * @example
 * var revable = humanJoin.mirrorCharacter('<'); // >
 * var notrevable = humanJoin.mirrorCharacter('+'); // +
 */
humanJoin.mirrorCharacter = function(c){
    // short-circuit non-strings
    if(!(typeof c === 'string' || typeof c === 'number')){
        return '';
    }
    
    // short-circuit empty strings
    if(c.length < 1){
        return '';
    }
    
    // convert numbers to strings
    c = '' + c;
    
    // shorten long strings to single characters
    if(c.length > 1){
        c = c.substring(0, 1);
    }
    
    // if there is a mirror mapping, return that, otherwise, return the character itself
    return typeof humanJoin.mirrorMap[c] === 'string' ? humanJoin.mirrorMap[c] : c;
}

/**
 * Mirrors a string. First, the character order will be reversed, then, each
 * character is run through
 * [humanJoin.mirrorCharacter()]{@link module:humanJoin.mirrorCharacter} to
 * replace mirrorable characters with their mirrored versions (the mappings for
 * which are defined in
 * [humanJoin.mirrorMap]{@link module:humanJoin.mirrorMap}).
 *
 * Note that attempts to mirror values that are not strings or numbers will
 * result in the empty string being returned.
 *
 * @alias module:humanJoin.mirrorString
 * @param {string} str - the string to be mirrored
 * @returns {string}
 * @example
 * var rev1 = humanJoin.mirrorString('<'); // >
 * var rev2 = humanJoin.mirrorString('<<'); // >>
 * var rev3 = humanJoin.mirrorString('-<'); // >-
 * var rev4 = humanJoin.mirrorString('--+'); // +--
 */
humanJoin.mirrorString = function(str){
    // short-circuit non-strings
    if(!(typeof str === 'string' || typeof str === 'number')){
        return '';
    }
    
    // convert numbers to strings
    str = '' + str;
    
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