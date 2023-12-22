import React, { useState, useEffect } from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import { supabase } from '../client';

const GenArticleCommentSection = ({ comments = [] }) => {
  const [usernames, setUsernames] = useState({});

  useEffect(() => {
    const fetchUsernames = () => {
      const userIds = comments.map((comment) => comment.userID);
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
  }, [comments]);

  return (
    <Container className="comment-section">
      <h2>Comments</h2>
      
      <ListGroup>
      {comments.map((comment, index) => (
          <ListGroup.Item key={index}>
              <>
                <span>
                  <strong>{usernames[comment.userID]} </strong>
                  <span style={{ fontSize: '0.8rem', color: '#888' }}>
                    {new Date(comment.dateUpdated).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                    {' '}
                    {new Date(comment.dateUpdated).toLocaleDateString('en-US', {
                      month: '2-digit',
                      day: '2-digit',
                      year: 'numeric',
                    })}
                  </span>
                </span>

                <p className="ms-3">
                  <br />
                  {comment.comment}
                </p>
              </>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default GenArticleCommentSection;