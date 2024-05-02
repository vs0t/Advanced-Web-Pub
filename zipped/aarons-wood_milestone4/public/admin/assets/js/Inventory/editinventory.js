var InventoryEditBox = React.createClass({
    getInitialState: function () {
      return {
        inventoryItems: [],
        selectedInventoryId: null,
        selectedInventoryDetails: null,
      };
    },
    componentDidMount: function () {
      this.fetchInventoryItems();
    },
    fetchInventoryItems: function () {
      fetch("/searchinventory") // Adjust this to your inventory search endpoint
        .then((response) => response.json())
        .then((data) => this.setState({ inventoryItems: data }))
        .catch((error) => console.error("Error fetching inventory:", error));
    },
    selectInventoryItem: function (inventoryId, inventoryDetails) {
      this.setState({
        selectedInventoryId: inventoryId,
        selectedInventoryDetails: inventoryDetails,
      });
    },
    render: function () {
      return (
        <div>
          <h1>Inventory Edit</h1>
          <InventoryList inventoryItems={this.state.inventoryItems} onSelectInventoryItem={this.selectInventoryItem} />
          {this.state.selectedInventoryId && (
            <InventoryEditForm
              inventoryId={this.state.selectedInventoryId}
              inventoryDetails={this.state.selectedInventoryDetails}
              refreshInventoryItems={this.fetchInventoryItems}
            />
          )}
        </div>
      );
    },
  });
  
  var InventoryList = React.createClass({
    render: function () {
      var inventoryNodes = this.props.inventoryItems.map((item) => (
        <InventoryItem
          key={item.InventoryID}
          item={item}
          onSelectInventoryItem={this.props.onSelectInventoryItem}
        />
      ));
      return (
        <div>
          <table>
            <thead>
              <tr>
                <th>Inventory ID</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>{inventoryNodes}</tbody>
          </table>
        </div>
      );
    },
  });
  
  var InventoryItem = React.createClass({
    handleClick: function () {
      this.props.onSelectInventoryItem(this.props.item.InventoryID, this.props.item);
    },
    render: function () {
      const { InventoryID, ProductName, InventoryQuantity } = this.props.item;
      return (
        <tr>
          <td>{InventoryID}</td>
          <td>{ProductName}</td>
          <td>{InventoryQuantity}</td>
          <td>
            <button onClick={this.handleClick}>Edit</button>
          </td>
        </tr>
      );
    },
  });
  
  var InventoryEditForm = React.createClass({
    getInitialState: function () {
      const { ProductID, InventoryQuantity } = this.props.inventoryDetails;
      return {
        selectedProductId: ProductID || "",
        quantity: InventoryQuantity || "",
        productData: [],
      };
    },
    componentDidMount: function () {
      this.loadProductOptions();
    },
    loadProductOptions: function () {
      // Replace with your actual endpoint to fetch product data
      fetch("/searchproducts")
        .then((response) => response.json())
        .then((data) => this.setState({ productData: data }))
        .catch((error) => console.error("/searchproducts", error.toString()));
    },
    componentDidUpdate: function (prevProps) {
      if (this.props.inventoryId !== prevProps.inventoryId) {
        const { ProductID, InventoryQuantity } = this.props.inventoryDetails;
        this.setState({
          selectedProductId: ProductID || "",
          quantity: InventoryQuantity || "",
          // Optionally reload product data if needed: this.loadProductOptions();
        });
      }
    },
    handleSubmit: function (event) {
      event.preventDefault();
      const inventoryData = {
        inventoryId: this.props.inventoryId,
        productID: this.state.selectedProductId,
        quantity: this.state.quantity,
      };
  
      // Replace with your endpoint to update inventory details
      fetch("/updateinventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inventoryData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          alert("Inventory updated successfully!");
          this.props.refreshInventoryItems(); // Ensure this method is implemented to refresh the inventory list
        })
        .catch((error) => console.error("Error updating inventory:", error));
    },
    handleProductChange: function (event) {
      this.setState({ selectedProductId: event.target.value });
    },
    handleQuantityChange: function (event) {
      this.setState({ quantity: event.target.value });
    },
    render: function () {
      return (
        <div>
          <h2>Edit Inventory ID: {this.props.inventoryId}</h2>
          <form onSubmit={this.handleSubmit}>
            <label>
              Product Name:
              <SelectList
                data={this.state.productData}
                onChange={this.handleProductChange}
                value={this.state.selectedProductId}
              />
            </label>
            <br />
            <label>
              Quantity:
              <TextInput
                inputType="number"
                uniqueName="quantity"
                value={this.state.quantity}
                required={true}
                minCharacters={1}
                validate={(value) => /^\d+$/.test(value)} // Validation for numeric input
                onChange={this.handleQuantityChange}
                errorMessage="Quantity is invalid"
                emptyMessage="Quantity is required"
              />
            </label>
            <br />
            <button type="submit">Submit Inventory Update</button>
          </form>
        </div>
      );
    },
  });
  
  // SelectList is defined similarly as before, handling product selection
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
        <select name="productID" id="productID" onChange={this.handleChange} value={this.props.value}>
          <option value="">Select a Product</option>
          {options}
        </select>
      );
    },
  });
  
  // TextInput is adapted from your insertion script for the quantity input, including validation
  var TextInput = React.createClass({
    handleChange: function (event) {
      this.props.onChange(event); // Pass the event up to the parent form
    },
    render: function () {
      return (
        <div>
          <input
            type={this.props.inputType || "text"}
            name={this.props.uniqueName}
            value={this.props.value}
            onChange={this.handleChange}
            required={this.props.required}
          />
          {this.props.errorVisible && <div>{this.props.errorMessage}</div>}
        </div>
      );
    },
  });
  
  ReactDOM.render(<InventoryEditBox />, document.getElementById("content"));
  