import React, { useMemo, useState } from "react";
import { graphql, navigate } from "gatsby";
import Layout from "../components/layout";

// Landing page for AI Innovators Guild
// Adds archetype selector and glowing Enter Guild CTA
const archetypes = ["Builder", "Strategist", "Researcher", "Explorer"] as const;

type Archetype = typeof archetypes[number];

const IndexPage = ({ data }: any) => {
  const [choice, setChoice] = useState<Archetype>("Builder");
  const site = data?.site?.siteMetadata ?? {};
  const title = site.title ?? "AI Innovators Guild";
  const description = site.description ??
    "A community of builders, strategists, researchers, and explorers advancing AI craft.";

  const enter = () => navigate(`/login?archetype=${encodeURIComponent(choice)}`);

  return (
    <Layout title={title} link="/" meta={site}>
      <main className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-[#0B0A10] text-slate-100 relative overflow-hidden">
        {/* Runes background */}
        <div className="pointer-events-none absolute inset-0 opacity-20"
             style={{backgroundImage: 'url(/runes.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}/>
        {/* Cyber glow grid */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-purple-700/10 via-cyan-400/10 to-transparent"/>

        {/* Center card */}
        <div className="relative z-10 w-full max-w-3xl mx-4 p-8 rounded-2xl backdrop-blur-md border border-white/10 bg-white/5 shadow-[0_0_60px_rgba(124,58,237,0.25)]">
          <div className="flex items-center gap-3 mb-6">
            <img src="/guild-logo.svg" alt="AI Innovators Guild" className="h-10 w-10 drop-shadow"/>
            <h1 className="text-3xl md:text-4xl font-serif tracking-tight">AI Innovators Guild</h1>
          </div>
          <p className="text-slate-300 leading-relaxed mb-6">
            {description}
          </p>

          {/* Archetype selector */}
          <label className="block text-sm mb-2 text-slate-300">Choose your archetype</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {archetypes.map(a => (
              <button
                key={a}
                onClick={() => setChoice(a)}
                className={("px-3 py-2 rounded-md border transition-all ") +
                  (choice === a
                    ? "border-cyan-300/70 bg-cyan-300/10 text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.35)]"
                    : "border-white/10 hover:border-white/20 text-slate-200")}
                aria-pressed={choice===a}
              >{a}</button>
            ))}
          </div>

          {/* Enter button */}
          <div className="flex items-center gap-4">
            <button onClick={enter}
                    className="group relative px-6 py-3 rounded-lg font-semibold tracking-wide text-white
                               bg-gradient-to-r from-purple-600 to-cyan-500
                               shadow-[0_0_30px_rgba(124,58,237,0.45)] hover:shadow-[0_0_45px_rgba(34,211,238,0.55)]
                               transition-all">
              <span className="relative z-10">Enter Guild</span>
              <span className="absolute inset-0 rounded-lg blur opacity-60 bg-gradient-to-r from-purple-600 to-cyan-500"/>
            </button>
            <span className="text-xs text-slate-400">Your path begins as: <strong className="text-slate-200">{choice}</strong></span>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export const query = graphql`
  query HomePageQuery {
    site {
      siteMetadata {
        description
        title
      }
    }
  }
`;

export default IndexPage;
