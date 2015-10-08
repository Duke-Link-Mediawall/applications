# Link Mediawall slideshow w/ remote clients

This slideshow, and all the related files, need to be hosted and served by a machine with node.js installed, including the connect and socket.io node modules (installed via npm, node package manager, which comes pre-bundled with node.js). Refer to https://nodejs.org for installation instructions.

You should install the node.js software on your local machine or a preferred server.  You can then run a simple node.js based http server, which will serve your mediawall slideshow and remote client files, and handle the transmission of messages between the remote clients and the mediawall.

After the installation of node.js is complete, download the node_js_http_server folder and place it somewhere in your machine's' directories. Place the slideshow_w_remote directory within the node_js_http_server directory. Run the http_server.js script, via the terminal window.  Navigate to the http server directory and type "node http_server.js &" (the "&" symbol runs script process in the background). 

Open two browser windows, point one to "http://localhost:8000/slideshow_w_remote/mediawall.html" and the other to "http://localhost:8000/slideshow_w_remote/remoteclient.html".

You can edit the http server's network port number, via the http_server.js script file.  By default it is set to port 8000. There is a chance that you will need to edit your machines firewall settings to open this port.





