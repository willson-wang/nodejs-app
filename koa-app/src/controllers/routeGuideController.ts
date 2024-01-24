import fs from 'fs'
import path from 'path'
import async from 'async'
import _ from 'lodash'
import { Get, JsonController } from 'routing-controllers'
import { credentials } from '@grpc/grpc-js'
import { RouteGuideClient } from '../grpc-gen/route_guide_pb'

const client = new RouteGuideClient('localhost:50051', credentials.createInsecure())

var COORD_FACTOR = 1e7;

@JsonController('/route-guide')
export class RouteGuide {
    @Get('/getFeature')
    async getFeature() {
        try {
            const result = await new Promise((resolve, reject) => {
                client.getFeature({
                    latitude: 1,
                    longitude: 2
                }, (err, response) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(response)
                    }
                })
            })
            return result
        } catch (error) {
            throw error
        }
    }

    @Get('/listFeatures')
    async listFeatures() {
        try {
            const result = await new Promise((resolve, reject) => {
                const call = client.listFeatures({
                    lo: {
                        latitude: 400000000,
                        longitude: -750000000
                    },
                    hi: {
                        latitude: 420000000,
                        longitude: -730000000
                    }
                })

                let result = []
                call.on('error', reject)

                call.on('data', function (data) {
                    result.push(data)
                })

                call.on('end', function () {
                    resolve(result)
                })
            })
            return result
        } catch (error) {
            throw error
        }
    }

    @Get('/recordRoute')
    async recordRoute() {
        try {
            const result = await new Promise((resolve, reject) => {

                fs.readFile(path.join(__dirname, '../../db.json'), { encoding: 'utf-8' }, function (err, data) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    var feature_list = JSON.parse(data);

                    var num_points = 10;
                    var call = client.recordRoute(function (error, stats) {
                        if (error) {
                            reject(error);
                            return;
                        }
                        resolve(stats);
                    });
                    function pointSender(lat, lng) {
                        /**
                         * Sends the point, then calls the callback after a delay
                         * @param {function} callback Called when complete
                         */
                        return function (callback) {
                            console.log('Visiting point ' + lat / COORD_FACTOR + ', ' +
                                lng / COORD_FACTOR);
                            call.write({
                                latitude: lat,
                                longitude: lng
                            });
                            _.delay(callback, _.random(500, 1500));
                        };
                    }
                    var point_senders = [];
                    for (var i = 0; i < num_points; i++) {
                        var rand_point = feature_list[_.random(0, feature_list.length - 1)];
                        point_senders[i] = pointSender(rand_point.location.latitude,
                            rand_point.location.longitude);
                    }
                    async.series(point_senders, function () {
                        call.end();
                    });
                });
            })
            return result
        } catch (error) {
            throw error
        }
    }


    @Get('/routeChat')
    async routeChat() {
        try {
            const result = await new Promise((resolve, reject) => {
                var call = client.routeChat();
                let arr = []
                call.on('data', function (note) {
                    // console.log('Got message "' + note.message + '" at ' +
                    //     note.location.latitude + ', ' + note.location.longitude);
                    arr.push(note)
                });

                call.on('error', reject)

                call.on('end', () => {
                    resolve(arr)
                });

                var notes = [{
                    location: {
                        latitude: 0,
                        longitude: 0
                    },
                    message: 'First message'
                }, {
                    location: {
                        latitude: 0,
                        longitude: 1
                    },
                    message: 'Second message'
                }, {
                    location: {
                        latitude: 1,
                        longitude: 0
                    },
                    message: 'Third message'
                }, {
                    location: {
                        latitude: 0,
                        longitude: 0
                    },
                    message: 'Fourth message'
                }];
                for (var i = 0; i < notes.length; i++) {
                    var note = notes[i];
                    console.log('Sending message "' + note.message + '" at ' +
                        note.location.latitude + ', ' + note.location.longitude);
                    call.write(note);
                }
                call.end();
            })
            return result
        } catch (error) {
            throw error
        }
    }
}