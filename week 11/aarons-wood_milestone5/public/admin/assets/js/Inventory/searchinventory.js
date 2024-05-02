var InventorySearchBox = React.createClass({
    getInitialState: function () {
      return {
        data: [],
        productData: []
      };
    },
    loadInventoryFromServer: function (productId) {
      fetch('/searchinventory' + (productId ? `?productId=${productId}` : ''))
        .then((response) => response.json())
        .then((data) => {
          this.setState({ data: data });
        })
        .catch((error) => {
          console.error('/searchinventory', error.toString());
        });
    },
    loadProductsFromServer: function () {
      fetch('/searchproducts')
        .then((response) => response.json())
        .then((productData) => {
          this.setState({ productData });
        })
        .catch((error) => {
          console.error('/searchproducts', error.toString());
        });
    },
    componentDidMount: function () {
      this.loadProductsFromServer();
    },
    render: function () {
      return (
        <div>
          <InventorySearchForm onInventorySearch={this.loadInventoryFromServer} productData={this.state.productData} />
          <br />
          <table>
            <thead>
              <tr>
                <th>| Product Name |</th>
                <th>| Quantity |</th>
              </tr>
            </thead>
            <InventoryList data={this.state.data} />
          </table>
        </div>
      );
    }
  });
  
  var InventorySearchForm = React.createClass({
    getInitialState: function () {
      return {
        selectedProductId: ""
      };
    },
    handleSubmit: function (e) {
      e.preventDefault();
      this.props.onInventorySearch(this.state.selectedProductId);
    },
    handleChange: function (event) {
      this.setState({ selectedProductId: event.target.value });
    },
    render: function () {
      var productOptions = this.props.productData.map(function (product) {
        return <option key={product.ProductID} value={product.ProductID}>{product.ProductName}</option>;
      });
      return (
        <form onSubmit={this.handleSubmit}>
          <h2>Inventory Search</h2>
          <SelectList data={this.props.productData} onChange={this.handleChange} value={this.state.selectedProductId} />
          <input type="submit" value="Search Inventory" />
        </form>
      );
    }
  });
  
  var SelectList = React.createClass({
    render: function () {
      var options = this.props.data.map(function (product) {
        return <option key={product.ProductID} value={product.ProductID}>{product.ProductName}</option>;
      });
      return (
        <select onChange={this.props.onChange} value={this.props.value}>
          <option value="">Select a Product</option>
          {options}
        </select>
      );
    }
  });
  
  var InventoryList = React.createClass({
    render: function () {
      var inventoryNodes = this.props.data.map(function (item) {
        return (
          <tr key={item.InventoryID}>
            <td>| {item.ProductName} |</td>
            <td>| {item.InventoryQuantity} |</td>
          </tr>
        );
      });
      return <tbody>{inventoryNodes}</tbody>;
    }
  });
  
  ReactDOM.render(
    <InventorySearchBox />,
    document.getElementById('content')
  );
  