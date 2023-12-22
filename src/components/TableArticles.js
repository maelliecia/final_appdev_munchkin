import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import { Table, Button, Form, Row, Col, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import TableEmpty from './TableEmpty';

const articleSchema = Yup.object().shape({
  title: Yup.string().required('Title'),
  imageSrc: Yup.string().required('Image URL'),
  summary: Yup.string().required('Summary'),
  category: Yup.string().required('Category'),
  content: Yup.string().required('Content'),
  author: Yup.string().required('Author'),
  authorSpecialty: Yup.string().required('Author Specialty'),
});

const TableArticles = () => {
  const [articles, setArticles] = useState([]);
  const [newArticle, setNewArticle] = useState({
    title: '',
    imageSrc: '/articles/placeholder.png',
    summary: '',
    category: '',
    liked: false,
    content: '',
    author: '',
    datePublished: new Date().toLocaleString(),
    authorSpecialty: '',
  });
  const [editingArticle, setEditingArticle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const isEditing = !!editingArticle;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [delCallback, setDelCallback] = useState(null);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase.from('articles').select('*').order('id', { ascending: true });
      if (error) {
        throw error;
      }
      setArticles(data);
    } catch (error) {
      console.error('Error fetching articles:', error.message);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewArticle((prevArticle) => ({ ...prevArticle, [name]: value }));
  };

  const handleToggleModal = (article = null) => {
    setEditingArticle(article);
    setNewArticle(
      article || {
        title: '',
        imageSrc: '/articles/placeholder.png',
        summary: '',
        category: '',
        liked: false,
        content: '',
        author: '',
        datePublished: new Date().toLocaleString(),
        authorSpecialty: '',
      }
    );
    setShowModal(!showModal);
  };

  const handleSaveArticle = async () => {
    try {
      await articleSchema.validate(newArticle, { abortEarly: false });

      if (isEditing) {
        const { data: currentArticle } = await supabase
          .from('articles')
          .select('*')
          .eq('id', newArticle.id)
          .single();

        const hasChanges = JSON.stringify(currentArticle) !== JSON.stringify(newArticle);

        if (hasChanges) {
          const { data, error } = await supabase
            .from('articles')
            .update(newArticle)
            .eq('id', newArticle.id);

          if (error) {
            throw error;
          }

          setArticles((prevArticles) =>
            prevArticles.map((article) => (article.id === (data && data[0]?.id) ? data[0] : article))
          );

          setEditingArticle(null);
          showUpdateToast('edit');
          fetchArticles();
        } else {
          showUpdateToast('nochanges');
        }
      } else {
        const { data: lastArticle } = await supabase
          .from('articles')
          .select('id')
          .order('id', { ascending: false })
          .limit(1);

        const lastId = lastArticle && lastArticle.length > 0 ? lastArticle[0].id : 0;
        const newId = lastId + 1;
        const articleWithNewId = { ...newArticle, id: newId };

        const { data, error } = await supabase.from('articles').insert([articleWithNewId]);

        if (error) {
          throw error;
        }

        setArticles((prevArticles) =>
          prevArticles.map((article) => (article.id === (data && data[0]?.id) ? data[0] : article))
        );

        showUpdateToast('add');
        fetchArticles();
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving article:', error.message);

      if (error.errors && error.errors.length > 0) {
        const requiredFields = error.errors.join(', ');

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

  const handleDeleteArticle = async (id) => {
    setShowDeleteConfirm(true);
    const confirmDelete = async () => {
      try {
        const { error } = await supabase.from('articles').delete().eq('id', id);
        if (error) {
          throw error;
        }
        setArticles((prevArticles) => prevArticles.filter((article) => article.id !== id));
        showUpdateToast('delete');
      } catch (error) {
        console.error('Error deleting article:', error.message);
      } finally {
        setShowDeleteConfirm(false);
      }
    };
    setDelCallback(() => confirmDelete);
  };

  const showUpdateToast = (origin) => {
    if (origin === 'delete') {
      toast('❌ Article deleted successfully!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } else if (origin === 'edit') {
      toast('✍️ Article edited successfully!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } else if (origin === 'add') {
      toast('✔️ New article added successfully!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } else if (origin === 'nochanges') {
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
      {articles.length > 0 ? (
        <>
          <ToastContainer />

          <div className="text-end">
            <Button variant="primary" onClick={() => handleToggleModal()} className="mb-3">
              Create New Article
            </Button>
          </div>

          <Modal show={showModal} onHide={handleToggleModal}>
            <Modal.Header closeButton>
              <Modal.Title>{isEditing ? 'Edit Article' : 'Create New Article'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Row>
                  <Col>
                    <Form.Group controlId="formTitle">
                      <Form.Label>Title:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter title"
                        name="title"
                        value={newArticle.title}
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
                        value={newArticle.imageSrc}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group controlId="formSummary" className="mt-3">
                  <Form.Label>Summary:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter summary"
                    name="summary"
                    value={newArticle.summary}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formCategory" className="mt-3">
                    <Form.Label>Category:</Form.Label>
                    <Form.Control
                    as="select"
                    name="category"
                    value={newArticle.category}
                    onChange={handleInputChange}
                    required
                    >
                    <option value="" disabled>Select Category</option>
                    <option value="Mental Health">Mental Health</option>
                    <option value="Physical Health">Physical Health</option>
                    <option value="Parent-Child Relationships">Parent-Child Relationships</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="formContent" className="mt-3">
                  <Form.Label>Content:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter content"
                    name="content"
                    value={newArticle.content}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formAuthor" className="mt-3">
                    <Form.Label>Author:</Form.Label>
                    <Form.Control
                    type="text"
                    placeholder="Enter author"
                    name="author"
                    value={newArticle.author}
                    onChange={handleInputChange}
                    required
                    />
                </Form.Group>
                <Form.Group controlId="formAuthorSpecialty" className="mt-3">
                  <Form.Label>Author Specialty:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter author specialty"
                    name="authorSpecialty"
                    value={newArticle.authorSpecialty}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleToggleModal}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSaveArticle}>
                {isEditing ? 'Update Article' : 'Create Article'}
              </Button>
            </Modal.Footer>
          </Modal>

          <Table responsive striped bordered hover variant="light" className="table-auto mb-5">
            <thead>
              <tr className="text-center align-items-center">
                <th>ID</th>
                <th>Title</th>
                <th>Image</th>
                <th>Summary</th>
                <th>Category</th>
                <th>Content</th>
                <th>Author</th>
                <th>Author Specialty</th>
                <th>Date Published</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id}>
                  <td>{article.id}</td>
                  <td>
                    <strong>{article.title}</strong>
                  </td>
                  <td>{article.imageSrc}</td>
                  <td>{article.summary}</td>
                  <td>{article.category}</td>
                  <td>{article.content}</td>
                  <td>{article.author}</td>
                  <td>{article.authorSpecialty}</td>
                  <td>{new Date(article.datePublished).toLocaleString()}</td>
                  <td>
                    <div>
                      <Button style={{ width: '80px' }} className="mb-2" variant="primary" onClick={() => handleToggleModal(article)}>
                        Edit
                      </Button>
                      <Button style={{ width: '80px' }} variant="danger" onClick={() => handleDeleteArticle(article.id)}>
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
            <Modal.Body>Are you sure you want to delete this article?</Modal.Body>
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

export default TableArticles;