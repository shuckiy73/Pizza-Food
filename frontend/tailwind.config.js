/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    
    container: {
      // you can configure the container to be centered
      center: true,
      

      // or have default horizontal padding

      // default breakpoints but with 40px removed
    },
    screens: {
      "pc": {max:"1380px"},
      "laptop": {max: "1024px"},
      "tablet": {max: "768px"},
      "mobile": {max: "480px"},
    },
    borderRadius: {
      '4xl': '1.875rem',
    },
    extend: {
      colors: {
        'primary':'#fe5f00',
        'secondary': '#fafafa',
        'background': '#FFBF9B'
      }
    },
  },
  plugins: [
    function ({addUtilities}) {
      const newUtilities = {
        '.scrollbar-thin': {
          useScrollbarWidth: 'thin',
          scrollbarColor: 'white'
        },
        '.scrollbar-webkit': {
          '&::-webkit-scrollbar': {
            width:'8px'
          },
          '&::-webkit-scrollbar-track': {
            background: '#E5E7EB'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'gray',
            borderRadius: '20px',
            border:'1px solid white'
          }
        }
      }

      addUtilities(newUtilities, ['responsive', "hover"])
    }
  ],
}