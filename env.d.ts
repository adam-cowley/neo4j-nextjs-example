declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NEO4J_URI: string;
        NEO4J_USERNAME: string;
        NEO4J_PASSWORD: string;
      }
    }
  }

  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
  export {}