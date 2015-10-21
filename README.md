# mah-book-room-api
A RESTful Web API written in Javascript (NodeJS, ExpressJS) to allow students at Malmö university easy access to book rooms at the Niagara building using their login credentials for Kronox Resursbokning.

## Installation and starting the API

    # npm install
    # npm start

... will start a web server at **http://localhost:3000**

## Live demo

[https://mah-book-room-api.herokuapp.com/](https://mah-book-room-api.herokuapp.com/)

## Endpoints
All responses are `application/json`.

### GET /rooms
Provides an array of all rooms available for booking rooms through the API.

#### Example

    GET http://localhost:3000/rooms

```json
{  
   "rooms":[  
      {  
         "id":"nia0301",
         "name":"NI:A0301",
         "_links":{  
            "self":{  
               "href":"/rooms/nia0301"
            }
         }
      },
      {  
         "id":"nia0302",
         "name":"NI:A0302",
         "_links":{  
            "self":{  
               "href":"/rooms/nia0302"
            }
         }
      },
      ...
    ],
   "_links":{  
      "self":{  
         "href":"/rooms"
      }
   }
}
```

### GET /times
Provides a list of all time slots available to use for booking rooms through the API.

#### Example

    GET http://localhost:3000/times

```json
{  
   "times":[  
      {  
         "id":"08151000",
         "name":"08:15-10:00",
         "_links":{  
            "self":{  
               "href":"/times/08151000"
            }
         }
      },
      {  
         "id":"10151300",
         "name":"10:15-13:00",
         "_links":{  
            "self":{  
               "href":"/times/10151300"
            }
         }
      },
      ...
   ],
   "_links":{  
      "self":{  
         "href":"/times"
      }
   }
}
```


### POST /bookings
A POST request to this endpoint will attempt to book a room at the specified time and date.

#### Authentication
The user credentials needs to be included using [Basic Auth](https://en.wikipedia.org/wiki/Basic_access_authentication).

If something like OAuth2 was applicable to this situation it would surely have been chosen as authentication method.
But since Kronox Resursbokning is made the way it is, no better solution was found than to use Basic Auth.
This in turn means that users have to trust me and my code. I could if I want to save every incoming
credential in a database. But I'm trying to be transparent by publishing the code and making it open source.

But still, you shouldn't POST to my demo of the API at Heroku. I *could* use another repo which saves the credentials, and
just *pretend* that I'm using this one (which is safe, read the code).

And maybe I am.

Hah.

No.

Seriously. I'm not. It's safe.

#### Example POST body
The POST body needs to be valid JSON and include the following attributes:
* `room` - a valid room id
* `date` - a valid date according to [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601), e.g. 2015-10-21
* `time` - a valid time id

```json
{
  "room": "nia0301",
  "date": "2015-12-24",
  "time": "10151300"
}
```

## License
MIT
