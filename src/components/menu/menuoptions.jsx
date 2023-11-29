import { useState } from "react";
import ReactModal from 'react-modal';
import './menuoptions.css'

const MenuOptions = ({ onSetObjectCounts }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [numberOfObjects, setNumberOfObjects] = useState(10); // Default value

    const handleNumberChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setNumberOfObjects(isNaN(value) ? '' : value);
    };

    const handleApply = () => {
        onSetObjectCounts(numberOfObjects);
        setModalIsOpen(false);
    };


    return (
        <>
            <button onClick={() => setModalIsOpen(true)}>Menu</button>

            <ReactModal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
            >
                <div className="menuContainer">
                    <h2 className="menuTitle menuText">Menu Options</h2>
                    <h4 className="menuSubTitle menuText">Game Options</h4>
                    <p className="menuText">Number Of Each Object</p>
                    <input
                        type="text"
                        className="menuTextInput"
                        placeholder="Enter Number (Default Is 10)"
                        value={numberOfObjects}
                        onChange={handleNumberChange}
                    />
                    <button
                        className="menuButton menuApplyButton"
                        onClick={handleApply}
                    >
                        Apply
                    </button>
                    <p className="menuText">Chaos Mode</p>
                    <div className="chaosGroup">
                        <input type="checkbox"
                            className='menuButton'
                            value='chaos'
                            id='chaos'
                        />
                        <label className="menuLabel menuText" htmlFor='chaos'>Change Spawns to be truly random anywhere on the screen</label>
                    </div>
                    <button className="menuButton menuCloseButton" onClick={() => setModalIsOpen(false)}>Close</button>
                </div>
            </ReactModal>
        </>
    );
};

export default MenuOptions;