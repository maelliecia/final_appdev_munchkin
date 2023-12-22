import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import { Table, Button, Form, Row, Col, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import TableEmpty from './TableEmpty';

const userSchema = Yup.object().shape({
  firstname: Yup.string().required('First Name'),
  lastname: Yup.string().required('Last Name'),
  username: Yup.string().required('Username'),
  password: Yup.string().required('Password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,'Password must meet the criteria'),
  email: Yup.string().email('Valid Email').required('Email'),
  contactno: Yup.string().required('Contact No.'),
  sex: Yup.string().required('Sex'),
  imageSrc: Yup.string(),
  type: Yup.string().required('Type'),
});

const TableUsers = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    firstname: '',
    lastname: '',
    username: '',
    password: '',
    email: '',
    contactno: '',
    sex: '',
    imageSrc: '/users/avatar.jpg',
    type: '',
  });
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const isEditing = !!editingUser;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [delCallback, setDelCallback] = useState(null);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from('users').select('*').order('id', { ascending: true });
      if (error) {
        throw error;
      }
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleToggleModal = (user = null) => {
    setEditingUser(user);
    setNewUser(
      user || {
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        email: '',
        contactno: '',
        sex: '',
        imageSrc: '/users/avatar.jpg',
        type: '',
      }
    );
    setShowModal(!showModal);
  };

  const handleSaveUser = async () => {
    try {
      await userSchema.validate(newUser, { abortEarly: false });
      // Check if username already exists
      const { data: existingUsernameData } = await supabase
        .from('users')
        .select('id')
        .eq('username', newUser.username)
        .single();

      // Check if complete name already exists
      const { data: existingNameData } = await supabase
        .from('users')
        .select('id')
        .eq('firstname', newUser.firstname)
        .eq('lastname', newUser.lastname)
        .single();

      // Check if email already exists
      const { data: existingEmailData } = await supabase
        .from('users')
        .select('id')
        .eq('email', newUser.email)
        .single();

        if (existingNameData && newUser.id !== existingNameData.id) {
            toast.error('Complete name is already in use.');
            return;
        }

        if (existingEmailData && newUser.id !== existingEmailData.id) {
            toast.error('Email address is already in use.');
            return;
        }

        if (existingUsernameData && newUser.id !== existingUsernameData.id) {
            toast.error('Username is already in use.');
            return;
        }

      if (isEditing) {
        const { data: currentUser } = await supabase
          .from('users')
          .select('*')
          .eq('id', newUser.id)
          .single();

        const hasChanges = JSON.stringify(currentUser) !== JSON.stringify(newUser);

        if (hasChanges) {
          const { data, error } = await supabase
            .from('users')
            .update(newUser)
            .eq('id', newUser.id);

          if (error) {
            throw error;
          }

          setUsers((prevUsers) =>
            prevUsers.map((user) => (user.id === (data && data[0]?.id) ? data[0] : user))
          );

          setEditingUser(null);
          showUpdateToast('edit');
          fetchUsers();
        } else {

          showUpdateToast('nochanges');
        }

      } else {
        const { data, error } = await supabase.from('users').insert([newUser]);

        if (error) {
          throw error;
        }

        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === (data && data[0]?.id) ? data[0] : user))
        );

        showUpdateToast('add');
        fetchUsers();
      }

      setShowModal(false);
    } catch (error) {
      console.error('Error saving user:', error.message);

      if (error.errors && error.errors.length > 0) {
        const requiredFields = error.errors.join(', ');

        if (requiredFields) {
          toast.error(`Required Fields: ${requiredFields}`, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          });
        }
      }
    }
  };

  const handleDeleteUser = async (id) => {
    setShowDeleteConfirm(true);
    const confirmDelete = async () => {
      try {
        const { error } = await supabase.from('users').delete().eq('id', id);
        if (error) {
          throw error;
        }
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        showUpdateToast('delete');
      } catch (error) {
        console.error('Error deleting user:', error.message);
      } finally {
        setShowDeleteConfirm(false);
      }
    };
    setDelCallback(() => confirmDelete);
  };

  const showUpdateToast = (origin) => {
    if (origin === 'delete') {
      toast('❌ User deleted successfully!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } else if (origin === 'edit') {
      toast('✍️ User edited successfully!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } else if (origin === 'add') {
      toast('✔️ New user added successfully!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } else if (origin === 'nochanges') {
      toast('🚩 No changes have been made.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  };

  const handleCloseDeleteConfirmation = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="admin">
      {users.length > 0 ? (
        <>
          <ToastContainer />

          <div className="text-end">
            <Button variant="primary" onClick={() => handleToggleModal()} className="mb-3">
              Create New User
            </Button>
          </div>

          <Modal show={showModal} onHide={handleToggleModal}>
            <Modal.Header closeButton>
              <Modal.Title>{isEditing ? 'Edit User' : 'Create New User'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Row>
                  <Col>
                    <Form.Group controlId="formFirstname">
                      <Form.Label>First Name:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter first name"
                        name="firstname"
                        value={newUser.firstname}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="formLastname">
                      <Form.Label>Last Name:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter last name"
                        name="lastname"
                        value={newUser.lastname}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col>
                    <Form.Group controlId="formUsername">
                      <Form.Label>Username:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter username"
                        name="username"
                        value={newUser.username}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="formPassword">
                      <Form.Label>Password:</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter password"
                        name="password"
                        value={newUser.password}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col>
                    <Form.Group controlId="formEmail">
                      <Form.Label>Email Address:</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email"
                        name="email"
                        value={newUser.email}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="formContactno">
                      <Form.Label>Contact No.:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter contact number"
                        name="contactno"
                        value={newUser.contactno}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col>
                    <Form.Group controlId="formSex">
                      <Form.Label>Sex:</Form.Label>
                      <Form.Control
                        as="select"
                        name="sex"
                        value={newUser.sex}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="" disabled>
                          Select Sex
                        </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="formImageSrc">
                      <Form.Label>Image URL:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter image URL"
                        name="imageSrc"
                        value={newUser.imageSrc}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group controlId="formSex" className="mt-3">
                      <Form.Label>Type</Form.Label>
                      <Form.Control
                        as="select"
                        name="type"
                        value={newUser.type}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="" disabled>
                          Select type
                        </option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </Form.Control>
                    </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleToggleModal}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSaveUser}>
                {isEditing ? 'Update User' : 'Create User'}
              </Button>
            </Modal.Footer>
          </Modal>

          <Table responsive striped bordered hover variant="light" className="table-auto mb-5">
            <thead>
              <tr className="text-center align-items-center">
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Username</th>
                <th>Password</th>
                <th>Email Address</th>
                <th>Contact No.</th>
                <th>Sex</th>
                <th>Image</th>
                <th>Type</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.username}</td>
                  <td>{'*'.repeat(10)}</td>
                  <td>{user.email}</td>
                  <td>{user.contactno}</td>
                  <td>{user.sex}</td>
                  <td>{user.imageSrc}</td>
                  <td>{user.type}</td>
                  <td>
                    <div className="text-center">
                      <Button style={{ width: '80px' }}  variant="primary" onClick={() => handleToggleModal(user)}>
                        Edit
                      </Button>
                      <Button style={{ width: '80px' }} className="ms-2" variant="danger" onClick={() => handleDeleteUser(user.id)}>
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
            <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
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

export default TableUsers;
