import React, { Component } from 'react';
import './../styles/InicioPage.css';

class InicioPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      userEdad: '',
      userVGPlatforms: [],
      userVGGenres: [],
    };
    this.onChangeTF = this.onChangeTF.bind(this);
    this.clickactionContinue = this.clickactionContinue.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  clickactionContinue() {
    let userData = {};
    userData['userName'] = this.state.userName;
    userData['userAge'] = this.state.userEdad;
    userData['userVGPlatforms'] = this.state.userVGPlatforms;
    userData['userVGGenres'] = this.state.userVGGenres;

    this.props.actionContinue(userData);
  }

  onChangeTF(event, stateKey) {
    let newValue = event.target.value;
    let newObject = {};
    newObject[stateKey] = newValue;
    this.setState(newObject);
  }

  onSelect(event, stateKey, selectedValue) {
    let stateProperty = this.state[stateKey];
    let newObject = {};

    if (event.target.checked) {
      stateProperty.push(selectedValue);
    } else {
      stateProperty.splice(stateProperty.indexOf(selectedValue), 1);
    }

    newObject[stateKey] = stateProperty;
    this.setState(newObject);
  }

  render() {
    return (
      <div className="inicio-page">
        <div className="inicio-form">
          <h3 className="inicio-title">What To Play</h3>
          <div className="inicio-body>">
            <InputTF stateKey={'userName'} labelName={'Name'} placeHolder={'Enter your name'} inputValue={this.state.userName} onChangeTF={this.onChangeTF} />
            <InputTF stateKey={'userEdad'} labelName={'Age'} placeHolder={'Enter your age'} inputValue={this.state.userEdad} onChangeTF={this.onChangeTF} />
            <InputCheckBox labelName={'Platforms'} type={'userVGPlatforms'} list={this.props.platformsList} onSelect={this.onSelect} />
            <InputCheckBox labelName={'Genres'} type={'userVGGenres'} list={this.props.genresList} onSelect={this.onSelect} />
          </div>
          <div className="buttons-container">
            <button onClick={this.clickactionContinue}>Continue</button>
          </div>
        </div>
      </div>
    );
  }
}

const InputTF = ({ stateKey, labelName, placeHolder, inputValue, onChangeTF }) => {
  return (
    <div>
      <p className="label label-inline">{labelName}: </p><input type="text" className="input-tf" placeholder={placeHolder} value={inputValue} onChange={(e) => onChangeTF(e, stateKey)}></input>
    </div>
  );
};

const InputCheckBox = ({ labelName, type, list, onSelect }) => {
  return (
    <div className="select-container">
      <p className="label">{labelName}:</p>
      <div className="select-items-container">
        {list.map((item, index) => (
          <div className="select-item" key={type + '-' + index}>
            <label className="checkbox-container">{item}
              <input type="checkbox" onChange={(e) => onSelect(e, type, item)}></input>
              <span className="checkmark"></span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InicioPage;
