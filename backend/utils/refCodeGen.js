export async function refCodeGen(prisma,name='') {
    let code;
    let exists=true;
    while(exists){
        const prefix=name.substring(0,3).toUpperCase();
        const randomNum= Math.floor(1000+Math.random()*9000);
        code=`${prefix}${randomNum}`;
        const existing=await prisma.user.findUnique({
            where:{referralCode:code}
        });
        if(!existing) exists=false;
    }
    return code;
}