import React from 'react'
import "./../../styles/VideoGameList.css"

const VideoGameList = ({ videogameList, selectVideogame }) => {
    return (
        <div className="grid-container">
            {videogameList.map((videogame, index) => (
                <VideoGameItem videogame={videogame} selectVideogame={selectVideogame} key={"vg-" + index} />
            ))}
        </div>
    );
}

const VideoGameItem = ({ videogame, selectVideogame }) => {
    return (
        <div className="grid-item" onClick={() => selectVideogame(videogame)}>
            <div>
                <img className="image" src={videogame.image} />
            </div>
            <div className="text">
                <div className="videogame-title">{videogame.name}</div>
            </div>
        </div>
    );
}

export default VideoGameList;
