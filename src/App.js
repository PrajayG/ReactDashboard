import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

// Setting up API requests
const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

// http://hn.algolia.com/api/v1/search?query=react


const list = [
  {
    title: "React",
    url: "www.google.com",
    author: "Prajay",
    num_comments: 3,
    points: 4,
    objectID: 0
  },
  {
    title: "Redux",
    url: "www.apple.com",
    author: "Te homies",
    num_comments: 2,
    points: 4,
    objectID: 1
  },
  {
    title: "Vue",
    url: "www.apple.com",
    author: "Some lads",
    num_comments: 3,
    points: 6,
    objectID: 2
  }
];

const stats = [
  {
    CommentNum:
      list[0].num_comments + list[1].num_comments + list[2].num_comments
  }
];

//function isSearch(searchedTerm) {
//  return function(item) {
// This condition must return true or false
//    return item.title.toLowerCase().includes(searchTerm.toLowerCase());
// here we use the built in includes function from ES6 which matches the search
// Term pattern with the title property of the item from your list. This means that
// when the pattern matches you return true and that item stayes on the list.
// }
// }

const isSearched = searchTerm => item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());
// This is the same function as above but restructured for ES6.

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
      // As we are using an API to fetch the data, the result is null as no request has been made
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    // this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    // In order to define onDismiss as a class method it has be be bound to
    // the constructor as the 'this' object is the your instance of the class
  }

  setSearchTopStories(result) {
    this.setState({ result });
  }

  // fetchSearchTopStories(searchTerm) {
  //   fetch('http://hn.algolia.com/api/v1/search?query=react')
  //     .then(response => (response.json()))
  //     .then(result => this.setSearchTopStories(result))
  //     .catch(e => console.log(e))
  // }

  componentDidMount() {
    const { searchTerm } = this.state;
      fetch('http://hn.algolia.com/api/v1/search?query=react')
      .then(response => (response.json()))
      .then(result => this.setSearchTopStories(result))
      .catch(e => console.log(e))
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
    // When using a handler in the element you get access to the synthetic React event
    // in your callback function's signature. So on the field changing the blank string
    // we defined as searchTerm is now updated to whatever the user has entered.
  }

  onDismiss(id) {
    // Here is where the logic is defined.
    const isNotId = item => item.objectID !== id;
    const updatedList = this.state.list.filter(isNotId);
    // Here the isNotId function is laid out using ES6 notation, it checks that the object
    // ID isn't the same as the one given in the button click. The filter function will
    // then give a list of items that aren't the one clicked the
    this.setState({ list: updatedList });
    // Now we update the state of the component, what's happening here is the setState
    // function is updating the list in the internal component state
  }

  render() {
    const { searchTerm, result } = this.state;

    if (!result) { return null }
    return (
      
      <div className="page">
        <div className="interactions">
          <Search value={searchTerm} onChange={this.onSearchChange}>
            Search -
          </Search>

          <Table list={result.hits} pattern={searchTerm} onDismiss={this.onDismiss} />
        

          {/* <Summary list={result} stats={stats} /> */}
        </div>
        
      </div>
    );
  }
}

class Search extends Component {
  render() {
    const { value, onChange, children } = this.props;
    return (
      <div>
        <h1> Search Function </h1>
        <form>
          {children}
          
          <input type="text" value={value} onChange={onChange} />
        </form>
      </div>
    );
  }
}

class Summary extends Component {
  render() {
    const { list, stats } = this.props;
    return (
      <div className="Stats">
        <h1> {stats[0].CommentNum.toString()} </h1>
      </div>
    );
  }
}

class Table extends Component {
  render() {
    const { list, pattern, onDismiss } = this.props;
    return (
      <div className="table">
        {list.filter(isSearched(pattern)).map(item => (
          <div key={item.objectID}>
            <div className="table-row">
              <span style={{ width: "40%" }}>
                <a href={item.url}> {item.title} </a>
              </span>
              <span style={{ width: "30%" }}> Author - {item.author}</span>
              <span style={{ width: "10%" }}>
                {" "}
                Comments - {item.num_comments}
              </span>
              <span style={{ width: "10%" }}> Points - {item.points}</span>
              <span style={{ width: "10%" }}>
                <Button
                  onClick={() => onDismiss(item.objectID)}
                  type="button"
                  className="button-inline"
                >
                  Delete
                </Button>
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

class Button extends Component {
  render() {
    const { onClick, className, children } = this.props;

    return (
      <button onClick={onClick} className="" type="button">
        {children}
      </button>
    );
  }
}

export default App;
