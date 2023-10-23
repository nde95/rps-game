const GameObject = ({ id, left, top }) => {
    return (
        <div className="entity" style={{ left, top }}>
            {id}
        </div>
    );
};

export default GameObject;