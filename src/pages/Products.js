import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Logout from "../pages/Logout"


export default function Products() {


	const [products, setProducts] = useState([]);

	useEffect(() => {
		fetch(`${process.env.REACT_APP_ECOMMERCE_URL}/products/active`)
			.then(res => res.json())
			.then(data => {
				console.log(data);
				setProducts(data.map(product => {
					return (
						<ProductCard key={product._id} productProp={product} />
					);
				}));
			})
	}, []);
	return (
		<>
			<h1>Products</h1>
			{products}
		</>
	)
}