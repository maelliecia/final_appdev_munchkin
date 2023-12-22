import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import { Table, Button, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TableEmpty from './TableEmpty';

const TableMessages = () => {
  const [messages, setMessages] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [delCallback, setDelCallback] = useState(null);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact')
        .select('*')
        .order('id', { ascending: true });
  
      console.log("data: ", data);
  
      if (error) {
        throw error;
      }
  
      const userIDs = data.filter(message => message.userID !== null).map(message => message.userID);
      console.log("userIDs: ", userIDs);
  
      if (userIDs.length > 0) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, firstname, lastname')
          .in('id', userIDs);
  
        console.log("userData: ", userData);
  
        if (userError) {
          throw userError;
        }
  
        const messagesWithUserData = data.map(message => {
          if (message.userID !== null) {
            const userDataItem = userData.find(user => user.id === message.userID);
            const userFullName = userDataItem ? `${userDataItem.firstname} ${userDataItem.lastname}` : '';
            return {
              ...message,
              user: userFullName,
            };
          } else {
            return {
              ...message,
              user: 'N/A',
            };
          }
        });
  
        setMessages(messagesWithUserData);
        console.log("messagesWithUserData: ", messagesWithUserData);
      } else {
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error.message);
    }
  };
  

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDeleteMessage = async (id) => {
    setShowDeleteConfirm(true);
    const confirmDelete = async () => {
      try {
        const { error } = await supabase.from('contact').delete().eq('id', id);

        if (error) {
          throw error;
        }

        setMessages((prevMessages) => prevMessages.filter((message) => message.id !== id));
        showDeleteToast('delete');
      } catch (error) {
        console.error('Error deleting message:', error.message);
      } finally {
        setShowDeleteConfirm(false);
      }
    };

    setDelCallback(() => confirmDelete);
  };

  const showDeleteToast = () => {
    toast('❌ Message deleted successfully!', {
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
      {messages.length > 0 ? (
        <>
          <ToastContainer />

          <Table responsive striped bordered hover variant="light" className="table-auto mb-5">
            <thead>
              <tr className="text-center align-items-center">
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>User</th>
                <th>Date Submitted</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {messages.map((message) => (
                <tr key={message.id}>
                  <td>{message.id}</td>
                  <td>{message.name}</td>
                  <td>{message.email}</td>
                  <td>{message.message}</td>
                  <td>{message.user || 'N/A'}</td> 
                  <td>{message.dateSubmitted ? new Date(message.dateSubmitted ).toLocaleString() : ''}</td>
                  <td>
                    <div className="text-center">
                      <Button style={{ width: '80px' }} variant="danger" onClick={() => handleDeleteMessage(message.id)}>
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
            <Modal.Body>Are you sure you want to delete this message?</Modal.Body>
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

export default TableMessages;