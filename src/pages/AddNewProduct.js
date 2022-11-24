import { useState, useEffect } from "react";

import {Container, Card, Button, Row, Col} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function AddNewProduct(){

    const { productId } = useParams();

    const navigate = useNavigate();
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);

    useEffect(()=>{
        console.log(productId);

        fetch(`${ process.env.REACT_APP_ECOMMERCE_URL }/products/${productId}`)
        .then(res => res.json())
        .then(data => {

            console.log(data);

            setName(data.name);
            setDescription(data.description);
            setPrice(data.price);

        });

    }, [productId])

    const update = (productId) =>{

        fetch(`${ process.env.REACT_APP_ECOMMERCE_URL }/products/update`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ localStorage.getItem('token') }`
            },
            body: JSON.stringify({
                productId: productId
            })
        })
        .then(res => res.json())
        .then(data => {

            console.log(data);

            if(data){
                Swal.fire({
                    title: "Successfully updated.",
                    icon: "success",
                    text: "You have successfully updated this product."
                });

                navigate("/products");
            }
            else{
                Swal.fire({
                    title: "Something went wrong",
                    icon: "error",
                    text: "Please try again."
                });
            }

        });

    }

    return(
        <Container className="mt-5">
            <Row>
                <Col lg={{ span: 6, offset: 3 }}>
                    <Card>
                        <Card.Body className="text-center">
                            <Card.Title>{productName}</Card.Title>
                            <Card.Subtitle>Description:</Card.Subtitle>
                            <Card.Text>{description}</Card.Text>
                            <Card.Subtitle>Price:</Card.Subtitle>
                            <Card.Text>PhP {price}</Card.Text>
                            <Card.Subtitle>Status</Card.Subtitle>
                            <Card.Text>Available</Card.Text>
                            <Button variant="primary"  size="lg" onClick={() => checkOut(productId)}>Check Out</Button>
                        </Card.Body>        
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}