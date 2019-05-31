/**
 * 校验身份证号，按照身份证编码组成规则，
 * 真的100%能过，假的筛选度达90%
 * @author benboerba
 * @date   2019-05-31
 */
;(function($){
	function CheckCard(value){
		this.provice={"11" : "北京","12" : "天津","13" : "河北","14" : "山西","15" : "内蒙古","21" : "辽宁","22" : "吉林","23" : "黑龙江",
					"31" : "上海","32" : "江苏","33" : "浙江","34" : "安徽","35" : "福建","36" : "江西","37" : "山东","41" : "河南",
					"42" : "湖北","43" : "湖南","44" : "广东","45" : "广西","46" : "海南","50" : "重庆","51" : "四川","52" : "贵州",
					"53" : "云南","54" : "西藏","61" : "陕西","62" : "甘肃","63" : "青海","64" : "宁夏","65" : "新疆","71" : "台湾",
					"81" : "香港","82" : "澳门","91" : "国外"};
		this.ValCodeArr = [ "1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2" ];
		this.Wi = [ "7", "9", "10", "5", "8", "4", "2", "1", "6", "3", "7", "9","10", "5", "8", "4", "2" ];
		this.val=value;
	}
	/**
	 * 验证日期字符串是否是YYYY-MM-DD格式
	 * 此正则已对年月日进行校验，包括每月天数差别（28、29、30、31）,及平年闰年
	 */

	CheckCard.prototype.isDataFormat= function(str) {
		var flag = false;
		var regxStr = "^((\\d{2}(([02468][048])|([13579][26]))[\\-\\/\\s]?((((0?[13578])|(1[02]))"
				+ "[\\-\\/\\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\\-\\/\\s]?"
				+ "((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\\-\\/\\s]?((0?[1-9])|([1-2][0-9])))))|("
				+ "\\d{2}(([02468][1235679])|([13579][01345789]))[\\-\\/\\s]?((((0?[13578])|(1[02]"
				+ "))[\\-\\/\\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\\-\\/\\s]?"
				+ "((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\\-\\/\\s]?((0?[1-9])|(1[0-9])|(2[0-8]))))"
				+ "))(\\s(((0?[0-9])|([1-2][0-3]))\\:([0-5]?[0-9])((\\s)|(\\:([0-5]?[0-9])))))?$";
		var regexp = new RegExp(regxStr);
		if (regexp.test(str)) {
			flag = true;
		}
		return flag;
	};

	CheckCard.prototype.check=function(){
		var cardNo = this.val;
		if (!cardNo) return false;

		cardNo=cardNo.toUpperCase();
		var Ai = "";
		var length = cardNo.length;

		// ================ 号码的长度 15位或18位 ================
		if (cardNo.length != 15 && cardNo.length != 18) return false;

		// ================ 临时操作身份证号 ================
		if (cardNo.length == 18) {
			Ai = cardNo;
		} else if (cardNo.length == 15) {
			Ai = cardNo.substring(0, 6) + "19" + cardNo.substring(6, 15);
		}

		//判断,如果输入的身份证号..如果最后一位是x或者X全部改为X
		cardNo = cardNo.toUpperCase();

		// ================ 18位除最后以为都为数字;15位全部是数字 ================
		if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(cardNo))) return false;

		// ================ 出生年月是否有效 ================
		var strYear = Ai.substring(6, 10); // 年份
		var strMonth = Ai.substring(10, 12); // 月份
		var strDay = Ai.substring(12, 14); // 月份
		if (!this.isDataFormat(strYear + "-" + strMonth + "-" + strDay)) return false;

		var nowDate = new Date();
		var cardDate = new Date(strYear + "-" + strMonth + "-" + strDay);
		var currentAge = nowDate.getFullYear() - cardDate.getFullYear();
		var timeDiffer = nowDate.getTime() - cardDate.getTime();
		// ================ 如果出生年份与现在相差大于150年 
		// 或者生日晚于当前时间 则不在有效范围 ================
		if (currentAge > 150 || timeDiffer < 0) return false;

		// ================ 地区码是否有效 ================
		if (this.provice[Ai.substring(0, 2)] == null) return false;

		// ================ 判断最后一位的值 ================
		var TotalmulAiWi = 0;
		for ( var i = 0; i < 17; i++) {
			TotalmulAiWi = TotalmulAiWi + parseInt(Ai.charAt(i)) * parseInt(this.Wi[i]);
		}
		var modValue = TotalmulAiWi % 11;
		if (cardNo.length == 18 && cardNo.charAt(17) != this.ValCodeArr[modValue]) return false;

		return true;
	}

	$.extend({
	    checkCard: function(id) {
	        var cc=new CheckCard($("#"+id).val())
	         return cc.check();
	    }
	})
}(jQuery));