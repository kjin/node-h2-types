declare module "http2" {
  import * as events from "events";
  import * as net from "net";
  import * as stream from "stream";
  import * as tls from "tls";
  import * as url from "url";

  type Headers = Object;

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
  
  export interface Http2Stream extends stream.Duplex {
    aborted: boolean;
    destroyed: boolean;
    priority: (options: StreamPriorityOptions) => void;
    rstCode: number;
    rstStream: (code: number) => void;
    rstWithNoError: () => void;
    rstWithProtocolError: () => void;
    rstWithCancel: () => void;
    rstWithRefuse: () => void;
    rstWithInternalError: () => void;
    session: Http2Session;
    setTimeout(msecs: number, callback?: () => void): void;
    state: StreamState;

    // $ node generate-event-declarations.js Http2Stream
  }

  export interface ClientHttp2Stream extends Http2Stream {
    // $ node generate-event-declarations.js ClientHttp2Stream
  }

  export interface ServerHttp2Stream extends Http2Stream { /*TODO*/ }

  ////////////////////////////////////////////////////////////////
  // Http2Session
  ////////////////////////////////////////////////////////////////

  export interface Settings {
    headerTableSize?: number,
    enablePush?: boolean,
    initialWindowSize?: number,
    maxFrameSize?: number,
    maxConcurrentStreams?: number,
    maxHeaderListSize?: number
  }

  export interface ClientSessionRequestOptions {
    endStream?: boolean;
    exclusive?: boolean;
    parent?: number;
    weight?: number;
    getTrailers?: (headers: Headers, flags: number) => void;
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
    destoyed: boolean;
    localSettings: Settings;
    pendingSettingsAck: boolean;
    remotesettings: Settings;
    rstStream(stream: Http2Stream, code?: number): void;
    setTimeout(msecs: number, callback?: () => void): void;
    shutdown(callback?: () => void): void;
    shutdown(options: SessionShutdownOptions, callback?: () => void): void;
    socket: net.Socket | tls.TLSSocket;
    state: SessionState;
    priority(stream: Http2Stream, options: StreamPriorityOptions): void;
    settings(settings: Settings): void;
    type: number;

    // $ node generate-event-declarations.js Http2Session
  }

  export interface ClientHttp2Session extends Http2Session {
    request(headers: Headers, options?: ClientSessionRequestOptions): ClientHttp2Stream;
  }

  export interface ServerHttp2Session extends Http2Session { /*TODO*/ }

  ////////////////////////////////////////////////////////////////
  // Http2Server
  ////////////////////////////////////////////////////////////////

  export interface ServerOptions { /*TODO*/ }
  export interface SecureServerOptions extends ServerOptions { /*TODO*/ }

  export interface Http2Server extends net.Server { /*TODO*/ }
  export interface Http2SecureServer extends tls.Server { /*TODO*/ }
  export interface Http2ServerRequest extends stream.Readable { /*TODO*/ }
  export interface Http2ServerResponse extends events.EventEmitter { /*TODO*/ }

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

  export var constants: {
    [constant: string]: string;
    [constant: string]: number;
  };

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
