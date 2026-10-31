Countries Exercise

Routes
/home	Welcome page (/ redirects here)
/countries	Every country A-Z with its capital and leader (with title)
/populous	Countries with at least 50 million people, most populous first, with flags
/regions	The number of countries in each region, plus every country's name

Requirements
Node.js 18 or newer (the app uses the built-in fetch)
A free REST Countries API key (see below)

Setup
   Navigate to the countries_exercise folder from hw3 folder
bash
   cd countries_exercise
Install dependencies:
bash
   npm install

This installs everything listed in package.json. If you are setting the project up from scratch, install the packages individually instead:

bash
   npm install express pug dotenv
   npm install --save-dev eslint@8 eslint-config-airbnb-base eslint-plugin-import

Get an API key. https://restcountries.com/sign-up.
Create a file named .env in the project root (next to App.js) with this single line, using your own key:
   RESTCOUNTRIES_API_KEY=your_key_here

.env is listed in .gitignore, so the key is not committed.

Start the app:
bash
   npm start

Then open http://localhost:3000. To use a different port, set PORT (for example PORT=4000 npm start).

Linting

The code follows the Airbnb JavaScript style guide. ESLint and the Airbnb config are dev dependencies, installed by the commands above. To lint:

bash
npx eslint lib App.js

Add --fix to auto-fix formatting issues.

The config lives in .eslintrc.json:



# Tic-Tac-Toe (React)


## Requirements

- [Node.js](https://nodejs.org/) 18 or newer

## Setup

1. Navigate to react folder from hw3
    ```bash
   cd react
   ```
1. Install dependencies:

   ```bash
   npm install    (you might need to add `--legacy-peer-deps` flag if errors occur)
   ```

  
2. Start the development server:

   ```bash
   npm start
   ```

   Then it should open up the browser automatically or if not, open
   http://localhost:3000/



## Linting

The code follows the Airbnb JavaScript and React style guides. ESLint, the
Airbnb config and its plugins are dev dependencies, installed by the commands
above.

To check linting, run
   ```bash
   npx eslint ./src
   ```

The config lives in `.eslintrc.json`:

# Tic-Tac-Toe (React)


## Requirements

- [Node.js](https://nodejs.org/) 18 or newer

## Setup

1. Navigate to react folder from hw3
    ```bash
   cd react
   ```
1. Install dependencies:

   ```bash
   npm install    (you might need to add `--legacy-peer-deps` flag if errors occur)
   ```

  
2. Start the development server:

   ```bash
   npm start
   ```

   Then it should open up the browser automatically or if not, open
   http://localhost:3000/



## Linting

The code follows the Airbnb JavaScript and React style guides. ESLint, the
Airbnb config and its plugins are dev dependencies, installed by the commands
above.

To check linting, run
   ```bash
   npx eslint ./src
   ```

The config lives in `.eslintrc.json`:



# Socket.IO Chat App


## Requirements
Node.js 18 or newer 

## Setup

Navigate to chat_example folder from hw3 folder

bash
    cd .\socketio\chat_example

Install dependencies:
bash
   npm install


Start the server:
bash
   npm start

You should see listening on *:3000 in the terminal.

Open http://localhost:3000 in your browser. To try the chat, open the same address in a second tab or window and send a message from either one.

The port is set by the PORT constant in the server file. Change it there if 3000 is already in use.

## Linting

The server code follows the Airbnb JavaScript style guide. To lint:

bash
npx eslint .

Add --fix to auto-fix formatting issues.

The config lives in .eslintrc.json:


Airbnb flags the console.log calls with no-console warnings. They are intentional (they log connections), so either leave the warnings or add // eslint-disable-next-line no-console above each one.
g