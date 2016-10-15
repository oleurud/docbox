import React from 'react';
import remark from 'remark';
import slug from 'remark-slug';
import App from './app';
import $ from 'jquery';

var AppWrapper = React.createClass({
    getInitialState: function() {
        return {
            ast: null,
            content: null
        };
    },

    componentDidMount: function() {
        this.serverRequest = $.get('http://localhost:8000/source/Forme/markdown', function (result) {
            let content = result.data;
            let ast = remark()
                    .use(slug)
                    .run(remark().parse(content));

            this.setState({
                content: content,
                ast: ast
            });
        }.bind(this));
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    render: function() {
        if(this.state.ast && this.state.content) {
            return (
                <App ast={this.state.ast} content={this.state.content}/>
            )
        } else {
            return <div></div>
        }
    }
});

module.exports = AppWrapper;