// src/App.tsx
import { useEffect, useState } from 'react';
import CharacterForm from './components/CharacterForm';
import { fetchSavedCharacters, deleteCharacter } from './services/api';

function App() {
    const [characters, setCharacters] = useState<
        { id: string; imagem: string; nome: string; origem: string; habilidades: string }[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [editingCharacter, setEditingCharacter] = useState<
        { id: string; imagem: string; nome: string; origem: string; habilidades: string } | undefined
    >(undefined);

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
            alert(result.message || 'Her�i deletado');
            loadCharacters();
        } else {
            alert(result.message || 'Erro ao deletar her�i');
        }
    };

    return (
        <div>
            <h1>Her�is da Marvel</h1>
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