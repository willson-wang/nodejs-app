/* eslint-disable */
import {
  ChannelCredentials,
  Client,
  ClientDuplexStream,
  ClientReadableStream,
  ClientWritableStream,
  handleBidiStreamingCall,
  handleClientStreamingCall,
  handleServerStreamingCall,
  makeGenericClientConstructor,
  Metadata,
} from "@grpc/grpc-js";
import type {
  CallOptions,
  ClientOptions,
  ClientUnaryCall,
  handleUnaryCall,
  ServiceError,
  UntypedServiceImplementation,
} from "@grpc/grpc-js";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "routeguide";

/**
 * Points are represented as latitude-longitude pairs in the E7 representation
 * (degrees multiplied by 10**7 and rounded to the nearest integer).
 * Latitudes should be in the range +/- 90 degrees and longitude should be in
 * the range +/- 180 degrees (inclusive).
 */
export interface Point {
  latitude: number;
  longitude: number;
}

/**
 * A latitude-longitude rectangle, represented as two diagonally opposite
 * points "lo" and "hi".
 */
export interface Rectangle {
  /** One corner of the rectangle. */
  lo:
    | Point
    | undefined;
  /** The other corner of the rectangle. */
  hi: Point | undefined;
}

/**
 * A feature names something at a given point.
 *
 * If a feature could not be named, the name is empty.
 */
export interface Feature {
  /** The name of the feature. */
  name: string;
  /** The point where the feature is detected. */
  location: Point | undefined;
}

/** A RouteNote is a message sent while at a given point. */
export interface RouteNote {
  /** The location from which the message is sent. */
  location:
    | Point
    | undefined;
  /** The message to be sent. */
  message: string;
}

/**
 * A RouteSummary is received in response to a RecordRoute rpc.
 *
 * It contains the number of individual points received, the number of
 * detected features, and the total distance covered as the cumulative sum of
 * the distance between each point.
 */
export interface RouteSummary {
  /** The number of points received. */
  point_count: number;
  /** The number of known features passed while traversing the route. */
  feature_count: number;
  /** The distance covered in metres. */
  distance: number;
  /** The duration of the traversal in seconds. */
  elapsed_time: number;
}

function createBasePoint(): Point {
  return { latitude: 0, longitude: 0 };
}

