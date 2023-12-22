import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar, NavDropdown, Image } from 'react-bootstrap';
import { supabase } from '../client';
import { useNavigate } from 'react-router-dom';

function AdminHeader() {
  const [currentUser, setCurrentUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, firstname, lastname, imageSrc')
          .eq('id', sessionStorage.getItem('userId'))
          .single();

        if (error) {
          console.error('Error fetching user data:', error.message);
          return;
        }

        setCurrentUser(data);
        console.log("currentUser: ", currentUser)
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchUserData();
    checkAuthentication();
  });

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const checkAuthentication = () => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      navigate('/');
    }
  };

  return (
    <>
      <Navbar expand="md" data-bs-theme="dark" className="sticky-top admin-header">
        <Container>
          <Navbar.Brand href="/a/users">
            <img
              alt="munchkin"
              src="/admin-header-logo.png"
              width="35"
              height="35"
              className="d-inline-block align-top"
            />{' '}
            munchkin
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="align-items-center aheader text-end">
              <Nav.Link href="/a/users">Users</Nav.Link>
              <Nav.Link href="/a/recipes">Recipes</Nav.Link>
              <Nav.Link href="/a/articles">Articles</Nav.Link>
              <Nav.Link href="/a/reviews">Reviews</Nav.Link>
              <Nav.Link href="/a/comments">Comments</Nav.Link>
              <Nav.Link href="/a/messages">Messages</Nav.Link>
              <Nav.Link href="/a/child-profiles">Child Profiles</Nav.Link>
            </Nav>
            <Nav className = "ms-auto align-items-center aheader text-end">
              <NavDropdown
                title={
                  <div className="d-flex align-items-center dropmenu">
                    <Image
                      src={currentUser.imageSrc}
                      alt="User Photo"
                      roundedCircle
                      width="30"
                      height="30"
                      className="mr-2"
                      style={{
                        borderRadius: '50%',
                        border: '2px solid #ab86bf',
                      }}
                    />
                    &nbsp; Admin {currentUser.firstname}
                  </div>
                }
                id="basic-nav-dropdown"
                className="ml-md-2 mr-auto "
              >
                <NavDropdown.Item href="/a/my-profile">My Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default AdminHeader;