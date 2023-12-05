# MyApp

MyApp is a React Native app built using Expo that helps users manage notes, tasks, and reminders efficiently.

## Features

- Create, edit, and view notes.
- Add tasks with deadlines to notes.
- Schedule reminders for tasks and notes.
- Receive push notifications for reminders.

## Installation

Before you can build this project, you must install and configure the following dependencies on your machine:

- [Node.js][]: We use Node to build the project.
- [XamppServer][]: we use Xampp Database for this project.
- npm
- Install Expo app in your Andriod or ios for realtime experience

## Development

Ensure you have Node.js installed. Clone the repository and install dependencies:

- git clone https://github.com/yourusername/MyApp.git
- go to cloned app change to your project directory for frontend 
  `cd notes-frontend ` and for backend `cd notes-backend`.
- Intsll all dependencies `npm install`
- Install Expo CLI `npm install -g expo-cli`

## Frontend 

- To start the front end `expo start` (both ios and andriod)

Runs the app in the development mode.Open your Expo app in your Andriod or ios to view your output.

To Reload the Expo app click `CTRL+R` in your keyboard when you make changes in your app.You may also see any lint errors in the terminal or mobile.

## Backend

Ensure you have XAMPP server installed.Open your web browser and enter 
`http://localhost` or `http://127.0.0.1` If XAMPP dashboard or a page confirming that Apache and MySQL are working.

- If suppose need to Start the Apache & MySQL server 
  `cd /opt/lampp` and `sudo ./lampp start`.
- For the first time only Update and Install maven: `sudo apt update` and 
  `sudo apt install maven`
- To start the back end `mvn org.springframework.boot:spring-boot-maven-plugin:run` or `mvn spring-boot:run`

## Continuous Integration (optional)

- [Node.js]: https://nodejs.org/
- [XamppServer]: https://www.apachefriends.org/

