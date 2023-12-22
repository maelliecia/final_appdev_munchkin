import React, { useEffect, useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { supabase } from '../client';

export default function NotFound() {
  const userId = sessionStorage.getItem('userId');
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const fetchUserType = async () => {
      if (userId) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('type')
            .eq('id', userId)
            .single();

          if (error) {
            throw error;
          }

          setUserType(data ? data.type : null);
        } catch (error) {
          console.error('Error fetching user data:', error.message);
        }
      }
    };

    fetchUserType();
  }, [userId]);

  return (
    <>
      <div className="align-items-center align-middle">
        <Container className="text-center mt-5">
          <h1 className="display-4">404 - Page Not Found</h1>

          <p className="lead">The page you are looking for does not exist.</p>

          <Link to={userId ? (userType === 'user' ? '/u/recipes' : (userType === 'admin' ? '/a/recipes' : '/home')) : '/home'}>
            <Button variant="primary">{userId ? 'Go to Recipes' : 'Go to Home'}</Button>
          </Link>
        </Container>
      </div>
    </>
  );
}