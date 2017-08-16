declare module "http2" {
    import * as events from "events";
    import * as fs from "fs";
    import * as net from "net";
    import * as stream from "stream";
    import * as tls from "tls";
    import * as url from "url";

    export interface IncomingHttpHeaders {
        [headerField: string]: string | string[];
    }

    export interface OutgoingHttpHeaders {
        [headerField: string]: number | string | string[] | undefined;
    }

    // Http2Stream

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
        getTrailers?: (trailers: IncomingHttpHeaders) => void;
    }

    export interface StatOptions {
        offset: number;
        length: number;
    }

    export interface ServerStreamFileResponseOptions {
        statCheck?: (stats: fs.Stats, headers: IncomingHttpHeaders, statOptions: StatOptions) => void;
        getTrailers?: (trailers: IncomingHttpHeaders) => void;
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

        addListener(event: string, listener: (...args: any[]) => void): this;
        addListener(event: "aborted", listener: () => void): this;
        addListener(event: "frameError", listener: (frameType: number, errorCode: number) => void): this;
        addListener(event: "streamClosed", listener: (code: number) => void): this;
        addListener(event: "timeout", listener: () => void): this;
        addListener(event: "trailers", listener: (trailers: IncomingHttpHeaders, flags: number) => void): this;

        emit(event: string | symbol, ...args: any[]): boolean;
        emit(event: "aborted"): boolean;
        emit(event: "frameError", frameType: number, errorCode: number): boolean;
        emit(event: "streamClosed", code: number): boolean;
        emit(event: "timeout"): boolean;
        emit(event: "trailers", trailers: IncomingHttpHeaders, flags: number): boolean;

        on(event: string, listener: (...args: any[]) => void): this;
        on(event: "aborted", listener: () => void): this;
        on(event: "frameError", listener: (frameType: number, errorCode: number) => void): this;
        on(event: "streamClosed", listener: (code: number) => void): this;
        on(event: "timeout", listener: () => void): this;
        on(event: "trailers", listener: (trailers: IncomingHttpHeaders, flags: number) => void): this;

        once(event: string, listener: (...args: any[]) => void): this;
        once(event: "aborted", listener: () => void): this;
        once(event: "frameError", listener: (frameType: number, errorCode: number) => void): this;
        once(event: "streamClosed", listener: (code: number) => void): this;
        once(event: "timeout", listener: () => void): this;
        once(event: "trailers", listener: (trailers: IncomingHttpHeaders, flags: number) => void): this;

        prependListener(event: string, listener: (...args: any[]) => void): this;
        prependListener(event: "aborted", listener: () => void): this;
        prependListener(event: "frameError", listener: (frameType: number, errorCode: number) => void): this;
        prependListener(event: "streamClosed", listener: (code: number) => void): this;
        prependListener(event: "timeout", listener: () => void): this;
        prependListener(event: "trailers", listener: (trailers: IncomingHttpHeaders, flags: number) => void): this;

        prependOnceListener(event: string, listener: (...args: any[]) => void): this;
        prependOnceListener(event: "aborted", listener: () => void): this;
        prependOnceListener(event: "frameError", listener: (frameType: number, errorCode: number) => void): this;
        prependOnceListener(event: "streamClosed", listener: (code: number) => void): this;
        prependOnceListener(event: "timeout", listener: () => void): this;
        prependOnceListener(event: "trailers", listener: (trailers: IncomingHttpHeaders, flags: number) => void): this;
    }

    export interface ClientHttp2Stream extends Http2Stream {
        addListener(event: string, listener: (...args: any[]) => void): this;
        addListener(event: "headers", listener: (headers: IncomingHttpHeaders, flags: number) => void): this;
        addListener(event: "push", listener: (headers: IncomingHttpHeaders, flags: number) => void): this;
        addListener(event: "response", listener: (headers: IncomingHttpHeaders, flags: number) => void): this;

        emit(event: string | symbol, ...args: any[]): boolean;
        emit(event: "headers", headers: IncomingHttpHeaders, flags: number): boolean;
        emit(event: "push", headers: IncomingHttpHeaders, flags: number): boolean;
        emit(event: "response", headers: IncomingHttpHeaders, flags: number): boolean;

        on(event: string, listener: (...args: any[]) => void): this;
        on(event: "headers", listener: (headers: IncomingHttpHeaders, flags: number) => void): this;
        on(event: "push", listener: (headers: IncomingHttpHeaders, flags: number) => void): this;
        on(event: "response", listener: (headers: IncomingHttpHeaders, flags: number) => void): this;

        once(event: string, listener: (...args: any[]) => void): this;
        once(event: "headers", listener: (headers: IncomingHttpHeaders, flags: number) => void): this;
        once(event: "push", listener: (headers: IncomingHttpHeaders, flags: number) => void): this;
        once(event: "response", listener: (headers: IncomingHttpHeaders, flags: number) => void): this;

        prependListener(event: string, listener: (...args: any[]) => void): this;
        prependListener(event: "headers", listener: (headers: IncomingHttpHeaders, flags: number) => void): this;
        prependListener(event: "push", listener: (headers: IncomingHttpHeaders, flags: number) => void): this;
        prependListener(event: "response", listener: (headers: IncomingHttpHeaders, flags: number) => void): this;

        prependOnceListener(event: string, listener: (...args: any[]) => void): this;
        prependOnceListener(event: "headers", listener: (headers: IncomingHttpHeaders, flags: number) => void): this;
        prependOnceListener(event: "push", listener: (headers: IncomingHttpHeaders, flags: number) => void): this;
        prependOnceListener(event: "response", listener: (headers: IncomingHttpHeaders, flags: number) => void): this;
    }

    export interface ServerHttp2Stream extends Http2Stream {
        additionalHeaders(headers: OutgoingHttpHeaders): void;
        readonly headersSent: boolean;
        readonly pushAllowed: boolean;
        pushStream(headers: OutgoingHttpHeaders, callback?: (pushStream: ServerHttp2Stream) => void): void;
        pushStream(headers: OutgoingHttpHeaders, options?: StreamPriorityOptions, callback?: (pushStream: ServerHttp2Stream) => void): void;
        respond(headers?: OutgoingHttpHeaders, options?: ServerStreamResponseOptions): void;
        respondWithFD(fd: number, headers?: OutgoingHttpHeaders, options?: ServerStreamResponseOptions): void;
        respondWithFD(path: string, headers?: OutgoingHttpHeaders, options?: ServerStreamResponseOptions): void;
    }

    // Http2Session

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
        getTrailers?: (trailers: IncomingHttpHeaders, flags: number) => void;
    }

    export interface SessionShutdownOptions {
        graceful?: boolean;
        errorCode?: number;
        lastStreamID?: number;
        opaqueData?: Buffer | Uint8Array;
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
        readonly type: number;

        addListener(event: string, listener: (...args: any[]) => void): this;
        addListener(event: "close", listener: () => void): this;
        addListener(event: "error", listener: (err: Error) => void): this;
        addListener(event: "frameError", listener: (frameType: number, errorCode: number, streamID: number) => void): this;
        addListener(event: "goaway", listener: (errorCode: number, lastStreamID: number, opaqueData: Buffer) => void): this;
        addListener(event: "localSettings", listener: (settings: Settings) => void): this;
        addListener(event: "remoteSettings", listener: (settings: Settings) => void): this;
        addListener(event: "socketError", listener: (err: Error) => void): this;
        addListener(event: "timeout", listener: () => void): this;

        emit(event: string | symbol, ...args: any[]): boolean;
        emit(event: "close"): boolean;
        emit(event: "error", err: Error): boolean;
        emit(event: "frameError", frameType: number, errorCode: number, streamID: number): boolean;
        emit(event: "goaway", errorCode: number, lastStreamID: number, opaqueData: Buffer): boolean;
        emit(event: "localSettings", settings: Settings): boolean;
        emit(event: "remoteSettings", settings: Settings): boolean;
        emit(event: "socketError", err: Error): boolean;
        emit(event: "timeout"): boolean;

        on(event: string, listener: (...args: any[]) => void): this;
        on(event: "close", listener: () => void): this;
        on(event: "error", listener: (err: Error) => void): this;
        on(event: "frameError", listener: (frameType: number, errorCode: number, streamID: number) => void): this;
        on(event: "goaway", listener: (errorCode: number, lastStreamID: number, opaqueData: Buffer) => void): this;
        on(event: "localSettings", listener: (settings: Settings) => void): this;
        on(event: "remoteSettings", listener: (settings: Settings) => void): this;
        on(event: "socketError", listener: (err: Error) => void): this;
        on(event: "timeout", listener: () => void): this;

        once(event: string, listener: (...args: any[]) => void): this;
        once(event: "close", listener: () => void): this;
        once(event: "error", listener: (err: Error) => void): this;
        once(event: "frameError", listener: (frameType: number, errorCode: number, streamID: number) => void): this;
        once(event: "goaway", listener: (errorCode: number, lastStreamID: number, opaqueData: Buffer) => void): this;
        once(event: "localSettings", listener: (settings: Settings) => void): this;
        once(event: "remoteSettings", listener: (settings: Settings) => void): this;
        once(event: "socketError", listener: (err: Error) => void): this;
        once(event: "timeout", listener: () => void): this;

        prependListener(event: string, listener: (...args: any[]) => void): this;
        prependListener(event: "close", listener: () => void): this;
        prependListener(event: "error", listener: (err: Error) => void): this;
        prependListener(event: "frameError", listener: (frameType: number, errorCode: number, streamID: number) => void): this;
        prependListener(event: "goaway", listener: (errorCode: number, lastStreamID: number, opaqueData: Buffer) => void): this;
        prependListener(event: "localSettings", listener: (settings: Settings) => void): this;
        prependListener(event: "remoteSettings", listener: (settings: Settings) => void): this;
        prependListener(event: "socketError", listener: (err: Error) => void): this;
        prependListener(event: "timeout", listener: () => void): this;

        prependOnceListener(event: string, listener: (...args: any[]) => void): this;
        prependOnceListener(event: "close", listener: () => void): this;
        prependOnceListener(event: "error", listener: (err: Error) => void): this;
        prependOnceListener(event: "frameError", listener: (frameType: number, errorCode: number, streamID: number) => void): this;
        prependOnceListener(event: "goaway", listener: (errorCode: number, lastStreamID: number, opaqueData: Buffer) => void): this;
        prependOnceListener(event: "localSettings", listener: (settings: Settings) => void): this;
        prependOnceListener(event: "remoteSettings", listener: (settings: Settings) => void): this;
        prependOnceListener(event: "socketError", listener: (err: Error) => void): this;
        prependOnceListener(event: "timeout", listener: () => void): this;
    }

    export interface ClientHttp2Session extends Http2Session {
        request(headers?: OutgoingHttpHeaders, options?: ClientSessionRequestOptions): ClientHttp2Stream;

        addListener(event: string, listener: (...args: any[]) => void): this;
        addListener(event: "connect", listener: (session: ClientHttp2Session, socket: net.Socket | tls.TLSSocket) => void): this;
        addListener(event: "stream", listener: (stream: ClientHttp2Stream, headers: IncomingHttpHeaders, flags: number) => void): this;

        emit(event: string | symbol, ...args: any[]): boolean;
        emit(event: "connect", session: ClientHttp2Session, socket: net.Socket | tls.TLSSocket): boolean;
        emit(event: "stream", stream: ClientHttp2Stream, headers: IncomingHttpHeaders, flags: number): boolean;

        on(event: string, listener: (...args: any[]) => void): this;
        on(event: "connect", listener: (session: ClientHttp2Session, socket: net.Socket | tls.TLSSocket) => void): this;
        on(event: "stream", listener: (stream: ClientHttp2Stream, headers: IncomingHttpHeaders, flags: number) => void): this;

        once(event: string, listener: (...args: any[]) => void): this;
        once(event: "connect", listener: (session: ClientHttp2Session, socket: net.Socket | tls.TLSSocket) => void): this;
        once(event: "stream", listener: (stream: ClientHttp2Stream, headers: IncomingHttpHeaders, flags: number) => void): this;

        prependListener(event: string, listener: (...args: any[]) => void): this;
        prependListener(event: "connect", listener: (session: ClientHttp2Session, socket: net.Socket | tls.TLSSocket) => void): this;
        prependListener(event: "stream", listener: (stream: ClientHttp2Stream, headers: IncomingHttpHeaders, flags: number) => void): this;

        prependOnceListener(event: string, listener: (...args: any[]) => void): this;
        prependOnceListener(event: "connect", listener: (session: ClientHttp2Session, socket: net.Socket | tls.TLSSocket) => void): this;
        prependOnceListener(event: "stream", listener: (stream: ClientHttp2Stream, headers: IncomingHttpHeaders, flags: number) => void): this;
    }

    export interface ServerHttp2Session extends Http2Session {
        readonly server: Http2Server | Http2SecureServer;

        addListener(event: string, listener: (...args: any[]) => void): this;
        addListener(event: "connect", listener: (session: ServerHttp2Session, socket: net.Socket | tls.TLSSocket) => void): this;
        addListener(event: "stream", listener: (stream: ServerHttp2Stream, headers: IncomingHttpHeaders, flags: number) => void): this;

        emit(event: string | symbol, ...args: any[]): boolean;
        emit(event: "connect", session: ServerHttp2Session, socket: net.Socket | tls.TLSSocket): boolean;
        emit(event: "stream", stream: ServerHttp2Stream, headers: IncomingHttpHeaders, flags: number): boolean;

        on(event: string, listener: (...args: any[]) => void): this;
        on(event: "connect", listener: (session: ServerHttp2Session, socket: net.Socket | tls.TLSSocket) => void): this;
        on(event: "stream", listener: (stream: ServerHttp2Stream, headers: IncomingHttpHeaders, flags: number) => void): this;

        once(event: string, listener: (...args: any[]) => void): this;
        once(event: "connect", listener: (session: ServerHttp2Session, socket: net.Socket | tls.TLSSocket) => void): this;
        once(event: "stream", listener: (stream: ServerHttp2Stream, headers: IncomingHttpHeaders, flags: number) => void): this;

        prependListener(event: string, listener: (...args: any[]) => void): this;
        prependListener(event: "connect", listener: (session: ServerHttp2Session, socket: net.Socket | tls.TLSSocket) => void): this;
        prependListener(event: "stream", listener: (stream: ServerHttp2Stream, headers: IncomingHttpHeaders, flags: number) => void): this;

        prependOnceListener(event: string, listener: (...args: any[]) => void): this;
        prependOnceListener(event: "connect", listener: (session: ServerHttp2Session, socket: net.Socket | tls.TLSSocket) => void): this;
        prependOnceListener(event: "stream", listener: (stream: ServerHttp2Stream, headers: IncomingHttpHeaders, flags: number) => void): this;
    }

    // Http2Server

    export interface SessionOptions {
        maxDeflateDynamicTableSize?: number;
        maxReservedRemoteStreams?: number;
        maxSendHeaderBlockLength?: number;
        paddingStrategy?: number;
        peerMaxConcurrentStreams?: number;
        selectPadding?: (frameLen: number, maxFrameLen: number) => number;
        settings?: Settings;
    }

    export type ClientSessionOptions = SessionOptions;
    export type ServerSessionOptions = SessionOptions;

    export type SecureClientSessionOptions = ClientSessionOptions & tls.ConnectionOptions;
    export type SecureServerSessionOptions = ClientSessionOptions & tls.TlsOptions;

    export interface ServerOptions extends ServerSessionOptions {
        allowHTTP1?: boolean;
    }

    export interface SecureServerOptions extends ServerSessionOptions {
        allowHTTP1?: boolean;
    }

    export interface Http2Server extends net.Server {
        addListener(event: string, listener: (...args: any[]) => void): this;
        addListener(event: "request", listener: (request: Http2ServerRequest, response: Http2ServerResponse) => void): this;
        addListener(event: "sessionError", listener: (err: Error) => void): this;
        addListener(event: "socketError", listener: (err: Error) => void): this;
        addListener(event: "stream", listener: (stream: ServerHttp2Stream, headers: IncomingHttpHeaders, flags: number) => void): this;
        addListener(event: "timeout", listener: () => void): this;

        emit(event: string | symbol, ...args: any[]): boolean;
        emit(event: "request", request: Http2ServerRequest, response: Http2ServerResponse): boolean;
        emit(event: "sessionError", err: Error): boolean;
        emit(event: "socketError", err: Error): boolean;
        emit(event: "stream", stream: ServerHttp2Stream, headers: IncomingHttpHeaders, flags: number): boolean;
        emit(event: "timeout"): boolean;

        on(event: string, listener: (...args: any[]) => void): this;
        on(event: "request", listener: (request: Http2ServerRequest, response: Http2ServerResponse) => void): this;
        on(event: "sessionError", listener: (err: Error) => void): this;
        on(event: "socketError", listener: (err: Error) => void): this;
        on(event: "stream", listener: (stream: ServerHttp2Stream, headers: IncomingHttpHeaders, flags: number) => void): this;
        on(event: "timeout", listener: () => void): this;

        once(event: string, listener: (...args: any[]) => void): this;
        once(event: "request", listener: (request: Http2ServerRequest, response: Http2ServerResponse) => void): this;
        once(event: "sessionError", listener: (err: Error) => void): this;
        once(event: "socketError", listener: (err: Error) => void): this;
        once(event: "stream", listener: (stream: ServerHttp2Stream, headers: IncomingHttpHeaders, flags: number) => void): this;
        once(event: "timeout", listener: () => void): this;

        prependListener(event: string, listener: (...args: any[]) => void): this;
        prependListener(event: "request", listener: (request: Http2ServerRequest, response: Http2ServerResponse) => void): this;
        prependListener(event: "sessionError", listener: (err: Error) => void): this;
        prependListener(event: "socketError", listener: (err: Error) => void): this;
        prependListener(event: "stream", listener: (stream: ServerHttp2Stream, headers: IncomingHttpHeaders, flags: number) => void): this;
        prependListener(event: "timeout", listener: () => void): this;

        prependOnceListener(event: string, listener: (...args: any[]) => void): this;
        prependOnceListener(event: "request", listener: (request: Http2ServerRequest, response: Http2ServerResponse) => void): this;
        prependOnceListener(event: "sessionError", listener: (err: Error) => void): this;
        prependOnceListener(event: "socketError", listener: (err: Error) => void): this;
        prependOnceListener(event: "stream", listener: (stream: ServerHttp2Stream, headers: IncomingHttpHeaders, flags: number) => void): this;
        prependOnceListener(event: "timeout", listener: () => void): this;
    }

    export interface Http2SecureServer extends tls.Server {
        addListener(event: string, listener: (...args: any[]) => void): this;
        addListener(event: "request", listener: (request: Http2ServerRequest, response: Http2ServerResponse) => void): this;
        addListener(event: "sessionError", listener: (err: Error) => void): this;
        addListener(event: "socketError", listener: (err: Error) => void): this;
        addListener(event: "stream", listener: (stream: ServerHttp2Stream, headers: IncomingHttpHeaders, flags: number) => void): this;
        addListener(event: "timeout", listener: () => void): this;
        addListener(event: "unknownProtocol", listener: (socket: tls.TLSSocket) => void): this;

        emit(event: string | symbol, ...args: any[]): boolean;
        emit(event: "request", request: Http2ServerRequest, response: Http2ServerResponse): boolean;
        emit(event: "sessionError", err: Error): boolean;
        emit(event: "socketError", err: Error): boolean;
        emit(event: "stream", stream: ServerHttp2Stream, headers: IncomingHttpHeaders, flags: number): boolean;
        emit(event: "timeout"): boolean;
        emit(event: "unknownProtocol", socket: tls.TLSSocket): boolean;

        on(event: string, listener: (...args: any[]) => void): this;
        on(event: "request", listener: (request: Http2ServerRequest, response: Http2ServerResponse) => void): this;
        on(event: "sessionError", listener: (err: Error) => void): this;
        on(event: "socketError", listener: (err: Error) => void): this;
        on(event: "stream", listener: (stream: ServerHttp2Stream, headers: IncomingHttpHeaders, flags: number) => void): this;
        on(event: "timeout", listener: () => void): this;
        on(event: "unknownProtocol", listener: (socket: tls.TLSSocket) => void): this;

        once(event: string, listener: (...args: any[]) => void): this;
        once(event: "request", listener: (request: Http2ServerRequest, response: Http2ServerResponse) => void): this;
        once(event: "sessionError", listener: (err: Error) => void): this;
        once(event: "socketError", listener: (err: Error) => void): this;
        once(event: "stream", listener: (stream: ServerHttp2Stream, headers: IncomingHttpHeaders, flags: number) => void): this;
        once(event: "timeout", listener: () => void): this;
        once(event: "unknownProtocol", listener: (socket: tls.TLSSocket) => void): this;

        prependListener(event: string, listener: (...args: any[]) => void): this;
        prependListener(event: "request", listener: (request: Http2ServerRequest, response: Http2ServerResponse) => void): this;
        prependListener(event: "sessionError", listener: (err: Error) => void): this;
        prependListener(event: "socketError", listener: (err: Error) => void): this;
        prependListener(event: "stream", listener: (stream: ServerHttp2Stream, headers: IncomingHttpHeaders, flags: number) => void): this;
        prependListener(event: "timeout", listener: () => void): this;
        prependListener(event: "unknownProtocol", listener: (socket: tls.TLSSocket) => void): this;

        prependOnceListener(event: string, listener: (...args: any[]) => void): this;
        prependOnceListener(event: "request", listener: (request: Http2ServerRequest, response: Http2ServerResponse) => void): this;
        prependOnceListener(event: "sessionError", listener: (err: Error) => void): this;
        prependOnceListener(event: "socketError", listener: (err: Error) => void): this;
        prependOnceListener(event: "stream", listener: (stream: ServerHttp2Stream, headers: IncomingHttpHeaders, flags: number) => void): this;
        prependOnceListener(event: "timeout", listener: () => void): this;
        prependOnceListener(event: "unknownProtocol", listener: (socket: tls.TLSSocket) => void): this;
    }

    export interface Http2ServerRequest extends stream.Readable {
        destroy(err: Error): void;
        headers: IncomingHttpHeaders;
        httpVersion: string;
        method: string;
        rawHeaders: string[];
        rawTrailers: string[];
        setTimeout(msecs: number, callback?: () => void): void;
        socket: net.Socket | tls.TLSSocket;
        stream: ServerHttp2Stream;
        trailers: IncomingHttpHeaders;
        url: string;

        addListener(event: string, listener: (...args: any[]) => void): this;
        addListener(event: "aborted", listener: (hadError: boolean, code: number) => void): this;

        emit(event: string | symbol, ...args: any[]): boolean;
        emit(event: "aborted", hadError: boolean, code: number): boolean;

        on(event: string, listener: (...args: any[]) => void): this;
        on(event: "aborted", listener: (hadError: boolean, code: number) => void): this;

        once(event: string, listener: (...args: any[]) => void): this;
        once(event: "aborted", listener: (hadError: boolean, code: number) => void): this;

        prependListener(event: string, listener: (...args: any[]) => void): this;
        prependListener(event: "aborted", listener: (hadError: boolean, code: number) => void): this;

        prependOnceListener(event: string, listener: (...args: any[]) => void): this;
        prependOnceListener(event: "aborted", listener: (hadError: boolean, code: number) => void): this;
    }

    export interface Http2ServerResponse extends events.EventEmitter {
        addTrailers(trailers: OutgoingHttpHeaders): void;
        connection: net.Socket | tls.TLSSocket;
        end(callback?: () => void): void;
        end(data?: string | Buffer, callback?: () => void): void;
        end(data?: string | Buffer, encoding?: string, callback?: () => void): void;
        finished: boolean;
        getHeader(name: string): string;
        getHeaderNames(): string[];
        getHeaders(): OutgoingHttpHeaders;
        hasHeader(name: string): boolean;
        readonly headersSent: boolean;
        removeHeader(name: string): void;
        sendDate: boolean;
        setHeader(name: string, value: number | string | string[]): void;
        setTimeout(msecs: number, callback?: () => void): void;
        socket: net.Socket | tls.TLSSocket;
        statusCode: number;
        statusMessage: '';
        stream: ServerHttp2Stream;
        write(chunk: string | Buffer, callback?: (err: Error) => void): boolean;
        write(chunk: string | Buffer, encoding?: string, callback?: (err: Error) => void): boolean;
        writeContinue(): void;
        writeHead(statusCode: number, headers?: OutgoingHttpHeaders): void;
        writeHead(statusCode: number, statusMessage?: string, headers?: OutgoingHttpHeaders): void;
        createPushResponse(headers: OutgoingHttpHeaders, callback?: (err: Error) => void): void;

        addListener(event: string, listener: (...args: any[]) => void): this;
        addListener(event: "aborted", listener: (hadError: boolean, code: number) => void): this;
        addListener(event: "close", listener: () => void): this;
        addListener(event: "drain", listener: () => void): this;
        addListener(event: "error", listener: (error: Error) => void): this;
        addListener(event: "finish", listener: () => void): this;

        emit(event: string | symbol, ...args: any[]): boolean;
        emit(event: "aborted", hadError: boolean, code: number): boolean;
        emit(event: "close"): boolean;
        emit(event: "drain"): boolean;
        emit(event: "error", error: Error): boolean;
        emit(event: "finish"): boolean;

        on(event: string, listener: (...args: any[]) => void): this;
        on(event: "aborted", listener: (hadError: boolean, code: number) => void): this;
        on(event: "close", listener: () => void): this;
        on(event: "drain", listener: () => void): this;
        on(event: "error", listener: (error: Error) => void): this;
        on(event: "finish", listener: () => void): this;

        once(event: string, listener: (...args: any[]) => void): this;
        once(event: "aborted", listener: (hadError: boolean, code: number) => void): this;
        once(event: "close", listener: () => void): this;
        once(event: "drain", listener: () => void): this;
        once(event: "error", listener: (error: Error) => void): this;
        once(event: "finish", listener: () => void): this;

        prependListener(event: string, listener: (...args: any[]) => void): this;
        prependListener(event: "aborted", listener: (hadError: boolean, code: number) => void): this;
        prependListener(event: "close", listener: () => void): this;
        prependListener(event: "drain", listener: () => void): this;
        prependListener(event: "error", listener: (error: Error) => void): this;
        prependListener(event: "finish", listener: () => void): this;

        prependOnceListener(event: string, listener: (...args: any[]) => void): this;
        prependOnceListener(event: "aborted", listener: (hadError: boolean, code: number) => void): this;
        prependOnceListener(event: "close", listener: () => void): this;
        prependOnceListener(event: "drain", listener: () => void): this;
        prependOnceListener(event: "error", listener: (error: Error) => void): this;
        prependOnceListener(event: "finish", listener: () => void): this;
    }

    // Public API

    export const constants: {
        NGHTTP2_SESSION_SERVER: number;
        NGHTTP2_SESSION_CLIENT: number;
        NGHTTP2_STREAM_STATE_IDLE: number;
        NGHTTP2_STREAM_STATE_OPEN: number;
        NGHTTP2_STREAM_STATE_RESERVED_LOCAL: number;
        NGHTTP2_STREAM_STATE_RESERVED_REMOTE: number;
        NGHTTP2_STREAM_STATE_HALF_CLOSED_LOCAL: number;
        NGHTTP2_STREAM_STATE_HALF_CLOSED_REMOTE: number;
        NGHTTP2_STREAM_STATE_CLOSED: number;
        NGHTTP2_NO_ERROR: number;
        NGHTTP2_PROTOCOL_ERROR: number;
        NGHTTP2_INTERNAL_ERROR: number;
        NGHTTP2_FLOW_CONTROL_ERROR: number;
        NGHTTP2_SETTINGS_TIMEOUT: number;
        NGHTTP2_STREAM_CLOSED: number;
        NGHTTP2_FRAME_SIZE_ERROR: number;
        NGHTTP2_REFUSED_STREAM: number;
        NGHTTP2_CANCEL: number;
        NGHTTP2_COMPRESSION_ERROR: number;
        NGHTTP2_CONNECT_ERROR: number;
        NGHTTP2_ENHANCE_YOUR_CALM: number;
        NGHTTP2_INADEQUATE_SECURITY: number;
        NGHTTP2_HTTP_1_1_REQUIRED: number;
        NGHTTP2_ERR_FRAME_SIZE_ERROR: number;
        NGHTTP2_FLAG_NONE: number;
        NGHTTP2_FLAG_END_STREAM: number;
        NGHTTP2_FLAG_END_HEADERS: number;
        NGHTTP2_FLAG_ACK: number;
        NGHTTP2_FLAG_PADDED: number;
        NGHTTP2_FLAG_PRIORITY: number;
        DEFAULT_SETTINGS_HEADER_TABLE_SIZE: number;
        DEFAULT_SETTINGS_ENABLE_PUSH: number;
        DEFAULT_SETTINGS_INITIAL_WINDOW_SIZE: number;
        DEFAULT_SETTINGS_MAX_FRAME_SIZE: number;
        MAX_MAX_FRAME_SIZE: number;
        MIN_MAX_FRAME_SIZE: number;
        MAX_INITIAL_WINDOW_SIZE: number;
        NGHTTP2_DEFAULT_WEIGHT: number;
        NGHTTP2_SETTINGS_HEADER_TABLE_SIZE: number;
        NGHTTP2_SETTINGS_ENABLE_PUSH: number;
        NGHTTP2_SETTINGS_MAX_CONCURRENT_STREAMS: number;
        NGHTTP2_SETTINGS_INITIAL_WINDOW_SIZE: number;
        NGHTTP2_SETTINGS_MAX_FRAME_SIZE: number;
        NGHTTP2_SETTINGS_MAX_HEADER_LIST_SIZE: number;
        PADDING_STRATEGY_NONE: number;
        PADDING_STRATEGY_MAX: number;
        PADDING_STRATEGY_CALLBACK: number;
        HTTP2_HEADER_STATUS: string;
        HTTP2_HEADER_METHOD: string;
        HTTP2_HEADER_AUTHORITY: string;
        HTTP2_HEADER_SCHEME: string;
        HTTP2_HEADER_PATH: string;
        HTTP2_HEADER_ACCEPT_CHARSET: string;
        HTTP2_HEADER_ACCEPT_ENCODING: string;
        HTTP2_HEADER_ACCEPT_LANGUAGE: string;
        HTTP2_HEADER_ACCEPT_RANGES: string;
        HTTP2_HEADER_ACCEPT: string;
        HTTP2_HEADER_ACCESS_CONTROL_ALLOW_ORIGIN: string;
        HTTP2_HEADER_AGE: string;
        HTTP2_HEADER_ALLOW: string;
        HTTP2_HEADER_AUTHORIZATION: string;
        HTTP2_HEADER_CACHE_CONTROL: string;
        HTTP2_HEADER_CONNECTION: string;
        HTTP2_HEADER_CONTENT_DISPOSITION: string;
        HTTP2_HEADER_CONTENT_ENCODING: string;
        HTTP2_HEADER_CONTENT_LANGUAGE: string;
        HTTP2_HEADER_CONTENT_LENGTH: string;
        HTTP2_HEADER_CONTENT_LOCATION: string;
        HTTP2_HEADER_CONTENT_MD5: string;
        HTTP2_HEADER_CONTENT_RANGE: string;
        HTTP2_HEADER_CONTENT_TYPE: string;
        HTTP2_HEADER_COOKIE: string;
        HTTP2_HEADER_DATE: string;
        HTTP2_HEADER_ETAG: string;
        HTTP2_HEADER_EXPECT: string;
        HTTP2_HEADER_EXPIRES: string;
        HTTP2_HEADER_FROM: string;
        HTTP2_HEADER_HOST: string;
        HTTP2_HEADER_IF_MATCH: string;
        HTTP2_HEADER_IF_MODIFIED_SINCE: string;
        HTTP2_HEADER_IF_NONE_MATCH: string;
        HTTP2_HEADER_IF_RANGE: string;
        HTTP2_HEADER_IF_UNMODIFIED_SINCE: string;
        HTTP2_HEADER_LAST_MODIFIED: string;
        HTTP2_HEADER_LINK: string;
        HTTP2_HEADER_LOCATION: string;
        HTTP2_HEADER_MAX_FORWARDS: string;
        HTTP2_HEADER_PREFER: string;
        HTTP2_HEADER_PROXY_AUTHENTICATE: string;
        HTTP2_HEADER_PROXY_AUTHORIZATION: string;
        HTTP2_HEADER_RANGE: string;
        HTTP2_HEADER_REFERER: string;
        HTTP2_HEADER_REFRESH: string;
        HTTP2_HEADER_RETRY_AFTER: string;
        HTTP2_HEADER_SERVER: string;
        HTTP2_HEADER_SET_COOKIE: string;
        HTTP2_HEADER_STRICT_TRANSPORT_SECURITY: string;
        HTTP2_HEADER_TRANSFER_ENCODING: string;
        HTTP2_HEADER_TE: string;
        HTTP2_HEADER_UPGRADE: string;
        HTTP2_HEADER_USER_AGENT: string;
        HTTP2_HEADER_VARY: string;
        HTTP2_HEADER_VIA: string;
        HTTP2_HEADER_WWW_AUTHENTICATE: string;
        HTTP2_HEADER_HTTP2_SETTINGS: string;
        HTTP2_HEADER_KEEP_ALIVE: string;
        HTTP2_HEADER_PROXY_CONNECTION: string;
        HTTP2_METHOD_ACL: string;
        HTTP2_METHOD_BASELINE_CONTROL: string;
        HTTP2_METHOD_BIND: string;
        HTTP2_METHOD_CHECKIN: string;
        HTTP2_METHOD_CHECKOUT: string;
        HTTP2_METHOD_CONNECT: string;
        HTTP2_METHOD_COPY: string;
        HTTP2_METHOD_DELETE: string;
        HTTP2_METHOD_GET: string;
        HTTP2_METHOD_HEAD: string;
        HTTP2_METHOD_LABEL: string;
        HTTP2_METHOD_LINK: string;
        HTTP2_METHOD_LOCK: string;
        HTTP2_METHOD_MERGE: string;
        HTTP2_METHOD_MKACTIVITY: string;
        HTTP2_METHOD_MKCALENDAR: string;
        HTTP2_METHOD_MKCOL: string;
        HTTP2_METHOD_MKREDIRECTREF: string;
        HTTP2_METHOD_MKWORKSPACE: string;
        HTTP2_METHOD_MOVE: string;
        HTTP2_METHOD_OPTIONS: string;
        HTTP2_METHOD_ORDERPATCH: string;
        HTTP2_METHOD_PATCH: string;
        HTTP2_METHOD_POST: string;
        HTTP2_METHOD_PRI: string;
        HTTP2_METHOD_PROPFIND: string;
        HTTP2_METHOD_PROPPATCH: string;
        HTTP2_METHOD_PUT: string;
        HTTP2_METHOD_REBIND: string;
        HTTP2_METHOD_REPORT: string;
        HTTP2_METHOD_SEARCH: string;
        HTTP2_METHOD_TRACE: string;
        HTTP2_METHOD_UNBIND: string;
        HTTP2_METHOD_UNCHECKOUT: string;
        HTTP2_METHOD_UNLINK: string;
        HTTP2_METHOD_UNLOCK: string;
        HTTP2_METHOD_UPDATE: string;
        HTTP2_METHOD_UPDATEREDIRECTREF: string;
        HTTP2_METHOD_VERSION_CONTROL: string;
        HTTP_STATUS_CONTINUE: number;
        HTTP_STATUS_SWITCHING_PROTOCOLS: number;
        HTTP_STATUS_PROCESSING: number;
        HTTP_STATUS_OK: number;
        HTTP_STATUS_CREATED: number;
        HTTP_STATUS_ACCEPTED: number;
        HTTP_STATUS_NON_AUTHORITATIVE_INFORMATION: number;
        HTTP_STATUS_NO_CONTENT: number;
        HTTP_STATUS_RESET_CONTENT: number;
        HTTP_STATUS_PARTIAL_CONTENT: number;
        HTTP_STATUS_MULTI_STATUS: number;
        HTTP_STATUS_ALREADY_REPORTED: number;
        HTTP_STATUS_IM_USED: number;
        HTTP_STATUS_MULTIPLE_CHOICES: number;
        HTTP_STATUS_MOVED_PERMANENTLY: number;
        HTTP_STATUS_FOUND: number;
        HTTP_STATUS_SEE_OTHER: number;
        HTTP_STATUS_NOT_MODIFIED: number;
        HTTP_STATUS_USE_PROXY: number;
        HTTP_STATUS_TEMPORARY_REDIRECT: number;
        HTTP_STATUS_PERMANENT_REDIRECT: number;
        HTTP_STATUS_BAD_REQUEST: number;
        HTTP_STATUS_UNAUTHORIZED: number;
        HTTP_STATUS_PAYMENT_REQUIRED: number;
        HTTP_STATUS_FORBIDDEN: number;
        HTTP_STATUS_NOT_FOUND: number;
        HTTP_STATUS_METHOD_NOT_ALLOWED: number;
        HTTP_STATUS_NOT_ACCEPTABLE: number;
        HTTP_STATUS_PROXY_AUTHENTICATION_REQUIRED: number;
        HTTP_STATUS_REQUEST_TIMEOUT: number;
        HTTP_STATUS_CONFLICT: number;
        HTTP_STATUS_GONE: number;
        HTTP_STATUS_LENGTH_REQUIRED: number;
        HTTP_STATUS_PRECONDITION_FAILED: number;
        HTTP_STATUS_PAYLOAD_TOO_LARGE: number;
        HTTP_STATUS_URI_TOO_LONG: number;
        HTTP_STATUS_UNSUPPORTED_MEDIA_TYPE: number;
        HTTP_STATUS_RANGE_NOT_SATISFIABLE: number;
        HTTP_STATUS_EXPECTATION_FAILED: number;
        HTTP_STATUS_TEAPOT: number;
        HTTP_STATUS_MISDIRECTED_REQUEST: number;
        HTTP_STATUS_UNPROCESSABLE_ENTITY: number;
        HTTP_STATUS_LOCKED: number;
        HTTP_STATUS_FAILED_DEPENDENCY: number;
        HTTP_STATUS_UNORDERED_COLLECTION: number;
        HTTP_STATUS_UPGRADE_REQUIRED: number;
        HTTP_STATUS_PRECONDITION_REQUIRED: number;
        HTTP_STATUS_TOO_MANY_REQUESTS: number;
        HTTP_STATUS_REQUEST_HEADER_FIELDS_TOO_LARGE: number;
        HTTP_STATUS_UNAVAILABLE_FOR_LEGAL_REASONS: number;
        HTTP_STATUS_INTERNAL_SERVER_ERROR: number;
        HTTP_STATUS_NOT_IMPLEMENTED: number;
        HTTP_STATUS_BAD_GATEWAY: number;
        HTTP_STATUS_SERVICE_UNAVAILABLE: number;
        HTTP_STATUS_GATEWAY_TIMEOUT: number;
        HTTP_STATUS_HTTP_VERSION_NOT_SUPPORTED: number;
        HTTP_STATUS_VARIANT_ALSO_NEGOTIATES: number;
        HTTP_STATUS_INSUFFICIENT_STORAGE: number;
        HTTP_STATUS_LOOP_DETECTED: number;
        HTTP_STATUS_BANDWIDTH_LIMIT_EXCEEDED: number;
        HTTP_STATUS_NOT_EXTENDED: number;
        HTTP_STATUS_NETWORK_AUTHENTICATION_REQUIRED: number;
    };

    export function getDefaultSettings(): Settings;
    export function getPackedSettings(): Settings;
    export function getUnpackedSettings(): Settings;

    export function createServer(onRequestHandler?: (request: Http2ServerRequest, response: Http2ServerResponse) => void): Http2Server;
    export function createServer(options: ServerOptions, onRequestHandler?: (request: Http2ServerRequest, response: Http2ServerResponse) => void): Http2Server;

    export function createSecureServer(onRequestHandler?: (request: Http2ServerRequest, response: Http2ServerResponse) => void): Http2Server;
    export function createSecureServer(options: SecureServerOptions, onRequestHandler?: (request: Http2ServerRequest, response: Http2ServerResponse) => void): Http2Server;

    export function connect(authority: string | url.URL, listener?: (session: ClientHttp2Session, socket: net.Socket | tls.TLSSocket) => void): ClientHttp2Session;
    export function connect(authority: string | url.URL, options?: ClientSessionOptions | SecureClientSessionOptions, listener?: (session: ClientHttp2Session, socket: net.Socket | tls.TLSSocket) => void): ClientHttp2Session;
}
