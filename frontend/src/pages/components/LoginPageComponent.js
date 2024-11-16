import React, { useState } from "react";
import { Col, Container, Row, Form, Button, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

const LoginPageComponent = ({ loginUserApiRequest, reduxDispatch, setReduxUserState }) => {
  const [validated, setValidated] = useState(false);
  const [loginUserResponseState, setLoginUserResponseState] = useState({
    success: "",
    error: "", 
    loading: false,
  });

  const handleSubmit = (event) => {
    event.preventDefault();  
    event.stopPropagation();
    const form = event.currentTarget.elements;

    const email = form.email.value;
    const password = form.password.value;
    const doNotLogout = form.doNotLogout.checked;

    if (event.currentTarget.checkValidity() === true && email && password) {
      setLoginUserResponseState((prevState) => ({
        ...prevState,
        loading: true,
      }));

      loginUserApiRequest(email, password, doNotLogout)
        .then((res) => {
          setLoginUserResponseState({
            success: res.success,
            loading: false,
            error: "",
          });
          if (res.userLoggedIn) {
            reduxDispatch(setReduxUserState(res.userLoggedIn));
          }
          if (res.success === "user logged in" && !res.userLoggedIn.isAdmin) 
            window.location.href = "/user";
          else 
            window.location.href = "/admin/orders";
        })
        .catch((err) =>
          setLoginUserResponseState({
            success: "",
            loading: false,
            error: err.response?.data?.message || "wrong credentials",
          })
        );
    }

    setValidated(true);
  };

  return (
    <Container>
      <Row className="mt-5 justify-content-md-center">
        <Col md={6}>
          <h1>Login</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control required type="email" placeholder="Enter email address" name="email" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control required type="password" placeholder="Enter password" name="password" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" name="doNotLogout" label="Do not logout" />
            </Form.Group>
            <Row className="pb-2">
              <Col>Don't have an account?</Col>
              <Link to={"/register"}> Register </Link>
            </Row>
            <Button variant="primary" type="submit" disabled={loginUserResponseState.loading}>
              {loginUserResponseState.loading ? (
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              ) : (
                "Login"
              )}
            </Button>
            {loginUserResponseState.error && (
              <Alert variant="danger" className="mt-3">{loginUserResponseState.error}</Alert>
            )}
            {loginUserResponseState.success && (
              <Alert variant="success" className="mt-3">Logged in successfully!</Alert>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPageComponent;
