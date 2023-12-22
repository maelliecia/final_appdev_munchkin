import React from 'react';
import AdminHeader from '../AdminHeader';
import Footer from '../Footer';
import { Container, Row, Col} from 'react-bootstrap';


const AdminLayout =({children}) =>{
    return(
        <>
            <AdminHeader />
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

export default AdminLayout;