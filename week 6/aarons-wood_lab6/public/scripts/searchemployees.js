var EmployeeBox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadEmployeesFromServer: function () {
        console.log(employeeid.value);
        var emailervalue = 2;
        if (empmaileryes.checked) {
            emailervalue = 1;
        }
        if (empmailerno.checked) {
            emailervalue = 0;
        }
        $.ajax({
            url: '/getemp',
            data: {
                'employeeid': employeeid.value,
                'employeename': employeename.value,
                'employeeemail': employeeemail.value,
                'employeephone': employeephone.value,
                'employeesalary': employeesalary.value,
                'employeemailer': emailervalue,
                'employeetype': emptype.value
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
        this.loadEmployeesFromServer();
       // setInterval(this.loadEmployeesFromServer, this.props.pollInterval);
    },

    render: function () {
        return (
            <div>
                <h1>Employees</h1>
                <Employeeform2 onEmployeeSubmit={this.loadEmployeesFromServer} />
                <br />
                <table>
                        <thead>
                            <tr>
                                <th>Key</th>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Salary</th>
                                <th>Mailing List</th>
                                <th>Type</th>
                            </tr>
                         </thead>
                        <EmployeeList data={this.state.data} />
                    </table>
                
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
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
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
        var employeetype = this.state.employeetype;

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
    handleChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    },
    render: function () {

        return (
            <form onSubmit={this.handleSubmit}>
                <h2>Employees</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Employee ID</th>
                            <td>
                                <input type="text" name="employeeid" id="employeeid" value={this.state.employeeid} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee Name</th>
                            <td>
                                <input name="employeename" id="employeename" value={this.state.employeename} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee Email</th>
                            <td>
                                <input name="employeeemail" id="employeeemail" value={this.state.employeeemail} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee Phone</th>
                            <td>
                                <input name="employeephone" id="employeephone" value={this.state.employeephone} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Employee Salary</th>
                            <td>
                                <input name="employeesalary" id="employeesalary" value={this.state.employeesalary} onChange={this.handleChange} />
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
                            </td>
                            <td>
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
                <input type="submit" value="Search Employee" />

            </form>
        );
    }
});

var EmployeeList = React.createClass({
    render: function () {
        var employeeNodes = this.props.data.map(function (employee) {
            //map the data to individual donations
            return (
                <Employee
                    key={employee.dbemployeekey}
                    empkey={employee.dbemployeekey}
                    empid={employee.dbemployeeid}
                    empname={employee.dbemployeename}
                    empemail={employee.dbemployeeemail}
                    empphone={employee.dbemployeephone}
                    empsalary={employee.dbemployeesalary}
                    empmailer={employee.dbemployeemailer}
                    emptype={employee.dbemployeetype}
                >
                </Employee>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {employeeNodes}
            </tbody>
        );
    }
});



var Employee = React.createClass({

    render: function () {
        if (this.props.empmailer == 1) {
            var themailer = "YES";
        } else {
            var themailer = "NO";
        }
        if (this.props.emptype === 1) {
            var thetype = "Manager";
        } else if (this.props.emptype === 2) {
            var thetype = "Staff";
        } else {
            var thetype = "Unknown"; 
        }

        return (

            <tr>
                            <td>
                                {this.props.empkey} 
                            </td>
                            <td>
                                {this.props.empid}
                            </td>
                            <td>
                                {this.props.empname}
                            </td>
                            <td>
                                {this.props.empemail}
                            </td>
                            <td>
                                {this.props.empphone}
                            </td>
                            <td>
                                {this.props.empsalary}
                            </td>
                            <td>
                                {themailer}
                            </td>
                            <td>
                                {thetype}
                            </td>
                </tr>
        );
    }
});

var SelectList = React.createClass({
    render: function() {
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
                <option value = "0"></option>
                {optionNodes}
            </select>
        );
    }
});

ReactDOM.render(
    <EmployeeBox />,
    document.getElementById('content')
);

