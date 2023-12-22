import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from '../client';

import ReviewSection from './ReviewSection';
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

function RecipeInteraction(props) {
    let recipeID = props.id;
    console.log("recipe ID: ", recipeID);
    const shareUrl = "http://munchkin.com";
    const title = "munchkin";

    const [showReview, setShowReview] = useState(false);
    const [recipe, setRecipe] = useState(null);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const { data: recipeData, error: recipeError } = await supabase
                    .from('recipes')
                    .select('*')
                    .eq('id', recipeID)
                    .single();

                if (recipeError) {
                    throw recipeError;
                }

                setRecipe(recipeData);
                console.log("Recipe Data: ", recipeData);

                const { data: reviewsData, error: reviewsError } = await supabase
                    .from('reviews')
                    .select('*')
                    .eq('recipeID', recipeID);

                if (reviewsError) {
                    throw reviewsError;
                }

                setReviews(reviewsData);
                console.log("Reviews Data: ", reviewsData);
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };

        fetchRecipe();
    }, [recipeID]);

    const toggleReviewSection = () => {
        setShowReview(!showReview);
    };

    const toggleFavorite = async () => {
        try {
            const { error } = await supabase
                .from('recipes')
                .update({ favorited: !recipe.favorited })
                .eq('id', recipe.id);

            if (error) {
                throw error;
            }

            setRecipe((prevRecipe) => ({
                ...prevRecipe,
                favorited: !prevRecipe.favorited,
            }));

            const action = recipe.favorited ? 'removed 💔 from' : 'added ❤️ to';
            toast(`Recipe ${action} favorites!`, {
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
                        {recipe && (
                            <a href="#!" onClick={() => toggleFavorite()}>
                                <FontAwesomeIcon
                                    icon={recipe.favorited ? faSolidHeart : faHeart}
                                    size="xl"
                                    title="Add to Favorites"
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
                                title="See Reviews"
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
                <ReviewSection reviews={reviews} setReviews={setReviews} />
            )}
        </div>
    );
}

export default RecipeInteraction;