import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';

import profile from './new_profilephoto.png';


function Main() {
    return (
        <main>
          <Container fluid className='primary3'>
            <Row className='py-5'>
                <Col>
                    <Image
                        src={profile}
                        height={180}
                        roundedCircle
                        className='mx-auto d-block'
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button className='accent2'>Subscribe</Button>
                </Col>
            </Row>
          </Container>
          <Container fluid className='primary2'>
            <Row>
                <Col>
                    <h3>My name is Alex C Warren.</h3>
                </Col>
            </Row>
          </Container>
        </main>
    );
}

export default Main;