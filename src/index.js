import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Router, Route, Link, withRouter } from 'react-router';
import auth from './services/auth';
import AppWrapper from './components/appWrapper';
import webService from './services/webservice';

const App = React.createClass({
    getInitialState() {
        this.handleLogout = () => {
            auth.logout();
            this.setState({
                false
            })
        }

        return {
            loggedIn: auth.loggedIn()
        }
    },

    updateAuth(loggedIn) {
        this.setState({
            loggedIn
        })
    },

    componentWillMount() {
        auth.onChange = this.updateAuth
    },

    render() {
        const homeView = this.state.loggedIn ? <Dashboard /> : <Login />

        return (
            <div>
                <ul id="auth-header">
                    {this.state.loggedIn ? (
                        <li><Link to="/" onClick={this.handleLogout}>Log out</Link></li>
                    ) : (
                        <li><Link to="/">Sign in</Link></li>
                    )}
                    <li><Link to="/about">About</Link></li>
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
                }
            }
        )
    },

    render() {
        const collections = this.state.collections.map( (collection) => {
            const link = "/project/" + collection.name;
            return <Link to={link} key={collection.name}>{collection.name}</Link>
        });

        return (
            <div>
                <h1>Collections</h1>
                {collections}
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

const NotFound = React.createClass({
    render() {
        return <h1>Not found</h1>
    }
})

const About = React.createClass({
    render() {
        return <h1>About</h1>
    }
})


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
        <Route path="/" component={App}>
            <Route path="/about" component={About} />
            <Route path="/register" component={About} />
        </Route>
        <Route path="/project/:project" component={AppWrapper} onEnter={requireAuth} />
        <Route path="*" component={NotFound} />
    </Router>,
    document.getElementById('app')
);

