var CourseSearchBox = React.createClass({
  getInitialState: function () {
    return {
      data: [],
      filteredData: [],
      faculty: "",
      semester: "",
      year: "",
      coursePrefix: "",
      courseNumber: "",
    };
  },
  loadCoursesFromServer: function () {
    $.ajax({
      url: this.props.url,
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ data: data }, this.applySearchFilter);
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  componentDidMount: function () {
    this.loadCoursesFromServer();
  },
  handleInputChange: function (event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  },
  handleSubmit: function (event) {
    event.preventDefault();

    // validation for Course Prefix must be only letters and between 2 to 4 characters
    if (
      this.state.coursePrefix &&
      (!/^[A-Za-z]+$/.test(this.state.coursePrefix) ||
        this.state.coursePrefix.length < 2 ||
        this.state.coursePrefix.length > 4)
    ) {
      alert(
        "Course Prefix must be letters only and between 2 to 4 characters long."
      );
      return; // stop the function if validation fails
    }

    // validation for Course Number must be a number and between 2 to 4 digits
    if (
      this.state.courseNumber &&
      (this.state.courseNumber.length < 2 ||
        this.state.courseNumber.length > 4 ||
        !/^\d+$/.test(this.state.courseNumber))
    ) {
      alert("Course Number must be a number between 2 to 4 digits long.");
      return; // stop the function if validation fails
    }

    this.applySearchFilter(); // apply filter only if all validations pass
  },

  applySearchFilter: function () {
    var filteredData = this.state.data.filter((course) => {
      return (
        (this.state.faculty === "" ||
          course.faculty.includes(this.state.faculty)) &&
        (this.state.semester === "" ||
          course.semester.includes(this.state.semester)) &&
        (this.state.year === "" ||
          course.year.toString().includes(this.state.year)) &&
        (this.state.coursePrefix === "" ||
          course.coursePrefix.includes(
            this.state.coursePrefix.toUpperCase()
          )) &&
        (this.state.courseNumber === "" ||
          course.courseNumber.toString().includes(this.state.courseNumber))
      );
    });
    this.setState({ filteredData: filteredData });
  },
  render: function () {
    return (
      <div className="courseSearchBox">
        <h1>Search Courses to Email</h1>
        <form onSubmit={this.handleSubmit}>
          <select
            name="faculty"
            value={this.state.faculty}
            onChange={this.handleInputChange}
          >
            <option value="">Select Faculty</option>
            <option value="carmon">Professor Carmon</option>
            <option value="timmons">Professor Timmons</option>
          </select>
          <select
            name="semester"
            value={this.state.semester}
            onChange={this.handleInputChange}
          >
            <option value="">Select Semester</option>
            <option value="Fall">Fall</option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
          </select>
          <select
            name="year"
            value={this.state.year}
            onChange={this.handleInputChange}
          >
            <option value="">Select Year</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
          <input
            name="coursePrefix"
            type="text"
            placeholder="Course Prefix"
            value={this.state.coursePrefix}
            onChange={this.handleInputChange}
          />
          <input
            name="courseNumber"
            type="number"
            placeholder="Course Number"
            value={this.state.courseNumber}
            onChange={this.handleInputChange}
          />
          <button type="submit">Search</button>
        </form>
        <CourseList data={this.state.filteredData} />
      </div>
    );
  },
});

var CourseList = React.createClass({
  render: function () {
    var courseNodes = this.props.data.map(function (course) {
      var emailBody = `Faculty: ${course.faculty}%0D%0ASemester: ${course.semester}%0D%0AYear: ${course.year}%0D%0ACourse Prefix: ${course.coursePrefix}%0D%0ACourse Number: ${course.courseNumber}`;
      var emailSubject = `Course Information: ${course.coursePrefix} ${course.courseNumber}`;
      var mailtoLink = `mailto:evanaaronswood@gmail.com?subject=${encodeURIComponent(
        emailSubject
      )}&body=${encodeURIComponent(emailBody)}`;

      return (
        <tr key={course.id}>
          <td>{course.faculty}</td>
          <td>{course.semester}</td>
          <td>{course.year}</td>
          <td>{course.coursePrefix}</td>
          <td>{course.courseNumber}</td>
          <td>
            <a href={mailtoLink} target="_blank">
              Email
            </a>
          </td>
        </tr>
      );
    });

    return (
      <table>
        <thead>
          <tr>
            <th>Faculty</th>
            <th>Semester</th>
            <th>Year</th>
            <th>Course Prefix</th>
            <th>Course Number</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{courseNodes}</tbody>
      </table>
    );
  },
});

ReactDOM.render(
  <CourseSearchBox url="/api/courses" pollInterval={20000} />,
  document.getElementById("content")
);
