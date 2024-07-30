// src/components/NoteHistory.js
import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot, getFirestore } from "firebase/firestore";

const NoteHistory = ({ noteId }) => {
    const [history, setHistory] = useState([]);
    const db = getFirestore();

    useEffect(() => {
        const q = query(
            collection(db, "noteHistory"),
            where("noteId", "==", noteId),
            orderBy("timestamp", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setHistory(snapshot.docs.map(doc => doc.data()));
        });

        return () => unsubscribe();
    }, [noteId, db]);

    return (
        <div>
            <h3>Version History</h3>
            {history.map((version, index) => (
                <div key={index}>
                    <p>{version.content}</p>
                    <small>{new Date(version.timestamp.toDate()).toLocaleString()}</small>
                </div>
            ))}
        </div>
    );
};

export default NoteHistory;
