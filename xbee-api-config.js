
module.exports = function(RED) {
    "use strict";
    var settings = RED.settings;

    function XbeeApiConfigNode(n) {
        RED.nodes.createNode(this,n);
        this.api_mode = n.api_mode || "1";
        this.module = n.module || "Any";
        this.convert_adc = n.convert_adc || "true";
        this.vref_adc = parseInt(n.vref_adc) || 1200;
        this.raw_frames = false;
    }
    RED.nodes.registerType("xbeeapi-config", XbeeApiConfigNode);

}
