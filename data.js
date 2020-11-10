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
    users: [
        {id:554255, name: 'Mateo' ,email:"admin@admin", role: ROLE.ADMIN,password:'$2b$10$3bc.WM2zRgGWrVhQ0yGbf.kid5LB1WUWw/jLfhH6ZcVOYwSfVl.xy'},
        {id:686864, name: 'Sally',email:"Sally@g.com" , role: ROLE.BASIC, balance:15.45,genCount:5},
        {id:668646, name: 'Joe'  ,email:"Joe@g.com", role: ROLE.BASIC , balance:200,genCount:5,password:'$2b$10$Qe4nkyASNc0GclFpe0gnsusX53A8v61KkPtWLPPQzC/uR7xqJ.OP2'}
    ],
    bon: [
        {id: 156123161655, genDate: Date(2020, 11, 5 ),active:true, ownerId: 2},
        {id: 156123161655, genDate: Date(2020, 10, 15 ) ,active:false, ownerId: 2},
        {id: 156123161655, genDate: Date(2018, 11, 24) ,active:true, ownerId: 3},
        {id: 156123161655, genDate: Date(2018, 11, 24 ) ,active:false, ownerId: 3}
    ],
    log: [
        {id: 668646, date: Date(2020, 11, 5 ),action:ACTION.LOGIN },
        {id: 686864, date: Date(2020, 10, 15 ) ,action:ACTION.GENERATION},
        {id: 668646, date: Date(2018, 11, 24) ,action:ACTION.ACTIVATON},
        {id: 686864, date: Date(2018, 11, 24 ) ,action:ACTION.GENERATION},
    ]
}