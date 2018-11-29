import React, { Component } from 'react';
import { Header, VideoGameList, VideoGame, Users, SelectUser } from './presentational';
import { Loading } from './presentational/elements';
import './../styles/MainPage.css';

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videogameList: [],
      loading: false,
      modalIsOpen: false,
      videogameSelected: {},
      selectUserOpen: false, 
      recomendations: false,
      headerText: "There are no video games form you",
    }
    this.interactModal = this.interactModal.bind(this);
    this.interactUser = this.interactUser.bind(this);
    this.selectVideogame = this.selectVideogame.bind(this);
  }

  componentDidMount() {
    let recomendationsList = this.props.recomendations;

    if (recomendationsList.length !== 0 ){
      this.setState({ headerText: "Here is your video game recommendation:"} );
      this.setState({ recomendations: true });
      this.setState({ videogameList: this.props.recomendations });
    } 
  }

  interactModal() {
    let modalIsOpen = this.state.modalIsOpen;
    this.setState({modalIsOpen: !modalIsOpen});
  }

  interactUser() {
    let selectUserOpen = this.state.selectUserOpen;
    this.setState({selectUserOpen: !selectUserOpen});
  }

  selectVideogame(videogame) {
    this.setState({videogameSelected: videogame});
    this.interactModal();
  }

  render() {
    return (
      <div>
        <Users userName={this.props.userName} interactModal={this.interactUser} />
        <div className="container">
          <Header headerText={this.state.headerText} />
          <Content recomendations={this.state.recomendations} videogameList={this.state.videogameList} loading={this.state.loading} selectVideogame={this.selectVideogame} />
          <VideoGame modalIsOpen={this.state.modalIsOpen} interactModal={this.interactModal} videogame={this.state.videogameSelected} />
          <SelectUser modalIsOpen={this.state.selectUserOpen} interactModal={this.interactUser} />
        </div>
      </div>
    );
  }
}

const Content = ({ recomendations, videogameList, loading, selectVideogame }) => {
  if (loading) {
    return <Loading />
  } else if (recomendations) {
    return <VideoGameList videogameList={videogameList} selectVideogame={selectVideogame} />
  } else {
    return (
      <div className="container-image">
        <img src="http://bit.ly/2OlqMnG"></img>
      </div>);
  }
}

export default MainPage;
