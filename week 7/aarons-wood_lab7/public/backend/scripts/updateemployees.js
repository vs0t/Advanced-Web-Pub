var EmployeeBox = React.createClass({
  getInitialState: function () {
    return { data: [] };
  },
  loadEmployeesFromServer: function () {
    var emailervalue = 2;
    if (empmaileryes.checked) {
      emailervalue = 1;
    }
    if (empmailerno.checked) {
      emailervalue = 0;
    }
    console.log(emailervalue);
    $.ajax({
      url: "/getemp",
      data: {
        employeeid: employeeid.value,
        employeename: employeename.value,
        employeeemail: employeeemail.value,
        employeephone: employeephone.value,
        employeesalary: employeesalary.value,
        employeemailer: emailervalue,
        employeetype: emptype.value,
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
  updateSingleEmpFromServer: function (employee) {
    $.ajax({
      url: "/updatesingleemp",
      dataType: "json",
      data: employee,
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
    this.loadEmployeesFromServer();
    // setInterval(this.loadEmployeesFromServer, this.props.pollInterval);
  },

  render: function () {
    return (
      <div>
        <h1>Update Employees</h1>
        <Employeeform2 onEmployeeSubmit={this.loadEmployeesFromServer} />
        <br />
        <div id="theresults">
          <div id="theleft">
            <table>
              <thead>
                <tr>
                  <th>Key</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th></th>
                </tr>
              </thead>
              <EmployeeList data={this.state.data} />
            </table>
          </div>
          <div id="theright">
            <EmployeeUpdateform
              onUpdateSubmit={this.updateSingleEmpFromServer}
            />
          </div>
        </div>
      </div>
    );
  },
});

var Employeeform2 = React.createClass({
  getInitialState: function () {
    return {
      employeekey: "",
      employeeid: "",
      employeename: "",
      employeeemail: "",
      employeephone: "",
      employeesalary: "",
      employeeMailer: "",
      data: [],
    };
  },
  handleOptionChange: function (e) {
    this.setState({
      selectedOption: e.target.value,
    });
  },
  loadEmpTypes: function () {
    $.ajax({
      url: "/getemptypes",
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
    this.loadEmpTypes();
  },

  handleSubmit: function (e) {
    e.preventDefault();

    var employeeid = this.state.employeeid.trim();
    var employeeemail = this.state.employeeemail.trim();
    var employeename = this.state.employeename.trim();
    var employeephone = this.state.employeephone.trim();
    var employeesalary = this.state.employeesalary;
    var employeemailer = this.state.selectedOption;
    var employeetype = emptype.value;

    this.props.onEmployeeSubmit({
      employeeid: employeeid,
      employeename: employeename,
      employeeemail: employeeemail,
      employeephone: employeephone,
      employeesalary: employeesalary,
      employeemailer: employeemailer,
      employeetype: employeetype,
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
            <h2>Employees</h2>
            <table>
              <tbody>
                <tr>
                  <th>Employee ID</th>
                  <td>
                    <input
                      type="text"
                      name="employeeid"
                      id="employeeid"
                      value={this.state.employeeid}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Employee Name</th>
                  <td>
                    <input
                      name="employeename"
                      id="employeename"
                      value={this.state.employeename}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Employee Email</th>
                  <td>
                    <input
                      name="employeeemail"
                      id="employeeemail"
                      value={this.state.employeeemail}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Employee Phone</th>
                  <td>
                    <input
                      name="employeephone"
                      id="employeephone"
                      value={this.state.employeephone}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Employee Salary</th>
                  <td>
                    <input
                      name="employeesalary"
                      id="employeesalary"
                      value={this.state.employeesalary}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Join Mailing List</th>
                  <td>
                    <input
                      type="radio"
                      name="empmailer"
                      id="empmaileryes"
                      value="1"
                      checked={this.state.selectedOption === "1"}
                      onChange={this.handleOptionChange}
                      className="form-check-input"
                    />{" "}
                    YES
                    <input
                      type="radio"
                      name="empmailer"
                      id="empmailerno"
                      value="0"
                      checked={this.state.selectedOption === "0"}
                      onChange={this.handleOptionChange}
                      className="form-check-input"
                    />{" "}
                    NO
                  </td>
                </tr>
                <tr>
                  <th>Employee Type</th>
                  <td>
                    <SelectList data={this.state.data} />
                  </td>
                </tr>
              </tbody>
            </table>
            <input type="submit" value="Search Employee" />
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

var EmployeeUpdateform = React.createClass({
  getInitialState: function () {
    return {
      upemployeekey: "",
      upemployeeid: "",
      upemployeename: "",
      upemployeeemail: "",
      upemployeephone: "",
      upemployeesalary: "",
      upemployeeMailer: "",
      upselectedOption: "",
      updata: [],
    };
  },
  handleUpOptionChange: function (e) {
    this.setState({
      upselectedOption: e.target.value,
    });
  },
  loadEmpTypes: function () {
    $.ajax({
      url: "/getemptypes",
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
    this.loadEmpTypes();
  },
  handleUpSubmit: function (e) {
    e.preventDefault();

    var upemployeekey = upempkey.value;
    var upemployeeid = upempid.value;
    var upemployeeemail = upempemail.value;
    var upemployeename = upempname.value;
    var upemployeephone = upempphone.value;
    var upemployeesalary = upempsalary.value;
    var upemployeemailer = this.state.upselectedOption;
    var upemployeetype = upemptype.value;

    this.props.onUpdateSubmit({
      upemployeekey: upemployeekey,
      upemployeeid: upemployeeid,
      upemployeename: upemployeename,
      upemployeeemail: upemployeeemail,
      upemployeephone: upemployeephone,
      upemployeesalary: upemployeesalary,
      upemployeemailer: upemployeemailer,
      upemployeetype: upemployeetype,
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
                  <th>Employee ID</th>
                  <td>
                    <input
                      type="text"
                      name="upempid"
                      id="upempid"
                      value={this.state.upempid}
                      onChange={this.handleUpChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Employee Name</th>
                  <td>
                    <input
                      name="upempname"
                      id="upempname"
                      value={this.state.upempname}
                      onChange={this.handleUpChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Employee Email</th>
                  <td>
                    <input
                      name="upempemail"
                      id="upempemail"
                      value={this.state.upempemail}
                      onChange={this.handleUpChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Employee Phone</th>
                  <td>
                    <input
                      name="upempphone"
                      id="upempphone"
                      value={this.state.upempphone}
                      onChange={this.handleUpChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Employee Salary</th>
                  <td>
                    <input
                      name="upempsalary"
                      id="upempsalary"
                      value={this.state.upempsalary}
                      onChange={this.handleUpChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Join Mailing List</th>
                  <td>
                    <input
                      type="radio"
                      name="upempmailer"
                      id="upempmaileryes"
                      value="1"
                      checked={this.state.upselectedOption === "1"}
                      onChange={this.handleUpOptionChange}
                      className="form-check-input"
                    />
                    Yes
                    <input
                      type="radio"
                      name="upempmailer"
                      id="upempmailerno"
                      value="0"
                      checked={this.state.upselectedOption === "0"}
                      onChange={this.handleUpOptionChange}
                      className="form-check-input"
                    />
                    No
                  </td>
                </tr>
                <tr>
                  <th>Employee Type</th>
                  <td>
                    <SelectUpdateList data={this.state.updata} />
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <input
              type="hidden"
              name="upempkey"
              id="upempkey"
              onChange={this.handleUpChange}
            />
            <input type="submit" value="Update Employee" />
          </form>
        </div>
      </div>
    );
  },
});

var EmployeeList = React.createClass({
  render: function () {
    var employeeNodes = this.props.data.map(function (employee) {
      return (
        <Employee
          key={employee.dbemployeekey}
          empkey={employee.dbemployeekey}
          empid={employee.dbemployeeid}
          empname={employee.dbemployeename}
          empemail={employee.dbemployeeemail}
        ></Employee>
      );
    });

    //print all the nodes in the list
    return <tbody>{employeeNodes}</tbody>;
  },
});

var Employee = React.createClass({
  getInitialState: function () {
    return {
      upempkey: "",
      singledata: [],
    };
  },
  updateRecord: function (e) {
    e.preventDefault();
    var theupempkey = this.props.empkey;

    this.loadSingleEmp(theupempkey);
  },
  loadSingleEmp: function (theupempkey) {
    $.ajax({
      url: "/getsingleemp",
      data: {
        upempkey: theupempkey,
      },
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ singledata: data });
        console.log(this.state.singledata);
        var populateEmp = this.state.singledata.map(function (employee) {
          upempkey.value = theupempkey;
          upempemail.value = employee.dbemployeeemail;
          upempid.value = employee.dbemployeeid;
          upempphone.value = employee.dbemployeephone;
          upempsalary.value = employee.dbemployeesalary;
          upempname.value = employee.dbemployeename;
          if (employee.dbemployeemailer == 1) {
            upempmaileryes.checked = true;
          } else {
            upempmailerno.checked = true;
          }
          upemptype.value = employee.dbemployeetype;
        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  render: function () {
    if (this.props.empmailer == 1) {
      var themailer = "YES";
    } else {
      var themailer = "NO";
    }

    return (
      <tr>
        <td>{this.props.empkey}</td>
        <td>{this.props.empid}</td>
        <td>{this.props.empname}</td>
        <td>{this.props.empemail}</td>
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
    var optionNodes = this.props.data.map(function (empTypes) {
      return (
        <option key={empTypes.dbemptypeid} value={empTypes.dbemptypeid}>
          {empTypes.dbemptypename}
        </option>
      );
    });
    return (
      <select name="emptype" id="emptype">
        <option value="0"></option>
        {optionNodes}
      </select>
    );
  },
});

var SelectUpdateList = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (empTypes) {
      return (
        <option key={empTypes.dbemptypeid} value={empTypes.dbemptypeid}>
          {empTypes.dbemptypename}
        </option>
      );
    });
    return (
      <select name="upemptype" id="upemptype">
        <option value="0"></option>
        {optionNodes}
      </select>
    );
  },
});

ReactDOM.render(<EmployeeBox />, document.getElementById("content"));
