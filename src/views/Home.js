import React, { useState, useEffect } from 'react';
import HomeLayout from '../components/layouts/HomeLayout';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { supabase } from '../client';

export default function Home() {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        fetchRecipes();
    }, []);
    
    const fetchRecipes = async () => {
        try {
            const { data, error } = await supabase.from('recipes').select('*');
            if (error) {
            throw error;
            }
            setRecipes(data.sort((a, b) => a.id - b.id));
        } catch (error) {
            console.error('Error fetching recipes:', error.message);
        }
    };

    const showLoginToast = () => {
        toast('❤️ this recipe? Log in to add favorite!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
    };

    const handleReadRecipe= (recipeId) => {
        sessionStorage.setItem('recipeId', recipeId);
        sessionStorage.setItem('prev', 'home');
        window.location.href = '/recipes/see-recipe';
    };

    return (
        <>
            <div className="landing-page">
                <HomeLayout> 
                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                    />
                    <section className="about-section py-5">
                        <Container>
                        <h2>About Us</h2>
                        <p>
                            At Munchkin, we're dedicated to providing parents with delicious and healthy recipes
                            that your toddlers will love.
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
                    </section>


                    <section className="featured-recipes py-5">
                        <Container>
                            <h2>Featured Recipes</h2>
                            <Row>
                            {recipes.filter((recipe) => recipe.featured).map((recipe) => (
                                <Col key={recipe.id} xs={12} sm={6} md={4} lg={4}>
                                    <Card style={{ marginBottom: '20px' }}>
                                        <Card.Img
                                        className="img-fluid"
                                        variant="top"
                                        src={recipe.imageSrc}
                                        alt={recipe.title}
                                        />
                                        <Card.Body>
                                        <Card.Title>{recipe.title}</Card.Title>
                                        <Card.Text>{recipe.description}</Card.Text>
                                        <Row>
                                            <Col>
                                                <Button variant="primary" onClick={() => handleReadRecipe(recipe.id)}>
                                                View Recipe
                                                </Button>
                                            </Col>
                                            <Col className="text-end">
                                                <a href="#!">
                                                <FontAwesomeIcon icon={faHeart} size="lg" onClick={showLoginToast} />
                                                </a>
                                            </Col>
                                        </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                            </Row>
                        </Container>
                    </section>

                    <section className="testimonials pb-5 pt-3">
                        <Container>
                            <h2>What Our Users Say</h2>
                            <Row>
                                <Col md={4}>
                                    <Card style={{ marginBottom: '20px' }}>
                                        <Card.Body>
                                            <FontAwesomeIcon icon={faQuoteLeft} size="lg" color="#cdb4db"/>
                                            <Card.Text>
                                            "I absolutely love the recipes on Munchkin! My toddler can't get enough of them."
                                            </Card.Text>
                                            <Card.Title>Juan Dela Cruz</Card.Title>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={4}>
                                    <Card style={{ marginBottom: '20px' }}>
                                        <Card.Body>
                                            <FontAwesomeIcon icon={faQuoteLeft} size="lg" color="#cdb4db" />
                                            <Card.Text>
                                            "Munchkin has made mealtime with my kids so much easier. Thank you!"
                                            </Card.Text>
                                            <Card.Title>Mimiyuuh</Card.Title>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={4}>
                                    <Card style={{ marginBottom: '20px' }}>
                                        <Card.Body>
                                            <FontAwesomeIcon icon={faQuoteLeft} size="lg" color="#cdb4db" />
                                            <Card.Text>
                                            "The recipes are not only nutritious but also delicious. Highly recommended!"
                                            </Card.Text>
                                            <Card.Title>Taylor Sheesh</Card.Title>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Container>
                    </section>

                    <section className="contact-section py-5">
                        <Container>
                        <h2>Contact Us</h2>
                        <p>
                            Have questions, suggestions, or feedback? We'd love to hear from you. Feel free to
                            reach out to us using the contact form below, and we'll get back to you as soon as
                            possible.
                        </p>

                        <Link to="/contact">
                            <Button variant="primary">Contact Us</Button>
                        </Link>
                        </Container>
                    </section>
                
                </HomeLayout>
            </div>
            
        </>
    )
}