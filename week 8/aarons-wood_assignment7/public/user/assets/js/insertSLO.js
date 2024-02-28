// Assuming React and ReactDOM are properly imported

// CourseBox Component: Parent component that fetches and displays courses
var CourseBox = React.createClass({
    getInitialState: function() {
      return {
        courses: [],
        selectedCourseId: null,
        selectedFaculty: null,
      };
    },
    componentDidMount: function() {
      this.fetchCourses();
    },
    fetchCourses: function() {
      fetch('/showcourses/')
        .then(response => response.json())
        .then(data => this.setState({ courses: data }))
        .catch(error => console.error('Error fetching courses:', error));
    },
    selectCourse: function(courseId, faculty) {
      this.setState({
        selectedCourseId: courseId,
        selectedFaculty: faculty,
      });
    },
    render: function() {
      return (
        <div>
          <h1>Course SLO Update</h1>
          <CourseList courses={this.state.courses} onSelectCourse={this.selectCourse} />
          {this.state.selectedCourseId && (
            <SLOUpdateForm courseId={this.state.selectedCourseId} faculty={this.state.selectedFaculty} />
          )}
        </div>
      );
    }
  });
  
  // CourseList Component: Lists courses with an update button
  var CourseList = React.createClass({
    render: function() {
      var courseNodes = this.props.courses.map(course => (
        <Course
          key={course.courseid}
          course={course}
          onSelectCourse={this.props.onSelectCourse}
        />
      ));
      return (
        <div>
          <table>
            <thead>
              <tr>
                <th>Course ID</th>
                <th>Prefix</th>
                <th>Number</th>
                <th>Faculty</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{courseNodes}</tbody>
          </table>
        </div>
      );
    }
  });
  
  // Course Component: Displays a single course row
  var Course = React.createClass({
    handleClick: function() {
      this.props.onSelectCourse(this.props.course.courseid, this.props.course.courseinstructor);
    },
    render: function() {
      const { courseid, courseprefix, coursenumber, courseinstructor } = this.props.course;
      return (
        <tr>
          <td>{courseid}</td>
          <td>{courseprefix}</td>
          <td>{coursenumber}</td>
          <td>{courseinstructor}</td>
          <td><button onClick={this.handleClick}>Update SLO</button></td>
        </tr>
      );
    }
  });
  
  // SLOUpdateForm Component: Form for updating SLO information of a selected course
  var SLOUpdateForm = React.createClass({
    getInitialState: function() {
      return {
        sloDesc: '',
        slo1_1: '',
        slo1_2: '',
        slo1_3: '',
      };
    },
    handleSubmit: function(event) {
      event.preventDefault();
      const sloData = {
        slo_id: this.props.courseId,
        slo_desc: this.state.sloDesc,
        slo1_1: this.state.slo1_1,
        slo1_2: this.state.slo1_2,
        slo1_3: this.state.slo1_3,
      };
      
      fetch('/slo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sloData),
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        alert('SLO updated successfully!');
      })
      .catch(error => console.error('Error updating SLO:', error));
    },
    handleChange: function(event) {
      this.setState({ [event.target.name]: event.target.value });
    },
    render: function() {
      return (
        <div>
          <h2>Update SLO for Course ID: {this.props.courseId}</h2>
          <form onSubmit={this.handleSubmit}>
            <label>
              SLO Description:
              <input
                type="text"
                name="sloDesc"
                value={this.state.sloDesc}
                onChange={this.handleChange}
              />
            </label><br />
            <fieldset>
              <legend>SLO 1 - Students will utilize appropriate communication formats when conveying professional and interpersonal thoughts and ideas</legend>
              <table border="2" solid="" cellpadding="5" width="100%">
                <tbody>
                  <tr>
                    <th align="left">Indicator</th>
                    <th>3</th>
                    <th>2</th>
                    <th>1</th>
                  </tr>
                  <tr>
                    <td align="left">1. Selecting appropriate ways (email, memo, face to face interaction, phone, etc.) to convey messages with clarity</td>
                    <td align="center">
                      <input
                        type="text"
                        size="4"
                        name="slo1_3"
                        value={this.state.slo1_3}
                        onChange={this.handleChange}
                      />
                    </td>
                    <td align="center">
                      <input
                        type="text"
                        size="4"
                        name="slo1_2"
                        value={this.state.slo1_2}
                        onChange={this.handleChange}
                      />
                    </td>
                    <td align="center">
                      <input
                        type="text"
                        size="4"
                        name="slo1_1"
                        value={this.state.slo1_1}
                        onChange={this.handleChange}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </fieldset>
            <br />
            <button type="submit">Submit SLO Update</button>
          </form>
        </div>
      );
    },
  });
  
  
  
  ReactDOM.render(<CourseBox />, document.getElementById('content'));
  