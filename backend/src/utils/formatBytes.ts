export const formatBytes=(bytes:number):string=>{
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i=0;
    while(bytes>=1024 && i<units.length-1){
        bytes/=1024;
        i++;
    }

    const value=Number(bytes.toFixed(2));
    return `${value} ${units[i]}`;
}