import React from 'react'
import BtnRender from './BtnRender'
// import axios from 'axios'
// import Loading from '../loading/Loading'

function ProductItem({product, isAdmin, deleteProduct, handleCheck}) {
    // const [loading, setLoading] = useState(false)

    // const deleteProduct = async() => {
    //     try {
    //         setLoading(true)
    //         const destroyImg = await axios.post('/api/destroy', {public_id: product.images.public_id},{
    //             headers: {Authorization: token}
    //         })
    //         const deleteProduct = await axios.delete(`/api/products/${product._id}`,{
    //             headers: {Authorization: token}
    //         })
 
    //         await destroyImg
    //         await deleteProduct
    //         setLoading(false)
    //         setCallback(!callback)

    //     } catch (err) {
    //         alert(err.response.data.msg)
    //     }
    // }

    // const handleCheck = () => {
    //     let newProduct = [...product]
    //     newProduct.checked = !newProduct.checked
    //     setProducts(newProduct)
    // }

    // if(loading) return <div className="product_card"><Loading /></div> 
    return (
        <div className="product_card">
            {
                isAdmin && <input type="checkbox" checked={product.checked}
                onChange={() => handleCheck(product._id)}/>
            }
            <img src={product.images.url} alt=""/>

            <div className="product_box">
                <h2 title={product.title}>{product.title}</h2>
                <span>£{product.price}</span>
                <p>{product.description}</p>
            </div>

            <BtnRender product={product} deleteProduct={deleteProduct}/>

            {/* <div className="row_btn">
                <Link id="btn_buy" to="#!">Buy</Link>
                <Link id="btn_view" to={`detail/${product._id}`}>View</Link>
            </div> */}
        </div>
    )
}

export default ProductItem
