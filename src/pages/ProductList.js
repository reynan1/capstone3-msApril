import { useState, useEffect, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import Swal from "sweetalert2";
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import { Navigate } from 'react-router-dom'

import UserContext from "../UserContext";

const ProductList = function () {
  const { user, userAll } = useContext(UserContext);

  const [allProducts, setAllProducts] = useState([]);

  const [productId, setProductId] = useState("");
  const [productCategories, setProductCategories] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [description, setDescription] = useState("");



  const [isActive, setIsActive] = useState(false);

  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);

  const addProductOpen = () => setModalAdd(true);
  const addProductClose = () => setModalAdd(false);


  const openEdit = (id) => {

    setProductId(id)
    fetch(`${process.env.REACT_APP_ECOMMERCE_URL}/products/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data.category + " data categories")
        setProductCategories(data.category);
        setProductName(data.productName);
        setDescription(data.description);
        setProductPrice(data.price);

      });

    setModalEdit(true)
  };

  const closeEdit = () => {

    setProductCategories('');
    setProductName('');
    setDescription('')
    setProductPrice('');

    setModalEdit(false);
  };

  const fetchPage = () => {
    fetch(`${process.env.REACT_APP_ECOMMERCE_URL}/products/all`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {

      });
  }

  useEffect(() => {
    fetchPage();


  }, [])



  /* GET ALL PRODUCTS */
  const fetchData = () => {
    fetch(`${process.env.REACT_APP_ECOMMERCE_URL}/products/all`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {

        console.log(data)

        setAllProducts(data.map(products => {
          console.log(products.isActive)
          return (
            <>

              <tr key={products._id}>
                <td>{products._id}</td>
                <td>{products.category}</td>
                <td>{products.productName}</td>
                <td>{products.price}</td>
                <td>{products.isActive.toString()}</td>
                <td>
                  {(products.isActive)
                    ?
                    <Button variant="danger" size="sm" onClick={() => archive(products._id, products.name)}>Archive</Button>
                    :
                    <>
                      <Button variant="success" className="mx-1" size="sm" onClick={() => unarchive(products._id, products.name)}>Unarchive</Button>
                      <Button variant="secondary" className="mx-1" size="sm" onClick={() => openEdit(products._id)}   >Edit</Button>

                    </>}

                </td>
              </tr>
            </>
          )
        }));


      });
  }

  useEffect(() => {
    fetchData();


  }, [])

  /* ARCHIVE PRODUCT */
  const archive = (id, name) => {
    console.log(id);
    console.log(name);
    fetch(`${process.env.REACT_APP_ECOMMERCE_URL}/products/${id}/archive`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          isActive: false
        })
      })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data) {
          Swal.fire({
            title: "PRODUCT ARCHIVING SUCCESS!",
            icon: "success",
            text: `The product is now in archive`
          });

          fetchData();
        } else {
          Swal.fire({
            title: "Archive Unsuccessful",
            icon: "error",
            text: "Something went wrong. Please try again later"
          })
        }
      })
  }



  const unarchive = (id, name) => {
    console.log(id);
    console.log(name);
    fetch(`${process.env.REACT_APP_ECOMMERCE_URL}/products/${id}/unarchive`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          isActive: true
        })

      })
      .then(res => res.json())
      .then(data => {
        console.log(data);

        if (data) {
          Swal.fire({
            title: "Unarchive Successful",
            icon: "success",
            text: `The product is now inactive`
          });

          fetchData();
        } else {
          Swal.fire({
            title: "Unarchive Unsuccessful",
            icon: "error",
            text: "Something went wrong. Please try again later"
          })
        }
      })
  }

  useEffect(() => {
    fetchData();


  }, [])



  if (user.id === null) {
    Swal.fire({
      title: "User is not allowed to access this page!",
      icon: "error",
      text: "Please try again."
    })
  }


  if (user.isAdmin === false) {
    Swal.fire({
      title: "User is not allowed to access this page!",
      icon: "error",
      text: "Please try again."
    })
  }

  const addProduct = (e) => {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_ECOMMERCE_URL}/products/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        category: productCategories,
        productName: productName,
        description: description,
        price: parseInt(productPrice, 10)
      })
    })
      .then(res => res.json())
      .then(data => {



        if (data) {
          Swal.fire({
            title: "PRODUCT ADDED SUCCESSFULLY!",
            icon: "success",
            text: `"The new product was added to the product list.`,
          });


          fetchData();
          addProductClose();
        }
        else {
          Swal.fire({
            title: "ADD PRODUCT UNSSUCCESSFUL!",
            icon: "error",
            text: `The system is experiencing trouble at the moment. Please try again later.`,
          });
          addProductClose();
        }

      })

    setProductCategories('');
    setProductName('');
    setProductPrice(0)
  }


  useEffect(() => {

    if (productCategories !== "" && productName !== "" &&
      description !== "" && productPrice > 0) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }

  }, [
    productCategories, productName,
    description, productPrice
  ]);


  const editProduct = (e) => {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_ECOMMERCE_URL}/products/${productId}/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        category: productCategories,
        productName: productName,
        description: description,
        price: parseInt(productPrice, 10)
      })
    })
      .then(res => res.json())
      .then(data => {


        if (data) {
          Swal.fire({
            title: "PRODUCT EDIT SUCCESSFUL!",
            icon: "success",
            text: `Product was edited successfully.`,
          });

          fetchData();
          closeEdit();

        }
        else {
          Swal.fire({
            title: "PRODUCT EDIT UNSUCCESSFUL!",
            icon: "error",
            text: `The system is experiencing trouble at the moment. Please try again later.`,
          });

          closeEdit();
        }

      })

    setProductCategories('');
    setProductName('');
    setDescription('');
    setProductPrice(0)
  }



  return (
    (user.id !== null) ?

      (user.isAdmin === true) ?

        <>
          <div className="createProductDiv">
            <h3> Create Product</h3>
            <Button onClick={addProductOpen}>Add Product</Button>
          </div>
          <Table striped className='tableData'>
            <thead>
              <tr>
                <th>Product Id</th>
                <th>Category</th>
                <th>Name</th>
                <th> Price</th>
                <th> isActive</th>
                <th> Action</th>
              </tr>
            </thead>
            <tbody>

              {allProducts}


            </tbody>

          </Table>

          {/* Add product modal */}
          <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={modalAdd}
          >
            <Form onSubmit={e => addProduct(e)}>

              <Modal.Header className="banner-bg text-light bg-primary">
                <Modal.Title>ADD PRODUCT</Modal.Title>
              </Modal.Header>

              <Modal.Body>


                <Form.Group controlId="productCategories" className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Category"
                    value={productCategories}
                    onChange={e => setProductCategories(e.target.value)}
                    required
                  />

                  <Form.Group controlId="ProductName" className="mb-3">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Product Name"
                      value={productName}
                      onChange={e => setProductName(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="description" className="mb-3">
                    <Form.Label>Product Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Product Description"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      required
                    />
                  </Form.Group>



                  <Form.Group controlId="productPrice" className="mb-3">
                    <Form.Label>Product Price</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Product Price"
                      value={productPrice}
                      onChange={e => setProductPrice(e.target.value)}
                      required
                    />
                  </Form.Group>


                </Form.Group>
              </Modal.Body>

              <Modal.Footer>

                {
                  (isActive === true)
                    ?
                    <Button variant="primary" type="submit" id="submitBtn">
                      Save
                    </Button>
                    :
                    <Button variant="danger" type="submit" id="submitBtn" disabled>
                      Save
                    </Button>
                }

                <Button variant="secondary" onClick={addProductClose}>
                  Close
                </Button>
              </Modal.Footer>

            </Form>
          </Modal>

          {/* EDIT MODAL */}

          <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={modalEdit}
          >
            <Form onSubmit={e => editProduct(e)}>
              <Modal.Body>
                <Modal.Header className="banner-bg text-light bg-primary" bg="primary">
                  <Modal.Title >EDIT PRODUCT</Modal.Title>
                </Modal.Header>

                <Form.Group controlId="productCategories" className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="category"
                    value={productCategories}
                    onChange={e => setProductCategories(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="productName" className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="product name"
                    value={productName}
                    onChange={e => setProductName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="description" className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="productPrice" className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Price"
                    value={productPrice}
                    onChange={e => setProductPrice(e.target.value)}
                    required
                  />

                </Form.Group>

              </Modal.Body>

              <Modal.Footer>
                {isActive
                  ?
                  <Button variant="primary" type="submit" id="submitBtn">
                    Save
                  </Button>
                  :
                  <Button variant="danger" type="submit" id="submitBtn" disabled>
                    Save
                  </Button>
                }
                <Button variant="secondary" onClick={closeEdit}>
                  Close
                </Button>
              </Modal.Footer>

            </Form>
          </Modal>



        </>


        : <Navigate to="/products" />

      : <Navigate to="/products" />
  )
}


export default ProductList