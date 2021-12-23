// -- takedeer.com -- //

//TODOS:
// -- resize row 2 to stay the same size and never change when swaping forms

// inmport variables //
import '../css/App.css';
import { useRef, useState, useEffect } from 'react';   
import axios from 'axios';
import { useNavigate } from 'react-router';

import { Container, Form, Button, Row, Col } from 'react-bootstrap';

// Entire Component { variables, functions, etc. }
const Home = () => {

    // used to push user to new page
    let navigate = useNavigate();
    
    // hid variable for form--hidden css
    let hid = 'form--hidden'

    // state variables
    const [usernameReg, setUsernameReg] = useState('');
    const [passwordReg, setPasswordReg] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [usernameLog, setUsernameLog] = useState('');
    const [passwordLog, setPasswordLog] = useState('');

    // ref variables 
    const createFormRef = useRef(null);
    const loginFormRef = useRef(null);
    const passWarningRef = useRef(null);
    const userWarningRef = useRef(null);

    // function prevents default submit form action
    const handleSubmit = (event) => {
        event.preventDefault();
    };

    // changes the create form to the login form
    const swapCreate = () => {
        const passWarn = passWarningRef.current;
        const createForm = createFormRef.current;
        const loginForm = loginFormRef.current;

        if (passWarn.className !== hid){
            passWarn.classList.add(hid);
        };

        if (createForm.className !== hid){
            createForm.classList.add(hid);
            loginForm.classList.remove(hid);
        };
    };

    // changes the login form to the create form
    const swapLogin = () => {
        const userWarn = userWarningRef.current
        const createForm = createFormRef.current
        const loginForm = loginFormRef.current

        if (userWarn.className !== hid){
            userWarn.classList.add(hid);
        };

        if (loginForm.className !== hid)
        createForm.classList.remove(hid);
        loginForm.classList.add(hid);
    };

    axios.defaults.withCredentials = true;

    // Function --> creates user 
    function createUser() {
        // variable for the current ref
        const passWarn = passWarningRef.current

        // if password value does not = confirm passord value we show pass warning else we take it away
        if (passwordReg !== confirmPassword) {
            passWarn.classList.remove(hid)
        } else {
            passWarn.classList.add(hid)
        };

        // if any of the input values are blank we stop the function 
        if (!passwordReg.trim() || !confirmPassword.trim() || !usernameReg.trim()){
            return console.log('blank inputs')
        };

        // sends request to server to create the user
        axios.post('http://localhost:3001/create', {
            username: usernameReg,
            password: passwordReg,
            confirmPassword: confirmPassword,
        }).then(() => {
            console.log('success');
        });
    };

    // Function --> logs user in // sets status of logged in
    function login() {
        const userWarn = userWarningRef.current

        
        // if password or user inputs are input we stop the function
        if (!passwordLog.trim() || !usernameLog.trim()){
            userWarn.classList.remove(hid)
            return console.log('blank user or pass')
        };

        axios.post('http://localhost:3001/login:id', {
            username: usernameLog,
            password: passwordLog,
        }).then((response) => {
            if (response.data.message) {
                console.log(response)
                userWarn.classList.remove(hid);
            } else {
                console.log(response.data.result[0].username)
                console.log({message: 'pushed'});

                //TODO: navigate for when user is logged in
                navigate(`/User/${response.data.result[0].username}`);
            }
        });
    };

    // Front End Componant 
    return (
        <Container className='d-grid h-100 justify-content-center text-justify'>

            {/* HEADER */}
            <Row className='align-items-end'>
                <Col>
                    <h5>
                        <small><p>welcome to <span>takedeer </span></p></small>
                    </h5>
                    <small><p>keep track of your finances.</p></small>
                </Col>
            </Row>

            {/* cREATE Form */}
            <Row id='container' className='' ref={createFormRef} md>
                <Form onSubmit={handleSubmit} id='form--css' className='text-center form-inline' >
                <div className='space'></div>
                    <h6 className='pink'>make</h6>
                    <div className='space'></div>
                    <Col >
                        <Form.Group>
                            <Form.Label>user</Form.Label>
                        </Form.Group>
                    </Col>
                    <Col className='offset-md-2'>
                        <Form.Group>
                            <Form.Control className='input--css' type='username' onChange={(event) => {setUsernameReg(event.target.value)}}/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>pass</Form.Label>
                        </Form.Group>
                    </Col>
                    <Col  className='offset-md-2'>
                        <Form.Group>
                            <Form.Control className='input--css' type='password' onChange={(event) => {setPasswordReg(event.target.value)}}/> 
                        </Form.Group>
                    </Col>
                    <Col >
                        <Form.Group>
                            <Form.Label>confirm</Form.Label>
                        </Form.Group>
                    </Col>
                    <Col className='offset-md-2'>
                        <Form.Group>
                            <Form.Control className='input--css' type='password' onChange={(event) => {setConfirmPassword(event.target.value)}}/> 
                        </Form.Group>
                    </Col>
                    
                    {/* BUTTON ROW */}
                    <Row className='justify-content-center'>
                        <div className='space'></div>
                        <Button variant='sharp' size='sm' onClick={createUser}>make</Button>
                        <div className='space'></div>
                        <Button variant='sharp' size='sm' onClick={swapCreate}>log</Button>
                    </Row>
                    <div className='space'>
                    <p className='form--hidden pink' ref={passWarningRef}>passwords don't match</p>
                    </div>
                    <div className='space'></div>
                </Form>
            </Row>
            
            {/* Login fORM */}
            <Row ref={loginFormRef} id='container' className='form--hidden' md>
                <Form onSubmit={handleSubmit} id='form--css' className='text-center w-100' >
                <div className='space'></div>
                <h6 className='pink'>log</h6>
                <div className='space'></div>
                    <Col >
                        <Form.Group>
                            <Form.Label>user</Form.Label>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className='offset-md-2'>
                            <Form.Control className='input--css' type='username' onChange={(event) => {setUsernameLog(event.target.value)}}/>
                        </Form.Group>
                    </Col>
                    <Col >
                        <Form.Group>
                            <Form.Label>pass</Form.Label>
                        </Form.Group>
                    </Col>
                    <Col className='offset-md-2'>
                        <Form.Group>
                            <Form.Control className='input--css' type='password' onChange={(event) => {setPasswordLog(event.target.value)}}/>
                        </Form.Group>
                    </Col>

                    {/* BUTTON ROW */}
                    <Row className='justify-content-center'>
                        <div className='space'></div>
                        <Button variant='sharp' id='' size='sm' onClick={login}>log</Button>
                        <div className='space'></div>
                        <Button variant='sharp' size='sm' onClick={swapLogin}>make</Button>
                    </Row>
                    <div className='space'>
                    <p className='form--hidden pink' ref={userWarningRef}>wrong username/ password</p>
                    </div>
                    <div className='space'></div>
                </Form>
            </Row>

            {/* FOOTER */}
            <Row className='align-items-start'>
                <Col>
                    <footer>
                        <small><p>site by <span>Chavez.</span></p></small>
                    </footer>
                </Col>
            </Row>
        </Container>
    );
};

export default Home;