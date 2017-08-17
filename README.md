# TypeScript Type Definitions for `http2`

Work-in-progress repository containing type definitions for the nascent `http2` module in Node.js.

## "Building"

Node 8.4+ required.

```
./bake
```

This generates `http2/index.d.ts`.

Adding `-e` appends to latest `@types/node` definitions, and writes to `index.d.ts` instead.

## Quick links

* [`http2` Docs](https://nodejs.org/api/http2.html)
* [`http2` Implementation (source)](https://github.com/nodejs/node/blob/master/lib/internal/http2/core.js)
* [Type Definitions for Node.js (source)](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/node/index.d.ts)
* [Initial PR for DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/18952)
