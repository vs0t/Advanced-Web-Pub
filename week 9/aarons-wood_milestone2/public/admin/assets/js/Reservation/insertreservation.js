var ReservationBox = React.createClass({
    handleReservationSubmit: function (reservation) {
      $.ajax({
        url: "/insertreservation",
        dataType: "json",
        type: "POST",
        data: reservation,
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
        <div className="ReservationBox">
          <ReservationForm onReservationSubmit={this.handleReservationSubmit} />
        </div>
      );
    },
  });
  
  var ReservationForm = React.createClass({
    getInitialState: function () {
      return {
        playerID: "",
        reservationsTime: "",
        playersData: []
      };
    },
  
    loadPlayersData: function () {
      $.ajax({
        url: "/getplayers",
        dataType: "json",
        cache: false,
        success: function (data) {
          this.setState({ playersData: data });
        }.bind(this),
      });
    },
  
    handlePlayerChange: function (event) {
      this.setState({ playerID: event.target.value });
    },
  
    componentDidMount: function () {
      this.loadPlayersData();
    },
  
    handleSubmit: function (e) {
      e.preventDefault();
  
      var playerID = this.state.playerID;
      var reservationsTime = this.state.reservationsTime;
  
      if (!playerID || !reservationsTime) {
        console.log("Required fields are missing");
        return;
      }
  
      this.props.onReservationSubmit({
        playerID: playerID,
        reservationsTime: reservationsTime,
        reservationsStatus: "0",
      });
    },
  
    setValue: function (field, event) {
      var object = {};
      object[field] = event.target.value;
      this.setState(object);
    },
  
    render: function () {
      return (
        <form className="reservationForm" onSubmit={this.handleSubmit}>
          <h2>Reservation Information Area</h2>
          <table>
            <tbody>
              <tr>
                <th>Player Name</th>
                <td>
                  <SelectList
                    data={this.state.playersData}
                    onChange={this.handlePlayerChange}
                  />
                </td>
              </tr>
              <tr>
                <th>Reservation Time</th>
                <td>
                  <TextInput
                    inputType="datetime-local"
                    value={this.state.reservationsTime}
                    uniqueName="reservationsTime"
                    textArea={false}
                    required={true}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, "reservationsTime")}
                    errorMessage="Invalid Reservation Time"
                    emptyMessage="Reservation Time is Required"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <input type="submit" value="Insert Reservation" />
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
        <select name="playerID" id="playerID" onChange={this.handleChange}>
          <option value="">Select Player</option>
          {this.props.data.map(function (player) {
            return (
              <option key={player.PlayerID} value={player.PlayerID}>
                {player.PlayerFirstName}
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
  
  ReactDOM.render(<ReservationBox />, document.getElementById("content"));
  