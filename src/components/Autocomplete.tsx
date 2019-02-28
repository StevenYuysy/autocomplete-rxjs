import * as React from 'react';
import AutocompleteController, { User } from '../lib/AutocompleteController';
import { Subject } from 'rxjs';

interface IState {
  text: string;
  response: User[];
  warning: boolean;
  loading: boolean;
}

export default class Autocomplete extends React.Component<any, IState> {
  text: Subject<string> = new Subject();
  response: Subject<User[]> = new Subject();
  warning: Subject<boolean> = new Subject();
  loading: Subject<boolean> = new Subject();
  state: IState = {
    text: '',
    response: [],
    warning: false,
    loading: false,
  };

  controller: AutocompleteController = new AutocompleteController({
    text: this.text,
    response: this.response,
    warning: this.warning,
    loading: this.loading,
  });

  constructor(props: any) {
    super(props);
    this.text.subscribe({
      next: (text: string) => {
        this.setState({ text });
      },
    });
    this.response.subscribe({
      next: (response: User[]) => {
        this.setState({ response });
      },
    });
    this.warning.subscribe({
      next: (warning: boolean) => {
        this.setState({ warning });
      },
    });
    this.loading.subscribe({
      next: (loading: boolean) => {
        this.setState({ loading });
      },
    });
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.controller.payload$.next(e.target.value);
  };

  renderUserItem() {
    return this.state.response.map(user => <li key={user.id}>{user.name}</li>);
  }

  render() {
    return (
      <div>
        <input onChange={this.handleInputChange} value={this.state.text} />
        {this.state.loading && 'loading'}
        {this.state.warning && 'warning'}
        <ul>{this.renderUserItem()}</ul>
      </div>
    );
  }
}
