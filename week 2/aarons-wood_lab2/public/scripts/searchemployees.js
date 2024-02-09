var EmployeeBox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadEmployeesFromServer: function () {
        console.log(employeeid.value),
        $.ajax({
            url: '/getemp',
            data: {
                'employeeid': employeeid.value,
                'employeename': employeename.value,
                'employeeemail': employeeemail.value,
                'employeephone': employeephone.value,
                'employeesalary': employeesalary.value,
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
            employeesalary: ""
        };
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var employeeid = this.state.employeeid.trim();
        var employeeemail = this.state.employeeemail.trim();
        var employeename = this.state.employeename.trim();
        var employeephone = this.state.employeephone.trim();
        var employeesalary = this.state.employeesalary;

        this.props.onEmployeeSubmit({ employeeid: employeeid, employeename: employeename, employeeemail: employeeemail, employeephone, employeephone, employeesalary, employeesalary });

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
        //display an individual donation
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
                </tr>
        );
    }
});


ReactDOM.render(
    <EmployeeBox />,
    document.getElementById('content')
);

