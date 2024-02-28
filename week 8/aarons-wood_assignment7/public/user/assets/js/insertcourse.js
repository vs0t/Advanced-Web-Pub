var InsertCourse = React.createClass({
  getInitialState: function () {
    return {
      faculty: "",
      faculties: [],
      semester: "",
      year: "",
      coursePrefix: "",
      courseNumber: "",
      section: "",
      validationError: "",
    };
  },
  loadFacultiesFromServer: function () {
    $.ajax({
      url: "/searchFaculty",
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ faculties: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error("/searchFaculty", status, err.toString());
      }.bind(this),
    });
  },
  componentDidMount: function () {
    this.loadFacultiesFromServer();
  },

  validateInput: function (coursePrefix, courseNumber, section) {
    // Course Prefix validation: letters only, less than 5 characters, more than 1 character
    if (
      !/^[A-Za-z]+$/.test(coursePrefix) ||
      coursePrefix.length >= 5 ||
      coursePrefix.length <= 1
    ) {
      return "Course Prefix must be letters only, less than 5 characters and more than 1 character.";
    }

    // Course Number validation: number only, more than 1 digit, less than 5 digits
    if (
      !/^\d+$/.test(courseNumber) ||
      courseNumber.length <= 1 ||
      courseNumber.length >= 5
    ) {
      return "Course Number must be a number, more than 1 digit and less than 5 digits.";
    }

    // Section validation: at least 2 characters/digits, less than 7 long
    if (section.length < 2 || section.length >= 7) {
      return "Section must have at least 2 characters/digits and be less than 7 characters long.";
    }

    // If all validations pass
    return "";
  },

  handleChange: function (event) {
    var stateUpdate = {};
    stateUpdate[event.target.name] = event.target.value;
    this.setState(stateUpdate);
  },

  handleSubmit: function (event) {
    event.preventDefault();
    var {
      faculty,
      semester,
      year,
      coursePrefix,
      courseNumber,
      section,
      faculties,
    } = this.state;

    // Initialize an array to hold missing field names
    var missingFields = [];

    // Check each field and add to the missingFields array if empty
    if (!faculty) missingFields.push("Faculty");
    if (!semester) missingFields.push("Semester");
    if (!year) missingFields.push("Year");
    if (!coursePrefix) missingFields.push("Course Prefix");
    if (!courseNumber) missingFields.push("Course Number");
    if (!section) missingFields.push("Section");

    // Check if there are any missing fields
    if (missingFields.length > 0) {
      // Create a string that lists all missing fields
      var missingFieldsStr = missingFields.join(", ");
      this.setState({
        validationError: `Please fill out the following field(s): ${missingFieldsStr}.`,
      });
      return;
    }

    // Validate input
    var validationError = this.validateInput(
      coursePrefix,
      courseNumber,
      section
    );
    if (validationError) {
      this.setState({ validationError });
      return;
    }

    // Proceed with AJAX call since validation passed
    var courseData = JSON.stringify({
      faculty: faculty,
      semester: semester,
      year: year,
      coursePrefix: coursePrefix,
      courseNumber: courseNumber,
      section: section,
      faculties: faculties,
    });

    // AJAX call to server to submit course data
    $.ajax({
      url: "/course",
      type: "POST",
      contentType: "application/json",
      data: courseData,
      success: function (data) {
        alert("Course inserted successfully!");
        console.log(data);
        this.setState(this.getInitialState());
      }.bind(this),
      error: function (xhr, status, err) {
        console.error("/course", status, err.toString());
      }.bind(this),
    });
  },

  render: function () {
    return (
      <div className="center-content">
        <h2>Insert Course</h2>
        <div className="data-entry">
          <form onSubmit={this.handleSubmit}>
            <table>
              <tbody>
                <tr>
                  <td>
                    <label htmlFor="faculty">Faculty:</label>
                  </td>
                  <td>
                  <SelectList 
                        data={this.state.faculties} 
                        value={this.state.faculty} 
                        onChange={this.handleChange} 
                        name="faculty"
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="semester">Semester:</label>
                  </td>
                  <td>
                    <select
                      name="semester"
                      value={this.state.semester}
                      onChange={this.handleChange}
                    >
                      <option value="">Please Select a Semester</option>
                      <option value="fall">Fall</option>
                      <option value="spring">Spring</option>
                      <option value="summer">Summer</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="year">Year:</label>
                  </td>
                  <td>
                    <select
                      name="year"
                      value={this.state.year}
                      onChange={this.handleChange}
                    >
                      <option value="">Please Select a Year</option>
                      <option value="2020">2020</option>
                      <option value="2021">2021</option>
                      <option value="2022">2022</option>
                      <option value="2023">2023</option>
                      <option value="2024">2024</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="coursePrefix">Course Prefix:</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      name="coursePrefix"
                      value={this.state.coursePrefix}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="courseNumber">Course Number:</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      name="courseNumber"
                      value={this.state.courseNumber}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="section">Section:</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      name="section"
                      value={this.state.section}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td colSpan="2">
                    <button type="submit">Insert</button>
                  </td>
                </tr>
              </tbody>
            </table>
            {this.state.validationError && (
              <p style={{ color: "red" }}>{this.state.validationError}</p>
            )}
          </form>
        </div>
      </div>
    );
  },
});

var SelectList = React.createClass({
  handleChange: function (event) {
    // Call the passed in `onChange` handler from the parent component
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  },
  render: function () {
    var optionNodes = this.props.data.map(function (faculty) {
      return (
        <option key={faculty.userid} value={faculty.username}>
          {faculty.username}
        </option>
      );
    });
    return (
      <select
        name={this.props.name}
        id={this.props.name}
        onChange={this.handleChange}
        value={this.props.value}
      >
        <option value="">Select Faculty</option>
        {optionNodes}
      </select>
    );
  },
});

ReactDOM.render(<InsertCourse />, document.getElementById("content"));
