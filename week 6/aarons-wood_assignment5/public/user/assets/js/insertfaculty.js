var InsertFacultyBox = React.createClass({
  getInitialState: function () {
    return {
      name: "",
      email: "",
      validationError: "",
    };
  },

  validateInput: function (name, email) {
    // name validation at least 3 characters
    if (name.length < 3) {
      return "Name must be at least 3 characters long.";
    }

    // basic email validation
    if (!/@/.test(email) || !/\./.test(email)) {
      return "Email must be in a valid format.";
    }

    // if all validations pass
    return "";
  },

  handleNameChange: function (e) {
    this.setState({ name: e.target.value, validationError: "" });
  },

  handleEmailChange: function (e) {
    this.setState({ email: e.target.value, validationError: "" });
  },

  handleSubmit: function (e) {
    e.preventDefault();
    var name = this.state.name.trim();
    var email = this.state.email.trim();
  
    // input validation
    var validationError = this.validateInput(name, email);
    if (validationError) {
      this.setState({ validationError });
      return;
    }
  
    // ajax call to store faculty information
    $.ajax({
      url: "/faculty", 
      dataType: "json",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        facultyname: name, 
        facultyemail: email,
      }),
      success: function (data) {
        console.log("Faculty information stored successfully:", data);
        this.setState({ name: "", email: "" }); // optionally reset state here
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  

  render: function () {
    return (
      <div className="insertFacultyBox">
        <h2>Insert Faculty</h2>
        <form className="insertFacultyForm" onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={this.state.name}
            onChange={this.handleNameChange}
          />
          <input
            type="email"
            placeholder="E-Mail"
            value={this.state.email}
            onChange={this.handleEmailChange}
          />
          {this.state.validationError && (
            <p style={{ color: "red" }}>{this.state.validationError}</p>
          )}
          <input type="submit" value="Enter" />
        </form>
      </div>
    );
  },
});

ReactDOM.render(<InsertFacultyBox />, document.getElementById("content"));