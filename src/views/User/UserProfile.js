import React from 'react';
import { Container} from 'react-bootstrap';
import UserLayout from '../../components/layouts/UserLayout';
import UserProfileForm from '../../components/UserProfileForm';

export default function UserProfile() {
    return (
        <>
            <UserLayout>
                <div>
                    <Container>
                        <h1>My Profile</h1>
                        <UserProfileForm/>
                    </Container>
                </div>
            </UserLayout>
        </>
    )
}
