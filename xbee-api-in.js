
module.exports = function(RED) {
    "use strict";
    var settings = RED.settings;
    var xbee_api = require("xbee-api");

    function XbeeApiInNode(n) {
        RED.nodes.createNode(this,n);
        this.xbeeApiConfig = n.xbeeapiconfig;
        this.xbeeApiConfigNode = RED.nodes.getNode(this.xbeeApiConfig);

        if (this.xbeeApiConfigNode) {
            var node = this;
            node.xbeeAPI = new xbee_api.XBeeAPI(node.xbeeApiConfigNode);
            node.on("input",function(msg) {
                if (msg.hasOwnProperty("payload")) {

                    var payload = msg.payload;
                    if (!Buffer.isBuffer(payload)) {
                        if (typeof payload === "object") {
                            payload = JSON.stringify(payload);
                        }
                        else {
                            payload = payload.toString();
                        }
                        payload += node.addCh;
                    }

                    node.xbeeAPI.parseRaw(payload);

                }
            });

            node.xbeeAPI.on("frame_object", function(frame) {
                node.send({"payload": frame});
            });

        } else {
            this.error(RED._("xbeeapi.errors.missing-conf"));
        }

        this.on("close", function(done) {
            done();
        });

    }
    RED.nodes.registerType("xbeeapi in",XbeeApiInNode);
}
