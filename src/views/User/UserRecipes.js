import UserLayout from '../../components/layouts/UserLayout';
import { Container } from 'react-bootstrap';
import URecipePreview from '../../components/URecipePreview';

export default function UserRecipes() {
    return (
        <>
            <UserLayout>
                <div>
                    <Container className="marginb">
                        <h1>Recipes</h1>
                        <URecipePreview/>
                    </Container>
                </div>
            </UserLayout>
        </>
    )
}