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


});


// bootstrapTable初始化
var TableInit = function () {
  var oTableInit = new Object();
  //初始化Table
  oTableInit.Init = function () {
    $('#resultList').bootstrapTable({
      url: URL_LIST.relation.search,
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
        console.log(params);
        var d={};
        d.openapiAccount=$("#openapiAccount").val();
        d.account=$("#account").val();
        console.log(d);
        return d;
      },
      columns: [
        {title: 'ID', field: 'id'},
        {title: 'openapi账号', field: 'openapiAccount'},
        {title: '数据源账号', field: 'account'},

        {title: '状态', field: 'useOrNot',
          formatter:function (value,row,index) {
            return row.status=="Y"?"启用":"未启用";
          }},
        {
          title: '操作', field: 'handle',
          formatter: function (value, row, index) {
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
    //获取openapi的全部类容
    $.ajax({
      url: URL_LIST.openapiAccounts.getAll,
      method: 'get',
      success: function (data) {

        $("#openapiAccounts1").empty();  //清空列表
        for (var i = 0; i < data.length; i++) {
          // console.log(data[i]);
          var value=data[i].loginName;
          var openapiAccountId=data[i].accountId;

          $("#openapiAccounts1").append(
              "<option value='"+value+"'   openapiAccountId='"+openapiAccountId+"'>"
              +value +"\("+  openapiAccountId + "\)" +
              "</option>"
          );


        }
        // $("#opanapiAccounts").selectpicker({width: 220});
        $("#openapiAccounts1").selectpicker('val','');
        $("#openapiAccounts1").selectpicker('refresh');
      }
    });


    // 拉取所有的数据源account
    $.ajax({
      url: URL_LIST.datasource.getAll,
      method: 'get',
      contentType: 'application/json',
      success: function (data) {
        $("#account1").empty();  //清空列表
        $("#account2").empty();  //清空列表
        for (var i = 0; i < data.length; i++) {
          var value =data[i].account;
          var type =data[i].type;
          $("#account1").append("<option value='"+value+"'> "+value+"      \("+   ( type=='production' ? '生产' : '测试') + "\) </option>");
          $("#account2").append("<option value='"+value+"'>  "+value+"     \("+   ( type=='production' ? '生产' : '测试') + "\) </option>");

        }

        $("#account1").selectpicker('refresh')
        $("#account2").selectpicker('refresh')
      }
    });

  }


  return oSelectInit;

}

// button初始化
var ButtonInit=function () {
  var oButtonInit=new Object();
  oButtonInit.Init=function () {



    //模态框保存btn
    $("#addSaveBtn").click(function () {
      var d={};
      d.account=$("#account1").val();
      d.openapiAccount=$("#openapiAccounts1").val();
      d.openapiAccountId=$("#openapiAccounts1").find("option:selected").attr("openapiAccountId");
      d.status=$("#status1").val();

      console.log(d);
      $.ajax({
        url: URL_LIST.relation.add,
        type: 'post',
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
        d.openapiAccount=$("#openapiAccount2").val();
        $.ajax({
          url: URL_LIST.relation.update,
          type:'put',
          contentType:'application/json',
          data: JSON.stringify(d),
          success: function (data) {
            if (data==null) {
              alert("更新保存失败");
              // $('#updateDialog').modal('hide');
              // $("#resultList").bootstrapTable('refresh');
            } else {
              if(data.result){
                alert("更新保存成功");
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
    url:URL_LIST.relation.delete+"?id="+id,
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
  $("#id2").val(row.id);
  $("#account2").selectpicker('val',row.account);
  $("#openapiAccount2").val(row.openapiAccount);
  $("#status2").val(row.status);
}





