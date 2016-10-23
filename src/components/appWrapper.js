import React from 'react';
import remark from 'remark';
import slug from 'remark-slug';
import Documentation from './documentation';
import auth from './../services/auth';
import webService from './../services/webservice';

var AppWrapper = React.createClass({
    getInitialState: function() {
        return {
            ast: null,
            content: null
        };
    },

    componentDidMount: function() {
        webService.doCall(
            'GET',
            '/source/' + this.props.params.project + '/markdown',
            {},
            {
                Authorization: auth.getToken()
            },
            (err, response) => {
                if(!err) {
                    let content = response;
                    let ast = remark()
                        .use(slug)
                        .run(remark().parse(content));

                    this.setState({
                        content: content,
                        ast: ast
                    });
                }
            }
        )
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    render: function() {
        if(this.state.ast && this.state.content) {
            return (
                <Documentation ast={this.state.ast} content={this.state.content}/>
            )
        } else {
            return <div></div>
        }
    }
});

module.exports = AppWrapper;
