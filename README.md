# Lap 3 Project

## For 3 days you will be working to create a habit tracker.

### User stories:
- As a user, I should be able to add a habit that I want to track
- As a user, I should be able to choose a habit that I have added to the list to track 
- As a user, I should be able to choose the frequency at which I want to track the habit, i.e. how often I want to see it on my list of uncompleted tasks
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
- Person 1
    - Name: X
    - Activity: [
        A1
        A2
        A3
    ]
- Person 2
    ..


# Evaluating completion when updating task
- Timeframe: daily only
- Deadline: Initialised on new entry, checked and updated on PUT(update request)
- Frequency: keep track of how many completed submissions until marked finished
- Completed: no. of times submitted as completed before deadline is reached
- Streak: no. of times task marked completed within timeframe


## Logic flowchart: 
### Initialisation (Add to task list)
- Timeframe: as inputted
- Deadline: daily(current time + 1 day 00:00), Weekly (current time + 7 day 00:00)
- Freq: as inputted
- Completed: 0
- Streak: 0

### Update (Mark as complete)
- Timeframe: unchanged unless timeframe changed
- Deadline: daily(current time + 1 day 00:00), Weekly: unchanged unless deadline passed
- Freq: unchanged unless manipulated
- Completed: Completed ++ / deadline passed
- Streak: Streak++ / deadline missed

# Routes
## GET:
- /showAllUsers
- /habits/:userID

## POST:
- /newUser
- /newActivity