import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { supabase } from '../client';

const ArticlePreview = () => {
    const [articles, setArticles] = useState([]);
    useEffect(() => {
        fetchArticles();
      }, []);
    
    const fetchArticles = async () => {
        try {
            const { data, error } = await supabase.from('articles').select('*');
            if (error) {
            throw error;
            }
            setArticles(data.sort((a, b) => a.id - b.id));
        } catch (error) {
            console.error('Error fetching articles:', error.message);
        }
    };

    const categories = articles.reduce((acc, article) => {
        acc[article.category] = acc[article.category] || [];
        acc[article.category].push(article);
        return acc;
    }, {});

    const showLoginToast = () => {
        toast('Want to 👍 this article? Log in now!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      };

    const handleReadArticle = (articleId) => {
        sessionStorage.setItem('articleId', articleId);
        window.location.href = '/child-health/read-article';
    };

    return (
        <Container>
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

            {Object.keys(categories).map((category) => (
                <div key={category} className="py-4">
                    <h2>{category}</h2>
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {categories[category].map((article) => (
                            <Col key={article.id}>
                                <Card className="h-100 equalHeight mb-2">
                                    <Card.Img variant="top" src={article.imageSrc} alt={article.title} />
                                    <Card.Body className="d-flex flex-column">
                                        <Card.Title>{article.title}</Card.Title>
                                        <Card.Text>{article.summary}</Card.Text>
                                        <Row className="mt-auto">
                                            <Col>
                                                <Button variant="primary" onClick={() => handleReadArticle(article.id)}>
                                                    Read Article
                                                </Button>
                                            </Col>
                                            <Col className="text-end">
                                                <a href="#!">
                                                <FontAwesomeIcon
                                                    icon={faThumbsUp}
                                                    size="xl"
                                                    onClick={showLoginToast}
                                                />
                                                </a>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            ))}
        </Container>
    );
};

export default ArticlePreview;
