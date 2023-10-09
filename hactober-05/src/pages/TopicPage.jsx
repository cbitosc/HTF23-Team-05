import React, { useState } from 'react';
import { Container, Row, Col, Form, FormGroup } from 'reactstrap';
import { toast } from 'react-toastify';
import { db } from '../firebase.config';
import { collection, addDoc } from 'firebase/firestore';

const TopicPage = () => {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState([
    { question: '', link: '', difficulty: 'easy' },
  ]);

  const addQuestion = () => {
    setQuestions([...questions, { question: '', link: '', difficulty: 'easy' }]);
  };

  const handleQuestionChange = (e, index) => {
    const newQuestions = [...questions];
    newQuestions[index].question = e.target.value;
    setQuestions(newQuestions);
  };

  const handleLinkChange = (e, index) => {
    const newQuestions = [...questions];
    newQuestions[index].link = e.target.value;
    setQuestions(newQuestions);
  };

  const handleDifficultyChange = (e, index) => {
    const newQuestions = [...questions];
    newQuestions[index].difficulty = e.target.value;
    setQuestions(newQuestions);
  };

  const saveTopic = async (e) => {
    e.preventDefault();

    try {
      // Create a reference to the 'topics' collection in Firestore
      const docRef = await collection(db, 'topics');

      // Save the topic, questions, and links
      await addDoc(docRef, {
        topic: topic,
        questions: questions,
      });

      // Clear the form
      setTopic('');
      setQuestions([{ question: '', link: '', difficulty: 'easy' }]);

      toast.success('Topic saved successfully');
    } catch (error) {
      toast.error('Topic not saved');
    }
  };

  return (
    <Container>
      <Row>
        <Col lg='12'>
          <h4 className='mb-5'>Add Topic</h4>
          <Form onSubmit={saveTopic}>
            <FormGroup className='form__group'>
              <span>Topic</span>
              <input
                type='text'
                placeholder='Topic'
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </FormGroup>

            {questions.map((q, index) => (
              <div key={index}>
                <FormGroup className='form__group'>
                  <span>Question {index + 1}</span>
                  <input
                    type='text'
                    placeholder={`Question ${index + 1}`}
                    value={q.question}
                    onChange={(e) => handleQuestionChange(e, index)}
                    required
                  />
                </FormGroup>
                <FormGroup className='form__group'>
                  <span>Link {index + 1}</span>
                  <input
                    type='text'
                    placeholder={`Link ${index + 1}`}
                    value={q.link}
                    onChange={(e) => handleLinkChange(e, index)}
                    required
                  />
                </FormGroup>
                <FormGroup className='form__group'>
                  <span>Difficulty {index + 1}</span>
                  <select
                    value={q.difficulty}
                    onChange={(e) => handleDifficultyChange(e, index)}
                  >
                    <option value='easy'>Easy</option>
                    <option value='moderate'>Moderate</option>
                    <option value='hard'>Hard</option>
                  </select>
                </FormGroup>
              </div>
            ))}

            <button type='button' onClick={addQuestion}>
              Add Question
            </button>
            <button type='submit'>Save Topic</button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default TopicPage;
