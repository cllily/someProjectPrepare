$(function () {
  //1.初始化Table
  var oTable = new TableInit();
  oTable.Init();

  // 2.初始化下拉框
  var oSelect=new SelectInit();
  oSelect.Init();

  // 3 初始化button
  var oButton =new ButtonInit();
  oButton.Init();

  //添加模态框关闭事件
  $('#updateDialog').on('hide.bs.modal', function () {
    $("#updateForm")[0].reset();
    oSelect.Init();
  });

});


// bootstrapTable初始化
var TableInit = function () {
  var oTableInit = new Object();
  //初始化Table
  oTableInit.Init = function () {
    $('#resultList').bootstrapTable({
      url: URL_LIST.permission.search,
      method: 'post',
      search: true,
      cache: false,
      toolbar: '#toolbar',
      showRefresh: 'true',
      showToggle: 'true',
      showColumns: 'true',
      pagination: 'true',
      pageSize: 10,
      pageList: [10, 20, 50, 'ALL'],
      dataField: 'result',
      sidePagination: "client", //客户端处理分页　服务端：server
      queryParams: function (params) {
        // console.log(params);
        var d={};
        d.account=$("#account").val();
        d.accountOrg=$("#accountOrg").val();
        d.interfaceName=$("#interfaceName").val();
        // console.log(d);
        return d;
      },
      columns: [
        {title: 'ID', field: 'id'},
        {title: '数据源账号', field: 'account'},
        {title: '接口', field: 'interfaceName'},
        {title: '所属机构', field: 'accountOrg'},
        {title: '状态', field: 'useOrNot',
          formatter:function (value,row,index) {
            return row.status=="Y"?"启用":"停用";
          }},
        {
          title: '操作', field: 'handle',
          formatter: function (value, row, index) {
            // console.log(row);
            var html = [
              '<a href="javascript:void(0)" onClick="deleteFunc(\'' + row.id + '\')">删除</a>&nbsp;&nbsp;' +
              '<a href="#updateDialog" class="sjsupdate'+index+'" data-toggle="modal" >修改</a>'
            ].join('');
            $('#resultList').on('click','.sjsupdate'+index,function(){
              updateFunc(row,'.sjsupdate'+index);
            });
            return html;
          }
        }
      ]

    });
  }
  // oTableInit.queryParams = function (params) {
  //
  //   var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
  //     limit: params.limit,   //页面大小
  //     offset: params.offset,  //页码
  //     openapiAccounts: $("#openapiAccounts").val(),
  //     statu: $("#txt_search_statu").val()
  //   };
  //   return temp;
  // };
  return oTableInit;
};

// 下拉列表加载数据
var SelectInit=function () {
  var oSelectInit=new Object();
  oSelectInit.Init=function () {
    var d = {};


    //获取所有的org
    $.ajax({
      url: URL_LIST.org.getAllOrg,
      method: 'get',
      contentType: 'application/json',
      success: function (data) {
        $("#accountOrg1").empty();  //清空列表
        $("#accountOrg2").empty();  //清空列表
        $("#accountOrg1").append("<option value=''>请选择</option>");
        for (var i = 0; i < data.length; i++) {
          var value =data[i];
          $("#accountOrg1").append("<option value='"+value+"'>"+value+"</option>");
          $("#accountOrg2").append("<option value='"+value+"' id='"+value+"'>"+value+"</option>");

        }
        $("#accountOrg1").selectpicker('val','');
        $("#accountOrg2").selectpicker('val','');
        $("#accountOrg1").selectpicker('refresh');
        $("#accountOrg2").selectpicker('refresh');
      }
    });

    //add 的时候默认select all  interafaceName
    $.ajax({
      url:URL_LIST.datSourceInfo.getAll,
      contentType:"application/json",
      method:'get',
      success: function(data){
        $("#interfaceNames1").empty();
        $("#interfaceNames2").empty();
        for(var i=0;i<data.length;i++){
          var value=data[i].dataSource;
          // $("#interfaceNames1").append("<option value='"+value+"'>"+value+"</option>");
          $("#interfaceNames2").append("<option value='"+value+"'>"+value+"</option>");
        }

        // $("#interfaceNames1").selectpicker("val",'');
        $("#interfaceNames2").selectpicker('refresh');

      }
    });

    $.ajax({
      url:URL_LIST.datasource.getAll,
      method: 'get',
      success:function (data) {
        // console.log("-----------");
        // console.log(data)
        $("#account1").empty();
        $("#account2").empty();

        for(var i=0;i<data.length;i++){
          $("#account1").append("<option value="+data[i].account+">"+data[i].account +"\("+(data[i].type=='production'?'生产':'测试')+"\)"+"</option>");
          $("#account2").append("<option value="+data[i].account+">"+data[i].account +"\("+(data[i].type=='production'?'生产':'测试')+"\)"+"</option>");
        }

        $("#account1").selectpicker('refresh');
        $("#account2").selectpicker('refresh');
      }
    })


    $("#accountOrg1").change(function () {
      var org=$("#accountOrg1").val();
      $.ajax({
        url:URL_LIST.datSourceInfo.getAllByOrg+"?org="+org,
        contentType:"application/json",
        method:'get',
        success: function(data){
          $("#interfaceNames1").empty();
          for(var i=0;i<data.length;i++){
            var value=data[i].dataSource;
            $("#interfaceNames1").append("<option value='"+value+"'>"+value+"</option>");
          }

          $("#interfaceNames1").selectpicker("val",'');
          $("#interfaceNames1").selectpicker('refresh');

        }
      })

    });

    $("#accountOrg2").change(function () {
      var accountOrg2=$("#accountOrg2").val();
      $.ajax({
        url:URL_LIST.datSourceInfo.getAllByOrg+"?org="+accountOrg2,
        contentType:"application/json",
        method:'get',
        success: function(data){
          console.log("-----------------------------------");
          console.log(data);
          $("#interfaceNames2").empty();
          for(var i=0;i<data.length;i++){
            var value=data[i].dataSource;
            $("#interfaceNames2").append("<option value='"+value+"'>"+value+"</option>");
          }
          $("#interfaceNames2").selectpicker("val",'');
          $("#interfaceNames2").selectpicker('refresh');



        }
      })
    });


  }

  // oSelectInit.initInterfaceName=function () {
  //   //add 的时候默认select all  interafaceName
  //   $.ajax({
  //     url:URL_LIST.datSourceInfo.getAll,
  //     contentType:"application/json",
  //     method:'get',
  //     success: function(data){
  //       $("#interfaceNames1").empty();
  //       $("#interfaceNames2").empty();
  //       for(var i=0;i<data.length;i++){
  //         var value=data[i].dataSource;
  //         $("#interfaceNames1").append("<option value='"+value+"'>"+value+"</option>");
  //         $("#interfaceNames2").append("<option value='"+value+"'>"+value+"</option>");
  //       }
  //
  //       $("#interfaceNames1").selectpicker("val",'');
  //       $("#interfaceNames2").selectpicker('refresh');
  //
  //     }
  //   });
  //
  // }




  return oSelectInit;

}

