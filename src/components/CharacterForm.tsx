// src/components/CharacterForm.tsx
import { useState, useEffect } from 'react';
import { verifyCharacterName, addCharacter, updateCharacter } from '../services/api';

interface CharacterFormProps {
    character?: { id: string; imagem: string; nome: string; origem: string; habilidades: string };
    onSuccess: () => void;
}

function CharacterForm({ character, onSuccess }: CharacterFormProps) {
    const [nome, setNome] = useState(character?.nome || '');
    const [imagem, setImagem] = useState(character?.imagem || '');
    const [origem, setOrigem] = useState(character?.origem || '');
    const [habilidades, setHabilidades] = useState(character?.habilidades || '');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (character) {
            setNome(character.nome);
            setImagem(character.imagem);
            setOrigem(character.origem);
            setHabilidades(character.habilidades);
        }
    }, [character]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        console.log('Verificando nome:', nome);
        const nameExists = await verifyCharacterName(nome);
        console.log('Nome existe?', nameExists);
        if (!nameExists) {
            setError(`Herói "${nome}" não encontrado na API da Marvel`);
            setIsSubmitting(false);
            return;
        }

        const characterData = { imagem, nome, origem, habilidades };

        const result = character
            ? await updateCharacter(character.id, characterData)
            : await addCharacter(characterData);

        setIsSubmitting(false);

        if (result.success) {
            setSuccess(result.message || 'Operação realizada com sucesso');
            setNome('');
            setImagem('');
            setOrigem('');
            setHabilidades('');
            onSuccess();
        } else {
            setError(result.message || 'Erro ao processar a operação');
        }
    };

    return (
        <div>
            <h2>{character ? 'Editar Herói' : 'Adicionar Herói'}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nome (ex.: Spider-Man ou Homem-Aranha):</label>
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Ex.: Spider-Man"
                        required
                    />
                </div>
                <div>
                    <label>URL da Imagem:</label>
                    <input
                        type="url"
                        value={imagem}
                        onChange={(e) => setImagem(e.target.value)}
                        placeholder="Ex.: https://exemplo.com/imagem.jpg"
                        required
                    />
                </div>
                <div>
                    <label>Origem:</label>
                    <input
                        type="text"
                        value={origem}
                        onChange={(e) => setOrigem(e.target.value)}
                        placeholder="Ex.: Nova York"
                        required
                    />
                </div>
                <div>
                    <label>Habilidades:</label>
                    <textarea
                        value={habilidades}
                        onChange={(e) => setHabilidades(e.target.value)}
                        placeholder="Descreva as habilidades"
                        required
                    />
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Enviando...' : character ? 'Atualizar' : 'Adicionar'}
                </button>
            </form>
        </div>
    );
}

export default CharacterForm;