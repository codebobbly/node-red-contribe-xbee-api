
module.exports = function(RED) {
    "use strict";
    var settings = RED.settings;
    var xbee_api = require("xbee-api");

    function XbeeApiConfigNode(n) {
        RED.nodes.createNode(this,n);
        this.api_mode = n.api_mode || "1";
        this.module = n.module || "Any";
        this.convert_adc = n.convert_adc || "true";
        this.vref_adc = parseInt(n.vref_adc) || 1200;
        this.raw_frames = false;
    }
    RED.nodes.registerType("xbee-api-config", XbeeApiConfigNode);

    function XbeeApiOutNode(n) {
        RED.nodes.createNode(this,n);
        this.xbeeapiconfig = n.xbeeapiconfig;
        this.xbeeApiConfigNode = RED.nodes.getNode(this.xbeeapiconfig);

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
            this.error(RED._("xbee-api.errors.missing-conf"));
        }

        this.on("close", function(done) {
            done();
        });

    }
    RED.nodes.registerType("xbee-api out",XbeeApiOutNode);


    function XbeeApiInNode(n) {
        RED.nodes.createNode(this,n);
        this.xbeeapiconfig = n.xbeeapiconfig;
        this.xbeeApiConfigNode = RED.nodes.getNode(this.xbeeapiconfig);

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
            this.error(RED._("xbee-api.errors.missing-conf"));
        }

        this.on("close", function(done) {
            done();
        });

    }
    RED.nodes.registerType("xbee-api in",XbeeApiInNode);
}
