var PlayerSearchBoxEA = React.createClass({
  getInitialState: function () {
    return { dataEA: [] };
  },

  loadPlayersFromServer: function (searchQueryEA) {
    $.ajax({
      url: '/searchplayers',
      data: searchQueryEA,
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({ dataEA: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/searchplayers', status, err.toString());
      }.bind(this)
    });
  },

  render: function () {
    return (
      <div>
        <PlayerSearchFormEA onPlayerSearch={this.loadPlayersFromServer} />
        <br />
        {this.state.dataEA.length > 0 &&
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>City</th>
                <th>State</th>
                <th>Zip</th>
              </tr>
            </thead>
            <PlayerListEA data={this.state.dataEA} />
          </table>
        }
      </div>
    );
  }
});

var PlayerSearchFormEA = React.createClass({
  getInitialState: function () {
    return {
      playerFirstNameEA: "",
      playerLastNameEA: "",
      playerEmailEA: "",
      playerAddressEA: "",
      playerCityEA: "",
      playerStateEA: "",
      playerZipEA: ""
    };
  },

  handleSubmit: function (e) {
    e.preventDefault();
    var searchQueryEA = {
      firstName: this.state.playerFirstNameEA.trim(),
      lastName: this.state.playerLastNameEA.trim(),
      email: this.state.playerEmailEA.trim(),
      address: this.state.playerAddressEA.trim(),
      city: this.state.playerCityEA.trim(),
      state: this.state.playerStateEA.trim(),
      zip: this.state.playerZipEA.trim()
    };
    this.props.onPlayerSearch(searchQueryEA);
  },

  handleChange: function (event) {
    var nextState = {};
    nextState[event.target.name] = event.target.value;
    this.setState(nextState);
  },

  render: function () {
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Use the form below to search for players.</h3>
        <input type="text" name="playerFirstNameEA" value={this.state.playerFirstNameEA} onChange={this.handleChange} placeholder="First Name" />
        <input type="text" name="playerLastNameEA" value={this.state.playerLastNameEA} onChange={this.handleChange} placeholder="Last Name" />
        <input type="text" name="playerEmailEA" value={this.state.playerEmailEA} onChange={this.handleChange} placeholder="Email" />
        <input type="text" name="playerAddressEA" value={this.state.playerAddressEA} onChange={this.handleChange} placeholder="Address" />
        <input type="text" name="playerCityEA" value={this.state.playerCityEA} onChange={this.handleChange} placeholder="City" />
        <input type="text" name="playerStateEA" value={this.state.playerStateEA} onChange={this.handleChange} placeholder="State" />
        <input type="text" name="playerZipEA" value={this.state.playerZipEA} onChange={this.handleChange} placeholder="Zip" />
        <input type="submit" value="Search Players" />
      </form>
    );
  }
});

var PlayerListEA = React.createClass({
  render: function () {
    var playerNodesEA = this.props.data.map(function (player) {
      return (
        <Player
          key={player.PlayerID}
          playerFirstName={player.PlayerFirstName}
          playerLastName={player.PlayerLastName}
          playerEmail={player.PlayerEmail}
          playerAddress={player.PlayerAddress}
          playerCity={player.PlayerCity}
          playerState={player.PlayerState}
          playerZip={player.PlayerZip}
        />
      );
    });
    return (
      <tbody>
        {playerNodesEA}
      </tbody>
    );
  }
});

var Player = React.createClass({
  render: function () {
    return (
      <tr>
        <td>{this.props.playerFirstName}</td>
        <td>{this.props.playerLastName}</td>
        <td>{this.props.playerEmail}</td>
        <td>{this.props.playerAddress}</td>
        <td>{this.props.playerCity}</td>
        <td>{this.props.playerState}</td>
        <td>{this.props.playerZip}</td>
      </tr>
    );
  }
});

ReactDOM.render(
  <PlayerSearchBoxEA />,
  document.getElementById('content')
);