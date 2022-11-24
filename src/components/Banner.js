import { Link } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";

// modify the Banner component to be a reusable component
export default function Banner({bannerProp}){
	
	// deconstruct the prop from the parent component.
	const {image, title, content, destination, label} = bannerProp;
	return(

		<Row>
			<Col className="p-5 text-center">
				<h1>{title}</h1>
            	<p>{content}</p>
				<Button as = {Link} to={destination} variant="primary">{label}</Button>
			</Col>
		</Row>
	)
}