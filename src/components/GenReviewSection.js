import React, { useState, useEffect } from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import { supabase } from '../client';

const GenReviewSection = ({ reviews = [] }) => {
  const [usernames, setUsernames] = useState({});

  useEffect(() => {
    const fetchUsernames = () => {
      const userIds = reviews.map((review) => review.userID);
      supabase
        .from('users')
        .select('id, username')
        .in('id', userIds)
        .then(({ data: usersData, error: usersError }) => {
          if (usersError) {
            throw usersError;
          }

          const usernameMap = {};
          usersData.forEach((user) => {
            usernameMap[user.id] = user.username;
          });

          setUsernames(usernameMap);
        })
        .catch((error) => {
          console.error('Error fetching usernames:', error.message);
        });
    };

    fetchUsernames();
  }, [reviews]);

  return (
    <Container className="review-section">
      <h2>Reviews</h2>
      
      <ListGroup>
      {reviews.map((review, index) => (
          <ListGroup.Item key={index}>
              <>
                <span>
                  <strong>{usernames[review.userID]} </strong>
                  <span style={{ fontSize: '0.8rem', color: '#888' }}>
                    {new Date(review.dateUpdated).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                    {' '}
                    {new Date(review.dateUpdated).toLocaleDateString('en-US', {
                      month: '2-digit',
                      day: '2-digit',
                      year: 'numeric',
                    })}
                  </span>
                </span>

                <p className="ms-3">
                  <strong>Rating: </strong>{review.rating}/10
                  <br />
                  {review.review}
                </p>
              </>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default GenReviewSection;