import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './Notes.css';

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [categories] = useState(['Work', 'Home', 'Shopping', 'To do', 'Others']);
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [versionHistory, setVersionHistory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'notes'), (querySnapshot) => {
            const notesData = [];
            querySnapshot.forEach((doc) => {
                notesData.push({ ...doc.data(), id: doc.id });
            });
            setNotes(notesData);
        });
        return () => unsubscribe();
    }, []);

    const addNote = async () => {
        if (editingNoteId) {
            const noteRef = doc(db, 'notes', editingNoteId);
            await updateDoc(noteRef, {
                title,
                content,
                category
            });
            await addDoc(collection(noteRef, 'versions'), {
                title,
                content,
                category,
                createdAt: new Date()
            });
            setEditingNoteId(null);
        } else {
            const newNoteRef = await addDoc(collection(db, 'notes'), {
                title,
                content,
                category,
                createdAt: new Date()
            });
            await addDoc(collection(newNoteRef, 'versions'), {
                title,
                content,
                category,
                createdAt: new Date()
            });
        }
        setTitle('');
        setContent('');
        setCategory('');
    };

    const startEditingNote = async (note) => {
        setEditingNoteId(note.id);
        setTitle(note.title);
        setContent(note.content);
        setCategory(note.category);

        const versionsSnapshot = await getDocs(collection(db, 'notes', note.id, 'versions'));
        const versionsData = versionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setVersionHistory(versionsData);
    };

    const revertToVersion = async (noteId, version) => {
        await updateDoc(doc(db, 'notes', noteId), {
            title: version.title,
            content: version.content,
            category: version.category
        });
        setTitle(version.title);
        setContent(version.content);
        setCategory(version.category);
    };

    const deleteNote = async (id) => {
        await deleteDoc(doc(db, 'notes', id));
    };

    const groupedNotes = categories
        .map(cat => ({
            category: cat,
            notes: notes.filter(note => note.category === cat)
        }))
        .filter(group => group.notes.length > 0); // Filter out categories with no notes

    return (
        <div>
            <button className="back-button" onClick={() => navigate('/')}>Log out</button>
            <h1>Notes</h1>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select Category</option>
                {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <button onClick={addNote} disabled={!title || !content || !category}>
                {editingNoteId ? 'Edit Note' : 'Add Note'}
            </button>
            <div>
                {groupedNotes.map(group => (
                    <div key={group.category}>
                        <h2>{group.category}</h2>
                        <div className="notes-list">
                            {group.notes.map(note => (
                                <div className="note" key={note.id}>
                                    <h3>{note.title}</h3>
                                    <p>{note.content}</p>
                                    <div className="note-buttons">
                                        <button onClick={() => startEditingNote(note)}>Edit</button>
                                        <button onClick={() => deleteNote(note.id)}>Delete</button>
                                    </div>
                                    {editingNoteId === note.id && (
                                        <div className="version-history">
                                            <h4>Version History</h4>
                                            {versionHistory.map(version => (
                                                <div key={version.id} className="version">
                                                    <p>Title: {version.title}</p>
                                                    <p>Content: {version.content}</p>
                                                    <p>Category: {version.category}</p>
                                                    <button onClick={() => revertToVersion(note.id, version)}>Revert to this version</button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notes;
