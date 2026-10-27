import { Camera, Footprints, Pause, Play, TriangleAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Heatmap } from './Heatmap';
import { pressureFrame } from '../services/workflowStore';
import { Badge } from './staffWorkspace';
import { duration } from '../utils/assessmentFormat';

function CameraFrame({ milliseconds }) {
  const seconds = milliseconds / 1000;
  const x = 100 + (Math.sin(seconds / 6 - Math.PI / 2) + 1) * 130;
  const stride = Math.sin(seconds * 3) * 16;
  return <svg className="ws-camera-frame" viewBox="0 0 520 290" role="img" aria-label={`Illustrated camera frame at ${duration(milliseconds)}. This is not recorded video.`}>
    <rect width="520" height="290" fill="var(--camera-wall)" /><path d="M0 205H520V290H0Z" fill="var(--camera-floor)" /><path d="M0 205H520M0 260H520M110 205L65 290M410 205L460 290" stroke="var(--camera-line)" strokeWidth="1.5" />
    <rect x="35" y="35" width="120" height="98" rx="8" fill="var(--camera-window)" /><path d="M95 35V133M35 84H155" stroke="var(--bg-surface)" strokeWidth="6" />
    <path d="M72 165V222M72 190H115V222M72 165H110V190" stroke="var(--camera-chair)" strokeWidth="8" fill="none" strokeLinecap="round" />
    <rect x="215" y="224" width="115" height="25" rx="7" fill="var(--chart-secondary)" opacity=".2" /><path d="M430 211L441 240H419Z" fill="var(--primary)" opacity=".7" />
    <ellipse cx={x} cy="242" rx="26" ry="5" fill="var(--camera-line)" opacity=".4" /><g transform={`translate(${x}, 0)`} fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="0" cy="121" r="14" fill="var(--camera-person)" stroke="none" /><path d="M0 143V184" stroke="var(--primary)" strokeWidth="18" /><path d={`M-4 184L${-12 - stride} 236M4 184L${12 + stride} 236`} stroke="var(--camera-person)" strokeWidth="9" /><path d={`M-6 148L${-18 + stride} 182M6 148L${18 - stride} 182`} stroke="var(--camera-person)" strokeWidth="7" /></g>
    <rect x="355" y="17" width="145" height="27" rx="7" fill="var(--bg-surface)" opacity=".94" /><text x="368" y="35" fill="var(--text-secondary)" fontSize="10" fontFamily="var(--font-sans)">ILLUSTRATED · {duration(milliseconds)}</text>
  </svg>;
}

