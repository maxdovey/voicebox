const path = require('path')
const {spawn} = require('child_process')
/**
   * Run python myscript, pass in `-u` to not buffer console output
   * @return {ChildProcess}
*/
function runScript(){
   return spawn('/home/max/Documents/pinter-local/voice-clone-cpu/bin/python', [
      "-u",
       '/home/max/Documents/pinter-local/voice-clone-cpu/Real-Time-Voice-Cloning/cli-clone-run.py',
     "-t", "this is an example sentence",
   ]);
}

// const subprocess = runScript()
// // print output of script
// subprocess.stdout.on('data', (data) => {
//    console.log(`data:${data}`);
// });
// subprocess.stderr.on('data', (data) => {
//    console.log(`error:${data}`);
// });
// subprocess.stderr.on('close', () => {
//    console.log("Closed");
// });
