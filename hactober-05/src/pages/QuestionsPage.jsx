import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Container, Table, Row, Col } from "reactstrap";
import { doc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.config";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from '../custom-hooks/useAuth';
import { signOut } from "firebase/auth";
import { auth } from "../firebase.config";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import logo from '../assets/images/logo.png';
import '../styles/dashboard.css';
import axios from "axios";

const QuestionsPage = () => {
  const { topicId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [progress, setProgress] = useState(0); // Declare progress state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleProfileActions = () => profileActionRef.current.classList.toggle('show__profileActions');
  const profileActionRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const storeCheckboxState = (topicId, question, completed) => {
    const key = `${topicId}-${question}`;
    localStorage.setItem(key, completed.toString());
  };

  const getStoredCheckboxState = (topicId, question) => {
    const key = `${topicId}-${question}`;
    const storedValue = localStorage.getItem(key);
    return storedValue ? storedValue === "true" : false;
  };

  useEffect(() => {
    const calculateAndStoreTopicProgress = (topicId, questions) => {
      const completedCount = questions.filter((q) => q.completed).length;
      const totalQuestions = questions.length;
      const percentage = (completedCount / totalQuestions) * 100;
      localStorage.setItem(`progress-${topicId}`, percentage.toFixed(2));
      return percentage.toFixed(2);
    };

    const fetchQuestions = async () => {
      try {
        const topicsRef = collection(db, "topics");
        const querySnapshot = await getDocs(topicsRef);
        let found = false;

        querySnapshot.forEach((doc) => {
          const data = doc.data();

          if (doc.id === topicId) {
            const questionsWithCompleted = data.questions.map(question => ({
              ...question,
              completed: getStoredCheckboxState(topicId, question.question),
            }));
            setQuestions(questionsWithCompleted);
            found = true;

            // Calculate and store the progress
            const progressPercentage = calculateAndStoreTopicProgress(topicId, questionsWithCompleted);
            // Set progress in state
            setProgress(progressPercentage);
          }
        });

        if (!found) {
          setError("Topic not found.");
        }

        setLoading(false);
      } catch (error) {
        setError("Error fetching questions.");
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [topicId]);

  const handleCheckboxChange = (index) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[index];
    question.completed = !question.completed;
    setQuestions(updatedQuestions);
    storeCheckboxState(topicId, question.question, question.completed);
  };

  const calculateProgressPercentage = () => {
    if (questions.length === 0) {
      return 0;
    }

    const completedCount = questions.filter((q) => q.completed).length;
    const totalQuestions = questions.length;
    return ((completedCount / totalQuestions) * 100).toFixed(2);
  };

  const progressPercentage = calculateProgressPercentage();

  const logout = () => {
    signOut(auth).then(() => {
      toast.success('Logged out');
      navigate('/home');
    }).catch(err => {
      toast.error(err.message);
    });
  };

  const handleDashboardRedirect = () => {
    navigate("/dashboard");
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section>
      <Container className="ok">
        <Row>
          <Col lg='3' className='non-main'>
            <div className='alicr'>
              <div><img className='logo' src={logo} alt="" /></div>
              <div className='menu_opt'>
                <h5 className='options' onClick={handleDashboardRedirect}><i className="ri-dashboard-line"></i>Dashboard</h5>
                <h5 className='selected'>Dashboard</h5>
                <h5 className='options'>Dashboard</h5>
                <div className="profile__actions" ref={profileActionRef} onClick={toggleProfileActions}>
                  {
                    currentUser ? <div className="d-flex align-items-center justify-content-center flex-column jobhi">
                      <div onClick={logout} className='logout'><i className="ri-shut-down-line"></i><span >Logout</span></div>
                    </div> :
                      <div className="d-flex align-items-center justify-content-center flex-column jobhi">
                        <Link to='/signup'>Signup</Link>
                        <Link to='/login'>Login</Link>
                      </div>
                  }
                </div>
              </div>
            </div>
          </Col>

          <Col lg='9' className="allalice">
            <h4>Questions for Topic: {topicId}</h4>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${progressPercentage}%` }}
                aria-valuenow={progressPercentage}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {progressPercentage}%
              </div>
            </div>
            <Table style={{ color: "aliceblue" }}>
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Solve</th>
                  <th>Difficulty</th>
                  <th>Completed</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q, index) => (
                  <tr key={index}>
                    <td>{q.question}</td>
                    <td>
                      <button className="bttn" onClick={() => window.location.href = q.link}>Solve</button>
                    </td>
                    <td>{q.difficulty}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={q.completed}
                        onChange={() => handleCheckboxChange(index)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default QuestionsPage;
