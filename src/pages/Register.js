import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import UserContext from "../UserContext";

export default function Register() {

    const { user } = useContext(UserContext);

    const navigate = useNavigate();

    const [fName, setFName] = useState('');
    const [lName, setLName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [isActive, setIsActive] = useState(false);

    console.log(fName);
    console.log(lName);
    console.log(email);
    console.log(mobileNo);
    console.log(password1);
    console.log(password2);

    useEffect(() => {


        if ((fName !== '' && lName !== '' && email !== '' && mobileNo !== '' && password1 !== '' && password2 !== '') && (password1 === password2)) {
            setIsActive(true);
        }
        else {
            setIsActive(false);
        }

    }, [fName, lName, email, mobileNo, password1, password2])

    function registerUser(e) {
        e.preventDefault();

        fetch(`${process.env.REACT_APP_ECOMMERCE_URL}/users/checkEmail`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);

                if (data) {
                    Swal.fire({
                        title: "Duplicate email found",
                        icon: "error",
                        text: "Kindly provide another email to complete the registration."
                    })
                }
                else {

                    fetch(`${process.env.REACT_APP_ECOMMERCE_URL}/users/register`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            firstName: fName,
                            lastName: lName,
                            email: email,
                            password: password1,
                            mobileNo: mobileNo
                        })
                    })
                        .then(res => res.json())
                        .then(data => {
                            console.log(data);

                            if (data) {
                                Swal.fire({
                                    title: "Registration Successful",
                                    icon: "success",
                                    text: "Welcome to Fashion Shop!"
                                });
                                setFName('');
                                setLName('');
                                setEmail('');
                                setMobileNo('');
                                setPassword1('');
                                setPassword2('');
                                navigate("/login");
                            }
                            else {

                                Swal.fire({
                                    title: "Something went wrong",
                                    icon: "error",
                                    text: "Please try again."
                                });

                            }
                        })


                }
            })
    }

    return (

        <>
            <h1 className="my-5 text-center">Register</h1>
            <Form onSubmit={e => registerUser(e)}>

                <Form.Group className="mb-3" controlId="firstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter first name"
                        value={fName}
                        onChange={e => setFName(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="lastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter last name"
                        value={lName}
                        onChange={e => setLName(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="emailAddress">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        onChange={e => setEmail(e.target.value)}
                        value={email}
                        required
                    />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="mobileNo">
                    <Form.Label>Mobile Number</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="09xxxxxxxxx"
                        value={mobileNo}
                        onChange={e => setMobileNo(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password1">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter Password"
                        value={password1}
                        onChange={e => setPassword1(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password2">
                    <Form.Label>Verify Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Verify Password"
                        value={password2}
                        onChange={e => setPassword2(e.target.value)}
                        required
                    />
                </Form.Group>
                {
                    isActive
                        ?
                        <Button variant="primary" type="submit" id="submitBtn">
                            Submit
                        </Button>
                        :
                        <Button variant="danger" type="submit" id="submitBtn" disabled>
                            Submit
                        </Button>
                }
            </Form>
        </>
    )
}