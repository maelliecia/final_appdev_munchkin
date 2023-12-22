import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Container, ListGroup, Form, Button, Row, Col, Modal } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { supabase } from '../client';

const ReviewSchema = Yup.object().shape({
  rating: Yup.number()
    .min(1, 'Rating must be at least 1')
    .max(10, 'Rating must be at most 10')
    .required('Rating is required'),
  review: Yup.string()
    .max(250, 'Review must be at most 250 characters')
    .required('Review is required'),
});

const ReviewSection = ({ reviews = [], setReviews }) => {
  const currentUserID = parseInt(sessionStorage.getItem('userId'), 10);
  const [editIndex, setEditIndex] = useState(-1);
  const [usernames, setUsernames] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const userHasPostedReview = reviews.some((review) => review.userID === currentUserID);

  useEffect(() => {
    const fetchUsernames = () => {
      const userIds = reviews.map((review) => review.userID);
      supabase
        .from('users')
        .select('id, username')
        .in('id', userIds)
        .then(({ data: usersData, error: usersError }) => {
          if (usersError) {
            throw usersError;
          }

          const usernameMap = {};
          usersData.forEach((user) => {
            usernameMap[user.id] = user.username;
          });

          setUsernames(usernameMap);
        })
        .catch((error) => {
          console.error('Error fetching usernames:', error.message);
        });
    };

    fetchUsernames();
  }, [reviews]);

  const addReview = async (values, { resetForm }) => {
    try {
      const { data: lastReviewData, error: lastReviewError } = await supabase
        .from('reviews')
        .select('id')
        .order('id', { ascending: false })
        .limit(1);
  
      if (lastReviewError) {
        throw lastReviewError;
      }
  
      const lastReviewId = lastReviewData.length > 0 ? lastReviewData[0].id : 0;
      const newReviewId = lastReviewId + 1;
  
      const newReview = {
        id: newReviewId,
        rating: values.rating,
        review: values.review,
        recipeID: reviews.length > 0 ? reviews[0].recipeID : sessionStorage.getItem('recipeId'),
        userID: currentUserID,
        dateUpdated: new Date().toLocaleString(),
      };
  
      const { error: insertError } = await supabase.from('reviews').insert([newReview]);
  
      if (insertError) {
        throw insertError;
      }

      const { data: insertedData, error: fetchError } = await supabase
        .from('reviews')
        .select('*')
        .eq('id', newReviewId)
        .single();
  
      if (fetchError) {
        throw fetchError;
      }

      if (insertedData) {
        console.log('Review added successfully:', insertedData);
        setReviews([...reviews, insertedData]);
        resetForm();
      } else {
        throw new Error('Failed to add review. No data returned from the server.');
      }
    } catch (error) {
      console.error('Error adding or fetching review:', error.message);
    }
  };  

  const deleteReview = (index) => {
    supabase
      .from('reviews')
      .delete()
      .eq('id', reviews[index].id)
      .then(() => {
        const updatedReviews = [...reviews];
        updatedReviews.splice(index, 1);
        setReviews(updatedReviews);
        setEditIndex(-1);
      })
      .catch((error) => {
        console.error('Error deleting review:', error.message);
      });
  };

  const editReview = async (index, values, { resetForm }) => {
    try {
      const reviewToUpdate = reviews[index];

      const updatedReview = {
        ...reviewToUpdate,
        rating: values.rating,
        review: values.review,
        dateUpdated: new Date().toLocaleString(),
      };

      const { error: updateError } = await supabase
        .from('reviews')
        .upsert([updatedReview], { onConflict: ['id'] });

      if (updateError) {
        throw updateError;
      }

      const updatedReviews = [...reviews];
      updatedReviews[index] = updatedReview;
      setReviews(updatedReviews);
      setEditIndex(-1);
      resetForm();
    } catch (error) {
      console.error('Error updating review:', error.message);
    }
  };

  const handleDeleteConfirmation = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setDeleteIndex(null);
    setShowDeleteModal(false);
  };

  const handleDeleteConfirm = () => {
    if (deleteIndex !== null) {
      deleteReview(deleteIndex);
      setShowDeleteModal(false);
    }
  };

  return (
    <Container className="review-section">
      <h2>Reviews</h2>
      
      <ListGroup>
      {reviews.map((review, index) => (
          <ListGroup.Item key={index}>
            {editIndex === index ? (
              <Formik
                initialValues={{
                  rating: review.rating,
                  review: review.review,
                }}
                validationSchema={ReviewSchema}
                onSubmit={(values, actions) => {
                  editReview(index, values, actions);
                }}
              >
                {({ handleSubmit, isSubmitting }) => (
                  <Form onSubmit={handleSubmit}>
                    {/* Edit form fields */}
                    <Row className="mb-3">
                      <Col xs={12} sm={2}>
                        <Form.Label><strong>Rating:</strong></Form.Label>
                      </Col>
                      <Col xs={12} sm={10}>
                        <Field
                          name="rating"
                          type="number"
                          min="1"
                          max="10"
                          as={Form.Control}
                          style={{ width: '60px' }}
                        />
                        <ErrorMessage name="rating" component="div" className="text-danger" />
                      </Col>
                    </Row>
                    <Field
                      name="review"
                      as="textarea"
                      placeholder="Write a review..."
                      rows={5}
                      maxLength={250}
                      className="form-control"
                    />
                    <ErrorMessage name="review" component="div" className="text-danger" />
                    <Button
                      type="submit"
                      variant="primary"
                      className="add-button mt-3"
                      disabled={isSubmitting}
                    >
                      Update Review
                    </Button>
                  </Form>
                )}
              </Formik>
            ) : (
              <>
                <span>
                  <strong>{usernames[review.userID]} </strong>
                  <span style={{ fontSize: '0.8rem', color: '#888' }}>
                    {new Date(review.dateUpdated).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                    {' '}
                    {new Date(review.dateUpdated).toLocaleDateString('en-US', {
                      month: '2-digit',
                      day: '2-digit',
                      year: 'numeric',
                    })}
                  </span>
                </span>

                <p className="ms-3">
                  <strong>Rating: </strong>{review.rating}/10
                  <br />
                  {review.review}
                </p>

                {review.userID === currentUserID && (
                  <>
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="edit-icon ms-2"
                      onClick={() => setEditIndex(index)}
                      title="Edit Review"
                    />
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      onClick={() => handleDeleteConfirmation(index)}
                      className="delete-icon ms-2"
                      title="Delete Review"
                    />
                  </>
                )}
              </>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>

      {!userHasPostedReview && (
        <div className="review-form">
          <Formik
            initialValues={{
              rating: '',
              review: '',
            }}
            validationSchema={ReviewSchema}
            onSubmit={(values, actions) => {
              addReview(values, actions);
            }}
          >
          {({ handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col xs={12} sm={2}>
                  <Form.Label>Rating:</Form.Label>
                </Col>
                <Col xs={12} sm={10}>
                  <Field
                    name="rating"
                    type="number"
                    min="1"
                    max="10"
                    as={Form.Control}
                    style={{ width: '60px' }}
                  />
                  <ErrorMessage name="rating" component="div" className="text-danger" />
                </Col>
              </Row>
              <Field
                name="review"
                as="textarea"
                placeholder="Write a review..."
                rows={5}
                maxLength={250}
                className="form-control"
              />
              <ErrorMessage name="review" component="div" className="text-danger" />
              <Button type="submit" variant="primary" className="add-button mt-3" disabled={isSubmitting}>
                Create Review
              </Button>
            </Form>
          )}
        </Formik>
      </div>
      )}

      <Modal show={showDeleteModal} onHide={handleDeleteCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this review?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ReviewSection;
