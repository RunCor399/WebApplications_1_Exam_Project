import '../App.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsCollectionPlay, BsPersonFill } from 'react-icons/bs';
import { FaBook } from 'react-icons/fa'
import { GoSignOut, GoSignIn } from 'react-icons/go'
import {Navbar, Col, Alert, Row} from 'react-bootstrap';
import {useNavigate, useLocation} from 'react-router-dom';


function TopNavbar(props){
    const navigate = useNavigate();
    const location = useLocation();
    
    const handleLoginRedirect = (event) => {
        event.preventDefault();

        if(location.pathname !== '/login'){
            navigate('login');
        }
    }

    return (
        <>
            <Navbar className="navbar" variant="light">
                <Col className="offset-md-1 col-md-2 logo-col">
                    <FaBook className="site-logo col-md-2"></FaBook>
                </Col>
                <Col className="offset-md-1 col-md-4 search-col">
                    <h2 className="title-text col-md-8">Study Plan</h2>
                </Col>
                <Col className="offset-md-3 col-md-3 logo-user">
                {props.loggedIn ? 
                <a href="" onClick={(event) => {props.logout(event)}} className="">
                    <GoSignOut className="account-logo"></GoSignOut>
                </a> 
                :
                <a href="" onClick={(event) => {handleLoginRedirect(event)}} className="">
                    <BsPersonFill className="account-logo"></BsPersonFill>
                </a>}
                </Col>
            </Navbar>
            {props.message && <Row>
             <Alert className="col-md-12" variant={props.message.type} onClose={() => props.setMessage('')} dismissible>{props.message.msg}</Alert>
            </Row> }
        </>
    );
}



export {TopNavbar};