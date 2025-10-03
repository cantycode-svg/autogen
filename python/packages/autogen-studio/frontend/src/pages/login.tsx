import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/context";
import { navigate } from "gatsby";
import Layout from "../components/layout";
import { graphql } from "gatsby";

// Minimal icons until icons component is updated
const UserIcon = (props:any) => (
  <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden {...props}>
    <circle cx="12" cy="8" r="4" fill="currentColor"/>
    <path d="M4 20a8 8 0 0 1 16 0" fill="none" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const LockIcon = (props:any) => (
  <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden {...props}>
    <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M8 10V8a4 4 0 1 1 8 0v2" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

const archetypes = ["Builder","Strategist","Researcher","Explorer"] as const;
type Archetype = typeof archetypes[number];

const LoginPage = ({ data }: any) => {
  const { isAuthenticated, isLoading, login, authType } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const initial = (params.get('archetype') as Archetype) || "Builder";
  const [choice, setChoice] = useState<Archetype>(initial);

  useEffect(() => {
    if (isAuthenticated && !isLoading) navigate("/");
  }, [isAuthenticated, isLoading]);

  const site = data?.site?.siteMetadata ?? {};
  const title = site.title ?? "AI Innovators Guild";

  const handleGuildEnter = async () => {
    // Keep existing auth if configured; otherwise simulate local form submit
    setIsSubmitting(true);
    try {
      if (authType && authType !== 'none') {
        const loginUrl = await login();
        if (loginUrl && typeof window !== 'undefined') {
          window.location.href = loginUrl;
          return;
        }
      }
      // Fallback: demo navigate after local validation
      if (!username || !password) {
        alert('Enter username and password');
        setIsSubmitting(false);
        return;
      }
      navigate(`/`);
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title="Login" link="/login" meta={site}>
      <div style={{display: 'none'}}>AIIG_MARKER_LOGIN_2025</div>
      <main className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-[#0B0A10] text-slate-100 relative overflow-hidden">
        {/* Background runes and glow */}
        <div className="pointer-events-none absolute inset-0 opacity-15" style={{backgroundImage:'url(/runes.png)', backgroundSize:'cover'}}/>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-700/10 via-cyan-400/10 to-transparent"/>
        {/* Centered panel */}
        <div className="relative z-10 w-full max-w-md mx-4 p-8 rounded-2xl backdrop-blur-md border border-white/10 bg-white/5 shadow-[0_0_60px_rgba(124,58,237,0.25)]">
          <div className="flex flex-col items-center text-center mb-6">
            <img src="/guild-logo.svg" alt="AI Innovators Guild" className="h-10 w-10 mb-3 drop-shadow"/>
            <h1 className="text-2xl font-serif">Enter the Guild</h1>
            <p className="text-slate-300 text-sm">Sign in to continue your journey as a {choice}.</p>
          </div>
          {/* Archetype */}
          <label className="block text-sm mb-2 text-slate-300">Archetype</label>
          <select value={choice} onChange={(e)=>setChoice(e.target.value as Archetype)}
                  className="w-full mb-4 bg-black/30 border border-white/10 rounded-md px-3 py-2">
            {archetypes.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          {/* Username */}
          <div className="mb-3">
            <div className="flex items-center gap-2 bg-black/30 border border-white/10 rounded-md px-3 py-2">
              <UserIcon className="text-slate-300"/>
              <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username"
                     className="bg-transparent flex-1 outline-none text-slate-100 placeholder:text-slate-500" />
            </div>
          </div>
          {/* Password */}
          <div className="mb-6">
            <div className="flex items-center gap-2 bg-black/30 border border-white/10 rounded-md px-3 py-2">
              <LockIcon className="text-slate-300"/>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password"
                     className="bg-transparent flex-1 outline-none text-slate-100 placeholder:text-slate-500" />
            </div>
          </div>
          <button onClick={handleGuildEnter}
                  disabled={isSubmitting}
                  className="w-full relative px-4 py-3 rounded-lg font-semibold tracking-wide text-white bg-gradient-to-r from-purple-600 to-cyan-500 shadow-[0_0_30px_rgba(124,58,237,0.45)] hover:shadow-[0_0_45px_rgba(34,211,238,0.55)] transition-all">
            <span className="relative z-10">Enter Guild</span>
            <span className="absolute inset-0 rounded-lg blur opacity-60 bg-gradient-to-r from-purple-600 to-cyan-500"/>
          </button>
        </div>
      </main>
    </Layout>
  );
};

export const query = graphql`
  query LoginPageQuery {
    site {
      siteMetadata {
        description
        title
      }
    }
  }
`;

export default LoginPage;
