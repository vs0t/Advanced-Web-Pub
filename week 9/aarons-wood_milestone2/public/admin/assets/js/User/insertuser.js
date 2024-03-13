var CustomerBox = React.createClass({
  handleCustomerSubmit: function (customer) {
    $.ajax({
      url: "/insertuser",
      dataType: "json",
      type: "POST",
      data: customer,
      success: function (data) {
        this.setState({ data: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  render: function () {
    return (
      <div className="CustomerBox">
        {/* <h1>Users</h1> */}
        <Customerform2 onCustomerSubmit={this.handleCustomerSubmit} />
      </div>
    );
  },
});

var Customerform2 = React.createClass({
  getInitialState: function () {
    return {
      customername: "",
      customerlastname: "",
      customeraddress: "",
      customerzip: "",
      customercity: "",
      customerstate: "",
      customeremail: "",
      customerpw: "",
      customerpw2: "",
      categoryData: [],
      roleData: [],
      userCat: "",
      userRole: "",
    };
  },
  handleOptionChange: function (e) {
    this.setState({
      selectedOption: e.target.value,
    });
  },
  loadCatTypes: function () {
    $.ajax({
      url: "/getusercat",
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ categoryData: data });
      }.bind(this),
    });
  },
  loadRoleTypes: function () {
    $.ajax({
      url: "/getuserrole",
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ roleData: data });
      }.bind(this),
    });
  },
  handleCategoryChange: function (event) {
    this.setState({ userCat: event.target.value });
  },

  //   handleRoleChange: function (event) {
  //     this.setState({ userRole: event.target.value });
  //   },

  handleRoleChange: function (selectedRole) {
    this.setState({ userRole: selectedRole });
  },

  componentDidMount: function () {
    this.loadCatTypes();
    this.loadRoleTypes();
  },

  handleSubmit: function (e) {
    e.preventDefault();

    var customername = this.state.customername.trim();
    var userlastname = this.state.userlastname.trim();
    var customeraddress = this.state.customeraddress.trim();
    var customerzip = this.state.customerzip.trim();
    var customercredit = this.state.customercredit;
    var usercity = this.state.usercity;
    var userstate = this.state.userstate;
    var customeremail = this.state.customeremail.trim();
    var customerpw = this.state.customerpw.trim();
    var customerpw2 = this.state.customerpw2.trim();
    //   var customerrewards = custreward.value;
    var userCat = this.state.userCat;
    var userRole = this.state.userRole;

    console.log("PW: " + customerpw);

    if (!this.validateEmail(customeremail)) {
      console.log("Bad Email " + this.validateEmail(customeremail));
      return;
    }

    if (!customername || !customeremail) {
      console.log("Field Missing");
      return;
    }

    if (customerpw != customerpw2) {
      alert("Passwords do not match.");
      return;
    }

    this.props.onCustomerSubmit({
      customername: customername,
      userlastname: userlastname,
      customeraddress: customeraddress,
      usercity: usercity,
      userstate: userstate,
      customerzip: customerzip,
      customeremail: customeremail,
      customerpw: customerpw,
      userCat: userCat,
      userRole: userRole,
    });
  },

  validateEmail: function (value) {
    var re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
  },
  validateDollars: function (value) {
    var regex = /^\$?[0-9]+(\.[0-9][0-9])?$/;
    return regex.test(value);
  },
  commonValidate: function () {
    return true;
  },
  setValue: function (field, event) {
    var object = {};
    object[field] = event.target.value;
    this.setState(object);
  },
  render: function () {
    return (
      <form className="customerForm" onSubmit={this.handleSubmit}>
        <h2>User Information Area</h2>
        <table>
          <tbody>
            <tr>
              <th>User First Name</th>
              <td>
                <TextInput
                  value={this.state.customername}
                  uniqueName="customername"
                  textArea={false}
                  required={true}
                  minCharacters={1}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "customername")}
                  errorMessage="Customer Name is invalid"
                  emptyMessage="Customer Name is required"
                />
              </td>
            </tr>
            <tr>
              <th>User Last Name</th>
              <td>
                <TextInput
                  value={this.state.userlastname}
                  uniqueName="userlastname"
                  textArea={false}
                  required={true}
                  minCharacters={1}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "userlastname")}
                  errorMessage="Customer Name is invalid"
                  emptyMessage="Customer Name is required"
                />
              </td>
            </tr>
            <tr>
              <th>User Address</th>
              <td>
                <TextInput
                  value={this.state.customeraddress}
                  uniqueName="customeraddress"
                  textArea={false}
                  required={false}
                  minCharacters={6}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "customeraddress")}
                  errorMessage="Customer Address is invalid"
                />
              </td>
            </tr>
            <tr>
              <th>User City</th>
              <td>
                <TextInput
                  value={this.state.usercity}
                  uniqueName="usercity"
                  textArea={false}
                  required={false}
                  minCharacters={6}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "usercity")}
                  errorMessage="Customer Address is invalid"
                />
              </td>
            </tr>
            <tr>
              <th>User Zip</th>
              <td>
                <TextInput
                  value={this.state.customerzip}
                  uniqueName="customerzip"
                  textArea={false}
                  required={false}
                  minCharacters={5}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "customerzip")}
                  errorMessage=""
                  emptyMessage=""
                />
              </td>
            </tr>
            <tr>
              <th>User State</th>
              <td>
                <TextInput
                  value={this.state.userstate}
                  uniqueName="userstate"
                  textArea={false}
                  minCharacters={2}
                  required={false}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "userstate")}
                  errorMessage=""
                  emptyMessage=""
                />
              </td>
            </tr>
            <tr>
              <th>Customer E-Mail</th>
              <td>
                <TextInput
                  value={this.state.customeremail}
                  uniqueName="customeremail"
                  textArea={false}
                  minCharacters={1}
                  required={true}
                  validate={this.validateEmail}
                  onChange={this.setValue.bind(this, "customeremail")}
                  errorMessage="Invalid E-Mail Address"
                  emptyMessage="E-Mail Address is Required"
                />
              </td>
            </tr>
            <tr>
              <th>Customer Password</th>
              <td>
                <TextInput
                  inputType="password"
                  value={this.state.customerpw}
                  uniqueName="customerpw"
                  textArea={false}
                  required={true}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "customerpw")}
                  errorMessage="Invalid Password"
                  emptyMessage="Password is Required"
                />
              </td>
            </tr>
            <tr>
              <th>Customer Password Confirm</th>
              <td>
                <TextInput
                  inputType="password"
                  value={this.state.customerpw2}
                  uniqueName="customerpw2"
                  textArea={false}
                  required={true}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "customerpw2")}
                  errorMessage="Invalid Password"
                  emptyMessage="Password is Required"
                />
              </td>
            </tr>
            <tr>
              <th>Catagory</th>
              <td>
                <SelectList
                  data={this.state.categoryData}
                  onChange={this.handleCategoryChange}
                />
              </td>
            </tr>
            <tr>
              <th>Role</th>
              <td>
                <SelectList2
                  data={this.state.roleData}
                  onRoleChange={this.handleRoleChange}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="Insert Customer" />
      </form>
    );
  },
});

