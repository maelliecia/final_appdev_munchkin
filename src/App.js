import './App.css';
import React, { useEffect } from 'react';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import { SkeletonTheme } from "react-loading-skeleton";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import About from './views/About';
import Recipes from './views/Recipes';
import Contact from './views/Contact';
import Home from './views/Home';
import ChildHealth from './views/ChildHealth';
import GenReadRecipe from './views/GenReadRecipe';
import GenReadArticle from './views/GenReadArticle';

import SignUp from './views/SignUp';
import LogIn from './views/LogIn';
import NotFound from './views/NotFound';

import UserRecipes from './views/User/UserRecipes';
import UserFavorites from './views/User/UserFavorites';
import UserChildHealth from './views/User/UserChildHealth';
import UserAbout from './views/User/UserAbout';
import UserContact from './views/User/UserContact';
import UserProfile from './views/User/UserProfile';
import ChildProfile from './views/User/ChildProfile';
import ReadRecipe from './views/User/ReadRecipe';
import ReadArticle from './views/User/ReadArticle';

import AdminRecipes from './views/Admin/AdminRecipes';
import AdminArticles from './views/Admin/AdminArticles';
import AdminUsers from './views/Admin/AdminUsers';
import AdminComments from './views/Admin/AdminComments';
import AdminReviews from './views/Admin/AdminReviews';
import AdminMessages from './views/Admin/AdminMessages';
import AdminChildProfs from './views/Admin/AdminChildProfs';
import AdminProfile from './views/Admin/AdminProfile';

function App() {
  config.autoAddCss = false;

  useEffect(() => {
    const pathname = window.location.pathname;
    let pageTitle = 'munchkin';
  
    switch (pathname) {
      case '/':
        pageTitle = 'Home';
        break;
      case '/home':
        pageTitle = 'Home';
        break;
      case '/recipes/':
        pageTitle = 'Recipes';
        break;
      case '/recipes/see-recipe':
        pageTitle = 'View Recipe';
        break;
      case '/child-health':
        pageTitle = 'Child Health';
        break;
      case '/child-health/read-article':
        pageTitle = 'Read Article';
        break;
      case '/signup':
        pageTitle = 'Sign Up';
        break;
      case '/login':
        pageTitle = 'Log In';
        break;
      case '/about':
        pageTitle = 'About Us';
        break;
      case '/contact':
        pageTitle = 'Contact Us';
        break;
      case '/u/recipes':
        pageTitle = 'Recipes';
        break;
      case '/u/favorites':
        pageTitle = 'Favorites';
        break;
      case '/u/child-health':
        pageTitle = 'Child Health';
        break;
      case '/u/about':
        pageTitle = 'About Us';
        break;
      case '/u/contact':
        pageTitle = 'Contact Us';
        break;
      case '/u/recipes/see-recipe':
        pageTitle = 'View Recipe';
        break;
      case '/u/child-health/read-article':
        pageTitle = 'Read Article';
        break;
      case '/u/my-profile':
        pageTitle = 'My Profile';
        break;
      case '/u/child-profile':
        pageTitle = 'Child Profile';
        break;
      case '/a/recipes':
        pageTitle = 'Recipes';
        break;
      case '/a/articles':
        pageTitle = 'Articles';
        break;
      case '/a/users':
        pageTitle = 'Users';
        break;
      case '/a/comments':
        pageTitle = 'Comments';
        break;
      case '/a/reviews':
        pageTitle = 'Reviews';
        break;
      case '/a/messages':
        pageTitle = 'Messages';
        break;
      case '/a/child-profiles':
        pageTitle = 'Child Profiles';
        break;
      case '/a/my-profile':
        pageTitle = 'My Profile';
        break;
      default:
        pageTitle = 'Not Found';
        break;
    }
  
    document.title = pageTitle + " | munchkin";
  }, []);  
  
  return (
    <div className="App">
      <SkeletonTheme baseColor="#FDDFE1" highlightColor="#E86E75">
        <BrowserRouter>
          <Routes>
            
            {/* Non-user pages */}
            <Route index element = {<Home />} />
            <Route path="/home" element = {<Home />} />
            <Route path="/recipes" element = {<Recipes />} />
            <Route path="/recipes/see-recipe" element = {<GenReadRecipe/>} />
            <Route path="/child-health" element = {<ChildHealth />} />
            <Route path="/child-health/read-article" element = {<GenReadArticle/>} />
            <Route path="/signup" element = {<SignUp />} />
            <Route path="/login" element = {<LogIn />} />
            <Route path="/about" element = {<About />} />
            <Route path="/contact" element = {<Contact />} />            

            {/* User */}
            <Route path="/u/recipes" element = {<UserRecipes />} />
            <Route path="/u/favorites" element = {<UserFavorites />} />
            <Route path="/u/child-health" element = {<UserChildHealth />} />
            <Route path="/u/about" element = {<UserAbout />} />
            <Route path="/u/contact" element = {<UserContact />} />
            <Route path="/u/recipes/see-recipe" element = {<ReadRecipe/>} />
            <Route path="/u/child-health/read-article" element = {<ReadArticle/>} />
            <Route path="/u/my-profile" element = {<UserProfile />} />
            <Route path="/u/child-profile" element = {<ChildProfile />} />

            {/* Admin */}
            <Route path="/a/recipes" element = {<AdminRecipes/>} />
            <Route path="/a/articles" element = {<AdminArticles/>} />
            <Route path="/a/users" element = {<AdminUsers/>} />
            <Route path="/a/comments" element = {<AdminComments/>} />
            <Route path="/a/reviews" element = {<AdminReviews/>} />
            <Route path="/a/messages" element = {<AdminMessages/>} />
            <Route path="/a/child-profiles" element = {<AdminChildProfs/>} />
            <Route path="/a/my-profile" element = {<AdminProfile/>} />
            
            <Route path="*" element = {<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SkeletonTheme>
    </div>
  );
}

export default App;
