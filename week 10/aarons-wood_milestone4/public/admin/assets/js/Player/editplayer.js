// Assuming React and ReactDOM are properly imported

// PlayerEditBox Component: Parent component that fetches and displays players, and manages the selected player for editing
var PlayerEditBox = React.createClass({
    getInitialState: function () {
      return {
        players: [],
        selectedPlayerId: null,
        selectedPlayerDetails: null,
        rewardsData: [],
      };
    },
    componentDidMount: function () {
      this.fetchPlayers();
      this.loadRewardsData();
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
    fetchPlayers: function () {
      fetch("/searchusers/") // Adjust this to your player search endpoint
        .then((response) => response.json())
        .then((data) => this.setState({ players: data }))
        .catch((error) => console.error("Error fetching players:", error));
    },
    selectPlayer: function (playerId, playerDetails) {
      this.setState({
        selectedPlayerId: playerId,
        selectedPlayerDetails: playerDetails,
      });
    },
    render: function () {
      return (
        <div>
          <h1>Player Edit</h1>
          <PlayerList players={this.state.players} onSelectPlayer={this.selectPlayer} />
          {this.state.selectedPlayerId && (
            <PlayerEditForm
              playerId={this.state.selectedPlayerId}
              playerDetails={this.state.selectedPlayerDetails}
              rewardsData={this.state.rewardsData}
            />
          )}
        </div>
      );
    },
  });
  
  // PlayerList Component: Lists players with an edit button
  var PlayerList = React.createClass({
    render: function () {
      var playerNodes = this.props.players.map((player) => (
        <Player
          key={player.PlayerID}
          player={player}
          onSelectPlayer={this.props.onSelectPlayer}
        />
      ));
      return (
        <div>
          <table>
            <thead>
              <tr>
                <th>Player ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>{playerNodes}</tbody>
          </table>
        </div>
      );
    },
  });
  
  // Player Component: Displays a single player row
  var Player = React.createClass({
    handleClick: function () {
      this.props.onSelectPlayer(this.props.player.PlayerID, this.props.player);
    },
    render: function () {
      const { PlayerID, PlayerFirstName, PlayerLastName, PlayerEmail } = this.props.player;
      return (
        <tr>
          <td>{PlayerID}</td>
          <td>{PlayerFirstName}</td>
          <td>{PlayerLastName}</td>
          <td>{PlayerEmail}</td>
          <td>
            <button onClick={this.handleClick}>Edit</button>
          </td>
        </tr>
      );
    },
  });
  
  // PlayerEditForm Component: Form for editing player information
  var PlayerEditForm = React.createClass({
    getInitialState: function () {
      // Pre-fill the form with the selected player's details
      const {
        PlayerFirstName,
        PlayerLastName,
        PlayerEmail,
        PlayerAddress,
        PlayerCity,
        PlayerState,
        PlayerZip,
        RewardsID,
      } = this.props.playerDetails;
      return {
        firstName: PlayerFirstName || "",
        lastName: PlayerLastName || "",
        email: PlayerEmail || "",
        address: PlayerAddress || "",
        city: PlayerCity || "",
        state: PlayerState || "",
        zip: PlayerZip || "",
        rewardsId: RewardsID || "",
      };
    },
    componentDidUpdate: function (prevProps) {
      // Only update state if the playerId has changed
      if (this.props.playerId !== prevProps.playerId) {
        const {
          PlayerFirstName,
          PlayerLastName,
          PlayerEmail,
          PlayerAddress,
          PlayerCity,
          PlayerState,
          PlayerZip,
          RewardsID,
        } = this.props.playerDetails;
  
        this.setState({
          firstName: PlayerFirstName || "",
          lastName: PlayerLastName || "",
          email: PlayerEmail || "",
          address: PlayerAddress || "",
          city: PlayerCity || "",
          state: PlayerState || "",
          zip: PlayerZip || "",
          rewardsId: RewardsID || "",
        });
      }
    },
    handleSubmit: function (event) {
      event.preventDefault();
      const playerData = {
        playerId: this.props.playerId,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        address: this.state.address,
        city: this.state.city,
        state: this.state.state,
        zip: this.state.zip,
        rewardsId: this.state.rewardsId,
      };
  
      fetch("/updateplayer", {
        // Replace with your endpoint to update player details
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(playerData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          alert("Player updated successfully!");
          this.props.refreshPlayers(); // Add this method to the parent component to refresh the list after update
        })
        .catch((error) => console.error("Error updating player:", error));
    },
    handleChange: function (event) {
      var stateUpdate = {};
      stateUpdate[event.target.name] = event.target.value;
      this.setState(stateUpdate);
    },
    handleRewardChange: function (selectedRewardId) {
      // Update the rewardsId in the state
      this.setState({ rewardsId: selectedRewardId });
    },
  
    render: function () {
      return (
        <div>
          <h2>Edit Player ID: {this.props.playerId}</h2>
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
              Rewards:
              <SelectList
                data={this.props.rewardsData}
                onRewardChange={this.handleRewardChange}
                value={this.state.rewardsId}
              />
            </label>
            <br />
            <button type="submit">Submit Player Update</button>
          </form>
        </div>
      );
    },
  });
  
  var SelectList = React.createClass({
    handleChange: function (event) {
      if (this.props.onRewardChange) {
        this.props.onRewardChange(event.target.value);
      }
    },
    render: function () {
      return (
        <select
          name="rewardsId"
          id="rewardsId"
          value={this.props.value}
          onChange={this.handleChange}
        >
          <option value="">No Reward</option>
          {this.props.data.map(function (reward) {
            return (
              <option
                key={reward.RewardsID}
                value={reward.RewardsID}
              >
                {reward.RewardsName}
              </option>
            );
          })}
        </select>
      );
    },
  });
  
  ReactDOM.render(<PlayerEditBox />, document.getElementById("content"));