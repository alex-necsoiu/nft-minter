module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8f5cff', // adjust to your Figma
        accent: '#ff5cf4',  // adjust to your Figma
        dark: '#11143B',
        white: '#FFFFFF',
        orange: '#E4761B',
        orangeLight: '#F6851B',
        orangeDark: '#CD6116',
        orangeAccent: '#E4751F',
        blueDark: '#335F8A',
        black: '#000000',
        blue: '#233447',
        grayDark: '#23232a',
        brown: '#763D16',
        sand: '#D7C1B3',
        gray: '#383838',
        grayLight: '#9E9E9E',
        grayDarker: '#161616',
        blueAccent: '#4B6B9A',
        blueLight: '#6DB2D8',
        sandDark: '#C0AD9E',
        purple: '#DE8FFF',
        purpleDark: '#753DEB',
        blueGradientStart: '#2E66F8',
        blueGradientEnd: '#124ADB',
        pink: '#C42370',
        green: '#34C77B',
        yellow: '#FEE676',
        pinkAccent: '#9C4763',
        whiteGlass: 'rgba(255,255,255,0.08)',
        whiteGlassLight: '#FFFFFF17',
        blackGlass: '#000000AB',
      },
      backgroundImage: {
        'main-gradient': 'linear-gradient(90deg, #627EEA 54.37%, #EC4467 111.49%)',
        'radial-purple': 'radial-gradient(40.39% 40.39% at 50% 50%, #DE8FFF 0%, #753DEB 45.83%, #000000 100%)',
        'radial-green': 'radial-gradient(40.39% 40.39% at 50% 50%, #34C77B 0%, #000000 100%)',
        'radial-blue': 'radial-gradient(40.39% 40.39% at 50% 50%, #627EEA 0%, #2F3C70 52.08%, #000000 100%)',
        'radial-pink': 'radial-gradient(40.39% 40.39% at 50% 50%, #EC4467 0%, #7B2336 47.92%, #000000 100%)',
        'radial-yellow': 'radial-gradient(40.39% 40.39% at 50% 50%, #FEE676 0%, #9C4763 45.83%, #000000 100%)',
        'main-dark': 'linear-gradient(210deg, #CCFFA6 13.4%, #FEE676 45.42%, #000000 86.6%)',
        'main-gray': 'linear-gradient(90deg, #E7E7E7 1.14%, #9E9E9E 28.83%, #F2F2F2 57.49%, #949494 89.98%)',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
    },
  },
  plugins: [],
}