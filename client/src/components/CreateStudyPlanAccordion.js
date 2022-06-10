import 'bootstrap-icons/font/bootstrap-icons.css';
import { Row, Col, Accordion, Form, Button } from 'react-bootstrap';



function CreateStudyPlan(props){
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
                        <Form>
                            <Row>
                                <Col className='col-md-6'>
                                    <h5>Full-Time</h5>
                                </Col>
                                <Col className='col-md-2'>
                                    <input type="radio" value="full-time" name="full-time"/>
                                </Col>
                            </Row>
                            <Row>
                                <Col className='col-md-6'>
                                    <h5>Part-Time</h5>
                                </Col>
                                <Col className='col-md-2'>
                                    <input type="radio" value="part-time" name="part-time"/>
                                </Col>
                            </Row>
                            <Row>
                                <Col className='mt-3 col-md-6'>
                                    <Button type='submit' className='' variant='danger'>Create</Button>
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