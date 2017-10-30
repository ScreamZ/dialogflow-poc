# DialogFlow webhook for Google AI engine.

This is a POC that process additionnal jobs in order to feed the Google AI engine.

## Installation 1

- Run `yarn` or `npm i`
- Start building javascript bundle, using the typescript compiler. `npm run build:watch`. This will also watch for new changes.
- Run `npm start` as sudo, or override PORT env variable because you need to be su to use port 80.

## Ideas of TODOs
- Cards
- Carousel
- Enregistrer données utilisateur (air table, sqllite ?)
- Savoir reconnaître un utilisateur déjà enregistré
- Extraire plus d'informations du site web (utilisation du formulaire quand les paramètres d'intent sont remplis)
- Se concentrer sur les besoins voyage / santé pour les utilisateurs d'April internationalhubs
