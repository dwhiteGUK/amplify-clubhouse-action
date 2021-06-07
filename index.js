const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');
const dotenv = require('dotenv').config()

const { head_ref, event_name, event } = require('./mock/event.json')

function matchStoryId(headRef) {
  if (!headRef) {
    throw new Error('No head ref')
  }

  const matchId = headRef.match(/\/ch[0-9]*\//)

  if (matchId) {
    return matchId[0].replace('ch', '').replace(/\//g, '')
  }

  throw new Error('unable to match Id')
}

async function main() {
  try {

    if (event_name === 'pull_request') {

      const storyId = matchStoryId(head_ref)

      const data = {
        "created_at": event.pull_request.created_at,
        text: `Preview available on https://pr-${event.number}.${process.env.NODE_ENV === 'dev' ? process.env.AMPLIFY_PROJECT_ID : core.getInput('amplify-project-id')}.amplifyapp.com`
      }

      const addComment = await fetch(`https://api.clubhouse.io/api/v3/stories/${storyId}/comments`, {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Clubhouse-Token': process.env.NODE_ENV === 'dev' ? process.env.CLUBHOUSE_ACTIONS_API_TOKEN : core.getInput('clubhouse-token'),
        }
      });

      console.log(addComment)
    }

    return;
  } catch (error) {
    core.setFailed(error.message);
  }
}

main()
