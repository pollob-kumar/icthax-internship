function ProductCard( {title, price, image} ){
    return(
        <div className="card">
            <img src={image} alt={title} />
            <h3> {title} </h3>
            <p className="price"> {price.toLocaleString()} </p>
            <button>Buy Now</button>
        </div>
    );
}

export default ProductCard;