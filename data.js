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

const RACUN = {
    ACTIVE: 'active',
    INACTIVE: 'inactive'
}

module.exports={
    ROLE: ROLE,
    ACTION: ACTION,
    users: [
        {id:554255, name: 'Mateo' ,email:"admin@admin", role: ROLE.ADMIN,password:'$2b$10$3bc.WM2zRgGWrVhQ0yGbf.kid5LB1WUWw/jLfhH6ZcVOYwSfVl.xy'},
        {id:686864, name: 'Sally',email:"Sally@g.com" , role: ROLE.BASIC, balance:15.45,genCount:5},
        {id:668646, name: 'Joe'  ,email:"Joe@g.com", role: ROLE.BASIC , balance:200,genCount:5,password:'$2b$10$Qe4nkyASNc0GclFpe0gnsusX53A8v61KkPtWLPPQzC/uR7xqJ.OP2'},
        {id:1605027569634,name: "k1",email: "k@k",password: "$2b$10$NAXdRpvkYAQfZ2cgcKr0L.Q2ZgK77aNroqdIhaExEVKQi3TzHKygm",role: "basic",balance: 0,genCount:5}
    ],
    bon: [
        {id: 156123161655, genDate: new Date(2020, 11, 5 ),    ownerId: 686864 ,        value:60                },
        {id: 156123161656, genDate: new Date(2020, 10, 15 ),  ownerId: 686864 ,        value:30                },
        {id: 156123161657, genDate: new Date(2018, 11, 24) ,   ownerId: 668646 ,        value:60                },
        {id: 156123161658, genDate: new Date(2020, 10, 2 ),  ownerId: 1605027569634,  value:30,   duration:30 }
    ],
    log: [
        {id: 12345, date: Date(2020, 11, 5 ),action:ACTION.LOGIN , info: "FIRST TEST LOG"},

    ]
}