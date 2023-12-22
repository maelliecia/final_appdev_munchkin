import MainLayout from '../components/layouts/MainLayout';
import { Container } from 'react-bootstrap';

export default function About() {
    return (
        <>
            <MainLayout>
                <div>
                    <Container className="marginb">
                        <h1>About Us</h1>
                        <p>
                        Welcome to Munchkin, your trusted source for nutritious and delicious recipes
                        tailored for toddlers. We understand the importance of providing your little ones
                        with wholesome meals that support their growth and development.
                        </p>

                        <p>
                        Our team of experienced chefs and nutritionists is dedicated to curating a collection
                        of easy-to-follow recipes that both you and your child will love. We believe that
                        mealtime should be an enjoyable experience for the whole family, and our recipes
                        are designed with that in mind.
                        </p>
                        
                        <p>
                        Join our Munchkin community and embark on a culinary journey filled with creativity,
                        flavor, and the joy of nurturing your child's health and happiness.
                        </p>
                    </Container>
                </div>
            </MainLayout>
        </>
    )
}