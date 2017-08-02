# TypeScript Type Definitions for `http2`

Work-in-progress repository containing type definitions for the nascent `http2` module in Node.js.

## Quick links

* [`http2` Initial Pull Request](https://github.com/nodejs/node/pull/14239)
* [`http2` Docs](https://github.com/nodejs/http2/blob/initial-pr/doc/api/http2.md)
* [`http2` Implementation (source)](https://github.com/nodejs/http2/blob/initial-pr/lib/internal/http2/core.js)
* [Type Definitions for Node.js (source)](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/node/index.d.ts)

## Notes

* The classes in `http2` are currently not publicly exposed. For this reason, they are declared as interfaces rather than classes.
* Most classes inherit `EventEmitter`. The Node.js type definitions contain boilerplate for each distinct event emitted by such a class (see, for example, [`net.Socket` type definitions](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/02ff752907efc578064bdcdc5139d88601129bcd/types/node/index.d.ts#L2374)). While this is a work-in-progress, this boilerplate should not be written directly within `index.d.ts`. Instead, follow the existing convention in `generate-event-declarations.js`, a helper script that will generate these type definitions.
* The keys in `constants` are likely to change in the near future, so they are not yet typed.
