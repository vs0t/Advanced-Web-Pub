var CourseSearchBox2 = React.createClass({
  getInitialState: function () {
    return {
      data: [],
      filteredData: [],
      faculty: "",
      coursePrefix: "",
      courseNumber: "",
    };
  },
  componentDidMount: function () {
    this.fetchData(); // Call the fetchData function when the component mounts
  },
  fetchData: function () {
    // Fetch data from the server
    fetch("/showslocourses/")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ data, filteredData: data });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  },
  handleInputChange: function (event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  },
  handleSubmit: function (event) {
    event.preventDefault();
    // Validation logic...
    this.applySearchFilter();
  },
  applySearchFilter: function () {
    // Filtering logic...
  },
  render: function () {
    return (
      <div className="courseSearchBox">
        <h1>View Course Info</h1>
        <form onSubmit={this.handleSubmit}>
          {/* Input fields... */}
          {/* <button type="submit">Search</button> */}
        </form>
        <CourseList data={this.state.filteredData} />
      </div>
    );
  },
});

var CourseList = React.createClass({
  render: function () {
    const courseNodes = this.props.data.map((course, index) => (
      <tr key={index}>
        <td>{course.courseid}</td>
        <td>{course.courseprefix}</td>
        <td>{course.coursenumber}</td>
        <td>{course.coursesection}</td>
        <td>{course.coursesemester}</td>
        <td>{course.courseyear}</td>
        <td>{course.courseinstructor}</td>
        <td>{course.slo1_1}</td>
        <td>{course.slo1_2}</td>
        <td>{course.slo1_3}</td>
      </tr>
    ));

    return (
      <table>
        <thead>
          <tr>
            <th>| Course ID</th>
            <th>| Course Prefix</th>
            <th>| Course Number</th>
            <th>| Course Section</th>
            <th>| Course Semester</th>
            <th>| Course Year</th>
            <th>| Course Instructor</th>
            <th>| # of students for SLO 1.1</th>
            <th>| # of students for SLO 1.2</th>
            <th>| # of students for SLO 1.3</th>
          </tr>
        </thead>
        <tbody>{courseNodes}</tbody>
      </table>
    );
  },
});

ReactDOM.render(<CourseSearchBox2 />, document.getElementById("content"));
