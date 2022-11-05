import { Card, Badge } from "react-bootstrap";

const PokemonCard = ({ pokemon }) => {
  const { name, avatar, types, stats } = pokemon;

  return (
    <Card style={{ width: "18rem" }}>
      <Card.Img variant="top" src={avatar} />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>
          {stats.map(({ base_stat, stat }) => (
            <span key={Math.random()}>
              {stat.name}: {base_stat}{" | "}
            </span>
          ))}
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        {types.map(({ type }) => (
          <span key={Math.random()}>
            <Badge bg="danger">{type.name}</Badge>{" "}
          </span>
        ))}
      </Card.Footer>
    </Card>
  );
};

export default PokemonCard;
