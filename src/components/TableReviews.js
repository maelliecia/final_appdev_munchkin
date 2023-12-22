import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import { Table, Button, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TableEmpty from './TableEmpty';

const TableReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [delCallback, setDelCallback] = useState(null);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('id, rating, review, recipeID (recipe: title), userID, dateUpdated')
        .order('id', { ascending: true });

      if (error) {
        throw error;
      }

      const userIDs = data.map(review => review.userID);

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, firstname, lastname')
        .in('id', userIDs);

      if (userError) {
        throw userError;
      }

      const reviewsWithUserData = data.map(review => {
        const userDataItem = userData.find(user => user.id === review.userID);
        const userFullName = userDataItem ? `${userDataItem.firstname} ${userDataItem.lastname}` : '';
        return {
          ...review,
          user: userFullName,
        };
      });

      setReviews(reviewsWithUserData);
    } catch (error) {
      console.error('Error fetching reviews:', error.message);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteReview = async (id) => {
    setShowDeleteConfirm(true);
    const confirmDelete = async () => {
      try {
        const { error } = await supabase.from('reviews').delete().eq('id', id);

        if (error) {
          throw error;
        }

        setReviews((prevReviews) => prevReviews.filter((review) => review.id !== id));
        showDeleteToast('delete');
      } catch (error) {
        console.error('Error deleting review:', error.message);
      } finally {
        setShowDeleteConfirm(false);
      }
    };

    setDelCallback(() => confirmDelete);
  };

  const showDeleteToast = () => {
    toast('❌ Review deleted successfully!', {
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

  const handleCloseDeleteConfirmation = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="admin mt-4">
      {reviews.length > 0 ? (
        <>
          <ToastContainer />

          <Table responsive striped bordered hover variant="light" className="table-auto mb-5">
            <thead>
              <tr className="text-center align-items-center">
                <th>ID</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Recipe</th>
                <th>User</th>
                <th>Date Updated</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {reviews.map((review) => (
                <tr key={review.id}>
                  <td>{review.id}</td>
                  <td>{review.rating}</td>
                  <td>{review.review}</td>
                  <td>{review.recipeID.recipe}</td>
                  <td>{review.user}</td>
                  <td>{review.dateUpdated ? new Date(review.dateUpdated).toLocaleString() : ''}</td>
                  <td>
                    <div className="text-center">
                      <Button style={{ width: '80px' }} variant="danger" onClick={() => handleDeleteReview(review.id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Modal show={showDeleteConfirm} onHide={handleCloseDeleteConfirmation}>
            <Modal.Header closeButton>
              <Modal.Title>Delete Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this review?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseDeleteConfirmation}>
                Cancel
              </Button>
              <Button variant="danger" onClick={delCallback}>
                Confirm Delete
              </Button>
            </Modal.Footer>
          </Modal>

        </>
      ) : (
        <TableEmpty />
      )}   
    </div>
  );
};

export default TableReviews;
