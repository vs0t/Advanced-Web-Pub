class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { username: '', password: '' };

        // Bind methods
        this.handleLogin = this.handleLogin.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    handleLogin(event) {
        event.preventDefault();
        const { username, password } = this.state;
        const users = [
            { username: 'user1', password: 'pass1' },
            { username: 'user2', password: 'pass2' }
            // Add more users as needed
        ];

        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            window.location.href = '/user/login2.html';
        } else {
            alert('Invalid username or password');
        }
    }

    handleUsernameChange(event) {
        this.setState({ username: event.target.value });
    }

    handlePasswordChange(event) {
        this.setState({ password: event.target.value });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleLogin}>
                    <label>
                        Username:
                        <input type="text" value={this.state.username} onChange={this.handleUsernameChange} />
                    </label>
                    <br />
                    <label>
                        Password:
                        <input type="password" value={this.state.password} onChange={this.handlePasswordChange} />
                    </label>
                    <br />
                    <button type="submit">Login</button>
                </form>
            </div>
        );
    }
}

ReactDOM.render(<Login />, document.getElementById('content'));
