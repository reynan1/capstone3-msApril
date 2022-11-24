import { useState, useEffect, useContext } from "react";

import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Navigate, NavLink } from 'react-router-dom'
import UserContext from "../UserContext";

export default function ProductView() {

	const { productId } = useParams();
	const { user } = useContext(UserContext);
	const navigate = useNavigate();
	const [category, setCategory] = useState('');
	const [productName, setProductName] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState(0);

	useEffect(() => {
		console.log(productId);

		fetch(`${process.env.REACT_APP_ECOMMERCE_URL}/products/${productId}`)
			.then(res => res.json())
			.then(data => {

				console.log(data);

				setCategory(data.category);
				setProductName(data.productName);
				setDescription(data.description);
				setPrice(data.price);

			});

	}, [productId])

	const checkOut = (productId) => {

		fetch(`${process.env.REACT_APP_ECOMMERCE_URL}/users/checkOut`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({
				productId: productId
			})
		})
			.then(res => res.json())
			.then(data => {

				console.log(data);

				if (data) {
					Swal.fire({
						title: "Successfully checked out.",
						icon: "success",
						text: "You have successfully check out this product."
					});

					navigate("/products");
				}
				else {
					Swal.fire({
						title: "Something went wrong",
						icon: "error",
						text: "Please try again."
					});
				}

			});

	}

	return (
		<Container className="mt-5">
			<Row>
				<Col lg={{ span: 6, offset: 3 }}>
					<Card>
						<Card.Body className="text-center">
							<Card.Title>{category}</Card.Title>
							<Card.Title>{productName}</Card.Title>
							<Card.Subtitle>Description:</Card.Subtitle>
							<Card.Text>{description}</Card.Text>
							<Card.Subtitle>Price:</Card.Subtitle>
							<Card.Text>PhP {price}</Card.Text>
							<Card.Subtitle>Status</Card.Subtitle>
							<Card.Text>Available</Card.Text>

							{
								(user.id !== null)
									?
									(user.isAdmin === true)
										?
										<>

											<Button variant="primary" size="lg" disabled>Check Out</Button>
										</>

										:
										<Button variant="primary" size="lg" onClick={() => checkOut(productId)}>Check Out</Button>


									:

									<Button variant="primary" size="lg" as={NavLink} to="/login">Check Out</Button>


							}

						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	)
}