const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

dns.resolveSrv('_mongodb._tcp.cluster0.dc9spgo.mongodb.net', (err, addresses) => {
  if (err) {
    console.error('SRV Error:', err);
    return;
  }
  console.log('SRV Records:', addresses);
  
  dns.resolveTxt('cluster0.dc9spgo.mongodb.net', (err, txts) => {
    if (err) {
      console.error('TXT Error:', err);
    } else {
      console.log('TXT Records:', txts);
    }
  });
});
