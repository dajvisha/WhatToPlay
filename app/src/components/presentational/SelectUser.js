import React, { Component } from 'react'
import Modal from 'react-modal'

Modal.setAppElement('#root')

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

class SelectUser extends Component {
    render() {
        return (
            <Modal isOpen={this.props.modalIsOpen} style={customStyles}>
                <button onClick={this.props.interactModal}>Cerrar</button>
                <div className="videogame-container">
                    Selecciona un usuario:
                    <div>
                        <ul><button>Usuario 1</button></ul>
                        <ul><button>Usuario 2</button></ul>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default SelectUser;
