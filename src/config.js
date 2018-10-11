// This file sets the configuration used throughout the application depending
// on the REACT_APP_ENV environment variable set via package.json scripts.

const development = {
    apiBaseUrl : `https://www.tjoonz.com/wp-json/wp/v2`
};

const testing = {
    apiBaseUrl : `http://localhost:3333`
};

const production = {
    apiBaseUrl : `https://www.tjoonz.com/wp-json/wp/v2`    
};

const config = {
    development,
    testing,
    production
};

export default { ...config[ process.env.REACT_APP_ENV ]};
