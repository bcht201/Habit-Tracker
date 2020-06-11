# Lap 3 Project
## For 3 days you will be working to create a habit tracker.

### What does it do? 
- The premise of this project is to utilise MongoDB to create an API for a habit tracker
- Each user has a collection of habits that they would like to track daily and specify the frequency it should be completed per day

### User stories:
- As a user, I should be able to add myself into the database as a new user
- As a user, I should be able to add a habit into the database to track 
- As a user, I should be able to choose the frequency at which I want to track the habit, i.e. how many times I must complete it per day until it is finished
- As a user I should be able to track a habit and mark it as complete 
- As a user I should be able to see a list of completed habits for the day
- As a user I should be able to see if I have a streak of completing a specific habit

### Technical functionality:  
- Developers should locally host a database to store the daily information about users.
- CRUD capabilities
- The backend should be tested using a testing framework and functional, intreracting through an api testing tool. 
- TDD 

### How to get started
- Install a local version of MongoDB based on this link: https://medium.com/@LondonAppBrewery/how-to-download-install-mongodb-on-windows-4ee4b3493514
- npm install- to install dependencies for this project
- Start mongod.exe to start connection to DB
- npm start- start connection and makes requests to routes listed below
- npm test- run test suite for all the routes of the API

# Routes
## /users:
- GET: / -> get all users in the database
- GET: /:ID -> get a specific user in the database
- POST: /addUser -> add new user to DB, requires req.body.name

## /activity:
- GET: ?user=ID -> get all activities of a specific user
- GET: ?user=ID&complete=true -> get all completed activities of a specific user
- GET: ?user=ID&complete=false -> get all incomplete activities of a specific user
- PUT: /complete/:activityID -> mark an activity as completed once. This can be done up to the specified frequency of that activity.
- PUT: /edit?activity=ID&field=name&new=newData -> update a certain field of an activity
- POST: /new -> add new activity to DB  
* require Name of activity(req.body.name), Which user to add to(req.body.userID), frequency per day(req.body.frequency)

# Development Stages:
## Stage 1
- Directly input data into MongoDB to establish a database
- Establish GET request to 'SELECT *' to view database as first interaction 
- List out routes to get MVP

## Stage 2
- Build schemas for DB structures
- Build core functionality routes

## Stage 3
- Build remaining CRUD routes 

# DB structure
* Each document in both collections have a reference to each other (U1 = User 1, A1 = activity 1)
* This is so that the populate method of mongoose can be used 

- User
    - User 1
        - Name: X
        - Activity: [
            A1
            A2
            A3
        ]
    - User 2
        ..

- Activity
    - Activity 1
        - U1
    - Activity 2
        - U2

# Evaluating completion when updating task
## Activity/ Habit parameters
- Timeframe: daily only
- Deadline: Initialised on new entry, checked and updated on PUT(update request)
- Frequency: keep track of how many completed submissions until marked finished
- Completed: no. of times submitted as completed before deadline is reached
- Streak: no. of times task marked completed within timeframe


## Logic flowchart: 
### Initialisation (Add to task list)
- Timeframe: as inputted
- Deadline: daily(current time + 1 day 00:00)
- Freq: as inputted
- Completed: 0
- Streak: 0

### Update (Mark as complete)
- Already completed && current time is before deadline == already done for the day
- Not completed && current time is before deadline == completeToday++ or reset && streak++
- Current time is after deadline > 1 day == reset (streak broken)
- Current time is after deadline < 1 day && completed == keep streak, reset for new day
- Current time is after deadline < 1 day && !completed == reset, streak broken


# Things to expand on if there was more time
- Front end -> React app front end with views/ forms that interacted directly with the API 
- Status codes -> currently done sporadically but would have been ideally used in all the routes as best practice
- Defensive coding -> Ensuring everything can fail gracefully, currently implemented in most but not all parts of code
- Log in system -> currently API just has a collection of users and must specify the userID when accessing activities.
- Seeding route -> TDD meant I indirectly seeded the test database when I was trying out different routes. Seeding would have involved the routes that I was testing for anyways so it did not make sense to seed and then test. Having this route would be better to see the API directly in action though...
