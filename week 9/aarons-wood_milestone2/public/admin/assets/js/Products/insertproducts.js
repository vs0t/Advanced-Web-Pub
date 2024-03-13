var ProductBox = React.createClass({
  handleProductSubmit: function (eaProduct) {
    $.ajax({
      url: "/insertproduct", // Your server endpoint to insert a product
      dataType: "json",
      type: "POST",
      data: eaProduct,
      success: function (data) {
        console.log("Product inserted successfully", data);
        // Here you can handle the state update or redirection as needed
      },
      error: function (xhr, status, err) {
        console.error("/insertproduct", status, err.toString());
      },
    });
  },
  render: function () {
    return (
      <div className="productBox">
        <h1>Insert New Product</h1>
        <ProductForm onProductSubmit={this.handleProductSubmit} />
      </div>
    );
  },
});

var ProductForm = React.createClass({
  getInitialState: function () {
    return {
      eaProductName: "",
      eaProductDesc: "",
      eaProductPrice: "",
      eaProductSize: "",
    };
  },
  setValue: function (field, event) {
    var object = {};
    object[field] = event.target.value;
    this.setState(object);
  },
  handleSubmit: function (e) {
    e.preventDefault();
    this.props.onProductSubmit({
      productName: this.state.eaProductName,
      productDesc: this.state.eaProductDesc,
      productPrice: this.state.eaProductPrice,
      productSize: this.state.eaProductSize,
    });
  },
  render: function () {
    return (
      <form className="productForm" onSubmit={this.handleSubmit}>
        <table>
          <tbody>
            <tr>
              <th>Product Name</th>
              <td>
                <TextInput
                  value={this.state.eaProductName}
                  textArea={false}
                  required={true}
                  minCharacters={1}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "eaProductName")}
                  errorMessage="Product Name is invalid"
                  emptyMessage="Product Name is required"
                />
              </td>
            </tr>
            <tr>
              <th>Product Description</th>
              <td>
                <TextInput
                  value={this.state.eaProductDesc}
                  textArea={true}
                  required={false}
                  minCharacters={1}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "eaProductDesc")}
                  errorMessage="Product Description is invalid"
                />
              </td>
            </tr>
            <tr>
              <th>Product Price</th>
              <td>
                <TextInput
                  value={this.state.eaProductPrice}
                  textArea={false}
                  required={true}
                  minCharacters={1}
                  validate={this.validateDollars}
                  onChange={this.setValue.bind(this, "eaProductPrice")}
                  errorMessage="Product Price is invalid"
                  emptyMessage="Product Price is required"
                />
              </td>
            </tr>
            <tr>
              <th>Product Size</th>
              <td>
                <TextInput
                  value={this.state.eaProductSize}
                  textArea={false}
                  required={false}
                  minCharacters={1}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "eaProductSize")}
                  errorMessage="Product Size is invalid"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="Insert Product" />
      </form>
    );
  },
  commonValidate: function () {
    return true;
  },
  validateDollars: function (value) {
    var regex = /^\$?[0-9]+(\.[0-9][0-9])?$/;
    return regex.test(value);
  },
});

var TextInput = React.createClass({
  getInitialState: function () {
    return {
      isEmpty: true,
      value: null,
      valid: false,
      errorMessage: "Input is invalid",
      errorVisible: false,
    };
  },
  handleChange: function (event) {
    this.validation(event.target.value);

    if (this.props.onChange) {
      this.props.onChange(event);
    }
  },
  validation: function (value) {
    var valid = this.props.validate(value);
    var message = "";
    var errorVisible = false;

    if (!valid) {
      message = this.props.errorMessage;
      errorVisible = true;
    } else if (this.props.required && !value) {
      message = this.props.emptyMessage;
      errorVisible = true;
    } else if (value.length < this.props.minCharacters) {
      message = this.props.errorMessage;
      errorVisible = true;
    }

    this.setState({
      value: value,
      isEmpty: !value,
      valid: valid,
      errorMessage: message,
      errorVisible: errorVisible,
    });
  },
  handleBlur: function (event) {
    this.validation(event.target.value);
  },
  render: function () {
    var errorClass = classNames({
      error_container: true,
      visible: this.state.errorVisible,
      invisible: !this.state.errorVisible,
    });

    var inputClass = "input-" + this.props.uniqueName;
    return (
      <div className={inputClass}>
        <input
          type={this.props.inputType || "text"}
          name={this.props.uniqueName}
          placeholder={this.props.uniqueName}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          value={this.state.value}
        />
        <div className={errorClass}>{this.state.errorMessage}</div>
      </div>
    );
  },
});

ReactDOM.render(<ProductBox />, document.getElementById("content"));
