import { useState } from "react";
import ReactModal from 'react-modal';
import './menuoptions.css'

const MenuOptions = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);


    // Get rid of these awful breaks with CSS
    return (
        <>
            <button onClick={() => setModalIsOpen(true)}>Menu</button>

            <ReactModal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
            // className="menuContainer"
            >
                <div className="menuContainer">
                    <h2 className="menuTitle menuText">Menu Options</h2>
                    <h4 className="menuSubTitle menuText">Game Options</h4>
                    {/* Custom number of spawns  */}
                    <p className="menuText">Number Of Each Object</p>
                    <input type="text" className="menuTextInput" placeholder="Enter Number" />
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