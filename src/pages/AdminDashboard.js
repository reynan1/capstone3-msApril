import { Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export default function AdminDashboard() {

	return (
		<>
			<h1>Admin Dashboard</h1>

			<Button as={NavLink} to="/productlist"> Show Products </Button>
		</>
	)
}