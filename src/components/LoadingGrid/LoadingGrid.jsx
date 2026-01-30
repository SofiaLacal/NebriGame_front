import ProductCard from "../ProductCard/ProductCard";

function LoadingGrid() {
  return (
    <>
      <ProductCard loading={true} />
      <ProductCard loading={true} />
      <ProductCard loading={true} />
      <ProductCard loading={true} />
      <ProductCard loading={true} />
      <ProductCard loading={true} />
    </>
  );
}

export default LoadingGrid;