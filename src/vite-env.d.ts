/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string
    readonly REACT_APP_API_URL: string
    // adicione outras variáveis aqui se precisar
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
