import md5 from "md5";

const PUBLIC_KEY = '9ab2487c5ec2aed25a742b5f43231f9a'
const PRIVATE_KEY = 'e2ace0a822154ba6694cf0913a0bcce5ab80e3fd'
const MARVEL_BASE_URL = 'https://gateway.marvel.com/v1/public';
const API_BASE_URL = 'https://crud-heroisbackend.onrender.com';

const nameTranslations: { [key: string]: string } = {
    'Homem-Aranha': 'Spider-Man',
    'Homem de Ferro': 'Iron Man',
    'Capitão América': 'Captain America',
    'Hulk': 'Hulk',
    'Thor': 'Thor',
    'Viúva Negra': 'Black Widow',
    'Pantera Negra': 'Black Panther',
};

const getAuthParams = () => {
    const ts = Date.now().toString();
    const hash = md5(ts + PRIVATE_KEY + PUBLIC_KEY);
    return { ts, apikey: PUBLIC_KEY, hash };
};

export const verifyCharacterName = async (name: string): Promise<boolean> => {
    try {
        const marvelName = nameTranslations[name] || name;
        console.log('Verificando nome:', name, '->', marvelName);
        const encodedName = encodeURIComponent(marvelName);
        const params = new URLSearchParams({
            ...getAuthParams(),
            name: encodedName,
        });
        const url = `${MARVEL_BASE_URL}/characters?${params}`;
        console.log('URL da Marvel:', url);
        const response = await fetch(url);
        if (!response.ok) {
            console.error('Erro na API da Marvel:', response.status, response.statusText);
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Resposta da Marvel:', data);
        return data.data.count > 0;
    } catch (error) {
        console.error('Erro ao verificar nome na Marvel:', error);
        return false;
    }
};

export const addCharacter = async (character: {
    imagem: string;
    nome: string;
    origem: string;
    habilidades: string;
}): Promise<{ success: boolean; message?: string }> => {
    try {
        console.log('Enviando para o backend:', character);
        const response = await fetch(`${API_BASE_URL}/heroes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(character),
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro do backend:', errorData);
            return { success: false, message: errorData.message.join(', ') || 'Erro ao adicionar herói' };
        }
        return { success: true, message: 'Herói salvo com sucesso' };
    } catch (error) {
        console.error('Erro na requisição:', error);
        return { success: false, message: 'Erro ao conectar com a API' };
    }
};

export const updateCharacter = async (
    id: string,
    character: {
        imagem: string;
        nome: string;
        origem: string;
        habilidades: string;
    }
): Promise<{ success: boolean; message?: string }> => {
    try {
        console.log('Atualizando herói:', id, character);
        const response = await fetch(`${API_BASE_URL}/heroes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(character),
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro do backend:', errorData);
            return { success: false, message: errorData.message.join(', ') || 'Erro ao atualizar herói' };
        }
        return { success: true, message: 'Herói atualizado com sucesso' };
    } catch (error) {
        console.error('Erro na requisição:', error);
        return { success: false, message: 'Erro ao conectar com a API' };
    }
};

export const deleteCharacter = async (id: string): Promise<{ success: boolean; message?: string }> => {
    try {
        console.log('Deletando herói:', id);
        const response = await fetch(`${API_BASE_URL}/heroes/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro do backend:', errorData);
            return { success: false, message: errorData.message || 'Erro ao deletar herói' };
        }
        return { success: true, message: 'Herói deletado com sucesso' };
    } catch (error) {
        console.error('Erro na requisição:', error);
        return { success: false, message: 'Erro ao conectar com a API' };
    }
};

export const fetchSavedCharacters = async (): Promise<
    { id: string; imagem: string; nome: string; origem: string; habilidades: string }[]
> => {
    try {
        const response = await fetch(`${API_BASE_URL}/heroes`);
        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error('Erro ao buscar heróis salvos:', error);
        return [];
    }
};