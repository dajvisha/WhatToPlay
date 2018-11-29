import React, { Component } from 'react'
import Modal from 'react-modal'
import "./../../styles/VideoGame.css"

Modal.setAppElement('#root')

class VideoGame extends Component {
    render() {
        return(
            <Modal isOpen={this.props.modalIsOpen}>
                <button onClick={this.props.interactModal}>Cerrar</button>
                <ModalContent videogame={this.props.videogame} />
            </Modal>);
    }
}

const ModalContent = ({ videogame }) => {
    if (videogame) {
        return (
            <div className="videogame-container">
                <h1>{videogame.name}</h1>
                <img className="image" src={videogame.image}/>
                <p>{videogame.description}</p>
                <Video video={videogame.video}></Video>
            </div>);
    }
    
    return (<div></div>);
}

const Video = ({ video }) => {
    if (video !== "") {
        return (
            <div>
                <iframe width="600" height="400" src={"https://www.youtube.com/embed/" + video}>
                </iframe>
            </div>);
    } 

    return (<div></div>);
}

export default VideoGame;
