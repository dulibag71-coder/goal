'use client'

import { useState } from 'react'
import { Upload, Play, CheckCircle, BarChart3, Info } from 'lucide-react'

export default function Home() {
    const [file, setFile] = useState<File | null>(null)
    const [status, setStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'completed'>('idle')
    const [result, setResult] = useState<any>(null)

    const handleUpload = async () => {
        if (!file) return
        setStatus('uploading')

        // API 업로드 시뮬레이션
        const formData = new FormData()
        formData.append('video', file)

        try {
            // 실제 운영 시: await fetch('http://localhost:4000/api/upload', { method: 'POST', body: formData })
            setTimeout(() => setStatus('analyzing'), 1500)
            setTimeout(() => {
                setStatus('completed')
                setResult({
                    lesson: "훌륭한 상체 꼬임을 보여주고 계시네요! 하지만 임팩트 시점에 체중이 뒤에 머물러 슬라이스가 발생할 위험이 있습니다. 왼발을 더 단단히 고정하는 연습을 해보세요.",
                    metrics: { shoulder_turn: 85, weight_shift: "45%" }
                })
            }, 4000)
        } catch (err) {
            console.error(err)
            setStatus('idle')
        }
    }

    return (
        <main>
            <header>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div className="logo">SWING.AI</div>
                    <nav style={{ display: 'flex', gap: '2rem' }}>
                        <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Analysis</a>
                        <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>History</a>
                        <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Pro Coaching</a>
                    </nav>
                </div>
            </header>

            <section className="container hero animate-fade-in">
                <h1>개인 AI 골프 코치와<br />완벽한 스윙을 만드세요</h1>
                <p>MediaPipe 포즈 추정 기술과 최신 LLM이 당신의 스윙을 정밀 분석하고 바로 실천 가능한 레슨을 제공합니다.</p>

                {status === 'idle' && (
                    <div className="upload-card">
                        <label className="upload-zone">
                            <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                style={{ display: 'none' }}
                            />
                            <Upload size={48} color="#10b981" style={{ marginBottom: '1rem' }} />
                            <h3 style={{ marginBottom: '0.5rem' }}>{file ? file.name : "영상을 업로드하세요"}</h3>
                            <p style={{ fontSize: '0.875rem' }}>MP4, MOV (최대 50MB)</p>
                        </label>
                        <button className="btn-primary" onClick={handleUpload} disabled={!file}>
                            무료 분석 시작하기
                        </button>
                    </div>
                )}

                {(status === 'uploading' || status === 'analyzing') && (
                    <div className="upload-card">
                        <div style={{ padding: '2rem' }}>
                            <div className="spinner" style={{
                                width: '40px',
                                height: '40px',
                                border: '4px solid var(--card-border)',
                                borderTopColor: 'var(--primary)',
                                borderRadius: '50%',
                                margin: '0 auto 1.5rem',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                            <style jsx>{`
                @keyframes spin { to { transform: rotate(360deg); } }
              `}</style>
                            <h3>{status === 'uploading' ? "영상 업로드 중..." : "AI가 스윙을 분석 중입니다"}</h3>
                            <p style={{ marginTop: '0.5rem', color: '#94a3b8' }}>잠시만 기다려 주세요. 수십 개의 관절 좌표를 추적하고 있습니다.</p>
                        </div>
                    </div>
                )}

                {status === 'completed' && result && (
                    <div className="animate-fade-in" style={{ textAlign: 'left', marginTop: '4rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div className="upload-card" style={{ maxWidth: '100%', padding: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                    <CheckCircle size={20} color="#10b981" />
                                    <h2 style={{ fontSize: '1.25rem' }}>AI 코칭 리포트</h2>
                                </div>
                                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                    <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>{result.lesson}</p>
                                </div>
                            </div>

                            <div className="upload-card" style={{ maxWidth: '100%', padding: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                    <BarChart3 size={20} color="#3b82f6" />
                                    <h2 style={{ fontSize: '1.25rem' }}>정밀 분석 수치</h2>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                                        <span style={{ color: '#94a3b8' }}>어깨 회전 각도</span>
                                        <span style={{ fontWeight: 'bold' }}>{result.metrics.shoulder_turn}°</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                                        <span style={{ color: '#94a3b8' }}>임팩트 체중 이동</span>
                                        <span style={{ fontWeight: 'bold' }}>{result.metrics.weight_shift}</span>
                                    </div>
                                    <button className="btn-primary" style={{ background: 'var(--accent)' }} onClick={() => setStatus('idle')}>
                                        새로운 스윙 분석하기
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            <footer style={{ borderTop: '1px solid var(--card-border)', padding: '4rem 0', marginTop: '8rem', textAlign: 'center', color: '#475569' }}>
                <p>© 2026 Golf AI Coach. All rights reserved.</p>
            </footer>
        </main>
    )
}
