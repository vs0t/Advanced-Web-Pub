// Assuming React and ReactDOM are properly imported

// ReservationEditBox Component: Parent component that fetches and displays reservations, and manages the selected reservation for editing
var ReservationEditBox = React.createClass({
    getInitialState: function () {
      return {
        reservations: [],
        selectedReservationId: null,
        selectedReservationDetails: null,
      };
    },
    componentDidMount: function () {
      this.fetchReservations();
    },
    fetchReservations: function () {
      fetch("/searchproducts/") // Adjust this to your reservation search endpoint
        .then((response) => response.json())
        .then((data) => this.setState({ reservations: data }))
        .catch((error) => console.error("Error fetching reservations:", error));
    },
    selectReservation: function (reservationId, reservationDetails) {
      this.setState({
        selectedReservationId: reservationId,
        selectedReservationDetails: reservationDetails,
      });
    },
    render: function () {
      return (
        <div>
          <h1>Reservation Edit</h1>
          <ReservationList
            reservations={this.state.reservations}
            onSelectReservation={this.selectReservation}
          />
          {this.state.selectedReservationId && (
            <ReservationEditForm
              reservationId={this.state.selectedReservationId}
              reservationDetails={this.state.selectedReservationDetails}
              refreshReservations={this.fetchReservations}
            />
          )}
        </div>
      );
    },
  });
  
  // ReservationList Component: Lists reservations with an edit button
  var ReservationList = React.createClass({
    render: function () {
      var reservationNodes = this.props.reservations.map((reservation) => (
        <Reservation
          key={reservation.ReservationsID}
          reservation={reservation}
          onSelectReservation={this.props.onSelectReservation}
        />
      ));
      return (
        <div>
          <table>
            <thead>
              <tr>
                <th>Reservation ID</th>
                <th>Player ID</th>
                <th>Time</th>
                <th>Status</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>{reservationNodes}</tbody>
          </table>
        </div>
      );
    },
  });
  
  // Reservation Component: Displays a single reservation row
  var Reservation = React.createClass({
    handleClick: function () {
      this.props.onSelectReservation(this.props.reservation.ReservationsID, this.props.reservation);
    },
    render: function () {
      const { ReservationsID, PlayerID, ReservationsTime, ReservationsStatus } = this.props.reservation;
      return (
        <tr>
          <td>{ReservationsID}</td>
          <td>{PlayerID}</td>
          <td>{ReservationsTime}</td>
          <td>{ReservationsStatus}</td>
          <td>
            <button onClick={this.handleClick}>Edit</button>
          </td>
        </tr>
      );
    },
  });
  
  // ReservationEditForm Component: Form for editing reservation information
  var ReservationEditForm = React.createClass({
    getInitialState: function () {
      // Pre-fill the form with the selected reservation's details
      const { PlayerID, ReservationsTime, ReservationsStatus } = this.props.reservationDetails;
      return {
        playerId: PlayerID || "",
        reservationTime: ReservationsTime || "",
        reservationStatus: ReservationsStatus || "",
      };
    },
    componentDidUpdate: function (prevProps) {
      // Only update state if the reservationId has changed
      if (this.props.reservationId !== prevProps.reservationId) {
        const { PlayerID, ReservationsTime, ReservationsStatus } = this.props.reservationDetails;
  
        this.setState({
          playerId: PlayerID || "",
          reservationTime: ReservationsTime || "",
          reservationStatus: ReservationsStatus || "",
        });
      }
    },
    handleSubmit: function (event) {
      event.preventDefault();
      const reservationData = {
        reservationId: this.props.reservationId,
        playerId: this.state.playerId,
        reservationTime: this.state.reservationTime,
        reservationStatus: this.state.reservationStatus,
      };
  
      fetch("/updatereservation", {
        // Replace with your endpoint to update reservation details
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          alert("Reservation updated successfully!");
          this.props.refreshReservations(); // Add this method to the parent component to refresh the list after update
        })
        .catch((error) => console.error("Error updating reservation:", error));
    },
    handleChange: function (event) {
      var stateUpdate = {};
      stateUpdate[event.target.name] = event.target.value;
      this.setState(stateUpdate);
    },
    render: function () {
      return (
        <div>
          <h2>Edit Reservation ID: {this.props.reservationId}</h2>
          <form onSubmit={this.handleSubmit}>
            <label>
              Player ID:
              <input
                type="text"
                name="playerId"
                value={this.state.playerId}
                onChange={this.handleChange}
              />
            </label>
            <br />
            <label>
              Reservation Time:
              <input
                type="datetime-local" // Use datetime-local for selecting date and time
                name="reservationTime"
                value={this.state.reservationTime}
                onChange={this.handleChange}
              />
            </label>
            <br />
            <label>
              Reservation Status:
              <select
                name="reservationStatus"
                value={this.state.reservationStatus}
                onChange={this.handleChange}
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
            <br />
            <button type="submit">Submit Reservation Update</button>
          </form>
        </div>
      );
    },
  });
  
  ReactDOM.render(<ReservationEditBox />, document.getElementById("content"));
  