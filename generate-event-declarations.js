const [_bin, _script, cliArg] = process.argv

const eventObjects = {
  Http2Session: [
    { event: 'close', args: [] },
    { event: 'connect', args: ['session: ClientHttp2Session', 'socket: net.Socket | tls.TLSSocket'] },
    { event: 'error', args: ['err: Error'] },
    { event: 'frameError', args: ['frameType: number', 'errorCode: number', 'streamID: number'] },
    { event: 'goaway', args: ['errorCode: number', 'lastStreamID: number', 'opaqueData: Buffer'] },
    { event: 'localSettings', args: ['settings: Settings'] },
    { event: 'remoteSettings', args: ['settings: Settings'] },
    { event: 'stream', args: ['stream: Http2Stream', 'headers: Headers', 'flags: number'] },
    { event: 'socketError', args: ['err: Error'] },
    { event: 'timeout', args: [] }
  ],
  Http2Stream: [
    { event: 'aborted', args: [] },
    { event: 'frameError', args: ['frameType: number', 'errorCode: number'] },
    { event: 'streamClosed', args: ['code: number'] },
    { event: 'timeout', args: [] },
    { event: 'trailers', args: ['trailers: Trailers', 'flags: number'] }
  ],
  ClientHttp2Stream: [
    { event: 'headers', args: ['headers: Headers', 'flags: number'] },
    { event: 'push', args: ['headers: Headers', 'flags: number'] },
    { event: 'response', args: ['headers: Headers', 'flags: number'] }
  ],
  Http2Server: [
    { event: 'request', args: ['request: Http2ServerRequest', 'response: Http2ServerResponse'] },
    { event: 'sessionError', args: ['err: Error'] },
    { event: 'socketError', args: ['err: Error'] },
    { event: 'stream', args: ['stream: ServerHttp2Stream', 'headers: Headers', 'flags: number'] },
    { event: 'timeout', args: [] }
  ],
  Http2SecureServer: [
    { event: 'request', args: ['request: Http2ServerRequest', 'response: Http2ServerResponse'] },
    { event: 'sessionError', args: ['err: Error'] },
    { event: 'socketError', args: ['err: Error'] },
    { event: 'stream', args: ['stream: ServerHttp2Stream', 'headers: Headers', 'flags: number'] },
    { event: 'timeout', args: [] },
    { event: 'unknownProtocol', args: ['socket: tls.TLSSocket'] }
  ],
  Http2ServerRequest: [
    { event: 'aborted', args: ['hadError: boolean', 'code: number'] }
  ],
  Http2ServerResponse: [
    { event: 'aborted', args: ['hadError: boolean', 'code: number'] },
    { event: 'close', args: [] },
    { event: 'drain', args: [] },
    { event: 'error', args: ['error: Error'] },
    { event: 'finish', args: [] }
  ]
}

if (!eventObjects[cliArg]) {
  console.log(`Usage: ${_bin} ${_script} (${Object.keys(eventObjects).join('|')})`)
  process.exit(1)
}

const input = eventObjects[cliArg]

const createEmitStatement = x => `emit(event: "${x.event}"${x.args.length>0?', ':''}${x.args.join(', ')}): boolean;`
const createEmitBlock = lx => `emit(event: string | symbol, ...args: any[]): boolean;\n${lx.map(createEmitStatement).join('\n')}`
const createListenerFn = fnName => x => `${fnName}(event: "${x.event}", listener: (${x.args.join(', ')}) => void): this;`
const createListenerBlockFn = fnName => lx => `${fnName}(event: string, listener: (...args: any[]) => void): this;\n${lx.map(createListenerFn(fnName)).join('\n')}`
const createListeners = lx => `${createListenerBlockFn('addListener')(lx)}\n\n${createEmitBlock(lx)}\n\n${['on','once','prependListener','prependOnceListener'].map(s=>createListenerBlockFn(s)(lx)).join('\n\n')}`

console.log(createListeners(input))