var SelectList = React.createClass({
  handleChange: function (event) {
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  },
  render: function () {
    return (
      <select name="userCat" id="userCat" onChange={this.handleChange}>
                <option value="">No Catagory</option>
        {this.props.data.map(function (cusParticipant) {
          return (
            <option
              key={cusParticipant.CatagoryID}
              value={cusParticipant.CatagoryID}
            >
              {cusParticipant.CatagoryName}
            </option>
          );
        })}
      </select>
    );
  },
});

var SelectList2 = React.createClass({
  handleChange: function (event) {
    const selectedRoleId = event.target.value;

    if (this.props.onRoleChange) {
      this.props.onRoleChange(selectedRoleId);
    } else {
      console.error("onRoleChange prop not passed to SelectList2");
    }
  },

  render: function () {
    var optionNodes = this.props.data.map(function (cusParticipant) {
      return (
        <option key={cusParticipant.RoleID} value={cusParticipant.RoleID}>
          {cusParticipant.RoleName}
        </option>
      );
    });
    return (
      <select name="userRole" id="userRole" onChange={this.handleChange}>
        <option value="">No Role</option>
        {optionNodes}
      </select>
    );
  },
});

var InputError = React.createClass({
  getInitialState: function () {
    return {
      message: "Input is invalid",
    };
  },
  render: function () {
    var errorClass = classNames(this.props.className, {
      error_container: true,
      visible: this.props.visible,
      invisible: !this.props.visible,
    });

    return <td> {this.props.errorMessage} </td>;
  },
});

var TextInput = React.createClass({
  getInitialState: function () {
    return {
      isEmpty: true,
      value: null,
      valid: false,
      errorMessage: "",
      errorVisible: false,
    };
  },

  handleChange: function (event) {
    this.validation(event.target.value);

    if (this.props.onChange) {
      this.props.onChange(event);
    }
  },

  validation: function (value, valid) {
    if (typeof valid === "undefined") {
      valid = true;
    }

    var message = "";
    var errorVisible = false;

    if (!valid) {
      message = this.props.errorMessage;
      valid = false;
      errorVisible = true;
    } else if (this.props.required && jQuery.isEmptyObject(value)) {
      message = this.props.emptyMessage;
      valid = false;
      errorVisible = true;
    } else if (value.length < this.props.minCharacters) {
      message = this.props.errorMessage;
      valid = false;
      errorVisible = true;
    }

    this.setState({
      value: value,
      isEmpty: jQuery.isEmptyObject(value),
      valid: valid,
      errorMessage: message,
      errorVisible: errorVisible,
    });
  },

  handleBlur: function (event) {
    var valid = this.props.validate(event.target.value);
    this.validation(event.target.value, valid);
  },
  render: function () {
    if (this.props.textArea) {
      return (
        <div className={this.props.uniqueName}>
          <textarea
            placeholder={this.props.text}
            className={"input input-" + this.props.uniqueName}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            value={this.props.value}
          />

          <InputError
            visible={this.state.errorVisible}
            errorMessage={this.state.errorMessage}
          />
        </div>
      );
    } else {
      return (
        <div className={this.props.uniqueName}>
          <input
            type={this.props.inputType}
            name={this.props.uniqueName}
            id={this.props.uniqueName}
            placeholder={this.props.text}
            className={"input input-" + this.props.uniqueName}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            value={this.props.value}
          />

          <InputError
            visible={this.state.errorVisible}
            errorMessage={this.state.errorMessage}
          />
        </div>
      );
    }
  },
});

ReactDOM.render(<CustomerBox />, document.getElementById("content"));
