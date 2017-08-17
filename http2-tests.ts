import * as events from 'events';
import * as fs from 'fs';
import * as http2 from 'http2';
import * as net from 'net';
import * as stream from 'stream';
import * as tls from 'tls';
import * as url from 'url';

namespace http2_tests {
  // Http2Session
  {
    let http2Session: http2.Http2Session;
    let ee: events.EventEmitter = http2Session;

    http2Session.on('close', () => {});
    http2Session.on('connect', (session: http2.Http2Session, socket: net.Socket) => {});
    http2Session.on('error', (err: Error) => {});
    http2Session.on('frameError', (frameType: number, errorCode: number, streamID: number) => {});
    http2Session.on('goaway', (errorCode: number, lastStreamID: number, opaqueData: Buffer) => {});
    http2Session.on('localSettings', (settings: http2.Settings) => {});
    http2Session.on('remoteSettings', (settings: http2.Settings) => {});
    http2Session.on('stream', (stream: http2.Http2Stream, headers: http2.IncomingHttpHeaders, flags: number) => {});
    http2Session.on('socketError', (err: Error) => {});
    http2Session.on('timeout', () => {});

    http2Session.destroy();

    let destroyed: boolean = http2Session.destroyed;
    let pendingSettingsAck: boolean = http2Session.pendingSettingsAck;
    let settings: http2.Settings = http2Session.localSettings;
    settings = http2Session.remoteSettings;
    settings = {
      headerTableSize: 0,
      enablePush: true,
      initialWindowSize: 0,
      maxFrameSize: 0,
      maxConcurrentStreams: 0,
      maxHeaderListSize: 0
    };

    let headers: http2.OutgoingHttpHeaders = {
      ':status': 200,
      single: '',
      list: ['', ''],
      undef: undefined
    };
    let options: http2.ClientSessionRequestOptions = {
      endStream: true,
      exclusive: true,
      parent: 0,
      weight: 0,
      getTrailers: (trailers: http2.IncomingHttpHeaders) => {}
    };
    (http2Session as http2.ClientHttp2Session).request();
    (http2Session as http2.ClientHttp2Session).request(headers);
    (http2Session as http2.ClientHttp2Session).request(headers, options);

    let stream: http2.Http2Stream;
    http2Session.rstStream(stream);
    http2Session.rstStream(stream, 0);

    http2Session.setTimeout(100, () => {});

    let shutdownOptions: http2.SessionShutdownOptions = {
      graceful: true,
      errorCode: 0,
      lastStreamID: 0,
      opaqueData: Buffer.from([])
    };
    shutdownOptions.opaqueData = Uint8Array.from([]);
    http2Session.shutdown(shutdownOptions);
    http2Session.shutdown(shutdownOptions, () => {});

    let socket: net.Socket | tls.TLSSocket = http2Session.socket;
    let state: http2.SessionState = http2Session.state;
    state = {
      effectiveLocalWindowSize: 0,
      effectiveRecvDataLength: 0,
      nextStreamID: 0,
      localWindowSize: 0,
      lastProcStreamID: 0,
      remoteWindowSize: 0,
      outboundQueueSize: 0,
      deflateDynamicTableSize: 0,
      inflateDynamicTableSize: 0
    };

    http2Session.priority(stream, {
      exclusive: true,
      parent: 0,
      weight: 0,
      silent: true
    });

    http2Session.settings(settings);
  }

