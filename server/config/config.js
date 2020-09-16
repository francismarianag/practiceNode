process.env.PORT = process.env.PORT || 3000;

/*
Vencimiento del token
60 seg
60 min
24 h
30 d
*/
process.env.EXP_TOKEN = 60 * 60 * 24 * 30;

/*
SEED de autenticacion
*/
process.env.SEED = process.env.SEED || 'dev-secret';

/*
Google client ID
*/

process.env.CLIENT_ID = process.env.CLIENT_ID || '1016966735636-fc61rlanrsf21nlt5a7a47s2nh8jl0jh.apps.googleusercontent.com';
