# How to install tailwind

Execute

````shell
npm install -D tailwindcss postcss autoprefixer
````

````shell
npx tailwindcss init -p
````

Paste in ``tailwind.config.js``

```javascript
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {}
    },
    plugins: []
}
```

Add base CSS to `index.css`

````css
@tailwind base;
@tailwind components;
@tailwind utilities;
````