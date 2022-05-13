# PUGO TRACKER

<br>

## Description

Did you ever get home and wonder if your pet already ate or if it still needs to go outside for a pee? This is a tool to keep track of your dog's routine and share the responsabilities with your household members. It allows you to create a profile for your pet and conenct it to all your household members so you don't have to wonder anymore if its your turn to walk the dog or if someone else already did it!

<br>

## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
- **homepage** - As a user I want to be able to access the homepage to sign up and log in.
- **sign up** - As a user I want to sign up on the web page so that I can add my pet (or pets).
- **login** - As a user I want to be able to log in on the web page so that I can get back to my account
- **logout** - As a user I want to be able to log out from the web page so that I can make sure no one will access my account
- **creat task** - As a user I want to be able to add tasks and delete them.
- **edit tasks** - As a user I want to be able to edit my tasks.
- **result** - As a user I want to see the list of tasks.

<br>

## Server Routes (Back-end):

| **Method** | **Route**               | **Description**                                                          | Request - Body                                    |
| ---------- | ----------------------- | ------------------------------------------------------------------------ | ------------------------------------------------- | --- | --- |
| `GET`      | `/`                     | Main page route. Renders home `index` view.                              |                                                   |
| `GET`      | `/login`                | Renders `login` form view.                                               |                                                   |
| `POST`     | `/login`                | Sends Login form data to the server.                                     | { email, password }                               |
| `GET`      | `/signup`               | Renders `signup` form view.                                              |                                                   |
| `POST`     | `/signup`               | Sends Sign Up info to the server and creates user in the DB.             | { email, password }                               |
| `GET`      | `/private/edit-profile` | Private route. Renders `edit-profile` form view.                         |                                                   |
| `PUT`      | `/private/edit-profile` | Private route. Sends edit-profile info to server and updates user in DB. | { name, email, password, [Pets]}                  |
| `GET`      | `/private/add-pet`      | Private route. Sends add-pet info to server and updates Pet info in DB.  | { name, humans, [tasks], [lastName], [imageUrl] } |     |     |
| `POST`     | `/private/add-pet/`     | Private route. Adds a new pet to the current user.                       | { name, tasks, photo, }                           |

## Models

User model

```javascript
{
  name: String,
  email: String,
  password: String,
  pets: [PetsId],
}

```

Pet model

```javascript
{
  name: String,
  humans: [UserId],
  tasks: [TasksId],
  photo: [imageUrl],

}

```

Tasks model

```javascript
{
  task: String,
  pet: [PetId],
  human: [HumanId],

}

```

<br>

## API's

<br>

## Packages

<br>

## Backlog

<br>

## Links

### Git

The url to your repository and to your deployed project

[Repository Link]()

[Deploy Link]()

<br>

### Slides

The url to your presentation slides

[Slides Link]()

### Contributors

Leticia M. - [`<github-Pip0kinha>`](https://github.com/Pip0kinha) - [`<linkedin-profile-link>`]()
