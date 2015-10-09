# Link Mediawall slideshow w/ remote clients

Use these files to develop a html5/canvas/js slideshow project, that can be displayed, without major work, on the Link Mediawall.  The remote clients, for example a smartphone w/ QR code reader, can access the exhibit via a qr code displayed on the Mediawall.  A slide gallery will appear on the remote client's screen, and the user can request specific slides be played on the Mediawall.  The Mediawall will revert to an automated slideshow function when not being actively controlled by any remote client, for a specified period of time.

This project demonstrates how socket.io/websockets messages are passed between two web pages, allowing one to serve as an interface for the other, and can be used as a template for more complex development, content and interfaces.

Download these files to your local machine for development, and substitute your own content and make modifications as desired.

This slideshow, and all the related files, need to be hosted and served by a machine with node.js installed, including the connect and socket.io node modules (installed via npm, node package manager, which comes pre-bundled with node.js). Refer to https://nodejs.org for installation instructions.

You should install the node.js software on your local machine or a preferred server.  You can then run a simple node.js based http server, which will serve your Mediawall slideshow and remote client files, and handle the transmission of messages between the remote clients and the Mediawall.

After the installation of node.js is complete, download the node_js_http_server folder and place it somewhere in your machine's' directories. Place the slideshow_w_remote directory within the node_js_http_server directory. Run the http_server.js script, via the terminal window.  Navigate to the http server directory and type "node http_server.js &" (the "&" symbol runs script process in the background)(if on a OSX or Linux machine). 

Open two browser windows, point one to "http://localhost:8000/slideshow_w_remote/mediawall.html" and the other to "http://localhost:8000/slideshow_w_remote/remoteclient.html". Substitute a different URL for "localhost", if your files are being hosted on a remote server.

You can edit the http server's network port number, via the http_server.js script file.  By default it is set to port 8000. There is a chance that you will need to edit your machines firewall settings to open this port.

The LINK Mediawall displays web-based projects in a kiosk/presentation mode version of Google Chrome.




