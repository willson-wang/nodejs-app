#!/usr/bin/env bash

PROTOC="$(npm bin)/grpc_tools_node_protoc"
# PROTOC=`which protoc`
PROTOS=`find ./proto -name '*.proto'`

rm -rf ./src/grpc-gen
mkdir -p ./src/grpc-gen

echo "$PROTOC"
echo "$PROTOS"

$PROTOC --plugin=./node_modules/.bin/protoc-gen-ts_proto \
    --ts_proto_out=./src/grpc-gen \
    --ts_proto_opt=fileSuffix=_pb,esModuleInterop=true,outputServices=grpc-js,snakeToCamel=false,lowerCaseServiceMethods=true \
    --proto_path=./proto \
    $PROTOS
