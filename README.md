# RTCE: Real Time Collaborative Editor

RTCE is a web-based real-time on-line collaborative (text) editor working with Operational Transformations.
Inspired by Etherpad and built upon the examples provided by ShareDB (formerly ShareJS) using Nodejs, Mongodb, [Quill](https://github.com/quilljs/quill) and the [rich-text OT type](https://github.com/ottypes/rich-text).

## Motivation 
Etherpad is a great tool for collaboration albeit resource heavy and buggy. Intrinsically and extrinsically wanting to host my own data, Etherpad didn't run on the hardware I had available (See: Specific Installation Guide). This did.


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


## Official Installation Guide
This RTCE is based on the Rich-Text example provided by ShareDB. The example doesn't offer persistency, this has been added but was undocumented.


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
My specific hardware is a somewhat crippled ARM based Synology Nas (NEVER EVER buy one!). This guide shows you how to run the RTCE on the obsolete hard and software provide by and to the Synology community. More expensive Synology NAS's supposedly allow you to run Etherpad via Docker Images.

### Synology Hardware Version: 
DS215j

### Synology Software Version:
DSM 6.0.2-8451 Update 6

### Install 
- install node.js v4 (published by Synology)
- instal mongodb v2.1.1-160419-beta (package center > settings > package sources > add: http://synology.acmenet.ru/)

### Run Mongodb and RTCE as service
