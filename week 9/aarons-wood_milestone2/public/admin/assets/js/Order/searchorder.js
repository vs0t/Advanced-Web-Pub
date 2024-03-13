var OrderSearchBox = React.createClass({
    getInitialState: function () {
      return { 
        data: [],
        users: [],
        products: []
      };
    },
    loadUsersFromServer: function () {
      $.ajax({
        url: '/searchusers', // Your endpoint to fetch users
        dataType: 'json',
        cache: false,
        success: function (data) {
          this.setState({ users: data });
        }.bind(this),
        error: function (xhr, status, err) {
          console.error('/searchusers', status, err.toString());
        }.bind(this)
      });
    },
    loadProductsFromServer: function () {
      $.ajax({
        url: '/searchproducts', // Your endpoint to fetch products
        dataType: 'json',
        cache: false,
        success: function (data) {
          this.setState({ products: data });
        }.bind(this),
        error: function (xhr, status, err) {
          console.error('/searchproducts', status, err.toString());
        }.bind(this)
      });
    },
    componentDidMount: function () {
      this.loadUsersFromServer();
      this.loadProductsFromServer();
    },
    loadOrdersFromServer: function (searchQuery) {
      $.ajax({
        url: '/searchorders', // Your endpoint to search orders
        data: searchQuery,
        dataType: 'json',
        cache: false,
        success: function (data) {
          this.setState({ data: data });
        }.bind(this),
        error: function (xhr, status, err) {
          console.error('/searchorders', status, err.toString());
        }.bind(this)
      });
    },
    render: function () {
      return (
        <div>
          <OrderSearchForm onOrderSearch={this.loadOrdersFromServer} users={this.state.users} products={this.state.products} />
          <br />
          <table>
            <thead>
              <tr>
                <th>| Order Date |</th>
                <th>| Order Time |</th>
                <th>| User Name |</th>
                <th>| Order Status |</th>
              </tr>
            </thead>
            <OrderList data={this.state.data} />
          </table>
        </div>
      );
    }
  });
  
  var OrderSearchForm = React.createClass({
    getInitialState: function () {
      return {
        selectedUserId: "",
        selectedProductId: "",
        orderDate: "",
        orderTime: "",
        orderStatus: ""
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
        orderDate: this.state.orderDate.trim(),
        orderTime: this.state.orderTime.trim(),
        orderStatus: this.state.orderStatus.trim()
      };
      this.props.onOrderSearch(searchQuery);
    },
    handleChange: function (event) {
      var nextState = {};
      nextState[event.target.name] = event.target.value;
      this.setState(nextState);
    },
    render: function () {
      return (
        <form onSubmit={this.handleSubmit}>
          <h2>Order Search</h2>
          <SelectList data={this.props.users} onChange={this.handleUserChange} name="selectedUserId" />
          <SelectList2 data={this.props.products} onProductChange={this.handleProductChange} name="selectedProductId" />
          <input type="date" name="orderDate" value={this.state.orderDate} onChange={this.handleChange} />
          <input type="time" name="orderTime" value={this.state.orderTime} onChange={this.handleChange} />
          <input type="text" name="orderStatus" value={this.state.orderStatus} onChange={this.handleChange} placeholder="Order Status" />
          <input type="submit" value="Search Orders" />
        </form>
      );
    }
  });
  
  // SelectList and SelectList2 components remain the same as your previous insert script
  
  var OrderList = React.createClass({
    render: function () {
      var orderNodes = this.props.data.map(function (order) {
        // You will need to modify the fields below to match the data structure of your orders
        return (
          <Order
            key={order.OrderID}
            orderDate={order.OrderDate}
            orderTime={order.OrderTime}
            userName={order.UserName} // You will need to fetch this information
            orderStatus={order.OrderStatus}
          />
        );
      });
      return (
        <tbody>
          {orderNodes}
        </tbody>
      );
    }
  });
  
  var Order = React.createClass({
    render: function () {
      return (
        <tr>
          <td>| {this.props.orderDate} |</td>
          <td>| {this.props.orderTime} |</td>
          <td>| {this.props.userName} |</td>
          <td>| {this.props.orderStatus} |</td>
        </tr>
      );
    }
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
  
  ReactDOM.render(
    <OrderSearchBox />,
    document.getElementById('content')
  );
  