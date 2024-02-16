var CustomerBox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadCustomersFromServer: function () {
        // console.log(customername.value),
        var participantvalue = 2;
        if (cusparticipantyes.checked) {
            participantvalue = 1;
        }
        if (cusparticipantno.checked) {
            participantvalue = 0;
        }
        $.ajax({
            url: '/getcus',
            data: {
                'customername': customername.value,
                'customeraddress': customeraddress.value,
                'customerzip': customerzip.value,
                'customercredit': customercredit.value,
                'customeremail': customeremail.value,
                'customerparticipant': participantvalue,
                'customerrewards': customerrewards.value
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
                                <th>Participant Level</th>
                                <th>Reward Level</th>
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
            customeremail: "",
            customerparticipant: "",
            data: []
        };
    },

    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },

    loadCusTypes: function () {
        $.ajax({
            url: '/getcustypes',
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
        this.loadCusTypes();
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var customername = this.state.customername.trim();
        var customeraddress = this.state.customeraddress.trim();
        var customerzip = this.state.customerzip.trim();
        var customercredit = this.state.customercredit;
        var customeremail = this.state.customeremail.trim();
        var customerparticipant = this.state.selectedOption;
        var customerrewards = this.state.customerrewards;

        this.props.onCustomerSubmit({ 
            customername: customername, 
            customeraddress: customeraddress, 
            customerzip: customerzip, 
            customercredit: customercredit, 
            customeremail: customeremail,
            customerparticipant: customerparticipant,
            customerrewards: customerrewards 
        });

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
                        <tr>
                            <th>Participant Status</th>
                            <td>
                                <input 
                                    type="radio"
                                    name="cusparticipant"
                                    id="cusparticipantyes"
                                    value="1"
                                    checked={this.state.selectedOption === "1"}
                                    onChange={this.handleOptionChange}
                                    className="form-check-input"
                                />Regular Member
                                <input 
                                    type="radio"
                                    name="cusparticipant"
                                    id="cusparticipantno"
                                    value="0"
                                    checked={this.state.selectedOption === "0"}
                                    onChange={this.handleOptionChange}
                                    className="form-check-input"
                                />Discount Member
                            </td>
                        </tr> 
                        <tr>
                            <th>Reward Level</th>
                            <td>
                                <SelectList data={this.state.data} />
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
                    customerparticipant={customer.dbcustparticipant}
                    customerrewards={customer.dbcustreward}
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

        if (this.props.customerparticipant == "1") {
            var theparticipant = "Regular Member";
        } else {
            var theparticipant = "Discount Member";
        }
        if (this.props.customerrewards === 1) {
            var thereward = "Silver";
        } else if (this.props.customerrewards === 2) {
            var thereward = "Gold";
        } else if (this.props.customerrewards === 3) {
            var thereward = "Platinum";
        }else {
            var thereward = "Unknown"; 
        }

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
                <td>
                    {theparticipant}
                </td>
                <td>
                    {thereward}
                </td>
            </tr>
        );
    }
});

var SelectList = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (cusParticipant) {
            return (
                <option 
                    key={cusParticipant.dbcustrewardsID}
                    value={cusParticipant.dbcustrewardsID}
                >  
                    {cusParticipant.dbcustrewardname}
                </option>
            );
        });
        return (
            <select name="customerrewards" id="customerrewards">
                <option value = "0"></option>
                {optionNodes}
            </select>
        );
    }
});

ReactDOM.render(
    <CustomerBox />,
    document.getElementById('content')
);