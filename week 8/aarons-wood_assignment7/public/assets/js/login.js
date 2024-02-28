class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            username: '', 
            password: '', 
            validationMessage: '' 
        };

        // Bind methods
        this.handleLogin = this.handleLogin.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    validateInput(username, password) {
        // username validation contains at least 4 characters
        if (username.length < 4) {
            return "Username must be at least 4 characters long.";
        }

        // password validation must contain one uppercase letter and one number
        if (!/[A-Z]/.test(password) || !/\d/.test(password)) {
            return "Password must contain at least one uppercase letter and one number.";
        }

        return "";
    }

    handleLogin(event) {
        event.preventDefault();
        const { username, password } = this.state;

        // input validation
        const validationMessage = this.validateInput(username, password);
        if (validationMessage) {
            this.setState({ validationMessage });
            return;
        }

       const users = [
            { username: 'user1', password: 'Pass1' }, 
            { username: 'user2', password: 'Pass2' }
            // add more users as needed
        ];

        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            window.location.href = '/user/login2.html';
        } else {
            this.setState({ validationMessage: 'Invalid username or password' });
        }
    }

    handleUsernameChange(event) {
        this.setState({ username: event.target.value, validationMessage: '' });
    }

    handlePasswordChange(event) {
        this.setState({ password: event.target.value, validationMessage: '' });
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
                    {this.state.validationMessage && <p style={{ color: 'red' }}>{this.state.validationMessage}</p>}
                    <button type="submit">Login</button>
                </form>
            </div>
        );
    }
}

ReactDOM.render(<Login />, document.getElementById('content'));
