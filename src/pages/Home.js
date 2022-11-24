import Banner from "../components/Banner";
import Highlights from "../components/Highlights";

export default function Home(){
	const data = {
		title: "The Fashion Shop",
		content: "Experience the different styles of clothing and accessories",
		destination: "/products",
		label: "Shop now!"
	}

	return(
		<>
			<Banner bannerProp={data}/>
			<Highlights />
		</>
	)
}