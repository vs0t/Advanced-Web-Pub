var OrderBox = React.createClass({
  getInitialState: function () {
    return {
      userData: [],
      productData: [],
    };
  },
  loadUserOptions: function () {
    // Fetch the user options
    $.ajax({
      url: "/searchusers", // Endpoint to fetch users
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ userData: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error("/searchusers", status, err.toString());
      }.bind(this),
    });
  },
  loadProductOptions: function () {
    // Fetch the product options
    $.ajax({
      url: "/searchproducts", // Endpoint to fetch products
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ productData: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error("/searchproducts", status, err.toString());
      }.bind(this),
    });
  },
  componentDidMount: function () {
    this.loadUserOptions();
    this.loadProductOptions();
  },
  handleOrderSubmit: function (order) {
    // Handle the order submit event here
  },
  render: function () {
    return (
      <div className="orderBox">
        <h1>Insert New Order</h1>
        <OrderForm
          onOrderSubmit={this.handleOrderSubmit}
          userData={this.state.userData}
          productData={this.state.productData}
        />
      </div>
    );
  },
});

var OrderForm = React.createClass({
  getInitialState: function () {
    return {
      selectedUserId: "",
      selectedProductId: "",
      quantity: "",
    };
  },
  handleUserChange: function (value) {
    this.setState({ selectedUserId: value });
  },
  handleProductChange: function (value) {
    this.setState({ selectedProductId: value });
  },
  handleQuantityChange: function (event) {
    this.setState({ quantity: event.target.value });
  },
  handleSubmit: function (e) {
    e.preventDefault();
    var order = {
      userId: this.state.selectedUserId,
      productId: this.state.selectedProductId,
      quantity: this.state.quantity,
    };
    this.props.onOrderSubmit(order);
  },
  render: function () {
    return (
      <form className="orderForm" onSubmit={this.handleSubmit}>
        <table>
          <tbody>
            <tr>
              <th>Select User</th>
              <td>
                <SelectList
                  data={this.props.userData}
                  onChange={this.handleUserChange}
                />
              </td>
            </tr>
            <tr>
              <th>Select Product</th>
              <td>
                <SelectList2
                  data={this.props.productData}
                  onProductChange={this.handleProductChange}
                />
              </td>
            </tr>
            <tr>
              <th>Quantity</th>
              <td>
                <TextInput
                  inputType="number"
                  value={this.state.quantity}
                  uniqueName="quantity"
                  textArea={false}
                  required={true}
                  minCharacters={1}
                  validate={this.commonValidate}
                  onChange={this.handleQuantityChange}
                  errorMessage="Quantity is invalid"
                  emptyMessage="Quantity is required"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="Insert Order" />
      </form>
    );
  },
  commonValidate: function () {
    return true;
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

var TextInput = React.createClass({
  getInitialState: function () {
    return {
      isEmpty: true,
      value: null,
      valid: false,
      errorMessage: "",
      errorVisible: false,
    };
  },

  handleChange: function (event) {
    this.validation(event.target.value);

    if (this.props.onChange) {
      this.props.onChange(event);
    }
  },

  validation: function (value, valid) {
    if (typeof valid === "undefined") {
      valid = true;
    }

    var message = "";
    var errorVisible = false;

    if (!valid) {
      message = this.props.errorMessage;
      valid = false;
      errorVisible = true;
    } else if (this.props.required && jQuery.isEmptyObject(value)) {
      message = this.props.emptyMessage;
      valid = false;
      errorVisible = true;
    } else if (value.length < this.props.minCharacters) {
      message = this.props.errorMessage;
      valid = false;
      errorVisible = true;
    }

    this.setState({
      value: value,
      isEmpty: jQuery.isEmptyObject(value),
      valid: valid,
      errorMessage: message,
      errorVisible: errorVisible,
    });
  },

  handleBlur: function (event) {
    var valid = this.props.validate(event.target.value);
    this.validation(event.target.value, valid);
  },
  render: function () {
    if (this.props.textArea) {
      return (
        <div className={this.props.uniqueName}>
          <textarea
            placeholder={this.props.text}
            className={"input input-" + this.props.uniqueName}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            value={this.props.value}
          />

          <InputError
            visible={this.state.errorVisible}
            errorMessage={this.state.errorMessage}
          />
        </div>
      );
    } else {
      return (
        <div className={this.props.uniqueName}>
          <input
            type={this.props.inputType}
            name={this.props.uniqueName}
            id={this.props.uniqueName}
            placeholder={this.props.text}
            className={"input input-" + this.props.uniqueName}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            value={this.props.value}
          />

          <InputError
            visible={this.state.errorVisible}
            errorMessage={this.state.errorMessage}
          />
        </div>
      );
    }
  },
});

var InputError = React.createClass({
  getInitialState: function () {
    return {
      message: "Input is invalid",
    };
  },
  render: function () {
    var errorClass = classNames(this.props.className, {
      error_container: true,
      visible: this.props.visible,
      invisible: !this.props.visible,
    });

    return <td> {this.props.errorMessage} </td>;
  },
});
ReactDOM.render(<OrderBox />, document.getElementById("content"));
