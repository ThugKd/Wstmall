﻿function orderCondition(c,b){var a=$(c).attr("class");var d=$(c).attr("status");var e=$(c).siblings(".goods-filter");$(c).addClass("active");e.removeClass("active").attr("status","down");if(a.indexOf("active")==-1){$(c).children(".active-icon").show();$(c).children(".noactive-icon").hide();e.children(".active-icon").hide();e.children(".noactive-icon").show();e.children(".arrow-up").hide()}if(d.indexOf("down")>-1){if(a.indexOf("active")==-1){$(c).children(".arrow-down").show();$(c).children(".arrow-up").hide();$("#goodsOrder").val("0")}else{$(c).children(".arrow-down").hide();$(c).children(".arrow-up").show();$(c).attr("status","up");$("#goodsOrder").val("1")}}else{$(c).children(".arrow-down").show();$(c).children(".arrow-up").hide();$(c).attr("status","down");$("#goodsOrder").val("0")}$("#goodsOrderby").val(b);$("#currPage").val("0");$("#goods-list").html("");getGoodsList()}function getGoodsList(){$("#loading-icon").show();loading=true;var a={};a.shopId=$("#shopId").val();a.pageSize=10;a.currPage=Number($("#currPage").val())+1;a.startPrice=Number($("#startPrice").val());a.endPrice=Number($("#endPrice").val());a.desc=$("#goodsOrderby").val();a.descType=$("#goodsOrder").val();$.post(WST.U("WebApp/Shops/getShopGoodsList"),a,function(b){var e=WST.toJson(b);var f="";if(e&&e.root&&e.root.length>0){for(var c=0;c<e.root.length;c++){f+='<div class="am-g goods">';f+='<a href="javascript:void(0);" onclick="javascript:goToGoodsDetails('+e.root[c].goodsId+');">';f+='<div class="am-u-sm-3 wst-goodsimage-area"><img src="'+WST.DEFAULT_IMG+'" data-echo="'+WST.ROOT+"/"+e.root[c].goodsThums+'" class="wst-goodsimage"></div></a>';f+='<div class="am-u-sm-9">';f+='<a href="javascript:void(0);" onclick="javascript:goToGoodsDetails('+e.root[c].goodsId+');">';f+='<span class="wst-goodsname">'+e.root[c].goodsName+"</span></a>";f+='<div class="am-g goodsname-bottom">';f+='<a href="javascript:void(0);" onclick="javascript:goToGoodsDetails('+e.root[c].goodsId+');">';f+='<div class="am-u-sm-8">';for(var d=1;d<6;d++){if(d<=e.root[c].score){f+='<img src="'+WST.ROOT+'/Apps/WebApp/View/default/images/1star.png" class="goods-star">'}else{f+='<img src="'+WST.ROOT+'/Apps/WebApp/View/default/images/gray_star.png" class="goods-star">'}}f+='<br><span class="wst-price">￥'+e.root[c].shopPrice+"</span>";f+='</div></a><div class="am-u-sm-4" style="text-align:right;margin-top:5px;">';f+='<img src="'+WST.ROOT+'/Apps/WebApp/View/default/images/car.png" class="goodlist-cart" onclick="javascript:addGoodsCart('+e.root[c].goodsId+","+e.root[c].goodsAttrId+');">';f+="</div></div></div></div>"}$("#currPage").val(e.currPage);$("#totalPage").val(e.totalPage)}else{f+='<div class="am-g list-empty" style="top:370px;">';f+='<div class="am-u-sm-12 am-u-sm-centered" style="text-align:center;">';f+='<span class="list-empty-tips">对不起，没有相关商品。</span>';f+="</div>";f+="</div>"}$("#goods-list").append(f);loading=false;$("#loading-icon").hide();echo.init()})}var currPage=totalPage=0;var loading=false;$(document).ready(function(){initFooter("home");getGoodsList();$("#shop-search").click(function(){var a=$("#price1").val();var b=$("#price2").val();if(a==""||a<0){wstMsg("请输入正确的价格");$("#price1").focus();return false}if(b==""||b<0){wstMsg("请输入正确的价格");$("#price2").focus();return false}if(Number(a)>Number(b)){wstMsg("请输入正确的价格");$("#price2").focus();return false}$("#startPrice").val(a);$("#endPrice").val(b);$("#currPage").val("0");$("#goods-list").html("");getGoodsList()});$(window).scroll(function(){if(loading){return}if((5+$(window).scrollTop())>=($(document).height()-$(window).height())){currPage=Number($("#currPage").val());totalPage=Number($("#totalPage").val());if(totalPage>0&&currPage<totalPage){getGoodsList()}}})});