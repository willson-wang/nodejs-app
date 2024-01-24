import fs from 'fs'
import path from 'path'
import async from 'async'
import _ from 'lodash'
import { routeGuide } from '../grpc-client-wrap/routeGuideGrpcClient'


var COORD_FACTOR = 1e7;

export class RouteGuideService {
    async getFeature() {
        try {
            const { response } = await routeGuide.getFeature({
                payload: {
                    latitude: 1,
                    longitude: 2
                }
            })
            return response
        } catch (error) {
            throw error
        }
    }

    async listFeatures() {
        try {
            const { response } = await routeGuide.listFeatures({
                payload: {
                    lo: {
                        latitude: 400000000,
                        longitude: -750000000
                    },
                    hi: {
                        latitude: 420000000,
                        longitude: -730000000
                    }
                }
            })

            return response
        } catch (error) {
            throw error
        }
    }

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

                    const call = routeGuide.recordRoute({});
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
                    async.series(point_senders, async function () {
                        call.end();
                        try {
                            const { response } = await call.callback
                            resolve(response)
                        } catch (error) {
                            reject(error)
                        }
                    });
                });
            })
            return result
        } catch (error) {
            throw error
        }
    }


    async routeChat() {
        try {
            var call = routeGuide.routeChat({});

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
            const { response } = await call.callback
            return response
        } catch (error) {
            throw error
        }
    }
}