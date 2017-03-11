node-red-contribe-xbee-api
========================

<a href="http://nodered.org" target="_new">Node-RED</a> nodes to talk to
xbee (API Mode).

Install
-------

Run the following command in your Node-RED user directory (typically `~/.node-red`):

        npm i node-red-contribe-xbee-api

For versions on node.js prior to 4.x (ie v0.10.x and v0.12.x) please install using

        sudo npm i -g npm@2.x
        npm i node-red-contribe-xbee-api

During install there may be multiple messages about optional compilation.
These may look like failures... as they report as failure to compile errors -
but often are warnings and the node will continue to install and, assuming nothing else
failed, you should be able to use it. Occasionally some platforms *will* require
you to install the full set of tools in order to compile the underlying package.


Usage
-----

Provides two nodes - one to receive messages, and one to send.

### Input

Reads data from msg.payload and parse them into Frames. It then outputs `msg.payload` as either a Frame Object.

### Output

Reads data from msg.payload as a Frame Object and parse them into msg.payload as raw.

Only the `msg.payload` is sent.
