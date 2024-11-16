import { Button } from "react-bootstrap";

const RemoveFromCartComponent = ({
  orderCreated,
  productID,
  quantity,
  price,
  RemoveFromCartHandler= false,
}) => {
  return (
    <Button
      disabled={orderCreated}
      type="button"
      variant="secondary"
      onClick={
        RemoveFromCartHandler
          ? () => RemoveFromCartHandler(productID, quantity, price)
          : undefined
      }
    >
      <i className="bi bi-trash"></i>
    </Button>
  );
};

export default RemoveFromCartComponent;
