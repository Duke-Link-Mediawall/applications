# Link Mediawall slideshow w/ remote client

This slideshow needs to be hosted by a machine with node.js installed, including the connect and socket.io node modules. 

You can installed these on your local machine, and run a simple node.js based http server. Download the node_js_http_server folder, and run "node http_server.js" from a directory on your local machine or a dedicated server.  Place the slideshow_w_remote directory therein.

Open two browser windows, point one to "http://localhost:8000/slideshow_w_remote/mediawall.html" and the other to "http://localhost:8000/slideshow_w_remote/remoteclient.html"

The remote client talks to the http server via web sockets, and messages are sent to the browser displaying the mediawall.html page.
