# How to install tailwind

Execute

````shell
npm install -D tailwindcss
````

````shell
npx tailwindcss init
````

Paste in ``tailwind.config.js``

```javascript
module.exports = {
    content: [
        "./src/**/*.{html,js}"
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

Build css
````shell
npx tailwindcss -i ./src/index.css -o ./src/output.css --watch
````