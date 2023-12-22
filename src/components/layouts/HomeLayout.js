import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import { Container, Row, Col } from 'react-bootstrap';
import Hero from '../../components/Hero';

const HomeLayout =({children}) =>{
    return(
        <>
            <Header />
                <Hero />
                <Container fluid pb-5>
                    <Row className="lh-lg" >
                        <Col>
                            <main className="mb-5 main">{children}</main>
                        </Col>
                    </Row>
                </Container>
            <Footer />
        </>
    )
}

export default HomeLayout;