//
// === Setup and other Prep Work ===============================================
//

// import the module under test
var humanJoin = require('../');

// some dummy data for use in tests
var DUMMY_DATA = {
    'empty string' : '',
    'string' : 'stuff',
    'zero' : 0,
    'number' : 4,
    'boolean' : false,
    'array' : ['stuff', 'thingys'],
    'plain object' : { stuff: 'whatsits' },
    'prototyped object' : new Date(),
    'function' : function(){ return true; }
};
var STRINGY_DATA_NAMES = [ 'empty string', 'string', 'zero', 'number'];
var NONSTRINGY_DATA_NAMES = [ 'boolean', 'array', 'plain object', 'prototyped object', 'function'];

//
// === The Tests ===============================================================
//

QUnit.module('humanJoin() function',
    {
        beforeEach: function(){
            this.list = ['apples', 'oranges', 'bananas', 'pears'];
        }
    },
    function(){
        QUnit.test('function exists', function(a){
            a.equal(typeof humanJoin, 'function');
        });
        
        QUnit.test('default configuration', function(a){
            a.expect(2);
            a.equal(humanJoin(this.list), 'apples, oranges, bananas & pears', 'regular strings joined as expected');
            a.equal(humanJoin([0, 4, 42, 3.5, -1, -42, -42.5]), '0, 4, 42, 3.5, -1, -42 & -42.5', 'list of numbers joined as expected');
        });
        
        QUnit.test('separator option', function(a){
            a.expect(3);
            a.equal(
                humanJoin(this.list, {separator: '; '}),
                'apples; oranges; bananas & pears',
                'custom separator works with regular string'
            );
            a.equal(
                humanJoin(this.list, {separator: ''}),
                'applesorangesbananas & pears',
                'custom separator works with empty string'
            );
            a.equal(
                humanJoin(this.list, {separator: 0}),
                'apples0oranges0bananas & pears',
                'custom separator works with number'
            );
        });
        
        QUnit.test('conjunction option', function(a){
            a.expect(3);
            a.equal(
                humanJoin(this.list, {conjunction: ' as well as '}),
                'apples, oranges, bananas as well as pears',
                'custom conjunction works with regular string'
            );
            a.equal(
                humanJoin(this.list, {conjunction: ''}),
                'apples, oranges, bananaspears',
                'custom conjunction works with empty string'
            );
            a.equal(
                humanJoin(this.list, {conjunction: 0}),
                'apples, oranges, bananas0pears',
                'custom conjunction works with number'
            );
        });
        
        QUnit.test('noConjunction option', function(a){
            a.expect(3);
            a.equal(
                humanJoin(this.list, {noConjunction: true}),
                'apples, oranges, bananas, pears',
                'when true, conjunction is not used'
            );
            a.equal(
                humanJoin(this.list, {noConjunction: false}),
                'apples, oranges, bananas & pears',
                'when false, conjunction is used as normal'
            );
            a.equal(
                humanJoin(this.list, 'noConjunction'),
                'apples, oranges, bananas, pears',
                'string shortcut works'
            );
        });
        
        QUnit.test('quoteWith option', function(a){
            a.expect(7);
            a.equal(
                humanJoin(this.list, {quoteWith: '"'}),
                '"apples", "oranges", "bananas" & "pears"',
                'quoting works with single non-reversible character'
            );
            a.equal(
                humanJoin(this.list, {quoteWith: '<'}),
                '<apples>, <oranges>, <bananas> & <pears>',
                'quoting works with single reversible character'
            );
            a.equal(
                humanJoin(this.list, {quoteWith: '_-'}),
                '_-apples-_, _-oranges-_, _-bananas-_ & _-pears-_',
                'quoting works with multiple non-reversible characters'
            );
            a.equal(
                humanJoin(this.list, {quoteWith: '<('}),
                '<(apples)>, <(oranges)>, <(bananas)> & <(pears)>',
                'quoting works with multiple reversible characters'
            );
            a.equal(
                humanJoin(this.list, {quoteWith: '+('}),
                '+(apples)+, +(oranges)+, +(bananas)+ & +(pears)+',
                'quoting works with multiple characters, some reversible, some not'
            );
            a.equal(
                humanJoin(this.list, {quoteWith: ''}),
                'apples, oranges, bananas & pears',
                'quoting works with empty string'
            );
            a.equal(
                humanJoin(this.list, {quoteWith: 0}),
                '0apples0, 0oranges0, 0bananas0 & 0pears0',
                'quoting works with number'
            );
        });
        
        QUnit.test('mirrorQuote option', function(a){
            a.expect(4);
            a.equal(
                humanJoin(this.list, {
                    quoteWith: '<',
                    mirrorQuote: true,
                }),
                '<apples>, <oranges>, <bananas> & <pears>',
                'single reversible character is reversed when set true'
            );
            a.equal(
                humanJoin(this.list, {
                    quoteWith: '<',
                    mirrorQuote: false,
                }),
                '<apples<, <oranges<, <bananas< & <pears<',
                'single reversible character is not reversed when set false'
            );
            a.equal(
                humanJoin(this.list, {
                    quoteWith: '-<',
                    mirrorQuote: true,
                }),
                '-<apples>-, -<oranges>-, -<bananas>- & -<pears>-',
                'multiple characters reversed when set true'
            );
            a.equal(
                humanJoin(this.list, {
                    quoteWith: '-<',
                    mirrorQuote: false,
                }),
                '-<apples-<, -<oranges-<, -<bananas-< & -<pears-<',
                'multiple characters not reversed when set false'
            );
        });
        
        QUnit.test("'and' option", function(a){
            a.expect(2);
            a.equal(
                humanJoin(this.list, {and: true}),
                'apples, oranges, bananas and pears',
                "shortcut works as object key"
            );
            a.equal(
                humanJoin(this.list, 'and'),
                'apples, oranges, bananas and pears',
                'shortcut works as string'
            );
        });
        
        QUnit.test("'or' option", function(a){
            a.expect(2);
            a.equal(
                humanJoin(this.list, {or: true}),
                'apples, oranges, bananas or pears',
                "shortcut works as object key"
            );
            a.equal(
                humanJoin(this.list, 'or'),
                'apples, oranges, bananas or pears',
                'shortcut works as string'
            );
        });
        
        QUnit.test("'oxford' AKA 'oxfordAnd' option", function(a){
            a.expect(4);
            a.equal(
                humanJoin(this.list, {oxford: true}),
                'apples, oranges, bananas, and pears',
                "'oxford' shortcut works as object key"
            );
            a.equal(
                humanJoin(this.list, 'oxford'),
                'apples, oranges, bananas, and pears',
                "'oxford' shortcut works as string"
            );
            a.equal(
                humanJoin(this.list, {oxfordAnd: true}),
                'apples, oranges, bananas, and pears',
                "oxfordAnd works as object key"
            );
            a.equal(
                humanJoin(this.list, 'oxfordAnd'),
                'apples, oranges, bananas, and pears',
                "'oxfordAnd' shortcut works as string"
            );
        });
        
        QUnit.test('oxfordOr option', function(a){
            a.expect(2);
            a.equal(
                humanJoin(this.list, {oxfordOr: true}),
                'apples, oranges, bananas, or pears',
                'shortcut works as object key'
            );
            a.equal(
                humanJoin(this.list, 'oxfordOr'),
                'apples, oranges, bananas, or pears',
                'shortcut works as string'
            );
        });
    }
);

