# Realtime Web Apps with Nodejs, Angular, Socket.io, Redis

With this project, we take a look at moving away from traditional API polling integration into a real-time integration in which the client app uses a persistent connection to the server for bidirectional communication and live data streaming. We also talk about the scalability challenges of the application and integration with Redis as our in in-memory data solution.

## Getting Started

Install Redis locally. Clone the repo and run the server and client code as follows:

```
From the server folder - type node server
From the client folder - type ng serve
Open the Browser using https://localhost/4200 to load the client
```

When using the socket integration, open the socket test tool to send data to the server which can then be stream back to the client.

```
Open the Browser using https://localhost/1337
```

### Installing Redis on Bash Locally

Run the following script to install Redis on Bash (Ubunto). This install Redis using the default port number 6379

```
$ sudo apt-get install redis-server -y
$ sudo sed -i -e 's/127.0.0.1/0.0.0.0/g' /etc/redis/redis.conf
$ sudo service redis-server restart
```

Start a session using:
```
$ redis-cli
```
Test the service with the following:
```
>set table:key "{data:'here'}" 
>get table:key
```
Add and Query the data with the following:

```
>zadd table:data 100 "{data:'100'}"
>zadd table:data 200 "{data:'200'}"
>ZRANGEBYSCORE  table:data 100 200
```

## Built With

* [Visual Studio Code](https://code.visualstudio.com/)
* [Nodejs](https://nodejs.org/)
* [Socket.io](https://socket.io/)
* [Angular](https://angular.io/)
* [TypeScript](https://www.typescriptlang.org/)
* [Rxjs](http://reactivex.io/rxjs/)
* [Redis](https://redis.io/) 
* [Plotly.js](https://plot.ly/javascript/)

## Versioning / Branches

* api    - $ git checkout -b api    - api integration 
* socket - $ git checkout -b socket - socketio integration 
* redis  - $ git checkout -b redis  - redis integration 
* master - $ git checkout -b redis  - final integration
* sqlserver - $ git checkout -b sqlserver  - sql server, typeorm and cache-aside pattern

## Authors

* **Oscar Garcia** - *Initial work* - [github](https://github.com/ozkary) 
                                      [blog](http://ozkary.com) 

## License

This project is licensed under the MIT License.

## Acknowledgments


