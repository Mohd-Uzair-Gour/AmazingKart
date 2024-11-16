import { Container, Row, Col, Form, Alert, ListGroup, Button } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import CartItemComponent from "../../../components/CartItemComponent";

const UserOrderDetailsPageComponent = ({
  userInfo,
  getUser,
  getOrder,
  loadPayPalScript,
}) => {
  const [userAddress, setUserAddress] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [orderButtonMessage, setOrderButtonMessage] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [isDelivered, setIsDelivered] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const paypalContainer = useRef();
  const { id } = useParams();

  useEffect(() => {
    getUser().then((data) => setUserAddress({
      address: data.address,
      city: data.city,
      country: data.country,
      zipCode: data.zipCode,
      state: data.state,
      phoneNumber: data.phoneNumber,
    })).catch(console.log);
  }, []);

  useEffect(() => {
    getOrder(id).then((data) => {
      setPaymentMethod(data.paymentMethod);
      setCartItems(data.cartItems);
      setCartSubtotal(data.orderTotal.cartSubtotal);
      setIsDelivered(data.isDelivered ? data.deliveredAt : false);
      setIsPaid(data.isPaid ? data.paidAt : false);
      setOrderButtonMessage(data.isPaid ? "Your order is finished" : (data.paymentMethod === "pp" ? "Pay for your order" : "Wait for your order. You pay on delivery"));
      setButtonDisabled(data.isPaid || data.paymentMethod === "cod");
    }).catch(console.log);
  }, [id]);

  const orderHandler = () => {
    setButtonDisabled(true);
    if (paymentMethod === "pp" && !isPaid) {
      setOrderButtonMessage("To pay for your order click one of the buttons below");
      loadPayPalScript(cartSubtotal, cartItems, id, updateStateAfterOrder);
    }
  };

  const updateStateAfterOrder = (paidAt) => {
    setOrderButtonMessage("Thank you for your payment!");
    setIsPaid(paidAt);
    setButtonDisabled(true);
    paypalContainer.current.style.display = "none";
  };

  return (
    <Container fluid>
      <Row className="mt-4">
        <h1>Order Details</h1>
        <Col md={8}>
          <Row>
            <Col md={6}>
              <h2>Shipping</h2>
              <b>Name</b>: {userInfo.name} {userInfo.lastName} <br />
              <b>Address</b>: {userAddress.address}, {userAddress.city}, {userAddress.state}, {userAddress.zipCode} <br />
              <b>Phone</b>: {userAddress.phoneNumber}
            </Col>
            <Col md={6}>
              <h2>Payment method</h2>
              <Form.Select value={paymentMethod} disabled>
                <option value="pp">PayPal</option>
                <option value="cod">Cash On Delivery</option>
              </Form.Select>
            </Col>
            <Row>
              <Col>
                <Alert className="mt-3" variant={isDelivered ? "success" : "danger"}>
                  {isDelivered ? `Delivered at ${isDelivered}` : "Not delivered"}
                </Alert>
              </Col>
              <Col>
                <Alert className="mt-3" variant={isPaid ? "success" : "danger"}>
                  {isPaid ? `Paid on ${isPaid}` : "Not paid yet"}
                </Alert>
              </Col>
            </Row>
          </Row>
          <h2>Order items</h2>
          <ListGroup variant="flush">
            {cartItems.map((item, idx) => (
              <CartItemComponent item={item} key={idx} orderCreated />
            ))}
          </ListGroup>
        </Col>
        <Col md={4}>
          <ListGroup>
            <ListGroup.Item><h3>Order summary</h3></ListGroup.Item>
            <ListGroup.Item>Items price: <span className="fw-bold">${cartSubtotal}</span></ListGroup.Item>
            <ListGroup.Item>Shipping: <span className="fw-bold">included</span></ListGroup.Item>
            <ListGroup.Item>Tax: <span className="fw-bold">included</span></ListGroup.Item>
            <ListGroup.Item className="text-danger">Total: <span className="fw-bold">${cartSubtotal}</span></ListGroup.Item>
            <ListGroup.Item>
              <div className="d-grid gap-2">
                <Button
                  size="lg"
                  onClick={orderHandler}
                  variant="danger"
                  type="button"
                  disabled={buttonDisabled}
                >
                  {orderButtonMessage}
                </Button>
              </div>
              <div style={{ position: "relative", zIndex: 1 }}>
                <div ref={paypalContainer} id="paypal-container-element"></div>
              </div>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default UserOrderDetailsPageComponent;
