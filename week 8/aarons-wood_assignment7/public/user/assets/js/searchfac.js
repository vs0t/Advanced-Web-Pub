var SearchFacultyBox = React.createClass({
    getInitialState: function() {
        return {
            data: [],
            facultyName: '',
            facultyEmail: '',
        };
    },
    // loadFacultiesFromServer: function() {
    //     $.ajax({
    //         url: '/searchfac', // Ensure this matches your server endpoint
    //         dataType: 'json',
    //         cache: false,
    //         success: function(data) {
    //             this.setState({ data: data });
    //         }.bind(this),
    //         error: function(xhr, status, err) {
    //             console.error('/searchfac', status, err.toString());
    //         }.bind(this)
    //     });
    // },
    componentDidMount: function() {
        // this.loadFacultiesFromServer();
    },
    handleInputChange: function(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    },
    searchFaculties: function() {
        var searchData = {
            facultyname: this.state.facultyName,
            facultyemail: this.state.facultyEmail,
        };
        console.log("Search Data:", searchData);

        $.ajax({
            url: '/searchfac',
            data: searchData,
            dataType: 'json',
            type: "GET",
            cache: false,
            success: function(data) {
                console.log("Search Result:", data);
                this.setState({ data: data });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error('/searchfac', status, err.toString());
            }.bind(this)
        });
    },
    handleSubmit: function(event) {
        event.preventDefault();
        this.searchFaculties();
    },
    render: function() {
        return (
            <div>
                <h1>Search Faculty</h1>
                <form onSubmit={this.handleSubmit}>
                    <input name="facultyName" type="text" placeholder="Faculty Name" value={this.state.facultyName} onChange={this.handleInputChange} />
                    <input name="facultyEmail" type="email" placeholder="Faculty Email" value={this.state.facultyEmail} onChange={this.handleInputChange} />
                    <button type="submit">Search</button>
                </form>
                <FacultyList data={this.state.data} />
            </div>
        );
    }
});

var FacultyList = React.createClass({
    render: function() {
        var facultyNodes = this.props.data.map(function(faculty) {
            return (
                <Faculty
                    key={faculty.userid}
                    name={faculty.username}
                    email={faculty.useremail}
                />
            );
        });
        return (
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {facultyNodes}
                </tbody>
            </table>
        );
    }
});

var Faculty = React.createClass({
    render: function() {
        return (
            <tr>
                <td>{this.props.name}</td>
                <td>{this.props.email}</td>
            </tr>
        );
    }
});



ReactDOM.render(
    <SearchFacultyBox />,
    document.getElementById('content') // Ensure this is the correct mount point in your HTML
);
