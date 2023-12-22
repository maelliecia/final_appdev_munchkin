import React from 'react';
import { Container } from 'react-bootstrap';
import UserLayout from '../../components/layouts/UserLayout';
import UserChildProfile from '../../components/UserChildProfile';

export default function ChildProfile() {
    return (
        <>
            <UserLayout>
                <div>
                    <Container className="marginb">
                        <h1>Child Profile</h1>
                        <UserChildProfile/>
                    </Container>
                </div>
            </UserLayout>
        </>
    )
}