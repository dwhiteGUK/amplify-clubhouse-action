import core from '@actions/core';
import github from '@actions/github';
import fetch from 'node-fetch';
import dotenv from 'dotenv'
dotenv.config()

async function main() {
  try {
    const data = {
      "author_id": "5dc6e1f7-cdad-4fda-8239-aed56d7dbc56",
      "created_at": "2021-06-03T09:00:00.001Z",
      text: `PR from custom GitHub action ${Date.now()}`
    }

    const addComment = await fetch('https://api.clubhouse.io/api/v3/stories/2096/comments', {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Clubhouse-Token': process.env.NODE_ENV === 'dev' ? process.env.CLUBHOUSE_ACTIONS_API_TOKEN : core.getInput('clubhouse-token'),
      }
    });

    console.log(addComment)
  } catch (error) {
    core.setFailed(error.message);
  }
}

main()
