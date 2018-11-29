import { CarbonLDP } from "carbonldp";
import { Event } from "carbonldp/Messaging/Event";

import React, { Component } from 'react';
import { InicioPage, MainPage } from './components';
import { Loading } from './components/presentational/elements';
import { fetchData } from './microserver/microserver';
import {ToastContainer, ToastStore} from 'react-toasts';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newEvent: false,
      platformsList: [],
      genresList: [],
      isActionContinue: false,
      isLoading: true, 
      userName: '',
      recomendations: [],
    }
    this.actionContinue = this.actionContinue.bind(this);
  }

  componentDidMount() {
    const carbonldp = new CarbonLDP("https://db.itesm-01.carbonldp.com/");

    carbonldp.documents.$on(Event.CHILD_CREATED, "/*", (message) => {
      this.setState({newEvent: true});
      //alert("New video game added!");
      ToastStore.success("New video game added!");
      console.log(message);
    }, function(error) {
      console.log(error);
    });

    fetchData('Inicio').then((response) => {
      this.setState({genresList: response.genresList});
      this.setState({platformsLista: response.platformsList});
      this.setState({isLoading: false});
    });
  }

  actionContinue(userData) {
    let userName = userData.userName;
    this.setState({userName: userName});
    this.setState({isLoading: true});

    fetchData('Recomendations', userData).then((response) => {
      this.setState({recomendations: response.recomendations});
      this.setState({isActionContinue: true});
      this.setState({isLoading: false});
    });
  }
  
  render() {
    return (
      <div>
        <NewEvent newEvent={this.state.newEvent} />
        <Content userName={this.state.userName} recomendations={this.state.recomendations} isLoading={this.state.isLoading} isActionContinue={this.state.isActionContinue} actionContinue={this.actionContinue} platformsList={this.state.platformsLista} genresList={this.state.genresList}/>
      </div>
    );
  }
}

const Content = ({ userName, recomendations, isLoading, isActionContinue, actionContinue, platformsList, genresList }) => {
  if (isLoading) {
    return <Loading />
  } else if (isActionContinue) {
    return <MainPage userName={userName} recomendations={recomendations} />
  } else {
    return <InicioPage actionContinue={actionContinue} platformsList={platformsList} genresList={genresList} />
  }
}

const NewEvent = ({ newEvent }) => {
  if (newEvent) {
    return (<div><ToastContainer store={ToastStore}/></div>);
  } else {
    return (<div></div>);
  }
}

export default App;
