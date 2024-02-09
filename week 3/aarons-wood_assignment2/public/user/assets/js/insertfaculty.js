var InsertFacultyBox = React.createClass({
    getInitialState: function() {
      return {
        name: '',
        email: ''
      };
    },
  
    handleNameChange: function(e) {
      this.setState({ name: e.target.value });
    },
  
    handleEmailChange: function(e) {
      this.setState({ email: e.target.value });
    },
  
    handleSubmit: function(e) {
      e.preventDefault();
      var name = this.state.name.trim();
      var email = this.state.email.trim();
      if (!name || !email) {
        return;
      }
  
    //   $.ajax({
    //     url: '/api/insertfaculty',
    //     dataType: 'json',
    //     type: 'POST',
    //     data: {
    //       name: name,
    //       email: email
    //     },
    //     success: function(data) {
    //       console.log('Inserting faculty successful:', data);
    //       // Optionally reset state here
    //     }.bind(this),
    //     error: function(xhr, status, err) {
    //       console.error(this.props.url, status, err.toString());
    //     }.bind(this)
    //   });
      $.ajax({
        url: '/api/storefaculty',
        dataType: 'json',
        type: 'POST',
        contentType: 'application/json', // Set the content type to JSON
        data: JSON.stringify({  // Stringify the data object
          name: name,
          email: email
        }),
        success: function(data) {
          console.log('Storing faculty successful:', data);
          // Optionally reset state here
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
      
  
      this.setState({ name: '', email: '' }); // Reset form after submission
    },
  
    render: function() {
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
            <input
              type="submit"
              value="Enter"
            />
          </form>
        </div>
      );
    }
  });
  
  ReactDOM.render(
    <InsertFacultyBox />,
    document.getElementById('content')
  );
  