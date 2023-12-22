import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import { Table, Button, Form, Row, Col, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import TableEmpty from './TableEmpty';

const recipeSchema = Yup.object().shape({
  title: Yup.string().required('Title'),
  imageSrc: Yup.string().required('Image URL'),
  description: Yup.string().required('Description'),
  foodType: Yup.string().required('Food Type'),
  mealTime: Yup.string().required('Meal Time'),
  ingredients: Yup.string().required('Ingredient Keywords'),
  budgetRange: Yup.string().required('Budget Range'),
  allergies: Yup.string(),
  author: Yup.string().required('Author'),
  ingredient: Yup.string().required('Ingredients'),
  instructions: Yup.string().required('Instructions'),
});

const TableRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    imageSrc: '/recipes/placeholder.png',
    description: '',
    featured: false,
    favorited: false,
    foodType: '',
    mealTime: '',
    ingredients: '',
    budgetRange: '',
    allergies: '',
    author: '',
    datePublished: new Date().toLocaleString(),
    ingredient: '',
    instructions: '',
  });
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const isEditing = !!editingRecipe;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [delCallback, setDelCallback] = useState(null);

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase.from('recipes').select('*').order('id', { ascending: true });
      if (error) {
        throw error;
      }
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes:', error.message);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    setNewRecipe((prevRecipe) => ({ ...prevRecipe, [name]: inputValue }));
  };  

  const handleToggleModal = (recipe = null) => {
    setEditingRecipe(recipe);
    setNewRecipe(
      recipe || {
        title: '',
        imageSrc: '/recipes/placeholder.png',
        description: '',
        featured: false,
        favorited: false,
        foodType: '',
        mealTime: '',
        ingredients: '',
        budgetRange: '',
        allergies: '',
        author: '',
        datePublished: new Date().toLocaleString(),
        ingredient: '',
        instructions: '',
      }
    );
    setShowModal(!showModal);
  };
  
  const handleSaveRecipe = async () => {
    try {
      await recipeSchema.validate(newRecipe, { abortEarly: false });

      if (isEditing) {
        const { data: currentRecipe } = await supabase
          .from('recipes')
          .select('*')
          .eq('id', newRecipe.id)
          .single();
  
        const hasChanges = JSON.stringify(currentRecipe) !== JSON.stringify(newRecipe);

        if (hasChanges) {
          const { data, error } = await supabase
            .from('recipes')
            .update(newRecipe)
            .eq('id', newRecipe.id);
  
          if (error) {
            throw error;
          }
  
          setRecipes((prevRecipes) =>
            prevRecipes.map((recipe) => (recipe.id === (data && data[0]?.id) ? data[0] : recipe))
            );

          setEditingRecipe(null);
          showUpdateToast('edit');
          fetchRecipes();
        } else {
          showUpdateToast('nochanges');
        }
      } else {
        const { data: lastRecipe } = await supabase
        .from('recipes')
        .select('id')
        .order('id', { ascending: false })
        .limit(1);

        const lastId = lastRecipe && lastRecipe.length > 0 ? lastRecipe[0].id : 0;
        const newId = lastId + 1;

        const recipeWithNewId = { ...newRecipe, id: newId };
        const { data, error } = await supabase.from('recipes').insert([recipeWithNewId]);

        if (error) {
        throw error;
        }

        setRecipes((prevRecipes) =>
            prevRecipes.map((recipe) => (recipe.id === (data && data[0]?.id) ? data[0] : recipe))
        );
        
        showUpdateToast('add');
        fetchRecipes();
  
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving recipe:', error.message);

      if (error.errors && error.errors.length > 0) {
        const requiredFields = error.errors
          .join(', ');
  
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
  
  const handleDeleteRecipe = async (id) => {
    setShowDeleteConfirm(true);
    const confirmDelete = async () => {
        try {
        const { error } = await supabase.from('recipes').delete().eq('id', id);
        if (error) {
            throw error;
        }
        setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== id));
        showUpdateToast('delete');
        } catch (error) {
        console.error('Error deleting recipe:', error.message);
        } finally {
            setShowDeleteConfirm(false);
        }
    } 
    setDelCallback(() => confirmDelete);
  };

  const showUpdateToast = (origin) => {
    if(origin === 'delete'){
      toast('❌ Recipe deleted successfully!', {
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
        toast('✍️ Recipe edited successfully!', {
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
      toast('✔️ New recipe added successfully!', {
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

  const handleCloseDeleteConfirmation = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="admin">
      {recipes.length > 0 ? (
        <>
          <ToastContainer/>
          <div className="text-end">
              <Button variant="primary" onClick={() => handleToggleModal()} className="mb-3">
                  Create New Recipe
              </Button>
          </div>

          <Modal show={showModal} onHide={handleToggleModal}>
              <Modal.Header closeButton>
                  <Modal.Title>{isEditing ? 'Edit Recipe' : 'Create New Recipe'}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <Form>
                  <Row>
                      <Col>
                          <Form.Group controlId="formTitle" >
                              <Form.Label>Title:</Form.Label>
                              <Form.Control
                                  type="text"
                                  placeholder="Enter title"
                                  name="title"
                                  value={newRecipe.title}
                                  onChange={handleInputChange}
                                  required
                              />
                          </Form.Group>
                      </Col>
                      <Col>
                          <Form.Group controlId="formImage">
                              <Form.Label>Image URL:</Form.Label>
                              <Form.Control
                                  type="text"
                                  placeholder="Enter image URL"
                                  name="imageSrc"
                                  value={newRecipe.imageSrc}
                                  onChange={handleInputChange}
                                  required
                              />
                          </Form.Group>
                      </Col>
                  </Row>
                  <Form.Group controlId="formDescription" className="mt-3">
                      <Form.Label>Description:</Form.Label>
                      <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Enter description"
                          name="description"
                          value={newRecipe.description}
                          onChange={handleInputChange}
                          required
                      />
                  </Form.Group>
                  <Row className="mt-3">
                      <Col>
                          <Form.Group controlId="formFeatured">
                              <Form.Check
                              type="checkbox"
                              label="Featured"
                              name="featured"
                              checked={newRecipe.featured}
                              onChange={handleInputChange}
                              />
                          </Form.Group>
                      </Col>
                  </Row>
                  <Row className="mt-3">
                      <Col>
                          <Form.Group controlId="formFoodType">
                              <Form.Label>Food Type:</Form.Label>
                              <Form.Control
                                  as="select"
                                  name="foodType"
                                  value={newRecipe.foodType}
                                  onChange={handleInputChange}
                                  required
                              >
                                  <option value="" disabled>Select Food Type</option>
                                  <option value="soup">Soup</option>
                                  <option value="meat">Meat</option>
                                  <option value="vegetables">Vegetables</option>
                                  <option value="dessert">Dessert</option>
                                  <option value="seafood">Seafood</option>
                                  <option value="pasta">Pasta</option>
                                  <option value="grains">Grains</option>
                              </Form.Control>
                          </Form.Group>
                      </Col>

                      <Col>
                          <Form.Group controlId="formMealTime">
                              <Form.Label>Meal Time:</Form.Label>
                              <Form.Control
                                  as="select"
                                  name="mealTime"
                                  value={newRecipe.mealTime}
                                  onChange={handleInputChange}
                                  required
                              >
                                  <option value="" disabled>Select Meal Time</option>
                                  <option value="breakfast">Breakfast</option>
                                  <option value="lunch">Lunch</option>
                                  <option value="snack">Snack</option>
                                  <option value="dinner">Dinner</option>
                              </Form.Control>
                          </Form.Group>

                      </Col>
                  </Row>
                      <Form.Group controlId="formIngredients" className="mt-3">
                      <Form.Label>Ingredient Keywords:</Form.Label>
                      <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Enter keywords separated by comma"
                          name="ingredients"
                          value={newRecipe.ingredients}
                          onChange={handleInputChange}
                          required
                      />
                      </Form.Group>

                      <Form.Group controlId="formAllergies" className="mt-3" >
                      <Form.Label>Allergies:</Form.Label>
                      <Form.Control
                          type="text"
                          placeholder="Enter allergies if applicable"
                          name="allergies"
                          value={newRecipe.allergies}
                          onChange={handleInputChange}
                      />
                      </Form.Group>
                      

                <Row>
                  <Col>
                      <Form.Group controlId="formBudgetRange" className="mt-3">
                      <Form.Label>Budget Range:</Form.Label>
                      <Form.Control
                          as="select"
                          name="budgetRange"
                          value={newRecipe.budgetRange}
                          onChange={handleInputChange}
                          required
                      >
                          <option value="" disabled>Select Budget Range</option>
                          <option value="₱50 - ₱150">₱50 - ₱150</option>
                          <option value="₱150 - ₱300">₱150 - ₱300</option>
                          <option value="₱200 - ₱400">₱200 - ₱400</option>
                      </Form.Control>
                      </Form.Group>
                  </Col>
                  <Col>
                      <Form.Group controlId="formAuthor" className="mt-3">
                      <Form.Label>Author:</Form.Label>
                      <Form.Control
                          type="text"
                          placeholder="Enter author"
                          name="author"
                          value={newRecipe.author}
                          onChange={handleInputChange}
                          required
                      />
                      </Form.Group>
                  </Col>
                </Row>

                      <Form.Group controlId="formInstructions" className="mt-3">
                      <Form.Label>Ingredients:</Form.Label>
                      <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Enter complete list of ingredients"
                          name="ingredient"
                          value={newRecipe.ingredient}
                          onChange={handleInputChange}
                          required
                      />
                      </Form.Group>

                      <Form.Group controlId="formInstructions" className="mt-3">
                      <Form.Label>Instructions:</Form.Label>
                      <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Enter instructions"
                          name="instructions"
                          value={newRecipe.instructions}
                          onChange={handleInputChange}
                          required
                      />
                      </Form.Group>
                  </Form>
              </Modal.Body>
              <Modal.Footer>
                  <Button variant="secondary" onClick={handleToggleModal}>
                  Close
                  </Button>
                  <Button variant="primary" onClick={handleSaveRecipe}>
                  {isEditing ? 'Update Recipe' : 'Create Recipe'}
                  </Button>
              </Modal.Footer>
          </Modal>

        <Table responsive striped bordered hover variant="light" className="table-auto mb-5">
          <thead>
            <tr className="text-center align-items-center">
              <th>ID</th>
              <th>Title</th>
              <th>Image</th>
              <th>Description</th>
              <th>Featured</th>
              <th>Food Type</th>
              <th>Meal Time</th>
              <th>Ingredient Keywords</th>
              <th>Budget Range</th>
              <th>Allergies</th>
              <th>Author</th>
              <th>Date Published</th>
              <th>Ingredients</th>
              <th>Instructions</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((recipe) => (
              <tr key={recipe.id}>
                <td>{recipe.id}</td>
                <td><strong>{recipe.title}</strong></td>
                <td>{recipe.imageSrc}</td>
                <td>{recipe.description}</td>
                <td>{recipe.featured ? 'Yes' : 'No'}</td>
                <td>{recipe.foodType}</td>
                <td>{recipe.mealTime}</td>
                <td>{recipe.ingredients}</td>
                <td>{recipe.budgetRange}</td>
                <td>{recipe.allergies ? recipe.allergies : 'N/A'}</td>
                <td>{recipe.author}</td>
                <td>{new Date(recipe.datePublished).toLocaleString()}</td>
                <td>{recipe.ingredient}</td>
                <td>{recipe.instructions}</td>
                <td>
                <div>
                  <Button style={{ width: '80px'}} className="mb-2" variant="primary" onClick={() => handleToggleModal(recipe)}>
                      Edit
                  </Button>
                  <Button style={{ width: '80px' }} variant="danger" onClick={() => handleDeleteRecipe(recipe.id)}>
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
          <Modal.Body>Are you sure you want to delete this recipe?</Modal.Body>
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

export default TableRecipes;
