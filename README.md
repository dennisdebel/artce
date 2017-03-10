# ARTCE: Another Real Time Collaborative Editor

ARTCE is a web-based real-time on-line collaborative (text) editor working with Operational Transformations.
Inspired by Etherpad and built upon the examples provided by ShareDB (formerly ShareJS) using Nodejs, Mongodb, [Quill](https://github.com/quilljs/quill) and the [rich-text OT type](https://github.com/ottypes/rich-text).


![demo img](https://raw.githubusercontent.com/dennisdebel/rtce/master/demo.gif)



## Motivation 
Etherpad is a great tool for collaboration albeit resource heavy and buggy. Intrinsically and extrinsically wanting to host my own data, Etherpad didn't run on the hardware I had available (See: Specific Installation Guide). ARTCE also works somewhat better on mobile browsers.


## General Installation Guide
- Install Node.js
- Install MongoDB
- Git clone these files in a directory and enter it ($ cd artce)


### Run 
Start MongoDB daemon

```
sudo mongod
```

Start ARTCE

```
npm start 
```

Load [http://yourserver:9999](http://yourserver:9999)
New documents are created by going to a new path like: [http://yourserver:9999/yournewdoc](http://yourserver:9999/yournewdoc) or [http://yourserver:9999/todaysnotes](http://yourserver:9999/todaysnotes) 


### External Access
Open ports 9999 


## Official Installation Guide
This ARTCE is based on the Rich-Text example provided by ShareDB. To run their example:

```
git clone https://github.com/share/sharedb/tree/master/examples/rich-text
```

```
cd rich-text
```

Install dependencies
```
npm install
```

Bundle Javascript and run server
```
npm run build && npm start
```

Run example in browser
Load [http://yourserver:8080](http://yourserver:8080)

The example doesn't offer persistence and was not documented.

### Adding persistence 

Cd in to 'rich-text' directory and install dependencies (add the [ShareDBMongo](https://github.com/share/sharedb-mongo) database adapter)

```
npm install sharedb-mongo http mongodb
```

(in case of errors try installing the packages individually, one by one)

Now replace the examples server.js and /static/dist/bundle.js with the files from this repo, run NodeJS (npm start) and MongoDB daemon (sudo mongod) and you will have persistence. If not, copy all of the 'node_modules' from this repo in the 'rich-text' folder and try again ;)




## Specific Installation Guide
My specific hardware is a somewhat crippled ARM based Synology Nas (NEVER EVER buy one!). This guide shows you how to run ARTCE on the obsolete hard and software provide by and to the Synology community. More expensive Synology NAS's supposedly allow you to run Etherpad via Docker Images.

### Synology Hardware Version
DS215j

### Synology Software Version
DSM 6.0.2-8451 Update 6

### Install 
- install git (server) from Synology official Package Center (published by Synology)
- install node.js v4 from Synology official Package Center (published by Synology)
- instal mongodb v2.1.1-160419-beta (package center > settings > package sources > add: http://synology.acmenet.ru/)

```
sudo mongod
```

load [http://yourserver:28017](http://yourserver:28017) to see if MongoDB is running.


```
git clone https://github.com/dennisdebel/artce.git
```

```
cd artce
```

```
npm start
```

Load [http://yourserver:9999/newdoc](http://yourserver:9999/newdoc) in your browser


### Run Mongodb as service

####Step 1: Secure your MongoDB installation
MongoDB comes with no security whatsoever. 'Nice for testing' they call it, but I think this is very bad practice. It will have your server up and running in 1 minute, but it *will* get 'hacked' (well, just malicious access by script kiddies) in a few days.

```
mkdir /data/db

mongod 

```

start mongo shell and create user:

```
mongo

use admin //connect to admin database

db.addUser("admin" , "yourpass")

exit

```

restart monogod with authentication:
```
mongod --auth
```

if you open a browser on http://yourserver:28017/
you will have to authenticate with your pass



log back in with your admin credentials:

```
mongo admin -u admin -p

```


add normal user with read write acces for specific db

```
use testdatabase

db.addUser("user", "testpasswd")
```


NOTE: provide server.js with your credentials!
change your connecting url to: mongodb://user:testpasswd@localhost:27017/?authMechanism=DEFAULT&authSource=test
or mongodb://admin:yourpass@localhost:27017/?authMechanism=DEFAULT&authSource=admin


####Step 2: Create a startup script
SSH into your box. Startup scripts are located in /etc/init/. Script follow the 'servicename.conf' naming convention, where 'servicename' is whatever you want it to be called. In our case mongodb. To create a startup script for monogd (MongoDB Daemon):

```
sudo vi /etc/init/mongodb.conf
```

Add the following contents and save:

```
# only start this service after the httpd user process has started
start on started httpd-user

# stop the service gracefully if the runlevel changes to 'reboot'
stop on runlevel [06]

# run the scripts as root (the default), its a bad idea but dsm likes it...
setuid root

# exec the process. Use absolute path names so that there is no reliance on the $PATH environment variable
exec /usr/bin/mongod --auth
```

####Step 3: Test the script manually

```
sudo start mongodb
```

Will return something like: mongodb start/running, process 9311. To see if its really running, open up a browser and load [http://yourserver:28017](http://yourserver:28017). If all is well you will be greeted by the MongoDB log/config screen.



### Run ARTCE as service

####Step 1: Create a startup script
SSH into your box. Startup scripts are located in /etc/init/. Script follow the 'servicename.conf' naming convention, where 'servicename' is whatever you want it to be called. In our case artce.  To create a startup script for ARTCE:

```
sudo vi /etc/init/artce.conf
```

Add the following contents and save:

```
# only start this service after the httpd user process has started
start on started httpd-user

# stop the service gracefully if the runlevel changes to 'reboot'
stop on runlevel [06]

# run the scripts as the 'http' user. Running as root (the default) is a bad idea.
setuid http

# exec the process. Use absolute path names so that there is no reliance on the $PATH environment variable
# start npm in yourusername/artce (edit this to reflect the full, absolute path to your node script (server.js))
exec node /var/services/homes/yourusername/artce/server.js

```

####Step 2: Test the script manually

```
sudo start artce
```

Will return something like: artce start/running, process 23583. To see if its really running, open up a browser and load [http://yourserver:9999](http://yourserver:9999). If all is well you will be greeted by the Quill rich text editor. If its not working, test the command in the startup script in a shell


```
node /var/services/homes/yourusername/artce/server.js
```

This will give you some debugging information. Also check your browsers Inspector / Console. Node is picky on how you serve you scripts. Check your paths defined in server.js. Use Express and '__dirname' to define relative paths to your server.js script.


### Special Pages
[http://yourserver:9999/admin](http://yourserver:9999/admin) - overview of existing pads


### Features
- auto formatting of urls (urls become links, image urls become inline images)
- line numbering
- html 'export'


### TODO & Wishlist

#### Responsive
- DONE: Make it bit more mobile ready (responsive), meta viewport
- copy paste on mobile safari / ios is as broken as with etherpad, because of websocket updates?

#### Auto img urls to img 'tags'
- DONE:convert urls ending in .jpg, .png, .gif to actual images (so no uploading required) 

#### Modes
- presentations mode (print css works nicely in Firefox)
- static, read-only mode (also look into: http://www.sfyn.net/etherpad-lite-performances-an-ongoing-saga/)
 
#### Authorship colors 
[https://quilljs.com/0.20/docs/modules/authorship/](https://quilljs.com/0.20/docs/modules/authorship/)

#### Line numbers
[https://quilljs.com/docs/modules/syntax/](https://quilljs.com/docs/modules/syntax/)
- DONE: early 'poor mans' version of line numbers implemented, based on css counters....

#### Export (html/markdown/pdf)
- DONE: early html export function is implemented [https://www.npmjs.com/package/quilljs-renderer](https://www.npmjs.com/package/quilljs-renderer)

#### HTTP proxy 
To circumvent pesky university firewalls
[http://stackoverflow.com/questions/11172351/how-to-put-nodejs-and-apache-in-the-same-port-80](http://stackoverflow.com/questions/11172351/how-to-put-nodejs-and-apache-in-the-same-port-80)


### Other Projects

- [Ethertoff](http://osp.kitchen/tools/ethertoff/) - shell for etherpad lite, offering Read/Write/Print interface. By [OSP](http://osp.kitchen/tools/ethertoff/).


### MIT License

ShareDB/ShareJS and ShareDB-Mongo driver originally copyrighted (c) 2015 by Joseph Gentle and Nate Smith.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


