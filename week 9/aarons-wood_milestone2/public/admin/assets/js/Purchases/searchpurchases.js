var OrderDetailsSearchBox = React.createClass({
  getInitialState: function () {
    return {
      data: [],
      users: [],
      products: [],
    };
  },
  loadUsersFromServer: function () {
    $.ajax({
      url: "/searchusers", // Endpoint to fetch users
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ users: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error("/searchusers", status, err.toString());
      }.bind(this),
    });
  },
  loadProductsFromServer: function () {
    $.ajax({
      url: "/searchproducts", // Endpoint to fetch products
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ products: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error("/searchproducts", status, err.toString());
      }.bind(this),
    });
  },
  componentDidMount: function () {
    this.loadUsersFromServer();
    this.loadProductsFromServer();
  },
  loadOrderDetailsFromServer: function (searchQuery) {
    $.ajax({
      url: "/searchorderdetails", // Endpoint to search order details
      data: searchQuery,
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ data: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error("/searchorderdetails", status, err.toString());
      }.bind(this),
    });
  },
  render: function () {
    return (
      <div>
        <OrderDetailsSearchForm
          onOrderDetailsSearch={this.loadOrderDetailsFromServer}
          users={this.state.users}
          products={this.state.products}
        />
        <br />
        <OrderDetailsList data={this.state.data} />
      </div>
    );
  },
});

var OrderDetailsSearchForm = React.createClass({
  getInitialState: function () {
    return {
      selectedUserId: "",
      selectedProductId: "",
      quantity: "",
      price: "",
    };
  },
  handleUserChange: function (value) {
    this.setState({ selectedUserId: value });
  },
  handleProductChange: function (value) {
    this.setState({ selectedProductId: value });
  },
  handleSubmit: function (e) {
    e.preventDefault();
    var searchQuery = {
      userId: this.state.selectedUserId,
      productId: this.state.selectedProductId,
      quantity: this.state.quantity.trim(),
      price: this.state.price.trim(),
    };
    this.props.onOrderDetailsSearch(searchQuery);
  },
  handleChange: function (event) {
    var nextState = {};
    nextState[event.target.name] = event.target.value;
    this.setState(nextState);
  },
  render: function () {
    return (
      <form onSubmit={this.handleSubmit}>
        <h2>Order Details Search</h2>
        <SelectList
          data={this.props.users}
          onChange={this.handleUserChange}
          name="selectedUserId"
        />
        <SelectList2
          data={this.props.products}
          onChange={this.handleProductChange}
          name="selectedProductId"
        />
        <input
          type="text"
          name="quantity"
          value={this.state.quantity}
          onChange={this.handleChange}
          placeholder="Quantity"
        />
        <input
          type="text"
          name="price"
          value={this.state.price}
          onChange={this.handleChange}
          placeholder="Price"
        />
        <input type="submit" value="Search Order Details" />
      </form>
    );
  },
});

var OrderDetailsList = React.createClass({
  render: function () {
    var orderDetailNodes = this.props.data.map(function (orderDetail) {
      // Modify fields below to match data structure
      return (
        <tr key={orderDetail.OrdersDetailsID}>
          <td>{orderDetail.OrdersID}</td>
          <td>{orderDetail.ProductID}</td>
          <td>{orderDetail.OrdersDetailsQuantity}</td>
          <td>{orderDetail.ProductPrice.toFixed(2)}</td>
        </tr>
      );
    });
    return (
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Product ID</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{orderDetailNodes}</tbody>
      </table>
    );
  },
});

var SelectList = React.createClass({
  handleChange: function (event) {
    if (this.props.onChange) {
      this.props.onChange(event.target.value);
    }
  },
  render: function () {
    var options = this.props.data.map(function (item) {
      return (
        <option key={item.UserID} value={item.UserID}>
          {item.UserFirstName}
        </option>
      );
    });
    return (
      <select name="userSelect" onChange={this.handleChange}>
        <option value="">Select User</option>
        {options}
      </select>
    );
  },
});

var SelectList2 = React.createClass({
  handleChange: function (event) {
    if (this.props.onProductChange) {
      this.props.onProductChange(event.target.value);
    }
  },
  render: function () {
    var options = this.props.data.map(function (item) {
      return (
        <option key={item.ProductID} value={item.ProductID}>
          {item.ProductName}
        </option>
      );
    });
    return (
      <select name="productSelect" onChange={this.handleChange}>
        <option value="">Select Product</option>
        {options}
      </select>
    );
  },
});
ReactDOM.render(<OrderDetailsSearchBox />, document.getElementById("content"));
