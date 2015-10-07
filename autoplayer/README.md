# AutoPlayer
Simple media player for autonomous full screen display on a tiled wall display, capable of playing videos, images and audio files.
Flexible configuration for scripted or generative projects via .xml file. 

At its most basic, AutoPlayer can function as a slideshow viewer.

AutoPlayer was written in C++ using openFrameworks 008+

Load custom configuration file via load_config.xml, edit path and filename desired, relative to data folder.

A configuration file created for this application, with accompanied media, will play unaltered on the Link Mediawall.

# Demo
Included configuration file and media demonstrate a simple poem slideshow with random audio accompaniment and video/image illustration. Demo media in public domain via Prelinger Archive and Freesound.org.

# Link Mediawall
The aspect ratio of the Mediawall is 3.555:1.  Autoplayer may be configured with a tile resolution of 6hx3v, with an overall pixel resolution of 3840 x 1080.  For demoing on your desktop, us a smaller resolution, with the same aspect ratio as the wall, for example 1920x540, which is 1/4 scale of the wall.
