import MyButton from './components/MyButton.js'; //'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import './styling/App.css';


function CardCarousel() {
  let bgColor = 'primary3';
  let itemClass = `${bgColor} rounded car-item`;
  let captionClass = `${bgColor}`;
  let h1Class = 'serif fw-bold';

  return (
    <Container className='my-5'>
      <Row>
        <Col>
          <Carousel className=''>

            <Carousel.Item className={itemClass}>
              <Carousel.Caption className={captionClass}>
                <h1 className={h1Class}>Articles</h1>
                <p>Read my articles for free!</p>
                <MyButton text='Articles' />
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item className={itemClass}>
              <Carousel.Caption className={captionClass}>
                <h1 className={h1Class}>Videos</h1>
                <p>Watch my videos!</p>
                <MyButton text='Videos' />
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item className={itemClass}>
              <Carousel.Caption className={captionClass}>
                <h1 className={h1Class}>Projects</h1>
                <p>Take a look at my projects!</p>
                <MyButton text='Projects' />
              </Carousel.Caption>
            </Carousel.Item>
            
          </Carousel>
        </Col>
      </Row>
    </Container>
  );
};

// function MyButton(props) {
//   return (
//     <Button variant='accent2' className='accent2 mx-auto d-block'>
//       {props.text}
//     </Button>
//   );
// }

export default CardCarousel;