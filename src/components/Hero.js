import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';

function Hero() {
  const heroStyle = {
    background: "url('https://plus.unsplash.com/premium_photo-1661755067728-46fbce76763c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: '#fff',
    height: '300px',
    width: '100%',
  };

  return (
    <section className="hero text-center  py-5" style={heroStyle}>
      <Container>
        <Row>
          <Col>
            <h1>Welcome to Munchkin</h1>
            <p>Discover nutritious recipes for your toddlers!</p>
            <Link to="/signup">
              <Button variant="primary" size="lg">Get Started</Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Hero;