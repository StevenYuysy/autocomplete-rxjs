import * as React from 'react';
import autocompleteController from '../lib/AutocompleteController';

export default class Autocomplete extends React.Component {
  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    autocompleteController.payload$.next(e.target.value);
  };

  render() {
    return <input onChange={this.handleInputChange} />;
  }
}
