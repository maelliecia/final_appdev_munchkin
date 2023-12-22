import UserLayout from '../../components/layouts/UserLayout';
import { Container } from 'react-bootstrap';
import FavePreview from '../../components/FavePreview';

export default function UserFavorites() {
    return (
        <>
            <UserLayout>
                <div>
                    <Container className="marginb">
                        <h1>Favorites</h1>
                        <FavePreview/>
                    </Container>
                </div>
            </UserLayout>
        </>
    )
}