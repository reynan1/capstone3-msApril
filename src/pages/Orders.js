import { useState, useEffect, useContext } from 'react';

import Table from 'react-bootstrap/Table';

import Image from 'react-bootstrap/Image';
import { Navigate } from 'react-router-dom'

import UserContext from "../UserContext";

const ProductList = function () {
  const { user, userAll } = useContext(UserContext);
  const [allProducts, setAllProducts] = useState([]);
  const [orderId, setOrderId] = useState("");

  const fetchData = () => {
    fetch(`${process.env.REACT_APP_ECOMMERCE_URL}/users/${user.id}/details`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {

        setAllProducts(data.orderedItems.map(products => {

          return (
            <>
              <tr key={products._id}>
                <td>{products._id}</td>
                <td>{products.quantity}</td>
                {/*          <td>{products.subTotal}</td> */}
                <td>{products.purchasedOn}</td>
              </tr>
            </>
          )
        }));

      }
      )
  }
  useEffect(() => {
    fetchData();


  }, [])



  const fetchDataProduct = () => {
    fetch(`${process.env.REACT_APP_ECOMMERCE_URL}/products/${user.id}/`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {

        setAllProducts({

        });

      }
      )
  }
  useEffect(() => {
    fetchDataProduct();


  }, [])
  return (
    <>
      {
        (user.id !== null)
          ?
          (user.isAdmin == true)
            ?
            <Navigate to="/adminDashboard" />
            :

            <>
              <div>
                <h3 className='tableData' style={{ marginTop: "1rem" }}> User Order</h3>
                <div>
                  <Table striped bordered hover className='tableData' style={{ marginTop: "1rem" }}>
                    <thead>
                      <tr>
                        <th>Product Id</th>
                        <th>Quantity</th>
                        <th>Date & Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allProducts}
                    </tbody>
                  </Table>
                </div>

              </div>

              {/*  <div>
                <h3 className='tableData' style={{ marginTop: "1rem" }}> Product Order</h3>
                <div>
                  <Table striped bordered hover className='tableData' style={{ marginTop: "1rem" }}>
                    <thead>
                      <tr>
                        <th>User Id</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allProducts}
                    </tbody>
                  </Table>
                </div>

              </div> */}
            </>

          : <Navigate to='/login' />


      }
    </>
  )

}

export default ProductList