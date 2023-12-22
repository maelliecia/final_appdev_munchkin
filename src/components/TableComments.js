import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import { Table, Button, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TableEmpty from './TableEmpty';

const TableComments = () => {
  const [comments, setComments] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [delCallback, setDelCallback] = useState(null);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('id, comment, articleID (article: title), userID, dateUpdated')
        .order('id', { ascending: true });

      if (error) {
        throw error;
      }

      const userIDs = data.map(comment => comment.userID);

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, firstname, lastname')
        .in('id', userIDs);

      if (userError) {
        throw userError;
      }

      const commentsWithUserData = data.map(comment => {
        const userDataItem = userData.find(user => user.id === comment.userID);
        const userFullName = userDataItem ? `${userDataItem.firstname} ${userDataItem.lastname}` : '';
        return {
          ...comment,
          user: userFullName,
        };
      });

      setComments(commentsWithUserData);
    } catch (error) {
      console.error('Error fetching comments:', error.message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleDeleteComment = async (id) => {
    setShowDeleteConfirm(true);
    const confirmDelete = async () => {
      try {
        const { error } = await supabase.from('comments').delete().eq('id', id);

        if (error) {
          throw error;
        }

        setComments((prevComments) => prevComments.filter((comment) => comment.id !== id));
        showDeleteToast('delete');
      } catch (error) {
        console.error('Error deleting comment:', error.message);
      } finally {
        setShowDeleteConfirm(false);
      }
    };

    setDelCallback(() => confirmDelete);
  };

  const showDeleteToast = () => {
    toast('❌ Comment deleted successfully!', {
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
      {comments.length > 0 ? (
        <>
          <ToastContainer />

          <Table responsive striped bordered hover variant="light" className="table-auto mb-5">
            <thead>
              <tr className="text-center align-items-center">
                <th>ID</th>
                <th>Comment</th>
                <th>Article</th>
                <th>User</th>
                <th>Date Updated</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {comments.map((comment) => (
                <tr key={comment.id}>
                  <td>{comment.id}</td>
                  <td>{comment.comment}</td>
                  <td>{comment.articleID.article}</td>
                  <td>{comment.user}</td>
                  <td>{comment.dateUpdated ? new Date(comment.dateUpdated).toLocaleString() : ''}</td>
                  <td>
                    <div className="text-center">
                      <Button style={{ width: '80px' }} variant="danger" onClick={() => handleDeleteComment(comment.id)}>
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
            <Modal.Body>Are you sure you want to delete this comment?</Modal.Body>
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

export default TableComments;