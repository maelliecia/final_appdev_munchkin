import React from 'react';
import { Container} from 'react-bootstrap';
import AdminLayout from '../../components/layouts/AdminLayout';
import AdminProfileForm from '../../components/AdminProfileForm';

export default function AdminProfile() {
    return (
        <>
            <AdminLayout>
                <div>
                    <Container>
                        <h1>My Profile</h1>
                        <AdminProfileForm/>
                    </Container>
                </div>
            </AdminLayout>
        </>
    )
}
