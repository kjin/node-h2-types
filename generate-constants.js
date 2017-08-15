const assert = require('assert')
const { constants } = require('http2')

const keys = Object.keys(constants)

// We get the same result with typeof, but the complexity here can help
// if in the future we would like to impose additional type-enforced
// restrictions on exposed function definitions.
const categoryFilters = {
  Nghttp2Session: {
    predicate: key => key.startsWith('NGHTTP2_SESSION'),
    type: 'number'
  },
  Nghttp2StreamState: {
    predicate: key => key.startsWith('NGHTTP2_STREAM_STATE'),
    type: 'number'
  },
  Nghttp2Flag: {
    predicate: key => key.startsWith('NGHTTP2_FLAG'),
    type: 'number'
  },
  SettingConstant: {
    predicate: key =>
      key.startsWith('NGHTTP2_SETTINGS') ||
      key.startsWith('DEFAULT_SETTINGS') ||
      key.startsWith('MIN') ||
      key.startsWith('MAX') ||
      key === 'NGHTTP2_DEFAULT_WEIGHT',
    type: 'number'
  },
  Nghttp2ErrorCode: {
    predicate: key => key.startsWith('NGHTTP2_ERR'),
    type: 'number'
  },
  Http2ErrorCode: {
    predicate: key => key.startsWith('NGHTTP2') && [
      'Nghttp2Session',
      'Nghttp2StreamState',
      'Nghttp2Flag',
      'SettingConstant',
      'Nghttp2ErrorCode'
    ].reduce((acc, cat) => acc && !categoryFilters[cat].predicate(key), true),
    type: 'number'
  },
  PaddingStrategy: {
    predicate: key => key.startsWith('PADDING_STRATEGY'),
    type: 'number'
  },
  Http2Header: {
    predicate: key => key.startsWith('HTTP2_HEADER'),
    type: 'string'
  },
  Http2Method: {
    predicate: key => key.startsWith('HTTP2_METHOD'),
    type: 'string'
  },
  HttpStatus: {
    predicate: key => key.startsWith('HTTP_STATUS'),
    type: 'number'
  },
}

const result = `export const constants: {\n  ${
  keys.reduce((acc, key) => {
    const satisfiedCategories = Object.keys(categoryFilters).filter(f =>
      categoryFilters[f].predicate(key))
    if (satisfiedCategories.length !== 1) {
      throw new Error(`# of categories satisfying ${key}: ${satisfiedCategories.length}`)
    }
    acc.push(`${key}: ${categoryFilters[satisfiedCategories[0]].type};`)
    return acc
  }, []).join('\n  ')
}\n};`

console.log(result)
