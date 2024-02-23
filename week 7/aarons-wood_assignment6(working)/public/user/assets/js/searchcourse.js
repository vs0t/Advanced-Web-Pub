var CourseBox = React.createClass({
    getInitialState: function() {
        return {
            data: [],
            faculties: [], // Faculty data
            faculty: '', // Selected faculty
            semester: '',
            year: '',
            coursePrefix: '',
            courseNumber: '',
            courseSection: '',
        };
    },
    loadCoursesFromServer: function() {
        $.ajax({
            url: '/showcourses',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({ data: data });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error('/showcourses', status, err.toString());
            }.bind(this)
        });
    },
    loadFacultiesFromServer: function() {
        $.ajax({
            url: '/searchfac',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({ faculties: data });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error('/searchfac', status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function() {
        this.loadCoursesFromServer();
        this.loadFacultiesFromServer();
    },
    handleInputChange: function(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    },
    searchCourses: function() {
        var searchData = {
            faculty: this.state.faculty,
            semester: this.state.semester,
            year: this.state.year,
            coursePrefix: this.state.coursePrefix.toUpperCase(),
            courseNumber: this.state.courseNumber,
            courseSection: this.state.courseSection,
        };
        console.log("Search Data:", searchData);

        $.ajax({
            url: '/searchcourse',
            data: searchData,
            dataType: 'json',
            type: "GET",
            cache: false,
            success: function(data) {
                console.log("Search Result:", data);
                this.setState({ data: data });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error('/searchcourse', status, err.toString());
            }.bind(this)
        });
    },
    handleSubmit: function(event) {
        event.preventDefault();
        this.searchCourses();
    },
    render: function() {
        return (
            <div>
                <h1>Search Courses</h1>
                <form onSubmit={this.handleSubmit}>
                    <SelectList 
                        data={this.state.faculties} 
                        value={this.state.faculty} 
                        onChange={this.handleInputChange} 
                        name="faculty"
                    />
                    <select name="semester" value={this.state.semester} onChange={this.handleInputChange}>
                        <option value="">Select Semester</option>
                        <option value="Fall">Fall</option>
                        <option value="Spring">Spring</option>
                        <option value="Summer">Summer</option>
                    </select>
                    <select name="year" value={this.state.year} onChange={this.handleInputChange}>
                        <option value="">Select Year</option>
                        <option value="2020">2020</option>
                        <option value="2021">2021</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                    </select>
                    <input name="coursePrefix" type="text" placeholder="Course Prefix" value={this.state.coursePrefix} onChange={this.handleInputChange} />
                    <input name="courseNumber" type="number" placeholder="Course Number" value={this.state.courseNumber} onChange={this.handleInputChange} />
                    <input name="courseSection" type="text" placeholder="Course Section" value={this.state.courseSection} onChange={this.handleInputChange} />
                    <button type="submit">Search</button>
                </form>
                <table>
                    <thead>
                        <tr>
                            <th>Faculty</th>
                            <th>Semester</th>
                            <th>Year</th>
                            <th>Course Prefix</th>
                            <th>Course Number</th>
                            <th>Course Section</th>
                        </tr>
                    </thead>
                    <CourseList data={this.state.data} />
                </table>
            </div>
        );
    }
});

var CourseList = React.createClass({
    render: function() {
        var courseNodes = this.props.data.map(function(course) {
            return (
                <Course
                    key={course.id}
                    faculty={course.courseinstructor}
                    semester={course.coursesemester}
                    year={course.courseyear}
                    coursePrefix={course.courseprefix}
                    courseNumber={course.coursenumber}
                    courseSection={course.coursesection}
                />
            );
        });
        return (
            <tbody>
                {courseNodes}
            </tbody>
        );
    }
});

var Course = React.createClass({
    render: function() {
        return (
            <tr>
                <td>{this.props.faculty}</td>
                <td>{this.props.semester}</td>
                <td>{this.props.year}</td>
                <td>{this.props.coursePrefix}</td>
                <td>{this.props.courseNumber}</td>
                <td>{this.props.courseSection}</td>
            </tr>
        );
    }
});

var SelectList = React.createClass({
    handleChange: function(event) {
        // Call the passed in `onChange` handler from the parent component
        if (this.props.onChange) {
            this.props.onChange(event);
        }
    },
    render: function() {
        var optionNodes = this.props.data.map(function (faculty) {
            return (
                <option 
                    key={faculty.userid}
                    value={faculty.username}
                >
                    {faculty.username}
                </option>
            );
        });
        return (
            <select name={this.props.name} id={this.props.name} onChange={this.handleChange} value={this.props.value}>
                <option value="">Select Faculty</option>
                {optionNodes}
            </select>
        );
    }
});

ReactDOM.render(
    <CourseBox />,
    document.getElementById('content')
);
