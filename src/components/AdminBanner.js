import { Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";


export default function AdminBanner({adminBannerProp}) {

    const {title, destination1, destination2, destination3, label1, label2, label3} = adminBannerProp;

    console.log(title);
    return(
        <Row>
            <Col className="p-5 text-center">
                <h1>{title}</h1>
                <Button as = {Link} to={destination1} className="p-3" variant="primary">{label1}</Button>
                <Button as = {Link} to={destination2} className="p-3" variant="secondary">{label2}</Button>
                <Button as = {Link} to={destination3} className="p-3" variant="success">{label3}</Button>
            </Col>
        </Row>
    )
}   