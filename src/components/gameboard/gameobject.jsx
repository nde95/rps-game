const GameObject = ({ id, left, top }) => {
    const className = `game-object object-${id}`;
    return (
        <div className={className} style={{ left, top }}>
        </div>
    );
};

export default GameObject;