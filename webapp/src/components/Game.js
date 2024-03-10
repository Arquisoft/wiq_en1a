// src/components/Game.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Button} from '@mui/material';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const Game = () => {
  const [error, setError] = useState('');
  const [question, setQuestion] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const updateQuestion = async (chosenFlag) => {
    try {
      const question = await axios.get(`${apiEndpoint}/flags/question`, {});
      setQuestion(question.data);
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: 4 }}>
      {!isPlaying?(
        <Button variant="contained" color="primary" onClick={setIsPlaying(true)}>
          Play
        </Button>
        ) : (
          <>
            <h1>{question.question}</h1>
            <section>
              <img src={question.flags[0]} onClick={updateQuestion(question.flags[0])}></img>
              <img src={question.flags[1]} onClick={updateQuestion(question.flags[1])}></img>
              <img src={question.flags[2]} onClick={updateQuestion(question.flags[2])}></img>
              <img src={question.flags[3]} onClick={updateQuestion(question.flags[3])}></img>
            </section>
          </>
        )}
    </Container>
  );
};

export default Game;