// button初始化
var ButtonInit=function () {
  var oButtonInit=new Object();
  oButtonInit.Init=function () {

    //模态框保存btn
    $("#addSaveBtn").click(function () {
      var d={};
      d.account=$('#account1').val();
      d.interfaceName=$("#interfaceNames1").val();
      d.accountOrg=$("#accountOrg1").val();
      d.status=$("#status1").val();
      console.log(d);

      $.ajax({
        url: URL_LIST.permission.add,
        method: 'post',
        contentType: 'application/json',
        data: JSON.stringify(d),
        success: function (data) {
          if(data.result){
            $('#addDialog').modal('hide');
            $("#resultList").bootstrapTable('refresh');
          }else{
            alert(data.message);
          }


        }
      })
    });

    //查询
    $("#queryBtn").click(function () {
      $("#resultList").bootstrapTable('refresh');
    });

    //清除搜索条件 Btn
    $("#clearBtn").click(function () {
      $("#queryForm")[0].reset();
      $("#resultList").bootstrapTable('refresh');
    });
    //修改模态框保存
    $('#updateSaveBtn').click(function () {

      var form = $('#updateForm');
      if (form.valid()) {

        var d = {};
        d.id = $("#id2").val();
        d.account= $("#account2").val();
        d.status= $("#status2").val();
        d.interfaceName=$("#interfaceNames2").val();
        d.accountOrg=$("#accountOrg2").val();


        $.ajax({
          url: URL_LIST.permission.update,
          type: 'put' ,
          contentType:'application/json',
          data: JSON.stringify(d),
          success: function (data) {
            if (data==null) {
              alert("更新保存失败");
              // $('#updateDialog').modal('hide');
              // $("#resultList").bootstrapTable('refresh');
            } else {
              if(data.result){
                // alert("更新保存成功");
                $('#updateDialog').modal('hide');
                $("#resultList").bootstrapTable('refresh');
              }else{
                alert(data.message)
              }
            }
          }
        });
      }

    });

  }


  return oButtonInit;

}





//删除操作
function deleteFunc(id) {
  var ss=confirm("确认删除【"+id+"】");
  if(!ss) return;
  // var d={};
  // d.id=id;
  $.ajax({
    url:URL_LIST.permission.delete+"?id="+id,
    type:'delete',
    // contentType:'application/json',
    // data: JSON.stringify(d),
    success:function (data) {
      if(data==null){
        alert("删除失败")
      }else{
        if(data.result){
          $("#resultList").bootstrapTable('refresh');
        }else{
          alert(data.message);
        }
      }
    }
  })

};

//update操作
function updateFunc(row) {
  // // //select  下拉框需要更新
  // var oSelect=new SelectInit();
  // oSelect.initInterfaceName();



  $("#id2").val(row.id);
  $("#status2").val(row.status);
  // $("#interfaceNames2").find("option[text='"+row.interfaceName+"']").attr("selected",true);
  // $("#accountOrg2").find("option[text='"+row.accountOrg+"']").attr("selected",true);
  // $('#accountOrg2 option:selected') .val(row.accountOrg);
  // $('#interfaceNames2').title=(row.interfaceName);
  // $('#interfaceNames2').selectpicker('val',row.interfaceName);
  // $('#interfaceNames2 option:selected') .val(row.interfaceName);
  $("#interfaceNames2").selectpicker('val',row.interfaceName);
  $("#accountOrg2").selectpicker('val',row.accountOrg);

  $("#account2").selectpicker('val',row.account);
}





