import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from '../client';
import { startCase } from 'lodash';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const UserChildProfile = () => {
  const [children, setChildren] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [delCallback, setDelCallback] = useState(null);

  const currentUserID = parseInt(sessionStorage.getItem('userId'), 10);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('toddlers')
        .select('*')
        .eq('userID', currentUserID);

      if (error) {
        throw error;
      }

      setChildren(data || []);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  useEffect(() => {
    fetchData();
  });

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    age: Yup.number().min(1, 'Invalid age').required('Age is required'),
    gender: Yup.string().required('Gender is required'),
    weight_kg: Yup.number().min(1, 'Invalid weight').required('Weight is required'),
    height_cm: Yup.number().min(1, 'Invalid height').required('Height is required'),
    requirements: Yup.string().required('Dietary needs are required'),
    allergies: Yup.string(),
    preferences: Yup.string().required('Preferences are required'),
  });

  const formik = useFormik({
    initialValues: {
      id: null,
      name: '',
      age: '',
      gender: 'male',
      weight_kg: '',
      height_cm: '',
      requirements: '',
      allergies: '',
      preferences: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (values.id) {
          const selectedChild = children.find((child) => child.id === values.id);
    
          // Check if the values have changed
          const valuesChanged = Object.keys(values).some(
            (key) => values[key] !== selectedChild[key]
          );
    
          if (valuesChanged) {
            const { error } = await supabase
              .from('toddlers')
              .update({
                name: values.name,
                age: values.age,
                gender: values.gender,
                weight_kg: values.weight_kg,
                height_cm: values.height_cm,
                requirements: values.requirements,
                allergies: values.allergies,
                preferences: values.preferences,
              })
              .eq('id', values.id);
    
            if (error) {
              throw error;
            }
    
            showUpdateToast('edit');
          } else {
            showUpdateToast('nochanges');
          }
        } else {
          const { data: lastRecord } = await supabase
            .from('toddlers')
            .select('id')
            .order('id', { ascending: false })
            .limit(1);

          const newId = lastRecord.length > 0 ? lastRecord[0].id + 1 : 1;

          const { error } = await supabase
            .from('toddlers')
            .insert([{ ...values, userID: currentUserID, id: newId }]);

          if (error) {
            throw error;
          }

          showUpdateToast('add');
        }

        fetchData();
        handleCloseModal();
      } catch (error) {
        console.error('Error saving child:', error.message);
        toast.error('Error saving child details.');
      }
    },
  });

  const handleEdit = (childId) => {
    const selectedChild = children.find((child) => child.id === childId);
    formik.setValues({
      id: selectedChild.id,
      name: selectedChild.name,
      age: selectedChild.age,
      gender: selectedChild.gender,
      weight_kg: selectedChild.weight_kg,
      height_cm: selectedChild.height_cm,
      requirements: selectedChild.requirements,
      allergies: selectedChild.allergies,
      preferences: selectedChild.preferences,
    });
    setShowModal(true);
  };

  const handleDelete = (childId) => {
    setShowDeleteConfirm(true);
    const confirmDelete = async () => {
      try {
        const { error } = await supabase.from('toddlers').delete().eq('id', childId);
        if (error) {
          throw error;
        }
        fetchData();
        showUpdateToast('delete');
      } catch (error) {
        console.error('Error deleting child:', error.message);
        toast.error('Error deleting child details.');
      } finally {
        setShowDeleteConfirm(false);
      }
    };
    setDelCallback(() => confirmDelete);
  };  

  const handleCloseDeleteConfirmation = () => {
    setShowDeleteConfirm(false);
  };

  const handleAdd = () => {
    formik.resetForm();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const sortedChildren = [...children].sort((a, b) => a.name.localeCompare(b.name));

  const showUpdateToast = (origin) => {
    if(origin === 'delete'){
      toast('❌ Details deleted successfully!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } else if(origin === 'edit'){
        toast('✍️ Details edited successfully!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } else if(origin === 'add'){
      toast('✔️ New details added successfully!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } else if(origin === 'nochanges'){
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

  return (
    <div>
      <ToastContainer/>

      <div className="text-end">
        <Button variant="primary" onClick={handleAdd} className="mb-3">
          Add Child
        </Button>
      </div>

      {children.length === 0 ? (
        <div className="text-center mt-5">
          <h4>No profiles added yet.</h4>
        </div>
      ) : (
        <div className="d-flex flex-wrap justify-content-center">
          {sortedChildren.map((child) => (
            <Card key={child.id} style={{ width: '18rem', margin: '10px'}} className="mt-4">
              <Card.Body>
                <Card.Title style={{ color: '#ab86bf', fontSize: '24px' }}>{child.name}</Card.Title>
                <Card.Text>
                  <strong>Age:</strong> {child.age} <br />
                  <strong>Gender:</strong> {startCase(child.gender)} <br />
                  <strong>Weight:</strong> {child.weight_kg} kg <br />
                  <strong>Height:</strong> {child.height_cm} cm <br />
                  <strong>Dietary Needs:</strong> {child.requirements} <br />
                  <strong>Allergies:</strong> {child.allergies ? child.allergies : 'N/A'} <br />
                  <strong>Preferences:</strong> {child.preferences}
                </Card.Text>
              </Card.Body>
              <Card.Footer className="text-end">
                <Button variant="primary" onClick={() => handleEdit(child.id)} className="btn-sm">
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(child.id)} className="ms-2 btn-sm">
                  Delete
                </Button>
              </Card.Footer>
            </Card>
          ))}
        </div>
      )};

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{formik.values.id ? 'Edit Details' : 'Add Child'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                {...formik.getFieldProps('name')}
                isInvalid={formik.touched.name && formik.errors.name}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formAge" className="mt-3">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter age"
                {...formik.getFieldProps('age')}
                isInvalid={formik.touched.age && formik.errors.age}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.age}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formGender" className="mt-3">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                as="select"
                {...formik.getFieldProps('gender')}
                isInvalid={formik.touched.gender && formik.errors.gender}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">{formik.errors.gender}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formWeight" className="mt-3">
              <Form.Label>Weight (kg)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter weight in kg"
                {...formik.getFieldProps('weight_kg')}
                isInvalid={formik.touched.weight_kg && formik.errors.weight_kg}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.weight_kg}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formHeight" className="mt-3">
              <Form.Label>Height (cm)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter height in cm"
                {...formik.getFieldProps('height_cm')}
                isInvalid={formik.touched.height_cm && formik.errors.height_cm}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.height_cm}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formRequirements" className="mt-3">
              <Form.Label>Dietary Needs</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter requirements"
                {...formik.getFieldProps('requirements')}
                isInvalid={formik.touched.requirements && formik.errors.requirements}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.requirements}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formAllergies" className="mt-3">
              <Form.Label>Allergies</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter allergies"
                {...formik.getFieldProps('allergies')}
                isInvalid={formik.touched.allergies && formik.errors.allergies}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.allergies}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formPreferences" className="mt-3">
              <Form.Label>Preferences</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter preferences"
                {...formik.getFieldProps('preferences')}
                isInvalid={formik.touched.preferences && formik.errors.preferences}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.preferences}</Form.Control.Feedback>
            </Form.Group>

            <div className="text-center mt-3">
              <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                Close
              </Button>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteConfirm} onHide={handleCloseDeleteConfirmation}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete details of this child?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteConfirmation}>
            Cancel
          </Button>
          <Button variant="danger" onClick={delCallback}>
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserChildProfile;