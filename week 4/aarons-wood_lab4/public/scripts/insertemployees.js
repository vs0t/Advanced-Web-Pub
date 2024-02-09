var EmployeeBox = React.createClass({
    handleEmployeeSubmit: function (employee) {

        $.ajax({
            url: '/employee',
            dataType: 'json',
            type: 'POST',
            data: employee,
            success: function (data) {
                this.setState({ data: data });
            }.bind(this),
            error:function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function () {
        return (
            <div className="EmployeeBox">
                <h1>Employees</h1>
                <Employeeform2 onEmployeeSubmit={this.handleEmployeeSubmit}/>
            </div>
        );
    }
});

var Employeeform2 = React.createClass({
    getInitialState: function () {
        return {
            employeeid: "",
            employeename: "",
            employeeemail: "",
            employeephone: "",
            employeesalary: "",
            employeeMailer: "",
            data: []
        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    loadEmpTypes: function() {
        $.ajax({
            url: '/getemptypes',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ data: data });
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadEmpTypes();
    },

    handleSubmit: function (e) {
        e.preventDefault();
        
        var employeeid = this.state.employeeid.trim();
        var employeename = this.state.employeename.trim();
        var employeeemail = this.state.employeeemail.trim();
        var employeephone = this.state.employeephone.trim();
        var employeesalary = this.state.employeesalary;
        var employeemailer = this.state.selectedOption;
        var employeetype = emptype.value;
      
        if (!this.validateEmail(employeeemail)) {
          console.log("Bad Email " + this.validateEmail(employeeemail));
          return;
        }
        
        if (isNaN(employeesalary)) {
          console.log("Not a number " + employeesalary);
          return;
        }
        
        if (!employeeemail || !employeesalary || !employeename) {
          console.log("Field Missing");
          return;
        }
        
        this.props.onEmployeeSubmit({
          employeeid: employeeid,
          employeename: employeename,
          employeeemail: employeeemail,
          employeephone: employeephone,
          employeesalary: employeesalary,
          employeemailer: employeemailer,
          employeetype: employeetype
        });
      },

    validateEmail: function (value) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
            <form className="EmployeeForm" onSubmit={this.handleSubmit}>
                <h2>Employees</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Employee ID</th>
                            <td>
                                <TextInput
                                    value={this.state.employeeid}
                                    uniqueName="employeeid"
                                    textArea={false}
                                    required={true}
                                    minCharacters={6}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'employeeid')}
                                    // errorMessage="Employee ID is invalid"
                                    // emptyMessage="Employee ID is required" 
                                    />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee Name</th>
                            <td>
                                <TextInput
                                    value={this.state.employeename}
                                    uniqueName="employeename"
                                    textArea={false}
                                    required={false}
                                    minCharacters={6}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'employeename')}
                                    errorMessage="Employee Name is invalid" />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee E-Mail</th>
                            <td>
                                <TextInput
                                    value={this.state.employeeemail}
                                    uniqueName="employeeemail"
                                    textArea={false}
                                    required={true}
                                    validate={this.validateEmail}
                                    onChange={this.setValue.bind(this, 'employeeemail')}
                                    errorMessage="Invalid E-Mail Address"
                                    emptyMessage="E-Mail Address is Required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee Phone</th>
                            <td>
                                <TextInput
                                    value={this.state.employeephone}
                                    uniqueName="employeephone"
                                    textArea={false}
                                    required={false}
                                    minCharacters={6}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'employeephone')}
                                    errorMessage="Employee Phone is invalid" />
                            </td>
                        </tr>
                              <tr>
                            <th>Employee Salary</th>
                            <td>

                                <TextInput
                                    value={this.state.employeesalary}
                                    uniqueName="employeesalary"
                                    textArea={false}
                                    required={false}
                                    validate={this.validateDollars}
                                    onChange={this.setValue.bind(this, 'employeesalary')}
                                    errorMessage="Did not enter a correct salary value"
                                    emptyMessage="" />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                Join Mailing List
                            </th>
                            <td>
                                <input
                                    type="radio"
                                    name="empmailer"
                                    id="empmaileryes"
                                    value="1"
                                    checked={this.state.selectedOption === "1"}
                                    onChange={this.handleOptionChange}
                                    className="form-check-input"
                                />Yes
                                <input
                                    type="radio"
                                    name="empmailer"
                                    id="empmailerno"
                                    value="0"
                                    checked={this.state.selectedOption === "0"}
                                    onChange={this.handleOptionChange}
                                    className="form-check-input"
                                />No
                            </td>
                        </tr>
                        <tr>
                            <th>
                                Employee Type
                            </th>
                            <td>
                                <SelectList data={this.state.data} />
                            </td>
                        </tr>   
                    </tbody>
                </table>
                <input type="submit" value= "Insert Employee" />


            </form>
        );
    }
});

var SelectList = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (empTypes) {
            return (
                <option
                    key={empTypes.dbemptypeid}
                    value={empTypes.dbemptypeid}
                >
                    {empTypes.dbemptypename}
                </option>
            );
        });
        return (
            <select name="emptype" id="emptype">
                {optionNodes}
            </select>
        );
    }
});

var InputError = React.createClass({
    getInitialState: function () {
        return {
            message: 'Input is invalid'
        };
    },
    render: function () {
        var errorClass = classNames(this.props.className, {
            'error_container': true,
            'visible': this.props.visible,
            'invisible': !this.props.visible
        });

        return (
            <td> {this.props.errorMessage} </td>
        )
    }
});

var TextInput = React.createClass({
    getInitialState: function () {
        return {
            isEmpty: true,
            value: null,
            valid: false,
            errorMessage: "",
            errorVisible: false
        };
    },

    handleChange: function (event) {
        this.validation(event.target.value);

        if (this.props.onChange) {
            this.props.onChange(event);
        }
    },

    validation: function (value, valid) {
        if (typeof valid === 'undefined') {
            valid = true;
        }

        var message = "";
        var errorVisible = false;

        if (!valid) {
            message = this.props.errorMessage;
            valid = false;
            errorVisible = true;
        }
        else if (this.props.required && jQuery.isEmptyObject(value)) {
            message = this.props.emptyMessage;
            valid = false;
            errorVisible = true;
        }
        else if (value.length < this.props.minCharacters) {
            message = this.props.errorMessage;
            valid = false;
            errorVisible = true;
        }

        this.setState({
            value: value,
            isEmpty: jQuery.isEmptyObject(value),
            valid: valid,
            errorMessage: message,
            errorVisible: errorVisible
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
                        className={'input input-' + this.props.uniqueName}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        value={this.props.value} />

                    <InputError
                        visible={this.state.errorVisible}
                        errorMessage={this.state.errorMessage} />
                </div>
            );
        } else {
            return (
                <div className={this.props.uniqueName}>
                    <input
                        name={this.props.uniqueName}
                        id={this.props.uniqueName}
                        placeholder={this.props.text}
                        className={'input input-' + this.props.uniqueName}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        value={this.props.value} />

                    <InputError
                        visible={this.state.errorVisible}
                        errorMessage={this.state.errorMessage} />
                </div>
            );
        }
    }
});

ReactDOM.render(
    <EmployeeBox />,
    document.getElementById('content')
);
