var OrderEditBox = React.createClass({
    getInitialState: function () {
      return {
        orders: [],
        selectedOrderId: null,
        selectedOrderDetails: null,
      };
    },
    componentDidMount: function () {
      this.fetchOrders();
    },
    fetchOrders: function () {
      fetch("/searchproducts/") // Adjust this to your orders search endpoint
        .then((response) => response.json())
        .then((data) => this.setState({ orders: data }))
        .catch((error) => console.error("Error fetching orders:", error));
    },
    selectOrder: function (orderId, orderDetails) {
      this.setState({
        selectedOrderId: orderId,
        selectedOrderDetails: orderDetails,
      });
    },
    render: function () {
      return (
        <div>
          <h1>Order Edit</h1>
          <OrderList orders={this.state.orders} onSelectOrder={this.selectOrder} />
          {this.state.selectedOrderId && (
            <OrderEditForm
              orderId={this.state.selectedOrderId}
              orderDetails={this.state.selectedOrderDetails}
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
          key={order.OrderID}
          order={order}
          onSelectOrder={this.props.onSelectOrder}
        />
      ));
      return (
        <div>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Order Date</th>
                <th>Order Time</th>
                <th>User ID</th>
                <th>Edit</th>
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
      this.props.onSelectOrder(this.props.order.OrderID, this.props.order);
    },
    render: function () {
      const { OrderID, OrdersDate, OrdersTime, UserID } = this.props.order;
      return (
        <tr>
          <td>| {OrderID} |</td>
          <td>| {OrdersDate} |</td>
          <td>| {OrdersTime} |</td>
          <td>| {UserID} |</td>
          <td>
            <button onClick={this.handleClick}>Edit</button>
          </td>
        </tr>
      );
    },
  });
  
  // OrderEditForm Component: Form for editing order information
  var OrderEditForm = React.createClass({
    getInitialState: function () {
      // Pre-fill the form with the selected order's details
      const { OrdersDate, OrdersTime, UserID, OrderStatus } = this.props.orderDetails;
      return {
        orderDate: OrdersDate || "",
        orderTime: OrdersTime || "",
        userId: UserID || "",
        orderStatus: OrderStatus || "",
      };
    },
    componentDidUpdate: function (prevProps) {
      // Only update state if the orderId has changed
      if (this.props.orderId !== prevProps.orderId) {
        const { OrdersDate, OrdersTime, UserID, OrderStatus } = this.props.orderDetails;
        this.setState({
          orderDate: OrdersDate || "",
          orderTime: OrdersTime || "",
          userId: UserID || "",
          orderStatus: OrderStatus || "",
        });
      }
    },
    handleSubmit: function (event) {
      event.preventDefault();
      const orderData = {
        orderId: this.props.orderId,
        orderDate: this.state.orderDate,
        orderTime: this.state.orderTime,
        userId: this.state.userId,
        orderStatus: this.state.orderStatus,
      };
  
      fetch("/updateorder", { // Replace with your endpoint to update order details
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
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
      var stateUpdate = {};
      stateUpdate[event.target.name] = event.target.value;
      this.setState(stateUpdate);
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
                name="orderDate"
                value={this.state.orderDate}
                onChange={this.handleChange}
              />
            </label>
            <br />
            <label>
              Order Time:
              <input
                type="time"
                name="orderTime"
                value={this.state.orderTime}
                onChange={this.handleChange}
              />
            </label>
            <br />
            <label>
              User ID:
              <input
                type="number"
                name="userId"
                value={this.state.userId}
                onChange={this.handleChange}
              />
            </label>
            <br />
            <label>
              Order Status:
              <input
                type="text"
                name="orderStatus"
                value={this.state.orderStatus}
                onChange={this.handleChange}
              />
            </label>
            <br />
            <button type="submit">Submit Order Update</button>
          </form>
        </div>
      );
    },
  });
  
  ReactDOM.render(<OrderEditBox />, document.getElementById('content'));
  