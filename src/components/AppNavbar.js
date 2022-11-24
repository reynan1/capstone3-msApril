import { useContext } from "react"
import { Link, NavLink } from "react-router-dom";

import { Container, Nav, Navbar } from "react-bootstrap";
import UserContext from "../UserContext";

export default function AppNavbar() {

    const { user } = useContext(UserContext);


    console.log(user.isAdmin + "  it is admin :: ");
    return (
        <Navbar bg="light" expand="lg">
            <Container fluid>
                <Navbar.Brand as={NavLink} to="/">The Fashion Shop</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={NavLink} to="/products" end>Products</Nav.Link>
                        {
                            (user.id !== null)
                                ?
                                (user.isAdmin == true) ?

                                    <>
                                        <Nav.Link as={NavLink} to="/adminDashboard" end>AdminDashboard</Nav.Link>
                                        <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>

                                        <Nav.Link as={NavLink} to="/logout" end>Logout</Nav.Link>
                                    </>
                                    :
                                    <>
                                        <Nav.Link as={NavLink} to="/order" end>Order list</Nav.Link>
                                        <Nav.Link as={NavLink} to="/logout" end>Logout</Nav.Link>
                                    </>


                                :
                                <>
                                    <Nav.Link as={NavLink} to="/login" end>Login</Nav.Link>
                                    <Nav.Link as={NavLink} to="/register" end>Register</Nav.Link>
                                </>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}