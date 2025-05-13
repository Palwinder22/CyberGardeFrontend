import React, { useState } from 'react';

const steps = [
  '> Initialisation du système...',
  '> Installation de ClamAV...',
  '> Configuration du pare-feu (port 445)...',
  '> DNS sécurisé activé (1.1.1.1)...',
  '> Installation de Wazuh...',
  '> Déploiement de Suricata...',
  '> Vérification des rootkits...',
  '> Ajout de YARA + journalisation...',
  '> Configuration sauvegarde automatique...',
  '> Lien vers dashboard central...',
  '> 🟢 Installation terminée avec succès !'
];

export default function Signup() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [societe, setSociete] = useState('');
  const [poste, setPoste] = useState('');
  const [licence, setLicence] = useState('');
  const [progress, setProgress] = useState(0);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [downloading, setDownloading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLogMessages([]);
    setProgress(0);
    setDownloading(true);

    const content = `@echo off\nmkdir C:\\SOC_Test\necho Nom : ${nom} > C:\\SOC_Test\\identite.txt\necho Prénom : ${prenom} >> C:\\SOC_Test\\identite.txt\necho Société : ${societe} >> C:\\SOC_Test\\identite.txt\necho Poste : ${poste} >> C:\\SOC_Test\\identite.txt\necho Licence : ${licence} >> C:\\SOC_Test\\identite.txt\necho [SOC] Début de l'installation > C:\\SOC_Test\\installation_log.txt\necho [OK] ClamAV installé >> C:\\SOC_Test\\installation_log.txt\necho [OK] Port 445 bloqué >> C:\\SOC_Test\\installation_log.txt\necho [OK] DNS 1.1.1.1 configuré >> C:\\SOC_Test\\installation_log.txt\necho [✓] YARA / Wazuh / Suricata simulés >> C:\\SOC_Test\\installation_log.txt\nstart notepad C:\\SOC_Test\\installation_log.txt\npause`;

    const blob = new Blob([content], { type: 'application/bat' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SOC_Installation.bat';
    a.click();

    let index = 0;
    const animateConsole = () => {
      if (index < steps.length) {
        setLogMessages((prev) => [...prev, steps[index]]);
        setProgress(((index + 1) / steps.length) * 100);
        index++;
        setTimeout(animateConsole, 1000);
      } else {
        setDownloading(false);
      }
    };
    animateConsole();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center py-10">
      <div className="bg-gray-800 rounded-2xl p-10 w-full max-w-4xl shadow-xl">
        <div className="text-center">
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg" alt="Drapeau" width="50" className="inline-block" />
          <h2 className="text-2xl font-bold mt-2">Association Citoyenne pour la Lutte Contre la Cybercriminalité</h2>
          <p className="text-gray-400"> dddddFormulaire d'identification avant activation du SOC</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-wrap gap-4 justify-center">
          <input className="bg-gray-700 rounded px-3 py-2 w-60" placeholder="Nom" required value={nom} onChange={(e) => setNom(e.target.value)} />
          <input className="bg-gray-700 rounded px-3 py-2 w-60" placeholder="Prénom" required value={prenom} onChange={(e) => setPrenom(e.target.value)} />
          <input className="bg-gray-700 rounded px-3 py-2 w-60" placeholder="Société" required value={societe} onChange={(e) => setSociete(e.target.value)} />
          <input className="bg-gray-700 rounded px-3 py-2 w-60" placeholder="Poste" required value={poste} onChange={(e) => setPoste(e.target.value)} />
          <input className="bg-gray-700 rounded px-3 py-2 w-60" placeholder="Numéro de licence" required value={licence} onChange={(e) => setLicence(e.target.value)} />
          <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">🚀 Activer la protection</button>
        </form>

        <div className="mt-6 h-5 w-full bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 transition-all" style={{ width: `${progress}%` }}></div>
        </div>

        {logMessages.length > 0 && (
          <div className="mt-4 bg-black p-4 rounded font-mono text-green-400 h-64 overflow-y-auto">
            {logMessages.map((msg, i) => (
              <div key={i}>{msg}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

