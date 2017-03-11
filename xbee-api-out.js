
module.exports = function(RED) {
    "use strict";
    var settings = RED.settings;
    var xbee_api = require("xbee-api");

    function XbeeApiOutNode(n) {
        RED.nodes.createNode(this,n);
        this.xbeeApiConfig = n.xbeeapiconfig;
        this.xbeeApiConfigNode = RED.nodes.getNode(this.xbeeApiConfig);

        if (this.xbeeApiConfigNode) {
            var node = this;
            node.xbeeAPI = new xbee_api.XBeeAPI(node.xbeeApiConfigNode);
            node.on("input",function(msg) {
                if (msg.hasOwnProperty("payload")) {

                    var payload = msg.payload;
                    if (typeof payload !== "object") {
                        if (Buffer.isBuffer(payload)) {
                            payload = payload.toString();
                        }
                        payload = JSON.parse(payload);
                    }

                    try {
                        payload = node.xbeeAPI.buildFrame(payload);
                    } catch (error) {
                        node.error(error.message, msg);
                    }

                    node.send({"payload": payload});

                }
            });
        } else {
            this.error(RED._("xbeeapi.errors.missing-conf"));
        }

        this.on("close", function(done) {
            done();
        });

    }
    RED.nodes.registerType("xbeeapi out",XbeeApiOutNode);

}
