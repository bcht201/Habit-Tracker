# Lap 3 Project

## For 3 days you will be working to create a habit tracker.

### User stories:
- As a user, I should be able to choose a habit that I have added to the list to track 
- As a user, I should be able to choose the frequency at which I want to track the habit, i.e. how often I want to see it on my list of uncompleted tasks or how many times I must complete it until it is finished
- As a user I should be able to track a habit and mark it as complete 
- As a user I should be able to see a list of completed habits for the day
- As a user I should be able to see if I have a streak of completing a specific habit

### Technical functionality:  
- Developers should locally host a database to store the daily information about users.
- CRUD capabilities
- The backend should be tested using a testing framework and functional, intreracting through an api testing tool.  

### STRETCH GOAL:
- have the functionality for a user to log in
- have the neccessary pages/views/forms to create, edit/update and delete habits.

  
# Stages:
## Stage 1
- Establish get request to 'SELECT *' to view database as first interaction (tested)
- Implement logic for daily timeframe tasks
- List out routes to get MVP

## Stage 2
- Build 1 of each CRUD route (tested)

## Stage 3
- Flesh out routes that have been listed out below (tested)

## DB structure
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


# Routes
## /user:
- GET: / -> get all users in the database
- GET: /:ID -> get a specific user in the database
- POST: /addUser -> add new user to DB, requires req.body.name

## /activity:
- GET: ?user=ID -> get all activities of a specific user
- GET: ?user=ID&complete=true -> get all completed activities of a specific user
- GET: ?user=ID&complete=false -> get all incomplete activities of a specific user
- POST: /new -> add new activity to DB  
* require Name of activity(req.body.name), Which user to add to(req.body.userID), frequency per day(req.body.frequency)