import { useState } from "react";
import ReactModal from 'react-modal';

const MenuOptions = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);


    // Get rid of these awful breaks with CSS
    return (
        <>
            <button onClick={() => setModalIsOpen(true)}>Menu</button>

            <ReactModal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
            >
                <h2>Menu Options</h2>
                <br />
                <h4>Game Options</h4>
                <br />
                {/* Custom number of spawns  */}
                <p>Number Of Each</p>
                <input type="text" className="menuTextInput" placeholder="Enter Number" />
                <br />
                <p>Chaos Mode</p>
                <input type="checkbox"
                    className='menuButton'
                    value='chaos'
                    id='chaos'
                />
                <label htmlFor='chaos'>Change Spawns to be truly random anywhere on the screen</label>
                <button className="menuButton menuCloseButton" onClick={() => setModalIsOpen(false)}>Close</button>
            </ReactModal>
        </>
    );
};

export default MenuOptions;