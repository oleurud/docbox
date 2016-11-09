import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, hashHistory, Router, Route, Link, withRouter } from 'react-router';
import auth from './services/auth';
import AppWrapper from './components/appWrapper';
import webService from './services/webservice';

const App = React.createClass({
    getInitialState() {
        this.handleLogout = () => {
            auth.logout();
            this.setState({
                loggedIn: false
            })
        }

        return {
            loggedIn: auth.loggedIn()
        }
    },

    updateAuth(loggedIn) {
        this.setState({
            loggedIn: loggedIn
        })
    },

    componentWillMount() {
        auth.onChange = this.updateAuth
    },

    render() {
        const homeView = this.state.loggedIn ? <Dashboard updateAuth={this.updateAuth} /> : <Login />
        const logOutButton = this.state.loggedIn ?
            <li><Link to="/" onClick={this.handleLogout}>Log out</Link></li> :
            ''

        return (
            <div>
                <ul id="auth-header">
                    {logOutButton}
                </ul>
                <div className="auth-container">
                    { this.props.children || homeView }
                </div>
            </div>
        )
    }
})

const Dashboard = React.createClass({
    getInitialState() {
        return {
            collections: []
        }
    },

    componentWillMount() {
        webService.doCall(
            'GET',
            '/sources',
            {},
            {
                Authorization: auth.getToken()
            },
            (err, response) => {
                if(!err) {
                    this.setState({collections: response})
                } else {
                    this.props.updateAuth(false);
                }
            }
        )
    },

    render() {
        const collections = this.state.collections.map( (collection) => {
            const link = "/project/" + collection.name;
            return <li><Link to={link} key={collection.name}>{collection.name}</Link><hr /></li>
        });

        return (
            <div>
                <h1>Projects</h1>
                <br />
                <ul>
                    {collections}
                </ul>
            </div>
        )
    }
})

const Login = withRouter(
    React.createClass({

        getInitialState() {
            return {
                error: false
            }
        },

        handleSubmit(event) {
            event.preventDefault()

            const email = this.refs.email.value
            const pass = this.refs.pass.value

            auth.login(email, pass, (loggedIn) => {
                if (!loggedIn)
                    return this.setState({ error: true })
            })
        },

        render() {
            return (
                <div>
                    {this.state.error && (
                        <div className="auth-alert auth-alert-error">
                            <p>Bad credentials</p>
                        </div>
                    )}
                    <form onSubmit={this.handleSubmit}>
                        <p><label>User</label></p>
                        <p><input className="form-control" type="text" ref="email" placeholder="email" /></p>
                        <p><label>Password</label></p>
                        <p><input className="form-control" type="password" ref="pass" placeholder="password" /></p>
                        <p><button className="form-control auth-btn" type="submit">login</button></p>
                    </form>
                </div>
            )
        }
    })
)

function requireAuth(nextState, replace) {
    if (!auth.loggedIn()) {
        replace({
            pathname: '/',
            state: { nextPathname: nextState.location.pathname }
        })
    }
}

ReactDOM.render(
    <Router history={ browserHistory }>
        <Route path="/" component={App}></Route>
        <Route path="/project/:project" component={AppWrapper} onEnter={requireAuth} />
        <Route path="*" component={App} />
    </Router>,
    document.getElementById('app')
);

