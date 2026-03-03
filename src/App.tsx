import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Star, User, Phone, Calendar, BookOpen, Palette, CheckCircle2, List, ArrowLeft } from 'lucide-react';

type Competition = 'Lomba Adzan' | 'Lomba Hafalan' | 'Lomba Mewarnai' | 'Lomba Sholat' | 'Lomba Praktek Wudhu';

interface Registration {
  id: number;
  fullName: string;
  age: number;
  parentName: string;
  phoneNumber: string;
  competitionType: string;
  createdAt: string;
}

export default function App() {
  const [view, setView] = useState<'form' | 'admin' | 'summary'>('form');
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    parentName: '',
    phoneNumber: '',
    competitionType: '' as Competition | '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  const competitions: { name: Competition; icon: any; color: string }[] = [
    { name: 'Lomba Adzan', icon: Moon, color: 'bg-amber-100 text-amber-700' },
    { name: 'Lomba Hafalan', icon: BookOpen, color: 'bg-emerald-100 text-emerald-700' },
    { name: 'Lomba Mewarnai', icon: Palette, color: 'bg-rose-100 text-rose-700' },
    { name: 'Lomba Sholat', icon: Star, color: 'bg-indigo-100 text-indigo-700' },
    { name: 'Lomba Praktek Wudhu', icon: User, color: 'bg-sky-100 text-sky-700' },
  ];

  useEffect(() => {
    if (view === 'admin' || view === 'summary') {
      fetchRegistrations();
    }
  }, [view]);

  const fetchRegistrations = async () => {
    try {
      const res = await fetch('/api/registrations');
      const data = await res.json();
      setRegistrations(data);
    } catch (err) {
      console.error('Failed to fetch:', err);
    }
  };

  const getRegistrationsByCompetition = (compName: string) => {
    return registrations.filter(r => r.competitionType === compName);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsSuccess(true);
        setFormData({ fullName: '', age: '', parentName: '', phoneNumber: '', competitionType: '' });
      }
    } catch (err) {
      alert('Gagal mendaftar. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="warm-card p-12 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="serif text-4xl mb-4">Pendaftaran Berhasil!</h2>
          <p className="text-stone-600 mb-8">
            Terima kasih telah mendaftar di Gema Ramadhan. Kami akan menghubungi Anda segera melalui WhatsApp.
          </p>
          <button 
            onClick={() => setIsSuccess(false)}
            className="btn-primary w-full"
          >
            Daftar Lagi
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-[#5A5A40]">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10"><Star className="text-white w-8 h-8" /></div>
          <div className="absolute bottom-20 right-20"><Moon className="text-white w-12 h-12" /></div>
          <div className="absolute top-1/2 left-1/4"><Star className="text-white w-4 h-4" /></div>
        </div>
        <div className="relative text-center px-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h1 className="serif text-white text-5xl md:text-7xl mb-4">Gema Ramadhan</h1>
            <p className="text-white/80 text-lg md:text-xl tracking-widest uppercase">Pendaftaran Lomba Online 1447H</p>
          </motion.div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto -mt-20 px-6 relative z-10">
        <div className="flex justify-center md:justify-end gap-4 mb-6">
          <button 
            onClick={() => setView('form')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              view === 'form' ? 'bg-[#5A5A40] text-white' : 'bg-white text-stone-500 hover:text-[#5A5A40] shadow-sm'
            }`}
          >
            Formulir
          </button>
          <button 
            onClick={() => setView('summary')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              view === 'summary' ? 'bg-[#5A5A40] text-white' : 'bg-white text-stone-500 hover:text-[#5A5A40] shadow-sm'
            }`}
          >
            Ringkasan
          </button>
          <button 
            onClick={() => setView('admin')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              view === 'admin' ? 'bg-[#5A5A40] text-white' : 'bg-white text-stone-500 hover:text-[#5A5A40] shadow-sm'
            }`}
          >
            Admin
          </button>
        </div>

        <AnimatePresence mode="wait">
          {view === 'form' ? (
            <motion.div
              key="form"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="warm-card p-8 md:p-12 max-w-4xl mx-auto"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-600 uppercase tracking-wider">Nama Lengkap Peserta</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input 
                        required
                        type="text" 
                        placeholder="Contoh: Ahmad Fauzi"
                        className="input-field pl-12"
                        value={formData.fullName}
                        onChange={e => setFormData({...formData, fullName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-600 uppercase tracking-wider">Usia (Tahun)</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input 
                        required
                        type="number" 
                        placeholder="Contoh: 7"
                        className="input-field pl-12"
                        value={formData.age}
                        onChange={e => setFormData({...formData, age: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-600 uppercase tracking-wider">Nama Orang Tua / Wali</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input 
                        required
                        type="text" 
                        placeholder="Contoh: Bapak Sulaiman"
                        className="input-field pl-12"
                        value={formData.parentName}
                        onChange={e => setFormData({...formData, parentName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-600 uppercase tracking-wider">Nomor WhatsApp</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input 
                        required
                        type="tel" 
                        placeholder="0812xxxx"
                        className="input-field pl-12"
                        value={formData.phoneNumber}
                        onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-semibold text-stone-600 uppercase tracking-wider block">Pilih Cabang Lomba</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {competitions.map((comp) => (
                      <button
                        key={comp.name}
                        type="button"
                        onClick={() => setFormData({...formData, competitionType: comp.name})}
                        className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${
                          formData.competitionType === comp.name 
                            ? 'border-[#5A5A40] bg-[#5A5A40]/5' 
                            : 'border-stone-100 hover:border-stone-200 bg-stone-50/30'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${comp.color}`}>
                          <comp.icon className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-sm">{comp.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    disabled={isSubmitting || !formData.competitionType}
                    className="btn-primary w-full py-4 text-lg shadow-lg shadow-stone-200"
                  >
                    {isSubmitting ? 'Mengirim...' : 'Daftar Sekarang'}
                  </button>
                </div>
              </form>
            </motion.div>
          ) : view === 'summary' ? (
            <motion.div
              key="summary"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {competitions.map((comp) => {
                const participants = getRegistrationsByCompetition(comp.name);
                return (
                  <div key={comp.name} className="warm-card p-6 flex flex-col">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${comp.color}`}>
                        <comp.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="serif text-2xl">{comp.name}</h3>
                        <p className="text-stone-400 text-sm font-medium uppercase tracking-wider">
                          {participants.length} Pendaftar
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      {participants.length > 0 ? (
                        <div className="space-y-2">
                          {participants.slice(0, 5).map((p) => (
                            <div key={p.id} className="flex items-center justify-between text-sm p-2 rounded-lg bg-stone-50/50">
                              <span className="font-medium text-stone-700">{p.fullName}</span>
                              <span className="text-stone-400 text-xs">{p.age} th</span>
                            </div>
                          ))}
                          {participants.length > 5 && (
                            <p className="text-center text-stone-400 text-xs pt-2">
                              + {participants.length - 5} peserta lainnya
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="h-24 flex items-center justify-center text-stone-300 italic text-sm border-2 border-dashed border-stone-50 rounded-2xl">
                          Belum ada pendaftar
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="admin"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="warm-card p-8 overflow-hidden max-w-4xl mx-auto"
            >
              <h2 className="serif text-3xl mb-6">Daftar Pendaftar</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-stone-100">
                      <th className="pb-4 font-semibold text-stone-400 text-xs uppercase tracking-wider">Nama</th>
                      <th className="pb-4 font-semibold text-stone-400 text-xs uppercase tracking-wider">Lomba</th>
                      <th className="pb-4 font-semibold text-stone-400 text-xs uppercase tracking-wider">Usia</th>
                      <th className="pb-4 font-semibold text-stone-400 text-xs uppercase tracking-wider">Kontak</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {registrations.length > 0 ? registrations.map((reg) => (
                      <tr key={reg.id} className="group">
                        <td className="py-4">
                          <div className="font-medium">{reg.fullName}</div>
                          <div className="text-xs text-stone-400">Ortu: {reg.parentName}</div>
                        </td>
                        <td className="py-4">
                          <span className="inline-block px-2 py-1 rounded-md bg-stone-100 text-stone-600 text-xs font-medium">
                            {reg.competitionType}
                          </span>
                        </td>
                        <td className="py-4 text-stone-600">{reg.age} th</td>
                        <td className="py-4 text-stone-600 text-sm">{reg.phoneNumber}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-stone-400 italic">Belum ada pendaftar</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-20 text-center text-stone-400 text-sm">
        <p>&copy; 2026 Panitia Gema Ramadhan. All rights reserved.</p>
      </footer>
    </div>
  );
}
