import MyButton from "./components/MyButton.js"; //'react-bootstrap/Button';
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";

import profile from "./images/new_profilephoto.png";

function Main() {
  return (
    <main>
      <Container fluid className="secondary py-4 text-center">
        <Row className="my-3">
          <Col></Col>
          <Col xxl={5} xl={5} lg={6} md={7} sm={9} xs={10}>
            <h4 className="">
              I'm a professional software engineer on a journey to improve my
              skills. Follow me as I share what I've learned throughout my
              career and the things I'm learning now so that you, too, can
              improve.
            </h4>
          </Col>
          <Col></Col>
        </Row>
        <Row className="my-4">
          <Col>
            <MyButton text="Subscribe to email list" />
          </Col>
        </Row>
        <Row className="pt-2">
          <Col>
            <Image src={profile} height={180} roundedCircle />
          </Col>
        </Row>
      </Container>
    </main>
  );
}

export default Main;
