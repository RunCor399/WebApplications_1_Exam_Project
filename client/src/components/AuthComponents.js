import { useState} from 'react';
import {Form, Button, Row, Col, Div, Container} from 'react-bootstrap';


function LoginForm(props){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        // event.preventDefault();
        // const credentials = { username, password };

        // props.login(credentials);

        event.preventDefault();
        let emailFormat = true;
        let emailValidity = true;
        let passwordValidity = true;

        if(username ===''){
            emailValidity = false;
        }
        else if(!username.toLowerCase().match(/\S+@\S+\.\S+/)){
            emailValidity = false;
            emailFormat = false;
        }

        if(password === '' || password.length < 6){
            passwordValidity = false;
        }

        if(emailValidity && passwordValidity){
            const credentials = { username, password };
            
            props.login(credentials);
        }
        else if(emailValidity && !passwordValidity){
            props.setMessage({msg: `The password should be at least 6 characters`, type: 'danger'});
            window.scrollTo(0, 0);
        }
        else if(!emailValidity && passwordValidity){
            if(emailFormat){
                props.setMessage({msg: `The email is mandatory`, type: 'danger'});
                window.scrollTo(0, 0);
            }
            else{
                props.setMessage({msg: `The email is not in the correct format`, type: 'danger'});
                window.scrollTo(0, 0);
            }
        }
        else if(!emailValidity && !passwordValidity){
            if(emailFormat){
                props.setMessage({msg: `The email is mandatory and the password should be at least 6 characters`, type: 'danger'});
                window.scrollTo(0, 0);
            }
            else{
                props.setMessage({msg: `The email is not in the correct format and the password should be at least 6 characters`, type: 'danger'});
                window.scrollTo(0, 0);
            }
        }
    }

    return (
        <>
            <div className="formDiv offset-md-4 col-md-4">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="col-md-8 offset-md-2 formGroupEmail" controlId='formGroupEmail'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type='text' value={username} onChange={ev => setUsername(ev.target.value)} />
                    </Form.Group>
                        
                    <Form.Group className="col-md-8 offset-md-2 formGroupPassword" controlId='formGroupPassword'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
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