export function EvidenceViewer({ attempt, live = false, elapsedMs = 0, seek, onSeek }) {
  const [position, setPosition] = useState(0);
  const [matPosition, setMatPosition] = useState(0);
  const [playing, setPlaying] = useState(false);
  const max = Math.max(1, attempt.durationMs || elapsedMs);
  const independent = attempt.alignment === 'unverified';
  const cameraPosition = live ? elapsedMs : seek ?? position;
  const pressurePosition = live ? elapsedMs : independent ? matPosition : cameraPosition;
  const camera = attempt.evidence.find((source) => source.type === 'camera');
  const mat = attempt.evidence.find((source) => source.type === 'mat');
  const availableTime = (source, value) => source.status === 'recording' ? value : Math.min(value, source.durationMs);
  const cameraTime = availableTime(camera, cameraPosition);
  const matTime = availableTime(mat, pressurePosition);
  const updatePosition = (value) => { setPosition(value); onSeek?.(value); };
  useEffect(() => {
    if (!playing || live || independent) return;
    const timer = window.setInterval(() => {
      const next = Math.min((seek ?? position) + 250, max);
      setPosition(next);
      onSeek?.(next);
      if (next >= max) setPlaying(false);
    }, 250);
    return () => window.clearInterval(timer);
  }, [playing, live, independent, max, onSeek, seek, position]);
  const series = Array.from({ length: 25 }, (_, index) => ({ seconds: Math.round(index * Math.max(1, matTime / 1000) / 24), intensity: 0.5 + Math.sin(index / 3 + matTime / 4000) * 0.2 }));
  return <div className="ws-evidence"><div className={`ws-alignment ${independent ? 'unverified' : ''}`}>{independent ? <TriangleAlert size={16} /> : <Camera size={16} />}<span>{independent ? 'Alignment unverified · Review each source separately. No cross-stream measurements.' : 'Shared simulated timeline · Alignment is illustrative, not verified hardware synchronization.'}</span></div><div className="ws-evidence-grid">
    <section className="ws-card ws-evidence-card"><div className="ws-section-heading"><div className="ws-source-title"><Camera size={18} /><div><h3>ภาพกล้องจำลอง</h3><small>Illustrated camera replay · {camera.deviceId}</small></div></div><Badge status={camera.status} /></div>{camera.status === 'failed' ? <div className="ws-source-unavailable">Camera did not start. No camera evidence is available.</div> : <CameraFrame milliseconds={cameraTime} />}<div className="ws-evidence-caption"><span>SIMULATED FRAMES · NOT RECORDED VIDEO</span><strong>{duration(cameraTime)}</strong></div>{camera.status === 'partial' && <p className="ws-source-warning">Camera stopped at {duration(camera.durationMs)}. Only partial evidence is available.</p>}{!live && independent && <label className="ws-scrubber">Camera position<input aria-label="Camera playback position" type="range" min="0" max={Math.max(1, camera.durationMs)} step="100" value={Math.min(cameraPosition, camera.durationMs)} onChange={(event) => updatePosition(Number(event.target.value))} /></label>}</section>
    <section className="ws-card ws-evidence-card"><div className="ws-section-heading"><div className="ws-source-title"><Footprints size={18} /><div><h3>แรงกดจำลอง</h3><small>Relative intensity · {mat.deviceId}</small></div></div><Badge status={mat.status} /></div>{mat.status === 'failed' ? <div className="ws-source-unavailable">Pressure mat did not acknowledge start. No samples are available.</div> : <><div className="ws-pressure-frame"><Heatmap data={pressureFrame(matTime / 1000)} width={220} height={220} /><div><span className="ws-eyebrow">GENERATED SAMPLE</span><strong>{duration(matTime)}</strong><p>Relative intensity<br />0–1 arbitrary units</p><span className="ws-muted">Uncalibrated<br />No clinical measurement</span></div></div><div className="ws-mini-chart" role="img" aria-label="Generated relative pressure trend in arbitrary units"><ResponsiveContainer width="100%" height="100%"><AreaChart data={series}><XAxis dataKey="seconds" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} minTickGap={35} /><YAxis domain={[0, 1]} hide /><Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)' }} /><Area dataKey="intensity" stroke="var(--chart-secondary)" fill="var(--secondary-soft)" isAnimationActive={false} dot={false} /></AreaChart></ResponsiveContainer></div></>}<div className="ws-evidence-caption"><span>SYNTHETIC SAMPLES · NOT CALIBRATED PRESSURE</span></div>{mat.status === 'partial' && <p className="ws-source-warning">Pressure source stopped at {duration(mat.durationMs)}. Available samples are preserved.</p>}{!live && independent && <label className="ws-scrubber">Pressure position<input aria-label="Pressure playback position" type="range" min="0" max={Math.max(1, mat.durationMs)} step="100" value={Math.min(matPosition, mat.durationMs)} onChange={(event) => setMatPosition(Number(event.target.value))} /></label>}</section>
  </div>{!live && !independent && <div className="ws-player"><button className="ws-player-button" aria-label={playing ? 'Pause simulated replay' : 'Play simulated replay'} onClick={() => { if (position >= max) updatePosition(0); setPlaying(!playing); }}>{playing ? <Pause size={18} /> : <Play size={18} />}</button><label><span className="sr-only">Simulated playback position</span><input type="range" aria-label="Simulated playback position" min="0" max={max} step="100" value={cameraPosition} onChange={(event) => { setPlaying(false); updatePosition(Number(event.target.value)); }} /></label><span>{duration(cameraPosition)} / {duration(max)}</span></div>}</div>;
}
