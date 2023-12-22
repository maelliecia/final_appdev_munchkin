import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Container, ListGroup, Form, Button, Modal } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { supabase } from '../client';

const CommentSchema = Yup.object().shape({
  comment: Yup.string()
    .max(250, 'Comment must be at most 250 characters')
    .required('Comment is required'),
});

const ArticleCommentSection = ({ comments = [], setComments }) => {
  const currentUserID = parseInt(sessionStorage.getItem('userId'), 10);
  const [editIndex, setEditIndex] = useState(-1);
  const [usernames, setUsernames] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  useEffect(() => {
    const fetchUsernames = () => {
      const userIds = comments.map((comment) => comment.userID);
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
  }, [comments, currentUserID]);

  const addComment = async (values, { resetForm }) => {
    try {
      const { data: lastCommentData, error: lastCommentError } = await supabase
        .from('comments')
        .select('id')
        .order('id', { ascending: false })
        .limit(1);
  
      if (lastCommentError) {
        throw lastCommentError;
      }
  
      const lastCommentId = lastCommentData.length > 0 ? lastCommentData[0].id : 0;
      const newCommentId = lastCommentId + 1;
  
      const newComment = {
        id: newCommentId,
        comment: values.comment,
        articleID: comments.length > 0 ? comments[0].articleID : sessionStorage.getItem('articleId'),
        userID: currentUserID,
        dateUpdated: new Date().toLocaleString(),
      };
  
      const { error: insertError } = await supabase.from('comments').insert([newComment]);
  
      if (insertError) {
        throw insertError;
      }

      const { data: insertedData, error: fetchError } = await supabase
        .from('comments')
        .select('*')
        .eq('id', newCommentId)
        .single();
  
      if (fetchError) {
        throw fetchError;
      }

      if (insertedData) {
        console.log('Comment added successfully:', insertedData);
        setComments([...comments, insertedData]);
        resetForm();
      } else {
        throw new Error('Failed to add comment. No data returned from the server.');
      }
    } catch (error) {
      console.error('Error adding or fetching comment:', error.message);
    }
  };  

  const deleteComment = (index) => {
    supabase
      .from('comments')
      .delete()
      .eq('id', comments[index].id)
      .then(() => {
        const updatedComments = [...comments];
        updatedComments.splice(index, 1);
        setComments(updatedComments);
        setEditIndex(-1);
      })
      .catch((error) => {
        console.error('Error deleting comment:', error.message);
      });
  };

  const editComment = async (index, values, { resetForm }) => {
    try {
      const commentToUpdate = comments[index];

      const updatedComment = {
        ...commentToUpdate,
        comment: values.comment,
        dateUpdated: new Date().toLocaleString(),
      };

      const { error: updateError } = await supabase
        .from('comments')
        .upsert([updatedComment], { onConflict: ['id'] });

      if (updateError) {
        throw updateError;
      }

      const updatedComments = [...comments];
      updatedComments[index] = updatedComment;
      setComments(updatedComments);
      setEditIndex(-1);
      resetForm();
    } catch (error) {
      console.error('Error updating comment:', error.message);
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
      deleteComment(deleteIndex);
      setShowDeleteModal(false);
    }
  };

  return (
    <Container className="comment-section">
      <h2>Comments</h2>
      
      <ListGroup>
      {comments.map((comment, index) => (
          <ListGroup.Item key={index}>
            {editIndex === index ? (
              <Formik
                initialValues={{
                  comment: comment.comment,
                }}
                validationSchema={CommentSchema}
                onSubmit={(values, actions) => {
                  editComment(index, values, actions);
                }}
              >
                {({ handleSubmit, isSubmitting }) => (
                  <Form onSubmit={handleSubmit}>
                    {/* Edit form fields */}
                    <Field
                      name="comment"
                      as="textarea"
                      placeholder="Write a comment..."
                      rows={5}
                      maxLength={250}
                      className="form-control"
                    />
                    <ErrorMessage name="comment" component="div" className="text-danger" />
                    <Button
                      type="submit"
                      variant="primary"
                      className="add-button mt-3"
                      disabled={isSubmitting}
                    >
                      Update Comment
                    </Button>
                  </Form>
                )}
              </Formik>
            ) : (
              <>
                <span>
                  <strong>{usernames[comment.userID]} </strong>
                  <span style={{ fontSize: '0.8rem', color: '#888' }}>
                    {new Date(comment.dateUpdated).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                    {' '}
                    {new Date(comment.dateUpdated).toLocaleDateString('en-US', {
                      month: '2-digit',
                      day: '2-digit',
                      year: 'numeric',
                    })}
                  </span>
                </span>

                <p className="ms-3">
                  <br />
                  {comment.comment}
                </p>

                {comment.userID === currentUserID && (
                  <>
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="edit-icon ms-2"
                      onClick={() => setEditIndex(index)}
                      title="Edit Comment"
                    />
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      onClick={() => handleDeleteConfirmation(index)}
                      className="delete-icon ms-2"
                      title="Delete Comment"
                    />
                  </>
                )}
              </>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>

      {(
        <div className="comment-form mt-4">
          <Formik
            initialValues={{
              comment: '',
            }}
            validationSchema={CommentSchema}
            onSubmit={(values, actions) => {
              addComment(values, actions);
            }}
          >
          {({ handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Field
                name="comment"
                as="textarea"
                placeholder="Write a comment..."
                rows={5}
                maxLength={250}
                className="form-control"
              />
              <ErrorMessage name="comment" component="div" className="text-danger" />
              <Button type="submit" variant="primary" className="add-button mt-3" disabled={isSubmitting}>
                Create Comment
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
          Are you sure you want to delete this comment?
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

export default ArticleCommentSection;