import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import IconButton from './components/IconButton.js';

import tiktok from './images/icons/tiktok.png';
import youtube from './images/icons/youtube.png';
import linkedin from './images/icons/linkedin.png';
import twitter from './images/icons/twitter.png';
import instagram from './images/icons/instagram.png';
import facebook from './images/icons/facebook.png';


function Footer() {
  return (
    <Container fluid className='primary2 py-1 text-center footer'>
      <Row>
        <Col>
          <IconButton image={tiktok} />
          <IconButton image={youtube} />
          <IconButton image={linkedin} />
          <IconButton image={twitter} />
          <IconButton image={instagram} />
          <IconButton image={facebook} />
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;