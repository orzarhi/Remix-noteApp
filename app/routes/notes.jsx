import { json, redirect } from "@remix-run/node";
import { Link, useCatch, useLoaderData } from "@remix-run/react";
import NewNote, { links as newNoteLinks } from "~/components/NewNote";
import NoteList, { links as noteListLink } from "~/components/NoteList";
import { getStoredNotes, storeNotes } from "~/data/notes";

export default function NotesPage() {
    const notes = useLoaderData();

    return (
        <main>
            <NewNote />
            <NoteList notes={notes} />
        </main>
    );
}

export const loader = async () => {
    const notes = await getStoredNotes();
    if (!notes || notes.length === 0) {
        throw json({ message: 'Could not find any notes.' }, {
            status: 404,
            statusText: 'Not Found'
        })
    }
    return notes;
}

export const action = async ({ request }) => {
    const formData = await request.formData();
    const noteData = Object.fromEntries(formData);

    if (noteData.title.trim().length < 5) {
        return { message: 'Invalid title - must be least 5 charactes long.' };
    }

    const existingNotes = await getStoredNotes()
    noteData.id = new Date().toISOString();
    const updateNotes = existingNotes.concat(noteData)
    await storeNotes(updateNotes);

    return redirect('/notes')
}

export const meta = () => {
    return {
        title: "All Notes",
        description: 'Manage your notes with ease.'
    }
}

export const CatchBoundary = () => {
    const caughtResponse = useCatch();
    const message = caughtResponse.data?.message || 'Data not found.';

    return (
        <main>
            <NewNote />
            <p className="info-message">
                {message}
            </p>
        </main>
    )
}

export const ErrorBoundary = ({ error }) => {
    return (
        <main className="error">
            <h1>An error related to your notes occurred!</h1>
            <p>{error.message}</p>
            <p>Back to <Link to='/'>safety</Link>!</p>
        </main>
    )
}

export const links = () => {
    return [...newNoteLinks(), ...noteListLink()]
}
