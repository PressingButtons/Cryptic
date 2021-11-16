import express from 'express';
import bp from 'body-parser';
import path from 'path';
import {fileURLToPath} from 'url';

const app = express( );
const PORT = process.env.PORT || 3000;

const convertToPath = url => {
  return path.join(path.dirname(fileURLToPath(import.meta.url)), url);
}

app.use('/public', express.static('./public'));

app.get('/', (req, res) => {
  let url = convertToPath('index.html');
  res.sendFile(url);
})

app.listen(PORT, err => {
  if(err) throw err;
  console.log(`Server initialized. Listening on port[${PORT}].`)
})
