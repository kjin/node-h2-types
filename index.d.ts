declare module "http2" {
  import * as net from "net";
  import * as tls from "tls";
  import * as url from "url";
  import * as stream from "stream";
  import * as events from "events";

  export interface ServerOptions {}
  export interface SecureServerOptions extends ServerOptions {}
  export interface ClientOptions {}
  export interface Constants {}
  export interface Settings {}

  export interface Http2Session extends events.EventEmitter {}
  export interface Http2Stream extends stream.Duplex {}
  export interface ClientHttp2Stream extends Http2Stream {}
  export interface ServerHttp2Stream extends Http2Stream {}
  export interface Http2Server extends net.Server {}
  export interface Http2SecureServer extends tls.Server {}
  export interface Http2ServerRequest extends stream.Readable {}
  export interface Http2ServerResponse extends events.EventEmitter {}

  export var constants: Constants;

  export function getDefaultSettings(): Settings;
  export function getPackedSettings(): Settings;
  export function getUnpackedSettings(): Settings;

  export function createServer(onRequestHandler?: (request: Http2ServerRequest, response: Http2ServerResponse) => void): Http2Server;
  export function createServer(options: ServerOptions, onRequestHandler?: (request: Http2ServerRequest, response: Http2ServerResponse) => void): Http2Server;

  export function createSecureServer(onRequestHandler?: (request: Http2ServerRequest, response: Http2ServerResponse) => void): Http2Server;
  export function createSecureServer(options: SecureServerOptions, onRequestHandler?: (request: Http2ServerRequest, response: Http2ServerResponse) => void): Http2Server;

  export function connect(authority: string | URL, listener?: (session: Http2Session, socket: net.Socket | tls.TLSSocket) => void): Http2Session;
  export function connect(authority: string | URL, options?: ClientOptions, listener?: (session: Http2Session, socket: net.Socket | tls.TLSSocket) => void): Http2Session;
}
