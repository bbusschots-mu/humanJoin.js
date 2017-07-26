# humanJoin.js (@maynoothuniversity/human-join)

A function for converting JavaScript arrays into human-friendly lists, e.g.
`['apples', 'orangess', 'bananas', 'pears']` to
`'apples, oranges, bananas & pears'`.

Both the separator and the conjunction are configurable, and there are built-in
shortcuts for common needs like the so-called
[Oxford Comma](https://en.wikipedia.org/wiki/Serial_comma). The function also
supports wrapping each of the items in the list with a string before they are
joined. If wrapping is requested, it will be default be intelligently mirrored,
so wrapping with `<<` will result in output of the form:
`<<apples>>, <<oranges>>, <<bananas>> & <<pears>>`.

## Installation

### NodeJS

Install the module and its dependencies:

```
npm install '@maynoothuniversity/human-join' --save
```

Load the module:

```
var validateParam = require('@maynoothuniversity/human-join');
```

### Browser (CDN)

```
<!-- Import humanJoin.js -->
<script type="text/javascript" src="https://cdn.rawgit.com/bbusschots-mu/humanJoin.js/master/validateParams.js" ></script>
```

## Synopsis

```
var human = humanJoin(list, [options]);
```

The `list` can be an array or the special `arguments` variable.

The `options` are, as their name suggests, optional, and can either be a single
string as a short-cut to a boolean option, or, an associative array specifying
multiple options.

## Example Usages

```
// sample data
var list = ['apples', 'oranges', 'bananas', 'pears'];

// basic usage
var human = joinHuman(list);
// returns: apples, oranges, bananas & pears

// single boolean option as a string
var oxfordHuman = joinHuman(list, 'oxford');
// returns: apples, oranges, bananas, and pears

// multiple options example 1
var advancedHuman1 = joinHuman(
    list,
    {
        oxfordOr: true,
        quoteWith: '"'
    }
);
// returns: "apples", "oranges", "bananas", or "pears"

// multiple options example 2
var advancedHuman1 = joinHuman(
    list,
    {
        separator: ' or ',
        conjunction: ' or even '
        quoteWith: '['
    }
);
// returns: [apples] or [oranges] or [bananas] or even [pears]
```

## Documentation

* [API Documentation](https://bbusschots-mu.github.io/humanJoin.js/)