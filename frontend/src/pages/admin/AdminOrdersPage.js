import OrdersPageComponent from "./components/OrdersPageComponent"
import axios from "axios";

const AdminOrdersPage = () => {
  const getOrders = async () => {
    const { data } = await axios.get("/api/orders/admin");
    return data;
  };
  return <OrdersPageComponent  getOrders={getOrders}/>;
};

export default AdminOrdersPage;
