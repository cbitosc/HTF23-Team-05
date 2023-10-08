// server.js

const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(bodyParser.json());

// Replace 'YOUR_LEETCODE_API_KEY' with your actual LeetCode API key
const apiKey = 'YOUR_LEETCODE_API_KEY';

app.post('/check-leetcoder', async (req, res) => {
  const { username, questionId } = req.body;

  try {
    const response = await fetch(`https://leetcode.com/api/problems/${questionId}/user/${username}/`, {
      headers: {
        Cookie: `LEETCODE_SESSION=${apiKey};`
      },
    });

    const data = await response.json();

    if (data.status === 'success') {
      const isSolved = data.submissions.some(submission => submission.status_display === 'Accepted');
      res.json({ result: isSolved ? 'Solved' : 'Not Solved' });
    } else {
      res.json({ result: 'User not found or question not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
