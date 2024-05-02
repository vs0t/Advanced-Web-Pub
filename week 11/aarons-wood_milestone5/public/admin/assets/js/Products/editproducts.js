var ProductEditBox = React.createClass({
    getInitialState: function () {
      return {
        products: [],
        selectedProductId: null,
        selectedProductDetails: null,
      };
    },
    componentDidMount: function () {
      this.fetchProducts();
    },
    fetchProducts: function () {
      fetch("/searchproducts/") // Adjust this to your product search endpoint
        .then((response) => response.json())
        .then((data) => this.setState({ products: data }))
        .catch((error) => console.error("Error fetching products:", error));
    },
    selectProduct: function (productId, productDetails) {
      this.setState({
        selectedProductId: productId,
        selectedProductDetails: productDetails,
      });
    },
    render: function () {
      return (
        <div>
          <h1>Product Edit</h1>
          <ProductList products={this.state.products} onSelectProduct={this.selectProduct} />
          {this.state.selectedProductId && (
            <ProductEditForm
              productId={this.state.selectedProductId}
              productDetails={this.state.selectedProductDetails}
            />
          )}
        </div>
      );
    },
  });
  
  // ProductList Component: Lists products with an edit button
  var ProductList = React.createClass({
    render: function () {
      var productNodes = this.props.products.map((product) => (
        <Product
          key={product.ProductID}
          product={product}
          onSelectProduct={this.props.onSelectProduct}
        />
      ));
      return (
        <div>
          <table>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Product Description</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>{productNodes}</tbody>
          </table>
        </div>
      );
    },
  });
  
  // Product Component: Displays a single product row
  var Product = React.createClass({
    handleClick: function () {
      this.props.onSelectProduct(this.props.product.ProductID, this.props.product);
    },
    render: function () {
      const { ProductID, ProductName, ProductDesc } = this.props.product;
      return (
        <tr>
          <td>| {ProductID} |</td>
          <td>| {ProductName} |</td>
          <td>| {ProductDesc} |</td>
          <td>
            <button onClick={this.handleClick}>Edit</button>
          </td>
        </tr>
      );
    },
  });
  
  // ProductEditForm Component: Form for editing product information
  var ProductEditForm = React.createClass({
    getInitialState: function () {
      // Pre-fill the form with the selected product's details
      const { ProductName, ProductDesc, ProductPrice, ProductSize } = this.props.productDetails;
      return {
        productName: ProductName || "",
        productDesc: ProductDesc || "",
        productPrice: ProductPrice || "",
        productSize: ProductSize || "",
      };
    },
    componentDidUpdate: function (prevProps) {
      // Only update state if the productId has changed
      if (this.props.productId !== prevProps.productId) {
        const { ProductName, ProductDesc, ProductPrice, ProductSize } = this.props.productDetails;
        this.setState({
          productName: ProductName || "",
          productDesc: ProductDesc || "",
          productPrice: ProductPrice || "",
          productSize: ProductSize || "",
        });
      }
    },
    handleSubmit: function (event) {
      event.preventDefault();
      const productData = {
        productId: this.props.productId,
        productName: this.state.productName,
        productDesc: this.state.productDesc,
        productPrice: this.state.productPrice,
        productSize: this.state.productSize,
      };
  
      fetch("/updateproduct", { // Replace with your endpoint to update product details
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          alert("Product updated successfully!");
          this.props.refreshProducts(); // Add this method to the parent component to refresh the list after update
        })
        .catch((error) => console.error("Error updating product:", error));
    },
    handleChange: function (event) {
      var stateUpdate = {};
      stateUpdate[event.target.name] = event.target.value;
      this.setState(stateUpdate);
    },
    render: function () {
      return (
        <div>
          <h2>Edit Product ID: {this.props.productId}</h2>
          <form onSubmit={this.handleSubmit}>
            <label>
              Product Name:
              <input
                type="text"
                name="productName"
                value={this.state.productName}
                onChange={this.handleChange}
              />
            </label>
            <br />
            <label>
              Product Description:
              <textarea
                name="productDesc"
                value={this.state.productDesc}
                onChange={this.handleChange}
              />
            </label>
            <br />
            <label>
              Product Price:
              <input
                type="text"
                name="productPrice"
                value={this.state.productPrice}
                onChange={this.handleChange}
              />
            </label>
            <br />
            <label>
              Product Size:
              <input
                type="text"
                name="productSize"
                value={this.state.productSize}
                onChange={this.handleChange}
              />
            </label>
            <br />
            <button type="submit">Submit Product Update</button>
          </form>
        </div>
      );
    },
  });
  
  ReactDOM.render(<ProductEditBox />, document.getElementById('content'));
  