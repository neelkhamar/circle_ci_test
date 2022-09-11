import React from "react";
import ProductContainer from "../components/Product/productContainer";
import checkAuthentication from "../components/utilities/checkAuth/checkAuthentication";

const Producto = () => {
  return <ProductContainer />;
};

export default checkAuthentication(Producto);
