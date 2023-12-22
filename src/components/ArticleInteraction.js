import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faComment } from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp as faSolidThumbs} from '@fortawesome/free-solid-svg-icons';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from '../client';

import ArticleCommentSection from './ArticleCommentSection';
import { Row, Col } from 'react-bootstrap';

import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookShareButton,
    XIcon,
    TwitterShareButton,
    WhatsappShareButton,
    WhatsappIcon,
  } from "react-share";

function ArticleInteraction(props) {
    let articleID = props.id;
    console.log("article ID: ", articleID);
    const shareUrl = "http://munchkin.com";
    const title = "munchkin";

    const [showReview, setShowReview] = useState(false);
    const [article, setArticle] = useState(null);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const { data: articleData, error: articleError } = await supabase
                    .from('articles')
                    .select('*')
                    .eq('id', articleID)
                    .single();

                if (articleError) {
                    throw articleError;
                }

                setArticle(articleData);
                console.log("Article Data: ", articleData);

                const { data: reviewsData, error: reviewsError } = await supabase
                    .from('comments')
                    .select('*')
                    .eq('articleID', articleID);

                if (reviewsError) {
                    throw reviewsError;
                }

                setComments(reviewsData);
                console.log("Comments Data: ", reviewsData);
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };

        fetchArticle();
    }, [articleID]);

    const toggleReviewSection = () => {
        setShowReview(!showReview);
    };

    const toggleFavorite = async () => {
        try {
            const { error } = await supabase
                .from('articles')
                .update({ liked: !article.liked })
                .eq('id', article.id);

            if (error) {
                throw error;
            }

            setArticle((prevArticle) => ({
                ...prevArticle,
                liked: !prevArticle.liked,
            }));

            const action = article.liked ? 'unliked 👎' : 'liked  👍';
            toast(`You've ${action} this article!`, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            });
        } catch (error) {
            console.error('Error toggling favorite:', error.message);
        }
    }

    return (
        <div>
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

            <div className="interact-icons mb-5">
                <Row className="justify-content-end">
                    <Col xs="auto" className="pe-1">
                        {article && (
                            <a href="#!" onClick={() => toggleFavorite()}>
                                <FontAwesomeIcon
                                    icon={article.liked ? faSolidThumbs : faThumbsUp}
                                    size="xl"
                                    title="Like this Article"
                                />
                            </a>
                        )}
                    </Col>
                    <Col xs="auto" className="pe-1">
                        <a href="#!">
                            <FontAwesomeIcon
                                icon={faComment}
                                size="xl"
                                onClick={toggleReviewSection}
                                title="See Comments"
                            />
                        </a>
                    </Col>
                    <Col xs="auto" className="pe-1">
                        <FacebookShareButton url={shareUrl}><FacebookIcon size={25} round /></FacebookShareButton>
                    </Col>
                    <Col xs="auto" className="pe-1">
                    <WhatsappShareButton
                        url={shareUrl}
                        title={title}
                        separator=":: "
                        className="Demo__some-network__share-button"
                    >
                        <WhatsappIcon size={25} round />
                    </WhatsappShareButton>
                    </Col>
                    <Col xs="auto" className="pe-1">
                        <TwitterShareButton url={shareUrl} title={title} ><XIcon size={25} round /></TwitterShareButton>
                    </Col>
                    <Col xs="auto" className="pe-1">
                        <EmailShareButton url={shareUrl} subject={title} body="body" ><EmailIcon size={25} round /></EmailShareButton>
                    </Col>
                </Row>
            </div>

            {showReview && (
                <ArticleCommentSection comments={comments} setComments={setComments} />
            )}
            
        </div>
    );
}

export default ArticleInteraction;