// src/components/HousingHistoryApp.jsx
import React, { useState, useEffect } from 'react';
import { historyData } from '../utils/data.js';

export default function HousingHistoryApp() {
    const [currentEventIndex, setCurrentEventIndex] = useState(0);
    const [correctStreak, setCorrectStreak] = useState(0);
    const [quizFeedback, setQuizFeedback] = useState(null);

    useEffect(() => {
        try {
            const savedStreak = localStorage.getItem('house_master_streak');
            if (savedStreak) setCorrectStreak(parseInt(savedStreak, 10));
        } catch(e) {
            console.warn("LocalStorage 無法存取");
        }
    }, []);

    const handleQuizAnswer = (isCorrect) => {
        if (isCorrect) {
            setQuizFeedback({ type: 'success', text: '✅ 答對了！' });
            const newStreak = correctStreak + 1;
            setCorrectStreak(newStreak);
            try { localStorage.setItem('house_master_streak', newStreak); } catch(e) {}
        } else {
            setQuizFeedback({ type: 'error', text: '❌ 答錯了！' });
            setCorrectStreak(0);
            try { localStorage.setItem('house_master_streak', 0); } catch(e) {}
        }

        setTimeout(() => {
            setQuizFeedback(null);
            generateNextQuiz();
        }, isCorrect ? 1000 : 2500);
    };

    const generateNextQuiz = () => {
        const nextIdx = Math.floor(Math.random() * historyData.length);
        setCurrentEventIndex(nextIdx);
    };

    const currentData = historyData[currentEventIndex];

    if (!currentData) return <div style={{ textAlign: 'center', padding: '50px' }}>資料載入中...</div>;

    return (
        <div className="app-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <div className="stats-board" style={{ padding: '15px', background: 'var(--surface)', borderRadius: '8px', marginBottom: '20px', border: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--brand)', fontWeight: 'bold', fontSize: '18px' }}>🔥 連勝紀錄: {correctStreak}</span>
            </div>

            <div className="card event-card" style={{ background: 'var(--surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <h2 style={{ color: 'var(--brand)', marginTop: 0 }}>{currentData.year} - {currentData.event}</h2>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', fontSize: '14px' }}>
                    <span style={{ background: 'var(--surface-2)', padding: '4px 8px', borderRadius: '4px' }}>👤 {currentData.president}</span>
                    <span style={{ background: 'var(--surface-2)', padding: '4px 8px', borderRadius: '4px' }}>🏛️ {currentData.party}</span>
                </div>
                <p className="desc" style={{ fontSize: '16px', fontWeight: '500' }}>{currentData.desc}</p>
                <div className="detail" style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '15px', whiteSpace: 'pre-line' }}>
                    {currentData.detail}
                </div>
            </div>

            <div className="quiz-section" style={{ marginTop: '20px', display: 'flex', gap: '10px', flexDirection: 'column' }}>
                <button className="btn" onClick={() => handleQuizAnswer(true)} style={{ background: 'var(--brand)', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                    正確選項 (測試用)
                </button>
                <button className="btn" onClick={() => handleQuizAnswer(false)} style={{ background: 'var(--surface-2)', color: 'var(--text-primary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', cursor: 'pointer', fontSize: '16px' }}>
                    錯誤選項 (測試用)
                </button>
                
                {quizFeedback && (
                    <div style={{ marginTop: '10px', padding: '15px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', backgroundColor: quizFeedback.type === 'success' ? '#dcfce7' : '#fee2e2', color: quizFeedback.type === 'success' ? 'var(--success)' : 'var(--danger)' }}>
                        {quizFeedback.text}
                    </div>
                )}
            </div>
        </div>
    );
}
