import React from 'react';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

import { supabase } from '../client';

const validationSchema = yup.object().shape({
  firstname: yup.string().required('First Name is required'),
  lastname: yup.string().required('Last Name is required'),
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,'Password must meet the criteria'),
  conpassword: yup.string().required('Confirm Password is required').oneOf([yup.ref('password'), null], 'Passwords must match'),
  email: yup.string().required('Email is required').matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,'Invalid email format'),
  contactno: yup.string().matches(/^\d+$/, 'Contact Number must be a number').required('Contact Number is required'),
});

function SignupForm() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstname: '',
      lastname: '',
      username: '',
      password: '',
      conpassword: '',
      email: '',
      contactno: '',
      sex: 'male',
    },
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      try {
        // Check if username already exists
        const { data: existingUsernameData } = await supabase
        .from('users')
        .select('id')
        .eq('username', values.username)
        .single();

      // Check if complete name already exists
      const { data: existingNameData } = await supabase
        .from('users')
        .select('id')
        .eq('firstname', values.firstname)
        .eq('lastname', values.lastname)
        .single();

      // Check if email already exists
      const { data: existingEmailData } = await supabase
        .from('users')
        .select('id')
        .eq('email', values.email)
        .single();

      // Set field errors if duplicates are found
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

      // If any errors were set, return to prevent further execution
      if (existingUsernameData || existingNameData || existingEmailData) {
        return;
      }
        
        const { data: lastEntryData, error: lastEntryError } = await supabase
          .from('users')
          .select('id')
          .order('id', { ascending: false })
          .limit(1);
  
        
        if (lastEntryError) {
          throw lastEntryError;
        }
  
        const lastEntryId = lastEntryData[0]?.id || 0; 

        const { data, error } = await supabase.from('users').upsert([
          {
            id: lastEntryId + 1,
            firstname: values.firstname,
            lastname: values.lastname,
            username: values.username,
            password: values.password,
            email: values.email,
            contactno: values.contactno,
            sex: values.sex,
          },
        ]);
  
        if (error) {
          throw error;
        }
  
        console.log('User data inserted:', data);
        navigate('/login');

      } catch (error) {
        console.error('Error inserting user data:', error);
      }
    },
  });

  return (
    <Container>
      <Row className="m-5 d-flex justify-content-center align-items-center">
        <Col md={8} lg={6} xs={12}>
          <Card className="shadow px-4">
            <Card.Body>
              <div className="mb-3 d-flex flex-column align-items-center justify-content-center">
                <img src="/logo.png" alt="Logo" style={{ width: '200px', height: '200px' }} />
                <div className="mb-3">
                  <Form onSubmit={formik.handleSubmit}>
                  <Row>
                      {/* First Name */}
                      <Form.Group as={Col}  className="mb-3" controlId="firstname">
                        <Form.Label className="text-center">First Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="firstname"
                            value={formik.values.firstname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={formik.touched.firstname && !!formik.errors.firstname}
                            isValid={formik.touched.firstname && !formik.errors.firstname}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.firstname}
                        </Form.Control.Feedback>
                      </Form.Group>

                      {/* Last Name */}
                      <Form.Group as={Col} className="mb-3" controlId="lastname">
                        <Form.Label className="text-center">Last Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="lastname"
                            value={formik.values.lastname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={formik.touched.lastname && !!formik.errors.lastname}
                            isValid={formik.touched.lastname && !formik.errors.lastname}
                        />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.lastname}
                          </Form.Control.Feedback>
                      </Form.Group>
                  </Row>

                  {/* Username */}
                  <Form.Group as={Col} className="mb-3" controlId="username">
                    <Form.Label className="text-center">Username</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.username && !!formik.errors.username}
                        isValid={formik.touched.username && !formik.errors.username}
                    />
                      <Form.Control.Feedback type="invalid">
                          {formik.errors.username}
                        </Form.Control.Feedback>
                  </Form.Group>
                  
                  {/* Password */}
                  <Form.Group as={Col} className="mb-3" controlId="password">
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

                  {/* Confirm Password */}
                  <Form.Group as={Col} className="mb-3" controlId="conpassword">
                    <Form.Label className="text-center">Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="conpassword"
                      value={formik.values.conpassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.conpassword && !!formik.errors.conpassword}
                      isValid={formik.touched.conpassword && !formik.errors.conpassword}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.conpassword}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Email */}
                  <Form.Group as={Col} className="mb-3" controlId="email">
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

                  {/* Contact Number */}
                  <Form.Group as={Col} className="mb-3" controlId="contactno">
                    <Form.Label className="text-center">Contact Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="contactno"
                      value={formik.values.contactno}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.contactno && !!formik.errors.contactno}
                      isValid={formik.touched.contactno && !formik.errors.contactno}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.contactno}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Sex */}
                  <Form.Group className="mb-4" as={Col} controlId="sex">
                    <Form.Label className="text-center">Sex</Form.Label>
                    <div className="text-center">
                      <Form.Check
                        inline
                        type="radio"
                        label="Male"
                        name="sex"
                        value="male"
                        checked={formik.values.sex === 'male'}
                        onChange={formik.handleChange}
                      />
                      <Form.Check
                        inline
                        type="radio"
                        label="Female"
                        name="sex"
                        value="female"
                        checked={formik.values.sex === 'female'}
                        onChange={formik.handleChange}
                      />
                      <Form.Check
                        inline
                        type="radio"
                        label="Other"
                        name="sex"
                        value="other"
                        checked={formik.values.sex === 'other'}
                        onChange={formik.handleChange}
                      />
                    </div>
                  </Form.Group>
                    <div className="d-grid">
                      <Button variant="primary" type="submit">
                        Sign Up
                      </Button>
                    </div>
                  </Form>
                  <div className="mt-3">
                    <p className="mb-0  text-center">
                      Already have an account?{' '}
                      <a href="/login" className="fw-bold">
                        Log In
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
  );
}

export default SignupForm;