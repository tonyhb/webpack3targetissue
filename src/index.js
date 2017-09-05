import superagent from 'superagent';

superagent('https://api.ipify.org?format=json').end((err, res) => {
  console.log(res);
});
