# REST API project to provide information about FIFA World Cup
FIFA WorldCup REST API is a project which utilizes web-crawlers to crawl https://www.fifa.com/ for latest world cup information. 
And integrates with swagger to provide api documentations.

# API Endpoints
- GET /rest/fifa/teams
  - Returns list of all teams participating in the FIFA World Cup.
  - Each team is represented as a team model.
    ```
    {
          "code": "URU",
          "country": "Uruguay",
          "diffGoal": "5",
          "draw": "0",
          "goalAgainst": "0",
          "goalFor": "5",
          "lost": "0",
          "matchPlayed": "3",
          "points": "9",
          "win": "3"
    }
    ```
  
- GET /rest/fifa/matches
  - Returns list of all matches in the FIFA World Cup,
  - Each match is represented as a match model, comprising of team models.
    ```
    {
        "awayTeam": {
            "code": "KSA",
            "country": "Saudi Arabia",
            "goals": "0",
            "penalties": "0",
            "diffGoal": "-5",
            "draw": "0",
            "goalAgainst": "7",
            "goalFor": "2",
            "lost": "2",
            "matchPlayed": "3",
            "points": "3",
            "win": "1"
        },
        "dateTime": "2018-06-14T03:00:00.000Z",
        "gameStatus": "completed",
        "homeTeam": {
            "code": "RUS",
            "country": "Russia",
            "goals": "5",
            "penalties": "0",
            "diffGoal": "4",
            "draw": "0",
            "goalAgainst": "4",
            "goalFor": "8",
            "lost": "1",
            "matchPlayed": "3",
            "points": "6",
            "win": "2"
        },
        "location": "Luzhniki Stadium",
        "stageName": "Group A",
        "time": "Full-time",
        "venue": "Moscow",
        "winnerCode": "RUS"
    }
    ```
    
- GET /rest/fifa/standings
  - Returns list of all teams standings based on groups in the FIFA World Cup,
  - Each standing is represented as a standing model, comprising of list of team models.
  
  ```
  {
      "groupName": "Group A",
      "teams": [
          {
              "code": "URU",
              "country": "Uruguay",
              "diffGoal": "5",
              "draw": "0",
              "goalAgainst": "0",
              "goalFor": "5",
              "lost": "0",
              "matchPlayed": "3",
              "points": "9",
              "win": "3"
          },
          {
              "code": "RUS",
              "country": "Russia",
              "diffGoal": "4",
              "draw": "0",
              "goalAgainst": "4",
              "goalFor": "8",
              "lost": "1",
              "matchPlayed": "3",
              "points": "6",
              "win": "2"
          },
          {
              "code": "KSA",
              "country": "Saudi Arabia",
              "diffGoal": "-5",
              "draw": "0",
              "goalAgainst": "7",
              "goalFor": "2",
              "lost": "2",
              "matchPlayed": "3",
              "points": "3",
              "win": "1"
          },
          {
              "code": "EGY",
              "country": "Egypt",
              "diffGoal": "-4",
              "draw": "0",
              "goalAgainst": "6",
              "goalFor": "2",
              "lost": "3",
              "matchPlayed": "3",
              "points": "0",
              "win": "0"
          }
      ]
  }
  ```
  
  
- GET /rest/fifa/statistics
  - Returns list of goals scored and saved in the FIFA World Cup,
  - Each statistics is represented as a statistics model, comprising of player models.
  ```
  {
      "goalsSavedStats": [
          {
              "countryCode": "BEL",
              "goalsSaveRate": "81.8%",
              "goalsSaved": "27",
              "matchesPlayed": "7",
              "minutesPlayed": "630",
              "name": "Thibaut COURTOIS",
              "playerId": "358106",
              "rank": "1",
              "country": "Belgium"
          }
      ],
      "goalsScoredStats": [
          {
              "assist": "0",
              "countryCode": "ENG",
              "goalsScored": "6",
              "matchesPlayed": "6",
              "minutesPlayed": "573",
              "name": "Harry KANE",
              "penaltiesScored": "3",
              "playerId": "369419",
              "rank": "1",
              "country": "England"
          }
      ]
  }   
  ```
  
- GET /rest/fifa/tournamentInfo
  - Returns tournament information in the FIFA World Cup,
  - Represented as a tournamentInfo model.
  ```
  {
      "endDate": "15 July 2018",
      "startDate": "14 June 2018",
      "title": "2018 FIFA World Cup Russia™"
  }
  ```

- POST /rest/home/collect
  - Starts web crawler to collect latest updates from https://www.fifa.com/
  - Returns a list of all teams participating in the FIFA World Cup.
  
# Demo
https://morning-citadel-77635.herokuapp.com/api-docs

# Installation

```
$ yarn install
```

or

```
$ npm install
```

# Running Project

```
$ yarn start
```

or

```
$ npm start
```

# Tools Used
- cron: Cron is used run web crawler every 30 min for latest updates, if the tournament has finished, 
crawler won't run the collection process, instead would return cached results.
- cheerio: Cherrio is used for web-crawling. Each collection cycle use crawler tools to collect information.
- winston: Winston is used to log.
- swagger: Swagger to serve api-docs.

# Credits
Akhand Singh <akhandsingh68@gmail.com>

# Licence
MIT
