import './App.css';
import React, {useState} from 'react';
import Header from './Heading';


function App() {
  return (
        <MyComponent/>
    );
 }

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      results: [],
      limit: 25,
      searchInput: ""
    };
  }

  componentDidMount() {
    fetch("http://localhost:8080/search/" + this.searchInput)
      .then(res => res.json())
      .then(
        (result) => {
        console.log(result);
          this.setState({
            isLoaded: true
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  handleChange = (e) =>{
      this.setState({
          searchInput: e.target.value,
          results: []
      })
  }

  handleClick = (e) =>{
      console.log("Working " + this.state.searchInput)
      fetch("http://localhost:8080/search/" + this.state.searchInput)
          .then(res => res.json())
          .then(
              (result) => {
                  console.log(result);
                  this.setState({
                      results: jsonSorter(result)
                  });
              },
              (error) => {
                  this.setState({
                      isLoaded: true,
                      error
                  });
              }
          )
}

  limitUp = () =>{
      if(parseInt(this.limit) < 50){
          let limitPlaceHolder = this.limit +1
          this.setState({
              limit: limitPlaceHolder
          })
      }
  }

  limitDown = () =>{
      if(this.limit > 5){
          this.setState({
              limit: this.limit-1
          })
      }
  }

  setIsPressedTrue = ()=> {
    this.handleClick();
    this.setState({
        ...this.state,
        showResults: true
    });
  }
  render() {
    const { error, isLoaded,results, limit } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div className='centered'>Loading...</div>;
    } else {
      return (
          <div className='centered'>
              <LimitChanger up={this.limitUp} down={this.limitDown} limit={limit}/>
            <h3>Search for Songs Here</h3>
              <input type='text' onChange={this.handleChange}/>
            <br/>
            {this.state && <ResultsButton showResults={this.setIsPressedTrue}/>}
            {this.state.showResults && <Results input={this.state.searchInput} results = {results}/>}
            <Counter/>
          </div>
      );
    }
  }
}

const Results = (props) =>{
  return (
      <div>
        <Header text = "This is " name = {props.input}/>
        <ul>
          {props.results.map(index => <ListItem name={index.name} artists ={index.artists} image = {index.image} preview ={index.preview}/>)}
        </ul>
      </div>
  );
}

const ResultsButton = (props) =>{
  return <button onClick = {props.showResults}>Test Me Out!</button>
}

const jsonSorter = (json) =>{
    let trackNames = [];
    let trackArtists = [];
    let results = [];
    let itemsInfo = json.tracks.items;
    for(let i = 0; i < itemsInfo.length; i++) {
        trackNames = "";
       trackArtists = [];
       trackNames = (itemsInfo[i].name)
        for(let j = 0; j < itemsInfo[i].artists.length;j++){
            let placeHolder = itemsInfo[i].artists.length > 1 &&  j != itemsInfo[i].artists.length-1 ? " & " : "";
            trackArtists.push(itemsInfo[i].artists[j].name + placeHolder)
        }
        let image = itemsInfo[i].album.images[0].url;
        let preview = itemsInfo[i].preview_url;
        results.push({"name": trackNames, 'artists' : trackArtists, 'image': image, "preview": preview});
    }
    return results;
}

const ListItem = (props) => {
    return(
      <div>
          <img className="centeredImg" src = {props.image}/>
          <p className='centered'>{props.name}: {props.artists}</p>
          <ShowAudio preview = {props.preview}/>
      </div>
)}

const ShowAudio = (props) => {
    return( props.preview != null ?
        <div>
    <audio controls id="centeredImg">
        <source
            src={props.preview}
            type="audio/mpeg"
        />
    </audio>
        </div>:
            <h3>No Preview Available</h3>
    );
}

const LimitChanger = (props) =>{
    return(
        <div>
            <div id={"Number"}>
                <h4 id={'numberText'}>How many results do you want?</h4>
                <input value={props.limit}id={"NumberInput"} maxlength={2} type={'text'}/>
            <button onClick={props.up} className={'upDown'} >-1</button>
            <button onClick={props.down} className={'upDown'} >+1</button>
            </div>
        </div>
    );
}

const Counter = () => {
    const [count, setCount] = useState(0);

    const incrementHandler = e => {
        e.preventDefault();
        setCount(count + 1);
    }

    return(
        <div>
            <p>{count}</p>
            <button onClick={incrementHandler}> increment </button>
        </div>
    )
}


export default App;