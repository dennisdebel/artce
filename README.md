# ARTCE: Another Real Time Collaborative Editor

ARTCE is a web-based real-time on-line collaborative (text) editor working with Operational Transformations.
Inspired by Etherpad and built upon the examples provided by ShareDB (formerly ShareJS) using Nodejs, Mongodb, [Quill](https://github.com/quilljs/quill) and the [rich-text OT type](https://github.com/ottypes/rich-text).

## Motivation 
Etherpad is a great tool for collaboration albeit resource heavy and buggy. Intrinsically and extrinsically wanting to host my own data, Etherpad didn't run on the hardware I had available (See: Specific Installation Guide). ARTCE also works somewhat better on mobile browsers.


## General Installation Guide
Install Node.js
Install MongoDB
Git clone these files in a directory 

### Run 
```
npm start
```

Load [http://yourserver:8080](http://yourserver:8080)
New documents are created by going to a new path like: [http://yourserver:8080/yournewdoc](http://yourserver:8080/yournewdoc) or [http://yourserver:8080/todaysnotes](http://yourserver:8080/todaysnotes) 


### External Access
Open ports 8080 


## Official Installation Guide
This ARTCE is based on the Rich-Text example provided by ShareDB. The example doesn't offer persistence, this has been added but was undocumented.


### Git clone

### Install dependencies
```
npm install
```
TODO: add the [ShareDBMongo](https://github.com/share/sharedb-mongo) database adapter.


### Build JavaScript bundle and run server
```
npm run build && npm start
```

### Run app in browser
Load [http://yourserver:8080](http://yourserver:8080)


## Specific Installation Guide
My specific hardware is a somewhat crippled ARM based Synology Nas (NEVER EVER buy one!). This guide shows you how to run ARTCE on the obsolete hard and software provide by and to the Synology community. More expensive Synology NAS's supposedly allow you to run Etherpad via Docker Images.

### Synology Hardware Version
DS215j

### Synology Software Version
DSM 6.0.2-8451 Update 6

### Install 
- install node.js v4 (published by Synology)
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

Will return something like: artce start/running, process 23583. To see if its really running, open up a browser and load [http://yourserver:8080](http://yourserver:8080). If all is well you will be greeted by the Quill rich text editor. If its not working, test the command in the startup script in a shell


```
node /var/services/homes/yourusername/rich-text/server.js
```

This will give you some debugging information. Also check your browsers Inspector / Console. Node is picky on how you serve you scripts. Check your paths defined in server.js. Use Express and '__dirname' to define relative paths to your server.js script.


### TODO
-Make images resizable and or (responsive)
-Make it mobile ready (responsive)
-Authorship colors
-Line numbers


