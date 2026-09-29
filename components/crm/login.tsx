'use client';
import './login.css';
import { createContext, useContext, useEffect, useState, type ReactNode, type FormEvent } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, LogIn, Moon, Sun, UserRound } from 'lucide-react';
import { useCRM } from './store';
const SESSION_KEY = 'lifelab-demo-session-v1';
const SessionContext = createContext<() => void>(() => {});
export const useDemoLogout = () => useContext(SessionContext);
// Presentation gate only. Static demo credentials are public; this is not server authentication.
export function LoginGate({ children }: { children: ReactNode }) {
 const { setRole, go, setSelected } = useCRM();
 const [signedIn, setSignedIn] = useState(() => { try { return sessionStorage.getItem(SESSION_KEY) === 'user05'; } catch { return false; } });
 const [username, setUsername] = useState(''), [password, setPassword] = useState(''), [show, setShow] = useState(false), [error, setError] = useState('');
 const [dark, setDark] = useState(() => { try { return localStorage.getItem('lifelab-theme') === 'dark'; } catch { return false; } });
 useEffect(() => { if (!signedIn) { document.documentElement.classList.toggle('dark', dark); document.documentElement.dataset.theme = dark ? 'dark' : 'light'; try { localStorage.setItem('lifelab-theme', dark ? 'dark' : 'light'); } catch {} } }, [dark, signedIn]);
 function login(event: FormEvent) {
  event.preventDefault();
  if (username.trim() !== 'user05' || password !== '12345') { setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่'); return; }
  try { sessionStorage.setItem(SESSION_KEY, 'user05'); } catch {}
  setRole('ผู้บริหาร'); go('dashboard'); setPassword(''); setError(''); setSignedIn(true);
 }
 function logout() {
  try { sessionStorage.removeItem(SESSION_KEY); setDark(localStorage.getItem('lifelab-theme') === 'dark'); } catch {}
  setSelected(''); setUsername(''); setPassword(''); setError(''); setShow(false); setSignedIn(false); go('login');
 }
 if (signedIn) return <SessionContext.Provider value={logout}>{children}</SessionContext.Provider>;
 return <main className="login-page"><button className="icon-button login-theme" aria-label={dark ? 'เปลี่ยนเป็น Light mode' : 'เปลี่ยนเป็น Dark mode'} onClick={() => setDark(!dark)}>{dark ? <Sun size={21}/> : <Moon size={21}/>}</button><section className="login-story"><div className="login-brand"><div className="brand-mark">L<span>L</span></div><strong>lifelab <small>CRM</small></strong></div><span className="login-eyebrow">LIFE LAB ACADEMY</span><h1>ทุกความสัมพันธ์<br/>คือจุดเริ่มต้น<br/><em>ของการเติบโต</em></h1><p>เชื่อมงานขาย การดูแลลูกค้า และการเรียนรู้<br/>ไว้ในพื้นที่ทำงานเดียวกัน</p><div className="login-story-footer"><span>Customer 360</span><span>Sales & Finance</span><span>Learning</span></div></section><section className="login-panel"><div className="login-card"><div className="login-symbol"><LockKeyhole size={25}/></div><span className="login-eyebrow">WELCOME TO YOUR WORKSPACE</span><h2>เข้าสู่ระบบ LifeLab CRM</h2><p className="login-subtitle">ยินดีต้อนรับสู่พื้นที่ทำงานของทีม</p><form onSubmit={login}><label htmlFor="demo-username">ชื่อผู้ใช้ <span>Username</span></label><div className="login-input"><UserRound size={19}/><input id="demo-username" name="username" autoComplete="username" autoCapitalize="none" spellCheck={false} required value={username} onChange={e => { setUsername(e.target.value); setError(''); }} placeholder="กรอกชื่อผู้ใช้" aria-describedby={error ? 'login-error' : undefined}/></div><label htmlFor="demo-password">รหัสผ่าน <span>Password</span></label><div className="login-input"><LockKeyhole size={19}/><input id="demo-password" name="password" type={show ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={e => { setPassword(e.target.value); setError(''); }} placeholder="กรอกรหัสผ่าน" aria-describedby={error ? 'login-error' : undefined}/><button type="button" aria-label={show ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'} aria-pressed={show} onClick={() => setShow(!show)}>{show ? <EyeOff size={19}/> : <Eye size={19}/>}</button></div>{error && <p id="login-error" className="login-error" role="alert">{error}</p>}<button className="login-submit" type="submit"><LogIn size={19}/> เข้าสู่ระบบ <ArrowRight size={19}/></button></form><div className="login-note"><b>DEMO WORKSPACE</b><p>บัญชีสาธิตเข้าถึงทุกโมดูลและฟังก์ชัน<br/>ใช้ข้อมูลสมมติสำหรับทดลองระบบ</p></div><small className="login-footnote">Life Lab Academy · CRM Demo</small></div></section></main>;
}
