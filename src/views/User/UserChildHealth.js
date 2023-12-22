import React from 'react';
import { Container} from 'react-bootstrap';
import UserLayout from '../../components/layouts/UserLayout';
import UArticlePreview from '../../components/UArticlePreview';

const UserChildHealth = () => {

    return (
        <UserLayout>
            <Container className="marginb">
                <h1>Child Health</h1>
                <UArticlePreview/>
            </Container>
        </UserLayout>
    );
};

export default UserChildHealth;
