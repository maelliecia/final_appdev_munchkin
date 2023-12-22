import React, { useEffect, useState } from 'react';
import UserLayout from '../../components/layouts/UserLayout';
import { Container } from 'react-bootstrap';
import RecipeInteraction from '../../components/RecipeInteraction';
import Loading from '../../components/Loading';
import { supabase } from '../../client';
import { Link } from 'react-router-dom';

export default function ReadRecipe() {
    const [recipe, setRecipe] = useState(null);
    const recipeId = sessionStorage.getItem('recipeId');
    const prev = sessionStorage.getItem('prev');

    useEffect(() => {
        
        const fetchRecipeData = async () => {
            const { data, error } = await supabase
                .from('recipes')
                .select('*')
                .eq('id', recipeId)
                .single();

            if (error) {
                console.error('Error fetching recipe data:', error.message);
            } else {
                setRecipe(data);
            }
        };

        fetchRecipeData();
    }, [recipeId]);

    if (!recipe) {
        return <UserLayout><Loading /></UserLayout>;
    }

    return (
        <UserLayout>
            <div className="view-recipe">
                <Container>
                    <Link to={`/u/${prev}`}>{'< Back'}</Link>
                    <h1>{recipe.title}</h1>

                    <div className="recipe-details">
                        <img src={recipe.imageSrc} alt={recipe.title} className="recipe-image" />
                        <div className="text-center">
                                <h5>By {recipe.author}<br/>
                                    <span style={{ fontSize: '0.8rem', color: '#888' }}>
                                        {'Posted '}
                                        {new Date(recipe.datePublished).toLocaleDateString('en-US', {
                                        month: '2-digit',
                                        day: '2-digit',
                                        year: 'numeric',
                                        })}
                                        {' at '}
                                        {new Date(recipe.datePublished).toLocaleTimeString('en-US', {
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true,
                                        })}
                                    </span>
                                </h5>
                            </div>

                        <h2>Ingredients</h2>
                        <ul>
                            {recipe.ingredient && recipe.ingredient.split('\n').map((paragraph, index) => (
                                <li>
                                    <React.Fragment key={index}>
                                        {paragraph}
                                        <br />
                                    </React.Fragment>
                                </li>
                            ))}
                        </ul>

                        <h2>Instructions</h2>
                        <ol>
                            {recipe.instructions && recipe.instructions.split('\n').map((paragraph, index) => (
                                <li>
                                    <React.Fragment key={index}>
                                        {paragraph}
                                        <br />
                                    </React.Fragment>
                                </li>
                            ))}
                        </ol>

                        <div className="text-end">
                            <p className="recipe-tag">{recipe.foodType}</p>
                            <p className="recipe-tag">{recipe.mealTime}</p>
                            <p className="recipe-tag">{recipe.budgetRange}</p>
                            {recipe.allergies && (
                                <p className="allergy-tag">contains {recipe.allergies}</p>
                            )}
                        </div>
                    </div>
                    
                    <RecipeInteraction id={recipe.id} />
                </Container>
            </div>
        </UserLayout>
    );
}
