import { useSelector } from "react-redux";
import axios from "axios";
import { loadScript } from "@paypal/paypal-js";
import UserOrderDetailsPageComponent from "./components/UserOrderDetailsComponent";

const getOrder = async (orderId) => {
    const { data } = await axios.get(`/api/orders/user/${orderId}`);
    return data;
};

const loadPayPalScript = (cartSubtotal, cartItems, orderId, updateStateAfterOrder) => {
    loadScript({ "client-id": "ARumB-luLB7wtPOljQBUoIqA2kXSSd6TRrpavUDuCOridH8jsgHF8PSXcIW5RDgNDAGAv2tQJJ5B6z8s" })
    .then((paypal) => {
        paypal
            .Buttons(buttonConfig(cartSubtotal, cartItems, orderId, updateStateAfterOrder))
            .render("#paypal-container-element");
    })
    .catch((err) => {
        console.error("Failed to load the PayPal JS SDK script", err); 
    });
};

const buttonConfig = (cartSubtotal, cartItems, orderId, updateStateAfterOrder) => ({ 
    createOrder: (data, actions) => actions.order.create({
        purchase_units: [{
            amount: {
                value: cartSubtotal,
                breakdown: {
                    item_total: {
                        currency_code: "USD",
                        value: cartSubtotal,
                    },
                },
            },
            items: cartItems.map((product) => ({
                name: product.name,
                unit_amount: { currency_code: "USD", value: product.price },
                quantity: product.quantity,
            })),
        }],
    }),
    onCancel: () => console.log("Transaction cancelled"),
    onApprove: (data, actions) => actions.order.capture().then((orderData) => {
        const transaction = orderData.purchase_units[0].payments.captures[0];
        if (transaction.status === "COMPLETED" && Number(transaction.amount.value) === Number(cartSubtotal)) {
            updateOrder(orderId).then((data) => {
                if (data.isPaid) updateStateAfterOrder(data.paidAt);
            }).catch((err) => console.error("Order update failed", err));
        }
    }),
    onError: (err) => console.error("Error during PayPal transaction", err),
});

const updateOrder = async (orderId) => {
    const { data } = await axios.put(`/api/orders/paid/${orderId}`);
    return data;
};

const UserOrderDetailsPage = () => {
    const userInfo = useSelector((state) => state.userRegisterLogin.userInfo);

    const getUser = async () => {
        const { data } = await axios.get(`/api/users/profile/${userInfo._id}`);
        return data;
    };

    return (
        <UserOrderDetailsPageComponent 
            userInfo={userInfo} 
            getUser={getUser} 
            getOrder={getOrder} 
            loadPayPalScript={loadPayPalScript} 
        />
    );
};

export default UserOrderDetailsPage;
