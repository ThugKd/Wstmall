﻿var provinceId = $('#provinceId').val();//所在省份的ID
var addressIdForDel;//拟删除的地址的id
//hash改变后触发
function changePage(){
    var actionName = window.location.hash.replace('#', '');
    actionName = actionName.split('&');
    if( actionName[0] == 'addNewAddress' ){
        $('#wst-page1').addClass('wst-page1');
        $('#wst-page2').show();
        $('#wst-footer').hide();
        toEditAddress();
    }else if( actionName[0] == 'editAddress' ){
        $('#wst-page1').addClass('wst-page1');
        $('#wst-page2').show();
        $('#wst-footer').hide();
        toEditAddress(actionName[1]);
    }else{
        $('#wst-page1').show();
        $('#wst-page2').addClass('wst-page2');
        setTimeout(function(){
            $('body').removeClass('ajaxpage-active');
        },100);
        setTimeout(function(){
            $('#wst-page1').removeClass('wst-page1');
            $('#wst-footer').show();
            $('#wst-page2').css('display','none');
        },500);
    }
}

//新增时获取所在城市的地区信息
function getAddressWhenAddNew(){
    $.post(WST.U('WebApp/Areas/getProvinceList'), {}, function(data){//获取省份列表
        var json = WST.toJson(data);
        var str = '';
        if(json.status==1 && json.list){
            for(var i in json.list){
                str += '<option value="'+ json.list[i].areaId +'" ';
                str += (json.list[i].areaId == provinceId) ? 'selected' : '';
                str += '>'+ json.list[i].areaName +'</option>';
            }
            $('#areaId').append(str);

            $.post(WST.U('WebApp/Areas/getCityListByProvince'), {provinceId: provinceId}, function(data){//获取城市列表
                var json = WST.toJson(data);
                var str = '';
                if(json.length>0){
                    for(var i=0; i<json.length; i++){
                        str += '<option value="'+ json[i].areaId +'" ';
                        str += (json[i].areaId == WST.areaId2) ? 'selected' : '';
                        str += '>'+ json[i].areaName +'</option>';
                    }
                    $('#areaId2').append(str);

                    $.post(WST.U('WebApp/Areas/getDistricts'), {cityId: WST.areaId2}, function(data){//获取区县
                        var json = WST.toJson(data);
                        var str = '';
                        if(json.length>0){
                            for(var i=0; i<json.length; i++){
                                str += '<option value="'+ json[i].areaId +'">'+ json[i].areaName +'</option>';
                            }
                            $('#areaId3').append(str);
                            var areaId3 = json[0].areaId;//默认取第一个区县
                            $.post(WST.U('WebApp/Communitys/getByDistrict'), {areaId3:areaId3}, function(data){//获取社区
                                var json = WST.toJson(data);
                                var str = '';
                                if(json.status==1 && json.list){
                                    for(var i in json.list){
                                        str += '<option value="'+ json.list[i].communityId +'">'+ json.list[i].communityName +'</option>';
                                    }
                                    $('#areaId4').append(str);
                                }
                            });
                        }
                    });
                }
            });
        }
        data = json = str = null;
    });
}

//编辑时获取地区信息
function getAddress(addressInfo){
    var areaId = addressInfo.areaId1;
    var areaId2 = addressInfo.areaId2;
    var areaId3 = addressInfo.areaId3;
    var communityId = addressInfo.communityId;
    $.post(WST.U('WebApp/Areas/getProvinceList'), {}, function(data){//获取省份列表
        var json = WST.toJson(data);
        var str = '';
        if(json.status==1 && json.list){
            for(var i in json.list){
                str += '<option value="'+ json.list[i].areaId +'" ';
                str += (json.list[i].areaId==areaId) ? 'selected' : '';
                str += '>'+ json.list[i].areaName +'</option>';
            }
            $('#areaId').append(str);

            $.post(WST.U('WebApp/Areas/getCityListByProvince'), {provinceId:areaId}, function(data){//获取城市列表
                var json = WST.toJson(data);
                var str = '';
                if(json.length>0){
                    for(var i=0; i<json.length; i++){
                        str += '<option value="'+ json[i].areaId +'" ';
                        str += (json[i].areaId==areaId2) ? 'selected' : '';
                        str += '>'+ json[i].areaName +'</option>';
                    }
                    $('#areaId2').append(str);

                    $.post(WST.U('WebApp/Areas/getDistricts'), {cityId:areaId2}, function(data){//获取区县
                        var json = WST.toJson(data);
                        var str = '';
                        if(json.length>0){
                            for(var i=0; i<json.length; i++){
                                str += '<option value="'+ json[i].areaId +'" ';
                                str += (json[i].areaId==areaId3) ? 'selected' : '';
                                str += '>'+ json[i].areaName +'</option>';
                            }
                            $('#areaId3').append(str);

                            $.post(WST.U('WebApp/Communitys/getByDistrict'), {areaId3:areaId3}, function(data){//获取社区
                                var json = WST.toJson(data);
                                var str = '';
                                if(json.status==1 && json.list){
                                    for(var i in json.list){
                                        str += '<option value="'+ json.list[i].communityId +'" ';
                                        str += (json.list[i].communityId==communityId) ? 'selected' : '';
                                        str += '>'+ json.list[i].communityName +'</option>';
                                    }
                                    $('#areaId4').append(str);
                                }
                            });
                        }
                    });
                }
            });
        }
        data = json = str = null;
    });
}

