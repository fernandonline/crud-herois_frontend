import { useEffect, useState } from 'react'
import CharacterForm from './components/CharacterForm'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from './store/store';
import { loadCharacters, deleteCharacter } from './store/charactersSlice'
import './App.css'

function App() {
    const dispatch = useDispatch<AppDispatch>()
    const { characters, loading, error } = useSelector((state: RootState) => state.characters)
    const [editingCharacter, setEditingCharacter] = useState<
        { id: string; imagem: string; nome: string; origem: string; habilidades: string } | undefined
    >(undefined)

    useEffect(() => {
        dispatch(loadCharacters())
    }, [dispatch])

    const handleDelete = async (id: string) => {
        try {
            await dispatch(deleteCharacter(id)).unwrap()
            alert('Herói deletado com sucesso')
        } catch (err: any) {
            alert(err.message || 'Erro ao deletar herói')
        }
    }

    return (
        <div>
            <h1>Heróis da Marvel</h1>
            <CharacterForm
                character={editingCharacter}
                onSuccess={() => {
                    setEditingCharacter(undefined)
                    dispatch(loadCharacters())
                }}
            />
            {loading && <div>Carregando...</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {!loading && !error && (
                <ul>
                    {characters.map((character) => (
                        <li key={character.id}>
                            <div className="image-container">
                                <img src={character.imagem} alt={character.nome} className="character-image" />
                            </div>
                            <div className="info-container">
                                <span>Nome</span>
                                <div className="info-box name">{character.nome}</div>
                                <span>Origem</span>
                                <div className="info-box origin">{character.origem}</div>
                                <span>Habilidades</span>
                                <div className="info-box skills">{character.habilidades}</div>
                            </div>
                            <div className="buttons">
                                <button onClick={() => setEditingCharacter(character)}>Editar</button>
                                <button onClick={() => handleDelete(character.id)}>Deletar</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default App