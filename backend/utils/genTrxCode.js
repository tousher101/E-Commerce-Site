async function genTrxCode() {
   const prefix="T&Tpayment"
    let code;
    let exists=true;
    while(exists){
      
        const randomNum= Math.floor(1000+Math.random()*9000);
        code=`${prefix}${randomNum}`;
    }
    return code;
}

module.exports=genTrxCode