//新增或编辑收货地址页
function toEditAddress(addressId){
    if(addressId){
        $('#wst-default-loading').modal();
        $.post(WST.U('WebApp/UsersAddress/getAddressById'), {addressId:addressId}, function(data){
            var addressInfo = WST.toJson(data);
            var template = Handlebars.compile( $('#editaddress').text() );
            Handlebars.registerHelper("transformDefaultAddress",function(isDefault){//注册用于转换对应变量的值的Helper
                if(isDefault==1){
                   return 'am-icon-check-circle active';
                }else{
                   return 'am-icon-circle-thin';
                }
            });
            var html = template(addressInfo);
            $('#wst-page2').html(html);
            $('#addressTitle').html('修改收货地址').after('<div class="am-header-right am-header-nav"><span class="del-address" onclick="javascript:toDelAddress('+addressId+');">删除</span></div>');
            $('#wst-default-loading').modal('close');
            $('body').addClass('ajaxpage-active');
	        setTimeout(function(){ 
	            $('#wst-page1').hide();
            	$('#wst-page2').removeClass('wst-page2');
            	$(document).scrollTop(0);
	        },300);
            getAddress(addressInfo);
            addressInfo = template = html = null;
        });
    }else{
        var template = Handlebars.compile( $('#editaddress').text() );
        var provinceList = {};
        Handlebars.registerHelper("transformDefaultAddress",function(isDefault){//注册用于转换对应变量的值的Helper
            if(isDefault==1){
               return 'am-icon-check-circle active';
            }else{
               return 'am-icon-circle-thin';
            }
        });
        var html = template(provinceList);
        $('#wst-page2').html(html);
        $('body').addClass('ajaxpage-active');
        setTimeout(function(){ 
            $('#wst-page1').hide();
        },300);
        getAddressWhenAddNew();
        provinceList = template = html = null;
    }
}

//根据省份获取城市列表
function getCitysByProvince(provinceId){
    $('#areaId2').html('<option value="">请选择</option>');
    $('#areaId3').html('<option value="">请选择</option>');
    $('#areaId4').html('<option value="">请选择</option>');
    $.post(WST.U('WebApp/Areas/getCityListByProvince'), {provinceId:provinceId}, function(data){
        var json = WST.toJson(data);
        var str = '';
        if(json.length>0){
            for(var i=0; i<json.length; i++){
                str += '<option value="'+ json[i].areaId +'">'+ json[i].areaName +'</option>';
            }
        }
        $('#areaId2').append(str);
        data = json = null;
    });
}

//根据城市获取区县列表
function getDistricts(cityId){
    $('#areaId3').html('<option value="">请选择</option>');
    $('#areaId4').html('<option value="">请选择</option>');
    $.post(WST.U('WebApp/Areas/getDistricts'), {cityId:cityId}, function(data){
        if(data){
            var json = WST.toJson(data);
            var str = '';
            if(json && json.length>0){
                for(var i=0; i<json.length; i++){
                    str += '<option value="'+ json[i].areaId +'">'+ json[i].areaName +'</option>';
                }
            }
            $('#areaId3').append(str);
            data = json = null;
        }
    });
}

