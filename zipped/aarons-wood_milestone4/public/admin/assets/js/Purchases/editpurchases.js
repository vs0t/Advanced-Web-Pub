var OrderDetailsEditBox = React.createClass({
    getInitialState: function () {
      return {
        orderDetails: [],
        selectedOrderDetailsId: null,
        selectedOrderDetail: null,
      };
    },
    componentDidMount: function () {
      this.fetchOrderDetails();
    },
    fetchOrderDetails: function () {
      fetch("/searchproducts/") // Adjust this to your order details search endpoint
        .then((response) => response.json())
        .then((data) => this.setState({ orderDetails: data }))
        .catch((error) => console.error("Error fetching order details:", error));
    },
    selectOrderDetail: function (orderDetailsId, orderDetail) {
      this.setState({
        selectedOrderDetailsId: orderDetailsId,
        selectedOrderDetail: orderDetail,
      });
    },
    render: function () {
      return (
        <div>
          <h1>Order Details Edit</h1>
          <OrderDetailsList orderDetails={this.state.orderDetails} onSelectOrderDetail={this.selectOrderDetail} />
          {this.state.selectedOrderDetailsId && (
            <OrderDetailsEditForm
              orderDetailsId={this.state.selectedOrderDetailsId}
              orderDetail={this.state.selectedOrderDetail}
              refreshOrderDetails={this.fetchOrderDetails}
            />
          )}
        </div>
      );
    },
  });
  
  // OrderDetailsList Component
  var OrderDetailsList = React.createClass({
    render: function () {
      var orderDetailNodes = this.props.orderDetails.map((orderDetail) => (
        <OrderDetail
          key={orderDetail.OrdersDetailsID}
          orderDetail={orderDetail}
          onSelectOrderDetail={this.props.onSelectOrderDetail}
        />
      ));
      return (
        <div>
          <table>
            <thead>
              <tr>
                <th>Order Detail ID</th>
                <th>Orders ID</th>
                <th>Product ID</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>{orderDetailNodes}</tbody>
          </table>
        </div>
      );
    },
  });
  
  // OrderDetail Component
  var OrderDetail = React.createClass({
    handleClick: function () {
      this.props.onSelectOrderDetail(this.props.orderDetail.OrdersDetailsID, this.props.orderDetail);
    },
    render: function () {
      const { OrdersDetailsID, OrdersID, ProductID, OrdersDetailsQuantity, ProductPrice } = this.props.orderDetail;
      return (
        <tr>
          <td>{OrdersDetailsID}</td>
          <td>{OrdersID}</td>
          <td>{ProductID}</td>
          <td>{OrdersDetailsQuantity}</td>
          <td>{ProductPrice}</td>
          <td>
            <button onClick={this.handleClick}>Edit</button>
          </td>
        </tr>
      );
    },
  });
  
  // OrderDetailsEditForm Component
  var OrderDetailsEditForm = React.createClass({
    getInitialState: function () {
      const { OrdersID, ProductID, OrdersDetailsQuantity, ProductPrice } = this.props.orderDetail;
      return {
        ordersId: OrdersID || "",
        productId: ProductID || "",
        quantity: OrdersDetailsQuantity || "",
        price: ProductPrice || "",
      };
    },
    componentDidUpdate: function (prevProps) {
      if (this.props.orderDetailsId !== prevProps.orderDetailsId) {
        const { OrdersID, ProductID, OrdersDetailsQuantity, ProductPrice } = this.props.orderDetail;
        this.setState({
          ordersId: OrdersID || "",
          productId: ProductID || "",
          quantity: OrdersDetailsQuantity || "",
          price: ProductPrice || "",
        });
      }
    },
    handleSubmit: function (event) {
      event.preventDefault();
      const orderDetailData = {
        orderDetailsId: this.props.orderDetailsId,
        ordersId: this.state.ordersId,
        productId: this.state.productId,
        quantity: this.state.quantity,
        price: this.state.price,
      };
  
      fetch("/updateorderdetails", { // Replace with your endpoint to update order details
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderDetailData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          alert("Order detail updated successfully!");
          this.props.refreshOrderDetails(); // Refresh the order details list
        })
        .catch((error) => console.error("Error updating order detail:", error));
    },
    handleChange: function (event) {
      var stateUpdate = {};
      stateUpdate[event.target.name] = event.target.value;
      this.setState(stateUpdate);
    },
    render: function () {
      return (
        <div>
          <h2>Edit Order Detail ID: {this.props.orderDetailsId}</h2>
          <form onSubmit={this.handleSubmit}>
            <label>
              Orders ID:
              <input
                type="number"
                name="ordersId"
                value={this.state.ordersId}
                onChange={this.handleChange}
              />
            </label>
            <br />
            <label>
              Product ID:
              <input
                type="number"
                name="productId"
                value={this.state.productId}
                onChange={this.handleChange}
              />
            </label>
            <br />
            <label>
              Quantity:
              <input
                type="number"
                name="quantity"
                value={this.state.quantity}
                onChange={this.handleChange}
              />
            </label>
            <br />
            <label>
              Price:
              <input
                type="text"
                name="price"
                value={this.state.price}
                onChange={this.handleChange}
              />
            </label>
            <br />
            <button type="submit">Submit Order Detail Update</button>
          </form>
        </div>
      );
    },
  });
  
  ReactDOM.render(<OrderDetailsEditBox />, document.getElementById('content'));
  