# Real-time Web Apps with Node.js, Angular, Socket.io, and Redis

Dive into the future of web applications with this project! We're moving beyond traditional API polling and embracing real-time integration. Imagine your client app maintaining a persistent connection with the server, enabling bidirectional communication and live data streaming. We'll also tackle scalability challenges and integrate Redis as our in-memory data solution.


![Ozkary Real-time Telemetry Chart - Data Engineering Process Fundamentals](./images/ozkary-real-time-telemetry.gif)

### Related Projects

This project is part of the **Data Engineering Process Fundamentals** concepts. For more on data warehouse design with data streaming using Kafka and Spark, check out this repository: [Data Engineering MTA Turnstile](https://github.com/ozkary/data-engineering-mta-turnstile).

> 👉 [Data Engineering Process Fundamental Book on Amazon](https://www.amazon.com/Data-Engineering-Process-Fundamentals-Hands/dp/B0CV7TPSNB "Data Engineering Process Fundamental Book on Amazon by Oscar D. Garcia, ozkary")    

<a href="https://www.amazon.com/Data-Engineering-Process-Fundamentals-Hands/dp/B0CV7TPSNB" target="_amazon">
<img src="https://m.media-amazon.com/images/I/41+MsbOIV1L.jpg" alt="Data Engineering Process Fundamentals: Master the Fundamentals of Data Engineering with a Hands-on Approach" style="width:150px;height:auto;border:0" />
</a></div>

## Architecture

![Ozkary Real-time Telemetry Architecture - Data Engineering Process Fundamentals](./images/ozkary-real-time-telemetry-architecture.png)

## Getting Started

Ready to get your hands dirty? Follow these steps to set up your environment:

1. **Install Redis locally.**
2. **Clone the repository.**
3. **Run the server and client code:**

    ```bash
    # From the server folder
    node server

    # From the client folder
    ng serve

    # Open your browser and navigate to
    https://localhost:4200
    ```

4. **Test the socket integration:**

    ```bash
    # Open your browser and navigate to
    https://localhost:1337
    ```

### Installing Redis on Bash Locally

Get Redis up and running on your local machine with these simple commands. This will install Redis using the default port number 6379.

```bash
$ sudo apt-get install redis-server -y
$ sudo sed -i -e 's/127.0.0.1/0.0.0.0/g' /etc/redis/redis.conf
$ sudo service redis-server restart
```

Start a session using:

```bash
$ redis-cli
```

Test the service with the following commands:

```bash
> set table:key "{data:'here'}"
> get table:key
```

Add and query data with:

```bash
> zadd table:data 100 "{data:'100'}"
> zadd table:data 200 "{data:'200'}"
> ZRANGEBYSCORE table:data 100 200
```

---


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


