# adaptive-arp-showcase

## Installation

- You have to install at least Node v0.12 https://nodejs.org/download/
- Clone/Fork or download the repository
- Open a terminal and move to the download folder (where the **package.json** is located)
- Run ```(sudo) npm install``` to install all the dependencies
- Install **Grunt client** ```(sudo) npm i -g grunt-cli```

## Development

- Open a terminal and run ```grunt watch```
- Open a terminal and run ```grunt server```
- Open a browser and load: http://localhost:8282/

*Note: This method does not connect to the Adaptive ARP platform. This only allow you to develop some JS/CSS functions*

## Distribution

- Change the **distribution path: "dist_path"** on the Gruntfile.js. It's recomented to point the distribution path to a **www** folder inside a Adaptive Runtime Platform (Darwin or Android).
- Open a terminal and run ```grunt dist```
- Run the Adaptive Runtime Platform into a emulator or a device and enjoy!
