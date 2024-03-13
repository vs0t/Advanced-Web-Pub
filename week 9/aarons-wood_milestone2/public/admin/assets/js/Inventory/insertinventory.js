var InventoryBox = React.createClass({
  handleInventorySubmit: function (inventory) {
    $.ajax({
      url: "/insertinventory",
      dataType: "json",
      type: "POST",
      data: inventory,
      success: function (data) {
        console.log("Inventory inserted successfully", data);
        // Handle the state update or redirection as needed here
      },
      error: function (xhr, status, err) {
        console.error("/insertinventory", status, err.toString());
      },
    });
  },
  render: function () {
    return (
      <div className="inventoryBox">
        <h1>Record New Inventory Form</h1>
        <InventoryForm onInventorySubmit={this.handleInventorySubmit} />
      </div>
    );
  },
});

var InventoryForm = React.createClass({
  getInitialState: function () {
    return {
      inventoryQuantity: "",
      productData: [],
      selectedProductId: "",
    };
  },
  loadProductOptions: function () {
    $.ajax({
      url: "/searchproducts",
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ productData: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error("/searchproductsandinventory", status, err.toString());
      }.bind(this),
    });
  },
  componentDidMount: function () {
    this.loadProductOptions();
  },
  handleProductChange: function (event) {
    this.setState({ selectedProductId: event.target.value });
  },
  setValue: function (field, event) {
    var object = {};
    object[field] = event.target.value;
    this.setState(object);
  },
  handleSubmit: function (e) {
    e.preventDefault();
    var inventoryQuantity = this.state.inventoryQuantity.trim();
    var selectedProductId = this.state.selectedProductId;

    // Simple validation
    if (!inventoryQuantity || !selectedProductId) {
      console.log("All fields are required.");
      return;
    }

    this.props.onInventorySubmit({
      inventoryQuantity: inventoryQuantity,
      productID: selectedProductId,
    });
  },
  render: function () {
    return (
      <form className="inventoryForm" onSubmit={this.handleSubmit}>
        <h2>Inventory Record Form</h2>
        <table>
          <tbody>
            <tr>
              <th>Product ID</th>
              <td>
                <SelectList
                  data={this.state.productData}
                  onChange={this.handleProductChange}
                />
              </td>
            </tr>
            <tr>
              <th>Inventory Quantity</th>
              <td>
                <TextInput
                  value={this.state.inventoryQuantity}
                  uniqueName="inventoryQuantity"
                  textArea={false}
                  required={true}
                  minCharacters={1}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "inventoryQuantity")}
                  errorMessage="Inventory Quantity is invalid"
                  emptyMessage="Inventory Quantity is required"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="Insert Inventory" />
      </form>
    );
  },
  commonValidate: function (value) {
    return /^\d+$/.test(value); // Validation for numeric input
  },
});

var SelectList = React.createClass({
  handleChange: function (event) {
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  },
  render: function () {
    var options = this.props.data.map(function (product) {
      return (
        <option key={product.ProductID} value={product.ProductID}>
          {product.ProductName}
        </option>
      );
    });
    return (
      <select name="productID" id="productID" onChange={this.handleChange}>
        <option value="">Select a Product</option>
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

ReactDOM.render(<InventoryBox />, document.getElementById("content"));
