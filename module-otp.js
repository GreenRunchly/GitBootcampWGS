const pooldb = require('./module-db');
const wbm = require('wbm');

function OTPRun(){
    //{showBrowser:true}
    wbm.start().then(async () => {
        console.log('OTP App is runnning...');
        return;
    }).catch( (err) => {
        console.log('Failed to open Browser');
        console.log(err);
        return;
    });
}
function sendOTPEveryMinutes() {

    // console.log('Checking OTP...');

    // Cek OTP
    let sqlsyn = `SELECT o.id,o.code,p.phone_number FROM pengguna p JOIN otp_request o ON p.id=o.id_owner WHERE o.status='unverified'`;
    pooldb.query( sqlsyn, (err, result) => { 
        // Jika Error Syntax atau semacamnya
        if (err){ 
            console.log(`Error (${err})`);
        }
        if (result[0]){
            
            let kontak = []; let sqlnew = '';
            result.forEach(datarequest => {
                let orang = {phone:(datarequest.phone_number), otp:datarequest.code };
                kontak.push(orang);
                sqlnew += `${datarequest.id},`;
            });
            sqlnew = sqlnew.slice(0, -1); 
            console.log(result);

            // Update Invite Link
            let sqlsyn = `UPDATE otp_request SET status='pending' WHERE id IN (${sqlnew})`;
            pooldb.query( sqlsyn, (err, result) => { 
                // Jika Error Syntax atau semacamnya
                if (err){ 
                    setInterval(sendOTPEveryMinutes, (10000));
                    console.log(`Update OTP Status Failed! (${err})`);
                    return;
                }
                console.log('Sending OTP...');
                clearInterval(this);
                const pesan = `Kode OTP mu untuk masuk classroom...
({{otp}})`;
                wbm.send(kontak, pesan).then(async () => {
                    console.log('Done');
                    setInterval(sendOTPEveryMinutes, (10000));
                    return;
                }).catch( (err) => {
                    console.log(err);
                    console.log('Failed Sending OTP...');
                    setInterval(sendOTPEveryMinutes, (10000));
                    return;
                });
                
            });
            
        }else{
            // console.log(`No request in database..`);
            // console.log(`End.`);
            return;
        }
    });
    
}

OTPRun();

setInterval(sendOTPEveryMinutes, (10000));