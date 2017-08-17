import * as events from 'events';
import * as http2 from 'http2';
import * as net from 'net';
import * as tls from 'tls';
import * as url from 'url';

namespace http2_tests {
  // Http2Session
  {
    let session: http2.Http2Session;
    let ee: events.EventEmitter = session;

    session.on('close', () => {});
    session.on('connect', (session: http2.Http2Session, socket: net.Socket) => {});
    session.on('error', (err: Error) => {});
    session.on('frameError', (frameType: number, errorCode: number, streamID: number) => {});
    session.on('goaway', (errorCode: number, lastStreamID: number, opaqueData: Buffer) => {});
    session.on('localSettings', (settings: http2.Settings) => {});
    session.on('remoteSettings', (settings: http2.Settings) => {});
    session.on('stream', (stream: http2.Http2Stream, headers: http2.IncomingHttpHeaders, flags: number) => {});
    session.on('socketError', (err: Error) => {});
    session.on('timeout', () => {});

    session.destroy();

    let destroyed: boolean = session.destroyed;
    let pendingSettingsAck: boolean = session.pendingSettingsAck;
    let settings: http2.Settings = session.localSettings;
    settings = session.remoteSettings;
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
    (session as http2.ClientHttp2Session).request();
    (session as http2.ClientHttp2Session).request(headers);
    (session as http2.ClientHttp2Session).request(headers, options);

    let stream: http2.Http2Stream;
    session.rstStream(stream);
    session.rstStream(stream, 0);

    session.setTimeout(100, () => {});

    let shutdownOptions: http2.SessionShutdownOptions = {
      graceful: true,
      errorCode: 0,
      lastStreamID: 0,
      opaqueData: Buffer.from([])
    };
    shutdownOptions.opaqueData = Uint8Array.from([]);
    session.shutdown(shutdownOptions);
    session.shutdown(shutdownOptions, () => {});

    let socket: net.Socket | tls.TLSSocket = session.socket;
    let state: http2.SessionState = session.state;
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

    session.priority(stream, {
      exclusive: true,
      parent: 0,
      weight: 0,
      silent: true
    });

    session.settings(settings);
  }
}
