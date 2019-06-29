"use strict";
const React = require("react");
const { Component } = React;
const { Text } = require("ink");
const TextInput = require("ink-text-input").default;
const autoBind = require("auto-bind");

const colorConv = require(".");

const QueryInput = ({ query, placeholder, onChange }) => (
  <div>
    <Text bold>
      <Text cyan>›</Text>{" "}
      <TextInput value={query} placeholder={placeholder} onChange={onChange} />
    </Text>
  </div>
);

const Color = ({ color }) => <span>{colorConv.name(color)[1]}</span>;

class ColorComponent extends Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      query: ""
    };
  }

  render() {
    const { query } = this.state;

    return (
      <span>
        <br />
        <QueryInput
          query={query}
          placeholder="Colors will be converted to SCSS variables as you type"
          onChange={this.handleChangeQuery}
        />
        <Color color={query} />
      </span>
    );
  }
  componentDidMount(){
    process.stdin.on('keypress', this.handleKeyPress);
  }
  handleKeyPress(ch, key = {}) {
    const { onExit, onSelectColor } = this.props;
    const { query } = this.state;

    if (key.name === "escape" || (key.ctrl && key.name === "c")) {
      onExit();
      return;
    }

    if (key.name === "return") {
      if (query) {
        this.setState(
          {
            copied: true
          },
          () => {
            onSelectColor(colorConv.name(query)[1]);
          }
        );
      }

      return;
    }
  }

  handleChangeQuery(query) {
    this.setState({
      query
    });
  }
}

module.exports = ColorComponent;
