import { Card, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
export default function ProductCard({productProp}) {


	const { _id, category, productName, description, price, status } = productProp;


    return (
        <Card className="my-3">
            <Card.Body>
                <Card.Title>
                    {category}
                </Card.Title>
                <Card.Title>
                    {productName}
                </Card.Title>
                <Card.Subtitle>
                    Description:
                </Card.Subtitle>
                <Card.Text>
                    {description}
                </Card.Text>
                <Card.Subtitle>
                    Price:
                </Card.Subtitle>
                <Card.Text>
                    Php {price}
                </Card.Text>
                <Card.Subtitle>
                    Status:
                </Card.Subtitle>
                <Card.Text>
                    {status} Available
                </Card.Text>
                <Button as={Link} to={`/products/${_id}`} variant="primary">Details</Button>
            </Card.Body>
        </Card>
    )
}