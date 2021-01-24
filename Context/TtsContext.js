import React from 'react';
import Context from './Context';

export default class GlobalState extends React.Component {
  state = {
    display: true,
  };

  toggleDisplay = () => {
    this.setState(prevState => ({
      display: !prevState.display,
    }));
  };

  render() {
    return (
      <Context.Provider
        value={{
          display: this.state.display,
          toggleDisplay: this.toggleDisplay,
        }}>
        {this.props.children}
      </Context.Provider>
    );
  }
}
