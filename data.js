const ROLE ={
    ADMIN: 'admin',
    BASIC: 'basic'
}
const ACTION ={
    LOGOUT: 'logout',
    LOGIN: 'login',
    ACTIVATON:'activation',
    GENERATION: 'generation'
}



module.exports={
    ROLE: ROLE,
    ACTION: ACTION,
    users: [
        {id:554255, name: 'Mateo' ,     email:"admin@admin",    role: ROLE.ADMIN,   password:'$2b$10$3bc.WM2zRgGWrVhQ0yGbf.kid5LB1WUWw/jLfhH6ZcVOYwSfVl.xy'},
        {id:686864, name: 'Sally',      email:"Sally@g.com" ,   role: ROLE.BASIC,   password: "$2b$10$NAXdRpvkYAQfZ2cgcKr0L.Q2ZgK77aNroqdIhaExEVKQi3TzHKygm",   balance:15.45,  genCount:5},
        {id:668646, name: 'Joe'  ,      email:"Joe@g.com",      role: ROLE.BASIC ,  password:'$2b$10$Qe4nkyASNc0GclFpe0gnsusX53A8v61KkPtWLPPQzC/uR7xqJ.OP2',    balance:200 ,   genCount:5,},
        {id:160502, name: "k1",         email: "k@k",           role: ROLE.BASIC,   password: "$2b$10$NAXdRpvkYAQfZ2cgcKr0L.Q2ZgK77aNroqdIhaExEVKQi3TzHKygm",   balance: 0,     genCount:5}
    ],
    bon: [
        {id: 156123161655, genDate: new Date(2020, 08, 5 ),     ownerId: 686864 , value:60  ,duration:60 ,passiveTime: 60              },
        {id: 156123161656, genDate: new Date(2020, 09, 15 ),    ownerId: 686864 , value:30  ,duration:30   ,passiveTime: 60            },
        {id: 156123161657, genDate: new Date(2020, 11, 24) ,    ownerId: 668646 ,value:60 ,duration:30  ,passiveTime: 60              },
        {id: 156123161658, genDate: new Date(2020, 10, 2 ),     ownerId: 160502,  value:30,   duration:30,passiveTime: 60                  }
    ],
    log: [
        {id: 12345, date: Date(2020, 11, 5 ),action:ACTION.LOGIN , info: "FIRST TEST LOG"},

    ],
    global_settings: {PASIIVE_TIME_SETTING:60, DURATION:30}
}