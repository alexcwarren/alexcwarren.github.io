import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import IconButton from "./IconButton.js";
import * as links from "./Links.js";

import facebookIcon from "../images/icons/facebook.png";
import githubIcon from "../images/icons/github.png"
import instagramIcon from "../images/icons/instagram.png";
import linkedinIcon from "../images/icons/linkedin.png";
import mediumIcon from "../images/icons/medium.png";
import tiktokIcon from "../images/icons/tiktok.png";
import twitterIcon from "../images/icons/twitter.png";
import youtubeIcon from "../images/icons/youtube.png";

function Footer() {
  return (
    <Container fluid className="primary2 py-1 px-3 text-center footer">
      <Row>
        <Col>
          <IconButton image={mediumIcon} href={links.medium} />
          <IconButton image={youtubeIcon} href={links.youtube} />
          <IconButton image={tiktokIcon} href={links.tiktok} />
          <IconButton image={linkedinIcon} href={links.linkedin} />
          <IconButton image={githubIcon} href={links.github} />
          <IconButton image={twitterIcon} href={links.twitter} />
          <IconButton image={instagramIcon} href={links.instagram} />
          <IconButton image={facebookIcon} href={links.facebook} />
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;
