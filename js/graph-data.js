/**
 * Created with JetBrains WebStorm.
 * User: deepikai
 * Date: 23/8/13
 * Time: 6:01 PM
 * To change this template use File | Settings | File Templates.
 */

var CreateJson = {
    mainJson:[],
    addJson :function(){
        var min = 1;
        var max =   500;

        for(var i=0 ; i<500 ; i++)
        {
            var src = Math.round(min + (Math.random()*max));
            var trg = Math.round(min + (Math.random()*max));

            var temp = {
                "adjacencies": [
                    {
                        "nodeTo": trg+".0.0.1",
                        "nodeFrom": src+".0.0.1",
                        'data':{}

                    }

                ],
                'id' :src+".0.0.1",
                'name':src+".0.0.1",
                'proc':'java',
                'data':{}


            }  ;

            this.mainJson.push(temp);

        }


    }

}
CreateJson.addJson();
window.graphJson = CreateJson.mainJson;