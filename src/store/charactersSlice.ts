import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    fetchSavedCharacters,
    deleteCharacter as apiDeleteCharacter,
    addCharacter as apiAddCharacter,
    updateCharacter as apiUpdateCharacter,
} from '../services/api';

interface Character {
    id: string
    imagem: string
    nome: string
    origem: string
    habilidades: string
}

interface CharactersState {
    characters: Character[]
    loading: boolean
    error: string | null
}

const initialState: CharactersState = {
    characters: [],
    loading: false,
    error: null,
}

export const loadCharacters = createAsyncThunk('characters/load', async () => {
    const data = await fetchSavedCharacters()
    return data
})

export const deleteCharacter = createAsyncThunk('characters/delete', async (id: string) => {
    const result = await apiDeleteCharacter(id)
    if (!result.success) throw new Error(result.message)
    return id
})

export const addCharacter = createAsyncThunk('characters/add', async (character: Omit<Character, 'id'>) => {
    const result = await apiAddCharacter(character)
    if (!result.success) throw new Error(result.message)
    return character
})

export const updateCharacter = createAsyncThunk(
    'characters/update',
    async ({ id, character }: { id: string; character: Omit<Character, 'id'> }) => {
        const result = await apiUpdateCharacter(id, character)
        if (!result.success) throw new Error(result.message)
        return { id, character }
    }
)

const charactersSlice = createSlice({
    name: 'characters',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadCharacters.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loadCharacters.fulfilled, (state, action) => {
                state.loading = false
                state.characters = action.payload
            })
            .addCase(loadCharacters.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Erro ao carregar personagens'
            })
            .addCase(deleteCharacter.fulfilled, (state, action) => {
                state.characters = state.characters.filter((c) => c.id !== action.payload)
            })
            .addCase(deleteCharacter.rejected, (state, action) => {
                state.error = action.error.message || 'Erro ao deletar personagem'
            })
    },
})

export default charactersSlice.reducer
