const {addToLog}= require("./helpFunctions")
const {log,bon,users}= require("./data")

function ScheduledActivityCheck(){
    
    var datetime=new Date()
    addToLog(null,datetime,null,"ACTIVITIES REFRESHED")
    pobrisiBon=false
    while(true){
      i=0
      pobrisiBon=false

      for(i=0;i<bon.length;i++)
      {
        if(bon[i].actDate ==null){
          diffDays2 = Math.ceil((datetime -bon[i].genDate ) / (1000 * 60 * 60 * 24));
          if(diffDays2 > bon[i].passiveTime )
          {
            //proslo passiveTime
            pobrisiBon=true;
            break;
          }  
        }
        diffDays = Math.ceil((bon[i].actDate- datetime ) / (1000 * 60 * 60 * 24));
        if(diffDays > bon[i].duration )
        {
          //proslo activeTime
          pobrisiBon=true;
          return [i,pobrisiBon,"istekao akt"]
          break;
        }

        

      }

      
      if(pobrisiBon){
        bon.splice(i, 1);
      }
      else{
        break;
      }


    }
  }

  module.exports= {
    ScheduledActivityCheck
  }