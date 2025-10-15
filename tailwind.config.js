/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores de la bandera mexicana
        mexico: {
          verde: {
            50: '#f0f9f0',
            100: '#dcf2dc',
            200: '#bce5bc',
            300: '#8dd18d',
            400: '#5bb85b',
            500: '#228B22', // Verde bandera principal
            600: '#1e7a1e',
            700: '#1a691a',
            800: '#165816',
            900: '#0f3f0f',
          },
          rojo: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#DC143C', // Rojo bandera principal
            600: '#c61236',
            700: '#b01030',
            800: '#9a0e2a',
            900: '#7e0b22',
          },
          dorado: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#FFD700', // Dorado mexicano
            600: '#d4af00',
            700: '#b89400',
            800: '#9c7a00',
            900: '#7d5f00',
          },
          tierra: {
            50: '#faf7f5',
            100: '#f3ede8',
            200: '#e6d9d0',
            300: '#d4c0b1',
            400: '#c1a68f',
            500: '#8B4513', // Tierra mexicana
            600: '#7a3d11',
            700: '#69350f',
            800: '#582d0d',
            900: '#47240a',
          }
        },
        // Mantener compatibilidad con nombres anteriores
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#DC143C',
          600: '#c61236',
          700: '#b01030',
          800: '#9a0e2a',
          900: '#7e0b22',
        },
        success: {
          50: '#f0f9f0',
          100: '#dcf2dc',
          200: '#bce5bc',
          300: '#8dd18d',
          400: '#5bb85b',
          500: '#228B22',
          600: '#1e7a1e',
          700: '#1a691a',
          800: '#165816',
          900: '#0f3f0f',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
        mexico: ['Cinzel', 'Playfair Display', 'serif'],
        display: ['Cinzel Decorative', 'Cinzel', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-5px)' },
          '60%': { transform: 'translateY(-3px)' },
        },
      },
    },
  },
  plugins: [],
}