export const Point = {
  encode(message: Point, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.latitude !== 0) {
      writer.uint32(8).int32(message.latitude);
    }
    if (message.longitude !== 0) {
      writer.uint32(16).int32(message.longitude);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Point {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePoint();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.latitude = reader.int32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.longitude = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Point {
    return {
      latitude: isSet(object.latitude) ? globalThis.Number(object.latitude) : 0,
      longitude: isSet(object.longitude) ? globalThis.Number(object.longitude) : 0,
    };
  },

  toJSON(message: Point): unknown {
    const obj: any = {};
    if (message.latitude !== 0) {
      obj.latitude = Math.round(message.latitude);
    }
    if (message.longitude !== 0) {
      obj.longitude = Math.round(message.longitude);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Point>, I>>(base?: I): Point {
    return Point.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Point>, I>>(object: I): Point {
    const message = createBasePoint();
    message.latitude = object.latitude ?? 0;
    message.longitude = object.longitude ?? 0;
    return message;
  },
};

function createBaseRectangle(): Rectangle {
  return { lo: undefined, hi: undefined };
}

export const Rectangle = {
  encode(message: Rectangle, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.lo !== undefined) {
      Point.encode(message.lo, writer.uint32(10).fork()).ldelim();
    }
    if (message.hi !== undefined) {
      Point.encode(message.hi, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Rectangle {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRectangle();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.lo = Point.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.hi = Point.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Rectangle {
    return {
      lo: isSet(object.lo) ? Point.fromJSON(object.lo) : undefined,
      hi: isSet(object.hi) ? Point.fromJSON(object.hi) : undefined,
    };
  },

  toJSON(message: Rectangle): unknown {
    const obj: any = {};
    if (message.lo !== undefined) {
      obj.lo = Point.toJSON(message.lo);
    }
    if (message.hi !== undefined) {
      obj.hi = Point.toJSON(message.hi);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Rectangle>, I>>(base?: I): Rectangle {
    return Rectangle.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Rectangle>, I>>(object: I): Rectangle {
    const message = createBaseRectangle();
    message.lo = (object.lo !== undefined && object.lo !== null) ? Point.fromPartial(object.lo) : undefined;
    message.hi = (object.hi !== undefined && object.hi !== null) ? Point.fromPartial(object.hi) : undefined;
    return message;
  },
};

function createBaseFeature(): Feature {
  return { name: "", location: undefined };
}

export const Feature = {
  encode(message: Feature, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.location !== undefined) {
      Point.encode(message.location, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Feature {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFeature();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.location = Point.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Feature {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      location: isSet(object.location) ? Point.fromJSON(object.location) : undefined,
    };
  },

  toJSON(message: Feature): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.location !== undefined) {
      obj.location = Point.toJSON(message.location);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Feature>, I>>(base?: I): Feature {
    return Feature.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Feature>, I>>(object: I): Feature {
    const message = createBaseFeature();
    message.name = object.name ?? "";
    message.location = (object.location !== undefined && object.location !== null)
      ? Point.fromPartial(object.location)
      : undefined;
    return message;
  },
};

function createBaseRouteNote(): RouteNote {
  return { location: undefined, message: "" };
}

export const RouteNote = {
  encode(message: RouteNote, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.location !== undefined) {
      Point.encode(message.location, writer.uint32(10).fork()).ldelim();
    }
    if (message.message !== "") {
      writer.uint32(18).string(message.message);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RouteNote {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRouteNote();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.location = Point.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.message = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RouteNote {
    return {
      location: isSet(object.location) ? Point.fromJSON(object.location) : undefined,
      message: isSet(object.message) ? globalThis.String(object.message) : "",
    };
  },

  toJSON(message: RouteNote): unknown {
    const obj: any = {};
    if (message.location !== undefined) {
      obj.location = Point.toJSON(message.location);
    }
    if (message.message !== "") {
      obj.message = message.message;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RouteNote>, I>>(base?: I): RouteNote {
    return RouteNote.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RouteNote>, I>>(object: I): RouteNote {
    const message = createBaseRouteNote();
    message.location = (object.location !== undefined && object.location !== null)
      ? Point.fromPartial(object.location)
      : undefined;
    message.message = object.message ?? "";
    return message;
  },
};

function createBaseRouteSummary(): RouteSummary {
  return { point_count: 0, feature_count: 0, distance: 0, elapsed_time: 0 };
}

export const RouteSummary = {
  encode(message: RouteSummary, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.point_count !== 0) {
      writer.uint32(8).int32(message.point_count);
    }
    if (message.feature_count !== 0) {
      writer.uint32(16).int32(message.feature_count);
    }
    if (message.distance !== 0) {
      writer.uint32(24).int32(message.distance);
    }
    if (message.elapsed_time !== 0) {
      writer.uint32(32).int32(message.elapsed_time);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RouteSummary {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRouteSummary();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.point_count = reader.int32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.feature_count = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.distance = reader.int32();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.elapsed_time = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RouteSummary {
    return {
      point_count: isSet(object.point_count) ? globalThis.Number(object.point_count) : 0,
      feature_count: isSet(object.feature_count) ? globalThis.Number(object.feature_count) : 0,
      distance: isSet(object.distance) ? globalThis.Number(object.distance) : 0,
      elapsed_time: isSet(object.elapsed_time) ? globalThis.Number(object.elapsed_time) : 0,
    };
  },

  toJSON(message: RouteSummary): unknown {
    const obj: any = {};
    if (message.point_count !== 0) {
      obj.point_count = Math.round(message.point_count);
    }
    if (message.feature_count !== 0) {
      obj.feature_count = Math.round(message.feature_count);
    }
    if (message.distance !== 0) {
      obj.distance = Math.round(message.distance);
    }
    if (message.elapsed_time !== 0) {
      obj.elapsed_time = Math.round(message.elapsed_time);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RouteSummary>, I>>(base?: I): RouteSummary {
    return RouteSummary.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RouteSummary>, I>>(object: I): RouteSummary {
    const message = createBaseRouteSummary();
    message.point_count = object.point_count ?? 0;
    message.feature_count = object.feature_count ?? 0;
    message.distance = object.distance ?? 0;
    message.elapsed_time = object.elapsed_time ?? 0;
    return message;
  },
};

/** Interface exported by the server. */
export type RouteGuideService = typeof RouteGuideService;
export const RouteGuideService = {
  /**
   * A simple RPC.
   *
   * Obtains the feature at a given position.
   *
   * A feature with an empty name is returned if there's no feature at the given
   * position.
   */
  getFeature: {
    path: "/routeguide.RouteGuide/GetFeature",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: Point) => Buffer.from(Point.encode(value).finish()),
    requestDeserialize: (value: Buffer) => Point.decode(value),
    responseSerialize: (value: Feature) => Buffer.from(Feature.encode(value).finish()),
    responseDeserialize: (value: Buffer) => Feature.decode(value),
  },
  /**
   * A server-to-client streaming RPC.
   *
   * Obtains the Features available within the given Rectangle.  Results are
   * streamed rather than returned at once (e.g. in a response message with a
   * repeated field), as the rectangle may cover a large area and contain a
   * huge number of features.
   */
  listFeatures: {
    path: "/routeguide.RouteGuide/ListFeatures",
    requestStream: false,
    responseStream: true,
    requestSerialize: (value: Rectangle) => Buffer.from(Rectangle.encode(value).finish()),
    requestDeserialize: (value: Buffer) => Rectangle.decode(value),
    responseSerialize: (value: Feature) => Buffer.from(Feature.encode(value).finish()),
    responseDeserialize: (value: Buffer) => Feature.decode(value),
  },
  /**
   * A client-to-server streaming RPC.
   *
   * Accepts a stream of Points on a route being traversed, returning a
   * RouteSummary when traversal is completed.
   */
  recordRoute: {
    path: "/routeguide.RouteGuide/RecordRoute",
    requestStream: true,
    responseStream: false,
    requestSerialize: (value: Point) => Buffer.from(Point.encode(value).finish()),
    requestDeserialize: (value: Buffer) => Point.decode(value),
    responseSerialize: (value: RouteSummary) => Buffer.from(RouteSummary.encode(value).finish()),
    responseDeserialize: (value: Buffer) => RouteSummary.decode(value),
  },
  /**
   * A Bidirectional streaming RPC.
   *
   * Accepts a stream of RouteNotes sent while a route is being traversed,
   * while receiving other RouteNotes (e.g. from other users).
   */
  routeChat: {
    path: "/routeguide.RouteGuide/RouteChat",
    requestStream: true,
    responseStream: true,
    requestSerialize: (value: RouteNote) => Buffer.from(RouteNote.encode(value).finish()),
    requestDeserialize: (value: Buffer) => RouteNote.decode(value),
    responseSerialize: (value: RouteNote) => Buffer.from(RouteNote.encode(value).finish()),
    responseDeserialize: (value: Buffer) => RouteNote.decode(value),
  },
} as const;

export interface RouteGuideServer extends UntypedServiceImplementation {
  /**
   * A simple RPC.
   *
   * Obtains the feature at a given position.
   *
   * A feature with an empty name is returned if there's no feature at the given
   * position.
   */
  getFeature: handleUnaryCall<Point, Feature>;
  /**
   * A server-to-client streaming RPC.
   *
   * Obtains the Features available within the given Rectangle.  Results are
   * streamed rather than returned at once (e.g. in a response message with a
   * repeated field), as the rectangle may cover a large area and contain a
   * huge number of features.
   */
  listFeatures: handleServerStreamingCall<Rectangle, Feature>;
  /**
   * A client-to-server streaming RPC.
   *
   * Accepts a stream of Points on a route being traversed, returning a
   * RouteSummary when traversal is completed.
   */
  recordRoute: handleClientStreamingCall<Point, RouteSummary>;
  /**
   * A Bidirectional streaming RPC.
   *
   * Accepts a stream of RouteNotes sent while a route is being traversed,
   * while receiving other RouteNotes (e.g. from other users).
   */
  routeChat: handleBidiStreamingCall<RouteNote, RouteNote>;
}

export interface RouteGuideClient extends Client {
  /**
   * A simple RPC.
   *
   * Obtains the feature at a given position.
   *
   * A feature with an empty name is returned if there's no feature at the given
   * position.
   */
  getFeature(request: Point, callback: (error: ServiceError | null, response: Feature) => void): ClientUnaryCall;
  getFeature(
    request: Point,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: Feature) => void,
  ): ClientUnaryCall;
  getFeature(
    request: Point,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: Feature) => void,
  ): ClientUnaryCall;
  /**
   * A server-to-client streaming RPC.
   *
   * Obtains the Features available within the given Rectangle.  Results are
   * streamed rather than returned at once (e.g. in a response message with a
   * repeated field), as the rectangle may cover a large area and contain a
   * huge number of features.
   */
  listFeatures(request: Rectangle, options?: Partial<CallOptions>): ClientReadableStream<Feature>;
  listFeatures(request: Rectangle, metadata?: Metadata, options?: Partial<CallOptions>): ClientReadableStream<Feature>;
  /**
   * A client-to-server streaming RPC.
   *
   * Accepts a stream of Points on a route being traversed, returning a
   * RouteSummary when traversal is completed.
   */
  recordRoute(callback: (error: ServiceError | null, response: RouteSummary) => void): ClientWritableStream<Point>;
  recordRoute(
    metadata: Metadata,
    callback: (error: ServiceError | null, response: RouteSummary) => void,
  ): ClientWritableStream<Point>;
  recordRoute(
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: RouteSummary) => void,
  ): ClientWritableStream<Point>;
  recordRoute(
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: RouteSummary) => void,
  ): ClientWritableStream<Point>;
  /**
   * A Bidirectional streaming RPC.
   *
   * Accepts a stream of RouteNotes sent while a route is being traversed,
   * while receiving other RouteNotes (e.g. from other users).
   */
  routeChat(): ClientDuplexStream<RouteNote, RouteNote>;
  routeChat(options: Partial<CallOptions>): ClientDuplexStream<RouteNote, RouteNote>;
  routeChat(metadata: Metadata, options?: Partial<CallOptions>): ClientDuplexStream<RouteNote, RouteNote>;
}

export const RouteGuideClient = makeGenericClientConstructor(RouteGuideService, "routeguide.RouteGuide") as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): RouteGuideClient;
  service: typeof RouteGuideService;
  serviceName: string;
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
