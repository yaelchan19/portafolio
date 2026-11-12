<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ config('app.name', 'Hospital Infantil') }} - Sistema de Gestión</title>

        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        
        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700,800" rel="stylesheet" />
        
        <!-- Font Awesome -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
              integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" 
              crossorigin="anonymous" referrerpolicy="no-referrer" />
        
        <style>
            /*! tailwindcss v4.0.7 | MIT License | https://tailwindcss.com */
            @layer theme {
                :root,:host {
                    --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
                    --color-primary-50: #f0f9ff;
                    --color-primary-100: #e0f2fe;
                    --color-primary-200: #bae6fd;
                    --color-primary-300: #7dd3fc;
                    --color-primary-400: #38bdf8;
                    --color-primary-500: #0ea5e9;
                    --color-primary-600: #0284c7;
                    --color-primary-700: #0369a1;
                    --color-primary-800: #075985;
                    --color-primary-900: #0c4a6e;
                    --color-secondary-50: #fdf2f8;
                    --color-secondary-100: #fce7f3;
                    --color-secondary-200: #fbcfe8;
                    --color-secondary-300: #f9a8d4;
                    --color-secondary-400: #f472b6;
                    --color-secondary-500: #ec4899;
                    --color-secondary-600: #db2777;
                    --color-secondary-700: #be185d;
                    --color-secondary-800: #9d174d;
                    --color-secondary-900: #831843;
                    --color-success-50: #f0fdf4;
                    --color-success-100: #dcfce7;
                    --color-success-200: #bbf7d0;
                    --color-success-300: #86efac;
                    --color-success-400: #4ade80;
                    --color-success-500: #22c55e;
                    --color-success-600: #16a34a;
                    --color-success-700: #15803d;
                    --color-success-800: #166534;
                    --color-success-900: #14532d;
                    --color-warning-50: #fffbeb;
                    --color-warning-100: #fef3c7;
                    --color-warning-200: #fde68a;
                    --color-warning-300: #fcd34d;
                    --color-warning-400: #fbbf24;
                    --color-warning-500: #f59e0b;
                    --color-warning-600: #d97706;
                    --color-warning-700: #b45309;
                    --color-warning-800: #92400e;
                    --color-warning-900: #78350f;
                    --color-gray-50: #f9fafb;
                    --color-gray-100: #f3f4f6;
                    --color-gray-200: #e5e7eb;
                    --color-gray-300: #d1d5db;
                    --color-gray-400: #9ca3af;
                    --color-gray-500: #6b7280;
                    --color-gray-600: #4b5563;
                    --color-gray-700: #374151;
                    --color-gray-800: #1f2937;
                    --color-gray-900: #111827;
                    --color-accent: #8b5cf6;
                    --color-emerald-50: #ecfdf5;
                    --color-emerald-100: #d1fae5;
                    --color-emerald-200: #a7f3d0;
                    --color-emerald-300: #6ee7b7;
                    --color-emerald-400: #34d399;
                    --color-emerald-500: #10b981;
                    --color-emerald-600: #059669;
                    --color-emerald-700: #047857;
                    --color-emerald-800: #065f46;
                    --color-emerald-900: #064e3b;
                    --color-purple-50: #faf5ff;
                    --color-purple-100: #f3e8ff;
                    --color-purple-200: #e9d5ff;
                    --color-purple-300: #d8b4fe;
                    --color-purple-400: #c084fc;
                    --color-purple-500: #a855f7;
                    --color-purple-600: #9333ea;
                    --color-purple-700: #7e22ce;
                    --color-purple-800: #6b21a8;
                    --color-purple-900: #581c87;
                    --spacing: .25rem;
                    --radius-lg: 0.75rem;
                    --radius-md: 0.5rem;
                    --radius-sm: 0.25rem;
                    --shadow-lg: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                }
            }

            @layer base {
                *, :after, :before, ::backdrop {
                    box-sizing: border-box;
                    border: 0 solid;
                    margin: 0;
                    padding: 0;
                }
                
                html, :host {
                    font-family: var(--font-sans);
                    line-height: 1.6;
                    -webkit-text-size-adjust: 100%;
                    scroll-behavior: smooth;
                }
                
                body {
                    background: linear-gradient(135deg, #f8fcff 0%, #f0f9ff 100%);
                    min-height: 100vh;
                    color: #374151;
                    overflow-x: hidden;
                }
                
                h1, h2, h3, h4, h5, h6 {
                    color: #1f2937;
                    font-weight: 700;
                    line-height: 1.2;
                }
                
                ::selection {
                    background-color: rgba(14, 165, 233, 0.2);
                }
                
                /* Asegurar que los iconos hereden colores */
                i, .fas, .fab, .far {
                    color: inherit;
                }
            }

            @layer utilities {
                /* Mejoras específicas para elementos visuales */
                .bg-gradient-medical {
                    background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
                }
                
                .bg-gradient-pediatric {
                    background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);
                }
                
                .text-gradient-medical {
                    background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                
                /* Mejoras para cards */
                .feature-card {
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .feature-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                    border-color: rgba(14, 165, 233, 0.3);
                }
                
                .feature-icon {
                    transition: all 0.4s ease;
                }
                
                .feature-card:hover .feature-icon {
                    transform: scale(1.1) rotate(5deg);
                }
                
                /* Mejoras para botones - AHORA AMBOS BOTONES SON IGUALES */
                .btn-medical-primary {
                    background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
                    color: white;
                    padding: 0.875rem 1.75rem;
                    border-radius: 0.875rem;
                    font-weight: 600;
                    font-size: 1.025rem;
                    transition: all 0.3s ease;
                    box-shadow: 0 6px 20px rgba(14, 165, 233, 0.3);
                    position: relative;
                    overflow: hidden;
                }
                
                .btn-medical-primary::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.6s;
                }
                
                .btn-medical-primary:hover::before {
                    left: 100%;
                }
                
                .btn-medical-primary:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 30px rgba(14, 165, 233, 0.4);
                }
                
                /* Botón secundario ahora igual al primario */
                .btn-medical-secondary {
                    background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
                    color: white;
                    padding: 0.875rem 1.75rem;
                    border-radius: 0.875rem;
                    font-weight: 600;
                    font-size: 1.025rem;
                    transition: all 0.3s ease;
                    box-shadow: 0 6px 20px rgba(14, 165, 233, 0.3);
                    position: relative;
                    overflow: hidden;
                }
                
                .btn-medical-secondary::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.6s;
                }
                
                .btn-medical-secondary:hover::before {
                    left: 100%;
                }
                
                .btn-medical-secondary:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 30px rgba(14, 165, 233, 0.4);
                }
                
                /* Mejoras para header */
                .header-glass {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(15px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.4);
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.08);
                }
                
                /* Mejoras para estadísticas */
                .stat-card-enhanced {
                    background: white;
                    border-radius: 1.25rem;
                    padding: 2rem;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.4s ease;
                }
                
                .stat-card-enhanced::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(90deg, #0ea5e9, #ec4899);
                }
                
                .stat-card-enhanced:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
                }
                
                /* Mejoras para testimonios */
                .testimonial-card {
                    background: linear-gradient(145deg, #ffffff, #f8fafc);
                    border-radius: 1.5rem;
                    padding: 2.5rem;
                    box-shadow: 20px 20px 60px #d1d9e6, -20px -20px 60px #ffffff;
                    transition: all 0.4s ease;
                }
                
                .testimonial-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 25px 25px 70px #c9d1de, -25px -25px 70px #ffffff;
                }
                
                /* Mejoras para footer */
                .footer-gradient {
                    background: linear-gradient(135deg, #0c4a6e 0%, #1e293b 100%);
                }
                
                /* Efectos visuales mejorados */
                .hover-lift-smooth {
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .hover-lift-smooth:hover {
                    transform: translateY(-6px);
                }
                
                .glow-effect {
                    box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.7);
                    animation: pulse-glow 2s infinite;
                }
                
                @keyframes pulse-glow {
                    0% {
                        box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.7);
                    }
                    70% {
                        box-shadow: 0 0 0 15px rgba(14, 165, 233, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(14, 165, 233, 0);
                    }
                }
                
                /* Animaciones mejoradas */
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out;
                }
                
                @keyframes float-delayed {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }
                
                .animate-float-delayed {
                    animation: float-delayed 6s ease-in-out infinite;
                }
                
                .delay-1 {
                    animation-delay: 0.2s;
                }
                
                .delay-2 {
                    animation-delay: 0.4s;
                }
                
                .delay-3 {
                    animation-delay: 0.6s;
                }
                
                /* Clases de utilidad mejoradas */
                .flex { display: flex; }
                .items-center { align-items: center; }
                .justify-center { justify-content: center; }
                .justify-between { justify-content: space-between; }
                .flex-wrap { flex-wrap: wrap; }
                .grid { display: grid; }
                .gap-8 { gap: 2rem; }
                .gap-6 { gap: 1.5rem; }
                .gap-12 { gap: 3rem; }
                .gap-16 { gap: 4rem; }
                .space-x-3 > * + * { margin-left: 0.75rem; }
                .space-x-4 > * + * { margin-left: 1rem; }
                .space-x-6 > * + * { margin-left: 1.5rem; }
                .container {
                    width: 100%;
                    margin-right: auto;
                    margin-left: auto;
                    padding-right: 1.5rem;
                    padding-left: 1.5rem;
                }
                @media (min-width: 640px) { .container { max-width: 640px; } }
                @media (min-width: 768px) { .container { max-width: 768px; } }
                @media (min-width: 1024px) { .container { max-width: 1024px; } }
                @media (min-width: 1280px) { .container { max-width: 1280px; } }
                
                /* Text utilities */
                .text-center { text-align: center; }
                .text-left { text-align: left; }
                .text-right { text-align: right; }
                .text-2xl { font-size: 1.5rem; line-height: 2rem; }
                .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
                .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
                .text-5xl { font-size: 3rem; line-height: 1; }
                .text-6xl { font-size: 3.75rem; line-height: 1; }
                .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
                .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
                .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
                .text-xs { font-size: 0.75rem; line-height: 1rem; }
                .font-bold { font-weight: 700; }
                .font-semibold { font-weight: 600; }
                .font-medium { font-weight: 500; }
                .leading-tight { line-height: 1.25; }
                .leading-relaxed { line-height: 1.625; }
                .leading-normal { line-height: 1.5; }
                
                /* Color utilities - ACTUALIZADAS CON IMPORTANT */
                .text-white { color: white !important; }
                .text-gray-400 { color: #9ca3af !important; }
                .text-gray-500 { color: #6b7280 !important; }
                .text-gray-600 { color: #4b5563 !important; }
                .text-gray-700 { color: #374151 !important; }
                .text-gray-800 { color: #1f2937 !important; }
                .text-gray-900 { color: #111827 !important; }
                .text-primary-500 { color: #0ea5e9 !important; }
                .text-primary-600 { color: #0284c7 !important; }
                .text-primary-700 { color: #0369a1 !important; }
                .text-secondary-500 { color: #ec4899 !important; }
                .text-secondary-600 { color: #db2777 !important; }
                .text-accent { color: #8b5cf6 !important; }
                .text-success { color: #22c55e !important; }
                .text-emerald-600 { color: #059669 !important; }
                .text-purple-500 { color: #a855f7 !important; }
                .text-purple-600 { color: #9333ea !important; }
                .bg-white { background-color: white; }
                .bg-primary-50 { background-color: #f0f9ff; }
                .bg-primary-100 { background-color: #e0f2fe; }
                .bg-primary-500 { background-color: #0ea5e9; }
                .bg-primary-600 { background-color: #0284c7; }
                .bg-secondary-500 { background-color: #ec4899; }
                .bg-secondary-600 { background-color: #db2777; }
                .bg-gray-50 { background-color: #f9fafb; }
                .bg-gray-100 { background-color: #f3f4f6; }
                .bg-gray-800 { background-color: #1f2937; }
                .bg-gray-900 { background-color: #111827; }
                .bg-emerald-50 { background-color: #ecfdf5; }
                .bg-emerald-100 { background-color: #d1fae5; }
                .bg-emerald-500 { background-color: #10b981; }
                .bg-emerald-600 { background-color: #059669; }
                .bg-purple-50 { background-color: #faf5ff; }
                .bg-purple-100 { background-color: #f3e8ff; }
                .bg-purple-500 { background-color: #a855f7; }
                .bg-purple-600 { background-color: #9333ea; }
                
                /* Nuevas clases de gradiente */
                .bg-gradient-emerald {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                }
                
                .bg-gradient-purple {
                    background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
                }
                
                /* Spacing */
                .p-6 { padding: 1.5rem; }
                .p-8 { padding: 2rem; }
                .p-10 { padding: 2.5rem; }
                .p-12 { padding: 3rem; }
                .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
                .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
                .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
                .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
                .py-10 { padding-top: 2.5rem; padding-bottom: 2.5rem; }
                .py-12 { padding-top: 3rem; padding-bottom: 3rem; }
                .py-16 { padding-top: 4rem; padding-bottom: 4rem; }
                .py-20 { padding-top: 5rem; padding-bottom: 5rem; }
                .px-4 { padding-left: 1rem; padding-right: 1rem; }
                .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
                .px-8 { padding-left: 2rem; padding-right: 2rem; }
                .mb-0 { margin-bottom: 0; }
                .mb-2 { margin-bottom: 0.5rem; }
                .mb-3 { margin-bottom: 0.75rem; }
                .mb-4 { margin-bottom: 1rem; }
                .mb-6 { margin-bottom: 1.5rem; }
                .mb-8 { margin-bottom: 2rem; }
                .mb-10 { margin-bottom: 2.5rem; }
                .mb-12 { margin-bottom: 3rem; }
                .mb-16 { margin-bottom: 4rem; }
                .mb-20 { margin-bottom: 5rem; }
                .mt-2 { margin-top: 0.5rem; }
                .mt-3 { margin-top: 0.75rem; }
                .mt-4 { margin-top: 1rem; }
                .mt-6 { margin-top: 1.5rem; }
                .mt-8 { margin-top: 2rem; }
                .mt-10 { margin-top: 2.5rem; }
                .mx-auto { margin-left: auto; margin-right: auto; }
                
                /* Border radius */
                .rounded-lg { border-radius: 0.75rem; }
                .rounded-xl { border-radius: 1rem; }
                .rounded-2xl { border-radius: 1.5rem; }
                .rounded-3xl { border-radius: 2rem; }
                .rounded-full { border-radius: 9999px; }
                
                /* Shadows */
                .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
                .shadow-md { box-shadow: var(--shadow-md); }
                .shadow-lg { box-shadow: var(--shadow-lg); }
                .shadow-xl { box-shadow: var(--shadow-xl); }
                .shadow-2xl { box-shadow: var(--shadow-2xl); }
                
                /* Positioning */
                .relative { position: relative; }
                .absolute { position: absolute; }
                .fixed { position: fixed; }
                .sticky { position: sticky; }
                .z-10 { z-index: 10; }
                .z-20 { z-index: 20; }
                .z-30 { z-index: 30; }
                .z-40 { z-index: 40; }
                .z-50 { z-index: 50; }
                .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
                .top-0 { top: 0; }
                .top-4 { top: 1rem; }
                .bottom-4 { bottom: 1rem; }
                .bottom-8 { bottom: 2rem; }
                .bottom-12 { bottom: 3rem; }
                .right-4 { right: 1rem; }
                .right-8 { right: 2rem; }
                .right-12 { right: 3rem; }
                .left-8 { left: 2rem; }
                .w-full { width: 100%; }
                .w-12 { width: 3rem; }
                .w-16 { width: 4rem; }
                .w-20 { width: 5rem; }
                .w-24 { width: 6rem; }
                .w-32 { width: 8rem; }
                .h-12 { height: 3rem; }
                .h-16 { height: 4rem; }
                .h-20 { height: 5rem; }
                .h-24 { height: 6rem; }
                .h-32 { height: 8rem; }
                .overflow-hidden { overflow: hidden; }
                .pointer-events-none { pointer-events: none; }
                
                /* Grid columns */
                .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
                .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
                
                @media (min-width: 640px) {
                    .sm\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                }
                
                @media (min-width: 768px) {
                    .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                    .md\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                    .md\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
                    .md\:flex-row { flex-direction: row; }
                    .md\:mb-0 { margin-bottom: 0; }
                    .md\:text-left { text-align: left; }
                    .md\:text-right { text-align: right; }
                    .md\:text-center { text-align: center; }
                }
                
                @media (min-width: 1024px) {
                    .lg\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                    .lg\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
                }
                
                /* Max width utilities */
                .max-w-2xl { max-width: 42rem; }
                .max-w-3xl { max-width: 48rem; }
                .max-w-4xl { max-width: 56rem; }
                .max-w-5xl { max-width: 64rem; }
                .max-w-6xl { max-width: 72rem; }
                .max-w-7xl { max-width: 80rem; }
                
                /* Display */
                .hidden { display: none; }
                .block { display: block; }
                .inline-block { display: inline-block; }
                .inline-flex { display: inline-flex; }
                
                @media (min-width: 768px) {
                    .md\:block { display: block; }
                    .md\:hidden { display: none; }
                }
                
                /* Opacity */
                .opacity-0 { opacity: 0; }
                .opacity-5 { opacity: 0.05; }
                .opacity-10 { opacity: 0.1; }
                .opacity-20 { opacity: 0.2; }
                .opacity-30 { opacity: 0.3; }
                .opacity-40 { opacity: 0.4; }
                .opacity-50 { opacity: 0.5; }
                .opacity-60 { opacity: 0.6; }
                .opacity-70 { opacity: 0.7; }
                .opacity-80 { opacity: 0.8; }
                .opacity-90 { opacity: 0.9; }
                .opacity-100 { opacity: 1; }
            }

            /* Elementos decorativos mejorados */
            .medical-blob {
                position: absolute;
                width: 600px;
                height: 600px;
                background: linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%);
                border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
                filter: blur(60px);
                z-index: 0;
                animation: blob-morph 20s ease-in-out infinite;
            }
            
            @keyframes blob-morph {
                0%, 100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
                25% { border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%; }
                50% { border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%; }
                75% { border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%; }
            }
            
            .floating-medical {
                position: absolute;
                border-radius: 50%;
                background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(236, 72, 153, 0.1));
                animation: float-delayed 8s ease-in-out infinite;
            }
            
            .medical-pattern {
                background-image: radial-gradient(circle at 2px 2px, rgba(14, 165, 233, 0.1) 1px, transparent 0);
                background-size: 40px 40px;
            }
            
            /* Badges mejorados */
            .badge-medical {
                display: inline-flex;
                align-items: center;
                padding: 0.5rem 1rem;
                background: linear-gradient(135deg, #dbeafe, #eff6ff);
                color: #1d4ed8;
                border-radius: 1rem;
                font-weight: 600;
                font-size: 0.875rem;
                border: 1px solid rgba(59, 130, 246, 0.2);
            }
            
            /* Hero section mejorada */
            .hero-gradient {
                background: linear-gradient(135deg, 
                    rgba(14, 165, 233, 0.1) 0%, 
                    rgba(59, 130, 246, 0.1) 30%, 
                    rgba(236, 72, 153, 0.1) 70%, 
                    rgba(139, 92, 246, 0.1) 100%);
            }
            
            /* Responsive improvements */
            @media (max-width: 768px) {
                .medical-blob {
                    width: 400px;
                    height: 400px;
                }
                
                .text-5xl, .text-6xl {
                    font-size: 2.5rem;
                }
                
                .text-4xl {
                    font-size: 2rem;
                }
                
                .p-12 {
                    padding: 2rem;
                }
                
                .gap-16 {
                    gap: 2rem;
                }
            }
            
            @media (max-width: 480px) {
                .text-5xl, .text-6xl {
                    font-size: 2rem;
                }
                
                .text-4xl {
                    font-size: 1.75rem;
                }
                
                .p-10 {
                    padding: 1.5rem;
                }
            }
            
            /* ESTILOS ESPECÍFICOS PARA LOS ICONOS CON COLORES */
            /* Iconos en las cards de características */
            .feature-card .fa-pills {
                color: white !important;
            }
            
            .feature-card .fa-clipboard-check {
                color: white !important;
            }
            
            /* Iconos en la sección de acciones rápidas */
            .quick-action-card .fa-file-prescription {
                color: white !important;
            }
            
            .quick-action-card .fa-chart-bar {
                color: white !important;
            }
            
            /* Iconos en testimonios */
            .testimonial-card .fa-clipboard-check {
                color: white !important;
            }
            
            /* Estilos específicos para enlaces de farmacia y reportes */
            .text-emerald-link {
                color: #059669 !important;
            }
            
            .text-emerald-link:hover {
                color: #047857 !important;
            }
            
            .text-purple-link {
                color: #9333ea !important;
            }
            
            .text-purple-link:hover {
                color: #7e22ce !important;
            }
            
            /* Asegurar que las flechas también tengan color */
            .text-emerald-400 {
                color: #34d399 !important;
            }
            
            .text-purple-400 {
                color: #c084fc !important;
            }
        </style>
    </head>
    <body class="min-h-screen font-sans antialiased">
        <!-- Background Elements Mejorados -->
        <div class="fixed inset-0 overflow-hidden pointer-events-none z-0 medical-pattern">
            <div class="medical-blob -top-60 -right-60 animate-float-delayed"></div>
            <div class="medical-blob -bottom-60 -left-60 animate-float-delayed" style="animation-delay: 2s;"></div>
            
            <div class="floating-medical w-80 h-80 top-20 left-10 opacity-10" style="animation-delay: 1s;"></div>
            <div class="floating-medical w-64 h-64 bottom-20 right-10 opacity-5" style="animation-delay: 3s;"></div>
            
            <!-- Efectos de partículas -->
            <div class="absolute top-0 left-0 w-full h-full">
                <div class="absolute top-1/4 left-1/4 w-4 h-4 bg-primary-400 rounded-full opacity-20 animate-float-delayed"></div>
                <div class="absolute top-1/3 right-1/3 w-3 h-3 bg-secondary-400 rounded-full opacity-15 animate-float-delayed" style="animation-delay: 1s;"></div>
                <div class="absolute bottom-1/4 left-1/3 w-5 h-5 bg-accent rounded-full opacity-25 animate-float-delayed" style="animation-delay: 2s;"></div>
            </div>
        </div>

        <div class="relative z-10">
            <!-- Header Mejorado -->
            <header class="header-glass sticky top-0 z-50 shadow-lg">
                <div class="container mx-auto px-6 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <div class="w-14 h-14 bg-gradient-medical rounded-2xl flex items-center justify-center shadow-xl hover-lift-smooth transition-all duration-400">
                                <i class="fas fa-heartbeat text-white text-2xl"></i>
                            </div>
                            <div>
                                <h1 class="text-2xl font-bold text-gradient-medical">Hospital Infantil</h1>
                                <p class="text-sm text-gray-600 font-medium">Excelencia en cuidado pediátrico</p>
                            </div>
                        </div>
                        
                        <div class="flex items-center space-x-6">
                            <!-- Menú de navegación mejorado -->
                            <nav class="hidden md:flex items-center space-x-3">
                                <a href="{{ route('hospitales.index') }}" class="nav-link text-gray-700 hover:text-primary-600 font-medium px-4 py-2 rounded-lg hover:bg-primary-50 transition-all">
                                    <i class="fas fa-hospital mr-2"></i>Hospitales
                                </a>
                                <a href="{{ route('pacientes.index') }}" class="nav-link bg-primary-50 text-primary-700 font-semibold px-4 py-2 rounded-lg">
                                    <i class="fas fa-user-injured mr-2"></i>Pacientes
                                </a>
                            </nav>
                            
                            <!-- Perfil médico mejorado -->
                            <div class="flex items-center space-x-4">
                                <div class="relative">
                                    <div class="w-12 h-12 bg-gradient-medical rounded-xl flex items-center justify-center text-white shadow-lg">
                                        <i class="fas fa-user-md text-xl text-white"></i>
                                    </div>
                                    <div class="absolute -top-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                                        <i class="fas fa-check text-xs text-white"></i>
                                    </div>
                                </div>
                                <div class="hidden md:block">
                                    <p class="text-sm font-semibold text-gray-800"></p>
                                    <p class="text-xs text-gray-500"></p>
                                </div>
                                <button class="md:hidden p-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors">
                                    <i class="fas fa-bars"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Main Content Mejorado -->
            <main class="container mx-auto px-6 py-12">
                <!-- Hero Section Mejorada -->
                <div class="text-center mb-20 animate-fade-in-up">
                    <div class="inline-flex items-center px-4 py-2 bg-gradient-medical rounded-full text-white font-semibold mb-8 shadow-lg">
                        <i class="fas fa-shield-alt mr-2 text-white"></i>
                        <span>Sistema Certificado HIPAA • ISO 27001</span>
                    </div>
                    
                    <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                        <span class="text-gradient-medical block md:inline">Cuidado Pediátrico</span> 
                        de Vanguardia
                    </h1>
                    
                    <p class="text-xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
                        Transformamos la experiencia médica infantil con tecnología avanzada, 
                        protocolos especializados y una atención centrada en el bienestar integral 
                        del niño y su familia.
                    </p>
                    
                    <!-- Badges de características mejorados -->
                    <div class="flex flex-wrap justify-center gap-4 mb-16">
                        <div class="badge-medical">
                            <i class="fas fa-lock mr-2 text-gray-800"></i>Seguridad Garantizada
                        </div>
                        <div class="badge-medical">
                            <i class="fas fa-clock mr-2 text-gray-800"></i>24/7 Disponible
                        </div>
                        <div class="badge-medical">
                            <i class="fas fa-users mr-2 text-gray-800"></i>Equipo Multidisciplinario
                        </div>
                        <div class="badge-medical">
                            <i class="fas fa-chart-line mr-2 text-gray-800"></i>Monitoreo en Tiempo Real
                        </div>
                    </div>
                    
                    <!-- Botones de acción mejorados - AHORA AMBOS SON IGUALES -->
                    <div class="flex flex-wrap justify-center gap-6">
                        <a href="{{ route('pacientes.index') }}" 
                           class="btn-medical-primary inline-flex items-center px-10 py-4">
                           <i class="fas fa-user-injured mr-3 text-lg text-white"></i>
                           <span class="text-lg">Gestión de Pacientes</span>
                           <i class="fas fa-arrow-right ml-3 text-lg text-white"></i>
                        </a>
                        
                        <a href="{{ route('hospitales.index') }}" 
                           class="btn-medical-primary inline-flex items-center px-10 py-4">
                           <i class="fas fa-hospital mr-3 text-lg text-white"></i>
                           <span class="text-lg">Ver Hospitales</span>
                           <i class="fas fa-arrow-right ml-3 text-lg text-white"></i>
                        </a>
                    </div>
                </div>

                <!-- Features Grid Mejorada -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <!-- Card 1 -->
                    <div class="feature-card p-8 rounded-3xl text-center hover-lift-smooth animate-fade-in-up delay-1">
                        <div class="feature-icon w-24 h-24 bg-gradient-medical rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                            <i class="fas fa-user-md text-white text-3xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-900 mb-4">Gestión Médica Integral</h3>
                        <p class="text-gray-600 mb-6 leading-relaxed">
                            Historiales clínicos completos, seguimiento especializado y coordinación entre especialistas para tratamientos personalizados.
                        </p>
                        <div class="flex items-center justify-center text-primary-600 font-semibold group">
                            <span class="mr-3">Explorar módulo</span>
                            <i class="fas fa-arrow-right transform group-hover:translate-x-2 transition-transform text-primary-600"></i>
                        </div>
                    </div>

                    <!-- Card 2 -->
                    <div class="feature-card p-8 rounded-3xl text-center hover-lift-smooth animate-fade-in-up delay-2">
                        <div class="feature-icon w-24 h-24 bg-gradient-pediatric rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                            <i class="fas fa-calendar-check text-white text-3xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-900 mb-4">Sistema de Citas Avanzado</h3>
                        <p class="text-gray-600 mb-6 leading-relaxed">
                            Programación inteligente con recordatorios automáticos, confirmación en tiempo real y horarios flexibles para familias.
                        </p>
                        <div class="flex items-center justify-center text-secondary-600 font-semibold group">
                            <span class="mr-3">Ver agenda</span>
                            <i class="fas fa-arrow-right transform group-hover:translate-x-2 transition-transform text-secondary-600"></i>
                        </div>
                    </div>

                    <!-- Card 3 - CON ÍCONO DE FARMACIA - CON COLOR AGREGADO -->
                    <div class="feature-card p-8 rounded-3xl text-center hover-lift-smooth animate-fade-in-up delay-3">
                        <div class="feature-icon w-24 h-24 bg-gradient-emerald rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                            <i class="fas fa-pills text-white text-3xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-900 mb-4">Control Farmacéutico</h3>
                        <p class="text-gray-600 mb-6 leading-relaxed">
                            Gestión precisa de medicamentos, recetas digitales, alertas de interacciones y seguimiento de adherencia terapéutica.
                        </p>
                        <div class="flex items-center justify-center text-emerald-link font-semibold group">
                            <span class="mr-3">Acceder farmacia</span>
                            <i class="fas fa-arrow-right transform group-hover:translate-x-2 transition-transform text-emerald-600"></i>
                        </div>
                    </div>
                </div>

                <!-- Stats Section Mejorada -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    <div class="stat-card-enhanced text-center">
                        <div class="text-5xl font-bold text-gradient-medical mb-4">500+</div>
                        <div class="text-gray-700 font-semibold text-lg mb-2">Pacientes Activos</div>
                        <div class="text-gray-500 text-sm">Cuidados pediátricos especializados</div>
                        <div class="mt-6">
                            <i class="fas fa-user-injured text-2xl text-primary-300"></i>
                        </div>
                    </div>
                    
                    <div class="stat-card-enhanced text-center">
                        <div class="text-5xl font-bold text-gradient-medical mb-4">50+</div>
                        <div class="text-gray-700 font-semibold text-lg mb-2">Especialistas Médicos</div>
                        <div class="text-gray-500 text-sm">Equipo multidisciplinario</div>
                        <div class="mt-6">
                            <i class="fas fa-user-md text-2xl text-primary-300"></i>
                        </div>
                    </div>
                    
                    <div class="stat-card-enhanced text-center">
                        <div class="text-5xl font-bold text-gradient-medical mb-4">24/7</div>
                        <div class="text-gray-700 font-semibold text-lg mb-2">Atención Disponible</div>
                        <div class="text-gray-500 text-sm">Soporte médico continuo</div>
                        <div class="mt-6">
                            <i class="fas fa-headset text-2xl text-primary-300"></i>
                        </div>
                    </div>
                    
                    <div class="stat-card-enhanced text-center">
                        <div class="text-5xl font-bold text-gradient-medical mb-4">99.8%</div>
                        <div class="text-gray-700 font-semibold text-lg mb-2">Satisfacción</div>
                        <div class="text-gray-500 text-sm">Índice de aprobación</div>
                        <div class="mt-6">
                            <i class="fas fa-heart text-2xl text-primary-300"></i>
                        </div>
                    </div>
                </div>

                <!-- CTA Section Mejorada -->
                <div class="relative rounded-3xl overflow-hidden mb-20">
                    <div class="absolute inset-0 bg-gradient-medical"></div>
                    <div class="absolute inset-0 opacity-10" style="background-image: url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"></div>
                    
                    <div class="relative z-10 p-12 text-center text-white">
                        <div class="mb-8">
                            <i class="fas fa-star text-4xl opacity-80 mb-4 text-yellow-300"></i>
                            <h3 class="text-4xl font-bold mb-6">Excelencia en Cuidado Infantil</h3>
                            <p class="text-xl mb-10 opacity-95 max-w-3xl mx-auto leading-relaxed">
                                Únete a la red hospitalaria que está transformando la pediatría con tecnología avanzada, 
                                protocolos certificados y una atención centrada en el bienestar integral.
                            </p>
                        </div>
                        
                        <div class="flex flex-wrap justify-center gap-8">
                            <a href="{{ route('hospitales.index') }}" 
                               class="px-12 py-4 bg-white text-primary-700 font-bold rounded-xl hover-lift-smooth hover:shadow-2xl text-lg transition-all duration-400 inline-flex items-center">
                               <i class="fas fa-hospital mr-3 text-lg text-primary-700"></i>
                               Ver Hospitales
                            </a>
                            
                            <a href="{{ route('pacientes.index') }}" 
                               class="px-12 py-4 bg-white text-primary-700 font-bold rounded-xl hover-lift-smooth hover:shadow-2xl text-lg transition-all duration-400 inline-flex items-center">
                               <i class="fas fa-user-injured mr-3 text-lg text-primary-700"></i>
                               Gestión de Pacientes
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Testimonials Section Mejorada -->
                <div class="mb-20">
                    <div class="text-center mb-16">
                        <h2 class="text-4xl font-bold text-gray-900 mb-6">Confianza Profesional</h2>
                        <p class="text-gray-600 text-lg max-w-3xl mx-auto">Especialistas médicos que confían en nuestra plataforma para brindar la mejor atención pediátrica</p>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div class="testimonial-card">
                            <div class="flex items-center mb-8">
                                <div class="w-16 h-16 bg-gradient-medical rounded-2xl flex items-center justify-center text-white font-bold text-xl mr-4 shadow-md">
                                    <i class="fas fa-stethoscope text-white"></i>
                                </div>
                                <div>
                                    <h4 class="font-bold text-gray-900 text-lg">Dr. Carlos Méndez</h4>
                                    <p class="text-sm text-gray-600">Cardiólogo Pediátrico</p>
                                    <div class="flex text-yellow-400 mt-2">
                                        <i class="fas fa-star text-yellow-400"></i>
                                        <i class="fas fa-star text-yellow-400"></i>
                                        <i class="fas fa-star text-yellow-400"></i>
                                        <i class="fas fa-star text-yellow-400"></i>
                                        <i class="fas fa-star text-yellow-400"></i>
                                    </div>
                                </div>
                            </div>
                            <p class="text-gray-700 italic leading-relaxed">
                                "La plataforma ha optimizado significativamente nuestros procesos, permitiéndonos enfocar más tiempo en la atención directa al paciente."
                            </p>
                        </div>
                        
                        <div class="testimonial-card">
                            <div class="flex items-center mb-8">
                                <div class="w-16 h-16 bg-gradient-pediatric rounded-2xl flex items-center justify-center text-white font-bold text-xl mr-4 shadow-md">
                                    <i class="fas fa-baby text-white"></i>
                                </div>
                                <div>
                                    <h4 class="font-bold text-gray-900 text-lg">Dra. Ana Rodríguez</h4>
                                    <p class="text-sm text-gray-600">Neonatóloga Jefe</p>
                                    <div class="flex text-yellow-400 mt-2">
                                        <i class="fas fa-star text-yellow-400"></i>
                                        <i class="fas fa-star text-yellow-400"></i>
                                        <i class="fas fa-star text-yellow-400"></i>
                                        <i class="fas fa-star text-yellow-400"></i>
                                        <i class="fas fa-star-half-alt text-yellow-400"></i>
                                    </div>
                                </div>
                            </div>
                            <p class="text-gray-700 italic leading-relaxed">
                                "El sistema de gestión de historiales es excepcional. La información está siempre disponible y actualizada para decisiones críticas."
                            </p>
                        </div>
                        
                        <!-- Testimonio del Dr. Luis Sánchez - CON ÍCONO Y COLOR AGREGADO -->
                        <div class="testimonial-card">
                            <div class="flex items-center mb-8">
                                <div class="w-16 h-16 bg-gradient-purple rounded-2xl flex items-center justify-center text-white font-bold text-xl mr-4 shadow-md">
                                    <i class="fas fa-clipboard-check text-white"></i>
                                </div>
                                <div>
                                    <h4 class="font-bold text-gray-900 text-lg">Dr. Luis Sánchez</h4>
                                    <p class="text-sm text-gray-600">Director Médico</p>
                                    <div class="flex text-yellow-400 mt-2">
                                        <i class="fas fa-star text-yellow-400"></i>
                                        <i class="fas fa-star text-yellow-400"></i>
                                        <i class="fas fa-star text-yellow-400"></i>
                                        <i class="fas fa-star text-yellow-400"></i>
                                        <i class="fas fa-star text-yellow-400"></i>
                                    </div>
                                </div>
                            </div>
                            <p class="text-gray-700 italic leading-relaxed">
                                "Los reportes avanzados y análisis predictivos nos han dado insights valiosos para mejorar continuamente nuestros protocolos."
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions Section (Nueva) -->
                <div class="bg-white rounded-3xl p-10 shadow-xl mb-20">
                    <div class="text-center mb-12">
                        <h3 class="text-3xl font-bold text-gray-900 mb-4">Acciones Rápidas</h3>
                        <p class="text-gray-600 max-w-2xl mx-auto">Accede rápidamente a las funciones principales del sistema</p>
                    </div>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <a href="{{ route('pacientes.index') }}" class="bg-primary-50 hover:bg-primary-100 rounded-2xl p-6 flex items-center space-x-4 transition-all hover-lift-smooth group">
                            <div class="w-12 h-12 bg-gradient-medical rounded-xl flex items-center justify-center text-white">
                                <i class="fas fa-user-plus text-lg text-white"></i>
                            </div>
                            <div>
                                <h4 class="font-bold text-gray-900">Nuevo Paciente</h4>
                                <p class="text-sm text-gray-600">Registrar paciente</p>
                            </div>
                            <i class="fas fa-chevron-right ml-auto text-primary-600 group-hover:translate-x-2 transition-transform"></i>
                        </a>
                        
                        <a href="#" class="bg-secondary-50 hover:bg-secondary-100 rounded-2xl p-6 flex items-center space-x-4 transition-all hover-lift-smooth group">
                            <div class="w-12 h-12 bg-gradient-pediatric rounded-xl flex items-center justify-center text-white">
                                <i class="fas fa-calendar-plus text-lg text-white"></i>
                            </div>
                            <div>
                                <h4 class="font-bold text-gray-900">Nueva Cita</h4>
                                <p class="text-sm text-gray-600">Agendar consulta</p>
                            </div>
                            <i class="fas fa-chevron-right ml-auto text-secondary-600 group-hover:translate-x-2 transition-transform"></i>
                        </a>
                        
                        <a href="#" class="bg-emerald-50 hover:bg-emerald-100 rounded-2xl p-6 flex items-center space-x-4 transition-all hover-lift-smooth group quick-action-card">
                            <div class="w-12 h-12 bg-gradient-emerald rounded-xl flex items-center justify-center text-white">
                                <i class="fas fa-file-prescription text-lg text-white"></i>
                            </div>
                            <div>
                                <h4 class="font-bold text-gray-900">Nueva Receta</h4>
                                <p class="text-sm text-gray-600">Prescripción médica</p>
                            </div>
                            <i class="fas fa-chevron-right ml-auto text-emerald-600 group-hover:translate-x-2 transition-transform"></i>
                        </a>
                        
                        <a href="#" class="bg-purple-50 hover:bg-purple-100 rounded-2xl p-6 flex items-center space-x-4 transition-all hover-lift-smooth group quick-action-card">
                            <div class="w-12 h-12 bg-gradient-purple rounded-xl flex items-center justify-center text-white">
                                <i class="fas fa-chart-bar text-lg text-white"></i>
                            </div>
                            <div>
                                <h4 class="font-bold text-gray-900">Reportes</h4>
                                <p class="text-sm text-gray-600">Estadísticas médicas</p>
                            </div>
                            <i class="fas fa-chevron-right ml-auto text-purple-600 group-hover:translate-x-2 transition-transform"></i>
                        </a>
                    </div>
                </div>
            </main>

            <!-- Footer Mejorado -->
            <footer class="footer-gradient text-white pt-16 pb-8">
                <div class="container mx-auto px-6">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div>
                            <div class="flex items-center space-x-3 mb-8">
                                <div class="w-14 h-14 bg-gradient-medical rounded-xl flex items-center justify-center shadow-lg">
                                    <i class="fas fa-heartbeat text-white text-xl"></i>
                                </div>
                                <div>
                                    <span class="text-2xl font-bold">Hospital Infantil</span>
                                    <p class="text-sm text-gray-300 mt-1">Excelencia pediátrica</p>
                                </div>
                            </div>
                            <p class="text-gray-300 mb-8 leading-relaxed">
                                Sistema integral de gestión hospitalaria pediátrica. 
                                Comprometidos con la innovación, seguridad y calidad en el cuidado infantil.
                            </p>
                            <div class="flex space-x-4">
                                <a href="#" class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-gradient-medical transition-all hover-lift-smooth">
                                    <i class="fab fa-facebook-f text-white"></i>
                                </a>
                                <a href="#" class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-gradient-medical transition-all hover-lift-smooth">
                                    <i class="fab fa-twitter text-white"></i>
                                </a>
                                <a href="#" class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-gradient-medical transition-all hover-lift-smooth">
                                    <i class="fab fa-instagram text-white"></i>
                                </a>
                                <a href="#" class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-gradient-medical transition-all hover-lift-smooth">
                                    <i class="fab fa-linkedin-in text-white"></i>
                                </a>
                            </div>
                        </div>
                        
                        <div>
                            <h4 class="text-lg font-bold mb-8 pb-2 border-b border-white/20">Sistema</h4>
                            <ul class="space-y-4">
                                <li><a href="{{ route('hospitales.index') }}" class="text-gray-300 hover:text-white transition-colors flex items-center group">
                                    <i class="fas fa-hospital mr-3 text-sm opacity-60 group-hover:opacity-100 text-white"></i> Hospitales
                                </a></li>
                                <li><a href="{{ route('pacientes.index') }}" class="text-gray-300 hover:text-white transition-colors flex items-center group">
                                    <i class="fas fa-user-injured mr-3 text-sm opacity-60 group-hover:opacity-100 text-white"></i> Pacientes
                                </a></li>
                                <li><a href="#" class="text-gray-300 hover:text-white transition-colors flex items-center group">
                                    <i class="fas fa-calendar-alt mr-3 text-sm opacity-60 group-hover:opacity-100 text-white"></i> Citas
                                </a></li>
                                <li><a href="#" class="text-gray-300 hover:text-white transition-colors flex items-center group">
                                    <i class="fas fa-file-medical mr-3 text-sm opacity-60 group-hover:opacity-100 text-white"></i> Reportes
                                </a></li>
                                <li><a href="#" class="text-gray-300 hover:text-white transition-colors flex items-center group">
                                    <i class="fas fa-pills mr-3 text-sm opacity-60 group-hover:opacity-100 text-white"></i> Farmacia
                                </a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 class="text-lg font-bold mb-8 pb-2 border-b border-white/20">Especialidades</h4>
                            <ul class="space-y-4">
                                <li><a href="#" class="text-gray-300 hover:text-white transition-colors flex items-center group">
                                    <i class="fas fa-baby mr-3 text-sm opacity-60 group-hover:opacity-100 text-white"></i> Pediatría General
                                </a></li>
                                <li><a href="#" class="text-gray-300 hover:text-white transition-colors flex items-center group">
                                    <i class="fas fa-heartbeat mr-3 text-sm opacity-60 group-hover:opacity-100 text-white"></i> Cardiología Pediátrica
                                </a></li>
                                <li><a href="#" class="text-gray-300 hover:text-white transition-colors flex items-center group">
                                    <i class="fas fa-brain mr-3 text-sm opacity-60 group-hover:opacity-100 text-white"></i> Neurología Infantil
                                </a></li>
                                <li><a href="#" class="text-gray-300 hover:text-white transition-colors flex items-center group">
                                    <i class="fas fa-dna mr-3 text-sm opacity-60 group-hover:opacity-100 text-white"></i> Genética Pediátrica
                                </a></li>
                                <li><a href="#" class="text-gray-300 hover:text-white transition-colors flex items-center group">
                                    <i class="fas fa-ambulance mr-3 text-sm opacity-60 group-hover:opacity-100 text-white"></i> Urgencias Pediátricas
                                </a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 class="text-lg font-bold mb-8 pb-2 border-b border-white/20">Contacto</h4>
                            <ul class="space-y-6">
                                <li class="flex items-start">
                                    <i class="fas fa-map-marker-alt text-primary-300 mt-1 mr-4 text-lg"></i>
                                    <div>
                                        <span class="text-gray-300">Av. Pediatría 1234</span><br>
                                        <span class="text-gray-400 text-sm">Ciudad Médica, CP 12345</span>
                                    </div>
                                </li>
                                <li class="flex items-center">
                                    <i class="fas fa-phone text-primary-300 mr-4 text-lg"></i>
                                    <div>
                                        <span class="text-gray-300">(123) 456-7890</span><br>
                                        <span class="text-gray-400 text-sm">Urgencias: (123) 456-7891</span>
                                    </div>
                                </li>
                                <li class="flex items-center">
                                    <i class="fas fa-envelope text-primary-300 mr-4 text-lg"></i>
                                    <div>
                                        <span class="text-gray-300">info@hospitalinfantil.com</span><br>
                                        <span class="text-gray-400 text-sm">Soporte 24/7</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="pt-12 border-t border-white/10 text-center">
                        <p class="text-gray-400 text-sm">
                            © 2024 Hospital Infantil - Sistema de Gestión Hospitalaria Pediátrica. 
                            <span class="block md:inline mt-2 md:mt-0">Todos los derechos reservados. Cumple con estándares HIPAA, GDPR y certificación ISO 27001.</span>
                        </p>
                        <div class="mt-6 flex flex-wrap justify-center gap-6 text-xs text-gray-500">
                            <a href="#" class="hover:text-gray-300 transition-colors">Política de Privacidad</a>
                            <a href="#" class="hover:text-gray-300 transition-colors">Términos de Servicio</a>
                            <a href="#" class="hover:text-gray-300 transition-colors">Aviso Legal</a>
                            <a href="#" class="hover:text-gray-300 transition-colors">Accesibilidad</a>
                            <a href="#" class="hover:text-gray-300 transition-colors">Mapa del Sitio</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>

        <!-- Floating Action Buttons Mejorados -->
        <button class="fixed bottom-12 right-8 w-16 h-16 bg-gradient-medical text-white rounded-2xl shadow-2xl hover-lift-smooth transition-all duration-400 z-40 flex items-center justify-center glow-effect">
            <i class="fas fa-comment-medical text-2xl text-white"></i>
            <span class="absolute -top-2 -right-2 w-7 h-7 bg-secondary-500 text-xs rounded-full flex items-center justify-center font-bold">5</span>
        </button>

        <button id="scrollToTop" class="fixed bottom-12 left-8 w-12 h-12 bg-gray-800 text-white rounded-full shadow-xl hover-lift-smooth transition-all duration-400 z-40 flex items-center justify-center opacity-0 pointer-events-none hover:bg-gray-900">
            <i class="fas fa-chevron-up text-white"></i>
        </button>

        <!-- Scripts -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js" 
                integrity="sha512-fD9DI5bZwQxOi7MhYWnnNPlvXdp/2Pj3XSTRrFs5FQa4mizyGLnJcN6tuvUS6LbmgN1ut+XGSABKvjN0H6Aoow==" 
                crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        
        <script>
            // Scroll to top button functionality
            const scrollToTopButton = document.getElementById('scrollToTop');
            
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    scrollToTopButton.classList.remove('opacity-0', 'pointer-events-none');
                    scrollToTopButton.classList.add('opacity-100', 'pointer-events-auto');
                } else {
                    scrollToTopButton.classList.remove('opacity-100', 'pointer-events-auto');
                    scrollToTopButton.classList.add('opacity-0', 'pointer-events-none');
                }
            });
            
            scrollToTopButton.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            // Animación de entrada para elementos
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-fade-in-up');
                    }
                });
            }, observerOptions);
            
            // Observar elementos con clase específica
            document.querySelectorAll('.feature-card, .stat-card-enhanced, .testimonial-card').forEach(el => {
                observer.observe(el);
            });
            
            // Efecto de hover para cards con delay
            document.querySelectorAll('.hover-lift-smooth').forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transitionDelay = '0s';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transitionDelay = '0.1s';
                });
            });
            
            // Actualizar hora actual en footer (opcional)
            function updateCurrentYear() {
                const yearElement = document.querySelector('footer p');
                if (yearElement) {
                    const currentYear = new Date().getFullYear();
                    yearElement.innerHTML = yearElement.innerHTML.replace('2024', currentYear);
                }
            }
            
            updateCurrentYear();
            
            // Efecto de escritura para el título principal (mejorado)
            const heroTitle = document.querySelector('.text-5xl, .text-6xl');
            if (heroTitle) {
                const text = heroTitle.textContent;
                heroTitle.textContent = '';
                let i = 0;
                let isTyping = false;
                
                function startTypeWriter() {
                    if (!isTyping) {
                        isTyping = true;
                        typeWriter();
                    }
                }
                
                function typeWriter() {
                    if (i < text.length) {
                        heroTitle.textContent += text.charAt(i);
                        i++;
                        setTimeout(typeWriter, 50);
                    }
                }
                
                // Iniciar cuando el elemento sea visible
                const titleObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            setTimeout(startTypeWriter, 300);
                            titleObserver.unobserve(entry.target);
                        }
                    });
                });
                
                titleObserver.observe(heroTitle);
            }
        </script>
    </body>
</html>