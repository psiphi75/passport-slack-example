# passport-slack-example

A very rough example on how to use [passport-slack](https://github.com/mjpearson/passport-slack).

Note: currently passport-slack has not had an update for many years, has poor documentation, a slew of bugs, but
still runs.

To run:

```sh
npm install
export CLIENT_ID="YOUR SLACK CLIENT_ID"
export CLIENT_SECRET="YOUR SLACK CLIENT_SECRET"
node run index.js
```

Your server will be running at http://localhost:8088

-   http://localhost:8088/auth/slack - start the Slack authentication
-   http://localhost:8088/auth/slack/callback - where Slack returns to, config this on the Slack side.
-   http://localhost:8088/success - Where you land after successfully logging in
-   http://localhost:8088/showmesecret - Only logged in users can see this
-   http://localhost:8088/logout - Remove the login credentials
