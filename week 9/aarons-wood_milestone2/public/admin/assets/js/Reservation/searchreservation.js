var ReservationBox = React.createClass({
    render: function () {
      return (
        <div className="ReservationBox">
          <ReservationSearch />
        </div>
      );
    },
  });
  
  var ReservationSearch = React.createClass({
    getInitialState: function () {
      return {
        playerId: "",
        date: "",
        status: "",
        reservations: [],
        players: [],
      };
    },
  
    componentDidMount: function () {
      this.loadPlayers();
    },
  
    loadPlayers: function () {
      fetch("/getplayers")
        .then((response) => response.json())
        .then((data) => this.setState({ players: data }))
        .catch((error) => console.error("Error fetching players:", error));
    },
  
    handleSearch: function (event) {
      event.preventDefault();
  
      const { playerId, date, status } = this.state;
  
      // Construct the search query
      let searchParams = new URLSearchParams();
      if (playerId) searchParams.append("playerId", playerId);
      if (date) searchParams.append("date", date);
      if (status) searchParams.append("status", status);
  
      let queryString = searchParams.toString();
  
      // Perform the search request
      fetch(`/searchreservations?${queryString}`)
        .then((response) => response.json())
        .then((data) => this.setState({ reservations: data }))
        .catch((error) => console.error("Error searching reservations:", error));
    },
  
    handlePlayerChange: function (event) {
      this.setState({ playerId: event.target.value });
    },
  
    handleDateChange: function (event) {
      this.setState({ date: event.target.value });
    },
  
    handleStatusChange: function (event) {
      this.setState({ status: event.target.value });
    },
  
    render: function () {
      return (
        <div>
          <h2>Reservation Search</h2>
          <form onSubmit={this.handleSearch}>
            <label>
              Select Player:
              <select value={this.state.playerId} onChange={this.handlePlayerChange}>
                <option value="">All Players</option>
                {this.state.players.map((player) => (
                  <option key={player.PlayerID} value={player.PlayerID}>
                    {player.PlayerFirstName} {player.PlayerLastName}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Date:
              <input
                type="date"
                value={this.state.date}
                onChange={this.handleDateChange}
              />
            </label>
            <label>
              Status:
              <select value={this.state.status} onChange={this.handleStatusChange}>
                <option value="">All Statuses</option>
                <option value="Booked">Booked</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
              </select>
            </label>
            <button type="submit">Search</button>
          </form>
          <SearchResults reservations={this.state.reservations} />
        </div>
      );
    },
  });
  
  var SearchResults = React.createClass({
    render: function () {
      return (
        <div>
          <h2>Search Results</h2>
          <table>
            <thead>
              <tr>
                <th>Player ID</th>
                <th>Reservation Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {this.props.reservations.map((reservation) => (
                <tr key={reservation.ReservationsID}>
                  <td>{reservation.PlayerID}</td>
                  <td>{reservation.ReservationsTime}</td>
                  <td>{reservation.ReservationsStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
  });
  
  ReactDOM.render(<ReservationBox />, document.getElementById("content"));
  