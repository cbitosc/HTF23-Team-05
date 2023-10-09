import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Helmet from "../components/Helmet/Helmet";
import "../styles/home.css";
import { Container, Row, Col } from "reactstrap";
import Lottie from "react-lottie";

import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase.config";
import { toast } from "react-toastify";
import { db } from "../firebase.config";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

const Home = () => {
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const year = new Date().getFullYear();
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');

  const calculateBMI = () => {
    const heightInMeters = height / 100;
    const bmiValue = weight / (heightInMeters * heightInMeters);

    if (bmiValue < 18.5) {
      setCategory('Underweight');
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      setCategory('Normal Weight');
    } else if (bmiValue >= 25 && bmiValue < 30) {
      setCategory('Overweight');
    } else {
      setCategory('Obese');
    }

    setBmi(bmiValue.toFixed(2));
  };

  const handleAnimationClick = () => {
    setIsAnimationPlaying(!isAnimationPlaying);
  };

  
  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const userDataRef = collection(db, "userData");
      const userData = {
        name: user.displayName,
        email: user.email,
      };

      const userDataQuery = query(userDataRef, where("email", "==", userData.email));
      const snapshot = await getDocs(userDataQuery);
      const existingUserData = snapshot.docs.find((doc) => doc.data().email === userData.email);

      if (!existingUserData) {
        await addDoc(userDataRef, userData);
      }

      setLoading(false);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  const handleDashboardRedirect = () => {
    if (loggedIn) {
      navigate("/dashboard");
    } else {
      handleGoogleLogin();
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Helmet title={"Home"}>
      <section className="hero__section">
        <Container>
          <Row>
            <Col lg="6" md="6">
              <div className="hero_content">
                <p className="hero_subtitle">
                  Track, Optimize, and Conquer Your Fitness Goals
                </p>
                <div className="h21">
                  <h2>Achieve Peak Performance</h2>
                </div>
                <div className="h22 mt-0">
                  <h2 className="colchange">with FitPulse</h2>
                </div>

                <p>
                  Elevate your fitness journey with our advanced tracker.
                  Monitor progress, set goals, and embrace a healthier, fitter
                  you.
                </p>

                <motion.button
                  whileHover={{ scale: 1.2 }}
                  className="buy__button"
                  onClick={handleDashboardRedirect}
                >
                  {loggedIn ? "Go to Dashboard" : "Get Started"}
                </motion.button>
              </div>
            </Col>

            <Col lg="6" md="6">
             
            </Col>
          </Row>
        </Container>
      </section>

      <section className="hero__section">
        <Container>
          <Row>
            <Col lg="12"></Col>
          </Row>
        </Container>
      </section>

      <section className="BMI">
        <Container>
          <Row className="BMI2">
            <Col lg='3'>
              
            </Col>
            <Col lg='9'>
              <div className="bmi-calculator">
                <h2>BMI Calculator</h2>
                <div className="singrow">
                  <h5 className="td">Weight</h5>
                  <div className="input-group">
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>
                  <h5 className="td">Height</h5>
                  <div className="input-group">
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                    />
                  </div>
                </div>

                <button className="calculate-btn" onClick={calculateBMI}>
                  Calculate
                </button>

                {bmi && (
                  <div className="result">
                    <h3>Your BMI: {bmi}</h3>
                    <h3>Category: {category}</h3>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Home;
