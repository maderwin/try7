import express  from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import React    from 'react';
import ReactDom from 'react-dom/server';
import { getHeaders, initialize } from 'redux-oauth';
import { match, RouterContext } from 'react-router';
import { Provider } from 'react-redux';
import routes from './routes';
import configureStore from './redux/configureStore';
import restApi from './libs/restApi';


const store = configureStore();
const app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cookieParser());

restApi(app);

app.use((req, res) => {
    return match({ routes: routes(store), location: req.url }, (error, redirectLocation, renderProps) => {
            if (redirectLocation) { // Если необходимо сделать redirect
                return res.redirect(301, redirectLocation.pathname + redirectLocation.search);
            }

            if (error) { // Произошла ошибка любого рода
                return res.status(500).send(error.message);
            }

            if (!renderProps) { // мы не определили путь, который бы подошел для URL
                return res.status(404).send('Not found');
            }


            const componentHTML = ReactDom.renderToString(
                <Provider store={store}>
                    <RouterContext {...renderProps} />
                </Provider>
            );

            const state = store.getState();

            // res.cookie('authHeaders', JSON.stringify(getHeaders(store.getState())), { maxAge: Date.now() + 14 * 24 * 3600 * 1000 });
            return res.end(renderHTML(componentHTML, state));
        });
});

const assetUrl = process.env.NODE_ENV !== 'production' ? 'http://localhost:8050' : '/';

function renderHTML(componentHTML, initialState) {
    return `
    <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Hello React</title>
          <link rel="stylesheet" href="${assetUrl}/public/assets/styles.css">
          <script src="https://api-maps.yandex.ru/2.1/?lang=ru_RU" type="text/javascript">
    </script>
          <script type="application/javascript">
            window.REDUX_INITIAL_STATE = ${JSON.stringify(initialState)};
          </script>
      </head>
      <body>
        <div id="react-view">${componentHTML}</div>
	<div id="dev-tools"></div>
        <script type="application/javascript" src="${assetUrl}/public/assets/bundle.js"></script>
      </body>
    </html>
  `;
}

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server listening on: ${PORT}`);
});
