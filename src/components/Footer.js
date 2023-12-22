import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row>
          <Col xs={12} sm={4} className="text-start">
            <h5>About Us</h5>
            <p>At Munchkin, we're dedicated to providing parents with delicious and healthy recipes that your toddlers will love.</p>
          </Col>

          <Col xs={12} sm={4} className="text-center mt-4 mt-sm-0">
            <h5>Contact Us</h5>
            <address>
              Email: <a href="mailto:munchkin@help.com">munchkin@help.com</a>
              <br />
              Phone: <a href="tel:+1234567890">+1234567890</a>
            </address>
          </Col>

          <Col xs={12} sm={4} className="text-end mt-4 mt-sm-0">
            <h5>Follow Us</h5>
            <div className="social-icons">
              <a href="#!" className="social-icon m-1">
                <FontAwesomeIcon icon={faFacebook} size="lg" />
              </a>
              <a href="#!" className="social-icon m-1">
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </a>
              <a href="#!" className="social-icon m-1">
                <FontAwesomeIcon icon={faInstagram} size="lg" />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;