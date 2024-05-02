var OrderEditBox = React.createClass({
  getInitialState: function () {
    return {
      ordersEA: [],
      selectedOrderIdEA: null,
      selectedOrderDetailsEA: null,
    };
  },
  componentDidMount: function () {
    this.fetchOrders();
  },
  fetchOrders: function () {
    fetch("/searchorders/") // Adjust this to your orders search endpoint
      .then((response) => response.json())
      .then((data) => this.setState({ ordersEA: data }))
      .catch((error) => console.error("Error fetching orders:", error));
  },
  selectOrder: function (orderId, orderDetails) {
    this.setState({
      selectedOrderIdEA: orderId,
      selectedOrderDetailsEA: orderDetails,
    });
  },
  deleteOrder: function (orderId) {
    fetch(`/deleteorder/${orderId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert("Order deleted successfully!");
        this.fetchOrders(); // Refresh the order list after deletion
      })
      .catch((error) => console.error("Error deleting order:", error));
  },
  render: function () {
    return (
      <div>
        <h1>Order Edit</h1>
        <h3>
          This form is for editing Placed orders, to edit confirmed orders view
          the Edit Purchases Site
        </h3>
        <OrderList
          orders={this.state.ordersEA}
          onSelectOrder={this.selectOrder}
          onDeleteOrder={this.deleteOrder}
        />
        {this.state.selectedOrderIdEA && (
          <OrderEditForm
            orderId={this.state.selectedOrderIdEA}
            orderDetails={this.state.selectedOrderDetailsEA}
            refreshOrders={this.fetchOrders}
          />
        )}
      </div>
    );
  },
});

// OrderList Component: Lists orders with an edit button
var OrderList = React.createClass({
  render: function () {
    var orderNodes = this.props.orders.map((order) => (
      <Order
        key={order.OrdersID}
        order={order}
        onSelectOrder={this.props.onSelectOrder}
        onDeleteOrder={this.props.onDeleteOrder}
      />
    ));
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Order Date</th>
              <th>Player Name</th>
              <th>Product Name</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>{orderNodes}</tbody>
        </table>
      </div>
    );
  },
});

// Order Component: Displays a single order row
var Order = React.createClass({
  handleClick: function () {
    this.props.onSelectOrder(this.props.order.OrdersID, this.props.order);
  },
  handleDeleteClick: function () {
    this.props.onDeleteOrder(this.props.order.OrdersID);
  },
  render: function () {
    const {
      OrdersID,
      OrdersDate,
      PlayerFirstName,
      PlayerLastName,
      ProductName,
    } = this.props.order;
    const orderDate = new Date(OrdersDate);
    const formattedDate = orderDate.toISOString().split("T")[0];
    const formattedTime = orderDate.toTimeString().split(" ")[0];
    return (
      <tr>
        <td>| {OrdersID} |</td>
        <td>| {formattedDate} |</td>
        <td>
          | {PlayerFirstName} {PlayerLastName} |
        </td>
        <td>| {ProductName} |</td>
        <td>
          <button onClick={this.handleClick}>Edit</button>
        </td>
        <td>
          <button onClick={this.handleDeleteClick}>Delete</button>
        </td>
      </tr>
    );
  },
});

// OrderEditForm Component: Form for editing order information
var OrderEditForm = React.createClass({
  getInitialState: function () {
    const { OrdersDate, OrdersTime, OrderTotalPrice, OrderStatus } =
      this.props.orderDetails;
    const orderDateTime = new Date(OrdersDate);
    const formattedDate = orderDateTime.toISOString().split("T")[0];
    const formattedTime = OrdersTime.substring(0, 8); // Extract the time portion from OrdersTime
    return {
      orderDateEA: formattedDate || "",
      orderTimeEA: formattedTime || "",
      pricePaidEA: OrderTotalPrice || "",
      orderStatusEA: OrderStatus || 0,
    };
  },
  componentDidUpdate: function (prevProps) {
    if (this.props.orderId !== prevProps.orderId) {
      const { OrdersDate, OrdersTime, OrderTotalPrice, OrderStatus } =
        this.props.orderDetails;
      const orderDateTime = new Date(OrdersDate);
      const formattedDate = orderDateTime.toISOString().split("T")[0];
      const formattedTime = OrdersTime.substring(0, 8); // Extract the time portion from OrdersTime
      this.setState({
        orderDateEA: formattedDate || "",
        orderTimeEA: formattedTime || "",
        pricePaidEA: OrderTotalPrice || "",
        orderStatusEA: OrderStatus || 0,
      });
    }
  },
  handleSubmit: function (event) {
    event.preventDefault();
    const orderDataEA = {
      orderId: this.props.orderId,
      orderDate: this.state.orderDateEA,
      orderTime: this.state.orderTimeEA,
      pricePaid: this.state.pricePaidEA,
      orderStatus: this.state.orderStatusEA,
    };

    fetch("/updateorder", {
      // Replace with your endpoint to update order details
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderDataEA),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert("Order updated successfully!");
        this.props.refreshOrders(); // Refresh the order list
      })
      .catch((error) => console.error("Error updating order:", error));
  },
  handleChange: function (event) {
    var stateUpdateEA = {};
    stateUpdateEA[event.target.name] = event.target.value;
    this.setState(stateUpdateEA);
  },
  render: function () {
    return (
      <div>
        <h2>Edit Order ID: {this.props.orderId}</h2>
        <form onSubmit={this.handleSubmit}>
          <label>
            Order Date:
            <input
              type="date"
              name="orderDateEA"
              value={this.state.orderDateEA}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            Order Time:
            <input
              type="time"
              name="orderTimeEA"
              value={this.state.orderTimeEA}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            Price Paid:
            <input
              type="text"
              name="pricePaidEA"
              value={this.state.pricePaidEA}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            Order Status:
            <select
              name="orderStatusEA"
              value={this.state.orderStatusEA}
              onChange={this.handleChange}
            >
              <option value={0}>Placed</option>
              <option value={1}>Confirmed</option>
            </select>
          </label>
          <br />
          <button type="submit">Submit Order Update</button>
        </form>
      </div>
    );
  },
});

ReactDOM.render(<OrderEditBox />, document.getElementById("content"));
