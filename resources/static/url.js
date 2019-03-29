var URL_LIST ={
    datasource:{
       search:"account/search",
       getAll:"account/getAll" ,
       add: "account/save",
       delete:'account/delete',
       update:'account/update',

    },
    openapiAccounts:{
      getAll:"openapiAccount/getAll"
    },

    permission:{
      search:"permission/search",
      add:"permission/add",
      update:"permission/update",
      delete:"permission/delete"
    },
    datSourceInfo:{
      getAllByOrg:"info/getAllByOrg",
      getAll:"info/getAll",
      getByRestUrl: "info/getByRestUrl"
    },
    relation:{
      search:"relation/search",
      add:"relation/add",
      update:"relation/update",
      delete:"relation/delete"
    },

   org:{
     getAllOrg:"org/getAllOrg"
   }

}