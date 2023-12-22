import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../client';
import ReactLoading from 'react-loading';

const validationSchema = yup.object().shape({
  email: yup.string().required('Email is required'),
  password: yup.string().required('Password is required'),
});

function LogInForm() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });

  async function checkCredentials(values) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, password, type')
        .eq('email', values.email)
        .single();

      if (error) {
        throw error;
      }

      if (data && data.password === values.password) {
        return data.id; // Return user ID on successful authentication
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data from Supabase:', error.message);
      return null;
    }
  }

  async function onSubmit(values) {
    try {
      setLoading(true);
      const userId = await checkCredentials(values);

      if (userId) {
        sessionStorage.setItem('userId', userId);

        const { data, error } = await supabase
          .from('users')
          .select('type')
          .eq('id', userId)
          .single();

        if (error) {
          throw error;
        }

        console.log('Data:', data);

        if (data.type === 'user') {
          navigate('/u/recipes');
        } else if (data.type === 'admin') {
          navigate('/a/users');
        }
      } else {
        handleShowModal();
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      handleShowModal();
    } finally {
      setLoading(false);
    }
  }

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={8} lg={6} xs={12}>
            <Card className="shadow px-4">
              <Card.Body>
                <div className="mb-3 d-flex flex-column align-items-center justify-content-center">
                  <img src="/logo.png" alt="Logo" style={{ width: '200px', height: '200px' }} />
                  <div className="mb-3">
                    <Form onSubmit={formik.handleSubmit}>
                      {/* Email */}
                      <Form.Group className="mb-3" controlId="email">
                        <Form.Label className="text-center">Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isInvalid={formik.touched.email && !!formik.errors.email}
                          isValid={formik.touched.email && !formik.errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>

                      {/* Password */}
                      <Form.Group className="mb-3" controlId="password">
                        <Form.Label className="text-center">Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={formik.values.password}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isInvalid={formik.touched.password && !!formik.errors.password}
                          isValid={formik.touched.password && !formik.errors.password}
                          data-toggle="tooltip"
                          data-placement="top"
                          title="Password must meet the following criteria:
                                - At least one uppercase alphabetic character.
                                - At least one lowercase alphabetic character.
                                - At least one numeric character.
                                - At least one special character (for example, #, $, %, !, &, *)."
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.password}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <div className="d-grid text-center align-items-center">
                        {loading ? (
                          <ReactLoading type="bubbles" color="#ab86bf" height={50} width={50} />
                        ) : (
                          <Button variant="primary" type="submit">
                            Log In
                          </Button>
                        )}
                      </div>
                    </Form>
                    <div className="mt-3">
                      <p className="mb-0 text-center">
                        Don't have an account?{' '}
                        <a href="/signup" className="fw-bold">
                          Sign Up
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>No Account Found</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>We couldn't find an account with the provided credentials. Would you like to sign up?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={() => navigate('/signup')}>
            Sign Up
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default LogInForm;