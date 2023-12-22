import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faSolidHeart} from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { supabase } from '../client';

const URecipePreview = () => {
  const [filters, setFilters] = useState({
    foodType: 'all',
    mealTime: 'all',
    ingredientSearch: '',
    budgetRange: 'all',
  });

  const [recipes, setRecipes] = useState([]);
  const [allergies, setAllergies] = useState([]);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase.from('recipes').select('*');
      if (error) {
        throw error;
      }
      setRecipes(data.sort((a, b) => a.id - b.id));
    } catch (error) {
      console.error('Error fetching recipes:', error.message);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  const handleAllergyChange = (allergy) => {
    setAllergies((prevAllergies) =>
      prevAllergies.includes(allergy)
        ? prevAllergies.filter((a) => a !== allergy)
        : [...prevAllergies, allergy]
    );
  };

  const resetFilters = () => {
    setFilters({
      foodType: 'all',
      mealTime: 'all',
      ingredientSearch: '',
      budgetRange: 'all',
    });
    setAllergies([]);
  };

  const toggleFavorite = async (recipe) => {
    try {
      const { error } = await supabase
        .from('recipes')
        .update({ favorited: !recipe.favorited })
        .eq('id', recipe.id);
  
      if (error) {
        throw error;
      }

      const updatedRecipes = recipes.map((r) =>
        r.id === recipe.id ? { ...r, favorited: !r.favorited } : r
      );
      setRecipes(updatedRecipes);
  
      const action = recipe.favorited ? 'removed 💔 from' : 'added ❤️ to';
      toast(`Recipe ${action} favorites!`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } catch (error) {
      console.error('Error toggling favorite:', error.message);
    }
  };   

  const handleReadRecipe= (recipeId) => {
    sessionStorage.setItem('recipeId', recipeId);
    sessionStorage.setItem('prev', 'recipes');
    window.location.href = '/u/recipes/see-recipe';
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesFoodType = filters.foodType === 'all' || recipe.foodType === filters.foodType;
    const matchesMealTime = filters.mealTime === 'all' || recipe.mealTime === filters.mealTime;
    const matchesIngredient =
      filters.ingredientSearch === '' ||
      recipe.ingredients.toLowerCase().includes(filters.ingredientSearch.toLowerCase());
    const matchesBudgetRange = filters.budgetRange === 'all' || recipe.budgetRange === filters.budgetRange;
    const hasAllergies = !recipe.allergies || allergies.every((allergy) => !recipe.allergies.includes(allergy));
  
    return matchesFoodType && matchesMealTime && matchesIngredient && matchesBudgetRange && hasAllergies;
  });  

  return (
    <div className="recipes">
      <section className="featured-recipes mt-5">
        <Container>
          <Form className="mb-5">
            <Row>
              <Col xs={13} sm={7} md={4}>
                <Form.Group controlId="allergies">
                  <Form.Label class="f-label">Allergies</Form.Label>
                  <Row>
                    <Col>
                      <Form.Check
                        type="checkbox"
                        label="Nuts"
                        checked={allergies.includes('nuts')}
                        onChange={() => handleAllergyChange('nuts')}
                      />
                    </Col>
                    <Col>
                      <Form.Check
                        type="checkbox"
                        label="Dairy"
                        checked={allergies.includes('dairy')}
                        onChange={() => handleAllergyChange('dairy')}
                      />
                    </Col>
                    <Col>
                      <Form.Check
                        type="checkbox"
                        label="Gluten"
                        checked={allergies.includes('gluten')}
                        onChange={() => handleAllergyChange('gluten')}
                      />
                    </Col>
                    <Col>
                      <Form.Check
                        type="checkbox"
                        label="Seafood"
                        checked={allergies.includes('seafood')}
                        onChange={() => handleAllergyChange('seafood')}
                      />
                    </Col>
                  </Row>
                </Form.Group> 
              </Col>

              <Col xs={12} sm={6} md={3}>
                <Row>
                  <Col>
                    <Form.Group controlId="foodType">
                      <Form.Label class="f-label">Food Type</Form.Label>
                      <Form.Control
                        as="select"
                        value={filters.foodType}
                        onChange={(e) => handleFilterChange('foodType', e.target.value)}
                      >
                        <option value="all">All</option>
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
                    <Form.Group controlId="mealTime">
                      <Form.Label class="f-label">Meal Time</Form.Label>
                      <Form.Control
                        as="select"
                        value={filters.mealTime}
                        onChange={(e) => handleFilterChange('mealTime', e.target.value)}
                      >
                        <option value="all">All</option>
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="snack">Snack</option>
                        <option value="dinner">Dinner</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>

              <Col xs={11} sm={5} md={2}>
                <Form.Group controlId="ingredientSearch">
                  <Form.Label class="f-label">Ingredient</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Search ingredient"
                    value={filters.ingredientSearch}
                    onChange={(e) => handleFilterChange('ingredientSearch', e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} sm={6} md={3}>
                <Form.Group controlId="budgetRange">
                  <Form.Label class="f-label">Budget Range</Form.Label>
                  <Row>
                    <Col xs={8}>
                      <Form.Control
                        as="select"
                        value={filters.budgetRange}
                        onChange={(e) => handleFilterChange('budgetRange', e.target.value)}
                      >
                        <option value="all">All</option>
                        <option value="₱50 - ₱150">₱50 - ₱150</option>
                        <option value="₱150 - ₱300">₱150 - ₱300</option>
                        <option value="₱200 - ₱400">₱200 - ₱400</option>
                      </Form.Control>
                    </Col>
                    <Col xs={4}>
                      <Button variant="secondary" onClick={resetFilters}>
                        Reset
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>
              </Col>

            </Row>
          </Form>

          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />

          <Row xs={1} sm={2} md={3} lg={3}>
            {filteredRecipes.map((recipe) => (
              <Col key={recipe.id}>
                <Card className="recipes mb-4">
                  {recipe.featured && <div className="featured-tag text-end">Featured</div>}
                  <Card.Img
                    className="img-fluid"
                    variant="top"
                    src={recipe.imageSrc}
                    alt={recipe.title}
                  />
                  <Card.Body>
                    <Card.Title>{recipe.title}</Card.Title>
                    <Card.Text>{recipe.description}</Card.Text>
                    <Row>
                      <Col>
                        <Button variant="primary" onClick={() => handleReadRecipe(recipe.id)}>
                          View Recipe
                        </Button>
                      </Col>
                      <Col className="text-end">
                        <a href="#!" onClick={() => toggleFavorite(recipe)}>
                          <FontAwesomeIcon
                            icon={recipe.favorited ? faSolidHeart : faHeart}
                            size="lg"
                          />
                        </a>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default URecipePreview;