//根据区县获取社区列表
function getCommunity(areaId3){
    $('#areaId4').html('<option value="">请选择</option>');
    $.post(WST.U('WebApp/Communitys/getByDistrict'), {areaId3:areaId3}, function(data){
        var json = WST.toJson(data);
        var str = '';
        if(json.status==1 && json.list && json.list.length>0){
            for(var i=0; i<json.list.length; i++){
                str += '<option value="'+ json.list[i].communityId +'">'+ json.list[i].communityName +'</option>';
            }
        }
        $('#areaId4').append(str);
        data = json = null;
    });
}

//保存收货地址
function saveAddress(addressId){
    var userName = $('#username').val();
    var userPhone = $('#cellphone').val();
    var userTel = $('#phone').val();
    var areaId = $('#areaId').val();
    var areaId2 = $('#areaId2').val();
    var areaId3 = $('#areaId3').val();
    var communityId = $('#areaId4').val();
    var address = $('#address').val();
    if( $('.isdefault').attr('class').indexOf('am-icon-circle-thin') > -1 ){
        var isdefaultAddress = 0;//不设为默认地址
    }else{
        var isdefaultAddress = 1;//设为默认地址
    }
    if(userName==''){
        wstMsg('收货人姓名不能为空', 'username');
        return false;
    }
    if(userPhone=='' && userTel==''){
        wstMsg('手机号码和固定电话不能同时为空');
        return false;
    }
    if(areaId==''){
        wstMsg('请选择省份', 'areaId');
        return false;
    }
    if(areaId2==''){
        wstMsg('请选择城市', 'areaId2');
        return false;
    }
    if(areaId3==''){
        wstMsg('请选择区县', 'areaId3');
        return false;
    }
    if(communityId==''){
        wstMsg('请选择社区', 'areaId4');
        return false;
    }
    if(address==''){
        wstMsg('请填写详细地址', 'address');
        return false;
    }
    var param = {};
    param.addressId = addressId;
    param.userName = userName;
    param.areaId1 = areaId;
    param.areaId2 = areaId2;
    param.areaId3 = areaId3;
    param.communityId = communityId;
    param.userPhone = userPhone;
    param.userTel = userTel;
    param.address = address;
    param.isDefault = isdefaultAddress;
    $('#save-address').attr("disabled","disabled");
    $.post(WST.U('WebApp/UsersAddress/editAddress'), param, function(data){
        var json = WST.toJson(data);
        if(addressId){//修改
            if( json.status == 1 ){
                wstMsg('修改地址成功！');
                setTimeout(function(){
                    location.href = WST.U('WebApp/UsersAddress/index');
                },2000);
            }else{
                wstMsg('修改地址失败，请重试！');
    			$('#save-address').removeAttr("disabled");
            }
        }else{//新增
            if( json.status ){
                wstMsg('新增地址成功！');
                var targetUrl = storageGetItem('targetUrl');
                var url = (WST.blank(targetUrl) != '') ? targetUrl : WST.U('WebApp/UsersAddress/index');
                setTimeout(function(){
                	storageRemoveItem('targetUrl');
                    location.href = url;
                }, 2000);
            }else{
                wstMsg('新增地址失败，请重试！');
    			$('#save-address').removeAttr("disabled");
            }
        }
        data = json = null;
    });
}

//删除收货地址
function toDelAddress(addressId){
    addressIdForDel = addressId;
    wstConfirm('确定删除？', delAddress);
}
var vn ='37ac8bee51bffdb85f1acd3570d13a9c';
//删除收货地址
function delAddress(){
    $.post(WST.U('WebApp/UsersAddress/delAddress'), {addressId:addressIdForDel}, function(data){
        var json = WST.toJson(data);
        if(json.status==1){
            wstMsg('删除成功');
            setTimeout(function(){
                location.href = WST.U('WebApp/UsersAddress/index');
            },2000);
        }else{
            wstMsg('删除失败，请重试！');
        }
        data = json = null;
    });
}

//设为默认地址
function setToDefault(obj){
    if( $(obj).attr('class').indexOf('am-icon-circle-thin') > -1 ){
        $(obj).removeClass('am-icon-circle-thin').addClass('am-icon-check-circle active');
    }else{
        $(obj).removeClass('am-icon-check-circle active').addClass('am-icon-circle-thin');
    }
}

$(document).ready(function(){
    initFooter('users');
});