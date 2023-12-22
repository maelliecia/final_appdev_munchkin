import React from 'react';
import { Container} from 'react-bootstrap';
import MainLayout from '../components/layouts/MainLayout';
import ArticlePreview from '../components/ArticlePreview';

const ChildHealth = () => {

    return (
        <MainLayout>
            <Container className="marginb">
                <h1>Child Health</h1>
                <ArticlePreview/>
            </Container>
        </MainLayout>
    );
};

export default ChildHealth;
