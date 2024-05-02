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
    fetch("/searchreservations/")
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
  deleteReservation: function (reservationId) {
    fetch(`/deletereservation/${reservationId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert("Reservation deleted successfully!");
        this.fetchReservations();
      })
      .catch((error) => console.error("Error deleting reservation:", error));
  },
  render: function () {
    return (
      <div>
        <h1>Reservation Edit</h1>
        <ReservationList
          reservations={this.state.reservations}
          onSelectReservation={this.selectReservation}
          onDeleteReservation={this.deleteReservation}
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

var ReservationList = React.createClass({
  render: function () {
    var reservationNodes = this.props.reservations.map((reservation) => (
      <Reservation
        key={reservation.ReservationsID}
        reservation={reservation}
        onSelectReservation={this.props.onSelectReservation}
        onDeleteReservation={this.props.onDeleteReservation}
      />
    ));
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Reservation ID</th>
              <th>Reservation Date</th>
              <th>Reservation Time</th>
              <th>Player Count</th>
              <th>Player Name</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>{reservationNodes}</tbody>
        </table>
      </div>
    );
  },
});

var Reservation = React.createClass({
  handleEditClick: function () {
    this.props.onSelectReservation(
      this.props.reservation.ReservationsID,
      this.props.reservation
    );
  },
  handleDeleteClick: function () {
    this.props.onDeleteReservation(this.props.reservation.ReservationsID);
  },
  render: function () {
    const {
      ReservationsID,
      ReservationsDate,
      ReservationsTime,
      ReservationsCount,
      PlayerFirstName,
      PlayerLastName,
    } = this.props.reservation;
    const reservationDate = new Date(ReservationsDate);
    const formattedDate = reservationDate.toISOString().split("T")[0];
    return (
      <tr>
        <td>{ReservationsID}</td>
        <td>{formattedDate}</td>
        <td>{ReservationsTime}</td>
        <td>{ReservationsCount}</td>
        <td>
          {PlayerFirstName} {PlayerLastName}
        </td>
        <td>
          <button onClick={this.handleEditClick}>Edit</button>
        </td>
        <td>
          <button onClick={this.handleDeleteClick}>Delete</button>
        </td>
      </tr>
    );
  },
});

var ReservationEditForm = React.createClass({
  getInitialState: function () {
    const { ReservationsDate, ReservationsTime, ReservationsCount } =
      this.props.reservationDetails;
    const reservationDate = new Date(ReservationsDate);
    const formattedDate = reservationDate.toISOString().split("T")[0];
    return {
      reservationDate: formattedDate || "",
      reservationTime: ReservationsTime || "",
      reservationCount: ReservationsCount || "",
    };
  },
  componentDidUpdate: function (prevProps) {
    if (this.props.reservationId !== prevProps.reservationId) {
      const { ReservationsDate, ReservationsTime, ReservationsCount } =
        this.props.reservationDetails;
      const reservationDate = new Date(ReservationsDate);
      const formattedDate = reservationDate.toISOString().split("T")[0];
      this.setState({
        reservationDate: formattedDate || "",
        reservationTime: ReservationsTime || "",
        reservationCount: ReservationsCount || "",
      });
    }
  },
  handleSubmit: function (event) {
    event.preventDefault();
    const reservationData = {
      reservationId: this.props.reservationId,
      reservationDate: this.state.reservationDate,
      reservationTime: this.state.reservationTime,
      reservationCount: this.state.reservationCount,
    };

    fetch("/updatereservation", {
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
        this.props.refreshReservations();
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
            Reservation Date:
            <input
              type="date"
              name="reservationDate"
              value={this.state.reservationDate}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            Reservation Time:
            <input
              type="time"
              name="reservationTime"
              value={this.state.reservationTime}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            Reservation Count:
            <input
              type="number"
              name="reservationCount"
              value={this.state.reservationCount}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <button type="submit">Submit Reservation Update</button>
        </form>
      </div>
    );
  },
});

ReactDOM.render(<ReservationEditBox />, document.getElementById("content"));