var PurchaseEditBox = React.createClass({
  getInitialState: function () {
    return {
      purchasesEA: [],
      selectedPurchaseIdEA: null,
      selectedPurchaseDetailsEA: null,
    };
  },
  componentDidMount: function () {
    this.fetchPurchases();
  },
  fetchPurchases: function () {
    fetch("/searchpurchases/") // Adjust this to your purchases search endpoint
      .then((response) => response.json())
      .then((data) => this.setState({ purchasesEA: data }))
      .catch((error) => console.error("Error fetching purchases:", error));
  },
  selectPurchase: function (purchaseId, purchaseDetails) {
    this.setState({
      selectedPurchaseIdEA: purchaseId,
      selectedPurchaseDetailsEA: purchaseDetails,
    });
  },
  render: function () {
    return (
      <div>
        <h1>Purchase Edit</h1>
        <PurchaseList
          purchases={this.state.purchasesEA}
          onSelectPurchase={this.selectPurchase}
        />
        {this.state.selectedPurchaseIdEA && (
          <PurchaseEditForm
            purchaseId={this.state.selectedPurchaseIdEA}
            purchaseDetails={this.state.selectedPurchaseDetailsEA}
            refreshPurchases={this.fetchPurchases}
          />
        )}
      </div>
    );
  },
});

// PurchaseList Component
var PurchaseList = React.createClass({
  render: function () {
    var purchaseNodes = this.props.purchases.map((purchase) => (
      <Purchase
        key={purchase.OrdersID}
        purchase={purchase}
        onSelectPurchase={this.props.onSelectPurchase}
      />
    ));
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Order Date</th>
              <th>Player Name</th>
              <th>Product Name</th>
              <th>Price Paid</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>{purchaseNodes}</tbody>
        </table>
      </div>
    );
  },
});

// Purchase Component
var Purchase = React.createClass({
  handleClick: function () {
    this.props.onSelectPurchase(
      this.props.purchase.OrdersID,
      this.props.purchase
    );
  },
  render: function () {
    const {
      OrdersID,
      OrdersDate,
      PlayerFirstName,
      PlayerLastName,
      ProductName,
      OrderTotalPrice,
    } = this.props.purchase;
    const orderDate = new Date(OrdersDate);
    const formattedDate = orderDate.toISOString().split("T")[0];
    return (
      <tr>
        <td>{OrdersID}</td>
        <td>{formattedDate}</td>
        <td>
          {PlayerFirstName} {PlayerLastName}
        </td>
        <td>{ProductName}</td>
        <td>${OrderTotalPrice}</td>
        <td>
          <button onClick={this.handleClick}>Edit</button>
        </td>
      </tr>
    );
  },
});

// PurchaseEditForm Component
var PurchaseEditForm = React.createClass({
  getInitialState: function () {
    const { OrderTotalPrice, OrderStatus } = this.props.purchaseDetails;
    return {
      pricePaidEA: OrderTotalPrice || "",
      orderStatusEA: OrderStatus || 1,
    };
  },
  componentDidUpdate: function (prevProps) {
    if (this.props.purchaseId !== prevProps.purchaseId) {
      const { OrderTotalPrice, OrderStatus } = this.props.purchaseDetails;
      this.setState({
        pricePaidEA: OrderTotalPrice || "",
        orderStatusEA: OrderStatus || 1,
      });
    }
  },
  handleSubmit: function (event) {
    event.preventDefault();
    const purchaseDataEA = {
      purchaseId: this.props.purchaseId,
      pricePaid: this.state.pricePaidEA,
      orderStatus: this.state.orderStatusEA,
    };

    fetch("/updatepurchase", {
      // Replace with your endpoint to update purchase details
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(purchaseDataEA),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert("Purchase updated successfully!");
        this.props.refreshPurchases(); // Refresh the purchases list
      })
      .catch((error) => console.error("Error updating purchase:", error));
  },
  handleChange: function (event) {
    var stateUpdateEA = {};
    stateUpdateEA[event.target.name] = event.target.value;
    this.setState(stateUpdateEA);
  },
  render: function () {
    return (
      <div>
        <h2>Edit Purchase ID: {this.props.purchaseId}</h2>
        <form onSubmit={this.handleSubmit}>
          <label>
            Price Paid:
            <input
              type="text"
              name="pricePaidEA"
              value={this.state.pricePaidEA}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            Order Status:
            <select
              name="orderStatusEA"
              value={this.state.orderStatusEA}
              onChange={this.handleChange}
            >
              <option value={0}>Placed</option>
              <option value={1}>Confirmed</option>
            </select>
          </label>
          <br />
          <button type="submit">Submit Purchase Update</button>
        </form>
      </div>
    );
  },
});

ReactDOM.render(<PurchaseEditBox />, document.getElementById("content"));