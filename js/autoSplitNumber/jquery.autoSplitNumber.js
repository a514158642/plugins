/**
 * 输入数字实现自动分位，银行卡、手机号、金额
 * @author benboerba 2019-03-01
 * @param  num 自动分位位数
 * @function  $.fn.autoSplitNumber
 */
;(function($){
	/**
	 * 初始化对象函数
	 * @author benboerba 2019-03-01
	 * @param {[type]} num  分位位数
	 * @param {[type]} el  当前input对象
	 */
	function autoSplitNumber(num,el){
		this.num=num;
		this.el=el;
	};
	/**
	 * 设置对象属性
	 * @type {Object}
	 */
	autoSplitNumber.prototype={
		/**
		 * 设置光标位置
		 * @author benboerba 2019-03-01
		 * @param {[type]} pos
		 */
		setCaretPosition:function(pos){
			var textDom=this.el[0];
			if(textDom.setSelectionRange) {
		        // IE Support
		        textDom.focus();
		        textDom.setSelectionRange(pos, pos);
		    }else if (textDom.createTextRange) {
		        // Firefox support
		        var range = textDom.createTextRange();
		        range.collapse(true);
		        range.moveEnd('character', pos);
		        range.moveStart('character', pos);
		        range.select();
		    }
		},
		/**
		 * 获取光标位置
		 * @author benboerba 2019-03-01
		 * @return {[type]}
		 */
		getCursortPosition:function(){
			var cursorPos = 0;
			var textDom=this.el[0];
			if (document.selection) {
		        // IE Support
		        textDom.focus ();
		        var selectRange = document.selection.createRange();
		        selectRange.moveStart ('character', -textDom.value.length);
		        cursorPos = selectRange.text.length;
		    }else if (textDom.selectionStart || textDom.selectionStart == '0') {
			    // Firefox support
			    cursorPos = textDom.selectionStart;
			}
			return cursorPos;
		},
		/**
		 * 设置input值
		 * @author benboerba 2019-03-01
		 */
		setValue:function(){
			var $this=this;
			var $el=$this.el;
			var num=$this.num||4;
			var currValue=$el.val();
			if(!currValue) return false;

			var cursorIndex=$this.getCursortPosition();//获取当前光标位置
			currValue=currValue.replace(/\s/g, "");
			var tempValue="";
			for(var i=0;i<currValue.length;i++){
				if(i>0&&i%num==0){
					tempValue=tempValue+" "+currValue.charAt(i);
				}else{
					tempValue=tempValue+currValue.charAt(i);
				}
			}
			var code = event.keyCode || event.which;
			var newIndex=cursorIndex;
			//这段代码如果看不懂  就努力的看
			if(cursorIndex%(num+1)==0&&code!=37&&code!=39){
				if(code==8){
					newIndex=cursorIndex-1;
				}else{
					newIndex=cursorIndex+1;
				}
			};
			$el.val(tempValue);
	        $this.setCaretPosition(newIndex);//设置光标位置
	    }
	};
	$.fn.autoSplitNumber=function(num){
		var $el=this;
		var as=new autoSplitNumber(num,$el);
		$el.keyup(function(){
			as.setValue();
		});
	};

}(jQuery));
