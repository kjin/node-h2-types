declare module "http2" {
  import * as events from "events";
  import * as fs from "fs";
  import * as net from "net";
  import * as stream from "stream";
  import * as tls from "tls";
  import * as url from "url";

  type Headers = Object;
  type Trailers = Headers;

  ////////////////////////////////////////////////////////////////
  // Http2Stream
  ////////////////////////////////////////////////////////////////

  export interface StreamPriorityOptions {
    exclusive?: boolean;
    parent?: number;
    weight?: number;
    silent?: boolean;
  }

  export interface StreamState {
    localWindowSize?: number;
    state?: number;
    streamLocalClose?: number;
    streamRemoteClose?: number;
    sumDependencyWeight?: number;
    weight?: number;
  }

  export interface ServerStreamResponseOptions {
    endStream?: boolean;
    getTrailers?: (trailers: Trailers) => void;
  }

  export interface StatOptions {
    offset: number;
    length: number;
  }

  export interface ServerStreamFileResponseOptions {
    statCheck?: (stats: fs.Stats, headers: Headers, statOptions: StatOptions) => void;
    getTrailers?: (trailers: Trailers) => void;
    offset?: number;
    length?: number;
  }
  
  export interface Http2Stream extends stream.Duplex {
    readonly aborted: boolean;
    readonly destroyed: boolean;
    priority(options: StreamPriorityOptions): void;
    readonly rstCode: number;
    rstStream(code: number): void;
    rstWithNoError(): void;
    rstWithProtocolError(): void;
    rstWithCancel(): void;
    rstWithRefuse(): void;
    rstWithInternalError(): void;
    readonly session: Http2Session;
    setTimeout(msecs: number, callback?: () => void): void;
    readonly state: StreamState;

    // $ node generate-event-declarations.js Http2Stream
  }

  export interface ClientHttp2Stream extends Http2Stream {
    // $ node generate-event-declarations.js ClientHttp2Stream
  }

  export interface ServerHttp2Stream extends Http2Stream {
    additionalHeaders(headers: Headers): void;
    readonly headersSent: boolean;
    readonly pushAllowed: boolean;
    pushStream(headers: Headers, callback?: (pushStream: ServerHttp2Stream) => void): void;
    pushStream(headers: Headers, options?: StreamPriorityOptions, callback?: (pushStream: ServerHttp2Stream) => void): void;
    respond(headers?: Headers, options?: ServerStreamResponseOptions): void;
    respondWithFD(fd: number, headers?: Headers, options?: ServerStreamResponseOptions): void;
    respondWithFD(path: string, headers?: Headers, options?: ServerStreamResponseOptions): void;
  }

  ////////////////////////////////////////////////////////////////
  // Http2Session
  ////////////////////////////////////////////////////////////////

  export interface Settings {
    headerTableSize?: number;
    enablePush?: boolean;
    initialWindowSize?: number;
    maxFrameSize?: number;
    maxConcurrentStreams?: number;
    maxHeaderListSize?: number;
  }

  export interface ClientSessionRequestOptions {
    endStream?: boolean;
    exclusive?: boolean;
    parent?: number;
    weight?: number;
    getTrailers?: (trailers: Trailers, flags: number) => void;
  }

  export interface SessionShutdownOptions {
    graceful?: boolean;
    errorCode?: number;
    lastStreamID?: number;
    opaqueData?: Buffer | Array<number>;
  }

  export interface SessionState {
    effectiveLocalWindowSize?: number;
    effectiveRecvDataLength?: number;
    nextStreamID?: number;
    localWindowSize?: number;
    lastProcStreamID?: number;
    remoteWindowSize?: number;
    outboundQueueSize?: number;
    deflateDynamicTableSize?: number;
    inflateDynamicTableSize?: number;
  }

  export interface Http2Session extends events.EventEmitter {
    destroy(): void;
    readonly destroyed: boolean;
    readonly localSettings: Settings;
    readonly pendingSettingsAck: boolean;
    readonly remoteSettings: Settings;
    rstStream(stream: Http2Stream, code?: number): void;
    setTimeout(msecs: number, callback?: () => void): void;
    shutdown(callback?: () => void): void;
    shutdown(options: SessionShutdownOptions, callback?: () => void): void;
    readonly socket: net.Socket | tls.TLSSocket;
    readonly state: SessionState;
    priority(stream: Http2Stream, options: StreamPriorityOptions): void;
    settings(settings: Settings): void;
    readonly type: number; /* TODO */

    // $ node generate-event-declarations.js Http2Session
  }

  export interface ClientHttp2Session extends Http2Session {
    request(headers: Headers, options?: ClientSessionRequestOptions): ClientHttp2Stream;
  }

  export interface ServerHttp2Session extends Http2Session {
    readonly server: Http2Server | Http2SecureServer;
  }

  ////////////////////////////////////////////////////////////////
  // Http2Server
  ////////////////////////////////////////////////////////////////

  export interface ServerOptions { /*TODO*/ }
  export interface SecureServerOptions extends ServerOptions { /*TODO*/ }

  export interface Http2Server extends net.Server {
    // $ node generate-event-declarations.js Http2Server
  }

  export interface Http2SecureServer extends tls.Server {
    // $ node generate-event-declarations.js Http2SecureServer
  }

  export interface Http2ServerRequest extends stream.Readable {
    destroy(err: Error): void;
    headers: Headers;
    httpVersion: string;
    method: string;
    rawHeaders: Array<string>;
    rawTrailers: Array<string>;
    setTimeout(msecs: number, callback?: () => void): void;
    socket: net.Socket | tls.TLSSocket;
    stream: ServerHttp2Stream;
    trailers: Trailers;
    url: string;

    // $ node generate-event-declarations.js Http2ServerRequest
  }

  export interface Http2ServerResponse extends events.EventEmitter {
    addTrailers(trailers: Trailers);
    connection: net.Socket | tls.TLSSocket;
    end(callback?: () => void);
    end(data?: string | Buffer, callback?: () => void);
    end(data?: string | Buffer, encoding?: string, callback?: () => void);
    finished: boolean;
    getHeader(name: string): string;
    getHeaderNames(): Array<string>;
    getHeaders(): Headers;
    hasHeader(name: string): boolean;
    readonly headersSent: boolean;
    removeHeader(name: string): void;
    sendDate: boolean;
    setHeader(name: string, value: string | Array<string>): void;
    setTimeout(msecs: number, callback?: () => void): void;
    socket: net.Socket | tls.TLSSocket;
    statusCode: number;
    statusMessage: '';
    stream: ServerHttp2Stream;
    write(chunk: string | Buffer, callback?: (err: Error) => void): boolean;
    write(chunk: string | Buffer, encoding?: string, callback?: (err: Error) => void): boolean;
    writeContinue(): void;
    writeHead(statusCode: number, headers?: Headers): void;
    writeHead(statusCode: number, statusMessage?: string, headers?: Headers): void;
    createPushResponse(headers: Headers, callback?: (err: Error) => void): void;

    // $ node generate-event-declarations.js Http2ServerResponse
  }

  export interface ClientSessionOptions {
    maxDeflateDynamicTableSize?: number;
    maxReservedRemoteStreams?: number;
    maxSendHeaderBlockLength?: number;
    paddingStrategy?: number;
    peerMaxConcurrentStreams?: number;
    selectPadding?: (frameLen: number, maxFrameLen: number) => number;
    settings?: Settings;
  }

  ////////////////////////////////////////////////////////////////
  // Public API
  ////////////////////////////////////////////////////////////////

  // $ echo '$NODE_H2 --expose-http2 generate-constants.js' | bash

  export function getDefaultSettings(): Settings;
  export function getPackedSettings(): Settings;
  export function getUnpackedSettings(): Settings;

  export function createServer(onRequestHandler?: (request: Http2ServerRequest, response: Http2ServerResponse) => void): Http2Server;
  export function createServer(options: ServerOptions, onRequestHandler?: (request: Http2ServerRequest, response: Http2ServerResponse) => void): Http2Server;

  export function createSecureServer(onRequestHandler?: (request: Http2ServerRequest, response: Http2ServerResponse) => void): Http2Server;
  export function createSecureServer(options: SecureServerOptions, onRequestHandler?: (request: Http2ServerRequest, response: Http2ServerResponse) => void): Http2Server;

  export function connect(authority: string | URL, listener?: (session: ClientHttp2Session, socket: net.Socket | tls.TLSSocket) => void): ClientHttp2Session;
  export function connect(authority: string | URL, options?: ClientSessionOptions, listener?: (session: ClientHttp2Session, socket: net.Socket | tls.TLSSocket) => void): ClientHttp2Session;
}
