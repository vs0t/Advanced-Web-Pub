var CourseSearchBox2 = React.createClass({
    getInitialState: function() {
      return {
        data: [], // Initialize with an empty array
        filteredData: [],
        faculty: '',
        coursePrefix: '',
        courseNumber: ''
      };
    },
    componentDidMount: function() {
      // Fetch data from the server (replace with your server URL)
      fetch('/api/courseinfo')
        .then((response) => response.json())
        .then((data) => {
          this.setState({ data }, this.applySearchFilter);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    },
    handleInputChange: function(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
      },
    
      handleSubmit: function(event) {
        event.preventDefault(); // prevent the default form submission

            // Validation for Faculty: must be only letters
        if (this.state.faculty && !/^[A-Za-z\s]+$/.test(this.state.faculty)) {
          alert("Faculty must contain letters only.");
          return; // Stop the function if validation fails
  }
    
        // validation for Course Prefix must be only letters and between 2 to 4 characters
        if (this.state.coursePrefix && (!/^[A-Za-z]+$/.test(this.state.coursePrefix) || this.state.coursePrefix.length < 2 || this.state.coursePrefix.length > 4)) {
            alert("Course Prefix must be letters only and between 2 to 4 characters long.");
            return; // stop the function if validation fails
        }
    
        // validation for Course Number must be a number and between 2 to 4 digits
        if (this.state.courseNumber && (this.state.courseNumber.toString().length < 2 || this.state.courseNumber.toString().length > 4)) {
            alert("Course Number must be a number between 2 to 4 digits long.");
            return; // stop the function if validation fails
        }
    
        this.applySearchFilter(); // apply filter only if all validations pass
    },    
    applySearchFilter: function() {
        const { faculty, coursePrefix, courseNumber } = this.state;
        const filteredData = this.state.data.filter((course) => {
          return (
            (faculty === '' || (course.Faculty && course.Faculty.toLowerCase().includes(faculty.toLowerCase()))) &&
            (coursePrefix === '' || (course['Course Prefix'] && course['Course Prefix'].toLowerCase().includes(coursePrefix.toLowerCase()))) &&
            (courseNumber === '' || course['Course Number'].toString().includes(courseNumber))
          );
        });
        this.setState({ filteredData: filteredData });
      },
      
    render: function() {
      return (
        <div className="courseSearchBox">
          <h1>View Course Info</h1>
          <form onSubmit={this.handleSubmit}>
            <input
              name="faculty"
              type="text"
              placeholder="Faculty"
              value={this.state.faculty}
              onChange={this.handleInputChange}
            />
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
    }
  });

var CourseList = React.createClass({
    render: function() {
        const courseNodes = this.props.data.map((course, index) => (
            <tr key={index}>
              <td>{course.Faculty}</td>
              <td>{course.Semester}</td>
              <td>{course.Year}</td>
              <td>{course['Course Prefix']}</td>
              <td>{course['Course Number']}</td>
              <td>{course.Section}</td> {/* Include Section */}
              <td>{course['Class Description']}</td> {/* Include Class Description */}
            </tr>
          ));
          

      return (
        <table>
          <thead>
            <tr>
              <th>Faculty</th>
              <th>Semester</th>
              <th>Year</th>
              <th>Course Prefix</th>
              <th>Course Number</th>
              <th>Section</th> {/* Table header for Section */}
              <th>Class Description</th> {/* Table header for Class Description */}
            </tr>
          </thead>
          <tbody>{courseNodes}</tbody>
        </table>
      );
    }
  });

ReactDOM.render(<CourseSearchBox2 />, document.getElementById('content'));
