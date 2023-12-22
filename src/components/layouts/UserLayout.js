import React from 'react';
import UserHeader from '../UserHeader';
import Footer from '../Footer';
import { Container, Row, Col} from 'react-bootstrap';


const UserLayout =({children}) =>{
    return(
        <>
            <UserHeader />
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

export default UserLayout;