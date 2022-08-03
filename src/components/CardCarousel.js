import Button from "react-bootstrap/Button";
import Carousel from "react-bootstrap/Carousel";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";

import MyButton from "./MyButton.js";
import * as links from "./Links.js";

import "../styling/App.css";

import buymeacoffeeIcon from "../images/icons/buymeacoffee.png";
import kofiIcon from "../images/icons/kofi.png";

function CardCarousel() {
  let bgColor = "primary3";
  let itemClass = `${bgColor} rounded align-top car-item`;
  let captionClass = `${bgColor} pb-5`;
  let h1Class = "serif fw-bold";

  return (
    <Container className="my-5 card-carousel">
      <Row>
        <Col className="p-0">
          <Carousel className="w-75 mx-auto">
            <Carousel.Item className={itemClass}>
              <Carousel.Caption className={captionClass}>
                <h1 className={h1Class}>Articles</h1>
                <p>Read my articles for free!</p>
                <MyButton text="Articles" href={links.medium} />
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item className={itemClass}>
              <Carousel.Caption className={captionClass}>
                <h1 className={h1Class}>Videos</h1>
                <p>Watch my videos!</p>
                <MyButton text="Videos" href={links.youtube} />
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item className={itemClass}>
              <Carousel.Caption className={captionClass}>
                <h1 className={h1Class}>Projects</h1>
                <p>Take a look at my projects!</p>
                <MyButton text="Projects" href={links.github} />
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item className={itemClass}>
              <Carousel.Caption className={captionClass}>
                <div>
                  <Button
                    variant="accent2"
                    className="p-1 my-3"
                    href={links.buymeacoffee}
                    target="_blank"
                  >
                    <Image src={buymeacoffeeIcon} width={200} id="img-coffee" />
                  </Button>
                </div>
                <div>
                  <Button
                    variant="accent2"
                    className="p-1"
                    href={links.kofi}
                    target="_blank"
                  >
                    <Image src={kofiIcon} width={300} id="img-kofi" />
                  </Button>
                </div>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Col>
      </Row>
    </Container>
  );
}

export default CardCarousel;
