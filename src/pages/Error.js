import Banner from "../components/Banner";

export default function Error(){

    const data = {
        title: "404 - Page Not Found!",
        description: "The page you are trying to access cannot be found.",
        destination: "/",
        label:  "Back to Home"
    }

    return(
        <Banner bannerProp={data}/>
    )
    
}