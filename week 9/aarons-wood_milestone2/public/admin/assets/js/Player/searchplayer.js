var PlayerBox = React.createClass({
    handlePlayerSubmit: function (player) {
      $.ajax({
        url: "/insertplayer",
        dataType: "json",
        type: "POST",
        data: player,
        success: function (data) {
          this.setState({ data: data });
        }.bind(this),
        error: function (xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this),
      });
    },
    render: function () {
      return (
        <div className="PlayerBox">
          <Playerform onPlayerSubmit={this.handlePlayerSubmit} />
        </div>
      );
    },
  });

  var SearchResults = React.createClass({
    render: function() {
      var playerNodes = this.props.data.map(function(player) {
        return (
          <tr key={player.id}>
            <td>{player.firstName}</td>
            <td>{player.lastName}</td>
            <td>{player.email}</td>
          </tr>
        );
      });
      return (
        <div>
          <h2>Search Results</h2>
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>{playerNodes}</tbody>
          </table>
        </div>
      );
    },
  });
  
  
  
  var Playerform = React.createClass({
    getInitialState: function () {
      return {
        playerFirstName: "",
        playerLastName: "",
        playerEmail: "",
        playerPassword: "",
        playerAddress: "",
        playerCity: "",
        playerState: "",
        playerZip: "",
        rewardsData: [],
        selectedRewardId: "",
      };
    },
  
    loadRewardsData: function () {
      $.ajax({
        url: "/getrewards",
        dataType: "json",
        cache: false,
        success: function (data) {
          this.setState({ rewardsData: data });
        }.bind(this),
      });
    },
  
    handleRewardChange: function (event) {
      this.setState({ selectedRewardId: event.target.value });
    },
  
    componentDidMount: function () {
      this.loadRewardsData();
    },
  
    handleSubmit: function (e) {
      e.preventDefault();
  
      var playerFirstName = this.state.playerFirstName.trim();
      var playerLastName = this.state.playerLastName.trim();
      var playerEmail = this.state.playerEmail.trim();
      var playerPassword = this.state.playerPassword.trim();
      var playerAddress = this.state.playerAddress.trim();
      var playerCity = this.state.playerCity.trim();
      var playerState = this.state.playerState.trim();
      var playerZip = this.state.playerZip.trim();
      var selectedRewardId = this.state.selectedRewardId;
  
      if (!this.validateEmail(playerEmail)) {
        console.log("Bad Email " + this.validateEmail(playerEmail));
        return;
      }
  
      if (!playerFirstName || !playerLastName || !playerEmail || !playerPassword) {
        console.log("Required fields are missing");
        return;
      }
  
      this.props.onPlayerSubmit({
        playerFirstName: playerFirstName,
        playerLastName: playerLastName,
        playerEmail: playerEmail,
        playerPassword: playerPassword,
        playerAddress: playerAddress,
        playerCity: playerCity,
        playerState: playerState,
        playerZip: playerZip,
        rewardsId: selectedRewardId,
      });
    },
  
    validateEmail: function (value) {
      var re =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(value);
    },
  
    commonValidate: function () {
      return true;
    },
  
    setValue: function (field, event) {
      var object = {};
      object[field] = event.target.value;
      this.setState(object);
    },
  
    render: function () {
      return (
        <form className="playerForm" onSubmit={this.handleSubmit}>
          <h2>Player Information Area</h2>
          <table>
            <tbody>
              <tr>
                <th>Player First Name</th>
                <td>
                  <TextInput
                    value={this.state.playerFirstName}
                    uniqueName="playerFirstName"
                    textArea={false}
                    required={true}
                    minCharacters={1}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, "playerFirstName")}
                    errorMessage="Player First Name is invalid"
                    emptyMessage="Player First Name is required"
                  />
                </td>
              </tr>
              <tr>
                <th>Player Last Name</th>
                <td>
                  <TextInput
                    value={this.state.playerLastName}
                    uniqueName="playerLastName"
                    textArea={false}
                    required={true}
                    minCharacters={1}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, "playerLastName")}
                    errorMessage="Player Last Name is invalid"
                    emptyMessage="Player Last Name is required"
                  />
                </td>
              </tr>
              <tr>
                <th>Player Email</th>
                <td>
                  <TextInput
                    value={this.state.playerEmail}
                    uniqueName="playerEmail"
                    textArea={false}
                    minCharacters={1}
                    required={true}
                    validate={this.validateEmail}
                    onChange={this.setValue.bind(this, "playerEmail")}
                    errorMessage="Invalid Email Address"
                    emptyMessage="Email Address is Required"
                  />
                </td>
              </tr>
              {/* Additional player information fields */}
              <tr>
                <th>Player Address</th>
                <td>
                  <TextInput
                    value={this.state.playerAddress}
                    uniqueName="playerAddress"
                    textArea={false}
                    required={false}
                    minCharacters={6}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, "playerAddress")}
                    errorMessage="Player Address is invalid"
                  />
                </td>
              </tr>
              <tr>
                <th>Player City</th>
                <td>
                  <TextInput
                    value={this.state.playerCity}
                    uniqueName="playerCity"
                    textArea={false}
                    required={false}
                    minCharacters={6}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, "playerCity")}
                    errorMessage="Player City is invalid"
                  />
                </td>
              </tr>
              <tr>
                <th>Player State</th>
                <td>
                  <TextInput
                    value={this.state.playerState}
                    uniqueName="playerState"
                    textArea={false}
                    minCharacters={2}
                    required={false}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, "playerState")}
                    errorMessage=""
                    emptyMessage=""
                  />
                </td>
              </tr>
              <tr>
                <th>Player Zip</th>
                <td>
                  <TextInput
                    value={this.state.playerZip}
                    uniqueName="playerZip"
                    textArea={false}
                    required={false}
                    minCharacters={5}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, "playerZip")}
                    errorMessage=""
                    emptyMessage=""
                  />
                </td>
              </tr>
              <tr>
                <th>Rewards</th>
                <td>
                  <SelectList
                    data={this.state.rewardsData}
                    onChange={this.handleRewardChange}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <input type="submit" value="Search Player" />
        </form>
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
        <select name="rewardsId" id="rewardsId" onChange={this.handleChange}>
          <option value="">No Reward Level</option>
          {this.props.data.map(function (reward) {
            return (
              <option key={reward.RewardsID} value={reward.RewardsID}>
                {reward.RewardsName}
              </option>
            );
          })}
        </select>
      );
    },
  });
  
  var InputError = React.createClass({
    getInitialState: function () {
      return {
        message: "Input is invalid",
      };
    },
    render: function () {
      var errorClass = classNames(this.props.className, {
        error_container: true,
        visible: this.props.visible,
        invisible: !this.props.visible,
      });
  
      return <td> {this.props.errorMessage} </td>;
    },
  });
  
  var TextInput = React.createClass({
    getInitialState: function () {
      return {
        isEmpty: true,
        value: null,
        valid: false,
        errorMessage: "",
        errorVisible: false,
      };
    },
  
    handleChange: function (event) {
      this.validation(event.target.value);
  
      if (this.props.onChange) {
        this.props.onChange(event);
      }
    },
  
    validation: function (value, valid) {
      if (typeof valid === "undefined") {
        valid = true;
      }
  
      var message = "";
      var errorVisible = false;
  
      if (!valid) {
        message = this.props.errorMessage;
        valid = false;
        errorVisible = true;
      } else if (this.props.required && jQuery.isEmptyObject(value)) {
        message = this.props.emptyMessage;
        valid = false;
        errorVisible = true;
      } else if (value.length < this.props.minCharacters) {
        message = this.props.errorMessage;
        valid = false;
        errorVisible = true;
      }
  
      this.setState({
        value: value,
        isEmpty: jQuery.isEmptyObject(value),
        valid: valid,
        errorMessage: message,
        errorVisible: errorVisible,
      });
    },
  
    handleBlur: function (event) {
      var valid = this.props.validate(event.target.value);
      this.validation(event.target.value, valid);
    },
    render: function () {
      if (this.props.textArea) {
        return (
          <div className={this.props.uniqueName}>
            <textarea
              placeholder={this.props.text}
              className={"input input-" + this.props.uniqueName}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              value={this.props.value}
            />
  
            <InputError
              visible={this.state.errorVisible}
              errorMessage={this.state.errorMessage}
            />
          </div>
        );
      } else {
        return (
          <div className={this.props.uniqueName}>
            <input
              type={this.props.inputType}
              name={this.props.uniqueName}
              id={this.props.uniqueName}
              placeholder={this.props.text}
              className={"input input-" + this.props.uniqueName}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              value={this.props.value}
            />
  
            <InputError
              visible={this.state.errorVisible}
              errorMessage={this.state.errorMessage}
            />
          </div>
        );
      }
    },
  });
  
  ReactDOM.render(<PlayerBox />, document.getElementById("content"));
