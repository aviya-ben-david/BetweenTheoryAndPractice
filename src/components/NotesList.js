// src/components/NotesList.js
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, getFirestore } from "firebase/firestore";

const NotesList = () => {
    const [notes, setNotes] = useState([]);
    const db = getFirestore();

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "notes"), (snapshot) => {
            setNotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, [db]);

    return (
        <div>
            {notes.map(note => (
                <div key={note.id}>{note.content}</div>
            ))}
        </div>
    );
};

export default NotesList;
