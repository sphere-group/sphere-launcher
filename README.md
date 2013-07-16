sphere-launcher
===============

SpheRun, the node-webkit powered Sphere game launcher!

[Sphere](http://spheredev.org/) is a JavaScript-based game engine. This is a cross-platform launcher for the game engine, built with HTML and Node.js using [node-webkit](https://github.com/rogerwang/node-webkit).


How to run
==========
* Pull/download all files in the repository.
* Download and extract the appropriate release of [node-webkit](https://github.com/rogerwang/node-webkit#downloads).
* From the node-webkit path, run:
    nw path/to/SpheRun

[Official and detailed instructions are here](https://github.com/rogerwang/node-webkit/wiki/How-to-run-apps).


Read before using
=================
there's no configuration options yet, so you have to set up your game and engine paths manually. ''SpheRun won't work until you do.''

* Open SpheRun.cfg. This is a JavaScript file containing some simple arrays of data right now.
* Add or edit paths to Sphere game directories at CONFIG.gamepaths.
* Define the game engine at CONFIG.engines. Only CONFIG.engines[0] runs at the moment. Include the "engine.exe" in your path.
