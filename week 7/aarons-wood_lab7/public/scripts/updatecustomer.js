var CustomerBox = React.createClass({
  getInitialState: function () {
    return { data: [] };
  },
  loadCustomersFromServer: function () {
    var participantvalue = 2;
    if (cusparticipantyes.checked) {
      participantvalue = 1;
    }
    if (cusparticipantno.checked) {
      participantvalue = 0;
    }
    console.log(participantvalue);
    $.ajax({
      url: '/getcus',
      data: {
        'customername': customername.value,
        'customeraddress': customeraddress.value,
        'customerzip': customerzip.value,
        'customercredit': customercredit.value,
        'customeremail': customeremail.value,
        'customerparticipant': participantvalue,
        'customerrewards': customerrewards.value,
      },

      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ data: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  updateSingleCusFromServer: function (customer) {
    $.ajax({
      url: "/updatesinglecus",
      dataType: "json",
      data: customer,
      type: "POST",
      cache: false,
      success: function (upsingledata) {
        this.setState({ upsingledata: upsingledata });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
    window.location.reload(true);
  },
  componentDidMount: function () {
    this.loadCustomersFromServer();
    // setInterval(this.loadEmployeesFromServer, this.props.pollInterval);
  },

  render: function () {
    return (
      <div>
        <h1>Update Customer</h1>
        <Customerform2 onCustomerSubmit={this.loadCustomersFromServer} />
        <br />
        <div id="theresults">
          <div id="theleft">
            <table>
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Name</th>
                  <th>Email</th>
                  {/* <th>Email</th>
                  <th></th> */}
                </tr>
              </thead>
              <CustomerList data={this.state.data} />
            </table>
          </div>
          <div id="theright">
            <CustomerUpdateform
              onUpdateSubmit={this.updateSingleCusFromServer}
            />
          </div>
        </div>
      </div>
    );
  },
});

var Customerform2 = React.createClass({
  getInitialState: function () {
    return {
      customerid: "",
      customername: "",
      customeraddress: "",
      customerzip: "",
      customercredit: "",
      customeremail: "",
      customerparticipant: "",
      data: [],
    };
  },
  handleOptionChange: function (e) {
    this.setState({
      selectedOption: e.target.value,
    });
  },
  loadCusTypes: function () {
    $.ajax({
      url: "/getcustypes",
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ data: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  componentDidMount: function () {
    this.loadCusTypes();
  },

  handleSubmit: function (e) {
    e.preventDefault();

    var customername = this.state.customername.trim();
    var customeraddress = this.state.customeraddress.trim();
    var customerzip = this.state.customerzip;
    var customercredit = this.state.customercredit;
    var customeremail = this.state.customeremail.trim();
    var customerparticipant = this.state.selectedOption;
    var customerrewards = customerrewards.value;

    this.props.onCustomerSubmit({
      customername: customername,
      customeraddress: customeraddress,
      customerzip: customerzip,
      customercredit: customercredit,
      customeremail: customeremail,
      customerparticipant: customerparticipant,
      customerrewards: customerrewards,
    });
  },
  handleChange: function (event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  },
  render: function () {
    return (
      <div>
        <div id="theform">
          <form onSubmit={this.handleSubmit}>
            <h2>Customers</h2>
            <table>
              <tbody>
                <tr>
                  <th>Customer Name</th>
                  <td>
                    <input
                      type="text"
                      name="customername"
                      id="customername"
                      value={this.state.customername}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Customer Address</th>
                  <td>
                    <input
                      name="customeraddress"
                      id="customeraddress"
                      value={this.state.customeraddress}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Customer Zip</th>
                  <td>
                    <input
                      name="customerzip"
                      id="customerzip"
                      value={this.state.customerzip}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Customer Credit</th>
                  <td>
                    <input
                      name="customercredit"
                      id="customercredit"
                      value={this.state.customercredit}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Customer Email</th>
                  <td>
                    <input
                      name="customeremail"
                      id="customeremail"
                      value={this.state.customeremail}
                      onChange={this.handleChange}
                    />
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
                    />
                    Regular Member
                    <input
                      type="radio"
                      name="cusparticipant"
                      id="cusparticipantno"
                      value="0"
                      checked={this.state.selectedOption === "0"}
                      onChange={this.handleOptionChange}
                      className="form-check-input"
                    />
                    Discount Member
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
        </div>
        <div>
          <br />
          <form onSubmit={this.getInitialState}>
            <input type="submit" value="Clear Form" />
          </form>
        </div>
      </div>
    );
  },
});

var CustomerUpdateform = React.createClass({
  getInitialState: function () {
    return {
      upcustomerid: "",
      upcustomername: "",
      upcustomeraddress: "",
      upcustomerzip: "",
      upcustomercredit: "",
      upcustomeremail: "",
      upselectedOption: "",
      updata: []
    };
  },
  handleUpOptionChange: function (e) {
    this.setState({
      upselectedOption: e.target.value,
    });
  },
  loadCusTypes: function () {
    $.ajax({
      url: "/getcustypes",
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ updata: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  componentDidMount: function () {
    this.loadCusTypes();
  },
  handleUpSubmit: function (e) {
    e.preventDefault();

    var upcustomerid = upcusid.value;
    var upcustomername = upcusname.value;
    var upcustomeraddress = upcusaddress.value;
    var upcustomerzip = upcuszip.value;
    var upcustomercredit = upcuscredit.value;
    var upcustomeremail = upcusemail.value;
    var upcustomerparticipant = this.state.upselectedOption;
    var upcustomerreward = upcustype.value;

    this.props.onUpdateSubmit({
      upcustomerid: upcustomerid,
      upcustomername: upcustomername,
      upcustomeraddress: upcustomeraddress,
      upcustomerzip: upcustomerzip,
      upcustomercredit: upcustomercredit,
      upcustomeremail: upcustomeremail,
      upcustomerparticipant: upcustomerparticipant,
      upcustomerreward: upcustomerreward,
    });
  },
  handleUpChange: function (event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  },
  render: function () {
    return (
      <div>
        <div id="theform">
          <form onSubmit={this.handleUpSubmit}>
          <table>
                    <tbody>
                        <tr>
                            <th>Customer Name</th>
                            <td>
                                <input type="text" name="upcusname" id="upcusname" value={this.state.upcusname} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Address</th>
                            <td>
                                <input name="upcusaddress" id="upcusaddress" value={this.state.upcusaddress} onChange={this.handleUpChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Zip</th>
                            <td>
                                <input name="upcuszip" id="upcuszip" value={this.state.upcuszip} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Credit</th>
                            <td>
                                <input name="upcuscredit" id="upcuscredit" value={this.state.upcuscredit} onChange={this.handleUpChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Email</th>
                            <td>
                                <input name="upcusemail" id="upcusemail" value={this.state.upcusemail} onChange={this.handleUpChange} />
                            </td>
                        </tr>   
                        <tr>
                            <th>Participant Status</th>
                            <td>
                                <input 
                                    type="radio"
                                    name="upcusparticipant"
                                    id="upcusparticipantyes"
                                    value="1"
                                    checked={this.state.upselectedOption === "1"}
                                    onChange={this.handleUpOptionChange}
                                    className="form-check-input"
                                />Regular Member
                                <input 
                                    type="radio"
                                    name="upcusparticipant"
                                    id="upcusparticipantno"
                                    value="0"
                                    checked={this.state.upselectedOption === "0"}
                                    onChange={this.handleUpOptionChange}
                                    className="form-check-input"
                                />Discount Member
                            </td>
                        </tr> 
                        <tr>
                            <th>Reward Level</th>
                            <td>
                                <SelectUpdateList data={this.state.updata} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            <br />
            <input
              type="hidden"
              name="upcusid"
              id="upcusid"
              onChange={this.handleUpChange}
            />
            <input type="submit" value="Update Customer" />
          </form>
        </div>
      </div>
    );
  },
});

var CustomerList = React.createClass({
    render: function () {
        var customerNodes = this.props.data.map(function (customer) {
            // Map the data to individual customers
            return (
                <Customer
                    customerid={customer.dbcustomerid}
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
  getInitialState: function () {
    return {
      upcusid: "",
      singledata: [],
    };
  },
  updateRecord: function (e) {
    e.preventDefault();
    var theupcusid = this.props.customerid;

    this.loadSingleCus(theupcusid);
  },
  loadSingleCus: function (theupcusid) {
    $.ajax({
      url: "/getsinglecus",
      data: {
        'upcusid': theupcusid,
      },
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ singledata: data });
        console.log(this.state.singledata);
        var populateCus = this.state.singledata.map(function (customer) {
          upcusid.value = theupcusid;
          upcusemail.value = customer.dbcustomeremail;
          upcusaddress.value = customer.dbcustomeraddress;
          upcuszip.value = customer.dbcustomerzip;
          upcuscredit.value = customer.dbcustomercredit;
          upcusname.value = customer.dbcustomername;
          upcustype.value = customer.dbcustreward;
          if (customer.dbcustparticipant == 1) {
            upcusparticipantyes.checked = true;
          } else {
            upcusparticipantno.checked = true;
          }
          
        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

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
                    {this.props.customerid} 
                </td>
                <td>
                    {this.props.customername}
                </td>
                <td>
                    {this.props.customeremail}
                </td>
        <td>
          <form onSubmit={this.updateRecord}>
            <input type="submit" value="Update Record" />
          </form>
        </td>
      </tr>
    );
  },
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

var SelectUpdateList = React.createClass({
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
        <select name="upcustype" id="upcustype">
          <option value="0"></option>
          {optionNodes}
        </select>
      );
    },
  });

ReactDOM.render(<CustomerBox />, document.getElementById("content"));
