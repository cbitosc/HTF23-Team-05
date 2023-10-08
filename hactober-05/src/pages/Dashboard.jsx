import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase.config';
import { toast } from 'react-toastify';
import useAuth from '../custom-hooks/useAuth';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import userIcon from '../assets/images/account-circle-line.png';
import logo from '../assets/images/logo.png';
import CircularProgressBar from '../pages/CircularProgressBar';
import dev from '../assets/images/dev.png';
import { Link } from "react-router-dom";
import { VictoryPie } from 'victory'; // Import VictoryPie

const Dashboard = () => {
  const [topics, setTopics] = useState([]);
  const toggleProfileActions = () => profileActionRef.current.classList.toggle('show__profileActions');
  const profileActionRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'topics'));
        const topicList = [];
        querySnapshot.forEach((doc) => {
          const topicData = doc.data();
          const topicId = doc.id;
          topicList.push({
            id: topicId,
            ...topicData
          });
        });
        setTopics(topicList);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    }

    fetchTopics();
  }, []);

  const calculateTopicProgress = (topic) => {
    const questions = topic.questions || [];
    const completedCount = questions.filter((q) => q.completed).length;
    const totalQuestions = questions.length;
    const percentage = (completedCount / totalQuestions) * 100;
    return percentage.toFixed(2) + "%";
  };

  const logout = () => {
    signOut(auth).then(() => {
      toast.success('Logged out');
      navigate('/home');
    }).catch(err => {
      toast.error(err.message);
    });
  };

  return (
    <section>
      <Container className='ok'>
        <Row>
          <Col lg='3' className='non-main'>
            <div className='alicr'>
              <div><img className='logo' src={logo} alt="" /></div>
              <div className='menu_opt'>
                <h5 className='selected'><i className="ri-dashboard-line"></i>Dashboard</h5>
                <h5 className='options'>Dashboard</h5>
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
          <Col lg='9' className='main'>
            <div className='maintain'>
              <div className='aliotl'>
                <div className='dffdr'>
                  <motion.img whileTap={{ scale: 1.2 }} src={currentUser ? currentUser.photoURL : userIcon} alt="" className='profile_img' />
                  <h5>{currentUser ? currentUser.displayName : ""}</h5>
                </div>
              </div>
              <div className='hello'>
                <h2>Hello {currentUser && currentUser.displayName ? currentUser.displayName.split(' ')[0] : ""} !</h2>
              </div>
              <div className='neo main-box'>
                <div className='cpb'><CircularProgressBar steps={800} /></div>
                <div className='cent'><h5 className='mainh'>Keep up the good work!</h5>
                  <h5 className='mainh mainh2'>You're making great progress</h5></div>
                <img className='dev' src={dev} alt="" />
              </div>
            </div>
            <Col lg='12' className='tickboxes'>
              {topics.map((topic, index) => (
                <div onClick={() => setSelectedTopic(topic)} key={index} className='not-started-task boox each-topic-fetched-from-firestore-should-be-shown-on-each-of-this-boox-div'>
                  <h5>{topic.topic}</h5>
                  <div className='progress-chart'>
                    {selectedTopic && selectedTopic.id === topic.id && (
                      <VictoryPie
                        data={[
                          { y: parseFloat(localStorage.getItem(`progress-${topic.id}`)) || 0 },
                          { y: 100 - parseFloat(localStorage.getItem(`progress-${topic.id}`)) || 100 },
                        ]}
                        colorScale={["green", "#fff"]}
                        width={150} // Adjust the width as needed
                        height={150} // Adjust the height as needed
                        innerRadius={30} // Adjust the inner radius as needed
                        labelRadius={40} // Adjust the label radius as needed
                      />
                    )}
                  </div>
                </div>
              ))}
            </Col>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Dashboard;
