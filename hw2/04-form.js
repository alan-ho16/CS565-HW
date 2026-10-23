const express = require('express');
const app = express();
const port = process.env.PORT || 5001;
// http://localhost:5001/form should return a form with input elements for username, email, and submit button

// http://localhost:5001/submit should return all the data the user entered

// used to parse incoming URL-encoded form data
app.use(express.urlencoded({ extended: true }));

const routes = ['form', 'submit'];

//  Returns an HTML form with username, email, comments, newsletter sign up, and submit button
app.get('/form', (req, res) => {
  res.status(200);
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html lang='en'>
      <head>
        <meta charset='UTF-8'>
        <title>Form Exercise</title>
      </head>
      <body>
        <h1>Form Exercise</h1>
        <form action='/submit' method='POST'>
          <div>
            <label for='username'>Username:</label>
            <input type='text' id='username' name='username' required>
          </div>
          <div>
            <label for='email'>Email:</label>
            <input type='email' id='email' name='email' required>
          </div>
          <div>
            <label for='comments'>Comments:</label>
            <textarea id='comments' name='comments'></textarea>
          </div>
          <div>
            <label for='newsletter'>
              <input type='checkbox' id='newsletter' name='newsletter' value='subscribed'>
              Sign up for newsletter
            </label>
          </div>
          <div>
            <button type='submit'>Submit</button>
          </div>
        </form>
      </body>
    </html>
  `);
});

// POST -- Returns all the data the user entered
app.post('/submit', (req, res) => {
  res.status(200).json(req.body);
});

//404 Catch all
app.use((req, res) => {
  const path = req.path.replace('/', '');

  if (!routes.includes(path)) {
    return res.status(404).send('<h1>404 - page not found</h1>');
  }

  res.status(404).send('<h1>404 - page not found</h1>');
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
