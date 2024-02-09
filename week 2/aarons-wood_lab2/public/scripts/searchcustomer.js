var CustomerBox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadCustomersFromServer: function () {
        // console.log(customername.value),
        $.ajax({
            url: '/getcus',
            data: {
                'customername': customername.value,
                'customeraddress': customeraddress.value,
                'customerzip': customerzip.value,
                'customercredit': customercredit.value,
                'customeremail': customeremail.value,
            },
            
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ data: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

    },
    componentDidMount: function () {
        this.loadCustomersFromServer();
       // setInterval(this.loadEmployeesFromServer, this.props.pollInterval);
    },

    render: function () {
        return (
            <div>
                <h1>Customers</h1>
                <Customerform2 onCustomerSubmit={this.loadCustomersFromServer} />
                <br />
                <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Zip</th>
                                <th>Credit</th>
                                <th>Email</th>
                            </tr>
                         </thead>
                        <CustomerList data={this.state.data} />
                    </table>
                
            </div>
        );
    }
});

var Customerform2 = React.createClass({
    getInitialState: function () {
        return {
            customername: "",
            customeraddress: "",
            customerzip: "",
            customercredit: "",
            customeremail: ""
        };
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var customername = this.state.customername.trim();
        var customeraddress = this.state.customeraddress.trim();
        var customerzip = this.state.customerzip.trim();
        var customercredit = this.state.customercredit;
        var customeremail = this.state.customeremail.trim();

        this.props.onCustomerSubmit({ customername: customername, customeraddress: customeraddress, customerzip: customerzip, customercredit, customercredit, customeremail, customeremail });

    },
    handleChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    },
    render: function () {

        return (
            <form onSubmit={this.handleSubmit}>
                <h2>Customer</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Customer Name</th>
                            <td>
                                <input type="text" name="customername" id="customername" value={this.state.customername} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Address</th>
                            <td>
                                <input name="customeraddress" id="customeraddress" value={this.state.customeraddress} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Zip</th>
                            <td>
                                <input name="customerzip" id="customerzip" value={this.state.customerzip} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Credit</th>
                            <td>
                                <input name="customercredit" id="customercredit" value={this.state.customercredit} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Email</th>
                            <td>
                                <input name="customeremail" id="customeremail" value={this.state.customeremail} onChange={this.handleChange} />
                            </td>
                        </tr>    
                    </tbody>
                </table>
                <input type="submit" value="Search Customer" />

            </form>
        );
    }
});

var CustomerList = React.createClass({
    render: function () {
        var customerNodes = this.props.data.map(function (customer) {
            // Map the data to individual customers
            return (
                <Customer
                    customername={customer.dbcustomername}
                    customeraddress={customer.dbcustomeraddress}
                    customerzip={customer.dbcustomerzip}
                    customercredit={customer.dbcustomercredit}
                    customeremail={customer.dbcustomeremail}
                >
                </Customer>
            );
                       
        });
        
        // Print all the nodes in the list
        return (
             <tbody>
                {customerNodes}
            </tbody>
        );
    }
});

var Customer = React.createClass({
    render: function () {
        // Display an individual customer
        return (
            <tr>
                <td>
                    {this.props.customername} 
                </td>
                <td>
                    {this.props.customeraddress}
                </td>
                <td>
                    {this.props.customerzip}
                </td>
                <td>
                    {this.props.customercredit}
                </td>
                <td>
                    {this.props.customeremail}
                </td>
            </tr>
        );
    }
});

ReactDOM.render(
    <CustomerBox />,
    document.getElementById('content')
);