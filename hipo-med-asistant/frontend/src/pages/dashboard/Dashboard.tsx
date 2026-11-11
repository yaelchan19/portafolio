import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Calendar,
  Clock,
  Users,
  Building2,
  Smile,
  Syringe,
  Star,
  Heart,
  LogOut,
  User,
  Database,
  Stethoscope,
  BarChart3,
  ShieldCheck,
  Users2,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import PageCard from "../../components/PageCard";
import { pageBg, accentBorder, textPrimary, textMuted } from "../../theme/colors";
import { useAuth } from "../../contexts/AuthContext";

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const rol = user?.rol?.toLowerCase().trim();

  return (
    <div className={`min-h-screen ${pageBg}`}>
      <main className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-10">
        {/* Hero */}
        <section className="mb-10 text-center">
          <h1 className={`text-3xl font-bold tracking-tight md:text-4xl ${textPrimary}`}>
            <span className="bg-gradient-to-r from-sky-300 to-indigo-300 bg-clip-text text-transparent">
              ¡Bienvenidos a
            </span>
            <br />
            Clínica Infantil!
          </h1>
          <p className={`mt-3 text-lg ${textMuted}`}>
            🎉 ¡Donde los niños felices crecen sanos! 🎉
          </p>
          <div className={`mt-6 inline-block rounded-2xl border ${accentBorder} bg-indigo-500/10 px-6 py-4 ${textPrimary} shadow-lg backdrop-blur-sm`}>
            😊 ¡Hola! {user?.nombre ? `Dr. ${user.nombre.split(' ')[0]}` : "Soy el Dr. Bistek"}
          </div>
        </section>

        {/* Acciones */}
        <section className="mb-12">
          <h2 className={`mb-6 text-xl font-semibold md:text-2xl ${textPrimary}`}>
            Acciones rápidas
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* 1. Nueva Cita (Paciente/Tutor) */}
            {(rol === "paciente" || rol === "admin") && (
              <PageCard
                icon={<Calendar size={44} />}
                title="¡Nueva Cita!"
                subtitle="Es súper fácil"
                onClick={() => navigate("/seleccionar-consultorio")}
                accent="sky"
              />
            )}

            {/* 2. Administración de Citas (Admin y Recepcionista) */}
            {(rol === "admin" || rol === "recepcionista") && (
              <PageCard
                icon={<Clock size={44} />}
                title="Administración De Citas"
                subtitle="¿Cuándo es mi turno?"
                onClick={() => navigate("/cola-espera")}
                accent="neutral"
              />
            )}

            {/* 3. Mis Citas (Médico) */}
            {(rol === "medico" || rol === "admin") && (
              <PageCard
                icon={<Stethoscope size={44} />}
                title="Mis Citas"
                subtitle="Mi agenda del día"
                onClick={() => navigate("/mis-citas")}
                accent="sky"
              />
            )}

            {/* 4. Sala de Espera (Todos excepto médico si queremos ser estrictos) */}
            {rol !== "medico" && (
              <PageCard
                icon={<Users size={44} />}
                title="Sala de Espera"
                subtitle="¡Mira quién sigue!"
                onClick={() => navigate("/sala-espera")}
                accent="rose"
              />
            )}

            {/* Acciones Exclusivas Admin */}
            {rol === "admin" && (
              <>
                <PageCard
                  icon={<Building2 size={44} />}
                  title="Gestión de Consultorios"
                  subtitle="Configura tus espacios"
                  onClick={() => navigate("/admin/consultorios")}
                  accent="indigo"
                />
                <PageCard
                  icon={<Users2 size={44} />}
                  title="Gestión de Usuarios"
                  subtitle="Control de personal"
                  onClick={() => navigate("/admin/usuarios")}
                  accent="sky"
                />
                <PageCard
                  icon={<BarChart3 size={44} />}
                  title="Estadísticas"
                  subtitle="Análisis de rendimiento"
                  onClick={() => navigate("/admin/estadisticas")}
                  accent="indigo"
                />
                <PageCard
                  icon={<ShieldCheck size={44} />}
                  title="Auditoría"
                  subtitle="Seguridad de datos"
                  onClick={() => navigate("/admin/auditoria")}
                  accent="neutral"
                />
                <PageCard
                  icon={<Database size={44} />}
                  title="Respaldos DB"
                  subtitle="Seguridad de información"
                  onClick={() => navigate("/admin/backups")}
                  accent="sky"
                />
              </>
            )}
          </div>
        </section>

        {/* Datos divertidos */}
        <section>
          <h2 className={`mb-6 text-xl font-semibold md:text-2xl ${textPrimary}`}>
            ✨ ¡Datos Divertidos de Nuestra Clínica! ✨
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <PageCard
              icon={<Smile size={40} />}
              value="+1000"
              label="Sonrisas salvadas"
              accent="indigo"
            />
            <PageCard
              icon={<Syringe size={40} />}
              value="+500"
              label="Vacunas sin lágrimas"
              accent="sky"
            />
            <PageCard
              icon={<Star size={40} />}
              value="999+"
              label="Calcomanías repartidas"
              accent="rose"
            />
            <PageCard
              icon={<Heart size={40} />}
              value="100%"
              label="Niños contentos"
              accent="rose"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
