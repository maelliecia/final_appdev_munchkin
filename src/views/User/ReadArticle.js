import React, { useState, useEffect } from 'react';
import UserLayout from '../../components/layouts/UserLayout';
import { Container } from 'react-bootstrap';
import ArticleInteraction from '../../components/ArticleInteraction';
import { supabase } from '../../client';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading';

export default function ReadArticle() {
    const [article, setArticle] = useState({});
    let articleId = sessionStorage.getItem('articleId');

    useEffect(() => {
        async function fetchArticle() {
            try {
                const { data, error } = await supabase
                    .from('articles')
                    .select('*')
                    .eq('id', articleId);

                if (error) {
                    console.error('Error fetching article data:', error.message);
                } else {
                    setArticle(data[0] || {});
                }
            } catch (error) {
                console.error('Error:', error.message);
            }
        }

        fetchArticle();
    }, [articleId]);

    if (!article) {
        return <UserLayout><Loading /></UserLayout>;;
    }

    return (
        <>
            <UserLayout>
                <div className="view-recipe">
                    <Container>
                        <Link to="/u/child-health">{'< Back'}</Link>
                        <h1>{article.title}</h1>

                        <div className="recipe-details">
                            <p className="centered-summary">{article.summary}</p>
                            <img
                                src={article.imageSrc}
                                alt="Article cover"
                                className="recipe-image"
                            />
                            <div className="article-content">
                                {article.content && article.content.split('\n').map((paragraph, index) => (
                                    <React.Fragment key={index}>
                                        {paragraph}
                                        <br />
                                    </React.Fragment>
                                ))}
                            </div>

                            <div className="text-end">
                                <br/>
                                <h6>By {article.author},<br/>{article.authorSpecialty}<br/>
                                    <span style={{ fontSize: '0.8rem', color: '#888' }}>
                                        {'Posted '}
                                        {new Date(article.datePublished).toLocaleDateString('en-US', {
                                        month: '2-digit',
                                        day: '2-digit',
                                        year: 'numeric',
                                        })}
                                        {' at '}
                                        {new Date(article.datePublished).toLocaleTimeString('en-US', {
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true,
                                        })}
                                    </span>
                                </h6>
                                <p className="category-tag">{article.category}</p>
                            </div>

                        </div>
                        <ArticleInteraction id={article.id}/>
                    </Container>
                </div>
            </UserLayout>
        </>
    );
}