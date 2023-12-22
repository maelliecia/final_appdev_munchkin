import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Modal } from 'react-bootstrap';
import { supabase } from '../client';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { isEqual, startCase } from 'lodash';
import { ToastContainer, toast } from 'react-toastify';

const validationSchema = yup.object().shape({
  firstname: yup.string().required('First Name is required'),
  lastname: yup.string().required('Last Name is required'),
  username: yup.string().required('Username is required'),
  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must meet the criteria'
    ),
  conpassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
  email: yup
    .string()
    .required('Email is required')
    .matches(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      'Invalid email format'
    ),
  contactno: yup.string().matches(/^\d+$/, 'Contact Number must be a number').required('Contact Number is required'),
  sex: yup.string().required('Sex is required'),
});

const UserProfileForm = () => {
  const [userProfile, setUserProfile] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const currentUserID = parseInt(sessionStorage.getItem('userId'), 10);

  const [isPasswordTouched, setIsPasswordTouched] = useState(false);
  const [showNoChangesModal, setShowNoChangesModal] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', currentUserID)
          .single();
  
        if (error) {
          throw error;
        }
  
        if (data) {
          setUserProfile(data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error.message);
      }
    };
  
    fetchUserProfile();
  }, [currentUserID, isEditMode]);  

  const formik = useFormik({
    initialValues: {
        firstname: userProfile ? userProfile.firstname || '' : '',
        lastname: userProfile ? userProfile.lastname || '' : '',
        username: userProfile ? userProfile.username || '' : '',
        password: userProfile ? userProfile.password || '' : '',
        conpassword: '',
        email: userProfile ? userProfile.email || '' : '',
        contactno: userProfile ? userProfile.contactno || '' : '',
        sex: userProfile ? userProfile.sex || 'male' : 'male',
      },

    validationSchema,
    
    onSubmit: async (values) => {
        try {
          if (isEditMode) {
            const changesDone = !isEqual(values, userProfile);
      
            if (!changesDone) {
              setShowNoChangesModal(true);
            } else {
                const { data: existingUsernameData } = await supabase
                .from('users')
                .select('id')
                .eq('username', values.username)
                .neq('id', currentUserID)
                .single();

                const { data: existingNameData } = await supabase
                .from('users')
                .select('id')
                .eq('firstname', values.firstname)
                .eq('lastname', values.lastname)
                .neq('id', currentUserID)
                .single();

                const { data: existingEmailData } = await supabase
                .from('users')
                .select('id')
                .eq('email', values.email)
                .neq('id', currentUserID)
                .single();

                if (existingNameData) {
                formik.setErrors({
                firstname: 'This complete name already exists',
                lastname: 'This complete name already exists',
                });
                }

                if (existingEmailData) {
                formik.setErrors({ email: 'Email already exists' });
                }

                if (existingUsernameData) {
                formik.setErrors({ username: 'Username already exists' });
                }

                if (existingUsernameData || existingNameData || existingEmailData) {
                return;
                }

              const { data, error } = await supabase
                .from('users')
                .update({
                  firstname: values.firstname,
                  lastname: values.lastname,
                  username: values.username,
                  password: values.password,
                  email: values.email,
                  contactno: values.contactno,
                  sex: values.sex,
                  imageSrc: values.imageSrc,
                })
                .eq('id', currentUserID);
      
              if (error) {
                throw error;
              }
      
              setUserProfile(data);
              setIsEditMode(false);

              console.log('User profile updated successfully!');
              toast(`✍️ Profile updated successfully!`, {
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
          }
        } catch (error) {
          console.error('Error updating user data:', error);
        }
      },      
  });

  const handleEditClick = () => {
    formik.setValues(userProfile);
    setIsEditMode(true);
    setIsPasswordTouched(false);
    setShowNoChangesModal(false);
  };

  const handleCancelEdit = () => {
    formik.resetForm();
    setIsEditMode(false);
    setIsPasswordTouched(false);
  };

  const handlePasswordChange = (e) => {
    formik.handleChange(e);
    setIsPasswordTouched(true);
  };

  return (
    <div className="d-flex justify-content-center vh-100">

      <ToastContainer/>

      <div className="w-75">
      {userProfile === null ? (
          <p>Loading...</p>
        ) : (
            <>
            {!isEditMode ? (
                <div>
                    <div className="text-end">
                    <Button variant="primary" onClick={handleEditClick}>
                        Edit
                    </Button>
                    </div>
                    <div className="profile-container mt-4">
                    <div className="text-center">
                        <img
                            src={userProfile?.imageSrc || ''}
                            alt="Profile"
                            className="profile-image"
                        />

                        <h2 className="mt-2">
                        {userProfile.firstname} {userProfile.lastname}
                        </h2>
                        <p className="text-muted">
                        <i>@{userProfile.username}</i>
                        </p>
                    </div>
                    <div className="profile-details mt-3 ms-4">
                        <p>
                        <strong>Email Address:</strong>{' '}
                        <span className="text-center">{userProfile.email}</span>
                        </p>
                        <p>
                        <strong>Contact No.:</strong>{' '}
                        <span className="text-center">{userProfile.contactno}</span>
                        </p>
                        <p>
                        <strong>Sex:</strong>{' '}
                        <span className="text-center">{startCase(userProfile.sex)}</span>
                        </p>
                    </div>
                    </div>
                </div>
                ) : (
                
                <Form onSubmit={formik.handleSubmit}>
                    <Row>
                        <Col>
                            <h4 className="mt-4">Edit Information</h4>
                        </Col>
                        <Col>
                            <div className="text-end">
                                <Button variant="outline-secondary" className="mt-4" onClick={handleCancelEdit}>
                                Cancel
                                </Button>
                            </div>
                        </Col>
                    </Row>
                
                    <Row>
                        <Form.Group as={Col} className="mb-3" controlId="formFirstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstname"
                                value={formik.values.firstname || ''}
                                onChange={formik.handleChange}
                                />
                                {formik.touched.firstname && formik.errors.firstname && (
                                <div className="text-danger">{formik.errors.firstname}</div>
                                )}
                        </Form.Group>

                        <Form.Group as={Col} className="mb-3" controlId="formLastName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                            type="text"
                            name="lastname"
                            value={formik.values.lastname || ''}
                            onChange={formik.handleChange}
                            />
                            {formik.touched.lastname && formik.errors.lastname && (
                            <div className="text-danger">{formik.errors.lastname}</div>
                            )}
                        </Form.Group>
                        </Row>

                        <Form.Group className="mb-3" controlId="formUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            value={formik.values.username || ''}
                            onChange={formik.handleChange}
                        />
                        {formik.touched.username && formik.errors.username && (
                            <div className="text-danger">{formik.errors.username}</div>
                        )}
                        </Form.Group>

                        <Row>
                        <Form.Group as={Col} className="mb-3" controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                            type="email"
                            name="email"
                            value={formik.values.email || ''}
                            onChange={formik.handleChange}
                            />
                            {formik.touched.email && formik.errors.email && (
                            <div className="text-danger">{formik.errors.email}</div>
                            )}
                        </Form.Group>

                        <Form.Group as={Col} className="mb-3" controlId="formContactNo">
                            <Form.Label>Contact Number</Form.Label>
                            <Form.Control
                            type="text"
                            name="contactno"
                            value={formik.values.contactno || ''}
                            onChange={formik.handleChange}
                            />
                            {formik.touched.contactno && formik.errors.contactno && (
                            <div className="text-danger">{formik.errors.contactno}</div>
                            )}
                        </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group as={Col} className="mb-3" controlId="formPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                type="password"
                                name="password"
                                value={formik.values.password || ''}
                                onChange={(e) => {
                                    handlePasswordChange(e);
                                }}
                                data-toggle="tooltip"
                                data-placement="top"
                                title="Password must meet the following criteria:
                                - At least one uppercase alphabetic character.
                                - At least one lowercase alphabetic character.
                                - At least one numeric character.
                                - At least one special character (for example, #, $, %, !, &, *)."
                                />
                                {formik.touched.password && formik.errors.password && (
                                <div className="text-danger">{formik.errors.password}</div>
                                )}
                            </Form.Group>

                            {isPasswordTouched && (
                                <Form.Group as={Col} className="mb-3" controlId="formConPassword">
                                <Form.Label>Confirm New Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="conpassword"
                                    value={formik.values.conpassword || ''}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.conpassword && formik.errors.conpassword && (
                                    <div className="text-danger">{formik.errors.conpassword}</div>
                                )}
                                </Form.Group>
                            )}
                        </Row>

                        <Form.Group className="mb-3" controlId="formSex">
                        <Form.Label>Sex</Form.Label>
                        <Form.Control
                            as="select"
                            name="sex"
                            value={formik.values.sex || ''}
                            onChange={formik.handleChange}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </Form.Control>
                        {formik.touched.sex && formik.errors.sex && (
                            <div className="text-danger">{formik.errors.sex}</div>
                        )}
                        </Form.Group>

                        <Form.Group className="mb-5" controlId="formImageSrc">
                        <Form.Label>Profile Picture (URL)</Form.Label>
                        <Form.Control
                            type="text"
                            name="imageSrc"
                            value={formik.values.imageSrc || ''} 
                            onChange={formik.handleChange}
                        />
                        {formik.touched.imageSrc && formik.errors.imageSrc && (
                            <div className="text-danger">{formik.errors.imageSrc}</div>
                        )}
                        </Form.Group>

                    
                    <div className="text-center">
                        <Button variant="primary" type="submit">
                        Save Changes
                        </Button>
                    </div>
                    
                </Form>
                )}
            </>
        )}
        </div>

        <Modal show={showNoChangesModal} onHide={() => setShowNoChangesModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>No Edits</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            There are no changes made to your profile.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setShowNoChangesModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
    </div>
  );
}

export default UserProfileForm;