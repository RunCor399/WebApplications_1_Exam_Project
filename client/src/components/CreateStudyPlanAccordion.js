import 'bootstrap-icons/font/bootstrap-icons.css';
import { Row, Col, Accordion, Form, Button } from 'react-bootstrap';
import { useState } from 'react';



function CreateStudyPlan(props){
    const [type, setType] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        props.addStudyPlan(type);
    }

    return (
        <>
            <Accordion className='col-md-8'>
                <Accordion.Item eventKey="0">
                    <Accordion.Header className="createAccordion">
                        <Row>
                            <h4>Create Study Plan</h4>
                        </Row>
                    </Accordion.Header>
                    <Accordion.Body>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col className='col-md-6'>
                                    <h5>Full-Time</h5>
                                </Col>
                                <Col className='col-md-2'>
                                    <input type="radio" value="full-time" name="type" onClick={() => {setType("fulltime")}} required/>
                                </Col>
                            </Row>
                            <Row>
                                <Col className='col-md-6'>
                                    <h5>Part-Time</h5>
                                </Col>
                                <Col className='col-md-2'>
                                    <input type="radio" value="part-time" name="type" onClick={() => {setType("partime")}} required/>
                                </Col>
                            </Row>
                            <Row>
                                <Col className='mt-3 col-md-6'>
                                    <Button type='submit' className=''  variant='danger'>Create</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Accordion.Body>
                </Accordion.Item>       
            </Accordion>
        </>
    );
}


export { CreateStudyPlan }