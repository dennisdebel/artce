# ARTCE: Another Real Time Collaborative Editor

ARTCE is a web-based real-time on-line collaborative (text) editor working with Operational Transformations.
Inspired by Etherpad and built upon the examples provided by ShareDB (formerly ShareJS) using Nodejs, Mongodb, [Quill](https://github.com/quilljs/quill) and the [rich-text OT type](https://github.com/ottypes/rich-text).


## Motivation 
Etherpad is a great tool for collaboration albeit resource heavy and buggy. Intrinsically and extrinsically wanting to host my own data, Etherpad didn't run on the hardware I had available (See: Specific Installation Guide). ARTCE also works somewhat better on mobile browsers.


## General Installation Guide
- Install Node.js
- Install MongoDB
- Git clone these files in a directory and enter it


### Run 
Start MongoDB daemon

sudo mongod
```
Start ARTCE
```

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
npm install sharedb-mongo
```

and 

```
npm install http
```

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

### Run Mongodb as service

####Step 1: Create a startup script
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
exec /usr/bin/mongod
```

####Step 2: Test the script manually

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
# start npm in yourusername/rich-text (edit this to reflect the full, absolute path to your node script (server.js))
exec node /var/services/homes/yourusername/rich-text/server.js

```

####Step 2: Test the script manually

```
sudo start artce
```

Will return something like: artce start/running, process 23583. To see if its really running, open up a browser and load [http://yourserver:9999](http://yourserver:9999). If all is well you will be greeted by the Quill rich text editor. If its not working, test the command in the startup script in a shell


```
node /var/services/homes/yourusername/rich-text/server.js
```

This will give you some debugging information. Also check your browsers Inspector / Console. Node is picky on how you serve you scripts. Check your paths defined in server.js. Use Express and '__dirname' to define relative paths to your server.js script.


### TODO & Wishlist

#### Responsive
- Make images resizable and or (responsive)
- Make it mobile ready (responsive)

#### Colors 
[https://quilljs.com/0.20/docs/modules/authorship/](https://quilljs.com/0.20/docs/modules/authorship/)


#### Linenumbers
[https://quilljs.com/docs/modules/syntax/](https://quilljs.com/docs/modules/syntax/)


#### Export (html/markdown/pdf)
[https://www.npmjs.com/package/quilljs-renderer](https://www.npmjs.com/package/quilljs-renderer)

#### HTTP proxy 
To circumvent pesky university firewalls
[http://stackoverflow.com/questions/11172351/how-to-put-nodejs-and-apache-in-the-same-port-80](http://stackoverflow.com/questions/11172351/how-to-put-nodejs-and-apache-in-the-same-port-80)







