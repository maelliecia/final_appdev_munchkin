import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import { Container, Row, Col} from 'react-bootstrap';


const MainLayout =({children}) =>{
    return(
        <>
            <Header />
                <Container fluid pb-5>
                    <Row className="lh-lg" >
                        <Col>
                            <main className="m-5 main">{children}</main>
                        </Col>
                    </Row>
                </Container>
            <Footer />
        </>
    )
}

export default MainLayout;