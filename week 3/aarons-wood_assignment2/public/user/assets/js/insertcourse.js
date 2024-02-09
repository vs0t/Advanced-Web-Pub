var InsertCourse = React.createClass({
    getInitialState: function() {
      return {
        faculty: '',
        semester: '',
        year: '',
        coursePrefix: '',
        courseNumber: '',
        section: ''
      };
    },
  
    handleChange: function(event) {
      var stateUpdate = {};
      stateUpdate[event.target.name] = event.target.value;
      this.setState(stateUpdate);
    },
  
    handleSubmit: function(event) {
        event.preventDefault();
        var faculty = this.state.faculty.trim();
        var semester = this.state.semester.trim();
        var year = this.state.year.trim();
        var coursePrefix = this.state.coursePrefix.trim();
        var courseNumber = this.state.courseNumber.trim();
        var section = this.state.section.trim();
      
        // Check if any of the fields are empty
        if (!faculty || !semester || !year || !coursePrefix || !courseNumber || !section) {
          return;
        }
      
        // Stringify the course data
        var courseData = JSON.stringify(this.state);
      
        // AJAX call to server to submit course data
        $.ajax({
          url: '/api/insertcourse',
          type: 'POST',
          contentType: 'application/json',
          data: courseData, // Send the stringified course data
          success: function(data) {
            alert('Course inserted successfully!');
            console.log(data);
            this.setState(this.getInitialState());
          }.bind(this),
          error: function(xhr, status, err) {
            console.error('/api/insertcourse', status, err.toString());
          }.bind(this)
        });
      },
      
      
  
    render: function() {
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
                      <select name="faculty" value={this.state.faculty} onChange={this.handleChange}>
                        <option value="">Please Select a Faculty Member</option>
                        <option value="timmons">Professor Timmons</option>
                        <option value="carmon">Professor Carmon</option>
                      </select>
                    </td>
                    <td>
                      <label htmlFor="semester">Select a Semester:</label>
                      <select name="semester" value={this.state.semester} onChange={this.handleChange}>
                        <option value="">Please Select a Semester</option>
                        <option value="fall">Fall</option>
                        <option value="spring">Spring</option>
                        <option value="summer">Summer</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="year">Select a Year:</label>
                      <select name="year" value={this.state.year} onChange={this.handleChange}>
                        <option value="">Please Select a Year</option>
                        <option value="2020">2020</option>
                        <option value="2021">2021</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                      </select>
                    </td>
                    <td>
                      <label htmlFor="coursePrefix">Enter the Course Prefix (Ex: CPT, ENG, SOC):</label>
                      <input type="text" name="coursePrefix" value={this.state.coursePrefix} onChange={this.handleChange} />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="courseNumber">Enter the Course Number (Ex: 101, 205, 121):</label>
                      <input type="text" name="courseNumber" value={this.state.courseNumber} onChange={this.handleChange} />
                    </td>
                    <td>
                      <label htmlFor="section">Enter the Section (Ex: H01, C02, G04, S06, I01):</label>
                      <input type="text" name="section" value={this.state.section} onChange={this.handleChange} />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <button type="submit">Insert</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
          </div>
        </div>
      );
    }
  });
  
  ReactDOM.render(
    <InsertCourse />,
    document.getElementById('content')
  );
  