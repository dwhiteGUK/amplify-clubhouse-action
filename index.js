const core = require('@actions/core');
const github = require('@actions/github');

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);

  const data = {
    "author_id": "5dc6e1f7-cdad-4fda-8239-aed56d7dbc56",
    "created_at": "2021-06-03T09:00:00.001Z",
    text: 'PR from custom GitHub action'
  }

  const addComment = await fetch('https://api.clubhouse.io/api/v3/stories/2096/comments', {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Clubhouse-Token': core.getInput('clubhouse-token'),
    }
  });

  console.log(addComment)
} catch (error) {
  core.setFailed(error.message);
}