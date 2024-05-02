// Assuming React and ReactDOM are properly imported

// UserEditBox Component: Parent component that fetches and displays users, and manages the selected user for editing
var UserEditBox = React.createClass({
  getInitialState: function () {
    return {
      users: [],
      selectedUserId: null,
      selectedUserDetails: null,
    };
  },
  componentDidMount: function () {
    this.fetchUsers();
    this.loadCatTypes();
    this.loadRoleTypes();
  },
  loadCatTypes: function () {
    $.ajax({
      url: "/getusercat",
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ categoryData: data });
      }.bind(this),
    });
  },
  loadRoleTypes: function () {
    $.ajax({
      url: "/getuserrole",
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ roleData: data });
      }.bind(this),
    });
  },
  fetchUsers: function () {
    fetch("/searchusers/") // Adjust this to your user search endpoint
      .then((response) => response.json())
      .then((data) => this.setState({ users: data }))
      .catch((error) => console.error("Error fetching users:", error));
  },
  selectUser: function (userId, userDetails) {
    this.setState({
      selectedUserId: userId,
      selectedUserDetails: userDetails,
    });
  },
  render: function () {
    return (
      <div>
        <h1>User Edit</h1>
        <UserList users={this.state.users} onSelectUser={this.selectUser} />
        {this.state.selectedUserId && (
          <UserEditForm
            userId={this.state.selectedUserId}
            userDetails={this.state.selectedUserDetails}
            categoryData={this.state.categoryData}
            roleData={this.state.roleData}
          />
        )}
      </div>
    );
  },
});

// UserList Component: Lists users with an edit button
var UserList = React.createClass({
  render: function () {
    var userNodes = this.props.users.map((user) => (
      <User
        key={user.UserID}
        user={user}
        onSelectUser={this.props.onSelectUser}
      />
    ));
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>{userNodes}</tbody>
        </table>
      </div>
    );
  },
});

// User Component: Displays a single user row
var User = React.createClass({
  handleClick: function () {
    this.props.onSelectUser(this.props.user.UserID, this.props.user);
  },
  render: function () {
    const { UserID, UserFirstName, UserLastName, UserEmail } = this.props.user;
    return (
      <tr>
        <td>{UserID}</td>
        <td>{UserFirstName}</td>
        <td>{UserLastName}</td>
        <td>{UserEmail}</td>
        <td>
          <button onClick={this.handleClick}>Edit</button>
        </td>
      </tr>
    );
  },
});

// UserEditForm Component: Form for editing user information
var UserEditForm = React.createClass({
  getInitialState: function () {
    // Pre-fill the form with the selected user's details
    const {
      UserFirstName,
      UserLastName,
      UserEmail,
      UserAddress,
      UserCity,
      UserState,
      UserZip,
      RoleID,
      CatagoryID,
    } = this.props.userDetails;
    return {
      firstName: UserFirstName || "",
      lastName: UserLastName || "",
      email: UserEmail || "",
      address: UserAddress || "",
      city: UserCity || "",
      state: UserState || "",
      zip: UserZip || "",
      roleId: RoleID || "",
      categoryId: CatagoryID || "",
      uproleData: this.props.roleData || [],
      upcategoryData: this.props.categoryData || [],
    };
  },
  componentDidUpdate: function (prevProps) {
    // Only update state if the userId has changed
    if (this.props.userId !== prevProps.userId) {
      const {
        UserFirstName,
        UserLastName,
        UserEmail,
        UserAddress,
        UserCity,
        UserState,
        UserZip,
        RoleID,
        CatagoryID,
      } = this.props.userDetails;

      this.setState({
        firstName: UserFirstName || "",
        lastName: UserLastName || "",
        email: UserEmail || "",
        address: UserAddress || "",
        city: UserCity || "",
        state: UserState || "",
        zip: UserZip || "",
        roleId: RoleID || "",
        categoryId: CatagoryID || "",
      });
    }
  },
  handleSubmit: function (event) {
    event.preventDefault();
    const userData = {
      userId: this.props.userId,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      address: this.state.address,
      city: this.state.city,
      state: this.state.state,
      zip: this.state.zip,
      roleId: this.state.roleId,
      categoryId: this.state.categoryId,
    };

    fetch("/updateuser", {
      // Replace with your endpoint to update user details
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert("User updated successfully!");
        this.props.refreshUsers(); // Add this method to the parent component to refresh the list after update
      })
      .catch((error) => console.error("Error updating user:", error));
  },
  handleChange: function (event) {
    var stateUpdate = {};
    stateUpdate[event.target.name] = event.target.value;
    this.setState(stateUpdate);
  },
  handleRoleChange: function (selectedRoleId) {
    // Update the roleId in the state
    this.setState({ roleId: selectedRoleId });
  },

  handleCategoryChange: function (event) {
    // Update the categoryId in the state
    this.setState({ categoryId: event.target.value });
  },

  render: function () {
    return (
      <div>
        <h2>Edit User ID: {this.props.userId}</h2>
        <form onSubmit={this.handleSubmit}>
          <label>
            First Name:
            <input
              type="text"
              name="firstName"
              value={this.state.firstName}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            Last Name:
            <input
              type="text"
              name="lastName"
              value={this.state.lastName}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            Address:
            <input
              type="text"
              name="address"
              value={this.state.address}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            City:
            <input
              type="text"
              name="city"
              value={this.state.city}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            State:
            <input
              type="text"
              name="state"
              value={this.state.state}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            Zip:
            <input
              type="text"
              name="zip"
              value={this.state.zip}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            Role ID:
            <SelectList2
              data={this.state.uproleData}
              onRoleChange={this.handleRoleChange}
              value={this.state.roleId}
            />
          </label>
          <br />
          <label>
            Category ID:
            <SelectList
              data={this.state.upcategoryData}
              onChange={this.handleCategoryChange}
              value={this.state.categoryId}
            />
          </label>
          <br />
          <button type="submit">Submit User Update</button>
        </form>
      </div>
    );
  },
});

var SelectList = React.createClass({
  handleChange: function (event) {
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  },
  render: function () {
    return (
      <select
        name="userCat"
        id="userCat"
        value={this.props.value}
        onChange={this.handleChange}
      >
        <option value="">No Category</option>;
        {this.props.data.map(function (cusParticipant) {
          return (
            <option
              key={cusParticipant.CatagoryID}
              value={cusParticipant.CatagoryID}
            >
              {cusParticipant.CatagoryName}
            </option>
          );
        })}
      </select>
    );
  },
});

var SelectList2 = React.createClass({
  handleChange: function (event) {
    const selectedRoleId = event.target.value;

    if (this.props.onRoleChange) {
      this.props.onRoleChange(selectedRoleId);
    } else {
      console.error("onRoleChange prop not passed to SelectList2");
    }
  },

  render: function () {
    return (
      <select
        name="userRole"
        id="userRole"
        value={this.props.value}
        onChange={this.handleChange}
      >
        <option value="">No Role</option>
        {this.props.data.map(function (cusParticipant) {
          return (
            <option key={cusParticipant.RoleID} value={cusParticipant.RoleID}>
              {cusParticipant.RoleName}
            </option>
          );
        })}
      </select>
    );
  },
});

ReactDOM.render(<UserEditBox />, document.getElementById("content"));