QUnit.module('humanJoin.mirrorCharacter() function', {},
    function(){
        QUnit.test('function exists', function(a){
            a.equal(typeof humanJoin.mirrorCharacter, 'function');
        });
        
        QUnit.test('un-reversible characters are returned as passed', function(a){
            a.equal(humanJoin.mirrorCharacter('f'), 'f');
        });
        
        QUnit.test('reversible characters are reversed', function(a){
            a.equal(humanJoin.mirrorCharacter('<'), '>');
        });
        
        QUnit.test('string-like inputs processed as expected', function(a){
            a.expect(STRINGY_DATA_NAMES.length);
            STRINGY_DATA_NAMES.forEach(function(dtn){
                a.equal(
                    humanJoin.mirrorCharacter(DUMMY_DATA[dtn]),
                    (DUMMY_DATA[dtn] + '').slice(0, 1),
                    dtn + ' treated as string'
                );
            });
        });
        
        QUnit.test('invalid data returns empty string', function(a){
            var shouldReturnEmptyStr = NONSTRINGY_DATA_NAMES.concat(['empty string']);
            a.expect(shouldReturnEmptyStr.length);
            shouldReturnEmptyStr.forEach(function(dtn){
                a.equal(
                    humanJoin.mirrorCharacter(DUMMY_DATA[dtn]),
                    '',
                    dtn + ' returns empty string'
                );
            });
        });
        
        QUnit.test('long strings are truncated', function(a){
            a.expect(2);
            a.equal(
                humanJoin.mirrorCharacter('four'),
                'f',
                'long string starting with un-reversible character returns first character'
            );
            a.equal(
                humanJoin.mirrorCharacter('<five'),
                '>',
                'long string starting with reversible character returns first character reversed'
            );
        });
    }
);

QUnit.module('humanJoin.mirrorString() function', {},
    function(){
        QUnit.test('function exists', function(a){
            a.equal(typeof humanJoin.mirrorString, 'function');
        });
        
        QUnit.test('single-character reversible string', function(a){
            a.equal(humanJoin.mirrorString('<'), '>');
        });
        
        QUnit.test('single-character non-reversible string', function(a){
            a.equal(humanJoin.mirrorString('f'), 'f');
        });
        
        QUnit.test('multi-character reversible string', function(a){
            a.equal(humanJoin.mirrorString('<('), ')>');
        });
        
        QUnit.test('multi-character non-reversible string', function(a){
            a.equal(humanJoin.mirrorString('-+'), '+-');
        });
        
        QUnit.test('multi-character mixed string', function(a){
            a.equal(humanJoin.mirrorString('-+('), ')+-');
        });
        
        QUnit.test('string-like inputs processed as expected', function(a){
            a.expect(STRINGY_DATA_NAMES.length);
            STRINGY_DATA_NAMES.forEach(function(dtn){
                a.equal(
                    humanJoin.mirrorString(DUMMY_DATA[dtn]),
                    (DUMMY_DATA[dtn] + '').split('').reverse().join(''),
                    dtn + ' treated as string'
                );
            });
        });
        
        QUnit.test('invalid data returns empty string', function(a){
            var shouldReturnEmptyStr = NONSTRINGY_DATA_NAMES.concat(['empty string']);
            a.expect(shouldReturnEmptyStr.length);
            shouldReturnEmptyStr.forEach(function(dtn){
                a.equal(
                    humanJoin.mirrorString(DUMMY_DATA[dtn]),
                    '',
                    dtn + ' returns empty string'
                );
            });
        });
    }
);