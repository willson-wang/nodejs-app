import grpc from '@grpc/grpc-js'
import * as route_guide_pb from '../grpc-gen/route_guide_pb'
import { BaseGrpcClient } from '../utils/request'

// 后面需要自动生成
class RouteGuide extends BaseGrpcClient {
    constructor() {
      super()
      this.init(route_guide_pb.RouteGuideClient)
    }
    getFeature({payload, options, metadata}: {payload: route_guide_pb.Point,options?: grpc.CallOptions | null,metadata?: grpc.Metadata | null}): Promise<{ response: route_guide_pb.Feature, metadata: grpc.Metadata }> {
      return this.request<route_guide_pb.Feature>({action: 'getFeature', payload, options, metadata});
    }
    listFeatures({payload, metadata, options}: {payload: route_guide_pb.Rectangle, metadata?: grpc.Metadata | null, options?: grpc.CallOptions | null}): Promise<{ response: route_guide_pb.Feature, metadata: grpc.Metadata }>
    {
      return this.responseStream<route_guide_pb.Feature>({action: 'listFeatures', payload, options, metadata})
    }
    recordRoute({metadata, options}: {metadata?: grpc.Metadata | null, options?: grpc.CallOptions | null}): grpc.ClientWritableStream<route_guide_pb.Point> & {callback: Promise<{response: route_guide_pb.RouteSummary, metadata: grpc.Metadata}>}
    {
      return this.requestStream<route_guide_pb.RouteSummary>({action: 'recordRoute', options, metadata})
    }
    routeChat({metadata, options}: {metadata?: grpc.Metadata | null, options?: grpc.CallOptions | null}): grpc.ClientDuplexStream<route_guide_pb.RouteNote, route_guide_pb.RouteNote> & {callback: Promise<{response: route_guide_pb.RouteNote, metadata: grpc.Metadata}>}
    {
      return this.bidirectionalStream<route_guide_pb.RouteNote>({action: 'routeChat', options, metadata})
    }
}

export const routeGuide = new RouteGuide()