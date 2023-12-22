import MainLayout from '../components/layouts/MainLayout';
import { Container } from 'react-bootstrap';
import RecipePreview from '../components/RecipePreview';

export default function Recipes() {
    return (
        <>
            <MainLayout>
                <div>
                    <Container className="marginb">
                        <h1>Recipes</h1>
                        <RecipePreview/>
                    </Container>
                </div>
            </MainLayout>
        </>
    )
}