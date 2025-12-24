import express from "express"
import { createProduct, deleteProducts, getAllProducts, getProductID, searchProducts, updateProducts } from "../controllers/productController.js"

const productRouter = express.Router()

productRouter.get("/" , getAllProducts)
productRouter.get("/search/:query" , searchProducts)
productRouter.get("/:productID" , getProductID)
productRouter.post("/" , createProduct)
productRouter.delete("/:productID" , deleteProducts)
productRouter.put("/:productID" , updateProducts)

export default productRouter