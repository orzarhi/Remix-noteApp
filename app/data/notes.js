import fs from 'fs/promises';

export const getStoredNotes = async () => {
    const rawFileContent = await fs.readFile('notes.json', { encoding: 'utf-8' });
    const data = JSON.parse(rawFileContent);
    const storedNotes = data.notes ?? [];
    return storedNotes;
}

export const storeNotes = (notes) => {
    return fs.writeFile('notes.json', JSON.stringify({ notes: notes || [] }));
}