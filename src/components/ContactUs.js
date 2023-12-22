import React, { useState } from 'react';
import { Container, Form, Button, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { supabase } from '../client';


const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().required('Email is required').matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,'Invalid email format'),
    message: yup.string().required('Message is required'),
});

function ContactUs() {
  const [showModal, setShowModal] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      message: '',
      userID: null,
      dateSubmitted: new Date().toLocaleString(),
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const currentUserID = parseInt(sessionStorage.getItem('userId'), 10);
        const contactData = {
          name: values.name,
          email: values.email,
          message: values.message,
          userID: currentUserID || null,
          dateSubmitted: new Date().toLocaleString(),
        };

        const { data, error } = await supabase.from('contact').insert([contactData]);

        if (error) {
          throw new Error('Error inserting data: ' + error.message);
        }

        console.log('Data inserted successfully:', data);
        resetForm();
        setShowModal(true);

      } catch (error) {
        console.error(error.message);
        
      } finally {
        setSubmitting(false);
      }
    },
  });

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="contact-page">
          <Container>
            <h1>Contact Us</h1>
            <p>
              Have questions, suggestions, or feedback? We'd love to hear from you. Feel free to
              reach out to us using the contact form below, and we'll get back to you as soon as
              possible.
            </p>

            <Form className="w-50 mx-auto mb-5" onSubmit={formik.handleSubmit}>
              <Form.Group controlId="name">
                <Form.Label>Your Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  className="form-control"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="error">{formik.errors.name}</div>
                )}
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label className="mt-2">Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="form-control"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="error">{formik.errors.email}</div>
                )}
              </Form.Group>

              <Form.Group controlId="message">
                <Form.Label className="mt-2">Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="message"
                  placeholder="Enter your message"
                  className="form-control"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.message}
                />
                {formik.touched.message && formik.errors.message && (
                  <div className="error">{formik.errors.message}</div>
                )}
              </Form.Group>
              
              <div className="text-center">
                <Button variant="primary" type="submit" className="mt-4 mb-5" disabled={formik.isSubmitting}>
                  {formik.isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </Form>
          </Container>

          <Modal show={showModal} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Message Received</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Thank you for submitting your message. We will work on your inquiries, suggestions, or feedback as
            soon as possible.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={closeModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
    </div>
  );
}

export default ContactUs;