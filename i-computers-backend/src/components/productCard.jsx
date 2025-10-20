export default function ProductCard(props) {
  return (
    <div
      className="product-card"
      style={{
        width: "250px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "15px",
        textAlign: "center",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
      }}
    >
      <img
        src={props.image}
        alt="Gaming Laptop"
        style={{ width: "100%", borderRadius: "8px" }}
      />
      <h3 style={{ margin: "10px 0", fontSize: "18px" }}>{props.name} </h3>
      <p style={{ color: "#555" }}>{props.des}</p>
      <p style={{ fontWeight: "bold", color: "#007BFF" }}>{props.price}</p>
      <button
        style={{
          padding: "10px 15px",
          backgroundColor: "#e0dd38ff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}
