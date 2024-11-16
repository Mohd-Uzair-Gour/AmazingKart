import React from "react";
import { Row, Col, Container, Nav } from "react-bootstrap";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaGithub,
  FaLinkedin,
  FaFileAlt,
  FaLock,
  FaPhoneAlt,
  FaEnvelope,
  FaBox,
  FaShoppingCart,
  FaHome,
  FaUserPlus,
  FaSignInAlt,
} from "react-icons/fa"; // Using more relevant icons

const FooterComponent = () => {
  return (
    <footer>
      <Container fluid>
        <Row className="mt-5">
        <Col className="bg-dark text-white text-center py-5">
            <h5>Contact Us</h5>
            <p>
              <FaPhoneAlt size={18} className="me-2" /> +91 9068158546
            </p>
            <p>
              <FaEnvelope size={18} className="me-2" />{" "}
              muzair6302@gmail.com
            </p>
            <p>
              &copy; {new Date().getFullYear()} Best Online Shop. All rights
              reserved.
            </p>
            <Nav>
              <Nav.Link href="/terms" className="text-white">
                <FaFileAlt size={18} className="me-2" /> Terms & Conditions
              </Nav.Link>
              <Nav.Link href="/privacy-policy" className="text-white">
                <FaLock size={18} className="me-2" /> Privacy Policy
              </Nav.Link>
            </Nav>
          </Col>
         
          <Col className="bg-dark text-white text-center py-5">
            <h5>Follow Us On</h5>
            <Nav className="flex-column">
              <Nav.Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white">
                <FaFacebook size={24} className="me-2" /> Facebook
              </Nav.Link>
              <Nav.Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white">
                <FaTwitter size={24} className="me-2" /> Twitter
              </Nav.Link>
              <Nav.Link href="https://www.instagram.com/uzair_gour_/" target="_blank" rel="noopener noreferrer" className="text-white">
                <FaInstagram size={24} className="me-2" /> Instagram
              </Nav.Link>
              <Nav.Link href="https://github.com/Mohd-Uzair-Gour" target="_blank" rel="noopener noreferrer" className="text-white">
                <FaGithub size={24} className="me-2" /> GitHub
              </Nav.Link>
              <Nav.Link href="https://www.linkedin.com/in/mohd-uzair-173bb8331/" target="_blank" rel="noopener noreferrer" className="text-white">
                <FaLinkedin size={24} className="me-2" /> LinkedIn
              </Nav.Link>
              </Nav>
          </Col>
          <Col className="bg-dark text-white text-center py-5">
            <h5>Quick Links</h5>
            <Nav className="flex-column">
              <Nav.Link href="/" className="text-white">
                <FaHome size={18} className="me-2" /> Home
              </Nav.Link>
              <Nav.Link href="/product-list" className="text-white">
                <FaBox size={18} className="me-2" /> Product List
              </Nav.Link>
              <Nav.Link href="/cart" className="text-white">
                <FaShoppingCart size={18} className="me-2" /> Cart
              </Nav.Link>
              <Nav.Link href="/login" className="text-white">
                <FaSignInAlt size={18} className="me-2" /> Login
              </Nav.Link>
              <Nav.Link href="/register" className="text-white">
                <FaUserPlus size={18} className="me-2" /> Register
              </Nav.Link>
            </Nav>
          </Col>
          <Col className="bg-dark text-white text-center py-5">
            <h5>About Us</h5>
            <p>
              Best Online Shop offers the best products at unbeatable prices. We
              are committed to customer satisfaction and providing top-notch
              service. Our mission is to deliver quality products with unmatched
              customer care.
            </p>
            <h6>Our Vision</h6>
            <p>
              To be the leading online marketplace offering the widest variety
              of high-quality products at the most affordable prices.
            </p>
          </Col>
        
        
        </Row>
      </Container>
    </footer>
  );
};

export default FooterComponent;
