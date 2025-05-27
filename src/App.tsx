import { useEffect, useState } from 'react';
import CharacterForm from './components/CharacterForm';
import { fetchSavedCharacters, deleteCharacter } from './services/api';
import './App.css';

function App() {
    const [characters, setCharacters] = useState<{ id: string; imagem: string; nome: string; origem: string; habilidades: string }[] > ([])
    const [loading, setLoading] = useState(true);
    const [editingCharacter, setEditingCharacter] = useState<{ id: string; imagem: string; nome: string; origem: string; habilidades: string } | undefined > (undefined)


    const loadCharacters = async () => {
        setLoading(true);
        const savedCharacters = await fetchSavedCharacters();
        setCharacters(savedCharacters);
        setLoading(false);
    };

    useEffect(() => {
        loadCharacters();
    }, []);

    const handleDelete = async (id: string) => {
        const result = await deleteCharacter(id);
        if (result.success) {
            alert(result.message || 'Herói deletado');
            loadCharacters();
        } else {
            alert(result.message || 'Erro ao deletar herói');
        }
    };

    return (
        <div>
            <h1>Heróis da Marvel</h1>
            <CharacterForm
                character={editingCharacter}
                onSuccess={() => {
                    setEditingCharacter(undefined);
                    loadCharacters();
                }}
            />
            {loading ? (
                <div>Carregando...</div>
            ) : (
                <ul>
                    {characters.map((character) => (
                        <li key={character.id}>
                            <div>
                                <img src={character.imagem} alt={character.nome} className="character-image" />
                            </div>
                            {character.nome} - {character.origem} - {character.habilidades}
                            <button onClick={() => setEditingCharacter(character)}>Editar</button>
                            <button onClick={() => handleDelete(character.id)}>Deletar</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default App;