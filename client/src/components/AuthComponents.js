import { useState} from 'react';
import {Form, Button, Row, Col, Div, Container} from 'react-bootstrap';


function LoginForm(props){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const credentials = { username, password };

        props.login(credentials);
    }

    return (
        <>
            <div className="formDiv offset-md-4 col-md-4">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="col-md-8 offset-md-2 formGroupEmail" controlId='formGroupEmail'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} required={true} />
                    </Form.Group>
                        
                    <Form.Group className="col-md-8 offset-md-2 formGroupPassword" controlId='formGroupPassword'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} required={true} minLength={6}/>
                    </Form.Group>
                    
                    
                    <Button type="submit" className="submitButton mt-5 col-md-3">Login</Button>
                </Form>
            </div>  
        </>
    );
}


function LogoutButton(props) {
    return(
      <Row>
        <Col>
          <Button variant="outline-primary" onClick={props.logout}>Logout</Button>
        </Col>
      </Row>
    )
  }


export { LoginForm, LogoutButton };