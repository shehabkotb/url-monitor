# url-monitor
RESTful API server that allows authenticated users to monitor URLs, users can recieve notifications when the status of the url they registered change status, there are three ways to recieve the notifications, via Email, webhook and pushover mobile application.



## setup
To run this project, you need to install docker first.
Then you can use the following command.
```
docker compose up
```
The server will run on 127.0.0.1:8080 and mongo express admin on 127.0.0.1:8081
### Enviroment Variables
I have provided default for most env variables, you only need gmail and a gmail app password for the email features, you can see how to get app password for your gmail [here](https://support.google.com/accounts/answer/185833?hl=en)