  // Http2Stream
  {
    let http2Stream: http2.Http2Stream;
    let duplex: stream.Duplex = http2Stream;

    http2Stream.on('aborted', () => {});
    http2Stream.on('error', (err: Error) => {});
    http2Stream.on('frameError', (frameType: number, errorCode: number, streamID: number) => {});
    http2Stream.on('streamClosed', (code: number) => {});
    http2Stream.on('timeout', () => {});
    http2Stream.on('trailers', (trailers: http2.IncomingHttpHeaders, flags: number) => {});

    let aborted: boolean = http2Stream.aborted;
    let destroyed: boolean = http2Stream.destroyed;

    http2Stream.priority({
      exclusive: true,
      parent: 0,
      weight: 0,
      silent: true
    });

    let rstCode: number = http2Stream.rstCode;
    http2Stream.rstStream(rstCode);
    http2Stream.rstWithNoError();
    http2Stream.rstWithProtocolError();
    http2Stream.rstWithCancel();
    http2Stream.rstWithRefuse();
    http2Stream.rstWithInternalError();

    let sesh: http2.Http2Session = http2Stream.session;

    http2Stream.setTimeout(100, () => {});

    let state: http2.StreamState = http2Stream.state;
    state = {
      localWindowSize: 0,
      state: 0,
      streamLocalClose: 0,
      streamRemoteClose: 0,
      sumDependencyWeight: 0,
      weight: 0
    };

    // ClientHttp2Stream
    let clientHttp2Stream: http2.ClientHttp2Stream;
    clientHttp2Stream.on('headers', (headers: http2.IncomingHttpHeaders, flags: number) => {});
    clientHttp2Stream.on('push', (headers: http2.IncomingHttpHeaders, flags: number) => {});
    clientHttp2Stream.on('response', (headers: http2.IncomingHttpHeaders, flags: number) => {});

    // ServerHttp2Stream
    let serverHttp2Stream: http2.ServerHttp2Stream;
    let headers: http2.OutgoingHttpHeaders;

    serverHttp2Stream.additionalHeaders(headers);
    let headerSent: boolean = serverHttp2Stream.headersSent;
    let pushAllowed: boolean = serverHttp2Stream.pushAllowed;
    serverHttp2Stream.pushStream(headers, (pushStream: http2.ServerHttp2Stream) => {});

    let options: http2.ServerStreamResponseOptions = {
      endStream: true,
      getTrailers: (trailers: http2.IncomingHttpHeaders) => {}
    };
    serverHttp2Stream.respond();
    serverHttp2Stream.respond(headers);
    serverHttp2Stream.respond(headers, options);

    let options2: http2.ServerStreamFileResponseOptions = {
      statCheck: (stats: fs.Stats, headers: http2.IncomingHttpHeaders, statOptions: http2.StatOptions) => {},
      getTrailers: (trailers: http2.IncomingHttpHeaders) => {},
      offset: 0,
      length: 0
    };
    serverHttp2Stream.respondWithFD(0);
    serverHttp2Stream.respondWithFD(0, headers);
    serverHttp2Stream.respondWithFD(0, headers, options2);
    serverHttp2Stream.respondWithFile('');
    serverHttp2Stream.respondWithFile('', headers);
    serverHttp2Stream.respondWithFile('', headers, options2);
  }

  // Http2Server / Http2SecureServer
  {
    let http2Server: http2.Http2Server;
    let http2SecureServer: http2.Http2SecureServer;
    let s1: net.Server = http2Server;
    let s2: tls.Server = http2SecureServer;
    [http2Server, http2SecureServer].forEach((server) => {
      server.on('sessionError', (err: Error) => {});
      server.on('socketError', (err: Error) => {});
      server.on('stream', (stream: http2.ServerHttp2Stream, headers: http2.IncomingHttpHeaders, flags: number) => {});
      server.on('request', (request: http2.Http2ServerRequest, response: http2.Http2ServerResponse) => {});
      server.on('timeout', () => {});
    });

    http2SecureServer.on('unknownProtocol', (socket: tls.TLSSocket) => {});
  }

  // Public API (except constants)
  {

    let settings: http2.Settings;
    let serverOptions: http2.ServerOptions = {
      maxDeflateDynamicTableSize: 0,
      maxReservedRemoteStreams: 0,
      maxSendHeaderBlockLength: 0,
      paddingStrategy: 0,
      peerMaxConcurrentStreams: 0,
      selectPadding: (frameLen: number, maxFrameLen: number) => 0,
      settings: settings,
      allowHTTP1: true
    };
    let secureServerOptions: http2.SecureServerOptions = Object.assign(serverOptions);
    secureServerOptions.ca = '';
    let onRequestHandler = (request: http2.Http2ServerRequest, response: http2.Http2ServerResponse) => {};

    let http2Server: http2.Http2Server;
    let http2SecureServer: http2.Http2SecureServer;

    http2Server = http2.createServer();
    http2Server = http2.createServer(serverOptions);
    http2Server = http2.createServer(onRequestHandler);
    http2Server = http2.createServer(serverOptions, onRequestHandler);

    http2SecureServer = http2.createSecureServer();
    http2SecureServer = http2.createSecureServer(secureServerOptions);
    http2SecureServer = http2.createSecureServer(onRequestHandler);
    http2SecureServer = http2.createSecureServer(secureServerOptions, onRequestHandler);

    let clientSessionOptions: http2.ClientSessionOptions = {
      maxDeflateDynamicTableSize: 0,
      maxReservedRemoteStreams: 0,
      maxSendHeaderBlockLength: 0,
      paddingStrategy: 0,
      peerMaxConcurrentStreams: 0,
      selectPadding: (frameLen: number, maxFrameLen: number) => 0,
      settings: settings
    };
    let secureClientSessionOptions: http2.SecureClientSessionOptions = Object.assign(clientSessionOptions);
    secureClientSessionOptions.ca = '';
    let onConnectHandler = (session: http2.Http2Session, socket: net.Socket) => {};

    let clientHttp2Session: http2.ClientHttp2Session;

    clientHttp2Session = http2.connect('');
    clientHttp2Session = http2.connect('', onConnectHandler);
    clientHttp2Session = http2.connect('', clientSessionOptions);
    clientHttp2Session = http2.connect('', clientSessionOptions, onConnectHandler);
    clientHttp2Session = http2.connect('', secureClientSessionOptions);
    clientHttp2Session = http2.connect('', secureClientSessionOptions, onConnectHandler);
  }
}
