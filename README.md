<h1 align="center">
​    Y&VVideo
</h1>



Y&VVideo is an application allowing to search videos on YouTube and Vimeo, create playlists and show history of your research.

The backend is developed with [nodeJS](http://nodejs.org/), the frontend with [AngularJS](https://angularjs.org/).

## Getting Started

You can have a preview of the app here : [YVVideoApplication](https://156.96.114.66:3000/?fbclid=IwAR0riwxSt56-W-wB8C2JgfhbwoqQA5f1mt5luL3u42DoDIpN-JRp9_Fx4w0#!/home).

### Prerequisites

To run this project, you will need :

- [nodeJS](http://nodejs.org/) 13.1.0+
- [MongoDB](https://www.mongodb.com/) 2.6+

### Installing

To build this project, simply clone this repository:

```shell
git clone https://github.com/huyenpfiev/YVvideoApp
```

### Running

You can run the servers independently, but you need them all to use the app completely:

```shell
cd servers
```
```shell
node API.js
```
```shell
node app.js
```

Do not forget to launch the MongoDB server :
```shell
mongod
```

### Usage

Using the default settings, simply browse to https://localhost:3000. You can:

- login
- register
- search videos on Youtube or Vimeo

Once successfully logged in, you can:

- create/delete playlists
- add/delete videos to playlists
- see history


## Author

- **Thi Thanh Huyen DINH** 
- **Soukaina El Majdoubi** 
- **Ghofrane Guizani**


