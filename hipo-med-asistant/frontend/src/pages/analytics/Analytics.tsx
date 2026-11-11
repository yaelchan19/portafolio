import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, Users, Calendar, Building2, LayoutDashboard } from "lucide-react";
import api from "../../services/api";
import { pageBg, textPrimary, textMuted, accentBorder, surfaceLight } from "../../theme/colors";
import BackButton from "../../components/BackButton";

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b'];

export default function Analytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/analytics/dashboard")
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className={`min-h-screen ${pageBg} flex items-center justify-center`}>
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
    </div>
  );

  return (
    <div className={`min-h-screen ${pageBg} p-4 sm:p-8`}>
      <header className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className={`text-2xl sm:text-3xl font-black ${textPrimary} flex items-center gap-3 uppercase tracking-tighter truncate`}>
              <LayoutDashboard className="text-indigo-400 shrink-0 w-7 h-7 sm:w-8 sm:h-8" />
              Panel de Estadísticas
            </h1>
            <p className={`${textMuted} text-[10px] sm:text-sm font-bold uppercase tracking-widest mt-1`}>
              Análisis de rendimiento y demanda de la clínica
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        
        {/* Citas Semanales */}
        <div className={`p-4 sm:p-6 rounded-2xl sm:rounded-[2.5rem] border ${accentBorder} ${surfaceLight} shadow-xl`}>
          <h3 className={`text-xs sm:text-sm font-black ${textPrimary} mb-4 sm:mb-6 flex items-center gap-2 uppercase tracking-widest`}>
            <TrendingUp className="text-indigo-400 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            Citas por Semana
          </h3>
          <div className="h-64 sm:h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <LineChart data={data?.citas_semanales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="semana" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Consultorios más demandados */}
        <div className={`p-4 sm:p-6 rounded-2xl sm:rounded-[2.5rem] border ${accentBorder} ${surfaceLight} shadow-xl`}>
          <h3 className={`text-xs sm:text-sm font-black ${textPrimary} mb-4 sm:mb-6 flex items-center gap-2 uppercase tracking-widest`}>
            <Building2 className="text-sky-400 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            Demanda por Consultorio
          </h3>
          <div className="h-64 sm:h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={data?.consultorios_demanda}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="nombre" stroke="#94a3b8" fontSize={9} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                />
                <Bar dataKey="total" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Motivos de Consulta */}
        <div className={`p-4 sm:p-6 rounded-2xl sm:rounded-[2.5rem] border ${accentBorder} ${surfaceLight} shadow-xl lg:col-span-2`}>
          <h3 className={`text-xs sm:text-sm font-black ${textPrimary} mb-4 sm:mb-6 flex items-center gap-2 uppercase tracking-widest`}>
            <Users className="text-rose-400 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            Principales Motivos de Consulta
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div className="h-64 sm:h-80 min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart>
                  <Pie
                    data={data?.motivos_frecuentes}
                    dataKey="total"
                    nameKey="motivo"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={{ fontSize: 9 }}
                  >
                    {data?.motivos_frecuentes.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {data?.motivos_frecuentes.map((m: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className={`text-[11px] sm:text-sm font-bold ${textPrimary} truncate`}>{m.motivo}</span>
                  </div>
                  <span className="text-[11px] sm:text-sm font-black text-indigo-400 shrink-0">{m.total} citas</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
