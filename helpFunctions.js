const {log,bon,users}= require("./data")

function addToLog(userId,date, action, role ,message){
    log.push({
      id: userId, date: date,action:action,role: role,message:message
    })
  }

  function pronadiIndexOdBona(bonId){
    const indexLogic = (element) => element.id == bonId;
    const i= bon.findIndex(indexLogic)
    return i
  }
  function pronadiIndexUsera(userId) {
    const indexLogic = (element) => element.id == userId;
    const i= users.findIndex(indexLogic)
    return i
  }

  function pronadiBonovePoId(userId){
    return bon.filter(bon => bon.ownerId == userId)
  }

  function vratiAktivnost(userId){
    const bonovi= pronadiBonovePoId(userId)
    var datetime=new Date()
    isActiveVar=null
    isActive=false
    diff=0
    var i=0;

    for( i=0; i< bonovi.length ;i++)
    {
      if(bonovi[i].actDate ==null){
        diffDays2 = Math.ceil((datetime -bonovi[i].genDate ) / (1000 * 60 * 60 * 24));
        if(diffDays2 <= bonovi[i].passiveTime )
        {
          //bon se jos stigne aktivirat
        }
        else{
          //bon se vise nesmije moc aktivirat
          continue;
        }
      }
      diffDays = Math.ceil((datetime -bonovi[i].actDate ) / (1000 * 60 * 60 * 24));
      if(diffDays < 0){
        //greska ,aktDate je prije datetime
      }
      if(diffDays <= bonovi[i].duration )
      {
        isActive=true
        diff=bonovi[i].duration - diffDays
        break;
      }
      else{
        //diff=bonovi[i].duration - diffDays
      }
    }
    
    if(isActive)
      return [bonovi,isActive,i,diff]
    else
      return [bonovi,isActive,-1,diff]
  }

  function generateANumber(){
    tempNum=0
    lookingForNum=true
    while(lookingForNum) {
      tempNum=Math.floor(Math.random()*1e10).toString();
      
      if(tempNum.toString().length < 10) continue

      foundMatch=false
      bon.forEach(element => {
        if(element.id ==tempNum){
          foundMatch=true
        }
      })

      if(foundMatch) continue
      lookingForNum=false
    }
    return tempNum
  }

  module.exports= {
    addToLog,
    pronadiIndexOdBona,
    pronadiIndexUsera,
    pronadiBonovePoId,
    vratiAktivnost,
    generateANumber

    
}