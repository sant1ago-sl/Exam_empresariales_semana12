import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, InputGroup, Image, Button, Spinner } from 'react-bootstrap';

function PokemonSearch() {
  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPokemons = async () => {
    setLoading(true);
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
    const results = response.data.results;

    const detailedPokemons = await Promise.all(results.map(async (poke) => {
      const detail = await axios.get(poke.url);
      return {
        name: detail.data.name,
        image: detail.data.sprites.front_default,
        types: detail.data.types.map(t => t.type.name).join(', '),
        id: detail.data.id,
        weight: detail.data.weight,
        height: detail.data.height,
        base_experience: detail.data.base_experience
      };
    }));

    setPokemons(detailedPokemons);
    setLoading(false);
  };

  const filteredPokemons = pokemons
    .filter(poke =>
      poke.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Container style={{ marginTop: "30px" }}>
      <h1 className="text-primary text-center mb-3" style={{ fontWeight: "bold" }}>Pokémon List</h1>
      <InputGroup className="mb-4" style={{ maxWidth: 400, margin: "auto" }}>
        <Form.Control
          placeholder="Buscar Pokémon..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </InputGroup>
      <div className="text-center mb-4">
        <Button onClick={fetchPokemons} disabled={loading} variant="success">
          {loading ? <Spinner size="sm" animation="border" /> : "Cargar Pokémon"}
        </Button>
      </div>
      <Row>
        {filteredPokemons.map((poke, index) => (
          <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card
              className="h-100 shadow-sm"
              style={{ borderRadius: "16px", border: "1px solid #dee2e6", background: "#fafafa" }}
            >
              <Card.Body className="d-flex flex-column align-items-center">
                <Image
                  src={poke.image}
                  rounded
                  style={{ width: "90px", background: "#f8f8f8", marginBottom: 10 }}
                  alt={poke.name}
                />
                <Card.Title style={{ textTransform: "capitalize", fontWeight: 600 }}>{poke.name}</Card.Title>
                <Card.Text className="mb-0">
                  <span style={{ fontWeight: 500 }}>ID:</span> #{poke.id}
                </Card.Text>
                <Card.Text>
                  <span style={{ fontWeight: 500 }}>Tipos:</span> {poke.types}
                </Card.Text>
                <Card.Text>
                  <span style={{ fontWeight: 500 }}>Peso:</span> {poke.weight} | <span style={{ fontWeight: 500 }}>Altura:</span> {poke.height}
                </Card.Text>
                <Card.Text>
                  <span style={{ fontWeight: 500 }}>Base XP:</span> {poke.base_experience}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default PokemonSearch;
