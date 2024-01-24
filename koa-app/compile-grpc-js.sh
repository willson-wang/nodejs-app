#!/usr/bin/env bash

PROTOC="$(npm bin)/grpc_tools_node_protoc"
# PROTOC=`which protoc`
PROTOS=`find ./proto -name '*.proto'`

echo "$PROTOC"
echo "$PROTOS"

$PROTOC --js_out=import_style=commonjs,binary:./ --grpc_out=grpc-js:./ --proto_path=./proto $PROTOS
