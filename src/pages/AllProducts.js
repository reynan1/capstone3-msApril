import { useContext, useState, useEffect } from "react"
import UserContext from "../UserContext";
import { Navigate } from "react-router-dom";
import { Container, Col, Row, Button, Table, Modal, Form, Image } from "react-bootstrap"
import Swal from "sweetalert2";

import React from "react";
import logo from "./images/fs.png";
import AllProductsBanner from "../components/AllProductsBanner";


export default function AllProducts() {

    const data = {
        title: "VIEW ALL PRODUCTS",
        content: "You can Add, edit, and archive a product on this page.",
        destination: "/products/all",
        label: "PRODUCTS",
        image: { logo }
    }

    const { user } = useContext(UserContext);

    const [allProducts, setAllProducts] = useState([]);

    const [productId, setProductId] = useState("");
    const [productName, setProductName] = useState("");
    const [productBrand, setProductBrand] = useState("");
    const [productType, setProductType] = useState("");
    const [productModel, setProductModel] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [stocks, setStocks] = useState(0);
    const [imgSource, setImgSource] = useState("");

    const [isActive, setIsActive] = useState(false);

    const [modalAdd, setModalAdd] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);


    const addProductOpen = () => setModalAdd(true);
    const addProductClose = () => setModalAdd(false);

    const openEdit = (id) => {
        setProductId(id);

        fetch(`${process.env.REACT_APP_ECOMMERCE_URL}/products/:productId`)
            .then(res => res.json())
            .then(data => {

                console.log(data);

                setProductName(data.productName);
                setDescription(data.description);
                setPrice(data.price);
                setStocks(data.stocks);
                setImgSource(data.imgSource);
            });

        setModalEdit(true)
    };

    const closeEdit = () => {

        setProductName('');
        setDescription('');
        setImgSource('');
        setPrice(0);
        setStocks(0);

        setModalEdit(false);
    };




    /* GET ALL PRODUCTS */
    const fetchData = () => {
        fetch(`${process.env.REACT_APP_ECOMMERCE_URL}/products/all`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);

                setAllProducts(data.map(products => {
                    return (
                        <>

                            <tr key={products._id}>
                                <td>{products._id}</td>
                                <td>{products.productBrand}</td>
                                <td>{products.productName}</td>
                                <td>{products.productModel}</td>
                                <td>{products.description}</td>
                                <td>{products.price}</td>
                                <td>{products.stocks}</td>
                                <td>{products.isActive ? "Active" : "Inactive"}</td>
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


    /* ARCHIVE PRODUCT */
    const archive = (id, name) => {
        console.log(id);
        console.log(name);
        fetch(`${process.env.REACT_APP_ECOMMERCE_URL}/products/:productId/archive`,
            {
                method: "PUT",
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
        fetch(`${process.env.REACT_APP_ECOMMERCE_URL}/products/:productId/archive`,
            {
                method: "PUT",
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

    /* ADD PRODUCT */
    const addProduct = (e) => {
        e.preventDefault();

        fetch(`${process.env.REACT_APP_ECOMMERCE_URL}/products/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                productBrand: productBrand,
                productModel: productModel,
                productType: productType,
                productName: productName,
                description: description,
                price: price,
                stocks: stocks,
                imgSource: imgSource
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);

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
        setProductBrand('');
        setProductType('');
        setProductModel('');
        setProductName('');
        setImgSource('');
        setDescription('');
        setPrice(0);
        setStocks(0);
    }

    /* EDIT PRODUCT */
    const editProduct = (e) => {
        e.preventDefault();

        fetch(`${process.env.REACT_APP_ECOMMERCE_URL}/products/:productId/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                productName: productName,
                description: description,
                price: price,
                stocks: stocks,
                imgSource: imgSource
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);

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

        setProductName('');
        setDescription('');
        setPrice(0);
        setStocks(0);
    }

    useEffect(() => {

        if (productName != "" && description != "" && price > 0 && stocks > 0) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }

    }, [productName, description, price, stocks]);




    return (
        <>

            <Container fluid className="w-100 d-flex h-100 m-0 p-0">
                <Row className="w-100 m-0 p-0">
                    <Col className="bg-white d-flex  pt-3 m-0 shadow" xs={12} md={2} lg={2}>

                    </Col>

                    <Col className="colr-bg m-0 p-5 d-flex justify-content-center" xs={12} md={10} lg={10}>
                        {
                            (user.isAdmin)
                                ?
                                <>
                                    <div className="w-100 bg-white  rounded shadow-sm shadow-lg p-5">
                                        <div className="my-2 text-center">
                                            <h1>VIEW ALL PRODUCTS</h1>
                                        </div>
                                        <div className="my-2 text-right">
                                            <Button variant="danger" className="px-5" onClick={addProductOpen}>ADD A PRODUCT</Button>
                                        </div>
                                        <Table striped bordered hover className="shadow-lg shadow-sm ">
                                            <thead className="banner-bg text-light">
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Brand</th>
                                                    <th>Name</th>
                                                    <th>Model</th>
                                                    <th className="w-25">Description</th>
                                                    <th>Price</th>
                                                    <th>Stocks</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {allProducts}
                                            </tbody>
                                        </Table>


                                        {/* ADD PRODUCT MODAL */}

                                        <Modal
                                            size="lg"
                                            aria-labelledby="contained-modal-title-vcenter"
                                            centered
                                            show={modalAdd}
                                        >
                                            <Form onSubmit={e => addProduct(e)}>

                                                <Modal.Header className="banner-bg text-light">
                                                    <Modal.Title>ADD PRODUCT</Modal.Title>
                                                </Modal.Header>

                                                <Modal.Body>
                                                    <Row>
                                                        <Col xs={6} md={6} lg={6}>
                                                            <Image className="editModal-img-fit mb-2"
                                                                src={imgSource}
                                                            />
                                                            <Form.Group controlId="productBrand" className="mb-3">
                                                                <Form.Label>Product Brand</Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Product Brand"
                                                                    value={productBrand}
                                                                    onChange={e => setProductBrand(e.target.value)}
                                                                    required
                                                                />
                                                            </Form.Group>
                                                            <Form.Group controlId="productType" className="mb-3">
                                                                <Form.Label>Product Type</Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Product Type"
                                                                    value={productType}
                                                                    onChange={e => setProductType(e.target.value)}
                                                                    required
                                                                />
                                                            </Form.Group>
                                                            <Form.Group controlId="productModel" className="mb-3">
                                                                <Form.Label>Product Model</Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Product Model"
                                                                    value={productModel}
                                                                    onChange={e => setProductModel(e.target.value)}
                                                                    required
                                                                />
                                                            </Form.Group>
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
                                                        </Col>
                                                        <Col xs={6} md={6} lg={6}>
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

                                                            <Form.Group controlId="price" className="mb-3">
                                                                <Form.Label>Product Price</Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    placeholder="Product Price"
                                                                    value={price}
                                                                    onChange={e => setPrice(e.target.value)}
                                                                    required
                                                                />
                                                            </Form.Group>

                                                            <Form.Group controlId="stocks" className="mb-3">
                                                                <Form.Label>Product Quantity</Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    placeholder="Product Quantity"
                                                                    value={stocks}
                                                                    onChange={e => setStocks(e.target.value)}
                                                                    required
                                                                />
                                                            </Form.Group>
                                                            <Form.Group controlId="imgSource" className="mb-3">
                                                                <Form.Label>Image Link</Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Product Image Link"
                                                                    value={imgSource}
                                                                    onChange={e => setImgSource(e.target.value)}
                                                                    required
                                                                />

                                                            </Form.Group>
                                                        </Col>
                                                    </Row>
                                                </Modal.Body>

                                                <Modal.Footer>
                                                    {isActive
                                                        ?
                                                        <Button variant="primary" type="submit" id="submitBtn">
                                                            ADD PRODUCT
                                                        </Button>
                                                        :
                                                        <Button variant="danger" type="submit" id="submitBtn" disabled>
                                                            ADD PRODUCT
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

                                                <Modal.Header className="banner-bg text-light">
                                                    <Modal.Title>EDIT PRODUCT</Modal.Title>
                                                </Modal.Header>

                                                <Modal.Body>
                                                    <Image className="editModal-img-fit mb-2"
                                                        src={imgSource}
                                                    />
                                                    <Form.Group controlId="productName" className="mb-3">
                                                        <Form.Label>Product Name</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Enter Product Name"
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
                                                            placeholder="Enter Product Description"
                                                            value={description}
                                                            onChange={e => setDescription(e.target.value)}
                                                            required
                                                        />
                                                    </Form.Group>

                                                    <Form.Group controlId="price" className="mb-3">
                                                        <Form.Label>Product Price</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder="Enter Product Price"
                                                            value={price}
                                                            onChange={e => setPrice(e.target.value)}
                                                            required
                                                        />
                                                    </Form.Group>

                                                    <Form.Group controlId="stocks" className="mb-3">
                                                        <Form.Label>Product Stocks</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder="Enter Product Stocks"
                                                            value={stocks}
                                                            onChange={e => setStocks(e.target.value)}
                                                            required
                                                        />
                                                    </Form.Group>
                                                    <Form.Group controlId="imgSource" className="mb-3">
                                                        <Form.Label>Image Link</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Enter Product Image Link"
                                                            value={imgSource}
                                                            onChange={e => setImgSource(e.target.value)}
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



                                    </div>
                                </>
                                :
                                <Navigate to="/" />}

                    </Col>

                </Row>
            </Container>




        </>


    )
}
