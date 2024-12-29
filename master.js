const cluster =  require('cluster');
const os = require('os');

const totalCPUs = os.cpus().length;

if(cluster.isPrimary){
    // fork workers
    console.log(`Primary ${process.pid} is running.`);

    for(let i=0; i<totalCPUs; i++){
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });

}
else{
    console.log(`Worker ${process.pid} started`);
    require('./index');
}